"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
class GxEngineConfig {
    constructor() {
        /*
            autoTrack: {
                appLaunch: true, // 自动采集 $MPLaunch
                appShow: true, // 自动采集 $MPShow
                appHide: true, // 自动采集 $MPHide
            }
        */
        this.appId = "";
        this.appToken = "";
        this.openId = "";
        this.unionId = "";
        // BASE_URL = "http://localhost:19800/api1";
        this.BASE_URL = "https://api.sjzgxwl.com";
        this.engineName = "gxe";
        this.maxRetries = 1;
        this.sendTimeout = 5000;
        this.disableEventList = [];
        this.enableEncrypt = false;
        this.debugMode = "";
        this.persistenceName = "GxEngine";
        this.persistenceNameOld = "GxEngine_persistence";
    }
}
/*
    BASE_URL = "https://api.sjzgxwl.com";
    BASE_URL = "https://z16d760759.oicp.vip/api1";
    BASE_URL = "http://api.renyaowei.top/debug/api1";
*/
GxEngineConfig.LIB_VERSION = "4.7.6";
GxEngineConfig.LIB_NAME = "MG";
GxEngineConfig.LIB_STACK = "MiniGame";
exports.default = GxEngineConfig;
