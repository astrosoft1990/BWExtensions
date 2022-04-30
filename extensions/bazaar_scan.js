// ==UserScript==
// @name         BazaarScan
// @namespace    TornExtensions
// @version      1.0
// @description
// @author       guoguo
// @match        https://www.torn.com/*.php*
// @grant        GM_xmlhttpRequest
//
// ==/UserScript==

(function() {
    'use strict';
    //const $ = window.jQuery;
    const stock_refresh = 10;    //库存数据源刷新频率，默认10分钟刷新一次（最小5）
    const basic_refresh = 1;     //基础刷新频率，默认1分钟最多读取2条torn api（最小1）
    const notify = true;         //是否开启通知提醒
    const notify_minute = 2;     //提前几分钟提醒，默认提前2分钟提醒（最小1）
    const pointPrice = 45000;
    let APIKey = getAPIKey();
    const items = {
        "Xanax": {
           "name": "Xan",
		   "id":206,
		   "price":844000,
            },
        }


	if(basic_refresh >= 1 && APIKey != null && APIKey != "") {
        scanBazaar();
        const intervalID = setInterval(scanBazaar, 60000 * basic_refresh);
	 }

    function getAPIKey() {
        let key = window.localStorage.getItem("APIKey");
        if(key == null || key == "") {
            console.log('no key...');
            if(window.location.href.indexOf('preferences.php') >= 0) {
                console.log('on setting page');
                const refresher = setInterval(function() {
                    console.log('refreshing');
                    $("input").each(function() {
                        const input_value = $(this).val();
                        if (input_value.length == 16) {
                            key = input_value;
                            window.localStorage.setItem("APIKey",key);
                            console.log("apikey get "+key);
                            clearInterval(refresher);
                            alert('APIKey设置成功，点击确定前往主页');
                            window.location.href = 'https://www.torn.com/index.php';
                        }
                    });
                }, 300);
            }
            else {
                console.log('switch to setting page');
                alert('APIKey未设置或设置错误，点击确定前往设置页面');
                window.location.href = 'https://www.torn.com/preferences.php#tab=api';
            }
        }
        return key;
    }

    function getLocalStorage(key1,key2) {
        if(!window.localStorage) {
            return false;
        }
        else if(!window.localStorage.getItem(key1)) {
            return false;
        }
        else {
            const json = JSON.parse(window.localStorage.getItem(key1));
            if(!json[key2]) {
                return false;
            }
            else {
                return json[key2];
            }
        }
    }

    function updateLocalStorage(key1,key2,value) {
        if(!window.localStorage) {
            return false;
        }
        else if(!window.localStorage.getItem(key1)) {
            return false;
        }
        else {
            const json = JSON.parse(window.localStorage.getItem(key1));
            json[key2] = value;
            window.localStorage.setItem(key1,JSON.stringify(json));
        }
    }


    function scanBazaar() {
			for(let item in items){
				const tmpId = items[item].id;
                const API = `https://api.torn.com/market/${tmpId}?selections=&key=${APIKey}`;;
				 fetch(API)
            .then((res) => res.json())
            .then((res) => {
                if(res.bazaar[0].cost <= items[item].price){
                    console.log('ibazaar',res.bazaar[0].cost, items[item].price);
					NotificationComm(items[item].name + '<' + items[item].price +' 低价啦 ' + ' current price :' + res.bazaar[0].cost);
                }
            })
            .catch(e => console.log("fetch error", e));
			}

    }

    function NotificationComm(title, option) {
        if('Notification' in window){// 判断浏览器是否兼容Notification消息通知
            window.Notification.requestPermission(function(res){// 获取用户是否允许通知权限
                if(res === 'granted'){// 允许
                    let notification = new Notification(title || '这是一条新消息', Object.assign({}, {
                        dir: "auto", // 字体排版,auto,lt,rt
                        icon: '', // 通知图标
                        body: '请尽快处理该消息', // 主体内容
                        renotify: false // 当有新消息提示时，是否一直关闭上一条提示
                    }, option || {}));
                    notification.onerror = function(err){// error事件处理函数
                        throw err;
                    }
                    notification.onshow = function(ev){// show事件处理函数
                        console.log(ev);
                    }
                    notification.onclick = function(ev){// click事件处理函数
                        console.log(ev);
                        notification.close();
                    }
                    notification.onclose = function(ev){// close事件处理函数
                        console.log(ev);
                    }
                } else {
                    alert('该网站通知已被禁用，请在设置中允许');
                }
            });
        } else {// 兼容当前浏览器不支持Notification的情况
            const documentTitle = document.title,
                index = 0;
            const time = setInterval(function(){
                index++;
                if(index % 2){
                    document.title = '【　　　】' + documentTitle;
                } else {
                    document.title = '【新消息】' + documentTitle;
                }
            }, 1000);
            const fn = function(){
                if(!document.hidden && document.visibilityState === 'visible'){
                    clearInterval(time);
                    document.title = documentTitle;
                }
            }
            fn();
            document.addEventListener('visibilitychange', fn, false);
        }
    }

})();