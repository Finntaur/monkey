// ==UserScript==
// @name       Ingress OPR Logger
// @namespace  https://github.com/finntaur/monkey
// @version    0.201705231750
// @description  Logs coordinates and names of portal candidates.
// @include    https://opr.ingress.com/recon
// @include    http://opr.ingress.com/recon
// @match      https://opr.ingress.com/recon
// @match      http://opr.ingress.com/recon
// @grant      none
// @copyright  2017+, Finntaur
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

function wrapper() {
    if ( typeof window.plugin !== 'function' ) window.plugin = function() {};

    window.plugin.logger = function() {};

    // SETTINGS
    // ------------------------------------------------------------------------

    window.plugin.logger.LOG_NUMBER_OF_STARS = true;
    window.plugin.logger.DEBUG = false;
    window.plugin.logger.AUTOLOAD_ALL_IMAGES = false;
    window.plugin.logger.MARKER_COLOR = "#55efec";

    // ------------------------------------------------------------------------
    // END SETTINGS

    // Extend standard String object with a hashCode method.
    String.prototype.hashCode = function() {
        var hash = 0;
        if ( this.length === 0 ) return hash;
        for ( var i = 0; i < this.length; i++ ) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    window.plugin.logger.currentId = null;
    window.plugin.logger.imgEl = null;
    window.plugin.logger.locationEl = null;
    window.plugin.logger.titleEl = null;

    // Find the location elements that hold the gmaps uri and the title.
    window.plugin.logger.findContainers = function() {

        var alist = $("#descriptionDiv").find("a");
        var titleRegexp    = /^https?:\/\/www\.google\.[a-z]+\/search/i;
        var locationRegexp = /^https?:\/\/maps\.google\./i;
        alist.each(function(i) {
            var href = $(this).attr("href");
            if ( locationRegexp.test(href) ) {
                if ( window.plugin.logger.DEBUG ) console.log("Location element found.");
                window.plugin.logger.locationEl = $(this);
            }
            if ( titleRegexp.test(href) ) {
                if ( window.plugin.logger.DEBUG ) console.log("Title element found.");
                window.plugin.logger.titleEl = $(this);
            }
        });
        window.plugin.logger.imgEl = $("div.ingress-background img")[0];

    };

    // How many stars are currently being given to the candidate.
    window.plugin.logger.updateStars = function(id) {

        if ( null === id || false === window.plugin.logger.LOG_NUMBER_OF_STARS ) return;
        var stars = $("button[ng-model='answerCtrl.formData.quality']").find(".gold").length;
        var item = JSON.parse(localStorage.getItem(id));
        item.stars = stars;
        var str = JSON.stringify(item);
        if ( window.plugin.logger.DEBUG ) console.log("Updating: " + str);
        localStorage.setItem(id, str);

    };

    // Extract portal candidate details.
    window.plugin.logger.extractDetails = function() {

        var details = {};
        details.id = 0;
        details.image = null;
        details.title = null;
        details.latitude = null;
        details.longitude = null;

        if ( null === window.plugin.logger.locationEl ||
            null === window.plugin.logger.titleEl ||
            null === window.plugin.logger.imgEl )
            window.plugin.logger.findContainers();

        try {
            details.title = window.plugin.logger.titleEl.text().trim();
            details.image = window.plugin.logger.imgEl.src;
            details.id = details.image.split("/").slice(-1)[0].hashCode();

            var href = window.plugin.logger.locationEl.attr("href");
            // if ( window.plugin.logger.DEBUG ) console.log(href);
            details.latitude = href.split("@")[1].split(",")[0];
            details.longitude = href.split("@")[1].split(",")[1];

            if ( null === details.latitude || "" === details.latitude ||
                null === details.longitude || "" === details.longitude ||
                null === details.title || "" === details.title ||
                null === details.image || "" === details.image ||
                0 === details.id ) throw "Portal data unavailable.";

        } catch(err) {
            if ( window.plugin.logger.DEBUG ) console.log(err);
            details = null;
        }

        if ( window.plugin.logger.DEBUG ) console.log(details);
        return details;

    };

    // Display all logged entries.
    window.plugin.logger.display = function() {

        $("#logModal")[0].style.display = "block";
        var table = $("#logModalContent");
        table.html('<tr><th>Photo</th>' +
             ( window.plugin.logger.LOG_NUMBER_OF_STARS ? '<th><span class="glyphicon glyphicon-star gold"></span></th>' : '' ) +
             '<th>Title</th><th>Longitude</th><th>Latitude</th></tr>'
        );

        var iitcExport = "";
        var items = localStorage.length;
        for ( var i = 0; i < items; i++ ) {
            var item = JSON.parse(localStorage.getItem(localStorage.key(i)));
            if ( window.plugin.logger.DEBUG ) console.log(item);
            var image = '<img class="ingress-background" style="border: 0px none black; width: 42px; height: 42px; padding: 0px; margin: 0px;" ';
            if ( window.plugin.logger.AUTOLOAD_ALL_IMAGES ) {
                image += 'src="' + item.image + '"' + '>';
            } else {
                image += 'src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" ' +
                    'onclick="this.src = \'' + item.image + '\';"' + '>';
            }
            table.append(
                '<tr>' +
                '<td>' + image + '</td>' +
                ( window.plugin.logger.LOG_NUMBER_OF_STARS ? '<td>' + ( item.stars || 0 ) + '</td>' : '' ) +
                '<td>' + item.title + '</td>' +
                '<td>' + item.longitude + '</td>' +
                '<td>' + item.latitude + '</td>' +
                '</tr>'
            );
            iitcExport += '{"type":"marker","latLng":{"lat":' +
                item.latitude + ',"lng":' +
                item.longitude + '},"color":"' +
                window.plugin.logger.MARKER_COLOR + '"},';
        }

        $("#logModalExport").html("[" + iitcExport.slice(0, -1) + "]");

    };

    // Setup this plugin.
    window.plugin.logger.setup = function() {

        // Add means to access logs from the UI.
        $("ul.nav").append('<li><a class="brand" href="#" id="openLog">Log</a></li>');
        $("#openLog").click(window.plugin.logger.display);
        $("head").append(
            '<style>' +
            'tr { border: 0px none black; border-bottom: 1px solid #9d9d9d; }' +
            'th, td { padding: 2px 8px; }' +
            '</style>'
        );
        $("body").append(
            '<div id="logModal" style="background: black; margin: 0px; padding: 10px; border: 0px solid #ebbc4a; display: none; z-index: 5000; position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; max-height: 100%;">' +
            '<div style="margin: 16px; color: #9d9d9d; font-size: 18px; font-weight: bold;">' +
            '<span id="logModalCloseButton" style="margin: -16px; padding: 2px 16px; color: #55efec; float: right; font-size: 36px;">&times;</span>' +
            '<span>Your OPR Log (' + localStorage.length + ' entries)</span>' +
            '</div>' +
            '<div style="margin: 0px 16px;">' +
            '<span style="color: #9d9d9d">IITC Export:</span><br>' +
            '<textarea readonly id="logModalExport" style="margin: 16px 0px 0px 0px; padding: 4px; border: 2px solid #55efec; background: black; color: white; width: 100%; height: 50px;"></textarea>' +
            '</div>' +
            '<div style="margin: 16px;"><table id="logModalContent"></table></div>' +
            '</div>'
        );
        $("#logModalCloseButton").click(function() { $("#logModal")[0].style.display = "none"; });

        // Try to extract portal candidate details on every click until successful.
        $("body").click(function() {
            if ( null === window.plugin.logger.currentId ) {
                var details = window.plugin.logger.extractDetails();
                if ( null === details ) {
                    console.log("Could not extract and record portal data.");
                } else {
                    var id = details.id;
                    delete details.id;
                    if ( null === localStorage.getItem(id) ) {
                        var str = JSON.stringify(details);
                        if ( window.plugin.logger.DEBUG ) console.log("Appending: " + str);
                        localStorage.setItem(id, str);
                    } else {
                        if ( window.plugin.logger.DEBUG ) console.log("Object " + id + " already exists in OPR log.");
                    }
                    window.plugin.logger.currentId = id;
                }
            } else {
                if ( window.plugin.logger.DEBUG ) console.log("This candidate has already been logged.");
            }
            window.plugin.logger.updateStars(window.plugin.logger.currentId);
        });

    };

} // wrapper end
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

window.plugin.logger.setup();
if ( window.plugin.logger.DEBUG ) console.log("Logger initialized.");
