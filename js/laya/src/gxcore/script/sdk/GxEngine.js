"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEngineConfig_1 = __importDefault(require("./GxEngineConfig"));
const GxEngineLogger_1 = require("./GxEngineLogger");
const GxEngineUtil_1 = require("./GxEngineUtil");
const GxEnginePlatformAPI_1 = require("./GxEnginePlatformAPI");
const GxEnginePropertyChecker_1 = require("./GxEnginePropertyChecker");
const GxEngineSenderQueue_1 = require("./GxEngineSenderQueue");
const GxEngineSystemInformation_1 = require("./GxEngineSystemInformation");
const GxEnginePersistence_1 = require("./GxEnginePersistence");
const GxUtils_1 = __importDefault(require("../util/GxUtils"));
const DataStorage_1 = __importDefault(require("../util/DataStorage"));
const systemInformation = new GxEngineSystemInformation_1.GxEngineSystemInformation();
class GxEngine {
    constructor() {
        // this._config = Object.assign(this._config, defaultConfig,config);
        this._queue = [];
        this.senderQueue = new GxEngineSenderQueue_1.GxEngineSenderQueue();
        this.autoTrack = {};
        this.responseConfig = {
            sessionId: "",
            clickid: "",
            ecpmConfig: {
                gameTime: 10.3, //游戏时长  分钟
                targetEcpm: 300, //目标ecpm
                targetVideo: 1 //目标激励视频数
            }
        };
        this.heartInterval = 5000;
        this.initComplete = false;
        this.checkInterval = 20;
        this.gameTime = 0;
        this.videoReward = 0;
        this.reported = false;
        this.checkAdTargetTimeout = -1;
        this.gameTimeEnd = false;
    }
    _errorPromise(e) {
        return Promise.reject(new Error(e));
    }
    /**
     * 初始化
     *
     */
    init(config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.initComplete) {
                // GxEngineLogger.warn("重复初始化");
                reject(this._errorPromise("重复初始化"));
                return;
            }
            let gxEngineConfig = new GxEngineConfig_1.default();
            if (!config.openId) {
                // GxEngineLogger.warn("openId不能为空");
                // reject("openId不能为空");
                reject(this._errorPromise("openId不能为空"));
                return;
            }
            if (!config.appToken) {
                // GxEngineLogger.warn("appToken不能为空");
                // reject("appToken不能为空");
                reject(this._errorPromise("appToken不能为空"));
                return;
            }
            systemInformation.getSystemInfo(() => {
            });
            this._queue = [];
            this._config = Object.assign(gxEngineConfig, config);
            this._config.appToken = GxEngineUtil_1.GxEngineUtil.checkAppId(this._config.appToken);
            let data = {
                appToken: this._config.appToken,
                openId: this._config.openId,
                appId: this._config.appId,
                launchOptions: GxEnginePlatformAPI_1.GxEnginePlatformAPI.getAppOptions()
            };
            this.serverUrl = `${this._config.BASE_URL}/event_center/event/collect`;
            this.store = new GxEnginePersistence_1.GxEnginePersistence(this._config, () => {
                // this._updateState();
            });
            let url = `${this._config.BASE_URL}/event_center/user/login`;
            let resp = null;
            try {
                resp = yield this.sendNetWork(url, data);
                console.log(JSON.stringify(resp));
                if (resp.code !== 1) {
                    return reject(resp);
                }
            }
            catch (e) {
                return reject(resp);
            }
            GxEnginePlatformAPI_1.GxEnginePlatformAPI.setGlobal(this, this._config.engineName);
            this.responseConfig = resp.data;
            if (resp.data["heartInterval"] && GxUtils_1.default.isNumber(resp.data["heartInterval"])) {
                let number = Number(resp.data.heartInterval);
                if (number < 5000) {
                    number = 5000;
                }
                this.heartInterval = number;
            }
            /* 获取ecpm配置 和clickid  sessionid */
            // this.autoTrack = GxEnginePlatformAPI.initAutoTrackInstance(this, this._config);
            setInterval(() => {
                this.heartBeat();
            }, this.heartInterval);
            this.initComplete = true;
            if (!!this.responseConfig.clickid) {
                //是买量用户
                setInterval(() => {
                    let interval = setInterval(() => {
                        this.gameTime += this.checkInterval;
                        if (this.gameTime >= this.responseConfig.ecpmConfig.gameTime * 60 && !this.gameTimeEnd) {
                            this.gameTimeEnd = true;
                            this.checkAdTarget();
                            clearInterval(interval);
                        }
                    }, 5000);
                    //10秒检查 一次
                    setTimeout(() => {
                        this.checkAdTarget();
                    }, this.checkInterval * 1000);
                }, this.checkInterval * 1000);
            }
            resolve(resp);
        }));
    }
    rewardAdEnd() {
        console.log("视频完了了");
        this.videoReward++;
        this.checkAdTarget();
    }
    checkAdTarget() {
        clearTimeout(this.checkAdTargetTimeout);
        this._checkAdTarget();
        this.checkAdTargetTimeout = setTimeout(() => {
            this.checkAdTarget();
        }, this.checkInterval * 1000);
    }
    _checkAdTarget() {
        //玩游戏大于等于10分钟
        if ((this.gameTime >= this.responseConfig.ecpmConfig.gameTime * 60 &&
            this.videoReward >= this.responseConfig.ecpmConfig.targetVideo) ||
            window["rywDEBUG"]) {
            if (DataStorage_1.default.getItem("__ttTaq__") == "true") {
                console.log("本地已经有上报记录了");
                return;
            }
            if (this.reported) {
                console.log("正在上报");
                return;
            }
            this.reported = true;
            /*     let item = DataStorage.getItem("__tt_lastTime__");
                                  if (!item || item == "" || item == null) {
                                      DataStorage.setItem("__tt_lastTime__", data)
                                      item = data;
                                  }
                                  if (item != data) {
                                      console.log("不是当天的用户 不激活了")
                                      return;
                                  }*/
            let self = this;
            let targetEcpm = self.responseConfig.ecpmConfig.targetEcpm;
            if (targetEcpm == 0) {
                /*0直接 上报*/
                self.sendToTAQ("game_addiction", (res) => {
                    //服务端控制 每次上报
                    // DataStorage.setItem('__ttTaq__', 'true')
                    if (res) {
                    }
                    else {
                        self.reported = false;
                    }
                });
                return;
            }
            if (window["tt"]) {
                this.sendNetWork(`${this._config.BASE_URL}/bytedance/ecpm/listByOpenId`, {
                    openId: this._config.openId,
                    appId: this._config.appId,
                    appToken: this._config.appToken
                }).then(result => {
                    GxEngineLogger_1.GxEngineLogger.info(result);
                    if (result.code == 1) {
                        GxEngineLogger_1.GxEngineLogger.info("获取ecpm成功：");
                        let records = result.data.records;
                        let length = records.length;
                        let allConst = 0;
                        for (let i = 0; i < length; i++) {
                            let record = records[i];
                            allConst += record.cost;
                        }
                        console.log("总共的const:" + allConst);
                        let ecpm = ((allConst / 100000) * 1000) / length;
                        if (allConst <= 0 || length <= 0) {
                            // self.reported = false;
                            // console.log("ecpm没达到" + self.ecpmObj.targetEcpm + "  现在是0")
                            // return
                            ecpm = 0;
                        }
                        GxEngineLogger_1.GxEngineLogger.info("当前计算的ecmp:" + ecpm);
                        if (ecpm >= targetEcpm) {
                            GxEngineLogger_1.GxEngineLogger.info("ecpm达到" + targetEcpm + " 上报");
                            self.sendToTAQ("game_addiction", (res) => {
                                //服务端控制 每次上报
                                // DataStorage.setItem('__ttTaq__', 'true')
                                if (res) {
                                }
                                else {
                                    self.reported = false;
                                }
                            });
                        }
                        else {
                            self.reported = false;
                            GxEngineLogger_1.GxEngineLogger.info("ecpm没达到" + targetEcpm);
                        }
                    }
                    else {
                        GxEngineLogger_1.GxEngineLogger.info("获取ecpm失败！" + result["msg"]);
                        self.reported = false;
                    }
                }).catch(e => {
                    GxEngineLogger_1.GxEngineLogger.info("获取ecpm失败！");
                    GxEngineLogger_1.GxEngineLogger.info(e);
                    self.reported = false;
                });
            }
            else if (window["ks"]) {
                this.sendNetWork(`${this._config.BASE_URL}/kuaishou/ecpm/listByOpenId`, {
                    openId: this._config.openId,
                    appId: this._config.appId,
                    appToken: this._config.appToken
                }).then(result => {
                    GxEngineLogger_1.GxEngineLogger.info(result);
                    if (result.code == 1) {
                        GxEngineLogger_1.GxEngineLogger.info("获取ecpm成功：");
                        let records = result.data.records;
                        let length = records.length;
                        let allConst = 0;
                        for (let i = 0; i < length; i++) {
                            let record = records[i];
                            allConst += record.cost;
                        }
                        console.log("总共的const:" + allConst);
                        let ecpm = ((allConst / 1000) * 1000) / length;
                        if (allConst <= 0 || length <= 0) {
                            // self.reported = false;
                            // console.log("ecpm没达到" + self.ecpmObj.targetEcpm + "  现在是0")
                            // return
                            ecpm = 0;
                        }
                        GxEngineLogger_1.GxEngineLogger.info("当前计算的ecmp:" + ecpm);
                        if (ecpm >= targetEcpm) {
                            GxEngineLogger_1.GxEngineLogger.info("ecpm达到" + targetEcpm + " 上报");
                            self.sendToTAQ("game_addiction", (res) => {
                                //服务端控制 每次上报
                                // DataStorage.setItem('__ttTaq__', 'true')
                                if (res) {
                                }
                                else {
                                    self.reported = false;
                                }
                            });
                        }
                        else {
                            self.reported = false;
                            GxEngineLogger_1.GxEngineLogger.info("ecpm没达到" + targetEcpm);
                        }
                    }
                    else {
                        GxEngineLogger_1.GxEngineLogger.info("获取ecpm失败！" + result["msg"]);
                        self.reported = false;
                    }
                }).catch(e => {
                    GxEngineLogger_1.GxEngineLogger.info("获取ecpm失败！");
                    GxEngineLogger_1.GxEngineLogger.info(e);
                    self.reported = false;
                });
            }
        }
        else {
            console.log(this.responseConfig.ecpmConfig);
            console.log("时间：" +
                (this.gameTime >= this.responseConfig.ecpmConfig.gameTime * 60) +
                "激励次数：" +
                (this.videoReward >= this.responseConfig.ecpmConfig.targetVideo));
        }
    }
    sendToTAQ(event, callback) {
        let clickId = this.responseConfig.clickid;
        if (!clickId) {
            console.warn("clickId空  不上报 了");
            callback(false);
            return;
        }
        let self = this;
        this.sendNetWork(`${this._config.BASE_URL}/event_center/user/report`, {
            appToken: this._config.appToken,
            appId: this._config.appId,
            clickid: clickId,
            openId: this._config.openId,
            eventType: event
        }, "POST").then(result => {
            if (result.code == 1) {
                callback(true);
            }
            else {
                callback(false);
            }
        }).catch(e => {
            GxEngineLogger_1.GxEngineLogger.warn(e);
            callback(false);
        });
    }
    // _updateState(e = null): void {
    //     if (GxEngineUtil.isObject(e)) {
    //         GxEngineUtil.extend(this._state, e);
    //     }
    //     this._onStateChange();
    //     GxEngineUtil.each(this.instances, (e) => {
    //         this[e]._onStateChange();
    //     });
    // }
    //
    // _onStateChange(): void {
    //     if (this._isReady() && this._queue && this._queue.length > 0) {
    //         GxEngineUtil.each(this._queue, (e) => {
    //             this[e[0]].apply(this, slice.call(e[1]));
    //         });
    //         this._queue = [];
    //     }
    // }
    heartBeat() {
        this.eventTrack("$heart", {});
    }
    eventTrack(eventName, properties = {}, time = null, onComplete = null) {
        let i;
        if (this._isObjectParams(eventName)) {
            i = eventName;
            eventName = i.eventName;
            properties = i.properties;
            time = i.time;
            onComplete = i.onComplete;
        }
        if (GxEnginePropertyChecker_1.GxEnginePropertyChecker.event(eventName) && GxEnginePropertyChecker_1.GxEnginePropertyChecker.properties(properties)) {
            this._internalTrack(eventName, properties, time, onComplete);
        }
        else {
            onComplete && onComplete({ code: -1, msg: "invalid parameters" });
        }
    }
    _internalTrack(e, t, n = null, onComplete = null, i) {
        n = GxEngineUtil_1.GxEngineUtil.isDate(n) ? n : new Date;
        if (this._isReady()) {
            this._sendRequest({
                type: "track",
                eventName: e,
                properties: t,
                onComplete: onComplete
            }, n, i);
        }
        else {
            this._queue.push(["_internalTrack", [e, t, n, onComplete]]);
        }
    }
    _sendRequest(e, time, n = null) {
        let r;
        let i;
        if (this._hasDisabled()) {
            return;
        }
        if (!GxEngineUtil_1.GxEngineUtil.isUndefined(this._config.disableEventList) && this._config.disableEventList.includes(e.eventName)) {
            GxEngineLogger_1.GxEngineLogger.info("disabled Event : " + e.eventName);
            return;
        }
        time = GxEngineUtil_1.GxEngineUtil.isDate(time) ? time : new Date;
        let t = {
            event_list: [{
                    type: e.type,
                    time: new Date(time).getTime(),
                    event: "",
                    properties: {},
                    sessionId: this.responseConfig.sessionId
                }],
            appToken: this._config.appToken,
            appId: this._config.appId,
            openId: this._config.openId,
            clickid: this.responseConfig.clickid
        };
        t.event_list[0].event = e.eventName;
        if ("track" === e.type) {
            t.event_list[0].properties = this.getSendProperties();
            r = this.store.removeEventTimer(e.eventName);
            if (!GxEngineUtil_1.GxEngineUtil.isUndefined(r)) {
                r = (new Date).getTime() - r;
                if (r > 86400) {
                    r = 86400;
                }
                else if (r < 0) {
                    r = 0;
                }
                t.event_list[0].properties["$event_duration"] = r;
            }
        }
        else {
            t.event_list[0].properties = {};
        }
        if (GxEngineUtil_1.GxEngineUtil.isObject(e.properties) && !GxEngineUtil_1.GxEngineUtil.isEmptyObject(e.properties)) {
            GxEngineUtil_1.GxEngineUtil.extend(t.event_list[0].properties, e.properties);
        }
        GxEngineUtil_1.GxEngineUtil.searchObjDate(t.event_list[0]);
        // GxEngineLogger.info(JSON.stringify(t, null, 4));
        r = this.serverUrl;
        if (GxEngineUtil_1.GxEngineUtil.isBoolean(this._config.enableEncrypt) && this._config.enableEncrypt) {
            t.event_list[0] = GxEngineUtil_1.GxEngineUtil.generateEncryptyData(t.event_list[0], void 0);
        }
        if (n) {
            if (n instanceof FormData) {
                if (this._config.debugMode === "debug") {
                    n.append("source", "client");
                    n.append("appid", this._config.appToken);
                    n.append("deviceId", "this.getDeviceId()");
                    n.append("data", JSON.stringify(t.event_list[0]));
                }
                else {
                    i = GxEngineUtil_1.GxEngineUtil.base64Encode(JSON.stringify(t));
                    n.append("data", i);
                }
                navigator.sendBeacon(r, n);
                if (GxEngineUtil_1.GxEngineUtil.isFunction(e.onComplete)) {
                    e.onComplete({ statusCode: 200 });
                }
            }
            else {
            }
        }
        else {
            this.senderQueue.enqueue(t, r, {
                maxRetries: this._config.maxRetries,
                sendTimeout: this._config.sendTimeout,
                callback: e.onComplete,
                debugMode: this._config.debugMode
            });
        }
        /*    var r,
              i;
          this._hasDisabled() || (!GxEngineUtil.isUndefined(this._config.disableEventList) && this._config.disableEventList.includes(e.eventName)


              ? GxEngineLogger.info("disabled Event : " + e.eventName)
              : (t = GxEngineUtil.isDate(t) ? t : new Date, (t = {
              event_list: [{
                  type: e.type,
                  event:"",
                  time: new Date(t).getTime()
              }
              ]
          }).event_list[0].event = e.eventName, "track" === e.type ? (t.event_list[0].properties = this.getSendProperties(), r = this.store.removeEventTimer(e.eventName), GxEngineUtil.isUndefined(r) || (r = (new Date).getTime() - r, 86400 < (r = parseFloat((r / 1e3).toFixed(3))) ? r = 86400 : r < 0 && (r = 0), t.event_list[0].properties.$event_duration = r)) : t.event_list[0].properties = {}, GxEngineUtil.isObject(e.properties) && !GxEngineUtil.isEmptyObject(e.properties) && GxEngineUtil.extend(t.event_list[0].properties, e.properties), GxEngineUtil.searchObjDate(t.event_list[0]), t.client_id = this.appId, GxEngineLogger.info(JSON.stringify(t, null, 4)), r = this.serverUrl, GxEngineUtil.isBoolean(this._config.enableEncrypt) && 1 == this.config.enableEncrypt && (t.event_list[0] = GxEngineUtil.generateEncryptyData(t.event_list[0], void 0)), n ? (n = new FormData, "debug" === this.config.debugMode ? (n.append("source", "client"), n.append("appid", this.appId), n.append("deviceId", this.getDeviceId()), n.append("data", JSON.stringify(t.event_list[0]))) : (i = GxEngineUtil.base64Encode(JSON.stringify(t)), n.append("data", i)), navigator.sendBeacon(r, n), GxEngineUtil.isFunction(e.onComplete) && e.onComplete({
              statusCode: 200
          })) : this.senderQueue.enqueue(t, r, {
              maxRetries: this._config.maxRetries,
              sendTimeout: this._config.sendTimeout,
              callback: e.onComplete,
              debugMode: this._config.debugMode
          })));
          console.log("send:" + e);*/
    }
    getSendProperties() {
        try {
            const properties = GxEngineUtil_1.GxEngineUtil.extend({}, systemInformation.properties);
            for (const key in properties) {
                if (typeof properties[key] === "string") {
                    properties[key] = properties[key].substring(0, 8192);
                }
            }
            return properties;
        }
        catch (error) {
            return {};
        }
    }
    _hasDisabled() {
        return false;
    }
    _isReady() {
        return this.initComplete && this._config.appToken && !!this._config.openId;
    }
    _isObjectParams(e) {
        return GxEngineUtil_1.GxEngineUtil.isObject(e) && GxEngineUtil_1.GxEngineUtil.isFunction(e.onComplete);
    }
    sendNetWork(url, data, method = "POST") {
        return new Promise((resolve, n) => {
            GxEnginePlatformAPI_1.GxEnginePlatformAPI.request({
                url: url,
                method: method,
                data: typeof data === "string" ? data : JSON.stringify(data),
                header: {
                    "content-type": "application/json"
                },
                success: (e) => {
                    console.log("successssss");
                    e.statusCode === 200 ? resolve(e.data) : n(e);
                },
                fail: (e) => {
                    GxEngineLogger_1.GxEngineLogger.warn(e);
                    n(e);
                }
            });
        });
    }
    timeEvent(e, t = null) {
        /*  if (!this._hasDisabled()) {
              t = GxEngineUtil.isDate(t) ? t : new Date();
              if (this._isReady()) {
                  if (GxEnginePropertyChecker.event(e) || !this.config.strict) {
                      this.store.setEventTimer(e, t.getTime());
                  } else {
                      GxEngineLogger.warn("calling timeEvent failed due to invalid eventName: " + e);
                  }
              } else {
                  this._queue.push(["timeEvent", [e, t]]);
              }
          }*/
    }
    getClickId() {
        return this.responseConfig.clickid;
    }
}
exports.default = GxEngine;
