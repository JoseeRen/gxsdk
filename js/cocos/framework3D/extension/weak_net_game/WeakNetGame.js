"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const Platform_1 = __importDefault(require("../Platform"));
const Net_1 = __importStar(require("../../misc/Net"));
const EventManager_1 = require("../../core/EventManager");
const SovInfo_1 = require("./SovInfo");
const gameUtil_1 = __importDefault(require("../../utils/gameUtil"));
class WeakNetGame {
    /**是否已经登陆 */
    static get isLoggedIn() {
        return this.logined_useId != null;
    }
    static requestConfig() {
        if (this.config_inited)
            return;
        return new Promise((resolve, reject) => {
            // console.log("request url:", this.serverConfig.config_url)
            Net_1.net.httpGet(this.serverConfig.config_url + "?r=" + Date.now()).then(res => {
                if (res == Net_1.default.Code.Timeout) {
                    reject('timeout');
                }
                else {
                    if (res) {
                        this.config = JSON.parse(res);
                        this.config_inited = true;
                        console.log('配置', this.config);
                        resolve();
                    }
                    else {
                        resolve();
                    }
                }
            });
        });
    }
    //share_config_url
    static requestShareConfig() {
        if (this.shareConfig_inited)
            return;
        return new Promise((resolve, reject) => {
            Net_1.net.httpGet(this.serverConfig.cdn_url + this.config.share_config_url + "?t=" + Date.now()).then(res => {
                if (res == Net_1.default.Code.Timeout) {
                    resolve();
                }
                else {
                    if (res) {
                        this.shareConfigs = JSON.parse(res);
                        this.shareConfig_inited = true;
                        console.log('分享配置', this.shareConfigs);
                        resolve();
                    }
                    else {
                        resolve();
                    }
                }
            });
        });
    }
    //csv_url
    static downloadCsv(name) {
        //5秒以内无需下载 
        let time = Date.now();
        let cache = this._configstr_cache[name];
        if (cache && time - cache.timestamp <= 1000 * 10) {
            console.log("刚已下载并加载表： " + name);
            return Promise.resolve();
        }
        let url = this.serverConfig.cdn_url + this.config.csv_url + name + '.csv' + "?t=" + Date.now();
        return new Promise((resolve, reject) => {
            console.log("download csv:" + name);
            Net_1.net.httpGet(url).then(res => {
                if (res == Net_1.default.Code.Timeout) {
                    csv.load("Config/csv/" + name, resolve, reject);
                }
                else {
                    if (res) {
                        csv.loadString(name, res, resolve);
                        delete this._configstr_cache[name];
                        this._configstr_cache[name] = { timestamp: Date.now(), data: res };
                    }
                    else {
                        csv.load("Config/csv/" + name, resolve, reject);
                    }
                }
            });
        });
    }
    static loadLocalCsv(name, callback) {
        return new Promise((resolve, reject) => {
            console.log("load local csv:" + name);
            csv.load("Config/csv/" + name, resolve, reject);
            if (callback)
                callback(name);
        });
    }
    static loadLocalCsvs(callback) {
        if (this.config.local_csv == null) {
            return new Promise((resolve, reject) => {
                csv.loadDir("Config/csv", resolve, reject);
            });
        }
        else {
            if (this.config.local_csv.length > 0) {
                let arr = [];
                this.config.local_csv.forEach(v => {
                    let p = this.loadLocalCsv(v, callback);
                    arr.push(p);
                });
                return Promise.all(arr);
            }
        }
    }
    static downloadCsvs() {
        if (this.config.csv.length == 0) {
            csv.loadDir("Config/csv");
        }
        else {
            let arr = [];
            this.config.csv.forEach(v => {
                let p = this.downloadCsv(v);
                arr.push(p);
            });
            return Promise.all(arr);
        }
    }
    static login() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = { openId: this.serverConfig.openId };
            if (CC_WECHAT) {
                Platform_1.default.login();
                let [code] = yield EventManager_1.evt.wait("wxlogin");
                let options = wx.getLaunchOptionsSync();
                params = {
                    code,
                    type: "wxlogin",
                    query: JSON.stringify(options.query),
                    scene: options.scene
                };
            }
            let res = yield this.client.httpGet(this.serverConfig.root_url + "/game/login", params);
            if (res == Net_1.default.Code.Timeout) {
                console.log("登陆失败", this.retry_count);
                return false;
                //重新登陆 
                // if (this.retry_count <= 1) {
                //     this.retry_count++;
                //     return await this.login();
                // } else {
                //     return false;
                // }
            }
            else {
                if (res) {
                    let ret = JSON.parse(res);
                    console.log("登陆返回", ret);
                    if (ret.data) {
                        this.client.setHeader("Authorization", ret.data.token);
                        console.log('登陆成功', ret.data);
                        this.logined_useId = ret.data.openId;
                        this.retry_count = 0;
                        this.userInfo = ret.data;
                        return true;
                    }
                    console.log("登陆失败");
                    return false;
                }
                else {
                    console.log("登陆失败", this.retry_count);
                    return false;
                    //重新登陆 
                    // if (this.retry_count <= 1) {
                    //     this.retry_count++;
                    //     return await this.login();
                    // } else {
                    //     return false;
                    // }
                }
            }
        });
    }
    static syncData(v, openId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (openId == null) {
                if (WeakNetGame.isLoggedIn) {
                    openId = this.logined_useId;
                }
                else {
                    return console.warn("上传数据！，未登陆且未指定用户id");
                }
            }
            return this.syncDataToTable(v, 'user', openId);
        });
    }
    /**
     * 上传数据到指定远端服务器
     * @param v 数据
     * @param table  指定表
     * @param id  数据id
     */
    static syncDataToTable(v, table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id == null) {
                return console.warn("上传数据！未指定id !");
            }
            let res = yield this.client.httpPut(this.serverConfig.root_url + "/" + table + "/" + id, v);
            if (res == Net_1.default.Code.Timeout) {
                console.log("上传数据 超时....");
                return false;
            }
            else {
                if (res) {
                    let ret = JSON.parse(res);
                    console.log(ret);
                    return ret;
                }
                else {
                    console.warn("同步数据失败");
                    return false;
                }
            }
        });
    }
    static loadUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            //拉取用户数据
            if (!this.isLoggedIn)
                return console.warn("拉取数据时：未登录");
            if (this.userInfo) {
                return this.userInfo;
            }
            console.log("拉取用户数据");
            let res = yield this.client.httpGet(this.serverConfig.root_url + "/user/" + this.logined_useId);
            if (res == Net_1.default.Code.Timeout) {
                return this.userInfo;
            }
            else {
                if (res) {
                    let ret = JSON.parse(res);
                    if (!ret.errno) {
                        return ret.data;
                    }
                }
                else {
                    return this.userInfo;
                }
            }
        });
    }
    static setVideoWatchedCount(c) {
        this.video_watched_count = c;
        localStorage.setItem("__video_watched_count__", this.video_watched_count + "");
        localStorage.setItem("__video_watched_date__", Date.now().toString());
    }
    static setShareFailCount(c) {
        this.share_fail_count = c;
        localStorage.setItem("_share_fail_count_", this.share_fail_count + "");
        localStorage.setItem("_share_fail_date_", Date.now().toString());
    }
    static setShareSuccCount(c) {
        this.share_succ_count = c;
        localStorage.setItem("_share_succ_count_", this.share_succ_count + "");
        localStorage.setItem("_share_succ_date_", Date.now().toString());
    }
    static initUserData() {
        let video_watched_count = localStorage.getItem('__video_watched_count__');
        let video_watched_date = localStorage.getItem("__video_watched_date__");
        let fail_share_count = localStorage.getItem('_share_fail_count_');
        let fail_share_date = localStorage.getItem("_share_fail_date_");
        let succ_share_count = localStorage.getItem('_share_succ_count_');
        let succ_share_date = localStorage.getItem("_share_succ_date_");
        let d = parseInt(video_watched_date);
        let c = parseInt(video_watched_count);
        if (isNaN(c)) {
            this.setVideoWatchedCount(0);
        }
        else {
            this.video_watched_count = c;
        }
        if (!isNaN(d)) {
            if (gameUtil_1.default.isNextDay(d)) {
                this.setVideoWatchedCount(0);
            }
        }
        d = parseInt(fail_share_date);
        c = parseInt(fail_share_count);
        if (isNaN(c)) {
            this.setShareFailCount(0);
        }
        else {
            this.share_fail_count = c;
        }
        if (!isNaN(d)) {
            if (gameUtil_1.default.isNextDay(d)) {
                this.setShareFailCount(0);
            }
        }
        d = parseInt(succ_share_count);
        c = parseInt(succ_share_date);
        if (isNaN(c)) {
            this.setShareSuccCount(0);
        }
        else {
            this.share_succ_count = c;
        }
        if (!isNaN(d)) {
            if (gameUtil_1.default.isNextDay(d)) {
                this.setShareSuccCount(0);
            }
        }
    }
    static initConfig(conf) {
        this.serverConfig = conf;
        this.client.setTimeout(2500);
        console.log("[WeakNetGame]加载配置文件");
        console.log(conf);
    }
    static doLogin(progressCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInit) {
                console.log("[WeakNetGame]开始登陆");
                WeakNetGame.initUserData();
                if (!this.serverConfig.is_local_game) {
                    progressCallback && progressCallback("config");
                    yield WeakNetGame.requestConfig();
                    progressCallback && progressCallback("local_csv");
                    yield WeakNetGame.loadLocalCsvs(_ => {
                        progressCallback && progressCallback('local_csv_loaded', _);
                    });
                    progressCallback && progressCallback("csv");
                    yield WeakNetGame.downloadCsvs();
                    if (this.serverConfig.is_normal_login) {
                        progressCallback && progressCallback("login");
                        yield WeakNetGame.login();
                    }
                    if (CC_WECHAT) {
                        progressCallback && progressCallback("share_config");
                        yield WeakNetGame.requestShareConfig();
                        Platform_1.default.initShare(this.shareConfigs['default'], this.logined_useId);
                    }
                    //检测 ip 
                    if (!this.isLoggedIn) {
                        return false;
                    }
                    this.isInit = true;
                    progressCallback && progressCallback("complete");
                    return yield WeakNetGame.loadUserInfo();
                }
                else {
                    this.isInit = true;
                    return new Promise((resolve, reject) => {
                        csv.loadDir("Config/csv", resolve, reject);
                    });
                }
            }
        });
    }
    /**
     * 视频v次后分享s次，然后循环；
     * @param a  当前执行了几次
     * @param v  视频v次
     * @param s  分享s次
     */
    static check(a, t1, c1, t2, c2) {
        let c = c1 + c2 + 1;
        a = a % c;
        if (a >= c1)
            return t2;
        else if (a <= c1)
            return t1;
    }
    static getChoice(key) {
        if (this.video_watched_count >= this.max_video_watch) {
            return 0;
        }
        let val = key;
        if (typeof (key) == "string") {
            if (csv.Config) {
                val = csv.Config[key];
            }
            else {
                val = 0;
            }
        }
        let choice = Number(val);
        if (isNaN(choice)) {
            // 0=3,1=4 
            try {
                let [[t1, c1], [t2, c2]] = val.split(",").map(v => v.split("=").map(x => parseInt(x)));
                let c = SovInfo_1.SovInfo.getCount(key);
                choice = this.check(c, t1, c1, t2, c2);
            }
            catch (e) {
                console.error("配置错误：请检测后台配置！" + "[" + key + "] = " + val);
                choice = 0;
            }
        }
        if (val == 2) {
            choice = g.randomInt(0, 2);
        }
        return choice;
    }
    static set_safe_check_callback(callback) {
        this._check_safe_callback = callback;
    }
    static get is_safe_mode() {
        if (!this._check_safe_callback)
            return false;
        return this._check_safe_callback();
    }
    static get sharedUUIDs() {
        return this._sharedUUIDs;
    }
    static isValidShare(uuid) {
        return this._sharedUUIDs[uuid] != null;
    }
    static isClaimedShare(uuid) {
        return this.claimedUUIDs[uuid] != null;
    }
    static claimShare(uuid) {
        this.claimedUUIDs[uuid] = uuid;
        let callback = this._sharedUUIDs[uuid];
        if (callback)
            callback();
    }
    static doChoice(key, callback, target, fail_callback) {
        let choice = this.getChoice(key);
        //发送给指定好友
        //https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.shareMessageToFriend.html
        let shareToFriend = () => {
            // let shareCfg = this.shareConfigs['default'] as ShareInfo
            // let imageUrl = shareCfg.imageUrl;
            // let imageUrlId = "";//?审核通过的图片 ID，详见https://developers.weixin.qq.com/minigame/dev/guide/open-ability/share/share.html#%E4%BD%BF%E7%94%A8%E5%AE%A1%E6%A0%B8%E9%80%9A%E8%BF%87%E7%9A%84%E8%BD%AC%E5%8F%91%E5%9B%BE%E7%89%87
            // Platform.sendMessageToOpen("shareMessageToFriend", { imageUrl, imageUrlId })
            // evt.emit("wx.shareMessageToFriend", function() {});if
            // 2. 当玩家当日普通分享获利超过3次后，给出toast提示：暂无可用视频，请稍后再试~；
            if (this.share_succ_count >= 3) {
                Toast.make("暂无可用视频，请稍后再试 !");
                fail_callback && fail_callback.call();
            }
            else {
                share();
            }
        };
        let watch = () => {
            Platform_1.default.watch_video(_ => {
                SovInfo_1.SovInfo.invoke(key);
                this.video_watched_count++;
                this.setVideoWatchedCount(this.video_watched_count);
                EventManager_1.evt.emit("WeakNetGame.watch_video", this.video_watched_count);
                callback && callback.call(target, 'video');
            }, target, () => {
                // 1. 当获利点不能正常拉起视频时，需要切换到普通分享；
                shareToFriend();
            });
        };
        let share = (b = false) => {
            if (this.is_safe_mode) {
                watch();
                return;
            }
            if (this.is_forbidden) {
                watch();
            }
            else {
                if (b) {
                    let uuid = g.uuid(8, 16);
                    this._sharedUUIDs[uuid] = callback.bind(target, 'share_link_click');
                    Platform_1.default.doShareWithParams({ uuid, share_link: true }, this.shareConfigs[key], () => {
                        callback && callback.call(target, 'share_link');
                    }, this);
                }
                else {
                    //6. 连续分享失败3次后，第4次点击去分享按钮，直接拉起视频；
                    // if (this.share_fail_count >= 3) {
                    //     this.setShareFailCount(0)
                    //     return watch();
                    // }
                    Platform_1.default.doShare(this.shareConfigs[key], (ok) => {
                        let notFail = true;
                        if (CC_WECHAT) {
                            if (Math.random() < this.share_fail_rate) {
                                notFail = false;
                            }
                        }
                        if (ok && notFail) {
                            this.setShareSuccCount(++this.share_succ_count);
                            EventManager_1.evt.emit("WeakNetGame.ShareSuccess", key);
                            callback && callback.call(target, 'share');
                            SovInfo_1.SovInfo.invoke(key);
                        }
                        else {
                            this.setShareFailCount(++this.share_fail_count);
                            fail_callback && fail_callback.call();
                            EventManager_1.evt.emit("WeakNetGame.ShareFail", key);
                            if (CC_WECHAT) {
                                wx.showModal({
                                    title: "提示",
                                    content: g.getRandom(this.share_fail_texts),
                                    showCancel: true,
                                    cancelText: "取消",
                                    confirmText: "去分享",
                                    success: (res) => {
                                        if (res.cancel) {
                                            //点击取消,默认隐藏弹框
                                        }
                                        else {
                                            share();
                                        }
                                    }
                                });
                            }
                            else {
                                console.warn("分享失败! ,请重试!");
                            }
                        }
                    }, this.share_succ_delay);
                }
            }
        };
        if (choice == 0) {
            share();
        }
        else if (choice == 1) {
            if (this.video_watched_count >= this.max_video_watch) {
                share();
            }
            else {
                watch();
            }
        }
        else if (choice == 3) {
            callback && callback.call(target);
        }
        else if (choice == 4) {
            // 链接分享 ，需要玩家点击链接后完成整个分享流程
            share(true);
        }
    }
}
WeakNetGame.shareConfigs = {};
WeakNetGame.config = { share_config_url: "share_config.json", csv_url: "csv/", csv: [], local_csv: [] };
WeakNetGame.isInit = false;
WeakNetGame.config_inited = false;
WeakNetGame.shareConfig_inited = false;
WeakNetGame.logined_useId = null;
///------------------------------------------------------------------
WeakNetGame.video_watched_count = 0;
WeakNetGame.share_fail_count = 0;
WeakNetGame.share_succ_count = 0;
///------------------------------------------------------------------
WeakNetGame.is_forbidden = false;
/**当天看视频上限 */
WeakNetGame.max_video_watch = 99;
WeakNetGame.share_succ_delay = 2000;
/**失败概率 */
WeakNetGame.share_fail_rate = 0.5;
/**当天分享失败上限 */
WeakNetGame.max_share_fail = 3;
///------------------------------------------------------------------
WeakNetGame._check_safe_callback = null;
WeakNetGame._configstr_cache = {};
WeakNetGame.client = new Net_1.default();
WeakNetGame.retry_count = 0;
WeakNetGame.userInfo = null;
/**只保存当前session */
WeakNetGame._sharedUUIDs = {};
WeakNetGame.claimedUUIDs = {};
WeakNetGame.share_fail_texts = ['分享失败，请分享到30人群', '分享失败，请分享到新的群'];
exports.default = WeakNetGame;
window["WeakNetGame"] = WeakNetGame;
