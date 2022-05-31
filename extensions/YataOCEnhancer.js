// ==UserScript==
// @name         YataOCEnhancer
// @namespace    SMTH
// @version      0.0.1
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

    setInterval(() => {
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
            $(this).find('.yata-rank').text(`${(recordNNB.min == -100) ?'?' :recordNNB.min} ~ ${(recordNNB.max == 100) ?'?' :recordNNB.max}`);
        });
    }, 1000);
})();