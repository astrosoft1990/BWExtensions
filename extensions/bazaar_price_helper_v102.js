// ==UserScript==
// @name         Bazaar Price Helper
// @namespace    SMTH
// @version      1.0.3
// @description  自动填充bazaar上架价格
// @author       Mirrorhye[2564936]
// @match        https://www.torn.com/bazaar.php*
// @connect      api.torn.com
// ==/UserScript==

(function() {
    'use strict';

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.BazaarPriceHelper) return;
        __win.BazaarPriceHelper = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        mir_log(err);
    }

    function mir_get(key, preset) {
        if (window.localStorage === undefined) {
            return preset;
        }
        else if (!window.localStorage.getItem(key)) {
            return preset;
        }
        else {
            return window.localStorage.getItem(key);
        }
    }

    function mir_set(key, value) {
        if (window.localStorage === undefined){
            return;
        }
        else {
            window.localStorage.setItem(key, value);
        }
    }

    function mir_log(s) {
        console.log(`[BPH] ${s}`)
    }

    let positionKey = "bph_position";
    let position = mir_get(positionKey, 0);
    mir_set(positionKey, position);
    let premiumKey = "bph_premium";
    let premium = mir_get(premiumKey, 0.0);
    mir_set(premiumKey, premium);
    let baseKey = "bph_base";
    let base = mir_get(baseKey, '%');
    mir_set(baseKey, base);

    /// 你的api_key, 如果装了冰蛙 这里就不用改
    let API_KEY = '*'
    if (API_KEY == '*') {
        API_KEY = mir_get("APIKey");
    }
    // mir_log(API_KEY);

    function prices_choose_strategy(item_prices) {
        try {
            let position = Math.max(Math.min(item_prices.length, parseInt(mir_get(positionKey, 0))), 0);
            let premium = parseFloat(mir_get(premiumKey, 0.0));
            let base = mir_get(baseKey, '%');
            if (base === '%') {
                return item_prices[position] * (1 + (premium / 100.0));
            } else {
                return item_prices[position] + premium;
            }
        } catch(err) {
            mir_log(err);
            return 0
        }
    }

    var lowest_price_cache = {};
    set_monitor()

    function set_monitor() {
        const intervalID = setInterval(updateUI, 500);
        let last_additem_item_count = 0
        let last_manage_item_count = 0

        function onPositionChange() {
            let position = parseInt($("#bph_position_select").attr('value'));
            position = Math.max(Math.min(49, position), 0);
            $("#bph_position_select").attr('value', position);
            let prev_position = mir_get(positionKey);
            mir_log(`[position] change: ${prev_position} -> ${position}`);
            mir_set(positionKey, position);
            last_additem_item_count = 0;
            last_manage_item_count = 0;
        }

        function onPremiumChange() {
            let premium = parseFloat($("#bph_preInput").attr('value'));
            if (isNaN(premium)) {
                premium = 0.0;
            }
            $("#bph_preInput").attr('value', premium);
            let prev_premium = mir_get(premiumKey);
            mir_set(premiumKey, premium);
            mir_log(`[premium] change: ${prev_premium} -> ${premium}`);
            last_additem_item_count = 0
            last_manage_item_count = 0
        }

        function onBaseChange() {
            let base = $("#bph_base_select").attr('value');
            $("#bph_base_select").attr('value', base);
            let prev_base = mir_get(baseKey);
            mir_set(baseKey, base);
            mir_log(`[base] change: ${prev_base} -> ${base}`);
            last_additem_item_count = 0
            last_manage_item_count = 0
        }


        function updateUI() {
            mir_log(`等待页面更新`);

            if ($("div[class^=appHeaderWrapper]").length > 0 && $("div[class=bph_header]").length == 0) {
                function positionSelect() {
                    let position = Math.max(Math.min(49, parseInt(mir_get(positionKey, 0))), 0);
                    let html = `<select id="bph_position_select">`;
                    for (let i = 0; i < 50; i++) {
                        if (i == position) {
                            html += `<option value="${i}" selected="selected">${i}</option>`;
                        } else {
                            html += `<option value="${i}">${i}</option>`;
                        }
                    }
                    html += `</select>`;
                    return html;
                }

                function baseSelect() {
                    let base = mir_get(baseKey, 0);
                    let html = `<select id="bph_base_select">`;
                    html += `<option value="%" ${base === '%' ?'selected="selected"' :""}>%</option>`;
                    html += `<option value=" " ${base === ' ' ?'selected="selected"' :""}> </option>`;
                    html += `</select>`;
                    return html;
                }

                let premium = mir_get(premiumKey, 0.0);
                $("div[class^=appHeaderWrapper]").append(`<div class="bph_header" style="padding:10px 0 0 0"><div style="background-color:white;padding:10px;border:1px solid black;">以市场第${positionSelect()}低的价位为基准&nbsp;&nbsp;溢价+
                <input id="bph_preInput" value="${premium}" style="background-color:lightgray;width:30px;padding: 0 5px 0 5px;font-weight:bold;color:#333;text-align: center;">${baseSelect()}
                </div><hr class="page-head-delimiter m-top10 m-bottom10"></div>`);
                $("#bph_preInput").change(onPremiumChange);
                $("#bph_position_select").change(onPositionChange);
                $("#bph_base_select").change(onBaseChange);
            }

            let additem_page_items = document.querySelectorAll("[data-group='child']");
            if (additem_page_items.length != last_additem_item_count && additem_page_items.length > 0) { // tab改变了
                fill_prices_at_additem(additem_page_items)
            }
            last_additem_item_count = additem_page_items.length

            if (window.location.href.endsWith('manage')) {
                let manage_page_items = document.querySelectorAll("div[class^=item]");
                if (manage_page_items.length != last_manage_item_count && manage_page_items.length > 0) {
                    fill_prices_at_manage(manage_page_items)
                }
                last_manage_item_count = manage_page_items.length
            }
        }
    }

    function fill_prices_at_additem(page_items) {
        function fill_item_price(item_input, item_price) {
            item_input.value = item_price;
            item_input.dispatchEvent(new Event("input"));
        }

        mir_log(`[additem] - 更新需要填充的价格`);
        for (let i = 0; i < page_items.length; i++) {
            let item = page_items[i];

            let item_id = (/images\/items\/([0-9]+)\/.*/).exec($(item).find("img[id^='item']").attr('src'))[1];
            let item_input = item.getElementsByTagName("input")[1]; // 价格input

            get_item_price(item_id, item_prices => {
                fill_item_price(item_input, Math.ceil(prices_choose_strategy(item_prices)))
            })
        }
    }

    function fill_prices_at_manage(page_items) {
        function fill_item_price(item_input, item_price, item_detail1, item_detail2, old_price) {
            mir_log(`price: ${item_price}`);

            item_detail1.innerText = `${old_price} => ${item_price}`;
            let color = "green";
            if (item_price - old_price > 0) {
                color = "red";
            } else if (item_price - old_price == 0) {
                color = "white";
            }
            item_detail2.style.color = color
            item_detail2.innerText = `${item_price - old_price}(${((item_price - old_price)/old_price).toFixed(2)}%)`;

            item_input.value = item_price + '-';
        }

        mir_log(`[manage] - 更新需要填充的价格`);
        for (let i = 0; i < page_items.length; i++) {
            let item = page_items[i];

            let item_id = (/images\/items\/([0-9]+)\/.*/).exec($(item).find("img").attr('src'))[1];
            let item_input = item.querySelectorAll("input")[1]; // 价格input
            let old_price = 0
            for (let j in item_input.value) {
                let n = item_input.value[j];
                if (n >= '0' && n <= '9') {
                    old_price = old_price*10 + (n - '0');
                }
            }
            let item_detail1 = item.querySelector("div[class^=bonuses]")
            let item_detail2 = item.querySelector("div[class^=rrp]")

            get_item_price(item_id, item_prices => {
                fill_item_price(item_input, Math.ceil(prices_choose_strategy(item_prices)), item_detail1, item_detail2, old_price)
            })
        }
    }

    function get_item_price(item_id, callback) {
        if (lowest_price_cache[item_id]) {
            // 缓存命中
            let item_prices = lowest_price_cache[item_id];
            // mir_log(`lowest缓存: ${item_id} - prices:${item_prices}`);
            callback(item_prices);
        } else {
            // 请求API
            let API = `https://api.torn.com/market/${item_id}?selections=&key=${API_KEY}`;
            mir_log(`请求: ${API}, item id: ${item_id}`);
            fetch(API)
                .then((res) => {
                if(res.ok){
                    return res.json();
                } else {
                    mir_log(`出现未知错误 ${res}`);
                }
            }, networkError => {
                mir_log(`出现网络错误 ${networkError}`);
            }).then((json_data) => {
                let item_prices = [];
                json_data.bazaar.forEach(e => {
                    if (typeof(e.cost) == "undefined") {
                        item_prices.push(0)
                    } else {
                        item_prices.push(e.cost)
                    }
                });
                // mir_log(`[caching] ${item_id} - price:${item_prices}`);
                lowest_price_cache[item_id] = item_prices.sort((x,y) => x-y);
                callback(item_prices);
            });
        };
    }

})();