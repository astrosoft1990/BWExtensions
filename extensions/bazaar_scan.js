// ==UserScript==
// @name         BazaarScan
// @namespace    TornExtensions
// @version      2.0.11
// @description
// @author       guoguo
// @match        https://www.torn.com/*
//
// ==/UserScript==

(function() {
        'use strict';

        // avoid over loading in pda
        try {
            const __win = window.unsafeWindow || window;
            if (__win.BazaarScan) return;
            __win.BazaarScan = true;
            window = __win; // fix unsafeWindow
        } catch (err) {
            console.log(err);
        }

        // set/get
        function ext_getValue(key, default_value = null) {
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
                console.log(val);
                return val;
            }
        }

        function ext_setValue(key, val) {
            return window.localStorage.setItem(key, JSON.stringify(val));
        }

        function mlog(s) {
            console.log(`[扫货助手] ${s}`);
        }

        const $ = window.jQuery;

        let API_KEY = '*'
        if (API_KEY == '*') {
            API_KEY = localStorage.getItem("APIKey");
        }

        let watching = false;

        let watchLoop = ext_getValue("shzs-watch-loop", 30);
        let pointPrice = ext_getValue("shzs-pt-price", 0);
        let watchingItems = ext_getValue("shzs-watching-items", {
            "Xanax": {
                "price": 830000,
                "watched": true,
            }
        });
        let latestRefresh = ext_getValue('shzs-latest-refresh', 0);

        let tornItems = ext_getValue('shzs-tornItems', {});
        async function updateTornItems() {
            const res = await fetch(`https://api.torn.com/torn/?selections=items&key=${API_KEY}`);
            const fetchItems = (await res.json()).items;
            let dict = {};
            Object.keys(fetchItems).forEach((itemId) => {
                dict[fetchItems[itemId].name] = itemId;
            });
            ext_setValue('shzs-tornItems', dict);
            tornItems = ext_getValue('shzs-tornItems', {});
        }
        if (Object.keys(tornItems).length <= 0) {
            updateTornItems();
        }

        $("head").after(`
        <style>
        .shzs-pointer {
            cursor:pointer;
        }
        .shzs-working {
            animation:shzs-anim-spin 1000ms;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
        }
        @keyframes shzs-anim-spin {
            from {
                transform: rotate(0turn);
            }
            to {
                transform: rotate(1turn);
            }
        }
        .shzs-dropin {
            animation:shzs-anim-dropin 500ms;
            animation-iteration-count: 1;
            animation-timing-function: ease-in-out;
        }
        .shzs-dropout {
            animation:shzs-anim-dropout 500ms;
            animation-iteration-count: 1;
            animation-timing-function: ease-in-out;
        }
        @keyframes shzs-anim-dropin {
            from {
                transform: rotate(-30deg) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: rotate(0deg) translateY(0%);
                opacity: 1;
            }
        }
        @keyframes shzs-anim-dropout {
            from {
                transform: rotate(0deg) translateY(0%);
                opacity: 1;
            }
            to {
                transform: rotate(-30deg) translateY(-100%);
                opacity: 0;
            }
        }
        </style>
    `);

        function formatMoney(num) {
            return Number(num.replace(/\$|,/g, ''));
        }

        function formatMoney2(num) {
            return num.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) { return s + "," }).replace(/^[^\$]\S+/, function(s) { return s });
        }

        function formatNumber2(x) {
            if (x < 0) {
                return '-' + formatNumber2(-x);
            } else if (x == 0) {
                return '0';
            } else if (x <= 1) {
                return parseFloat((x * 100).toFixed(2)) + '%'
            } else if (x < 1e3) {
                return '' + parseInt(x);
            } else if (x >= 1e3 && x < 1e6) {
                return parseFloat((x / 1e3).toFixed(2)) + 'k';
            } else if (x >= 1e6 && x < 1e9) {
                return parseFloat((x / 1e6).toFixed(2)) + 'm';
            } else if (x >= 1e9 && x < 1e12) {
                return parseFloat((x / 1e9).toFixed(2)) + 'b';
            } else if (x >= 1e12 && x < 1e15) {
                return parseFloat((x / 1e12).toFixed(2)) + 't';
            } else if (x >= 1e15) {
                return "MAX";
            }
            return 'error';
        }

        async function fetchLowestPoint() {
            return fetch(`https://api.torn.com/market/?selections=pointsmarket&key=${API_KEY}`)
                .then((res) => res.json())
                .then((res) => {
                    let points = res.pointsmarket;
                    let lowest = null;
                    Object.keys(points).forEach((key) => {
                        let info = points[key];
                        let price = parseInt(info.cost);
                        if (!lowest || price < parseInt(lowest.cost)) {
                            lowest = info;
                        }
                    });
                    return lowest;
                })
                .catch(e => console.log("fetch error", e));
        }

        async function fetchLowestItem(itemName) {
            const itemId = tornItems[itemName];
            return fetch(`https://api.torn.com/market/${itemId}?selections=&key=${API_KEY}`)
                .then((res) => res.json())
                .then((res) => {
                    return res.bazaar[0];
                })
                .catch(e => console.log("fetch error", e));
        }

        // 状态栏图标
        $("[class^=status-icons]").prepend('<li id="shzs-icon-btn" class="icon6___SHZS" title="扫货助手" style="cursor: pointer; background-image:url(/images/v2/editor/emoticons.svg); background-position: -140px -42px;"></li>')
        $('#shzs-icon-btn').click(function() {
                    function makeWrapper() {
                        let wrapperHTML = `
            <div id="shzs-wrapper" style="width: inherit;">
                <div style="margin:10px; border:1px solid darkgray; font-size:14px; text-align:center;">
                    <div style="font-size:18px; font-weight: bold; margin:5px 0px;">扫货助手 - <button id="shzs-item-start" class="border-round shzs-pointer" style="height: 24px;padding: 2px 5px; margin:3px; background-color:#8fbc8f; color:white;">开始</button></div>
                    <div style="background-color: darkgray;height: 1px;"></div>
                    <div style="margin:5px 0px;">
                        监视间隔(s): </span><input id="shzs-watch-loop" type="text" class="border-round" style="height:20px; width:170px; margin: 0 5px; padding: 0 5px;" placeholder="${`当前: ${watchLoop}, 0为不监视`}">
                    </div>
                    <div style="background-color: darkgray;height: 1px;"></div>
                    <div style="margin:5px 0px;">
                        监视PT价格: </span><input id="shzs-pt-input" type="text" class="border-round shzs-price-input" style="height:20px; width:170px; margin: 0 5px; padding: 0 5px;" placeholder="${`当前: ${pointPrice}, 0为不监视`}">
                    </div>
                    <div style="background-color: darkgray;height: 1px;"></div>
                    <div style="margin:5px 0px;">
                        <input id="shzs-item-name" list="shzs-dl-tornitems" placeholder="商品名称" class="border-round" style="height:25px; width:125px; margin: 0 5px; padding: 0 5px;">
                        <input id="shzs-item-price" placeholder="监视价格, 0则删除" class="border-round shzs-price-input" style="height:25px; width:125px; margin: 0 5px; padding: 0 5px;">
                        <button id="shzs-item-add" class="border-round shzs-pointer" style="height: 24px;padding: 2px 5px; margin:3px; background-color:#65a5d1; color:white;">添加</button>
                        <div id="shzs-item-current-price" style="color: darkslategray;font-style: italic;font-size: 12px; margin:5px;"></div>
                        <datalist id="shzs-dl-tornitems">
                        </datalist>
                    </div>
                    <div id="shzs-watching-wrapper" style="padding:0 0 5px 0">
                        <table id="shzs-watching-tb" style="margin:auto; min-width:350px; background-color:white;">
                        </table>
                        <div id="shzs-api-alert" style="margin: 5px;font-size: 11px;font-style: italic;"></div>
                    <div>
                </div>
            </div>`;

            function makeItemOptions(){
                let options = '';
                Object.keys(tornItems).forEach((key) => {
                    options += `<option value="${key}">`;
                })
                $('#shzs-dl-tornitems').html(options);
            }

            function makeApiAlert(){
                // api使用提示
                if (watchLoop <= 0) {
                    $('#shzs-api-alert').text('');
                } else {
                    let apiUseCountPerLoop = 0;
                    if (pointPrice > 0) apiUseCountPerLoop += 1;
                    Object.keys(watchingItems).forEach((key) => {
                        let info = watchingItems[key];
                        if (info.watched) apiUseCountPerLoop += 1;
                    });
                    const apiUsePerSecond = Math.ceil(apiUseCountPerLoop * 60.0 / watchLoop);
                    $('#shzs-api-alert').text(`预计每分钟api使用次数: ${apiUsePerSecond}`);
                    if (apiUsePerSecond < 25) $('#shzs-api-alert').css('color', 'darkgreen');
                    else if (apiUsePerSecond < 50) $('#shzs-api-alert').css('color', 'darkblue');
                    else if (apiUsePerSecond < 75) $('#shzs-api-alert').css('color', 'darkred');
                    else $('#shzs-api-alert').css('color', 'red');
                }
            }

            function makeWatchingTable(){
                let html = `<tr>
                <th width="50px">监视</th>
                <th>商品名</th>
                <th>价格</th>
                <th>价格</th>
                <tr>`;
                Object.keys(watchingItems).forEach((itemName) => {
                    const info = watchingItems[itemName];
                    html += `<tr>
                    <td><input type="checkbox" ${info.watched ?'checked="checked"' :''}" class="shzs-watchtb-checkbox" data-name="${itemName}"></td>
                    <td class="shzs-watchtb-name shzs-pointer" data-name="${itemName}">${itemName}</td>
                    <td class="shzs-watchtb-price shzs-pointer" data-price="${info.price}">${formatMoney2(info.price)}</td>
                    <td class="shzs-watchtb-price shzs-pointer" data-price="${info.price}">${formatNumber2(info.price)}</td>
                    <tr>`
                });

                $('#shzs-watching-tb').html(html);
                $("#shzs-watching-tb th").attr("style", "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;");      
                $("#shzs-watching-tb td").attr("style", "border: 1px solid darkgray;padding: 4px 8px;background-color: white;color: black;text-align:center;");      

                makeApiAlert();

                // checkbox事件
                $('.shzs-watchtb-checkbox').bind('change', function(){
                    const itemName = $(this).attr('data-name');
                    watchingItems[itemName].watched = !watchingItems[itemName].watched;
                    mlog(`watch ${itemName}: ${!watchingItems[itemName].watched} -> ${watchingItems[itemName].watched}`);
                    ext_setValue('shzs-watching-items', watchingItems);
                    watchingItems = ext_getValue('shzs-watching-items');
                    makeWatchingTable();
                });

                // name事件
                $('.shzs-watchtb-name').bind('click', function(){
                    const itemName = $(this).attr('data-name');
                    $('#shzs-item-name').val(itemName);
                    $('#shzs-item-name').trigger('input');
                });

                // price事件
                $('.shzs-watchtb-price').bind('click', function(){
                    const itemPrice = $(this).attr('data-price');
                    $('#shzs-item-price').val(itemPrice);
                    $('#shzs-item-price').trigger('input');
                });
            }

            $('#mainContainer').prepend(wrapperHTML);

            // input格式化
            $('.shzs-price-input').tornInputMoney({
                "groupMoneyClass": null,
            });
            $('.shzs-price-input').parent().css('display', 'inline-block');

            // 添加下拉框
            makeItemOptions();

            makeWatchingTable();

            // start / pause
            $('#shzs-item-start').on('click', function(){
                if (watching) {
                    $(this).css('background-color', '#8fbc8f');
                    $(this).text('开始');
                    $('#shzs-icon-btn').removeClass('shzs-working');
                    document.title = "[扫货暂停]"
                } else {
                    $(this).css('background-color', '#ff7373');
                    $(this).text('暂停');
                    $('#shzs-icon-btn').addClass('shzs-working');
                }
                watching = !watching;
            });

            // watch loop
            $('#shzs-watch-loop').on('change', function(){
                let prev = watchLoop;
                let curr = $(this).val();
                if (parseInt(curr) >= 0) {
                    ext_setValue("shzs-watch-loop", curr);
                    watchLoop = ext_getValue("shzs-watch-loop");
                    $(this).val('');
                    $(this).attr('placeholder', `${`当前: ${watchLoop}, 0为不监视`}`);
                    mlog(`watch loop ${prev} -> ${watchLoop}`);
                    makeApiAlert();
                }
            });

            // pt
            $('#shzs-pt-input').on('change', function(){
                let prev = pointPrice;
                let curr = formatMoney($(this).val());
                if (parseInt(curr) >= 0) {
                    ext_setValue("shzs-pt-price", curr);
                    pointPrice = ext_getValue("shzs-pt-price");
                    $(this).val('');
                    $(this).attr('placeholder', `${`当前: ${pointPrice}, 0为不监视`}`);
                    mlog(`price ${prev} -> ${pointPrice}`);
                    makeApiAlert();
                }
            });

            // 输入商品名事件
            $("#shzs-item-name").on('input', function(){
                const inputName = $(this).val();
                const filtered = Object.keys(tornItems).filter((name) => name.toLowerCase() === inputName.toLowerCase());
                if (filtered.length > 0) {
                    const itemName = filtered[0];
                    fetchLowestItem(itemName).then((lowest) => {
                        if (inputName === $(this).val()) {
                            $('#shzs-item-current-price').text(`${itemName}当前最低价: ${parseInt(lowest.cost)}`);
                        }
                    });
                } else {
                    $('#shzs-item-current-price').text('');
                }
            });

            // 提交商品事件
            $("#shzs-item-add").on('click', function(){
                const inputName = $('#shzs-item-name').val();
                const price = formatMoney($("#shzs-item-price").val());
                if (price < 0) {
                    return;
                }
                const filtered = Object.keys(tornItems).filter((name) => name.toLowerCase() === inputName.toLowerCase());
                mlog(`add filter: ${filtered}`);
                if (filtered.length > 0) {
                    const itemName = filtered[0];
                    if (price == 0) {
                        delete watchingItems[itemName];
                        mlog(`delete ${itemName}`);
                    } else {
                        watchingItems[itemName] = {
                            'price': price,
                            'watched': true
                        };
                        mlog(`add ${JSON.stringify(watchingItems[itemName])}`);
                    }
                    ext_setValue('shzs-watching-items', watchingItems);
                    watchingItems = ext_getValue('shzs-watching-items');
                    makeWatchingTable();
                }
            });
        }

        if ($('#shzs-wrapper').length > 0) {
            $('#shzs-wrapper').addClass('shzs-dropout');
            setTimeout(()=> {
                $('#shzs-wrapper').remove();
            }, 500);
        } else {
            makeWrapper();
            $('#shzs-wrapper').addClass('shzs-dropin');
        }
    });

    let dotCount = 0;
    setInterval(function(){
        let currentTimestamp = new Date().getTime() / 1000.0;
        if (watching) {
            dotCount = (dotCount + 1) % 4;
            let title = `[扫货暂停中]`;
            if (watchLoop > 0) {
                let timeLeft = parseInt(watchLoop - (currentTimestamp - latestRefresh));
                title = `[扫货中] (${timeLeft > 0 ?`${timeLeft}s` :'更新中'})`;
            }
            for (let i = 0; i < dotCount; ++i) title += '.';
            document.title = title;
        }
        if (watching && watchLoop > 0 && currentTimestamp - latestRefresh > watchLoop) {
            mlog(`refresh ${latestRefresh} -> ${currentTimestamp}`);
            ext_setValue('shzs-latest-refresh', currentTimestamp);
            latestRefresh = ext_getValue('shzs-latest-refresh');

            // pt
            if (pointPrice > 0) {
                fetchLowestPoint().then((lowest) => {
                    mlog(`pt watch: ${lowest.cost} - ${pointPrice}`);
                    if (lowest.cost <= pointPrice) {
                        NotificationComm(`[扫货助手] PT ${lowest.cost}`, `${formatMoney2(lowest.cost)} x${lowest.quantity} | 总价: ${formatNumber2(parseInt(lowest.total_cost))}`, 'https://www.torn.com/pmarket.php');
                    }
                });
            }

            // items
            Object.keys(watchingItems).forEach((itemName) => {
                let info = watchingItems[itemName];
                if (info.watched) {
                    fetchLowestItem(itemName).then((lowest) => {
                        mlog(`${itemName} watch: ${lowest.cost} - ${info.price}`);
                        if (lowest.cost <= info.price) {
                            NotificationComm(`[扫货助手] ${itemName} ${formatNumber2(lowest.cost)}`, `${formatMoney2(lowest.cost)} x${lowest.quantity} | 总价: ${formatNumber2(lowest.quantity * lowest.cost)}`, `https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=${itemName}`);
                        }
                    });
                }
            });
        }
    }, 500); 

    function NotificationComm(title, body, url, option) {
        if ('Notification' in window) { // 判断浏览器是否兼容Notification消息通知
            window.Notification.requestPermission(function(res) { // 获取用户是否允许通知权限
                if (res === 'granted') { // 允许
                    let notification = new Notification(title || '这是一条新消息', Object.assign({}, {
                        dir: "auto", // 字体排版,auto,lt,rt
                        icon: '', // 通知图标
                        body: body || '请尽快处理该消息', // 主体内容
                        renotify: false // 当有新消息提示时，是否一直关闭上一条提示
                    }, option || {}));
                    notification.onerror = function(err) { // error事件处理函数
                        throw err;
                    }
                    notification.onshow = function(ev) { // show事件处理函数
                    }
                    notification.onclick = function(ev) { // click事件处理函数
                        window.open(url);
                        notification.close();
                    }
                    notification.onclose = function(ev) { // close事件处理函数
                    }
                } else {
                    alert('该网站通知已被禁用，请在设置中允许');
                }
            });
        } else { // 兼容当前浏览器不支持Notification的情况
            const documentTitle = document.title,
                index = 0;
            const time = setInterval(function() {
                index++;
                if (index % 2) {
                    document.title = '【　　　】' + documentTitle;
                } else {
                    document.title = '【新消息】' + documentTitle;
                }
            }, 1000);
            const fn = function() {
                if (!document.hidden && document.visibilityState === 'visible') {
                    clearInterval(time);
                    document.title = documentTitle;
                }
            }
            fn();
            document.addEventListener('visibilitychange', fn, false);
        }
    }

})();