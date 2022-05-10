// ==UserScript==
// @name         Simple Attacking Page
// @namespace    TornExtensions
// @version      1.0
// @description  屏蔽进攻页面的人物形象
// @author       htys [1545351]
// @match        https://www.torn.com/loader.php*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.SimpleAttackingPage) return;
        __win.SimpleAttackingPage = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }

    const $ = window.jQuery;
	const intervalID = setInterval(updateUI, 1000);
	function updateUI(){
		const attacker = $("div#attacker").find("div[class^='modelLayers___']");
		attacker.find("div[class^='model___']").remove();
		attacker.find("div[class^='armoursWrap___']").remove();
		const defender = $("div#defender").find("div[class^='modelLayers___']");
		defender.find("div[class^='model___']").remove();
		defender.find("div[class^='armoursWrap___']").remove();
	}
})();