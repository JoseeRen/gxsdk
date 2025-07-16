"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGxEnginePlatformProxy = void 0;
const GxEngineUtil_1 = require("./GxEngineUtil");
class BaseGxEnginePlatformProxy {
    constructor() {
        this.api = {};
        this._config = {};
        this.config = {};
        this.config = {
            persistenceName: "GxEngine",
            persistenceNameOld: "GxEngine_mg"
        };
    }
    static createInstance() {
        return new BaseGxEnginePlatformProxy();
    }
    getConfig() {
        return this.config;
    }
    getStorage(e, t = false, n) {
        e = localStorage.getItem(e);
        if (!t)
            return GxEngineUtil_1.GxEngineUtil.isJSONString(e) ? JSON.parse(e) : {};
        GxEngineUtil_1.GxEngineUtil.isJSONString(e) ? n && n(JSON.parse(e)) : n && n({});
    }
    setStorage(e, t) {
        localStorage.setItem(e, t);
    }
    _setSystemProxy(e) {
        this._sysCallback = e;
    }
    getSystemInfo(e) {
        var t = {
            mp_platform: "web",
            system: this._getOs(),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            systemLanguage: navigator.language
        };
        this._sysCallback && (t = GxEngineUtil_1.GxEngineUtil.extend(t, this._sysCallback(e))),
            e.success(t),
            e.complete();
    }
    _getOs() {
        var e = navigator.userAgent;
        return /Windows/i.test(e) ? /Phone/.test(e) || /WPDesktop/.test(e) ? "Windows Phone" : "Windows" : /(iPhone|iPad|iPod)/.test(e) ? "iOS" : /Android/.test(e) ? "Android" : /(BlackBerry|PlayBook|BB10)/i.test(e) ? "BlackBerry" : /Mac/i.test(e) ? "MacOS" : /Linux/.test(e) ? "Linux" : /CrOS/.test(e) ? "ChromeOS" : "";
    }
    getNetworkType(e) {
        e.complete();
    }
    onNetworkStatusChange(e) {
    }
    getQuickDevice(e) {
    }
    request(e) {
        var t = {
            statusCode: 200,
            data: {},
            errMsg: ""
        }, n = new XMLHttpRequest;
        if (n.open(e.method, e.url), e.header)
            for (var r in e.header)
                n.setRequestHeader(r, e.header[r]);
        return n.onreadystatechange = function () {
            4 === n.readyState && 200 === n.status ? (t.statusCode = 200, GxEngineUtil_1.GxEngineUtil.isJSONString(n.responseText) && (t.data = JSON.parse(n.responseText)), e.success(t)) : 200 !== n.status && (t.errMsg = "network error", e.fail(t));
        },
            n.ontimeout = function () {
                t.errMsg = "timeout",
                    e.fail(t);
            },
            n.send(e.data),
            n;
    }
    initAutoTrackInstance(e, t) {
        this.instance = e,
            this.autoTrack = t.autoTrack;
        var n = this;
        "onpagehide" in window ? window.onpagehide = function () {
            n.onPageHide(!0);
        }
            //@ts-ignore
            : window.onbeforeunload = function () {
                n.onPageHide(!0);
            },
            n.onPageShow(),
            n.autoTrack.appHide && n.instance.timeEvent("ta_page_hide"),
            "onvisibilitychange" in document && (document.onvisibilitychange = function () {
                document.hidden ? n.onPageHide(!1) : (n.onPageShow(), n.autoTrack.appHide && n.instance.timeEvent("ta_page_hide"));
            });
    }
    setGlobal(e, t) {
        window[t] = e;
    }
    getAppOptions(e) {
    }
    showToast(e) {
    }
    onPageShow() {
        var e;
        this.autoTrack.appShow && (GxEngineUtil_1.GxEngineUtil.extend(e = {}, this.autoTrack.properties), GxEngineUtil_1.GxEngineUtil.isFunction(this.autoTrack.callback) && GxEngineUtil_1.GxEngineUtil.extend(e, this.autoTrack.callback("appShow")), this.instance._internalTrack("ta_page_show", e));
    }
    onPageHide(e) {
        var t;
        this.autoTrack.appHide && (GxEngineUtil_1.GxEngineUtil.extend(t = {}, this.autoTrack.properties), GxEngineUtil_1.GxEngineUtil.isFunction(this.autoTrack.callback) && GxEngineUtil_1.GxEngineUtil.extend(t, this.autoTrack.callback("appHide")), this.instance._internalTrack("ta_page_hide", t, new Date, null, e));
    }
}
exports.BaseGxEnginePlatformProxy = BaseGxEnginePlatformProxy;
