"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("../core/GxEnum");
class HttpManager {
    static send(url, params = null, httpType = GxEnum_1.HTTP_TYPE.GET, timeout = 3000) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        }
                        catch (error) {
                            reject(xhr);
                        }
                    }
                    else {
                        reject(xhr);
                    }
                    xhr && xhr.abort && xhr.abort();
                }
            };
            xhr.onerror = err => {
                console.log('request error', err);
            };
            xhr.ontimeout = () => {
                reject(GxEnum_1.HTTP_ERROR.TIME_OUT);
                xhr && xhr.abort && xhr.abort();
            };
            if (params && typeof (params) == "object" && !params.length && !Array.isArray(params)) {
                params = JSON.stringify(params);
            }
            if (httpType == GxEnum_1.HTTP_TYPE.GET && params) {
                url += '?' + params;
                params = null;
            }
            xhr.open(httpType, url, true);
            xhr.timeout = timeout;
            if (httpType == GxEnum_1.HTTP_TYPE.POST) {
                xhr.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
            }
            xhr.send(params);
            console.log(`[gx_game]Request URL:${url}`);
            console.log(`[gx_game]Request Data:${params}`);
        });
    }
}
exports.default = HttpManager;
