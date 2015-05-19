// ==UserScript==
// @name       Agent Stats Badge Progress Bars
// @namespace  https://github.com/finntaur/monkey
// @version    0.1.201505190300
// @description  Create progress bars for badges in the default view.
// @include    https://www.agent-stats.com/
// @include    http://www.agent-stats.com/
// @include    https://www.agent-stats.com/index.php*
// @include    http://www.agent-stats.com/index.php*
// @match      https://www.agent-stats.com/
// @match      http://www.agent-stats.com/
// @match      https://www.agent-stats.com/index.php*
// @match      http://www.agent-stats.com/index.php*
// @grant      none
// @copyright  2015+, Finntaur
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var requirements = [
    [100, 1000, 2000, 10000, 30000], // Explorer
    [10, 50, 200, 500, 5000], // Seer
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
    [2000, 10000, 30000, 100000, 200000], // Hacker
    [200, 2000, 6000, 20000, 50000], // Translator
    [15, 30, 60, 180, 360], // Sojourner
    [2, 10, 25, 50, 100] // Recruiter

];

if ( $("tr.rotate").size() == 0 ) { $("#predictionTable > tbody:eq(0) > tr").each(function(i, tr){
    var td = $("td:eq(4)", tr);
    var color = "#fdd73c";
    var value = parseInt(td.html().replace(/,/g, ""));
    var progress = 0;
    for ( var j = 0 ; j < 5 ; j++ ) {
        progress = value * 100 / requirements[i][j];
        if ( progress < 100 ) { break; }
    }
    if ( 100 < progress ) { progress = 100; }
    var progressBar = '<div style="border: 1px solid ' + color + '; width: 102px; height: 7px; margin: 2px 0px; padding: 0px;">' +
        '<div style="border: 0px solid black; width: ' + progress + 'px; height: 5px; margin: 0px; padding: 0px; background-color: ' + color + ';"></div></div>';
    td.append(progressBar);
});}
