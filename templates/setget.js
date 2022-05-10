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
        console.log(err);
        return val;
    }
}

function ext_setValue(key, val) {
    return window.localStorage.setItem(key, JSON.stringify(val));
}