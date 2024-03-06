"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEnginePlatformAPI = void 0;
const GxEnginePlatformProxy_1 = require("./GxEnginePlatformProxy");
class GxEnginePlatformAPI {
    static _getCurrentPlatform() {
        return this.currentPlatform || (this.currentPlatform = GxEnginePlatformProxy_1.GxEnginePlatformProxy.createInstance());
    }
    static getConfig() {
        return this._getCurrentPlatform().getConfig();
    }
    static getStorage(e, t = false, n = null) {
        return this._getCurrentPlatform().getStorage(e, t, n);
    }
    static setStorage(e, t) {
        return this._getCurrentPlatform().setStorage(e, t);
    }
    static getSystemInfo(e) {
        return this._getCurrentPlatform().getSystemInfo(e);
    }
    static getNetworkType(e) {
        return this._getCurrentPlatform().getNetworkType(e);
    }
    static getQuickDevice(e) {
        return this._getCurrentPlatform().getQuickDevice(e);
    }
    static onNetworkStatusChange(e) {
        this._getCurrentPlatform().onNetworkStatusChange(e);
    }
    static request(e) {
        return this._getCurrentPlatform().request(e);
    }
    static initAutoTrackInstance(e, t) {
        return this._getCurrentPlatform().initAutoTrackInstance(e, t);
    }
    static setGlobal(e, t) {
        e && t && this._getCurrentPlatform().setGlobal(e, t);
    }
    static getAppOptions(e = null) {
        return this._getCurrentPlatform().getAppOptions(e);
    }
    static showDebugToast(e) {
        this._getCurrentPlatform().showToast(e);
    }
}
exports.GxEnginePlatformAPI = GxEnginePlatformAPI;
