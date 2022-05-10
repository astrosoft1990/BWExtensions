(function(){

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.bwextTest) return;
        __win.bwextTest = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }
    
    alert("**** **** ** hello world");
})();