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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gx_ui_interstitial_1 = __importDefault(require("../native/gx_ui_interstitial"));
const gx_ui_share_rcorder_1 = __importDefault(require("../../ui/gx_ui_share_rcorder"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
const GxEnum_1 = require("../../core/GxEnum");
const GxAdParams_1 = require("../../GxAdParams");
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const GxEngine_1 = __importDefault(require("../../sdk/GxEngine"));
class TTAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.gxEngine = null;
        this.recorderTime = 0;
        this.openId = "";
        this.anonymousId = "";
        this.getOpenidTry = 0;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new TTAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        super.initAd();
        //@ts-ignore
        if (tt.getEnvInfoSync) {
            //@ts-ignore
            GxAdParams_1.AdParams.tt.appId = tt.getEnvInfoSync().microapp.appId;
        }
        console.log("当前appid:" + GxAdParams_1.AdParams.tt.appId);
        this.gxEngine = new GxEngine_1.default();
        this.initBanner();
        this.initVideo();
        this.initRecorder();
        // this.initAdMonitor()
        this.getOpenId((openId, anonymousId) => {
            // @ts-ignore
            if (tt.uma) {
                // @ts-ignore
                tt.uma.setAnonymousid(anonymousId);
                // @ts-ignore
                tt.uma.setOpenid(openId);
            }
            // TTAdMonitor.getInstance().initAdMonitor(openId);
            this.gxEngine.init({ openId: openId, appToken: GxAdParams_1.AdParams.tt.appId, appId: GxAdParams_1.AdParams.tt.appId }).then(e => {
                console.log("gxEngine初始化成功");
            }).catch(e => {
                console.log("gxEngine初始化失败");
            });
        });
        // @ts-ignore
        tt.onShow((res) => {
            console.log("启动场景字段：", res.launch_from, ", ", res.location);
            if (res.launch_from == "homepage" || res.location == "sidebar_card") {
                console.log("是从侧边栏启动的");
                this.canReward = true;
            }
        });
    }
    getOpenId(callback) {
        let self = this;
        let item = DataStorage_1.default.getItem("__gx_openId__", null);
        let anonymousId = DataStorage_1.default.getItem("__gx_anonymousId__", null);
        if (!!item && !!anonymousId) {
            console.log("获取到缓存的openid：" + item);
            console.log("获取到缓存的anonymousId：" + anonymousId);
            self.openId = item;
            self.anonymousId = anonymousId;
            callback && callback(item, anonymousId);
            return;
        }
        if (self.getOpenidTry >= 5) {
            console.warn("获取openId重试最大次数了");
            return;
        }
        window["tt"].login({
            force: true,
            success(res) {
                console.log(`login 调用成功${res.code} ${res.anonymousCode}`);
                if (res.code) {
                    self.requestGet(`${GxConstant_1.default.Code2SessionUrl}?appId=${GxAdParams_1.AdParams.tt.appId}&code=${res.code}&anonymousCode=${res.anonymousCode}`, (res) => {
                        self.logi(res.data);
                        if (res.data.code == 1) {
                            self.openId = res.data.data.openid;
                            self.anonymousId = res.data.data.anonymousid;
                            self.logi("获取openid成功：" + self.openId);
                            self.logi("获取anonymousId成功：" + self.anonymousId);
                            DataStorage_1.default.setItem("__gx_openId__", self.openId);
                            DataStorage_1.default.setItem("__gx_anonymousId__", self.anonymousId);
                            callback && callback(self.openId, self.anonymousId);
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
    initBanner() {
        if (GxAdParams_1.AdParams.tt.banner.length == 0)
            return;
        if (this.bannerAd)
            this.destroyBanner();
        // @ts-ignore
        this.bannerAd = tt.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.tt.banner,
            adIntervals: Math.max(30, GxGame_1.default.adConfig.bannerUpdateTime),
            style: {
                left: 0,
                top: GxGame_1.default.screenHeight,
                width: GxGame_1.default.screenWidth / 2
            }
        });
        this.bannerAd.onLoad(() => {
            console.log(" banner 加载完成");
        });
        this.bannerAd.onError((err) => {
            console.log(" banner 广告错误" + JSON.stringify(err));
        });
        this.bannerAd.onResize(res => {
            this.bannerAd.style.top = GxGame_1.default.screenHeight - res.height;
            this.bannerAd.style.left = (GxGame_1.default.screenWidth - res.width) / 2;
        });
    }
    showBanner() {
        if (this.bannerAd == null) {
            this.initBanner();
        }
        if (this.bannerAd == null)
            return;
        this.bannerAd.show().then(() => {
        }).catch(res => {
            this.initBanner();
            this.bannerAd.show();
        });
    }
    hideBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }
    destroyBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
        }
        this.bannerAd = null;
    }
    initVideo() {
        if (GxAdParams_1.AdParams.tt.video == null || GxAdParams_1.AdParams.tt.video.length <= 0) {
            console.warn("激励视频参数空");
            return;
        }
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = tt.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.tt.video
        });
        this.videoAd.load();
        this.videoAd.onLoad(res => {
            console.log("激励视频加载", res);
        });
        this.videoAd.onError(err => {
            console.log("激励视频-失败", err);
            this._videoErrorEvent();
        });
        this.videoAd.onClose(res => {
            console.log("激励视频关闭");
            this.recorderResume();
            if (res && res.isEnded) {
                //TTAdMonitor.getInstance().rewardAdEnd();
                this.gxEngine.rewardAdEnd();
                /*   this.videoReward++

                   this.checkAdTarget()*/
                console.log("激励视频完成");
                this._videoCompleteEvent();
                this.videocallback && this.videocallback(true);
            }
            else {
                this._videoCloseEvent();
                this.videocallback && this.videocallback(false);
            }
            this.videoAd.load();
        });
    }
    showVideo(complete, flag = "") {
        super.showVideo(null, flag);
        if (this.videoAd == null)
            this.initVideo();
        if (this.videoAd == null) {
            this._videoErrorEvent();
            complete && complete(false);
            return;
        }
        this.videocallback = complete;
        this.videoAd.show().then(() => {
            this.recorderPause();
        }).catch(err => {
            this.videoAd.load().then(res => {
                return this.videoAd.show();
            }).then(() => {
                this.recorderPause();
            }).catch(() => {
                this.videoAd.load();
                this._videoErrorEvent();
                // @ts-ignore
                tt.showModal({
                    title: "暂无广告",
                    content: "分享游戏获取奖励？",
                    confirmText: "分享",
                    success: res => {
                        if (res.confirm) {
                            GxGame_1.default.shareGame(ret => {
                                this.videocallback && this.videocallback(ret);
                            });
                        }
                    },
                    fail: res => {
                        // @ts-ignore
                        tt.showToast({
                            title: "暂无广告，请稍后再试",
                            icon: "none"
                        });
                        this.videocallback && this.videocallback(false);
                    }
                });
            });
        });
    }
    destroyVideo() {
        if (this.videoAd) {
            this.videoAd.destroy();
        }
        this.videoAd = null;
    }
    /**普通插屏 */
    showInterstitial(on_show, on_close) {
        // @ts-ignore
        if (!tt.createInterstitialAd || GxAdParams_1.AdParams.tt.inter == null || GxAdParams_1.AdParams.tt.inter.length <= 0)
            return on_close && on_close();
        this.destroyNormalInter();
        // @ts-ignore
        this.interAd = tt.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.tt.inter
        });
        this.interAd && this.interAd.onLoad(() => {
            console.log("插屏广告加载");
            on_show && on_show();
        });
        this.interAd && this.interAd.onError(err => {
            console.log("show inter err" + JSON.stringify(err));
            this.destroyNormalInter();
        });
        this.interAd && this.interAd.onClose(() => {
            this.recorderResume();
            on_close && on_close();
            this.destroyNormalInter();
        });
        this.interAd && this.interAd.load().then(() => {
            this.interAd.show().then(() => {
                this.recorderPause();
                this.hideBanner();
                this.interShowTime = this.get_time();
            });
        });
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.interAd.destroy();
        }
        this.interAd = null;
    }
    /**
     * 原生插屏
     * @param on_show 成功展示回调
     * @param on_hide 隐藏回调
     * @param on_fail
     * @returns
     */
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000)
            return;
        this.hideNativeInterstitial();
        if (this.nativeInterTimer == null) {
            this.nativeInterTimer = new GxTimer_1.default();
        }
        this.nativeInterTimer.once(() => {
            let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
            if (native_data == null || native_data === undefined) {
                this.showInterstitial(on_show, on_hide);
            }
            else {
                this.nativeInter = new gx_ui_interstitial_1.default();
                this.nativeInter.show(native_data, () => {
                    this.interShowTime = this.get_time();
                    this.hideBanner();
                    on_show && on_show();
                }, on_hide);
            }
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
        this.destroyNormalInter();
    }
    initRecorder() {
        //@ts-ignore
        if (!tt.getGameRecorderManager)
            return;
        //@ts-ignore
        this.gameRecorder = tt.getGameRecorderManager();
        // 设置录屏相关监听
        this.gameRecorder.onStart(res => {
            console.log("录制开始", JSON.stringify(res));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.START;
            this.recorderTime = this.get_time();
            this.videoPath = null;
        });
        // 监听录屏过程中的错误，需根据错误码处理对应逻辑
        this.gameRecorder.onError(err => {
            console.log("录制出错", JSON.stringify(err));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
        });
        // stop 事件的回调函数
        this.gameRecorder.onStop(res => {
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
            this.videoPath = null;
            if (res && res.videoPath) {
                if (this.get_time() - this.recorderTime >= 3 * 1000) {
                    this.videoPath = res.videoPath;
                    console.log(`录屏停止，录制成功。videoID is ${res.videoPath}`);
                }
                else {
                    console.log(`录屏停止，录制失败。录屏时间<3s`);
                }
            }
            else {
                console.log(`录屏停止，录制失败`);
            }
            this.onRecoderStop && this.onRecoderStop(this.videoPath != null);
        });
        // pause 事件的回调函数
        this.gameRecorder.onPause(() => {
            console.log("暂停录制");
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.PAUSE;
        });
        // resume 事件的回调函数
        this.gameRecorder.onResume(() => {
            console.log("继续录制");
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.RESUME;
        });
    }
    recorderPause() {
        if (this.gameRecorder && this.gameRecorderState == BaseAdapter_1.RECORDER_STATE.START) {
            this.gameRecorder.pause();
        }
    }
    recorderResume() {
        if (this.gameRecorder && this.gameRecorderState == BaseAdapter_1.RECORDER_STATE.PAUSE) {
            this.gameRecorder.resume();
        }
    }
    recorderStart() {
        if (this.gameRecorder && this.gameRecorderState == BaseAdapter_1.RECORDER_STATE.NO) {
            this.gameRecorder && this.gameRecorder.start({
                duration: 300
            });
        }
    }
    recorderStop(on_stop) {
        if (this.gameRecorder && this.gameRecorderState != BaseAdapter_1.RECORDER_STATE.NO) {
            this.onRecoderStop = on_stop;
            this.gameRecorder && this.gameRecorder.stop();
        }
    }
    shareRecorder(on_succ, on_fail) {
        if (this.gameRecorder == null || this.videoPath == null) {
            this.createToast("分享失败");
            return on_fail && on_fail();
        }
        //@ts-ignore
        tt.shareAppMessage({
            channel: "video",
            query: "",
            templateId: GxAdParams_1.AdParams.tt.shareTemplateId,
            title: GxAdParams_1.AdParams.tt.gameName,
            desc: GxAdParams_1.AdParams.tt.gameName,
            extra: {
                videoPath: this.videoPath,
                videoTopics: [GxAdParams_1.AdParams.tt.gameName],
                hashtag_list: [GxAdParams_1.AdParams.tt.gameName]
            },
            success: () => {
                console.log("分享视频成功");
                on_succ && on_succ();
                this.onRecoderStop = null;
                this.videoPath = null;
            },
            fail: res => {
                console.log("分享视频失败", res);
                on_fail && on_fail();
                if (res.errMsg.search(/short/gi) > -1) {
                    this.createToast("分享失败");
                }
                else if (res.errMsg.search(/cancel/gi) > -1) {
                    this.createToast("取消分享");
                }
                else {
                    this.createToast("分享失败，请重试！");
                }
            }
        });
    }
    showGamePortal() {
        //@ts-ignore
        const systemInfo = tt.getSystemInfoSync();
        if (systemInfo.platform !== "ios") {
            let options = [];
            for (let appid of GxGame_1.default.recommedList) {
                options.push({
                    appId: appid,
                    query: "",
                    extraData: {}
                });
            }
            if (options.length > 0) {
                //@ts-ignore
                tt.showMoreGamesModal({
                    appLaunchOptions: options,
                    success(res) {
                        console.log("success", res.errMsg);
                    },
                    fail(res) {
                        console.log("fail", res.errMsg);
                    }
                });
            }
            else {
                this.createToast("暂无广告！");
            }
        }
    }
    showRecorderLayer(on_succ, on_fail) {
        //@ts-ignore
        if (!this.shareRcorderLayer || this.shareRcorderLayer.destroyed) {
            this.shareRcorderLayer = new gx_ui_share_rcorder_1.default();
            this.shareRcorderLayer.show(on_succ, on_fail);
        }
    }
    requestGet(url, successCallback, failCallback) {
        //@ts-ignore
        tt.request({
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
        tt.request({
            url: url,
            data: data,
            header: {
                "content-type": "application/json"
            },
            method: "POST",
            dataType: "JSON",
            responseType: "text",
            success(res) {
                try {
                    successCallback && successCallback({
                        statusCode: res.statusCode,
                        header: res.header,
                        data: JSON.parse(res.data)
                    });
                    console.log("转换成功");
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
    logi(...data) {
        super.LOG("[TTAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[TTAdapter]", ...data);
    }
    logw(...data) {
        super.LOGW("[TTAdapter]", ...data);
    }
    addDesktop(callback) {
        // @ts-ignore
        tt.addShortcut({
            success() {
                if (callback)
                    callback();
            },
            fail(err) {
                console.log("添加桌面失败", err.errMsg);
            }
        });
    }
    hasAddDesktop(can_add, callback) {
        // @ts-ignore
        tt.checkShortcut({
            success(res) {
                console.log("检查快捷方式", res.status);
                if (res.status.exist) {
                    console.log("隐藏桌面");
                    callback && callback();
                }
            },
            fail(res) {
                console.log("检查快捷方式失败", res.errMsg);
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
            if (window["testDataToServer"] && testDataToServer.isAdUser) {
                return callback && callback(true);
            }
            let clickId = DataStorage_1.default.getItem("__clickid__");
            if (!!clickId) {
                return callback && callback(true);
            }
            // @ts-ignore
            let launchOptionsSync = tt.getLaunchOptionsSync();
            let query = launchOptionsSync.query;
            clickId = query.clickid;
            if (!!clickId) {
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
}
exports.default = TTAdapter;
