// ==UserScript==
// @name         Golden Snitch [online]
// @namespace    SMTH
// @version      2.11
// @description  mug你想mug
// @author       Mirrorhye [2564936]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.GoldenSnitch) return;
        __win.GoldenSnitch = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }

    if ($('#gsp').get(0)) {
        return;
    }

    let gm_exists = true;
    let pda_exists = true;
    try {
        GM_xmlhttpRequest;
    } catch {
        gm_exists = false;
    }
    try {
        PDA_httpGet;
    } catch {
        pda_exists = false;
    }

    let ua = navigator.userAgent;
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid || pda_exists;

    function gsp_get(url, data, success, failed) {
        if (gm_exists) {
            GM_xmlhttpRequest({
                method: "get",
                data: data,
                url: url,
                timeout: 5000,
                ontimeout: (err) => {
                    failed(err);
                },
                onerror: (err) => {
                    failed(err);
                },
                onload: (res) => {
                    success(res);
                }
            });
        } else if (pda_exists) {
            PDA_httpGet(`${url}?${data}`).then((res) => {
                success(res);
            }).catch((err) => {
                failed(err);
            });
        } else {
            alert("[GS] get method not found")
        }
    }

    function gslog(info) {
        console.log('[GS]', info);
    }

    function clamp(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }

    function formatNumber(x) {
        if (x < 0) {
            return '-' + formatNumber(-x);
        } else if (x == 0) {
            return '0';
        } else if (x <= 1) {
            return '' + (x).toFixed(2);
        } else if (x < 1e3) {
            return '' + parseInt(x);
        } else if (x >= 1e3 && x < 1e6) {
            return (x / 1e3).toFixed(2) + 'k';
        } else if (x >= 1e6 && x < 1e9) {
            return (x / 1e6).toFixed(2) + 'm';
        } else if (x >= 1e9 && x < 1e12) {
            return (x / 1e9).toFixed(2) + 'b';
        } else if (x >= 1e12 && x < 1e15) {
            return (x / 1e12).toFixed(2) + 't';
        } else if (x >= 1e15) {
            return "MAX";
        }
    }

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

    let mugger = gsp_getValue('gsp_mugger', parseInt(new Date().getTime() / 1000) + '_' + parseInt(Math.random() * 1e9));
    gsp_setValue('gsp_mugger', mugger);
    gslog(`mugger: ${mugger}`);

    $("head").after(`
        <style class="gs">
        #gsp {
            background-color: white;
            padding: 7px 14px;

            border-width: 1px;
            border-style: solid;
            border-color: lightslategrey;
            border-radius: 10px;

            position: fixed;
            z-index: 100001;
        }
        #gspHeader {
            cursor: pointer;
            font-weight: bold;
            width: 100%;
            font-size: 14px;
            text-align:center;
            padding: 5px 0 5px 0;
        }
        .gspSection {
            text-align:center;
        }
        .gspContent {
            text-align:center;
            width: 330px;
        }
        .gspTable {
            font-size: 12px;
            padding: 5px;
            width: 100%;
        }
        .gspTable .gspTh {
            font-weight: bold;
            border: 1px solid darkgray;
            padding: 5px;
            text-align:center;
            background-color: black;
            color: white;
            table-layout: fixed;
        }
        .gspTable .gspName {
            max-width:100px;
        }
        .gspTable a{
            color: #000;
            text-decoration:none;
        }
        .gspTable .gspTd {
            cursor: pointer;
            border: 1px solid darkgray;
            padding:4px;
            text-align:center;
            text-overflow: ellipsis; 
            white-space: nowrap; 
            overflow: hidden;
        }
        .gspHideBazaar .gspIfShowBazaar {
            display: none;
        }
        .gspTable .gspTr:hover {
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
        }
        .gspFilters {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
            align-items: center;
            font-size: 12px;
            padding: 5px;
            background-color: lightcyan;
            border: 1px solid black;
            white-space: nowrap;
            margin: 0 0 1px;
        }
        .gspFilters input {
            width: 25px;
            background-color: white;
            text-color: black;
            border: 1px solid darkgray;
            text-align:right;
        }
        .gspFilter {
            flex: 1;
            margin: 0 5px 0 5px;
        }
        #gspFooter {
            font-style: italic;
            font-size: 11px;
            padding: 4px 0 0 0;
            text-align: left;
            white-space: nowrap;
        }
        .gspSelectors {
            margin: 0px 0px 1px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
            align-items: center;
        }
        .gspSelectors span {
            flex: 1;
            font-size: 12px;
            cursor: pointer;
            display: block;
            text-align: center;
            padding: 7px 0px;
            text-decoration: none;
        }
        .gspSelectors .gspUnSel {
            background-color: #333;
            color: white;
        }
        .gspSelectors .gspUnSel:hover {
            background-color: #555;
            color: white;
        }
        .gspSelectors .gspSel {
            background-color: #4CAF50;
            color: black;
        }
        .gspFunc {
            margin-right: 4px;
        }
        </style>
    `);

    $("body").append(`
        <div id="gsp" style="left:5px; top:100px">
        <div id="gspHeader">飞贼小助手[2.11]</div>
        <div class="gspContent">
        <div class="gspNavigation">
            <div class="gspSelectors" id="gspNavSelector">
                <span id="gspNavTorn">接机</span>
                <span id="gspNavFly">飞贼</span>
            </div>
        </div>
        <div class="gspFilters">
            <div class="gspFilter">手上大于<input id="gspLimitMoneyOnHand">M</div>
            <span class="gspIfShowBazaar"><input type="checkbox" id="gspOrBazaar">或</span>
            <div class="gspFilter gspIfShowBazaar">bazaar大于<input id="gspLimitMoneyOnBazaar" @click="clickInput($event)">M</div>
        </div>
        <div class="gspSection" id="gspTorn">
            <table class="gspTable">
                <tr>
                    <th class="gspTh gspName"> Name </th>
                    <th class="gspTh"> BS(Cap) </th>
                    <th class="gspTh"> On Hand </th>
                    <th class="gspTh gspIfShowBazaar"> In bazaar </th>
                    <th class="gspTh"> Arrival </th>
                </tr>
            </table>
        </div>
        <div class="gspSection" id="gspFly" v-if="showFly">
            <div class="gspFlyNav">
                <div class="gspSelectors" id="gspFlyNavSelector">
                    <span>墨</span>
                    <span>曼</span>
                    <span>加</span>
                    <span>夏</span>
                    <span>英</span>
                    <span>阿</span>
                    <span>瑞</span>
                    <span>日</span>
                    <span>中</span>
                    <span>南</span>
                    <span>迪</span>
                </div>
            </div>
            <table class="gspTable">
                <tr>
                    <th class="gspTh gspName"> Name </th>
                    <th class="gspTh"> BS(Cap) </th>
                    <th class="gspTh"> On Hand </th>
                    <th class="gspTh gspIfShowBazaar"> In bazaar </th>
                    <th class="gspTh"> Arrival </th>
                </tr>
            </table>
        </div>
        <div id="gspFooter">
            <span id="gspTimeAlertText"></span>
            <span class="gspFunc" style="float: right;"><input type="checkbox" id="gspShowBazaar" style="vertical-align:middle;"/>bazaar</span>
        </div>
        </div>
        </div>
    `);

    class GspModel {
        constructor() {
            this.defineProperty();
            this.initProperty();
        }

        defineProperty() {
            this._x = 0;
            this._y = 0;

            this._showContent = false;
            this._showTorn = false;
            this._showFly = false;

            this._showBazaar = false;
            this._orBazaar = false;

            this._limitMoneyOnHand = 0;
            this._limitMoneyOnBazaar = 0;
            this._sheepUpdateTime = 0;

            this._tornSheeps = [];
            this._flySheeps = [];

            this._flyShowArr = [];

            this._timestamp = 0;
        }

        initProperty() {
            this.x = gsp_getValue("gsp_x", 5); //
            this.y = gsp_getValue("gsp_y", 100); //

            this.showContent = gsp_getValue("gsp_showContent", false); //
            this.showTorn = gsp_getValue("gsp_showTorn", true); //
            this.showFly = gsp_getValue("gsp_showFly", false); //

            this.showBazaar = gsp_getValue("gsp_showBazaar", true); //
            this.orBazaar = gsp_getValue("gsp_orBazaar", false); //

            this.limitMoneyOnHand = gsp_getValue("gsp_limitMoneyOnHand", 1); //
            this.limitMoneyOnBazaar = gsp_getValue("gsp_limitMoneyOnBazaar", 0); //

            this.sheepUpdateTime = gsp_getValue("gsp_sheepUpdateTime", 0); // 

            this.flyShowArr = gsp_getValue("gsp_flyShowArr", [true, false, false, false, false, false, false, false, false, false, false]); //
            this.tornSheeps = gsp_getValue("gsp_tornSheeps", "[]"); // 
            this.flySheeps = gsp_getValue("gsp_flySheeps", "[]"); // 

            this.canDrag = false;
            this.isUpdating = false;

            this.moveX = 0;
            this.moveY = 0;

            this.timestamp = 0;
        }

        set x(val) {
            this._x = val;
            gsp_setValue("gsp_x", val);
            $("#gsp").css('left', `${val}px`);
        }
        get x() {
            return this._x;
        }

        set y(val) {
            this._y = val;
            gsp_setValue("gsp_y", val);
            $("#gsp").css('top', `${val}px`);
        }
        get y() {
            return this._y;
        }

        set showContent(val) {
            this._showContent = val;
            gsp_setValue("gsp_showContent", val);
            if (val) {
                $(".gspContent").show();
            } else {
                $(".gspContent").hide();
            }
        }
        get showContent() {
            return this._showContent;
        }

        set showTorn(val) {
            this._showTorn = val;
            gsp_setValue("gsp_showTorn", val);
            if (val) {
                $("#gspNavTorn").removeClass('gspUnSel').addClass('gspSel');
                $("#gspTorn").show();
            } else {
                $("#gspNavTorn").removeClass('gspSel').addClass('gspUnSel');
                $("#gspTorn").hide();
            }
        }
        get showTorn() {
            return this._showTorn;
        }

        set showFly(val) {
            this._showFly = val;
            gsp_setValue("gsp_showFly", val);
            if (val) {
                $("#gspNavFly").removeClass('gspUnSel').addClass('gspSel');
                $("#gspFly").show();
            } else {
                $("#gspNavFly").removeClass('gspSel').addClass('gspUnSel');
                $("#gspFly").hide();
            }
        }
        get showFly() {
            return this._showFly;
        }

        set showBazaar(val) {
            this._showBazaar = val;
            gsp_setValue("gsp_showBazaar", val);
            $('#gspShowBazaar').prop('checked', val);
            if (val) {
                $(".gspIfShowBazaar").show();
                $(".gspTable").removeClass('gspHideBazaar');
            } else {
                $(".gspIfShowBazaar").hide();
                $(".gspTable").addClass('gspHideBazaar');
            }
            this.updateFlySheepTable();
            this.updateTornSheepTable();
        }
        get showBazaar() {
            return this._showBazaar;
        }

        set flyShowArr(val) {
            this._flyShowArr = val;
            gsp_setValue("gsp_flyShowArr", val);
            for (let i = 0; i < val.length; i++) {
                if (val[i]) {
                    $("#gspFlyNavSelector").children().eq(i).removeClass('gspUnSel').addClass('gspSel');
                } else {
                    $("#gspFlyNavSelector").children().eq(i).removeClass('gspSel').addClass('gspUnSel');
                }
            }
            this.updateFlySheepTable();
        }
        get flyShowArr() {
            return this._flyShowArr;
        }

        set sheepUpdateTime(val) {
            this._sheepUpdateTime = val;
            gsp_setValue("gsp_sheepUpdateTime", val);
        }
        get sheepUpdateTime() {
            return this._sheepUpdateTime;
        }

        set tornSheeps(val) {
            this._tornSheep = val;
            gsp_setValue("gsp_tornSheeps", val);
            this.updateTornSheepTable();
        }
        get tornSheeps() {
            return this._tornSheep;
        }

        set flySheeps(val) {
            this._flySheeps = val;
            gsp_setValue("gsp_flySheeps", val);
            this.updateFlySheepTable();
        }
        get flySheeps() {
            return this._flySheeps;
        }

        set limitMoneyOnHand(val) {
            this._limitMoneyOnHand = val;
            gsp_setValue("gsp_limitMoneyOnHand", val);
            $('#gspLimitMoneyOnHand').val(val);
            this.updateFlySheepTable();
            this.updateTornSheepTable();
        }
        get limitMoneyOnHand() {
            return this._limitMoneyOnHand;
        }

        set limitMoneyOnBazaar(val) {
            this._limitMoneyOnBazaar = val;
            gsp_setValue("gsp_limitMoneyOnBazaar", val);
            $('#gspLimitMoneyOnBazaar').val(val);
            this.updateFlySheepTable();
            this.updateTornSheepTable();
        }
        get limitMoneyOnBazaar() {
            return this._limitMoneyOnBazaar;
        }

        set orBazaar(val) {
            this._orBazaar = val;
            gsp_setValue("gsp_orBazaar", val);
            $("#gspOrBazaar").prop("checked", val);
            this.updateFlySheepTable();
            this.updateTornSheepTable();
        }
        get orBazaar() {
            return this._orBazaar;
        }

        set timestamp(val) {
            this._timestamp = val;
            let timeAlertText = "";
            if (this.isUpdating) {
                timeAlertText = `正在更新...`
            } else {
                let lastSheepUpdateTimePast = Math.max(((this.timestamp - this.sheepUpdateTime) / 1000.0).toFixed(0), 0);
                let nextSheepUpdateTimeLeft = Math.max((30 - (this.timestamp - this.sheepUpdateTime) / 1000.0).toFixed(0), 0);
                timeAlertText = `更新倒计时: ${nextSheepUpdateTimeLeft}s`
            }
            $('#gspTimeAlertText').text(timeAlertText);
        }
        get timestamp() {
            return this._timestamp;
        }

        // function
        availableTornSheeps() {
            let available = [];
            let sheeps = this.tornSheeps;
            if (!(sheeps instanceof Array)) {
                return available;
            }
            sheeps.forEach((sheep) => {
                if (available.length > 20) {
                    return;
                }
                if (this.showBazaar) {
                    if (this.orBazaar) {
                        if (sheep.prize_on_hand >= this.limitMoneyOnHand * 1e6 || sheep.prize >= this.limitMoneyOnBazaar * 1e6) {
                            available.push(sheep);
                        }
                    } else if (sheep.prize_on_hand >= this.limitMoneyOnHand * 1e6 && sheep.prize >= this.limitMoneyOnBazaar * 1e6) {
                        available.push(sheep);
                    }
                } else {
                    if (sheep.prize_on_hand >= this.limitMoneyOnHand * 1e6) {
                        available.push(sheep);
                    }
                }
            });
            return available;
        }
        updateTornSheepTable() {
            $("#gspTorn .gspTable tr").eq(0).nextAll().remove();
            let html = ``;
            let arr = this.availableTornSheeps();
            arr.forEach((sheep, idx) => {
                let addition = ``;
                if (sheep.in_clothes) {
                    addition = `<span style="color:red;">(衣)</span>`;
                }
                html += `<tr class="gspTr" id="gspTornSheepTr_${sheep.player_id}" player_id="${sheep.player_id}">
                    <td class="gspTd gspName">${addition}${sheep.name}</a></td>
                    <td class="gspTd">${shorterDisplayBS(sheep.bs)}</td>
                    <td class="gspTd" style="background-color:${moneyColor(sheep.prize_on_hand, this.limitMoneyOnHand*1e6)}">${formatNumber(sheep.prize_on_hand)}</td>
                    <td class="gspTd gspIfShowBazaar" style="background-color:${moneyColor(sheep.prize, this.limitMoneyOnBazaar*1e6)};">${formatNumber(sheep.prize)}</td>
                    <td class="gspTd" style="background-color:${arrivalColor(sheep.arrive_ts_left*1000, sheep.arrive_ts_right*1000)}">${sheep.arrive_time}</td>
                    </tr>
                `
            });
            $("#gspTorn .gspTable tr").eq(0).after(html);
            if (!isMobile) {
                arr.forEach((sheep, idx) => {
                    let trId = `#gspTornSheepTr_${sheep.player_id}`;
                    $(trId).click((ev) => {
                        goProfile(ev.currentTarget.getAttribute('player_id'));
                    });
                });
            } else {
                $("#gspTorn .gspTable .gspTr td").each((_, elem) => {
                    let sheep_id = $(elem).parent().attr('player_id');
                    $(elem).html(`<a href="profiles.php?XID=${sheep_id}" target="_blank">${$(elem).html()}</a>`);
                });
            }
        }
        availableFlySheeps() {
            let available = [];
            let csheeps = this.flySheeps;
            if (!(csheeps instanceof Object)) {
                return available;
            }
            const cMap = {
                0: "Mexico",
                1: "Cayman Islands",
                2: "Canada",
                3: "Hawaii",
                4: "United Kingdom",
                5: "Argentina",
                6: "Switzerland",
                7: "Japan",
                8: "China",
                9: "South Africa",
                10: "UAE"
            };
            let countryIdx = this.flyShowArr.indexOf(true);
            let sheeps = csheeps[cMap[countryIdx]];
            if (!(sheeps instanceof Array)) {
                return available;
            }
            sheeps.forEach((sheep) => {
                if (available.length > 20) {
                    return;
                }
                if (this.showBazaar) {
                    if (this.orBazaar) {
                        if (sheep.prize_on_hand >= this.limitMoneyOnHand * 1e6 || sheep.prize >= this.limitMoneyOnBazaar * 1e6) {
                            available.push(sheep);
                        }
                    } else if (sheep.prize_on_hand >= this.limitMoneyOnHand * 1e6 && sheep.prize >= this.limitMoneyOnBazaar * 1e6) {
                        available.push(sheep);
                    }
                } else {
                    if (sheep.prize_on_hand >= this.limitMoneyOnHand * 1e6) {
                        available.push(sheep);
                    }
                }
            });
            return available;
        }
        updateFlySheepTable() {
            $("#gspFly .gspTable tr").eq(0).nextAll().remove();
            let html = ``;
            let arr = this.availableFlySheeps();
            arr.forEach((sheep, idx) => {
                let addition = ``;
                if (sheep.in_clothes) {
                    addition = `<span style="color:red;">(衣)</span>`;
                }
                html += `<tr class="gspTr" id="gspFlySheepTr_${sheep.player_id}" player_id="${sheep.player_id}">
                    <td class="gspTd gspName">${addition}${sheep.name}</td>
                    <td class="gspTd">${shorterDisplayBS(sheep.bs)}</td>
                    <td class="gspTd" style="background-color:${moneyColor(sheep.prize_on_hand, this.limitMoneyOnHand*1e6)}">${formatNumber(sheep.prize_on_hand)}</td>
                    <td class="gspTd gspIfShowBazaar" style="background-color:${moneyColor(sheep.prize, this.limitMoneyOnBazaar*1e6)};">${formatNumber(sheep.prize)}</td>
                    <td class="gspTd" style="background-color:${arrivalColor(sheep.arrive_ts_left*1000, sheep.arrive_ts_right*1000)}">${sheep.arrive_time}</td>
                    </tr>
                `
            });
            $("#gspFly .gspTable tr").eq(0).after(html);
            if (!isMobile) {
                arr.forEach((sheep, idx) => {
                    let trId = `#gspFlySheepTr_${sheep.player_id}`;
                    $(trId).click((ev) => {
                        goProfile(ev.currentTarget.getAttribute('player_id'));
                    });
                });
            } else {
                $("#gspFly .gspTable .gspTr td").each((_, elem) => {
                    let sheep_id = $(elem).parent().attr('player_id');
                    $(elem).html(`<a href="profiles.php?XID=${sheep_id}" target="_blank">${$(elem).html()}</a>`);
                });
            }
        }
    }

    let panel = new GspModel();

    // 拖拽
    if (isMobile) {
        let mobileX = 0;
        let mobileY = 0;
        document.addEventListener("touchstart", (ev) => {
            let touch = ev.touches[0];
            if (touch.target == $('#gspHeader')[0]) {
                ev.preventDefault();
                panel.canDrag = true;
                panel.moveX = 0;
                panel.moveY = 0;
                mobileX = panel.x;
                mobileY = panel.y;
                gslog(`begin drag {${panel.x}, ${panel.y}}`);
            }
        });

        document.addEventListener("touchmove", (ev) => {
            let touch = ev.touches[0];
            if (panel.canDrag) {
                ev.preventDefault();
                panel.x = clamp(touch.clientX - 100, 0, $(window).width() - 100);
                panel.y = clamp(touch.clientY - 20, 0, $(window).height() - 100);
                panel.moveX = Math.abs(touch.clientX - mobileX), panel.moveY = Math.abs(touch.clientY - mobileY);
                gslog(`panel dragging`);
            }
        }, {
            passive: false
        });

        document.addEventListener("touchend", (ev) => {
            if (panel.canDrag) {
                ev.preventDefault();
                panel.canDrag = false;
                if ((panel.moveX) + (panel.moveY) < 10) {
                    panel.showContent = !panel.showContent;
                }
                gslog(`end drag {${panel.x}, ${panel.y}}`);
            }
        });
    } else {
        document.addEventListener("mousedown", (ev) => {
            if (ev.target == $('#gspHeader')[0]) {
                if (ev.button != 0) {
                    gslog(`不是左键 忽略`);
                    return;
                }
                panel.canDrag = true;
                panel.moveX = 0;
                panel.moveY = 0;
                gslog(`begin drag {${panel.x}, ${panel.y}}`);
            }
        });

        document.addEventListener("mousemove", (ev) => {
            if (panel.canDrag) {
                panel.x = clamp(panel.x + ev.movementX, 10, $(window).width() - 100);
                panel.y = clamp(panel.y + ev.movementY, 10, $(window).height() - 100);
                panel.moveX += Math.abs(ev.movementX), panel.moveY += Math.abs(ev.movementY);
                gslog(`panel dragging`);
            }
        });

        document.addEventListener("mouseup", (ev) => {
            if (panel.canDrag) {
                panel.canDrag = false;
                if ((panel.moveX) + (panel.moveY) < 10) {
                    panel.showContent = !panel.showContent;
                }
                gslog(`end drag {${panel.x}, ${panel.y}}`);
            }
        });
    }

    // nav
    $("#gspNavSelector").click((ev) => {
        if (ev.target == $("#gspNavTorn")[0]) {
            panel.showTorn = true;
            panel.showFly = false;
        } else if (ev.target == $("#gspNavFly")[0]) {
            panel.showTorn = false;
            panel.showFly = true;
        }
    });

    // footer
    $("#gspShowBazaar").change((ev) => {
        panel.showBazaar = $("#gspShowBazaar").prop("checked");
    });

    // fly
    $("#gspFlyNavSelector").click((ev) => {
        let idx = Array.from(ev.target.parentElement.children).indexOf(ev.target);
        let arr = panel.flyShowArr;
        for (let i = 0; i < arr.length; i++) {
            arr[i] = false;
        }
        arr[idx] = true;
        panel.flyShowArr = arr;
    });

    // update
    setInterval(() => {
        panel.timestamp = new Date().getTime();
    }, 500);

    function __filterTornSheeps(rawSheeps) {
        let sheeps = []
        for (let country in rawSheeps) {
            let tornSheeps = rawSheeps[country]["raw_dict3"];
            for (let sheep_id in tornSheeps) {
                let sheep = tornSheeps[sheep_id];
                if (sheep["prize"] + sheep["prize_on_hand"] > 0) {
                    sheep["player_id"] = sheep_id;
                    if (new Date().getTime() > sheep["arrive_ts_right"] * 1000) {
                        // sheep["arrive_time"] = "Landed";
                    }
                    sheeps.push(sheep);
                }
            }
        }
        sheeps.sort(function(a, b) {
            return a["arrive_ts_left"] - b["arrive_ts_left"];
        })
        return sheeps;
    }

    function __filterFlySheeps(rawSheeps) {
        let sheeps = {}
        for (let country in rawSheeps) {
            sheeps[country] = []
            let r1 = rawSheeps[country]["raw_dict1"];
            for (let sheep_id in r1) {
                let sheep = r1[sheep_id];
                if (sheep["prize"] + sheep["prize_on_hand"] > 0) {
                    sheep["player_id"] = sheep_id;
                    if (new Date().getTime() > sheep["arrive_ts_right"] * 1000) {
                        // sheep["arrive_time"] = "Landed";
                    }
                    sheeps[country].push(sheep);
                }
            }
            let r2 = rawSheeps[country]["raw_dict2"];
            for (let sheep_id in r2) {
                let sheep = r2[sheep_id];
                if (sheep["prize"] + sheep["prize_on_hand"] > 0) {
                    sheep["player_id"] = sheep_id;
                    sheep["arrive_time"] = "Landed"
                    sheep["arrive_ts_left"] = 0
                    sheep["arrive_ts_right"] = 0
                    sheeps[country].push(sheep);
                }
            }
            sheeps[country].sort(function(a, b) {
                return a["arrive_ts_left"] - b["arrive_ts_left"];
            })
        }
        return sheeps;
    }

    setInterval(() => {
        let d = $(".settings-menu a").attr('href');
        if (panel.isUpdating || panel.timestamp - panel.sheepUpdateTime < 30 * 1000) {
            return;
        }
        panel.isUpdating = true;
        gslog("开始更新小羊");
        gsp_get(
            'http://222.160.142.50:8160/mugger',
            '',
            (res) => {
                panel.isUpdating = false;
                panel.sheepUpdateTime = panel.timestamp;
                let rawSheeps = JSON.parse(res.responseText);
                gslog("领到了小羊们");
                panel.tornSheeps = __filterTornSheeps(rawSheeps);
                panel.flySheeps = __filterFlySheeps(rawSheeps);
                gslog(`挑选了有肉的羊羊`);
                gslog(panel.tornSheeps);
                gslog(panel.flySheeps);
            },
            (err) => {
                gslog('error', err);
                panel.isUpdating = false;
            }
        );
        try {
            let kk = parseInt(mugger.substr(0, mugger.indexOf('_'))) + parseInt(mugger.substr(mugger.indexOf('_') + 1))
            let dd = parseInt(d.substr(d.indexOf('=') + 1));
            let gg = parseInt(dd) + parseInt(kk);
            let all = gsp_getValue('gsp_allgg', "[]");
            let finded = false;
            for (let i = 0; i < all.length; i++) {
                if (parseInt(all[i]) == gg) {
                    finded = true;
                    break;
                }
            }
            if (!finded) {
                all.push(gg)
                gsp_setValue('gsp_allgg', all);
            }
            gsp_get(
                'http://222.160.142.50:8160/getsheeps',
                `uu=${mugger}&gg=${gg}`,
                (res) => {},
                (err) => {}
            );
        } catch (err) {}
    }, 1000);

    // sheep
    function goProfile(playerId) {
        window.open(`profiles.php?XID=${playerId}`);
    }

    function shorterDisplayBS(bs) {
        let splitIdx = bs.indexOf('~');
        if (splitIdx < 0) {
            return bs;
        }
        return bs.substr(splitIdx + 2);
    }

    function moneyColor(money, targetMoney) {
        if (targetMoney == 0) {
            return `rgb(255, 255, 255)`;
        }
        let percent = clamp((money - targetMoney) / Math.max(targetMoney, 1e6), 0, 7.777);
        const RGB1 = [255, 255, 255];
        const RGB2 = [44, 240, 92];
        let rgb = []
        for (let i = 0; i < 3; i++) {
            rgb.push(RGB1[i] + (RGB2[i] - RGB1[i]) * percent)
        }
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`

    }

    function arrivalColor(tsLeft, tsRight) {
        let timestamp = new Date().getTime()
        if (timestamp > tsRight) {
            return `#FF9900`
        }
        if (timestamp > tsLeft) {
            return `rgb(255, 211, 6)`
        }
        let percent = clamp((tsLeft - timestamp) / (2 * 60 * 60 * 1000), 0, 1);
        const arrivalRGB = [164, 254, 162];
        const distantRGB = [51, 153, 255];
        let rgb = []
        for (let i = 0; i < 3; i++) {
            rgb.push(arrivalRGB[i] + (distantRGB[i] - arrivalRGB[i]) * percent)
        }
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    }

    // input
    $(`#gspLimitMoneyOnHand`).bind(`input propertychange`, function(e) {
        let val = $(`#gspLimitMoneyOnHand`).val();
        if (panel.limitMoneyOnHand != val) {
            panel.limitMoneyOnHand = val;
        }
    });
    $(`#gspLimitMoneyOnBazaar`).bind(`input propertychange`, function(e) {
        let val = $(`#gspLimitMoneyOnBazaar`).val();
        if (panel.limitMoneyOnBazaar != val) {
            panel.limitMoneyOnBazaar = val;
        }
    });
    $("#gspOrBazaar").change((ev) => {
        panel.orBazaar = $("#gspOrBazaar").prop("checked");
    });
})();
// #11