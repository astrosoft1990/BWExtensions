// ==UserScript==
// @name         TornCitySimple
// @namespace    TornCitySimple
// @version      1.1.0
// @description
// @author       astrosoft[2551155]
// @match        https://www.torn.com/city.php
//
// ==/UserScript==

(function() {
        'use strict';
    function hide(){
        let ele=document.getElementsByClassName("leaflet-tile-pane");
        ele[0].setAttribute('style','display:None');
    }
    let div_add=document.getElementById('map-cont');
    let hide_div = document.createElement('div');
    hide_div.setAttribute('style','height:30px;font-size:20px')
    hide_div.onclick=hide;
    div_add.append(hide_div);
    hide_div.append('点击这里隐藏建筑');
    function visualable(){
        try{
            let ele_btn=document.getElementsByClassName("btn-wrap btn-wrap-sml submit-take silver disable-d disable");
            ele_btn[0].className='btn-wrap btn-wrap-sml submit-take silver';
        }
        catch{
            let ele_btn1=document.getElementsByClassName("btn-wrap btn-wrap-sml silver submit-claim disable-d disable");
            ele_btn1[0].className='btn-wrap btn-wrap-sml silver submit-claim';
        }
    }
    let ele_click=document.getElementById('map');
    ele_click.onmousemove=visualable
})();
