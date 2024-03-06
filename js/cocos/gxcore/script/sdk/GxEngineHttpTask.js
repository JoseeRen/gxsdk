"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GxEngineUtil_1 = require("./GxEngineUtil");
const GxEnginePlatformAPI_1 = require("./GxEnginePlatformAPI");
class GxEngineHttpTask {
    constructor(data, url, tryCount = 1, timeout = 5000, debugMode = "", callback) {
        this._config = null;
        this._isInit = false;
        this.data = data;
        this.serverUrl = url;
        this.callback = callback;
        this.debugMode = debugMode;
        this.tryCount = GxEngineUtil_1.GxEngineUtil.isNumber(tryCount) ? tryCount : 1;
        this.timeout = GxEngineUtil_1.GxEngineUtil.isNumber(timeout) ? timeout : 5000;
        this.taClassName = "GxEngineHttpTask";
    }
    run() {
        var n = this, e = GxEngineUtil_1.GxEngineUtil.createExtraHeaders(), t = (e["content-type"] = "application/json", "debug" === this.debugMode && (e["Turbo-Debug-Mode"] = 1), GxEnginePlatformAPI_1.GxEnginePlatformAPI.request({
            url: this.serverUrl,
            method: "POST",
            data: this.data,
            header: e,
            success: function (e) {
                console.log('请求成功');
                console.log(e);
                var t;
                0 === (null == e || null == (t = e.data) ? void 0 : t.code) ? n.onSuccess(e) : n.onFailed(e);
            },
            fail: function (e) {
                console.log('请求失败');
                console.log(e);
                n.onFailed(e);
            }
        }));
        setTimeout(function () {
            (GxEngineUtil_1.GxEngineUtil.isObject(t) || GxEngineUtil_1.GxEngineUtil.isPromise(t)) && GxEngineUtil_1.GxEngineUtil.isFunction(t.abort) && t.abort();
        }, this.timeout);
    }
    onSuccess(e) {
        var t, n;
        200 === e.statusCode ? (n = "Data Verified", null != e && null != (t = e.data) && null != (t = t.extra) && null != (t = t.errors) && t.length && (n = e.data.extra.errors), this.callback({
            code: null == e || null == (t = e.data) ? void 0 : t.code,
            msg: n
        })) : this.callback({
            code: -3,
            msg: e.statusCode
        });
    }
    onFailed(e) {
        var t, n = this;
        0 < --this.tryCount ? setTimeout(function () {
            n.run();
        }, 1e3) : this.callback({
            code: -3,
            msg: "".concat(null == e || null == (t = e.data) ? void 0 : t.msg, "：").concat(null == e || null == (t = e.data) || null == (t = t.extra) ? void 0 : t.error)
        });
    }
}
exports.default = GxEngineHttpTask;
