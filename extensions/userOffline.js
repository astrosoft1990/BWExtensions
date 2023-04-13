// ==UserScript==
// @name         userOffline
// @namespace    TornExtensions
// @version      1.0.0
// @description  
// @author       TianpengMarshal [2704118]
// @match        https://www.torn.com/personalstats.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// ==/UserScript==

(function () {
    'use strict';
    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.iTravel) return;
        __win.iTravel = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }
    const $ = window.jQuery;
    let button = $(`<button type='button'>获取离线记录</button>`);

    button.click(() => {
        let idParams = getQueryString('ID');
        if (!idParams) {
            return false;
        }
        let userIDs = idParams.split(',');
        userIDs = userIDs.map((v) => {
            return parseInt(v);
        });
        getUsersActive(userIDs);
    });
    $('.selectUsersCont___bxLyQ').append(button);
    function getUsersActive(userIDs) {
        let fromDate = moment().subtract(1, 'years').format('YYYY-MM-DD');
        let data = {
            step: 'getGraphData',
            userIDs: userIDs,
            from: fromDate,
            statNames: ["useractivity"]
        };
        $.ajax({
            type: 'POST',
            url: '/personalstats.php',
            data: JSON.stringify(data),
            method: "post",
            dataType: "json",
            contentType: 'application/json',
            success: function (data) {
                displayUser(data);
            }
        });
    }
    function displayUser(data) {
        let table = $(`<div class="stats____t5R0" id="tbl">
        <div class="categoriesValues___FUYbU">
        <div class="scrollArea___X8vGL">
        <div class="category___SvKG6">
        <div class="title___IDdOX titles___q7l6B">
        <div class="titleItem___DCkB3 statName___eUnMx">用户</div>
        <div class="titleItem___DCkB3 statName___eUnMx">离线记录</div>
        </div>
        <div class="statRows___nxIDS"></div>
        </div></div></div></div>`);
        for (let v of data.data.useractivity) {
            let uid = v.uid;
            let offline = [];
            let records = v.data;
            records.splice(0, 1);
            records.splice(records.length - 1, 1);
            records = records.reverse();
            let lastTime = moment.unix(records[0].time);
            for (let record of records) {
                let time = moment.unix(record.time);
                if (time.clone().add(24, 'hours') < lastTime) {
                    let offTime = lastTime.diff(time, 'days', true);
                    let log = `${time.format('YYYY-MM-DD')}离线${offTime - 1}-${offTime}天`;
                    offline.push(log);
                }
                lastTime = time;
            }
            let row = `<div class="statRow___oQf7N"><div class="statName___eUnMx chartAvailable___E0Tku">${uid}</div><div class="statValue___nd11v worse___aEU8X chartAvailable___E0Tku">`;
            for (let log of offline) {
                row += `<p>${log}</p>`;
            }
            row += `</div></div>`;
            $('.statRows___nxIDS', table).append($(row));
        }
        if ($('#tbl')) {
            $('#tbl').remove();
        }
        $('.selectUsersCont___bxLyQ').after(table);
    }
    function getQueryString(name) {
        let query = window.location.search.substr(1).split('&');
        for (let str of query) {
            if (str.indexOf('=') > 0) {
                let arr = str.split('=');
                if (arr[0].toLowerCase() == name.toLowerCase()) {
                    return decodeURIComponent(arr[1]);
                    break;
                }
            }
        }
        return null;
    }
})();