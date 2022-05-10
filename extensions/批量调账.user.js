// ==UserScript==
// @name         批量调账
// @namespace    SMTH
// @version      1.1
// @description  批量调账
// @author       htys[1545351]
// @match        https://www.torn.com/*.php*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.5/xlsx.min.js
// ==/UserScript==

(function() {
    'use strict';

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.PLTZ) return;
        __win.PLTZ = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }

    const $ = window.jQuery;
    const cache = window.localStorage.getItem("BALANCE_ADJUSTMENT");
    let json = cache ? JSON.parse(cache) : {};
    if ($("#faction-balance-adjustment").length < 1) {
        $(".content-title").after(`
        <div id="faction-balance-adjustment" style="width: inherit;">
            <div id="faction-balance-adjustment-header" style="margin: 10px 0px; border: 1px solid darkgray; text-align: center; font-size: large;">批量调账</div>
            <div id="faction-balance-adjustment-wrapper" style="margin: 10px 0px; border: 1px solid darkgray; text-align: center; overflow: hidden; overflow-x: auto;">
                <div style="margin: 5px; padding: 5px;">    
                    <button id="load-excel" class="torn-btn">加载本地excel文件</button>
                    <button id="calc" class="torn-btn">计算新存款</button>
                    <button id="clear-cache" class="torn-btn">清除缓存</button>
                </div>
                <input type="file" id="file" style="display: none;" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                <div id="tips" style="margin: 5px; padding: 5px;">以下为表格模板，金额可以为负数</div>
                <div id="result" style="margin: 5px; padding: 5px;">
                    <table style="margin: auto;">
                        <tr>
                            <th style="border: 1px solid darkgray; padding: 5px; background-color: black; color: white; font-weight: bold; text-align: center;"></th>
                            <th style="border: 1px solid darkgray; padding: 5px; background-color: black; color: white; font-weight: bold; text-align: center;">A</th>
                            <th style="border: 1px solid darkgray; padding: 5px; background-color: black; color: white; font-weight: bold; text-align: center;">B</th>
                        </tr>
                        <tr>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">1</td>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">玩家</td>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">金额</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">2</td>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">GoodLuck</td>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">200000000</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">3</td>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">cestbon</td>
                            <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">-5000000</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>`);
        
    }

    // 初始化按钮
    if (json.length > 0) {
        console.log("length:"+json.length+" type:"+typeof(json))
        const first_obj = Object.values(json)[0];
        console.log(Object.keys(first_obj).length);
        // 有计算后的完整数据
        if (Object.keys(first_obj).length >= 3) {
            $("#calc").prop("disabled", true);
        }
        // 仅有表格数据
        $("#load-excel").prop("disabled", true);
        $("#file").prop("disabled", true);
        $("#tips").text("加载成功");
        $("#result").html(json2table(json));
    }
    // 没有任何数据
    else {
        $("#calc").prop("disabled", true);
        $("#clear-cache").prop("disabled", true);
    }

    //载入按钮
    $("#load-excel").click(function(){
        console.log("button")
        document.getElementById('file').click();
    });

    $("#file").change(function(e){
        console.log("file")
        var files = e.target.files;
        if(files.length == 0) return;
        var f = files[0];
        if(!/\.xlsx$/g.test(f.name)) {
            alert('仅支持读取xlsx格式！');
            return;
        }
        readWorkbookFromLocalFile(f, function(workbook) {
            json = sheet2json(workbook);
            for (let key in json) {
                if (json[key]["玩家"] && typeof(json[key]["玩家"]) != "string") {
                    json[key]["玩家"] = json[key]["玩家"].toString();
                }
                if (json[key]["金额"] && typeof(json[key]["金额"]) != "number") {
                    json[key]["金额"] = json[key]["金额"].replace(/\$|,/g, "").trim();
                }
            }
            $("#tips").text("加载成功");
            $("#result").html(json2table(json));
            window.localStorage.setItem("BALANCE_ADJUSTMENT", JSON.stringify(json));
            $("#load-excel").prop("disabled", true);
            $("#file").prop("disabled", true);
            $("#clear-cache").removeAttr("disabled");
            $("#calc").removeAttr("disabled");
            e.target.value = "";
        });
    });

    //计算按钮
    $("#calc").click(function(){
        console.log("calc")
        const target_nodes = $("#money").find("li.depositor");
        if (json.length > 0 && target_nodes.length > 0) {
            for (let key in json) {
                const name_json = json[key]["玩家"];
                json[key]["原存款"] = "不在帮";
                json[key]["新存款"] = "不在帮";
                //console.log(name_json)
                target_nodes.each(function(){
                    const name_balance = $(this).children().children("a.name").children().text();
                    //console.log(name_balance)
                    if (name_json.trim() == name_balance.trim()) {
                        const money_value = $(this).children().children("div.amount").children("div.show").children("span.money").attr("data-value");
                        //console.log(money_value)
                        json[key]["原存款"] = parseInt(money_value);
                        json[key]["新存款"] = parseInt(json[key]["金额"]) + parseInt(money_value);
                    }
                });
            };
            console.log(json)
            $("#result").html(json2table(json));
            window.localStorage.setItem("BALANCE_ADJUSTMENT", JSON.stringify(json));
            $("#calc").prop("disabled", true);
        }
        else {
            console.log(json.length);
            console.log(target_nodes.length);
            alert('未载入excel或当前页面没有存款数据可以读取！');
        }
    });

    // 清除缓存
    $("#clear-cache").click(function(){
        const r = confirm("确定清除缓存吗？已调账进度将无法恢复");
        if (r == true) {
            console.log("clear")
            window.localStorage.removeItem("BALANCE_ADJUSTMENT");
            json = {};
            $("#clear-cache").prop("disabled", true);
            $("#calc").prop("disabled", true);
            $("#load-excel").removeAttr("disabled");
            $("#file").removeAttr("disabled");
            $("#result").empty();
            $("#tips").text("无数据");
            
        }
        else {
            console.log("clear cancelled")
        }
    });



    const interval = setInterval(updatePage, 1000);

    function updatePage() {
        const depositors = $("#money").find("li.depositor");
        if (depositors.length > 0 && json.length > 0 && Object.keys(Object.values(json)[0]).length >= 3) {
            //$("span[title^='htys']").text("1234");
            depositors.each(function(){
                if ($(this).attr("current-value") != $(this).children().children("div.amount").children("div.show").children("span.money").attr("data-value")) {
                    const cur_value = $(this).children().children("div.amount").children("div.show").children("span.money").attr("data-value");
                    const name = $(this).children().children("a.name").children().text();
                    let before_adjustment = 0;
                    let after_adjustment = 0;
                    let bgcolor = "#c0542f";
                    //console.log(name)
                    for (let key in json) {
                        if (json[key]["玩家"] == name) {
                            before_adjustment = json[key]["原存款"];
                            after_adjustment = json[key]["新存款"];
                        }
                    }
                    if (after_adjustment == cur_value) {
                        bgcolor = "#5d9525";
                    }
                    if (before_adjustment != 0 || after_adjustment != 0) {
                        $(this).find(".adj").remove();
                        $(this).children().append(`
                        <div class="adj" style="width: 140px; position: relative; left: 306px; top: -32px; z-index: 1; border: 2px solid darkgray; background-color: #65a5d1; color: white;">
                            <span style="pading: 2px; margin-left: 5px;">调账前: ${before_adjustment}</span>
                        </div>
                        <div id="${name}_adj" class="adj" style="cursor: pointer; width: 140px; position: relative; left: 456px; top: -56px; z-index: 1; border: 2px solid darkgray; background-color: ${bgcolor}; color: white;">
                            <span style="pading: 2px; margin-left: 5px;">调账后: ${after_adjustment}</span>
                        </div>`);
                        $("#"+name+"_adj").click(function(){
                            const str = $(this).children().text();
                            const num = str ? str.replace(/.*: /g, "").trim() : 0;
                            console.log(num)
                            $(this).siblings("div.amount").children("div.edit").children("div").children(":first").attr("value", num);
                            $(this).siblings("div.amount").children("div.edit").children("div").addClass("success");
                        });
                    }
                    
                    $(this).attr("current-value", cur_value);
                }
                
            });
            
        }
        
    }

    

	// 主程序调用 读取本地excel文件
	function readWorkbookFromLocalFile(file, callback) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			var workbook = XLSX.read(data, {type: 'binary'});
			if (callback) {
                callback(workbook);
                
            };
		};
		reader.readAsBinaryString(file);
	}

    // 主程序调用 将workbook转成json
	function sheet2json(workbook) {
		const sheetNames = workbook.SheetNames; // 工作表名称集合
		const worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
		return XLSX.utils.sheet_to_json(worksheet);
	}

    function json2table(obj) {
        let html = `
        <table style="margin: auto;">
            <tr>
                <th style="border: 1px solid darkgray; padding: 5px; background-color: black; color: white; font-weight: bold; text-align: center;">玩家</th>
                <th style="border: 1px solid darkgray; padding: 5px; background-color: black; color: white; font-weight: bold; text-align: center;">金额</th>
                <th style="border: 1px solid darkgray; padding: 5px; background-color: black; color: white; font-weight: bold; text-align: center;">原存款</th>
                <th style="border: 1px solid darkgray; padding: 5px; background-color: black; color: white; font-weight: bold; text-align: center;">新存款</th>
            </tr>
        `;
        for (let key in obj) {
            html += `
            <tr>
                <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">${obj[key]["玩家"] || ""}</td>
                <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">${obj[key]["金额"] || 0}</td>
                <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">${obj[key]["原存款"] || 0}</td>
                <td style="border: 1px solid darkgray; padding: 5px; background-color: white; color: black; text-align: center;">${obj[key]["新存款"] || 0}</td>
            </tr>
            `;
        }
        html += `</table>`;
        return html;
    }

})();