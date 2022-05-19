// ==UserScript==
// @name         BazaarScan
// @namespace    TornExtensions
// @version      2.0.3
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
    function ext_getValue(key, default_value=null) {
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
        "Xanax" : {
            "price": 830000,
            "watched": true,
        }
    });
    let latestRefresh = ext_getValue('shzs-latest-refresh', 0);

    let tornItems = ext_getValue('shzs-tornItems', {});
    async function updateTornItems() {
        const res = await fetch(`https://api.torn.com/torn/?selections=items&key=${API_KEY}`);
        const tornItems = (await res.json()).items;
        let dict = {};
        Object.keys(tornItems).forEach((itemId) => {
            dict[tornItems[itemId].name] = itemId;
        });
        ext_setValue('shzs-tornItems', dict);
        tornItems = ext_getValue('shzs-tornItems', {});
    }
    if (Object.keys(tornItems).length <= 0) {
        updateTornItems();
    }

    $("head").after(`
        <style>
        .shzs-working {
            animation:spin 1000ms;
            animation-iteration-count: infinite;
        }
        @keyframes spin {
            from {
                transform: rotate(0turn);
            }
            to {
                transform: rotate(1turn);
            }
        }
        </style>
    `);

    function formatMoney(num) {
        return Number(num.replace(/\$|,/g, ''));
    }

    async function fetchLowestPointPrice() {
        return fetch(`https://api.torn.com/market/?selections=pointsmarket&key=${API_KEY}`)
            .then((res) => res.json())
            .then((res) => {
                let points = res.pointsmarket;
                let lowest = null;
                Object.keys(points).forEach((key) => {
                    let info = points[key];
                    let price = parseInt(info.cost);
                    if (!lowest || price < lowest) {
                        lowest = price;
                    }
                });
                return lowest;
            })
            .catch(e => console.log("fetch error", e));
    }
    
    async function fetchLowestItemPrice(itemName) {
        const itemId = tornItems[itemName];
        return fetch(`https://api.torn.com/market/${itemId}?selections=&key=${API_KEY}`)
            .then((res) => res.json())
            .then((res) => {
                return res.bazaar[0].cost;
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
                    <div style="font-size:18px; font-weight: bold; margin:5px 0px;">扫货助手 - <button id="shzs-item-start" class="border-round" style="height: 24px;padding: 2px 5px; margin:3px; background-color:#8fbc8f; color:white;">开始</button></div>
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
                        <input id="shzs-item-name" list="shzs-dl-tornitems" placeholder="商品名称" class="border-round" style="height:25px; width:130px; margin: 0 5px; padding: 0 5px;">
                        <input id="shzs-item-price" placeholder="监视价格, 0则删除" class="border-round shzs-price-input" style="height:25px; width:120px; margin: 0 5px; padding: 0 5px;">
                        <button id="shzs-item-add" class="border-round" style="height: 24px;padding: 2px 5px; margin:3px; background-color:#65a5d1; color:white;">添加</button>
                        <div id="shzs-item-current-price" style="color: darkslategray;font-style: italic;font-size: 12px; margin:5px;"></div>
                        <datalist id="shzs-dl-tornitems">
                        </datalist>
                    </div>
                    <div id="shzs-watching-wrapper" style="padding:0 0 5px 0">
                        <table id="shzs-watching-tb" style="margin:auto; min-width:350px; background-color:white;">
                        </table>
                    <div>
                </div>
            </div>`;

            function makeItemOptions() {
                let options = '';
                Object.keys(tornItems).forEach((key) => {
                    options += `<option value="${key}">`;
                })
                $('#shzs-dl-tornitems').html(options);
            }

            function makeWatchingTable(){
                let html = `<tr>
                <th width="50px">监视</td>
                <th>商品名</td>
                <th>价格</td>
                <tr>`;
                Object.keys(watchingItems).forEach((itemName) => {
                    const info = watchingItems[itemName];
                    html += `<tr>
                    <td><input type="checkbox" ${info.watched ?'checked="checked"' :''}" class="shzs-watch-cb" data-name="${itemName}"></td>
                    <td>${itemName}</td>
                    <td>${parseInt(info.price)}</td>
                    <tr>`
                });

                $('#shzs-watching-tb').html(html);
                $("#shzs-watching-tb th").attr("style", "border: 1px solid darkgray;padding: 5px;background-color: black;color: white;font-weight: bold;text-align:center;");      
                $("#shzs-watching-tb td").attr("style", "border: 1px solid darkgray;padding: 2px;background-color: white;color: black;text-align:center;");      

                // checkbox事件
                $('.shzs-watch-cb').change(function(){
                    const itemName = $(this).attr('data-name');
                    watchingItems[itemName].watched = !watchingItems[itemName].watched;
                    mlog(`watch ${itemName}: ${!watchingItems[itemName].watched} -> ${watchingItems[itemName].watched}`);
                    ext_setValue('shzs-watching-items', watchingItems);
                    watchingItems = ext_getValue('shzs-watching-items');
                    makeWatchingTable();
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
                }
            });

            // 输入商品名事件
            $("#shzs-item-name").on('input', function(){
                const inputName = $(this).val();
                const filtered = Object.keys(tornItems).filter((name) => name.toLowerCase() === inputName.toLowerCase());
                if (filtered.length > 0) {
                    const itemName = filtered[0];
                    fetchLowestItemPrice(itemName).then((price) => {
                        if (inputName === $(this).val()) {
                            $('#shzs-item-current-price').text(`${itemName}当前最低价: ${parseInt(price)}`);
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
                console.log(filtered);
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
            $('#shzs-wrapper').remove();
        } else {
            makeWrapper();
        }
    });


    setInterval(function(){
        let currentTimestamp = new Date().getTime() / 1000.0;
        if (watching && watchLoop > 0 && currentTimestamp - latestRefresh > watchLoop) {
            mlog(`refresh ${latestRefresh} -> ${currentTimestamp}`);
            ext_setValue('shzs-latest-refresh', currentTimestamp);
            latestRefresh = ext_getValue('shzs-latest-refresh');

            // pt
            if (pointPrice > 0) {
                fetchLowestPointPrice().then((price) => {
                    mlog(`pt watch: ${price} - ${pointPrice}`);
                    if (price <= pointPrice) {
                        NotificationComm(`PT ${price} < ${pointPrice} 低价啦`, 'https://www.torn.com/pmarket.php');
                    }
                });
            }

            // items
            Object.keys(watchingItems).forEach((itemName) => {
                let info = watchingItems[itemName];
                if (info.watched) {
                    fetchLowestItemPrice(itemName).then((price) => {
                        mlog(`${itemName} watch: ${price} - ${info.price}`);
                        if (price <= info.price) {
                            NotificationComm(`${itemName} ${price} < ${info.price} 低价啦`, `https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=${itemName}`);
                        }
                    });
                }
            });
        }
    }, 1000); 

    function NotificationComm(title, url, option) {
        if ('Notification' in window) { // 判断浏览器是否兼容Notification消息通知
            window.Notification.requestPermission(function(res) { // 获取用户是否允许通知权限
                if (res === 'granted') { // 允许
                    let notification = new Notification(title || '这是一条新消息', Object.assign({}, {
                        dir: "auto", // 字体排版,auto,lt,rt
                        icon: '', // 通知图标
                        body: '请尽快处理该消息', // 主体内容
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