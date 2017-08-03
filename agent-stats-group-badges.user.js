// ==UserScript==
// @name        Agent Stats Group Badges
// @namespace   https://github.com/Valenski/monkey
// @version     0.1.201708030813
// @description Colorize group view cells in Agent Stats based on related badges.
// @include     *://www.agent-stats.com/groups.php*
// @match       *://www.agent-stats.com/groups.php*
// @grant       none
// @copyright   2015+, Finntaur; 2017+ Valenski
// @require     http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var colors = new Array("#511d06", "#364142", "#744d22", "#282828", "#000000");
var requirements = [
    [100, 1000, 2000, 10000, 30000], // Explorer
    [10, 50, 200, 500, 5000], // Seer
    [100, 750, 2500, 5000, 10000], // Recon
    [10, 100, 300, 1000, 2500], // Trekker
    [2000, 10000, 30000, 100000, 200000], // Builder
    [50, 1000, 5000, 25000, 100000], // Connector
    [100, 500, 2000, 10000, 40000], // Mind-Controller
    [5000, 50000, 250000, 1000000, 4000000], // Illuminator
    [100000, 1000000, 3000000, 10000000, 25000000], // Recharger
    [100, 1000, 5000, 15000, 40000], // Liberator
    [20, 200, 1000, 5000, 20000], // Pioneer
    [150, 1500, 5000, 20000, 50000], // Engineer
    [2000, 10000, 30000, 100000, 300000], // Purifier
    [3, 10, 20, 90, 150], // Guardian
    [5, 25, 100, 200, 500], // SpecOps
    [1, 3, 6, 10, 20], // Mission Day
    [2000, 10000, 30000, 100000, 200000], // Hacker
    [200, 2000, 6000, 20000, 50000], // Translator
    [15, 30, 60, 180, 360], // Sojourner
    [2, 10, 25, 50, 100] // Recruiter
];

var requirements2 = [
    [100, 1000, 2000, 10000, 30000], // Explorer
    [10, 50, 200, 500, 5000], // Seer
    [100000, 1000000, 10000000, 100000000, 200000000], // Collector
    [100, 750, 2500, 5000, 10000], // Recon
    [10, 100, 300, 1000, 2500], // Trekker
    [2000, 10000, 30000, 100000, 200000], // Builder
    [50, 1000, 5000, 25000, 100000], // Connector
    [100, 500, 2000, 10000, 40000], // Mind-Controller
    [5000, 50000, 250000, 1000000, 4000000], // Illuminator
    [10, 200, 800, 1300, 1800], // Binder
    [5000, 30000, 100000, 1000000, 5000000], // Country-Master
    [100000, 1000000, 3000000, 10000000, 25000000], // Recharger
    [100, 1000, 5000, 15000, 40000], // Liberator
    [20, 200, 1000, 5000, 20000], // Pioneer
    [150, 1500, 5000, 20000, 50000], // Engineer
    [2000, 10000, 30000, 100000, 300000], // Purifier
    [100, 1000, 5000, 25000, 100000], // Neutralizer
    [50, 1000, 5000, 25000, 100000], // Disruptor
    [100, 500, 2000, 10000, 40000], // Salvator
    [3, 10, 20, 90, 150], // Guardian
    [1, 5, 10, 45, 75], // Smuggler
    [1, 10, 50, 200, 1000], // Link-Master
    [1, 3, 8, 30, 50], // Controller
    [5000, 40000, 150000, 400000, 1000000], // Field-Master
    [5, 25, 100, 200, 500], // SpecOps
    [1, 3, 6, 10, 20], // Mission Day
    [2000, 10000, 30000, 100000, 200000], // Hacker
    [200, 2000, 6000, 20000, 50000], // Translator
    [15, 30, 60, 180, 360], // Sojourner
    [2, 10, 25, 50, 100] // Recruiter
];

var checkBoxStatus = document.getElementsByName('additional')[0].checked;

if (checkBoxStatus === false) {
$("#group > tbody > tr").each(function(i, tr){
    $("td", tr).each(function(j, td){
        if ( 4 <= j && j <= 22 ) {
            var value = parseInt($(td).html().replace(/,/g, ""));
            var color = "";
            for ( var k = 4 ; 0 <= k ; k-- ) {
                if ( requirements[j-4][k] <= value ) {
                    color = colors[k];
                    break;
                }
            }
            if ( "" === color ) {
                $(td).css("background", "repeating-linear-gradient(-45deg, #000000, #000000 5px, #002d2b 5px, #002d2b 10px)");
            } else {
                $(td).css("background-color", color);
            }
        }
    });
});
} else if (checkBoxStatus === true) {
$("#group > tbody > tr").each(function(i, tr){
    $("td", tr).each(function(j, td){
        if ( 4 <= j && j <= 33 ) {
            console.log("true");
            var value2 = parseInt($(td).html().replace(/,/g, ""));
            var color2 = "";
            for ( var l = 4 ; 0 <= l ; l-- ) {
                if ( requirements2[j-4][l] <= value2 ) {
                    color2 = colors[l];
                    break;
                }
            }
            if ( "" === color2 ) {
                $(td).css("background", "repeating-linear-gradient(-45deg, #000000, #000000 5px, #002d2b 5px, #002d2b 10px)");
            } else {
                $(td).css("background-color", color2);
            }
        }
    });
});
}
