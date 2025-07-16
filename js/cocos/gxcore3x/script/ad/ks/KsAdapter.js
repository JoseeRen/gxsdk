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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const GxEngine_1 = __importDefault(require("../../sdk/GxEngine"));
const gravityengine_mg_cocoscreator_min_js_1 = __importDefault(require("../../sdk/gravityengine.mg.cocoscreator.min.js"));
class KsAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.canShowInter = false;
        this.interTimeLimit = 60;
        this.isHaiWai = false;
        this.systemInfo = null;
        this.kwaiOpenId = "";
        this.gxEngine = null;
        this.canReward = false;
        this.isFromSideBarLaunch = false;
        this._videoShowing = false;
        this._videoTryCount = 0;
        this.openId = "";
        this.union_id = "";
        this.getOpenidTry = 0;
        this._subsidyList = null;
        this.onShowOption = null;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new KsAdapter();
        }
        return this.instance;
    }
    initAd() {
        // @ts-ignore
        let systemInfoSync = ks.getSystemInfoSync();
        let env = systemInfoSync.host.env;
        console.log(systemInfoSync);
        this.systemInfo = systemInfoSync;
        if (GxAdParams_1.AdParams.ks.appId.startsWith("kwai") || env == "kwaipro" || env == "snackvideo" || env == "kwaime") {
            console.log("海外版本：" + env);
            this.isHaiWai = true;
            this.interTimeLimit = 60;
            this.ac();
            this.ab();
            this.it();
        }
        else {
            this.isHaiWai = false;
            console.log("正常版本：" + env);
            this.interTimeLimit = 5;
            GxAdParams_1.AdParams.ks["appId"] = systemInfoSync.host.appId;
            this.gxEngine = new GxEngine_1.default();
            this.getOpenId((openId, anonymousId) => {
                // @ts-ignore
                if (ks.uma) {
                    // @ts-ignore
                    ks.uma.setOpenid(openId);
                }
                if (window["TDAPP"]) {
                    window["TDAPP"].register({
                        profileId: openId,
                        profileType: 1
                    });
                    window["TDAPP"].login({
                        profileId: openId,
                        profileType: 1
                    });
                }
                this.gxEngine.init({ openId: openId, appToken: GxAdParams_1.AdParams.ks.appId, appId: GxAdParams_1.AdParams.ks.appId }).then(e => {
                    console.log("gxEngine初始化成功");
                }).catch(e => {
                    console.log(e);
                    console.log("gxEngine初始化失败:" + e);
                });
                this.initGravityEngine();
                this.initThinkData();
            });
        }
        // @ts-ignore
        let launchOptionsSync = ks.getLaunchOptionsSync();
        console.log("launchOptionsSync", launchOptionsSync);
        if (launchOptionsSync.from == "sidebar_miniprogram" || launchOptionsSync.from == "sidebar_new") {
            console.log("是从侧边栏启动的 adapter");
            this.isFromSideBarLaunch = true;
            this.canReward = true;
        }
        // this.initVideo();
        this.initRecorder();
        // this.startLogin()
        //@ts-ignore
        ks.onShow(this.onShow.bind(this));
    }
    startLogin() {
        let self = this;
        if (this.isHaiWai) {
            let title = "Só um momento";
            if (this.systemInfo.language.toLowerCase().indexOf("id") != -1) {
                //印尼
                title = "Tunggu sebentar.";
            }
            // @ts-ignore
            ks.showLoading({
                title: title
            });
            // @ts-ignore
            ks.login({
                success: (res) => {
                    console.log(res, res.code);
                    //    通过游戏服务器获取自定义登录态 // 携带 res.code
                    //    发起业务请求 // 携带自定义登录态
                    // @ts-ignore
                    let host = ks.getSystemInfoSync().host;
                    // @ts-ignore
                    ks.login({
                        success: (res) => {
                            console.log(res.code);
                            let gameVersion = host.gameVersion;
                            if (gameVersion == undefined) {
                                gameVersion = host.version;
                            }
                            // @ts-ignore
                            ks.request({
                                url: "https://api.sjzgxwl.com/kwai/ks/code2session", //仅为示例，并非真实的接口地址
                                data: {
                                    appId: host.appId,
                                    gameVersion: gameVersion,
                                    code: res.code
                                },
                                method: "POST",
                                timeout: 15 * 1000,
                                header: {
                                    "content-type": "application/json" // 默认值
                                },
                                success: (res) => {
                                    console.log(res);
                                    console.log(res.data);
                                    if (res && res.data.code == 1) {
                                        this.kwaiOpenId = res.data.data.open_id;
                                        // @ts-ignore
                                        ks.hideLoading();
                                        console.log("登录成功：" + this.kwaiOpenId);
                                        this.rewardKwaiCoins("test666");
                                        //获取成功
                                    }
                                    else {
                                        console.log("登录失败：");
                                        //获取失败了
                                        self.showConfirm();
                                    }
                                },
                                fail: (error) => {
                                    console.error(error);
                                    self.showConfirm();
                                }
                            });
                        },
                        fail: (error) => {
                            self.showConfirm();
                            console.error(error);
                        },
                        complete: () => {
                            console.log("login complete");
                        }
                    });
                },
                fail: () => {
                    //错误处理
                    self.showConfirm();
                }
            });
        }
        else {
            console.warn("???国内版本？？？");
        }
    }
    showConfirm() {
        // @ts-ignore
        ks.hideLoading();
        //默认巴西
        let title = "prompt";
        let content = "Por favor, entre";
        if (this.systemInfo.language.toLowerCase().indexOf("id") != -1) {
            //印尼
            title = "prompt";
            content = "Silakan log masuk";
        }
        // @ts-ignore
        ks.showModal({
            title: title,
            content: content,
            success: (res) => {
                if (res.confirm) {
                    console.log("用户点击确定");
                    this.startLogin();
                }
                else if (res.cancel) {
                    console.log("用户点击取消");
                }
            }
        });
    }
    rewardKwaiCoins(rewardId) {
        let host = this.systemInfo.host;
        let gameVersion = host.gameVersion;
        if (gameVersion == undefined) {
            gameVersion = host.version;
        }
        // @ts-ignore
        ks.request({
            url: "https://api.sjzgxwl.com/kwai/ks/reward", //仅为示例，并非真实的接口地址
            data: {
                appId: this.systemInfo.host.appId,
                gameVersion: gameVersion,
                openId: this.kwaiOpenId,
                rewardId: rewardId,
                env: this.systemInfo.host.env
            },
            method: "POST",
            timeout: 15 * 1000,
            header: {
                "content-type": "application/json" // 默认值
            },
            success: (res) => {
                console.log(res);
                console.log(res.data);
                if (res && res.data.code == 1) {
                    console.log("reward成功 ：");
                    //获取成功
                }
                else {
                    //如果失败 可以再重新试一次
                    console.log("reward失败：");
                    //获取失败了
                }
            },
            fail: (error) => {
                console.error(error);
            }
        });
    }
    ac() {
        let value = GxGame_1.default.gGN("ac", 20);
        setTimeout(() => {
            if (GxGame_1.default.gGB("ac")) {
                this.showNativeInterstitial(() => {
                }, () => {
                    this.ac();
                });
            }
        }, value * 1000);
    }
    ab() {
        let value = GxGame_1.default.gGN("ab", 35);
        setTimeout(() => {
            if (GxGame_1.default.gGB("ab")) {
                this._vv();
            }
        }, value * 1000);
    }
    _vv() {
        this.showVideo((res) => {
            let value = GxGame_1.default.gGN("ab", 35);
            setTimeout(() => {
                this._vv();
            }, value * 1000);
        }, "GxVV");
    }
    it() {
        if (!this.isHaiWai) {
            return;
        }
        this.canShowInter = false;
        let gGB = GxGame_1.default.gGB("it");
        if (gGB) {
            this.interTimeLimit = GxGame_1.default.gGN("it", 60);
        }
        setTimeout(() => {
            this.interTimeLimit = GxGame_1.default.gGN("it", 60);
            if (GxGame_1.default.gGB("it")) {
                //用开关控制 显示插屏  赚金游戏
                this.canShowInter = true;
            }
            else {
                this.canShowInter = false;
            }
        }, this.interTimeLimit * 1000);
    }
    initVideo(param = {}) {
        if (GxAdParams_1.AdParams.ks.video == null || GxAdParams_1.AdParams.ks.video.length <= 0) {
            this.videoAd = null;
            return;
        }
        this.destroyVideo();
        let newVar = {
            adUnitId: GxAdParams_1.AdParams.ks.video
        };
        if (this.systemInfo.platform == "android" && this.isKuaiShouOrKsLite()) {
            if (param && param["multiton"]) {
                Object.assign(newVar, param);
            }
        }
        // @ts-ignore
        this.videoAd = ks.createRewardedVideoAd(newVar);
        if (this.videoAd) {
            this.videoAd.onError(this._videoError.bind(this));
            this.videoAd.onClose(this._videoClose.bind(this));
        }
        else {
            // this._videoError({error: "error self"})
        }
    }
    _videoError(err) {
        console.log("[gx_game]video error: " + JSON.stringify(err), "color: red");
        if (this.videocallback) {
            this.videocallback(false);
        }
        this.videocallback = null;
        if (this.videoAd) {
            this.videoAd.offError(this._videoError.bind(this));
            this.videoAd.offClose(this._videoClose.bind(this));
        }
        try {
            if (!this.isHaiWai) {
                this._videoErrorUploadEvent(err["code"] + err["msg"] || "", err["code"] || "", err["msg"] || "");
            }
        }
        catch (e) {
        }
    }
    _videoClose(res) {
        console.log(res);
        this.recorderResume();
        this._videoShowing = false;
        if ((res && res.isEnded) || res === undefined) {
            if (this.gxEngine) {
                this.gxEngine.rewardAdEnd();
            }
            let re = res["count"];
            if (!re) {
                re = 0;
            }
            this.videocallback && this.videocallback(true, re);
            try {
                if (!this.isHaiWai) {
                    this._videoCompleteEvent();
                }
            }
            catch (e) {
            }
        }
        else {
            this.videocallback && this.videocallback(false);
            try {
                if (!this.isHaiWai) {
                    this._videoCloseEvent();
                }
            }
            catch (e) {
            }
        }
        if (this.videoAd) {
            this.videoAd.offError(this._videoError.bind(this));
            this.videoAd.offClose(this._videoClose.bind(this));
        }
        this.videocallback = null;
    }
    showVideo(complete, flag = "", multitonRewardMsgArr = [], multitonRewardTimes = 1) {
        if (this._videoShowing) {
            this._videoTryCount++;
            complete && complete(false);
            if (this._videoTryCount >= 2) {
                this._videoShowing = false;
                this._videoTryCount = 0;
            }
            return;
        }
        this._videoShowing = true;
        this._videoTryCount = 0;
        super.showVideo(null, flag);
        try {
            this._videoCallEvent(flag);
        }
        catch (e) {
        }
        let arr = [];
        let multiton = false;
        if (this.systemInfo.platform == "android" && this.isKuaiShouOrKsLite() && multitonRewardMsgArr && Array.isArray(multitonRewardMsgArr) && multitonRewardMsgArr.length > 0) {
            //长度只能是小于等于7
            arr = [multitonRewardMsgArr[0].substring(0, 7)];
            //快手只能是1
            multitonRewardTimes = 1;
            this.destroyVideo();
            /*  if (this.videoAd) {
                  this.videoAd.offError(this._videoError.bind(this));

                  this.videoAd.offClose(this._videoClose.bind(this));
                  this.videoAd.destroy()

              }
              this.videoAd = null;*/
            multiton = true;
        }
        //快手不预加载了  多倍奖励看完后  再看其他的也会变多倍
        // if (this.videoAd == null) {
        this.initVideo({ multiton: multiton, multitonRewardMsg: arr, multitonRewardTimes: multitonRewardTimes });
        // }
        if (this.videoAd == null) {
            complete && complete(false);
            this._videoShowing = false;
            if (this.isHaiWai) {
                this.createToast("Tente novamente mais tarde");
            }
            else {
                this.createToast("暂无视频，请稍后再试");
                try {
                    this._videoErrorEvent("ad null");
                }
                catch (e) {
                }
            }
            return;
        }
        this.videocallback = complete;
        this.videoAd
            .show()
            .then(() => {
            try {
                this._videoShowEvent();
            }
            catch (e) {
            }
            this.recorderPause();
        })
            .catch((err) => {
            console.log(err);
            console.log("激励视频-失败 catch");
            this._videoShowing = false;
            if (this.isHaiWai) {
                this.createToast("Tente novamente mais tarde");
            }
            else {
                this.createToast("暂无视频，请稍后再试");
                try {
                    this._videoErrorEvent(err["code"] + err["msg"] || "", err["code"] || "", err["msg"] || "");
                }
                catch (e) {
                }
            }
            // this.createToast('暂无视频，请稍后再试');
        });
    }
    createToast(desc) {
        // @ts-ignore
        ks.showToast({
            icon: "none",
            title: desc,
            duration: 2000
        });
    }
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (!GxAdParams_1.AdParams.ks.inter) {
            console.log("插屏参数空");
            on_hide && on_hide();
            return;
        }
        // @ts-ignore
        let interstitialAd = ks.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.ks.inter
        });
        if (interstitialAd) {
            let onClose = (res) => {
                // 插屏广告关闭事件
                on_hide && on_hide();
                offCallback();
            };
            interstitialAd.onClose(onClose);
            let onError = (res) => {
                // 插屏广告Error事件
                console.log("插屏失败 res", res);
                on_hide && on_hide();
                offCallback();
            };
            interstitialAd.onError(onError);
            let offCallback = () => {
                if (interstitialAd) {
                    interstitialAd.offClose(onClose);
                    interstitialAd.offError(onError);
                    interstitialAd = null;
                }
            };
            let p = interstitialAd.show();
            p.then(function (result) {
                // 插屏广告展示成功
                console.log(`show interstitial ad success, result is ${result}`);
                on_show && on_show();
            }).catch(function (error) {
                // 插屏广告展示失败
                console.log(`show interstitial ad failed, error is ${error}`, error);
                on_hide && on_hide();
                offCallback();
            });
        }
        else {
            console.log("创建插屏广告组件失败");
            on_hide && on_hide();
        }
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (!GxAdParams_1.AdParams.ks.inter) {
            console.log("插屏参数空");
            on_hide && on_hide();
        }
        if (!this.canShowInter) {
            console.log("插屏时间限制 不能展示");
            return;
        }
        this.it();
        this.showNativeInterstitial(on_show, on_hide, delay_time * 1000);
    }
    destroyVideo() {
        if (this.videoAd) {
            this.videoAd.offError(this._videoError.bind(this));
            this.videoAd.offClose(this._videoClose.bind(this));
            this.videoAd.destroy();
        }
        this.videoAd = null;
    }
    initRecorder() {
        // @ts-ignore
        this.gameRecorder = ks.getGameRecorder();
        // 设置录屏相关监听
        this.gameRecorder.on("start", () => {
            console.log("录制开始");
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.START;
        });
        // 监听录屏过程中的错误，需根据错误码处理对应逻辑
        this.gameRecorder.on("error", (err) => {
            console.log("录制出错", JSON.stringify(err));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
        });
        // stop 事件的回调函数
        this.gameRecorder.on("stop", (res) => {
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.STOP;
            this.videoPath = null;
            if (res && res.videoID) {
                this.videoPath = res.videoID;
                console.log(`录屏停止，录制成功。videoID is ${res.videoID}`);
            }
            else {
                /****注意：没有videoID时不可展示分享录屏按钮，审核会过此case****/
                /****测试方法：点击右上角"..."按钮打开设置页面，关闭录屏开关，录屏不会产生videoID****/
                // 没有videoID时，可以通过onError回调获取录制失败的原因
                console.log(`录屏停止，录制失败`);
            }
            this.onRecoderStop && this.onRecoderStop(this.videoPath != null);
        });
        // pause 事件的回调函数
        this.gameRecorder.on("pause", () => {
            console.log("暂停录制");
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.PAUSE;
        });
        // resume 事件的回调函数
        this.gameRecorder.on("resume", () => {
            console.log("继续录制");
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.RESUME;
        });
        // abort 事件的回调函数，表示录制中的游戏画面已经被舍弃
        this.gameRecorder.on("abort", () => {
            console.log("废弃已录制视频");
        });
    }
    recorderPause() {
        if (this.gameRecorder && this.gameRecorderState != BaseAdapter_1.RECORDER_STATE.NO) {
            this.gameRecorder.pause();
        }
    }
    recorderResume() {
        if (this.gameRecorder && this.gameRecorderState != BaseAdapter_1.RECORDER_STATE.NO) {
            this.gameRecorder.resume();
        }
    }
    recorderStart() {
        this.gameRecorder && this.gameRecorder.start();
    }
    recorderStop(on_stop) {
        this.onRecoderStop = on_stop;
        this.gameRecorder && this.gameRecorder.stop();
    }
    shareRecorder(on_succ, on_fail) {
        if (this.gameRecorder == null || this.videoPath == null) {
            //走普通分享
            window["ks"].shareAppMessage({
                success(res) {
                    on_succ && on_succ();
                },
                fail(e) {
                    console.log(e);
                    on_fail && on_fail();
                }
            });
            return;
        }
        ;
        this.gameRecorder.publishVideo({
            video: this.videoPath,
            callback: (error) => {
                if (error != null && error != undefined) {
                    console.log("分享录屏失败: " + JSON.stringify(error));
                    on_fail && on_fail();
                    return;
                }
                console.log("分享录屏成功");
                on_succ && on_succ();
            }
        });
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        // @ts-ignore
        if (ks["getAPKShortcutInstallStatus"]) {
            // @ts-ignore
            ks.getAPKShortcutInstallStatus((result) => {
                console.log("hasAddDesktop", JSON.stringify(result));
                if (result.code === 1) {
                    if (!result.installed) {
                        can_add && can_add();
                    }
                    else {
                        has_add && has_add();
                    }
                }
                else {
                    on_fail && on_fail();
                }
            });
        }
        else {
            has_add && has_add();
        }
    }
    hasDesktop(has_add) {
        // @ts-ignore
        ks.checkShortcut({
            success(res) {
                //根据res.installed 来判断是否添加成功
                console.log("是否已添加快捷方式", res.installed);
                has_add && has_add(res.installed);
            },
            fail(err) {
                if (err.code === -10005) {
                    console.log("暂不支持该功能");
                    has_add && has_add(false);
                }
                else {
                    console.log("检查快捷方式失败", err.msg);
                    has_add && has_add(false);
                }
            }
        });
    }
    /**创建桌面图标 */
    addDesktop(on_succ, on_fail) {
        // @ts-ignore
        // if (ks["saveAPKShortcut"]) {
        //     // @ts-ignore
        //     ks.saveAPKShortcut((result) => {
        //         console.log("addDesktop", JSON.stringify(result));
        //         if (result.code === 1) {
        //             on_succ && on_succ();
        //         } else {
        //             on_fail && on_fail();
        //         }
        //     });
        // } else {
        //     on_succ && on_succ();
        // }
        if (this.systemInfo.platform == "ios") {
            console.log("ios桌面消失");
            on_succ && on_succ();
            on_succ = null;
        }
        // @ts-ignore
        ks.addShortcut({
            success() {
                console.log("添加桌面成功");
                on_succ && on_succ();
            },
            fail(err) {
                if (err.code === -10005) {
                    console.log("暂不支持该功能");
                    on_fail && on_fail();
                }
                else {
                    console.log("添加桌面失败", err.msg);
                    on_fail && on_fail();
                }
            }
        });
    }
    /**创建常用图标 */
    addCommonUse(on_succ, on_fail) {
        // @ts-ignore
        if (ks["addCommonUse"]) {
            // @ts-ignore
            ks.addCommonUse({
                success() {
                    console.log("设为常用成功");
                    on_succ && on_succ();
                },
                fail(err) {
                    if (err.code === -10005) {
                        console.log("暂不支持该功能");
                    }
                    else {
                        console.log("设为常用失败", err.msg);
                    }
                    on_fail && on_fail();
                }
            });
        }
        else {
            on_succ && on_succ();
        }
    }
    getOpenId(callback) {
        let self = this;
        let item = DataStorage_1.default.getItem("__gx_openId__", null);
        let union_id = DataStorage_1.default.getItem("__gx_unionId__", null);
        if (!!item && !!union_id && !!self.openId) {
            console.log("获取到缓存的openid：" + item);
            console.log("获取到缓存的union_id：" + union_id);
            self.openId = item;
            self.union_id = union_id;
            callback && callback(item, union_id);
            return;
        }
        if (self.getOpenidTry >= 5) {
            console.warn("获取openId重试最大次数了");
            return;
        }
        window["ks"].login({
            force: true,
            success(res) {
                console.log(`login 调用成功${res.code} `);
                if (res.code) {
                    self.requestGet(`${GxConstant_1.default.Code2SessionUrl}?appId=${GxAdParams_1.AdParams.ks.appId}&code=${res.code}`, (res) => {
                        self.logi(res.data);
                        if (res.data.code == 1) {
                            self.openId = res.data.data.openid;
                            self.union_id = res.data.data.union_id;
                            self.logi("获取openid成功：" + self.openId);
                            self.logi("获取union_id成功：" + self.union_id);
                            DataStorage_1.default.setItem("__gx_openId__", self.openId);
                            DataStorage_1.default.setItem("__gx_unionId__", self.union_id);
                            callback && callback(self.openId, self.union_id);
                        }
                        else {
                            self.logw("登录失败！" + res.data["msg"]);
                            // self.reported = false
                            setTimeout(() => {
                                self.getOpenidTry++;
                                self.getOpenId(callback);
                            }, 3000);
                        }
                    }, (res) => {
                        self.logw("登录失败！" + res["errMsg"]);
                        self.logw(res);
                        // self.reported = false
                        setTimeout(() => {
                            self.getOpenidTry++;
                            self.getOpenId(callback);
                        }, 3000);
                    });
                }
                else {
                    console.log("登录没code");
                    // self.reported = false
                    setTimeout(() => {
                        self.getOpenidTry++;
                        self.getOpenId(callback);
                    }, 3000);
                }
            },
            fail(res) {
                console.log(`login 调用失败`);
                // self.reported = false
                setTimeout(() => {
                    self.getOpenidTry++;
                    self.getOpenId(callback);
                }, 3000);
            }
        });
    }
    logi(...data) {
        super.LOG("[KSAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[KSAdapter]", ...data);
    }
    logw(...data) {
        super.LOGW("[KSAdapter]", ...data);
    }
    requestGet(url, successCallback, failCallback) {
        //@ts-ignore
        ks.request({
            url: url,
            success(res) {
                successCallback && successCallback(res);
            },
            fail(res) {
                failCallback && failCallback(res);
            }
        });
    }
    requestPost(url, data, successCallback, failCallback) {
        //@ts-ignore
        ks.request({
            url: url,
            data: data,
            header: {
                "content-type": "application/json"
            },
            method: "POST",
            dataType: "JSON", // 指定返回数据的类型为 json
            responseType: "text",
            success(res) {
                try {
                    successCallback && successCallback({
                        statusCode: res.statusCode,
                        header: res.header,
                        data: JSON.parse(res.data)
                    });
                    // console.log("转换成功");
                }
                catch (e) {
                    console.log(e);
                    console.log("转换失败");
                    successCallback && successCallback(res);
                }
            },
            fail(res) {
                failCallback && failCallback(res);
            }
        });
    }
    /*
  * 判断是不是买量用户进来 的
  * callback 返回值true 代表是  false不是
  *
  * */
    userFrom(callback) {
        try {
            // @ts-ignore
            /*  if (window["testDataToServer"] && testDataToServer.isAdUser) {
                  return callback && callback(true);
              }*/
            let clickId = DataStorage_1.default.getItem("__clickid__");
            if (!!clickId) {
                return callback && callback(true);
            }
            // @ts-ignore
            let launchOptionsSync = ks.getLaunchOptionsSync();
            /*getLaunchOptionsSync如下*/
            /*    let demoD={"getLaunchOptionsSync":{"from":"dsp","query":{"gsid":"ab936bc25b40847e6082747cebe9119f","callback":"nxu2fsPeJoTQK4p8I_kxWwCVBsSdouvo6BWn-iY35aCxsFYoW6ztHVWYJ5wuntcyx9WqxL15Ur1mUL9S6t6e7vHXCRIB05MzBYejdqtQm1XNBb58CUPWuqZZzSfogSDCNX_Uhd3xtBvRfm6G5zchuhEmB0tRbdId_iDzCZwmsiOpCzG0gfXBX5qflxapr0EYIr0g-oHrpc_G_JctbNrykQ","account_id":"27202539","campaign_id":"2015512998","unit_id":"3920468322","creative_id":"44594759820"}},"channel":"ks"}
    */
            let query = launchOptionsSync.query;
            clickId = query.callback;
            if (!!clickId) {
                DataStorage_1.default.setItem("__clickid__", clickId);
                return callback && callback(true);
            }
            /*    if (this.gxEngine == null) {
                    return callback && callback(false);

                }

                let clickId1 = this.gxEngine.getClickId();
                if (!!clickId1) {
                    return callback && callback(true);

                }*/
            return callback && callback(false);
        }
        catch (e) {
            callback && callback(false);
        }
    }
    initGravityEngine() {
        if (!!GxAdParams_1.AdParams.ks.gravityEngineAccessToken) {
            console.log("初始化ge");
            let debug = "none";
            if (window["geDebug"]) {
                debug = "debug";
            }
            const config = {
                accessToken: GxAdParams_1.AdParams.ks.gravityEngineAccessToken, // 项目通行证，在：网站后台-->设置-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
                clientId: this.openId, // 用户唯一标识，如产品为小游戏，则必须填用户openid（注意，不是小游戏的APPID！！！）
                autoTrack: {
                    appLaunch: true, // 自动采集 $MPLaunch
                    appShow: true, // 自动采集 $MPShow
                    appHide: true // 自动采集 $MPHide
                },
                name: "ge", // 全局变量名称, 默认为 gravityengine
                debugMode: debug // 是否开启测试模式，开启测试模式后，可以在 网站后台--设置--元数据--事件流中查看实时数据上报结果。（测试时使用，上线之后一定要关掉，改成none或者删除）
            };
            const ge = new gravityengine_mg_cocoscreator_min_js_1.default(config);
            ge.setupAndStart();
            let item = DataStorage_1.default.getItem("geInit");
            if (!!item) {
                console.log("ge inited");
                console.log(window["ge"]);
            }
            else {
                console.log(window["ge"]);
                //@ts-ignore
                let systemInfoSync = ks.getSystemInfoSync();
                let versionNumber = 100;
                try {
                    let hostElement = systemInfoSync.host["gameVersion"];
                    if (!!hostElement && hostElement != "0.0.0" && (hostElement + "").indexOf(".") != -1) {
                        let replace = hostElement.replace(/\./g, "");
                        let re = parseInt(replace);
                        if (!isNaN(re)) {
                            versionNumber = re;
                        }
                    }
                }
                catch (e) {
                }
                ge.initialize({
                    name: this.openId,
                    version: versionNumber,
                    openid: this.openId,
                    enable_sync_attribution: false
                })
                    .then((res) => {
                    console.log("ge initialize success " + res);
                    DataStorage_1.default.setItem("geInit", "1");
                })
                    .catch((err) => {
                    console.log("ge initialize failed, error is " + err);
                });
            }
        }
        else {
            console.log("不初始化ge");
        }
    }
    initThinkData() {
        let gameAppId = "";
        let gameAppVersion = "";
        let newVar1 = window["ks"]["getSystemInfoSync"]();
        console.log(newVar1);
        if (newVar1) {
            if (newVar1["host"]) {
                gameAppId = newVar1["host"]["appId"];
                gameAppVersion = newVar1["host"]["gameVersion"];
                if (!gameAppVersion) {
                    gameAppVersion = newVar1["host"]["version"];
                }
                if (gameAppVersion == undefined) {
                    gameAppVersion = "";
                }
            }
        }
        // TE SDK 配置对象
        let appId = "commonAppId_" + gameAppId;
        if (GxAdParams_1.AdParams.ks["fl_appId"]) {
            appId = GxAdParams_1.AdParams.ks["fl_appId"];
        }
        var config = {
            appId: appId, // 项目 APP ID
            serverUrl: GxConstant_1.default.DataServerUrl, // 上报地址
            autoTrack: {
                appShow: true, // 自动采集 ta_mg_show
                appHide: true // 自动采集 ta_mg_hide
            },
            enableLog: false,
            accountId: this.openId
        };
        // 初始化
        window["TDAnalytics"].init(config);
        window["TDAnalytics"].login(this.openId);
        let launchOptionsSync = window["ks"].getLaunchOptionsSync();
        // let sessionId = new Date().valueOf() + (Math.random() * 10000 + 100) + this.openId;
        var superProperties = {
            launchOptions: launchOptionsSync,
            gameAppId: gameAppId,
            gameAppVersion: gameAppVersion,
            unionId: this.union_id /*,
            "#session_id": sessionId*/
        };
        window["TDAnalytics"].setSuperProperties(superProperties);
        /*     window["TDAnalytics"].track({
                 eventName: "ta_login"  //上报登录事件

             });*/
    }
    /**
     * 支付
     * @param productId
     * @param successCallback  返回true 成功购买 还没发道具    false成功购买但发过道具了
     * @param failedCallback  失败
     * @param orderDataCallback
     */
    payOrder(productId, successCallback, failedCallback, orderDataCallback = null) {
        //@ts-ignore
        ks.showLoading({
            title: "加载中"
        });
        let self = this;
        //@ts-ignore
        let systemInfoSync = ks.getSystemInfoSync();
        this.requestPost("https://api.sjzgxwl.com/game_api/ks/pay/createPayOrder", {
            appId: GxAdParams_1.AdParams.ks.appId,
            openId: this.openId,
            os: systemInfoSync.platform,
            productId: productId
        }, (res) => {
            try {
                console.log(JSON.stringify(res));
            }
            catch (e) {
                console.log(res);
            }
            if (res.data.code == 1) {
                // successCallback && successCallback(res);
                let data = res.data.data;
                orderDataCallback && orderDataCallback({ third_party_trade_no: data.payContent.third_party_trade_no });
                //@ts-ignore
                ks.requestGamePayment({
                    "zone_id": data.payContent.zone_id,
                    "os": data.payContent.os,
                    "currency_type": data.payContent.currency_type,
                    "buy_quantity": data.payContent.buy_quantity,
                    "third_party_trade_no": data.payContent.third_party_trade_no,
                    "extension": data.payContent.extension,
                    "product_type": data.payContent.product_type,
                    "sign": data.payContent.sign,
                    success: (res) => {
                        console.log(res);
                        setTimeout(() => {
                            self._subsidyList = null;
                            self.checkOrder(data.payContent.third_party_trade_no, (orderStatus, productId) => {
                                self.getSubsidyList(() => {
                                }, () => {
                                });
                                try {
                                    if (orderStatus == 2 || orderStatus == 3) {
                                        if (window["ge"]) {
                                            window["ge"].payEvent(data.payContent.buy_quantity * 10, "CNY", data.payContent.third_party_trade_no, productId + "", "支付宝");
                                        }
                                    }
                                }
                                catch (e) {
                                }
                                if (orderStatus == 2) {
                                    //@ts-ignore
                                    ks.hideLoading();
                                    self.createToast("购买成功");
                                    successCallback && successCallback(true, {
                                        orderData: {
                                            third_party_trade_no: data.payContent.third_party_trade_no,
                                            productId: productId
                                        }
                                    });
                                }
                                else if (orderStatus == 3) {
                                    //@ts-ignore
                                    ks.hideLoading();
                                    self.createToast("已经成功购买");
                                    successCallback && successCallback(false, {
                                        orderData: {
                                            third_party_trade_no: data.payContent.third_party_trade_no,
                                            productId: productId
                                        }
                                    });
                                }
                                else {
                                    //@ts-ignore
                                    ks.hideLoading();
                                    self.createToast("未支付");
                                    failedCallback && failedCallback(res, {
                                        orderData: {
                                            third_party_trade_no: data.payContent.third_party_trade_no,
                                            productId: productId
                                        }
                                    });
                                }
                            }, (err) => {
                                self.getSubsidyList(() => {
                                }, () => {
                                });
                                //@ts-ignore
                                ks.hideLoading();
                                self.createToast(err);
                                failedCallback && failedCallback(res, {
                                    orderData: {
                                        third_party_trade_no: data.payContent.third_party_trade_no,
                                        productId: productId
                                    }
                                });
                            });
                        }, 3 * 1000);
                        self._subsidyList = null;
                        self.getSubsidyList(() => {
                        }, () => {
                        });
                    },
                    fail: (err) => {
                        //@ts-ignore
                        ks.hideLoading();
                        console.log(err);
                        if (err && err.msg && err.msg.includes("cancel")) {
                            self.createToast("取消支付");
                        }
                        else {
                            self.createToast((err.msg || err.errorMsg) + (err.code || err.errorCode));
                        }
                        failedCallback && failedCallback(err, {
                            orderData: {
                                third_party_trade_no: data.payContent.third_party_trade_no,
                                productId: productId
                            }
                        });
                        self._subsidyList = null;
                        self.getSubsidyList(() => {
                        }, () => {
                        });
                    }
                });
            }
            else {
                failedCallback && failedCallback(res, null);
                //@ts-ignore
                ks.hideLoading();
                self.createToast("下单失败");
            }
        }, (err) => {
            console.log(err);
            failedCallback && failedCallback(err, null);
            //@ts-ignore
            ks.hideLoading();
            self.createToast("下单失败");
        });
    }
    checkOrder(third_party_trade_no, successCallback, failedCallback) {
        this._checkOrder(third_party_trade_no, successCallback, failedCallback);
    }
    _checkOrder(third_party_trade_no, successCallback, failedCallback, tryCount = 0) {
        this.requestPost("https://api.sjzgxwl.com/game_api/ks/pay/checkOrder", {
            appId: GxAdParams_1.AdParams.ks.appId,
            openId: this.openId,
            third_party_trade_no
        }, (res) => {
            try {
                console.log(JSON.stringify(res));
            }
            catch (e) {
                console.log(res);
            }
            if (res.data.code == 1) {
                if (tryCount < 5) {
                    ++tryCount;
                    setTimeout(() => {
                        this._checkOrder(third_party_trade_no, successCallback, failedCallback, tryCount);
                    }, 1 * 1000);
                }
                else {
                    //orderStatus 1未支付   2 支付成功  3已经发过道具了
                    successCallback && successCallback(res.data.data.orderStatus, res.data.data.productId);
                }
            }
            else {
                if (tryCount < 5) {
                    ++tryCount;
                    setTimeout(() => {
                        this._checkOrder(third_party_trade_no, successCallback, failedCallback, tryCount);
                    }, tryCount * 1000);
                }
                else {
                    failedCallback && failedCallback(res.data.msg);
                }
            }
        }, (err) => {
            console.log(err);
            if (tryCount < 5) {
                ++tryCount;
                setTimeout(() => {
                    this._checkOrder(third_party_trade_no, successCallback, failedCallback, tryCount);
                }, tryCount * 1000);
            }
            else {
                failedCallback && failedCallback(err);
            }
        });
    }
    /**
     * 获取已经购买过的道具列表
     * @param successCallback  返回list    [{productId:132,num:0}] //num大于0就是买过了
     * @param failedCallback
     */
    getBuyPropList(successCallback, failedCallback) {
        this.requestPost("https://api.sjzgxwl.com/game_api/ks/pay/payRecord", {
            appId: GxAdParams_1.AdParams.ks.appId,
            openId: this.openId
        }, (res) => {
            try {
                console.log(JSON.stringify(res));
            }
            catch (e) {
                console.log(res);
            }
            if (res.data.code == 1) {
                //orderStatus 1未支付   2 支付成功  3已经发过道具了
                successCallback && successCallback(res.data.data.list);
            }
            else {
                failedCallback && failedCallback(res.data.msg);
            }
        }, (err) => {
            console.log(err);
            failedCallback && failedCallback(err);
        });
    }
    /**
     * 获取补贴
     * @param price 价格元
     * @param successCallback  true有优惠 第二个返回的是优惠后的价格   false没有优惠
     * @param failedCallback
     */
    getSubsidy(price, successCallback, failedCallback) {
        this.getSubsidyList((data) => {
            if (data["hasSubsidy"] && data["subsidyLevels"]) {
                let number = price * 10;
                let datumElement = data["subsidyLevels"][number + ""];
                if (datumElement) {
                    if (datumElement["subsidyMoney"] == 0) {
                        successCallback(false);
                    }
                    else {
                        let number1 = datumElement["subsidyAfterMoney"] / 100;
                        successCallback(true, number1);
                    }
                }
                else {
                    console.log("没这个金额");
                    successCallback(false);
                }
            }
            else {
                console.log("空的");
                successCallback(false);
            }
        }, (err) => {
            successCallback(false);
        });
    }
    getSubsidyList(successCallback, failedCallback) {
        if (this._subsidyList != null) {
            successCallback && successCallback(this._subsidyList);
            return;
        }
        //@ts-ignore
        let systemInfoSync = ks.getSystemInfoSync();
        this.requestPost("https://api.sjzgxwl.com/game_api/ks/pay/subsidy", {
            appId: GxAdParams_1.AdParams.ks.appId,
            os: systemInfoSync.platform,
            openId: this.openId
        }, (res) => {
            try {
                console.log(JSON.stringify(res));
            }
            catch (e) {
                console.log(res);
            }
            if (res.data.code == 1) {
                this._subsidyList = res.data.data;
                successCallback && successCallback(res.data.data);
            }
            else {
                failedCallback && failedCallback(res.data.msg);
            }
        }, (err) => {
            console.log(err);
            failedCallback && failedCallback(err);
        });
    }
    /**
     *检查某个是否购买过
     * @param productId
     * @param successCallback
     * @param failedCallback
     */
    checkIsBuy(productId, successCallback, failedCallback) {
        //没购买过  0没买过    返回的是购买过的数量
        // successCallback && successCallback(0);
        this.requestPost("https://api.sjzgxwl.com/game_api/ks/pay/payRecord", {
            appId: GxAdParams_1.AdParams.ks.appId,
            openId: this.openId
        }, (res) => {
            try {
                console.log(JSON.stringify(res));
            }
            catch (e) {
                console.log(res);
            }
            if (res.data.code == 1) {
                //orderStatus 1未支付   2 支付成功  3已经发过道具了
                let list = res.data.data.list;
                let num = 0;
                for (let i = 0; i < list.length; i++) {
                    if (list[i]["productId"] == productId) {
                        num = list[i]["num"];
                    }
                }
                successCallback && successCallback(num);
            }
            else {
                failedCallback && failedCallback(res.data.msg);
            }
        }, (err) => {
            console.log(err);
            failedCallback && failedCallback(err);
        });
    }
    /**
     * 保存数据
     * @param key
     * @param data
     * @param callback
     */
    saveData(key, data, callback) {
        this.getOpenId((openId, anonymousId) => {
            if (!!openId) {
                let encryptData = this.encrypt(GxAdParams_1.AdParams.ks.appId, openId, key, data);
                this.requestPost("https://api.sjzgxwl.com/commonData/data/saveData/v2", encryptData, (res) => {
                    if (res["data"] && res["data"]["code"] == 1) {
                        callback && callback(null);
                    }
                    else {
                        callback && callback(res);
                    }
                }, (err) => {
                    callback && callback(err);
                });
            }
            else {
                console.error("没有获取到openId 不能保存数据");
                callback && callback("openId is null");
            }
        });
    }
    /**
     *
     * @param key
     * @param callback  callback返回两个参数  第一个error  第二个是数据
     */
    getData(key, callback) {
        this.getOpenId((openId, anonymousId) => {
            if (!!openId) {
                this.requestPost("https://api.sjzgxwl.com/commonData/data/getData/v1", {
                    appId: GxAdParams_1.AdParams.ks.appId,
                    openId: openId,
                    key: key
                }, (res) => {
                    if (res["data"] && res["data"]["code"] == 1 && res["data"]["data"]) {
                        let datumElement = res.data["data"]["data"];
                        if (datumElement == undefined) {
                            callback && callback(null, null);
                        }
                        else {
                            callback && callback(null, datumElement);
                        }
                    }
                    else {
                        callback && callback(res, null);
                    }
                }, (err) => {
                    callback && callback(err, null);
                });
            }
            else {
                console.error("没有获取到openId 不能获取数据");
                callback && callback("openId is null", null);
            }
        });
    }
    shareAppMessage(shareObj = {}) {
        //@ts-ignore
        ks.shareAppMessage(shareObj);
    }
    /**
     * 是否可以用侧边栏
     * @param callback  true可以显示礼包  false不可以显示礼包
     */
    canUseSideBar(callback) {
        //@ts-ignore
        if (!ks["checkSliderBarIsAvailable"]) {
            callback && callback(false);
            return;
        }
        //@ts-ignore
        ks.checkSliderBarIsAvailable({
            success: (result) => {
                if (result["available"]) {
                    callback && callback(true);
                }
                else {
                    console.warn("快手不备案不能显示侧边栏");
                    callback && callback(false);
                }
                /* this.content.string =
                     "侧边栏调用成功: " + JSON.stringify(result);*/
            },
            fail: (result) => {
                callback && callback(false);
                /*   this.content.string =
                       "侧边栏调用失败: " + JSON.stringify(result);*/
            }
        });
    }
    onShow(res) {
        this.onShowOption = res;
        if (this.onShowOption && this.onShowOption["from"] == "sidebar_new") {
            this.isFromSideBarLaunch = true;
        }
    }
    checkIsFromSideBar(callback) {
        if (this.isFromSideBarLaunch || this.onShowOption && this.onShowOption["from"] == "sidebar_new") {
            callback && callback(true);
        }
        else {
            //@ts-ignore
            callback && callback(false);
        }
    }
    /**
     * 判断是不是快手或者快手极速版本
     */
    isKuaiShouOrKsLite() {
        //kuaishou        nebula
        try {
            if (this.systemInfo && (this.systemInfo.host.env == "kuaishou" || this.systemInfo.host.env == "nebula")) {
                return true;
            }
        }
        catch (e) {
        }
        return false;
    }
    /**
     * 是否可以使用添加桌面
     * @param callback
     */
    canUseAddDesktop(callback) {
        callback && callback(true);
    }
}
exports.default = KsAdapter;
