// ==UserScript==
// @name         YataOCEnhancer
// @namespace    SMTH
// @version      1.0.0
// @description  YATA-OC增强
// @author       mirrorhye[2564936]
// @match        https://www.torn.com/*
// ==/UserScript==

(function() {
    'use strict';

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.YataOCEnhancer) return;
        __win.YataOCEnhancer = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }

    function mlog(s) {
        console.log(`[yoe] ${s}`);
    }

    function ext_getValue(key, default_value) {
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
            console.trace(err);
            return val;
        }
    }
    
    function ext_setValue(key, val) {
        return window.localStorage.setItem(key, JSON.stringify(val));
    }

    let membersNNB = ext_getValue('yoe-membersNNB', {});
    function syncNNBs(){
        ext_setValue('yoe-membersNNB', membersNNB);
        membersNNB = ext_getValue('yoe-membersNNB', {});
    }

    function stringifyRecord(record) {
        if (record.min == record.max) {
            return `${record.min}`;
        } else {
            return `${record.min == -100 ?'?' :record.min} ~ ${record.max == 100 ?'?' :record.max}`;
        }
    }

    setInterval(() => {
        if (window.location.href.indexOf('tab=crimes') < 0) {
            return;
        }

        // 导入导出
        if ($("#yoe-export").length <= 0) {
            $('#top-page-links-list').append(`<a role="button" id="yoe-export" style="cursor: pointer" class="events t-clear h c-pointer  m-icon line-h24 right last"><span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg events "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17"><path class="cls-3" d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM6.47,2.87H9.53l-.77,7.18H7.24ZM8,13.55A1.15,1.15,0,1,1,9.15,12.4,1.14,1.14,0,0,1,8,13.55Z"></path></svg></span></span><span>导出NNB</span></a>`)
            $('#yoe-export').bind('click', async function(){
                const text = JSON.stringify(membersNNB, null, 2);
                await navigator.clipboard.writeText(text);
                console.log(text);
                alert(`已导出到粘贴板!\n${text}`);
            });
        }

        if ($("#yoe-import").length <= 0) {
            $('#top-page-links-list').append(`<a role="button" id="yoe-import" style="cursor: pointer" class="events t-clear h c-pointer  m-icon line-h24 right last"><span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg events "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17"><path class="cls-3" d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM6.47,2.87H9.53l-.77,7.18H7.24ZM8,13.55A1.15,1.15,0,1,1,9.15,12.4,1.14,1.14,0,0,1,8,13.55Z"></path></svg></span></span><span>导入NNB</span></a>`)
            $('#yoe-import').bind('click', function(){
                const text = prompt('请输入需要导入的数据');
                try {
                    let dict = JSON.parse(text);
                    let display = '';
                    Object.keys(dict).forEach((key) => {
                        const info = dict[key];
                        display += `${key}: ${stringifyRecord(info)}\n`;
                    });
                    const trust = confirm(`确定要导入以下数据吗:\n${display}`);
                    if (trust) {
                        membersNNB = dict;
                        syncNNBs()
                    }
                } catch (err) {
                    console.trace(err);
                    alert(err)
                }
            });
        }

        function selectUserId(e) {
            const userURL = $(e).find('.member a').attr('href');
            const userId = userURL.substr(userURL.indexOf('XID=')+4);
            return userId
        }
        function selectNNB(e) {
            const nnb = $(e).find('.yata-nnb').text();
            return nnb
        }
        function predict(items) {
            // 预测上限
            items.each(function(idx) {
                const userId = selectUserId(this);
                let recordNNB = membersNNB[userId];
                if (!recordNNB) {
                    recordNNB = {
                        'min': -100,
                        'max': +100
                    }
                }
                const nnb = selectNNB(this);
                if (idx > 0 && nnb === '-') {
                    recordNNB.max = Math.min(recordNNB.max, membersNNB[selectUserId(items[idx - 1])].max);
                    recordNNB.min = Math.min(recordNNB.max, recordNNB.min);
                }
                // mlog(`${userId} -> ${JSON.stringify(recordNNB)}`);
                membersNNB[userId] = recordNNB;
            });

            // 预测下限
            const inverseItems = $(items.get().reverse());
            inverseItems.each(function(idx) {
                const userId = selectUserId(this);
                let recordNNB = membersNNB[userId];
                const nnb = selectNNB(this);
                if (idx > 0 && nnb === '-') {
                    recordNNB.min = Math.max(recordNNB.min, membersNNB[selectUserId(inverseItems[idx - 1])].min);
                    recordNNB.max = Math.max(recordNNB.max, recordNNB.min);
                }
                // mlog(`${userId} -> ${JSON.stringify(recordNNB)}`);
                membersNNB[userId] = recordNNB;
            });
        }

        // 记录所有登录了yata的member
        $('.yata-nnb').not(':contains("-")').not(':contains("NNB")').parent().each(function(idx) {
            const userId = selectUserId(this);
            const nnb = selectNNB(this);
            membersNNB[userId] = {
                'min': nnb,
                'max': nnb
            }
        });
        syncNNBs();
        
        // 预测所有未登录用户
        const details = $('.details-list');
        details.each(function(idx) {
            const items = $(this).find('.item');
            predict(items);
        });
        syncNNBs();

        const plans = $('ul.plans-list');
        plans.each(function(idx) {
            const items = $(this).find('.item');
            predict(items);
        });
        syncNNBs();

        // mlog(`members: ${JSON.stringify(membersNNB)}`);
        $('.yata-nnb').not(':contains("NNB")').parent().each(function(idx) {
            const userId = selectUserId(this);
            const recordNNB = membersNNB[userId];
            $(this).find('.yata-rank').text(`${stringifyRecord(recordNNB)}`);
        });
    }, 1000);
})();