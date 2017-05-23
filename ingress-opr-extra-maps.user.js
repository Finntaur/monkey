// ==UserScript==
// @name       Ingress OPR Extra Maps
// @namespace  https://github.com/finntaur/monkey
// @version    0.201705231650
// @description  Add extra map links to the portal candidate.
// @include    https://opr.ingress.com/recon
// @include    http://opr.ingress.com/recon
// @match      https://opr.ingress.com/recon
// @match      http://opr.ingress.com/recon
// @grant      none
// @copyright  2017+, Finntaur
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

function wrapper() {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    window.plugin.extraMaps = function() {};

    // SETTINGS
    // ------------------------------------------------------------------------

    window.plugin.extraMaps.OSM_ENABLED = true;
    window.plugin.extraMaps.OSM_ZOOM_LEVEL = 16;
    window.plugin.extraMaps.MAANMITTAUSLAITOS_ENABLED = true;
    window.plugin.extraMaps.INTEL_ENABLED = true;
    window.plugin.extraMaps.INTEL_ZOOM_LEVEL = 17;
    window.plugin.extraMaps.DEBUG = false;

    // ------------------------------------------------------------------------
    // END SETTINGS

    window.plugin.extraMaps.anchor = null;

    // Find the anchor element that holds the gmaps uri.
    window.plugin.extraMaps.findAnchor = function() {

        var a = null;
        var alist = $("#descriptionDiv").find("a");
        var regexp = /^https?:\/\/maps\.google\./i;
        alist.each(function(i){
            var href = $(this).attr("href");
            if ( regexp.test(href) ) {
                if ( window.plugin.extraMaps.DEBUG ) console.log("Anchor found.");
                a = $(this);
            }
        });
        window.plugin.extraMaps.anchor = a;
        return a;

    };

    // Extract coordinates from the gmaps uri.
    window.plugin.extraMaps.extractCoordinates = function() {

        var coords = null;
        if ( null === window.plugin.extraMaps.anchor ) window.plugin.extraMaps.findAnchor();

        try {
            var href = window.plugin.extraMaps.anchor.attr("href");
            if ( window.plugin.extraMaps.DEBUG ) console.log(href);
            coords = {};
            coords.lat = href.split("@")[1].split(",")[0];
            coords.lon = href.split("@")[1].split(",")[1];

            if ( null === coords || "" === coords.lat || "" === coords.lon  ) throw "Portal data unavailable.";
            if ( window.plugin.extraMaps.DEBUG ) console.log("Portal candidate location: Latitude = " + coords.lat + ", Longitude = " + coords.lon);

        } catch(err) {
            if ( window.plugin.extraMaps.DEBUG ) console.log(err);
            coords = null;
        }
        return coords;

    };

    // Formulate the URL for given coordinates for OpenStreetMap.org
    window.plugin.extraMaps.getOSMURL = function(coords) {

        return "https://www.openstreetmap.org/?mlat=" + coords.lat + "&mlon=" + coords.lon +
            "#map=" + window.plugin.extraMaps.OSM_ZOOM_LEVEL +
            "/" + coords.lat + "/" + coords.lon;

    };

    // Simple check whether or not the target is in Finland.
    window.plugin.extraMaps.isFinnishTarget = function() {

        if ( null === window.plugin.extraMaps.anchor ) window.plugin.extraMaps.findAnchor();
        var regexp = / (Finland|Suomi)$/;
        return regexp.test(window.plugin.extraMaps.anchor.text().trim());

    };

    // Formulate the URL for given coordinates for Maanmittauslaitos.
    window.plugin.extraMaps.getMMLURL = function(coords) {

        // The marker may be pointed to a slightly different position on the map
        // due to different coordinate systems.
        // TODO: Verify the accuracy or figure out a better way to link to these maps.
        return "http://kansalaisen.karttapaikka.fi/linkki?y=" + coords.lon + "&x=" + coords.lat +
            "&srs=EPSG:4258&scale=2000";

    };

    // Formulate the URL for given coordinates for standard Ingress intel.
    window.plugin.extraMaps.getIntelURL = function(coords) {

        return "https://www.ingress.com/intel?ll=" + coords.lat + "," + coords.lon +"&z=" + window.plugin.extraMaps.INTEL_ZOOM_LEVEL;

    };

    // Refresh all Extra Maps URLs.
    window.plugin.extraMaps.refreshURLs = function() {

        if ( window.plugin.extraMaps.DEBUG ) console.log("Refreshing URLs.");
        var coords = window.plugin.extraMaps.extractCoordinates();
        if ( window.plugin.extraMaps.OSM_ENABLED ) $("#extraMapsOSMURL").attr("href", window.plugin.extraMaps.getOSMURL(coords));
        if ( window.plugin.extraMaps.INTEL_ENABLED ) $("#extraMapsIntelURL").attr("href", window.plugin.extraMaps.getIntelURL(coords));
        if ( window.plugin.extraMaps.MAANMITTAUSLAITOS_ENABLED ) {
            if ( window.plugin.extraMaps.isFinnishTarget() ) {
                $("#extraMapsMMLURL").attr("href", window.plugin.extraMaps.getMMLURL(coords));
            } else {
                $("#extraMapsMMLURL").attr("href", "javascript:void(0);");
            }
        }
    };

    // Setup this plugin, create links for extra maps and
    // initialize listeners.
    window.plugin.extraMaps.setup = function() {

        var astyle    = 'color: #55efec; font-weight: bold;';
        var abbrstyle = 'border-bottom: 0px none black; text-decoration: none;';
        var aprops = ' class="extraMaps" target="_blank" href="about:blank" tabindex="-1" style="' + astyle + '"';
        var icon = "<sup>❐</sup>";
        var div = $("#descriptionDiv");
        div.append("<br>");
        if ( window.plugin.extraMaps.OSM_ENABLED ) {
            div.append('[ <a id="extraMapsOSMURL"' + aprops + '><abbr style="' + abbrstyle + '" title="OpenStreetMap">OSM</abbr>' + icon + '</a> ]');
            $("#extraMapsOSMURL").mousedown(window.plugin.extraMaps.refreshURLs);
        }
        if ( window.plugin.extraMaps.MAANMITTAUSLAITOS_ENABLED ) {
            div.append('[ <a id="extraMapsMMLURL"' + aprops + '><abbr style="' + abbrstyle + '" title="Maanmittauslaitos">MML</abbr>' + icon + '</a> ]');
            $("#extraMapsMMLURL").mousedown(window.plugin.extraMaps.refreshURLs);
        }
        if ( window.plugin.extraMaps.INTEL_ENABLED ) {
            div.append('[ <a id="extraMapsIntelURL"' + aprops + '>Intel' + icon + '</a> ]');
            $("#extraMapsIntelURL").mousedown(window.plugin.extraMaps.refreshURLs);
        }

    };

} // wrapper end
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

window.plugin.extraMaps.setup();
if ( window.plugin.extraMaps.DEBUG ) console.log("Extra maps initialized.");
