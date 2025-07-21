"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEnginePlatformProxy = void 0;
const BaseGxEnginePlatformProxy_1 = require("./BaseGxEnginePlatformProxy");
const GxEngineLogger_1 = require("./GxEngineLogger");
const GxEngineUtil_1 = require("./GxEngineUtil");
const GxEngineAutoTrackBridge_1 = require("./GxEngineAutoTrackBridge");
class GxEnginePlatformProxy {
    constructor(e, t, n) {
        this.api = {};
        this._config = {};
        this.config = {};
        this.api = e;
        this.config = t;
        this._config = n;
    }
    static createInstance() {
        if (window["qq"]) {
            return this._createInstance("qq_mg");
        }
        else if (window["tt"]) {
            return this._createInstance("tt_mg");
        }
        else if (window["ks"]) {
            return this._createInstance("kuaishou_mg");
        }
        else if (window["wx"]) {
            return this._createInstance("wechat_mg");
        }
    }
    static _createInstance(platfromName) {
        switch (platfromName) {
            case "wechat_mp":
                return new GxEnginePlatformProxy(wx, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_wechat"
                }, {
                    mpPlatform: "wechat",
                    mp: !0,
                    platform: platfromName
                });
            case "wechat_mg":
                return new GxEnginePlatformProxy(wx, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_wechat_game"
                }, {
                    mpPlatform: "wechat",
                    platform: platfromName
                });
            case "qq_mp":
                return new GxEnginePlatformProxy(qq, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_qq"
                }, {
                    mpPlatform: "qq",
                    mp: !0,
                    platform: platfromName
                });
            case "qq_mg":
                return new GxEnginePlatformProxy(qq, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_qq_game"
                }, {
                    mpPlatform: "qq",
                    platform: platfromName
                });
            case "baidu_mp":
                return new GxEnginePlatformProxy(swan, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_swan"
                }, {
                    mpPlatform: function (e) {
                        return e.host;
                    },
                    mp: !0,
                    platform: platfromName
                });
            case "baidu_mg":
                return new GxEnginePlatformProxy(swan, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_swan_game"
                }, {
                    mpPlatform: function (e) {
                        return e.host;
                    },
                    platform: platfromName
                });
            case "tt_mg":
                return new GxEnginePlatformProxy(tt, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_tt_game"
                }, {
                    mpPlatform: function (e) {
                        return e.appName;
                    },
                    platform: platfromName
                });
            case "tt_mp":
                return new GxEnginePlatformProxy(tt, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_tt"
                }, {
                    mpPlatform: function (e) {
                        return e.appName;
                    },
                    mp: !0,
                    platform: platfromName
                });
            case "ali_mp":
                return new GxEnginePlatformProxy(my, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_ali"
                }, {
                    mpPlatform: function (e) {
                        return e.app;
                    },
                    mp: !0,
                    platform: platfromName
                });
            case "dd_mp":
                return new GxEnginePlatformProxy(dd, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_dd"
                }, {
                    mpPlatform: "dingding",
                    mp: !0,
                    platform: platfromName
                });
            case "bl_mg":
                return new GxEnginePlatformProxy(bl, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_mg"
                }, {
                    mpPlatform: "bilibili",
                    platform: platfromName
                });
            case "kuaishou_mp":
                return new GxEnginePlatformProxy(ks, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_kuaishou_program"
                }, {
                    mpPlatform: "kuaishou",
                    mp: !0,
                    platform: platfromName
                });
            case "kuaishou_mg":
                return new GxEnginePlatformProxy(ks, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_kuaishou_game"
                }, {
                    mpPlatform: "kuaishou_game",
                    platform: platfromName
                });
            case "qh360_mg":
                return new GxEnginePlatformProxy(qh, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_qh360"
                }, {
                    mpPlatform: "qh360",
                    platform: platfromName
                });
            case "tb_mp":
                return new GxEnginePlatformProxy(my, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_tb"
                }, {
                    mpPlatform: "tb",
                    mp: !0,
                    platform: platfromName
                });
            case "jd_mp":
                return new GxEnginePlatformProxy(jd, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_jd"
                }, {
                    mpPlatform: "jd",
                    mp: !0,
                    platform: platfromName
                });
            case "qh360_mp":
                return new GxEnginePlatformProxy(qh, {
                    persistenceName: "GxEngine",
                    persistenceNameOld: "GxEngine_qh360"
                }, {
                    mpPlatform: "qh360",
                    mp: !0,
                    platform: platfromName
                });
            case "WEB":
                return BaseGxEnginePlatformProxy_1.BaseGxEnginePlatformProxy.createInstance();
        }
    }
    getConfig() {
        return this.config;
    }
    getStorage(key, async = false, callback) {
        if (!async) {
            const storageData = this._config.platform === "dd_mp" ?
                this.api.getStorageSync({ key: key }) :
                this.api.getStorageSync(key);
            const parsedData = GxEngineUtil_1.GxEngineUtil.isJSONString(storageData) ? JSON.parse(storageData) : {};
            // callback && callback(parsedData);
            return parsedData;
        }
        else {
            this.api.getStorage({
                key: key,
                success: (result) => {
                    const parsedData = GxEngineUtil_1.GxEngineUtil.isJSONString(result.data) ? JSON.parse(result.data) : {};
                    callback && callback(parsedData);
                },
                fail: () => {
                    GxEngineLogger_1.GxEngineLogger.warn("getStorage failed");
                    callback && callback({});
                }
            });
        }
    }
    setStorage(key, data) {
        this.api.setStorage({
            key: key,
            data: data
        });
    }
    _getPlatform() {
        return "";
    }
    getSystemInfo(callback) {
        const mpPlatform = this._config.mpPlatform;
        this.api.getSystemInfo({
            success: (result) => {
                GxEngineUtil_1.GxEngineUtil.isFunction(mpPlatform) ? result.mp_platform = mpPlatform(result) : result.mp_platform = mpPlatform;
                callback.success(result);
                if (mpPlatform === "wechat") {
                    callback.complete();
                }
            },
            complete: () => {
                callback.complete();
            }
        });
    }
    getNetworkType(callback) {
        if (GxEngineUtil_1.GxEngineUtil.isFunction(this.api.getNetworkType)) {
            this.api.getNetworkType({
                success: (result) => {
                    callback.success(result);
                },
                complete: () => {
                    callback.complete();
                }
            });
        }
        else {
            callback.success({});
            callback.complete();
        }
    }
    onNetworkStatusChange(callback) {
        if (GxEngineUtil_1.GxEngineUtil.isFunction(this.api.onNetworkStatusChange)) {
            this.api.onNetworkStatusChange(callback);
        }
        else {
            callback({});
        }
    }
    request(options) {
        let modifiedOptions;
        if (["ali_mp", "dd_mp"].includes(this._config.platform)) {
            modifiedOptions = GxEngineUtil_1.GxEngineUtil.extend({}, options);
            modifiedOptions.headers = options.header;
            modifiedOptions.success = (result) => {
                result.statusCode = result.status;
                options.success(result);
            };
            modifiedOptions.fail = (result) => {
                result.errMsg = result.errorMessage;
                options.fail(result);
            };
            if (this._config.platform === "dd_mp") {
                return this.api.httpRequest(modifiedOptions);
            }
            else {
                return this.api.request(modifiedOptions);
            }
        }
        else {
            return this.api.request(options);
        }
    }
    initAutoTrackInstance(e, t) {
        if (GxEngineUtil_1.GxEngineUtil.isObject(t.autoTrack)) {
            t.autoTrack.isPlugin = t.is_plugin;
        }
        // return new (this._config.mp ? GxEngineBaseAutoTrackBridge : GxEngineAutoTrackBridge)(e, t.autoTrack, this.api);
        return new GxEngineAutoTrackBridge_1.GxEngineAutoTrackBridge(e, t.autoTrack, this.api);
    }
    setGlobal(e, t) {
        if (this._config.mp) {
            GxEngineLogger_1.GxEngineLogger.warn("GravityAnalytics: we do not set global name for GE instance when you do not enable auto track.");
        }
        else {
            window[t] = e; // Assuming it's running in a browser environment
        }
    }
    getAppOptions(e) {
        let options = {};
        try {
            options = this.api.getLaunchOptionsSync();
        }
        catch (error) {
            GxEngineLogger_1.GxEngineLogger.warn("Cannot get launch options.");
        }
        if (GxEngineUtil_1.GxEngineUtil.isFunction(e)) {
            try {
                this._config.mp ? this.api.onAppShow(e) : this.api.onShow(e);
            }
            catch (error) {
                GxEngineLogger_1.GxEngineLogger.warn("Cannot register onShow callback.");
            }
        }
        /*        options["query"]["account_id"]=26017256
                options["query"]["creative_id"]=42351559072
                options["query"]["callback"]="DHAJASALKFyk1uCKBYCyXp-iIDS-uHDd_a5SJ9Dbwkqv46dahahd87TW7hhkJkd"
                options["query"]["campaign_id"]=1946406096
                options["query"]["unit_id"]=3721205019*/
        return options;
    }
    showToast(message) {
        let options;
        if (GxEngineUtil_1.GxEngineUtil.isFunction(this.api.showToast)) {
            options = { title: message };
            if (this._config.platform === "dd_mp" || this._config.platform === "ali_mp") {
                options.content = message;
            }
            this.api.showToast(options);
        }
    }
}
exports.GxEnginePlatformProxy = GxEnginePlatformProxy;
