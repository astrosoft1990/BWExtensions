// 跨域操作
const UserScriptEngineEnums = Object.freeze({
    GM: 'gm',
    PDA: 'pda',
    OTHER: 'other'
});

let userScriptEngine = UserScriptEngineEnums.OTHER;
try {
    GM_xmlhttpRequest;
    userScriptEngine = UserScriptEngineEnums.GM;
} catch {
    try {
        PDA_httpGet;
        userScriptEngine = UserScriptEngineEnums.PDA;
    } catch {
    }
}

async function corsGet(url) {
    console.log(`[cors] get ${url}`);
    switch (userScriptEngine) {
        case UserScriptEngineEnums.GM:
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'get',
                    url: url,
                    ontimeout: res => reject(`timeout: ${res}`),
                    onload: res => resolve(res.response),
                    onerror: res => reject(`error: ${res}`),
                });
            });
        case UserScriptEngineEnums.PDA:
            return new Promise((resolve, reject) => {
                PDA_httpGet(`${url}`).then((res) => {
                    resolve(res.responseText);
                }).catch((err) => {
                    reject(`error: ${err}`);
                });
            });
        case UserScriptEngineEnums.OTHER:
        default:
            return new Promise((_, reject) => {
                reject(`error：当前不支持Cors操作`);
            });
    }
}