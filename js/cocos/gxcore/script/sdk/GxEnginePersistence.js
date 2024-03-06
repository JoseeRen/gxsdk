"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEnginePersistence = void 0;
const GxEnginePlatformAPI_1 = require("./GxEnginePlatformAPI");
const GxEngineUtil_1 = require("./GxEngineUtil");
const GxEngineSystemInformation_1 = require("./GxEngineSystemInformation");
const GxEngineLogger_1 = require("./GxEngineLogger");
const systemInformation = new GxEngineSystemInformation_1.GxEngineSystemInformation();
class GxEnginePersistence {
    //  is_plugin: !1,
    // maxRetries: 3,
    // sendTimeout: 5e3,
    // enablePersistence: !0,
    // asyncPersistence: !1,
    // strict: !1,
    // debugMode: "none"
    constructor(options, callback) {
        this.name = "GxEngine";
        this.enabled = options.enablePersistence;
        if (this.enabled) {
            this.name = options.persistenceName;
            this.nameOld = options.persistenceNameOld;
            if (options.asyncPersistence) {
                this._state = {};
                GxEnginePlatformAPI_1.GxEnginePlatformAPI.getStorage(this.name, true, (data) => {
                    if (GxEngineUtil_1.GxEngineUtil.isEmptyObject(data)) {
                        GxEnginePlatformAPI_1.GxEnginePlatformAPI.getStorage(this.nameOld, true, (oldData) => {
                            this._state = GxEngineUtil_1.GxEngineUtil.extend2Layers({}, oldData, this._state);
                            this._init(options, callback);
                            this._save();
                        });
                    }
                    else {
                        this._state = GxEngineUtil_1.GxEngineUtil.extend2Layers({}, data, this._state);
                        this._init(options, callback);
                        this._save();
                    }
                });
            }
            else {
                this._state = GxEnginePlatformAPI_1.GxEnginePlatformAPI.getStorage(this.name) || {};
                if (GxEngineUtil_1.GxEngineUtil.isEmptyObject(this._state)) {
                    this._state = GxEnginePlatformAPI_1.GxEnginePlatformAPI.getStorage(this.nameOld) || {};
                }
                this._init(options, callback);
            }
        }
        else {
            this._state = {};
            this._init(options, callback);
        }
    }
    _init(options, callback) {
        if (!this.getDistinctId()) {
            this.setDistinctId(GxEngineUtil_1.GxEngineUtil.UUID());
        }
        if (!options.isChildInstance && !this.getDeviceId()) {
            this._setDeviceId(GxEngineUtil_1.GxEngineUtil.UUID());
        }
        this.initComplete = true;
        if (typeof callback === "function") {
            callback();
        }
        const storageData = GxEnginePlatformAPI_1.GxEnginePlatformAPI.getStorage(this.name);
        const todayFirstSceneDate = storageData === null || storageData === void 0 ? void 0 : storageData.current_first_scene_date;
        const todayFirstScene = storageData === null || storageData === void 0 ? void 0 : storageData.current_first_scene;
        const currentDate = new Date().toLocaleDateString();
        if (todayFirstScene && todayFirstSceneDate && todayFirstSceneDate === currentDate) {
            systemInformation.properties.$today_first_scene = String(storageData === null || storageData === void 0 ? void 0 : storageData.current_first_scene);
        }
        else {
            const currentScene = String(GxEnginePlatformAPI_1.GxEnginePlatformAPI.getAppOptions().scene);
            systemInformation.properties.$today_first_scene = currentScene;
            this._state.current_first_scene = currentScene;
            this._state.current_first_scene_date = currentDate;
            this._save();
        }
    }
    _save() {
        if (this.enabled && this.initComplete) {
            GxEnginePlatformAPI_1.GxEnginePlatformAPI.setStorage(this.name, JSON.stringify(this._state));
        }
    }
    _set(e, t) {
        let properties = {};
        if (typeof e === "string") {
            properties[e] = t;
        }
        else if (typeof e === "object") {
            properties = e;
        }
        GxEngineUtil_1.GxEngineUtil.each(properties, (value, key) => {
            this._state[key] = value;
        });
        this._save();
    }
    _get(e) {
        return this._state[e];
    }
    setEventTimer(eventName, time) {
        const eventTimers = this._state.event_timers || {};
        eventTimers[eventName] = time;
        this._set("event_timers", eventTimers);
    }
    removeEventTimer(eventName) {
        if (this._state && this._state["event_timers"]) {
            let timer = this._state["event_timers"][eventName];
            if (!!timer) {
                delete this._state.event_timers[eventName];
                this._save();
            }
            return timer;
        }
        /*    const timer = (this._state.event_timers || {})[eventName];
            if (GxEngineUtil.isUndefined(timer)) {
                delete this._state.event_timers[eventName];
                this._save();
            }
            return timer; */
    }
    getDeviceId() {
        return this._state.device_id;
    }
    _setDeviceId(deviceId) {
        if (this.getDeviceId()) {
            GxEngineLogger_1.GxEngineLogger.warn("cannot modify the device id.");
        }
        else {
            this._set("device_id", deviceId);
        }
    }
    getDistinctId() {
        return this._state.distinct_id;
    }
    setDistinctId(distinctId) {
        this._set("distinct_id", distinctId);
    }
    getAccountId() {
        return this._state.account_id;
    }
    setAccountId(accountId) {
        this._set("account_id", accountId);
    }
    getSuperProperties() {
        return this._state.props || {};
    }
    setSuperProperties(properties, merge) {
        merge = merge ? properties : GxEngineUtil_1.GxEngineUtil.extend(this.getSuperProperties(), properties);
        this._set("props", merge);
    }
}
exports.GxEnginePersistence = GxEnginePersistence;
