// ==UserScript==
// @name         iStock_AcronymReplace
// @namespace    TornExtensions
// @version      1.11
// @description  none
// @match        https://www.torn.com/page.php?sid=stocks*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.iStock_AcronymReplace) return;
        __win.iStock_AcronymReplace = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }

    const $ = window.jQuery;
    const stocks = {
        "1": {
            "name": "Torn & Shanghai Banking",
            "acronym": "TSB"
        },
        "2": {
            "name": "Torn City Investments",
            "acronym": "TCI"
        },
        "3": {
            "name": "Syscore MFG",
            "acronym": "SYS"
        },
        "4": {
            "name": "Legal Authorities Group",
            "acronym": "LAG"
        },
        "5": {
            "name": "Insured On Us",
            "acronym": "IOU"
        },
        "6": {
            "name": "Grain",
            "acronym": "GRN"
        },
        "7": {
            "name": "Torn City Health Service",
            "acronym": "THS"
        },
        "8": {
            "name": "Yazoo",
            "acronym": "YAZ"
        },
        "9": {
            "name": "The Torn City Times",
            "acronym": "TCT"
        },
        "10": {
            "name": "Crude & Co",
            "acronym": "CNC"
        },
        "11": {
            "name": "Messaging Inc.",
            "acronym": "MSG"
        },
        "12": {
            "name": "TC Music Industries",
            "acronym": "TMI"
        },
        "13": {
            "name": "TC Media Productions",
            "acronym": "TCP"
        },
        "14": {
            "name": "I Industries Ltd.",
            "acronym": "IIL"
        },
        "15": {
            "name": "Feathery Hotels Group",
            "acronym": "FHG"
        },
        "16": {
            "name": "Symbiotic Ltd.",
            "acronym": "SYM"
        },
        "17": {
            "name": "Lucky Shots Casino",
            "acronym": "LSC"
        },
        "18": {
            "name": "Performance Ribaldry",
            "acronym": "PRN"
        },
        "19": {
            "name": "Eaglewood Mercenary",
            "acronym": "EWM"
        },
        "20": {
            "name": "Torn City Motors",
            "acronym": "TCM"
        },
        "21": {
            "name": "Empty Lunchbox Traders",
            "acronym": "ELT"
        },
        "22": {
            "name": "Home Retail Group",
            "acronym": "HRG"
        },
        "23": {
            "name": "Tell Group Plc.",
            "acronym": "TGP"
        },
        "24": {
            "name": "Munster Beverage Corp.",
            "acronym": "MUN"
        },
        "25": {
            "name": "West Side University",
            "acronym": "WSU"
        },
        "26": {
            "name": "International School TC",
            "acronym": "IST"
        },
        "27": {
            "name": "Big Al's Gun Shop",
            "acronym": "BAG"
        },
        "28": {
            "name": "Evil Ducks Candy Corp",
            "acronym": "EVL"
        },
        "29": {
            "name": "Mc Smoogle Corp",
            "acronym": "MCS"
        },
        "30": {
            "name": "Wind Lines Travel",
            "acronym": "WLT"
        },
        "31": {
            "name": "Torn City Clothing",
            "acronym": "TCC"
        },
        "32": {
            "name": "Alcoholics Synonymous",
            "acronym": "ASS"
        }
    };

    const replaceInterval = setInterval(function() {
        let cnt = 0;
        $(".mir-stock-acronym").remove();

        $("[class^='stock___'] [class^='nameContainer___']").parent().siblings("[class^='stockOwned___']").css("position", "relative")
        $("[class^='stock___'] [class^='nameContainer___']").each(function(idx, element){
            let sid = $(element).parent().parent().attr("id").toString();
            if (stocks.hasOwnProperty(sid)) {
                console.log(sid, stocks[sid])
                let acronym = stocks[sid].acronym;
                $(element).parent().siblings("[class^='stockOwned___']")[0].innerHTML += `<div class="mir-stock-acronym" style="position: absolute; left: 0; padding-left: 5px; color: #6cc1f6">${acronym}</div>`;
                cnt ++;
            }
        });
        if (cnt == Object.keys(stocks).length) {
            clearInterval(replaceInterval);
            console.log("Acronym replace done.")
        }
    }, 500);
})

();