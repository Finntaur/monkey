// ==UserScript==
// @name       Ingress OPR Extra Maps
// @namespace  https://github.com/finntaur/monkey
// @version    0.201705122200
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
    window.plugin.extraMaps.OSM_ZOOM_LEVEL = 14;
    window.plugin.extraMaps.MAANMITTAUSLAITOS_ENABLED = false;
    window.plugin.extraMaps.DEBUG = true;

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

    // Formulate the URL for given coordinates for Maanmittauslaitos.
    window.plugin.extraMaps.getMMLURL = function(coords) {

        // TODO: Coordinate transformation, or preferably how to force feed current coordinates.
        return "";

    };

    // Refresh all Extra Maps URLs.
    window.plugin.extraMaps.refreshURLs = function() {

        if ( window.plugin.extraMaps.DEBUG ) console.log("Refreshing URLs.");
        var coords = window.plugin.extraMaps.extractCoordinates();
        if ( window.plugin.extraMaps.OSM_ENABLED ) $("#extraMapsOSMURL").attr("href", window.plugin.extraMaps.getOSMURL(coords));
        if ( window.plugin.extraMaps.MAANMITTAUSLAITOS_ENABLED ) $("#extraMapsMMLURL").attr("href", window.plugin.extraMaps.getMMLURL(coords));

    };

    // Setup this plugin, create links for extra maps and
    // initialize listeners.
    window.plugin.extraMaps.setup = function() {

        var div = $("#descriptionDiv");
        div.append("<br>");
        if ( window.plugin.extraMaps.OSM_ENABLED ) {
            div.append('[ <a id="extraMapsOSMURL" target="_blank" href="about:blank">OSM<sup>❐</sup></a> ]');
            $("#extraMapsOSMURL").mousedown(window.plugin.extraMaps.refreshURLs);
        }
        if ( window.plugin.extraMaps.MAANMITTAUSLAITOS_ENABLED ) {
            div.append('[ <a id="extraMapsMMLURL" target="_blank" href="about:blank">Maanmittauslaitos<sup>❐</sup></a> ]');
            $("#extraMapsMMLURL").mousedown(window.plugin.extraMaps.refreshURLs);
        }

    };

} // wrapper end
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

window.plugin.extraMaps.setup();
if ( window.plugin.extraMaps.DEBUG ) console.log("Extra maps initialized.");
