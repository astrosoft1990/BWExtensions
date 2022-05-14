// ==UserScript==
// @name         帮派物品租借/使用消息合并及汉化
// @namespace    faction.simplified_log_view
// @version      1.0.0
// @description  帮派物品租借/使用消息合并及汉化，提高了可读性。
// @author       Stella
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// ==/UserScript==

const armory_used_text = "used one of the faction's";
const armory_deposited_text = 'deposited 1 x';
const armory_returned_text = 'returned 1x';
const armory_filled_text = "filled one of the faction's";
const armory_loaned_text = 'loaned 1x';

function maybe_update_row(row, n, from_time, to_time, to_date, msg_html) {
    if (msg_html.includes(armory_used_text)) {
        // used
        if (n === 1) {
            row.find('span.info').html(msg_html.replace(armory_used_text, `领用了<b>${n}x</b>`).replace('items.', ' '));
        } else if (n > 1) {
            row.find('span.date').text(`${from_time} - ${to_time} ${to_date}`);
            row.find('span.info').html(msg_html.replace(armory_used_text, `领用了<b>${n}x</b>`).replace('items.', ' '));
        }
    } else if(msg_html.includes(armory_deposited_text)) {
        // deposited
        if (n === 1) {
            row.find('span.info').html(msg_html.replace(armory_deposited_text, `存放了 <b>${n}x</b>`).replace('items.', ' '));
        } else if (n > 1) {
            row.find('span.date').text(`${from_time} - ${to_time} ${to_date}`);
            row.find('span.info').html(msg_html.replace(armory_deposited_text, `存放了 <b>${n}x</b>`).replace('items.', ' '));
        }
    } else if(msg_html.includes(armory_returned_text)) {
        // returned
        if (n === 1) {
            row.find('span.info').html(msg_html.replace(armory_returned_text, `归还了 <b>${n}x</b>`).replace('items.', ' '));
        } else if (n > 1) {
            row.find('span.date').text(`${from_time} - ${to_time} ${to_date}`);
            row.find('span.info').html(msg_html.replace(armory_returned_text, `归还了 <b>${n}x</b>`).replace('items.', ' '));
        }
    }
    else if(msg_html.includes(armory_filled_text)) {
        // filled
        if (n === 1) {
            row.find('span.info').html(msg_html.replace(armory_filled_text, `无私献血了 <b>${n}</b>`).replace('Empty Blood Bag items.', ' 次'));
        } else if (n > 1) {
            row.find('span.date').text(`${from_time} - ${to_time} ${to_date}`);
            row.find('span.info').html(msg_html.replace(armory_filled_text, `无私献血了 <b>${n}</b>`).replace('Empty Blood Bag items.', ' 次'));
        }
    }
    else if(msg_html.includes(armory_loaned_text)) {
        // returned
        if (n === 1) {
            row.find('span.info').html(msg_html.replace(armory_loaned_text, `借了 <b>${n}x</b>`).replace('items.', ' ').replace('to', '给').replace(' from the faction armory.', ' '));
        } else if (n > 1) {
            row.find('span.date').text(`${from_time} - ${to_time} ${to_date}`);
            row.find('span.info').html(msg_html.replace(armory_loaned_text, `借了 <b>${n}x</b>`).replace('items.', ' '));
        }
    }
}

function simplify() {
    let n = 0;
    let msg_html = '';
    let from_date = '';
    let to_date = '';
    let from_time = '';
    let to_time = '';
    let row = '';

    const entries = $('#faction-news-root').find('li');
    if ($(entries).size() < 2) {
        return;
    }

    $(entries).each((i, entry) => {
        const time = $(entry).find('span')[1];
        const date = $(entry).find('span')[2];
        const info = $(entry).find('span.info');

        if ($(entry).find(info).html() === msg_html) {
            from_time = $(entry).find('span').find(time).text();
            from_date = $(entry).find('span').find(date).text();
            n++;
            $(entry).hide();
        } else if ($(entry).find(info).text().includes(armory_used_text) || $(entry).find(info).text().includes(armory_deposited_text)|| $(entry).find(info).text().includes(armory_returned_text)|| $(entry).find(info).text().includes(armory_filled_text)|| $(entry).find(info).text().includes(armory_loaned_text)) {
            maybe_update_row(row, n, from_time, to_time, to_date, msg_html);

            msg_html = $(entry).find(info).html();
            to_time = $(entry).find('span').find(time).text();
            to_date = $(entry).find('span').find(date).text();
            row = $(entry);
            n = 1;
        } else {
            maybe_update_row(row, n, from_time, to_time, to_date, msg_html);

            n = 0;
        }
    });

    maybe_update_row(row, n, from_time, to_time, to_date, msg_html);
}

(function() {
    'use strict';

    // Your code here...
})();

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (const node of mutation.removedNodes) {
            if (node.classList) {
                node.classList.forEach(c => {
                    // use this as a sign that list has been updated
                    if (c.startsWith('preloaderWrapper')) simplify();
                });
            }
        }
    });
});

const wrapper = document.querySelector('#faction-main');
observer.observe(wrapper, { subtree: true, childList: true, characterData: false, attributes: false, attributeOldValue: false });