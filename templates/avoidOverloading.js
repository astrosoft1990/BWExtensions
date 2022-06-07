// avoid over loading in pda
try {
    const __win = window.unsafeWindow || window;
    if (__win.#name#) return;
    __win.#name# = true;
    window = __win; // fix unsafeWindow
} catch (err) {
    console.trace(err);
}