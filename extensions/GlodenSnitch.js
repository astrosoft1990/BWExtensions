// ==UserScript==
// @name         Golden Snitch [接机小助手 油猴特供]
// @namespace    SMTH
// @version      自动更新版V2
// @description  mug你想mug
// @author       Mirrorhye
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function gsp_getValue(key, default_value) {
        let val = window.localStorage.getItem(key);
        if (val === undefined || val === null) {
            return default_value;
        }
        try {
            val = JSON.parse(val);
            if (val == '[]') {
                val = []
            }
            return val;
        } catch (err) {
            console.log(err);
            return val;
        }
    }

    function gsp_setValue(key, val) {
        return window.localStorage.setItem(key, JSON.stringify(val));
    }

    function updateVersion() {
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://gitee.com/ameto_kasao/tornjs/raw/master/GoldenSnitch.js?'+(+new Date()),
            onload: (res) => {
                gsp_setValue('gsp_lastUpdatedVersionTimestamp', new Date().getTime());
                gsp_setValue('gsp_lastUpdatedVersionJS', res.responseText);
            }
        });
    }


    let lastUpdatedVersionTimestamp = gsp_getValue('gsp_lastUpdatedVersionTimestamp', 0);
    try {
        if (new Date().getTime() - lastUpdatedVersionTimestamp > 10*60*1000) {
            updateVersion();
        }
        let lastUpdatedVersionJS = gsp_getValue('gsp_lastUpdatedVersionJS', 'console.log("尚未加载到js")');
        eval(lastUpdatedVersionJS);
    } catch (err) {
        console.log(err);
        updateVersion();
    }
})();