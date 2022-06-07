// ==UserScript==
// @name         Bazaar Price Helper
// @namespace    SMTH
// @version      1.0.4
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
        console.trace(err);
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
                return Math.ceil(item_prices[position] * (1 + (premium / 100.0)));
            } else {
                return Math.ceil(item_prices[position] + premium);
            }
        } catch(err) {
            console.trace(err);
            return 0;
        }
    }

    function mark(item, price) {
        $(item).attr('bph-marked', price);
    }

    function isMarked(item) {
        return $(item).attr('bph-marked');
    }

    function isNeedUpdate(item) {
        return $(item).attr('bph-needUpdate') == 'true';
    }

    function markAllNeedUpdate() {
        $('[bph-marked]').each(function(){
            const markedPrice = $(this).attr('bph-marked');
            if (markedPrice == $(this).find('input')[1].value) {
                $(this).attr('bph-needUpdate', 'true');
            }
        });
    }
    function unmarkNeedUpdate(item) {
        $(item).attr('bph-needUpdate', null);
    }

    set_monitor();

    function set_monitor() {
        // 价格位置变更
        function onPositionChange() {
            let position = parseInt($("#bph_position_select").attr('value'));
            position = Math.max(Math.min(49, position), 0);
            $("#bph_position_select").attr('value', position);
            let prev_position = mir_get(positionKey);
            mir_set(positionKey, position);
            mir_log(`[position] change: ${prev_position} -> ${position}`);
            markAllNeedUpdate();
        }
        // 溢价变更
        function onPremiumChange() {
            let premium = parseFloat($("#bph_preInput").attr('value'));
            if (isNaN(premium)) {
                premium = 0.0;
            }
            $("#bph_preInput").attr('value', premium);
            let prev_premium = mir_get(premiumKey);
            mir_set(premiumKey, premium);
            mir_log(`[premium] change: ${prev_premium} -> ${premium}`);
            markAllNeedUpdate();
        }
        // 单位变更
        function onBaseChange() {
            let base = $("#bph_base_select").attr('value');
            $("#bph_base_select").attr('value', base);
            let prev_base = mir_get(baseKey);
            mir_set(baseKey, base);
            mir_log(`[base] change: ${prev_base} -> ${base}`);
            markAllNeedUpdate();
        }

        function updateUI() {
            mir_log(`页面更新`);
            if ($("div[class^=appHeaderWrapper]").length > 0 && $("div[class=bph_header]").length == 0) {
                function positionSelect() {
                    let position = Math.max(Math.min(9, parseInt(mir_get(positionKey, 0))), 0);
                    let html = `<select id="bph_position_select">`;
                    for (let i = 0; i < 10; i++) {
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

            if (window.location.href.endsWith('add')) {
                let additem_page_items = $('[data-group="child"]:visible');
                fill_prices_at_additem(additem_page_items);
            }

            if (window.location.href.endsWith('manage')) {
                let manage_page_items = $("div[class^=item]:visible");
                fill_prices_at_manage(manage_page_items);
            }
        }

        setInterval(() => {
            updateUI();
        }, 1000);
        // let observer_controls = new MutationObserver(function(mutationsList, observer) {
        //     updateUI();
        // });
        // observer_controls.observe(document.getElementById('bazaarRoot'), {childList: true, subtree: true });

    }

    function fill_prices_at_additem(page_items) {
        page_items.each(async function(){
            let item_id = (/images\/items\/([0-9]+)\/.*/).exec($(this).find("img[id^='item']").attr('src'))[1];
            let item_input = $(this).find("input")[1]; // 价格input
            if (isMarked(this) && !isNeedUpdate(this) && (item_input.value !== '' && item_input.value !== 'API请求出错')) {
                return;
            }
            try {
                let item_prices = await get_item_prices(item_id);
                item_input.value = prices_choose_strategy(item_prices);
                item_input.dispatchEvent(new Event("input"));
                mark(this, item_input.value);
                unmarkNeedUpdate(this);
            } catch(err) {
                console.trace(err);
                item_input.value = 'API请求出错';
            }
        });
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
            item_detail2.innerText = `${item_price - old_price}(${((item_price - old_price)/old_price).toFixed(2)*100}%)`;

            item_input.value = item_price + '-';
        }
        
        page_items.each(async function() {
            let item_id = (/images\/items\/([0-9]+)\/.*/).exec($(this).find("img").attr('src'))[1];
            let item_input = $(this).find('input')[1]; // 价格input
            if (isMarked(this) && !isNeedUpdate(this) && (item_input.value !== '' && item_input.value !== 'API请求出错')) {
                return;
            }
            if (!$(this).attr('bph-curr')) {
                let old_price = 0
                for (let j in item_input.value) {
                    let n = item_input.value[j];
                    if (n >= '0' && n <= '9') {
                        old_price = old_price*10 + (n - '0');
                    }
                }
                $(this).attr('bph-curr', old_price);
            }
            let old_price = parseInt($(this).attr('bph-curr'));
            let item_detail1 = $(this).find("div[class^=bonuses]")[0];
            let item_detail2 = $(this).find("div[class^=rrp]")[0];
            try {
                let item_prices = await get_item_prices(item_id);
                fill_item_price(item_input, prices_choose_strategy(item_prices), item_detail1, item_detail2, old_price);
                mark(this, item_input.value);
                unmarkNeedUpdate(this);
            } catch {
                console.trace(err);
                item_input.value = "API请求出错";
            }
        });
    }

    let request_cache = {};
    async function get_item_prices(item_id) {
        if (request_cache[item_id]) {
            return request_cache[item_id];
        } else {
            // 请求API
            let API = `https://api.torn.com/market/${item_id}?selections=&key=${API_KEY}`;
            mir_log(`请求: ${API}, item id: ${item_id}`);
            request_cache[item_id] = fetch(API).then((res) => {
                return res.json();
            }).then((json_data) => {
                let item_prices = [];
                json_data.bazaar.forEach(e => {
                    if (typeof(e.cost) == "undefined") {
                        item_prices.push(0)
                    } else {
                        item_prices.push(e.cost)
                    }
                });
                item_prices = item_prices.sort((x, y) => x - y);
                return item_prices;
            }).catch((err) => {
                request_cache[item_id] = null;
                throw err;
            });
            return request_cache[item_id];
        };
    }
})();