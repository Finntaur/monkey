// ==UserScript==
// @id             iitc-commfilter
// @name           IITC plugin: COMM Filter
// @category       Info
// @version        0.1.0.20161014.1255
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/Finntaur/monkey/raw/master/iitc-commfilter.meta.js
// @downloadURL    https://github.com/Finntaur/monkey/raw/master/iitc-commfilter.user.js
// @description    [commfilter-2016-09-12-111500] Filter COMM chat messages to hide unwanted content.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.commFilter = function() {};
window.plugin.commFilter.enabled = true;
window.plugin.commFilter.filters = [
    /^Agent_\d+$/,
    /xmps\.biz/i,
    /ingress\-store\.com/i,
    /ingressstore\.ru/i,
    /ingressfarm\.com/i,
    /shop-ingress\.com/i,
    /ingintems\.net/i
];
window.plugin.commFilter.addHooks = function() {
    addHook('publicChatDataAvailable' , window.plugin.commFilter.processChatData);
    addHook('factionChatDataAvailable' , window.plugin.commFilter.processChatData);
};

window.plugin.commFilter.toggleFiltering = function() {
    window.plugin.commFilter.enabled = !window.plugin.commFilter.enabled;
    console.log("COMM Filtering " + ( window.plugin.commFilter.enabled ? "ENABLED" : "DISABLED" ));
    window.plugin.commFilter.setTogglerStyle();
};

window.plugin.commFilter.setTogglerStyle = function() {
    if ( window.plugin.commFilter.enabled ) {
        $("#commFilter").css("color", "#ffce00");
        $("#commFilter").css("font-weight", "bold");
    } else {
        $("#commFilter").css("color", "red");
        $("#commFilter").css("font-weight", "normal");
    }
};

window.plugin.commFilter.processChatData = function(data) {
//    console.log("Received chat data:");
//    console.log(data.processed);
    var i, j, re;
    var stack = [];
    var flag = false;
    for ( i in data.processed ) {
        for ( j in data.processed[i] ) {
            for ( re in window.plugin.commFilter.filters ) {
                if ( window.plugin.commFilter.filters[re].exec("" + data.processed[i][j]) ) {
                    flag = true;
                    stack.push(i);
                    break;
                }
            }
            if ( flag ) {
                flag = false;
                break;
            }
        }
    }
    if ( window.plugin.commFilter.enabled ) {
        console.log("COMM Filter: filtered " + stack.length + " messages.");
        for ( i in stack ) {
            delete data.processed[stack[i]];
        }
    } else {
        console.log("COMM Filter: matched " + stack.length + " messages.");
    }
};

var setup = function() {
    window.plugin.commFilter.addHooks();
    $("#toolbox").append(' <a onclick="window.plugin.commFilter.toggleFiltering();" title="COMM Filter" id="commFilter">COMM/F</a>');
    window.plugin.commFilter.setTogglerStyle();
};

// PLUGIN END //////////////////////////////////////////////////////////

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
