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
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
const GxEnum_1 = require("../../core/GxEnum");
const GxAdParams_1 = require("../../GxAdParams");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
let GravityEngine = require("../../sdk/gravityengine.mg.cocoscreator.min");
/*获取adid  创建 id   向服务器发请求 获取 配置*/
class BLAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.shareRcorderLayer = null;
        this.recorderTime = 0;
        this.canReward = false;
        this.openId = "";
        this.getOpenidTry = 0;
        this._videoShowing = false;
        this._videoTryCount = 0;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new BLAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        //@ts-ignore
        const updateManager = bl.getUpdateManager();
        updateManager.onUpdateReady((res) => {
            //@ts-ignore
            bl.showModal({
                title: "更新提示",
                content: "新版本已经准备好，重启更好玩！",
                success: (res) => {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            });
        });
        super.initAd();
        //@ts-ignore
        /*      if (bl.getEnvInfoSync) {
                  //@ts-ignore
                  AdParams.bilibili.appId = bl.getEnvInfoSync().microapp.appId;
                  //低版本环境不支持这个api
              }*/
        console.log("当前appid:" + GxAdParams_1.AdParams.bilibili.appId);
        if (!GxAdParams_1.AdParams.bilibili.appId) {
            console.error("请填写appId到参数  否则用户可能无法登录");
        }
        // this.initBanner();
        this.initVideo();
        this.initRecorder();
        // this.initAdMonitor()
        this.getOpenId((openId) => {
            // @ts-ignore
            if (bl.uma) {
                // @ts-ignore
                // @ts-ignore
                bl.uma.setOpenid(openId);
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
            this.initGravityEngine();
            this.initThinkData();
            // this.getAdConfig()
            // this.ttReport()
        });
        // @ts-ignore
        bl.onShow((res) => {
            console.log("启动场景字段：" + res.scene);
            if (res["scene"] == "021036") {
                console.log("是从侧边栏启动的 adapter");
                this.canReward = true;
            }
        });
    }
    getOpenId(callback) {
        let self = this;
        let item = DataStorage_1.default.getItem("__gx_openId__", null);
        if (!!item) {
            console.log("获取到缓存的openid：" + item);
            self.openId = item;
            callback && callback(item);
            return;
        }
        if (self.getOpenidTry >= 5) {
            self.getOpenidTry = 0;
            console.warn("获取openId重试最大次数了");
            return;
        }
        window["bl"].login({
            success(res) {
                console.log(`login 调用成功${res.code} `);
                if (res.code) {
                    self.requestGet(`${GxConstant_1.default.Code2SessionUrl}?appId=${GxAdParams_1.AdParams.bilibili.appId}&code=${res.code}`, (res) => {
                        self.logi(res.data);
                        if (res.data.code == 1) {
                            self.openId = res.data.data.openid;
                            self.logi("获取openid成功：" + self.openId);
                            DataStorage_1.default.setItem("__gx_openId__", self.openId);
                            callback && callback(self.openId);
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
    initGravityEngine() {
        if (!!GxAdParams_1.AdParams.bilibili.gravityEngineAccessToken) {
            console.log("初始化ge");
            let debug = "none";
            if (window["geDebug"]) {
                debug = "debug";
            }
            const config = {
                accessToken: GxAdParams_1.AdParams.bilibili.gravityEngineAccessToken, // 项目通行证，在：网站后台-->设置-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
                clientId: this.openId, // 用户唯一标识，如产品为小游戏，则必须填用户openid（注意，不是小游戏的APPID！！！）
                autoTrack: {
                    appLaunch: true, // 自动采集 $MPLaunch
                    appShow: true, // 自动采集 $MPShow
                    appHide: true // 自动采集 $MPHide
                },
                name: "ge", // 全局变量名称, 默认为 gravityengine
                debugMode: debug // 是否开启测试模式，开启测试模式后，可以在 网站后台--设置--元数据--事件流中查看实时数据上报结果。（测试时使用，上线之后一定要关掉，改成none或者删除）
            };
            const ge = new GravityEngine(config);
            ge.setupAndStart();
            let item = DataStorage_1.default.getItem("geInit");
            if (!!item) {
                console.log("ge inited");
            }
            else {
                let versionNumber = 100;
                try {
                    //@ts-ignore
                    /*                  if (bl["getEnvInfoSync"]) {
                                          //@ts-ignore
                                          let ttElementElement = tt["getEnvInfoSync"]()["microapp"];

                                          let mpVersion = ttElementElement["mpVersion"];
                                          if (!!mpVersion && mpVersion != "preview" && mpVersion.indexOf(".") != -1) {

                                              let replace = mpVersion.replace(/\./g, "");

                                              let re = parseInt(replace);
                                              if (!isNaN(re)) {
                                                  versionNumber = re;
                                              }
                                          }


                                      }*/
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
    initBanner(initEndShow = false) {
        if (GxAdParams_1.AdParams.bilibili.banner.length == 0) {
            return;
        }
        try {
            if (this.bannerAd) {
                this.destroyBanner();
            }
        }
        catch (e) {
        }
        let onLoadCallback = () => {
            console.log(" banner 加载完成");
            this.bannerAd.offError(onErrorCallback);
            this.bannerAd.offLoad(onLoadCallback);
            this.bannerAd.offResize(onResizeCallback);
            if (initEndShow) {
                this.bannerAd.show().catch(e => {
                });
            }
        };
        let onErrorCallback = (err) => {
            console.log(" banner 广告错误" + JSON.stringify(err));
            this.bannerAd.offError(onErrorCallback);
            this.bannerAd.offLoad(onLoadCallback);
            this.bannerAd.offResize(onResizeCallback);
            this.bannerAd = null;
        };
        let onResizeCallback = (res) => {
            console.log("banner resize");
            this.bannerAd.offError(onErrorCallback);
            this.bannerAd.offLoad(onLoadCallback);
            this.bannerAd.offResize(onResizeCallback);
            // this.bannerAd.style.top = GxGame.screenHeight - res.height;
            // this.bannerAd.style.left = (GxGame.screenWidth - res.width) / 2;
        };
        // @ts-ignore
        this.bannerAd = bl.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.bilibili.banner /*,
                    adIntervals: Math.max(30, GxGame.adConfig.bannerUpdateTime),
                    style: {
                        left: 0,
                        top:0
                 /!*       top: GxGame.screenHeight,
                        width: GxGame.screenWidth / 2*!/
                    }*/
        });
        this.bannerAd.onLoad(onLoadCallback);
        this.bannerAd.onError(onErrorCallback);
        this.bannerAd.onResize(onResizeCallback);
    }
    showBanner() {
        console.warn("这头条banner能不用就不用了  banner调用失败官方会给个兜底的banner  这个banner无法改位置和大小");
        this.initBanner(true);
        /* if (this.bannerAd == null) {
             this.initBanner(true);
             return;
         }


         this.bannerAd
             .show()
             .then(() => {
             })
             .catch((res) => {
                 this.initBanner(true);

             });*/
    }
    hideBanner() {
        try {
            this.destroyBanner();
        }
        catch (e) {
        }
        this.bannerAd = null;
    }
    destroyBanner() {
        try {
            if (this.bannerAd) {
                this.bannerAd.destroy();
            }
            this.bannerAd = null;
        }
        catch (e) {
        }
    }
    initVideo() {
        if (GxAdParams_1.AdParams.bilibili.video == null || GxAdParams_1.AdParams.bilibili.video.length <= 0) {
            console.warn("激励视频参数空");
            return;
        }
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = bl.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.bilibili.video
        });
        this.videoAd.onLoad((res) => {
            console.log("激励视频加载", res);
        });
        this.videoAd.onError((err) => {
            console.log(err);
            console.log("激励视频-失败 onError");
            try {
                this._videoErrorUploadEvent(err["errCode"] + err["errMsg"] || "", err["errCode"] || "", err["errMsg"] || "");
            }
            catch (e) {
            }
        });
        this.videoAd.onClose((res) => {
            console.log(res);
            this.recorderResume();
            this._videoShowing = false;
            if (res && res.isEnded) {
                // this.videoReward++
                //
                // this.checkAdTarget()
                console.log("激励视频完成");
                this.videocallback && this.videocallback(true, 1);
                try {
                    this._videoCompleteEvent();
                }
                catch (e) {
                }
            }
            else {
                this.videocallback && this.videocallback(false, 0);
                try {
                    this._videoCloseEvent();
                }
                catch (e) {
                }
            }
            this.videoAd.load();
        });
        this.videoAd.load();
    }
    showVideo(complete, flag = "") {
        if (this._videoShowing) {
            this._videoTryCount++;
            complete && complete(false, 0);
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
        if (this.videoAd == null) {
            this.initVideo();
        }
        if (this.videoAd == null) {
            complete && complete(false, 0);
            this._videoShowing = false;
            try {
                this._videoErrorEvent("ad null");
            }
            catch (e) {
            }
            return;
        }
        let reportShow = false;
        this.videocallback = complete;
        // 用户点击观看视频广告时上报
        // @ts-ignore
        bl.reportScene({ sceneId: 1007 });
        this.videoAd
            .show()
            .then(() => {
            try {
                if (!reportShow) {
                    reportShow = true;
                    this._videoShowEvent();
                }
            }
            catch (e) {
            }
            this.recorderPause();
        })
            .catch((err) => {
            console.log(err);
            console.log("激励视频-失败 catch");
            this.videoAd
                .load()
                .then((res) => {
                return this.videoAd.show();
            })
                .then(() => {
                try {
                    if (!reportShow) {
                        reportShow = true;
                        this._videoShowEvent();
                    }
                }
                catch (e) {
                }
                this.recorderPause();
            })
                .catch((err) => {
                console.log(err);
                console.log("激励视频-失败 catch2");
                try {
                    this._videoErrorEvent(err["errCode"] + err["errMsg"] || "", err["errCode"] || "", err["errMsg"] || "");
                }
                catch (e) {
                }
                this.videoAd.load();
                this._videoShowing = false;
                // @ts-ignore
                bl.showModal({
                    title: "暂无广告",
                    content: "分享游戏获取奖励？",
                    confirmText: "分享",
                    success: (res) => {
                        if (res.confirm) {
                            GxGame_1.default.shareGame((ret) => {
                                this.videocallback && this.videocallback(ret, 1);
                            });
                        }
                        else {
                            this.videocallback && this.videocallback(false, 0);
                        }
                    },
                    fail: (res) => {
                        // @ts-ignore
                        bl.showToast({
                            title: "暂无广告，请稍后再试",
                            icon: "none"
                        });
                        this.videocallback && this.videocallback(false, 0);
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
        // @ts-ignore
        if (!bl.createInterstitialAd ||
            GxAdParams_1.AdParams.bilibili.inter == null ||
            GxAdParams_1.AdParams.bilibili.inter.length <= 0)
            return on_close && on_close();
        this.destroyNormalInter();
        // @ts-ignore
        this.interAd = bl.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.bilibili.inter
        });
        this.interAd &&
            this.interAd.onLoad(() => {
                console.log("插屏广告加载");
                on_show && on_show();
            });
        this.interAd &&
            this.interAd.onError((err) => {
                console.log("show inter err" + JSON.stringify(err));
                this.destroyNormalInter();
            });
        this.interAd &&
            this.interAd.onClose(() => {
                this.recorderResume();
                on_close && on_close();
                this.destroyNormalInter();
            });
        this.interAd &&
            this.interAd.load().then(() => {
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
        if (this.get_time() - this.interShowTime <=
            GxGame_1.default.adConfig.interTick * 1000)
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
                let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_interstitial", cc.Prefab));
                this.nativeInter = node.getComponent("gx_native_interstitial");
                this.nativeInter &&
                    this.nativeInter.show(native_data, () => {
                        this.interShowTime = this.get_time();
                        this.hideBanner();
                        on_show && on_show();
                    }, on_hide);
            }
        }, GxGame_1.default.isShenHe ? 0 : delay_time * 1000);
    }
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
        this.destroyNormalInter();
    }
    initRecorder() {
        // @ts-ignore
        if (!bl.getGameRecorderManager)
            return;
        // @ts-ignore
        this.gameRecorder = bl.getGameRecorderManager();
        // 设置录屏相关监听
        this.gameRecorder.onStart((res) => {
            console.log("录制开始", JSON.stringify(res));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.START;
            this.recorderTime = this.get_time();
            this.videoPath = null;
        });
        // 监听录屏过程中的错误，需根据错误码处理对应逻辑
        this.gameRecorder.onError((err) => {
            console.log("录制出错", JSON.stringify(err));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
        });
        // stop 事件的回调函数
        this.gameRecorder.onStop((res) => {
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
        try {
            if (this.gameRecorder && this.gameRecorderState == BaseAdapter_1.RECORDER_STATE.START) {
                this.gameRecorder.pause();
            }
        }
        catch (e) {
        }
    }
    recorderResume() {
        try {
            if (this.gameRecorder && this.gameRecorderState == BaseAdapter_1.RECORDER_STATE.PAUSE) {
                this.gameRecorder.resume();
            }
        }
        catch (e) {
        }
    }
    recorderStart() {
        try {
            if (this.gameRecorder && this.gameRecorderState == BaseAdapter_1.RECORDER_STATE.NO) {
                this.gameRecorder &&
                    this.gameRecorder.start({
                        duration: 300
                    });
            }
        }
        catch (e) {
        }
    }
    recorderStop(on_stop) {
        try {
            if (this.gameRecorder && this.gameRecorderState != BaseAdapter_1.RECORDER_STATE.NO) {
                this.onRecoderStop = on_stop;
                this.gameRecorder && this.gameRecorder.stop();
            }
        }
        catch (e) {
        }
    }
    shareRecorder(on_succ, on_fail) {
        /*没有录屏就转为普通分享*/
        if (this.gameRecorder == null || this.videoPath == null) {
            /*  this.createToast("分享失败");
              return on_fail && on_fail();*/
            let self = this;
            // @ts-ignore
            bl.shareAppMessage({
                title: GxAdParams_1.AdParams.bilibili.gameName,
                query: "",
                success() {
                    console.log("分享成功");
                    on_succ && on_succ();
                },
                fail(e) {
                    self.createToast("分享失败");
                    console.log("分享失败");
                    on_fail && on_fail();
                }
            });
            // return on_fail && on_fail();
            return;
        }
        // @ts-ignore
        bl.shareAppMessage({
            query: "",
            title: GxAdParams_1.AdParams.bilibili.gameName,
            subTitle: GxAdParams_1.AdParams.bilibili.gameName, //GxGame.shareWord[2] || GxGame.shareWord[1] || '',
            success: () => {
                console.log("分享视频成功");
                on_succ && on_succ();
                this.onRecoderStop = null;
                this.videoPath = null;
            },
            fail: (res) => {
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
    }
    showRecorderLayer(on_succ, on_fail) {
        console.warn("//TODO   show recorderLayer");
        if (this.shareRcorderLayer == null ||
            this.shareRcorderLayer === undefined ||
            !cc.isValid(this.shareRcorderLayer.node, true)) {
            /* let node = cc.instantiate(Utils.getRes('hs_ui/ui_share_rcorder', cc.Prefab));
                                    this.shareRcorderLayer = node.getComponent('hs_ui_share_rcorder');
                                    this.shareRcorderLayer && this.shareRcorderLayer.show(on_succ, on_fail);*/
        }
    }
    requestGet(url, successCallback, failCallback) {
        //@ts-ignore
        bl.request({
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
        bl.request({
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
                    if (typeof res.data == "string") {
                        successCallback && successCallback({
                            statusCode: res.statusCode,
                            header: res.header,
                            data: JSON.parse(res.data)
                        });
                        // console.log("转换成功");
                    }
                    else {
                        successCallback && successCallback({
                            statusCode: res.statusCode,
                            header: res.header,
                            data: res.data
                        });
                    }
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
        super.LOG("[BLAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[BLAdapter]", ...data);
    }
    logw(...data) {
        super.LOGW("[BLAdapter]", ...data);
    }
    addDesktop(callback) {
        // @ts-ignore
        if (!bl["checkShortcut"]) {
            callback && callback();
        }
        else {
            // @ts-ignore
            bl.addShortcut({
                success() {
                    callback && callback();
                },
                fail(err) {
                    console.log("添加桌面失败", err.errMsg);
                }
            });
        }
    }
    hasAddDesktop(can_add, has_add, on_fail) {
        // @ts-ignore
        if (!bl["checkShortcut"]) {
            on_fail && on_fail();
        }
        else {
            // @ts-ignore
            bl.checkShortcut({
                success(res) {
                    console.log("检查快捷方式", res.status);
                    if (res.status.exist) {
                        console.log("隐藏桌面");
                        has_add && has_add();
                    }
                    else {
                        can_add && can_add();
                    }
                },
                fail(res) {
                    console.log("检查快捷方式失败", res.errMsg);
                    on_fail && on_fail();
                }
            });
        }
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
            let launchOptionsSync = bl.getLaunchOptionsSync();
            let query = launchOptionsSync.query;
            clickId = query["clickid"];
            /*         let demoT = {
                            "getLaunchOptionsSync": {
                                "path": "",
                                "query": {
                                    "ad_params": "%7B%22cid%22%3A1792574695078004%2C%22ad_id%22%3A1792574677078025%2C%22log_extra%22%3A%7B%22is_pack_v2%22%3Atrue%2C%22material_info%22%3A%22type%3A21%2Cmid%3A6925606625542848525%2Csource%3A4101%2Cp_ids%3A%5B%5D%2Cid%3A3173460711063632953%7Ctype%3A19%2Cmid%3A16657493%2Csource%3A0%2Cp_ids%3A%5B%5D%2Cid%3A0%7Ctype%3A53%2Cmid%3A7341570561083129882%2Csource%3A0%2Cp_ids%3A%5B%5D%2Cid%3A0%7Ctype%3A10%2Cmid%3A7342385963638721803%2Csource%3A0%2Cp_ids%3A%5B%5D%2Cid%3A7342385963638721803%7Ctype%3A9%2Cmid%3A7342380894593876018%2Csource%3A0%2Cp_ids%3A%5B%5D%2Cid%3A2525607275232476974%7Ctype%3A11%2Cmid%3A6939779258709737510%2Csource%3A3202%2Cp_ids%3A%5B%5D%2Cid%3A1758608621684839706%7Ctype%3A11%2Cmid%3A6939723808912162819%2Csource%3A21054%2Cp_ids%3A%5B%5D%2Cid%3A1542453906373671372%7Ctype%3A14%2Cmid%3A7203621798788612152%2Csource%3A21000%2Cp_ids%3A%5B%5D%2Cid%3A95892197840826811%22%2C%22attributed_site_id%22%3A%227338268310115041290%22%2C%22rit%22%3A40001%2C%22ad_price%22%3A%22ZelVeQAdg45l6VV5AB2DjlCBWO2f66oUe9S2uw%22%2C%22bdid%22%3A%2214d5cb93032f19b0fe1fe75dd6d945637177ca9a9d59950644589282c922251c%22%2C%22req_id%22%3A%2220240307134943CD602844A6DDB2BF2EDA%22%2C%22style_id%22%3A600009%2C%22landing_type%22%3A16%2C%22hyrule_atype%22%3A%5B14%2C20%5D%2C%22variation_id%22%3A%227338268310115041290%22%2C%22isoid%22%3A%22%22%2C%22orit%22%3A40001%2C%22compliance_data%22%3A%22%7B%5C%22biz_type%5C%22%3A%5C%22ad%5C%22%2C%5C%22ad%5C%22%3A%7B%5C%22landing_type%5C%22%3A16%2C%5C%22pricing_type%5C%22%3A9%2C%5C%22market_online_status%5C%22%3A31%2C%5C%22content_type%5C%22%3A1%2C%5C%22is_dsp%5C%22%3Afalse%2C%5C%22dsp_type%5C%22%3A0%2C%5C%22platform_version%5C%22%3A2%2C%5C%22group_type%5C%22%3A102%7D%7D%22%2C%22convert_component_suspend%22%3A0%2C%22group_type%22%3A102%2C%22external_action%22%3A25%2C%22content_type%22%3A1%2C%22disable_ad_label_display_by_sati%22%3A0%2C%22reward_again_mark%22%3A0%2C%22maca%22%3A%2202%3A00%3A00%3A00%3A00%3A00%22%2C%22pricing_type%22%3A9%2C%22ad_recommend_flag%22%3A0%2C%22ad_author_id%22%3A0%2C%22cta_mids%22%3A%226925606625542848525%22%2C%22attributed_material_items%22%3A%22%5B%7B%5C%22item_type%5C%22%3A106%2C%5C%22mid%5C%22%3A7341311839877578803%7D%2C%7B%5C%22item_type%5C%22%3A104%2C%5C%22mid%5C%22%3A7340904983090675750%7D%2C%7B%5C%22item_type%5C%22%3A100%2C%5C%22mid%5C%22%3A7342385837261422643%7D%2C%7B%5C%22item_type%5C%22%3A53%2C%5C%22mid%5C%22%3A7341570561083129882%7D%2C%7B%5C%22item_type%5C%22%3A9%2C%5C%22mid%5C%22%3A7342380894593876018%7D%2C%7B%5C%22item_type%5C%22%3A105%2C%5C%22mid%5C%22%3A7341563438542667813%7D%2C%7B%5C%22item_type%5C%22%3A103%2C%5C%22mid%5C%22%3A6925606625542848525%7D%5D%22%2C%22real_site_id%22%3A%227338268310115041290%22%2C%22convert_id%22%3A0%2C%22ad_show_type%22%3A0%2C%22style_ids%22%3A%5B600009%5D%2C%22card_id%22%3A0%2C%22ad_item_id%22%3A7342385963638721803%2C%22clickid%22%3A%22EPTwu4_lypcDGNjb8O-v9JIGIJOvod6PzP4CMAw4wbgCQiIyMDI0MDMwNzEzNDk0M0NENjAyODQ0QTZEREIyQkYyRURBSMG4ApABAA%22%2C%22price%22%3A10179215%2C%22component_ids%22%3A%5B100050%2C800545%2C800665%5D%2C%22pigeon_num%22%3A10395466%2C%22variation_types%22%3A%221001%22%2C%22wdsignals%22%3A0%2C%22is_pack_ng%22%3A1%2C%22real_material_items%22%3A%22%5B%7B%5C%22item_type%5C%22%3A105%2C%5C%22mid%5C%22%3A7341563438542667813%7D%2C%7B%5C%22item_type%5C%22%3A103%2C%5C%22mid%5C%22%3A6925606625542848525%7D%2C%7B%5C%22item_type%5C%22%3A106%2C%5C%22mid%5C%22%3A7341311839877578803%7D%2C%7B%5C%22item_type%5C%22%3A104%2C%5C%22mid%5C%22%3A7340904983090675750%7D%2C%7B%5C%22item_type%5C%22%3A100%2C%5C%22mid%5C%22%3A7342385837261422643%7D%2C%7B%5C%22item_type%5C%22%3A9%2C%5C%22mid%5C%22%3A7342380894593876018%7D%2C%7B%5C%22item_type%5C%22%3A53%2C%5C%22mid%5C%22%3A7341570561083129882%7D%5D%22%2C%22render_type%22%3A%22h5%22%2C%22jdsignals%22%3A0%7D%2C%22is_soft_ad%22%3A0%2C%22web_url%22%3A%22https%3A%2F%2Fwww.chengzijianzhan.com%2Ftetris%2Fpage%2F7338268310115041290%3Fprojectid%3D7341558209071464460%26promotionid%3D7342385101558759478%26creativetype%3D15%26clickid%3DB.eBa7IEwdefDUhKkmgOvZ5waLiXWQva29AgO4ozLuTYrEsfoTS62EtulfBRsaDthObbEptpKvx5usgwOpmvF1d3no3xsrFgHxmfSzED4qMad8KEf69XmDGwLnLJQeez2hgE%26mid1%3D0%26mid2%3D7342380894593876018%26mid3%3D7341570561083129882%26mid4%3D__MID4__%26mid5%3D7342385837261422643%26ad_id%3D1792574677078025%26cid%3D1792574695078004%26req_id%3D20240307134943CD602844A6DDB2BF2EDA%22%2C%22web_title%22%3A%22%E7%88%86%E6%A2%97%E6%B8%B8%E6%88%8F%E6%8E%A8%E8%8D%90%22%2C%22intercept_flag%22%3A2%7D",
                                    "mid1": "0",
                                    "clickid": "B.DP2lmE6safpTcaQjcXoCEs2i4lF0rmdPAoDO68i7E2KB7HdSS3mo1t8HExqN0G6stRk2mq8Gn7yCC7kaetou7eJ6dM7aB4Rs5XamYAXlRrjXh4r3fycwAey5SCk3PbHCS",
                                    "mid5": "7342385837261422643",
                                    "creativetype": "15",
                                    "promotionid": "7342385101558759478",
                                    "mid4": "__MID4__",
                                    "requestid": "20240307134943CD602844A6DDB2BF2EDA",
                                    "projectid": "7341558209071464460",
                                    "mid3": "7341570561083129882",
                                    "mid6": "__MID6__",
                                    "mid2": "7342380894593876018",
                                    "csite": "40001",
                                    "aid": "1128",
                                    "appId": "tt35ad4310aa9d600102",
                                    "mpVersion": "1.0.3"
                                },
                                "scene": "025001",
                                "subScene": "",
                                "group_id": "7342385963638721803",
                                "extra": {
                                    "aid": "1128",
                                    "appId": "tt35ad4310aa9d600102",
                                    "mpVersion": "1.0.3"
                                },
                                "showFrom": 10,
                                "suggestCreateRoomAutomatically": false
                            },
                            "channel": "tt"
                        };*/
            if (!!clickId) {
                DataStorage_1.default.setItem("__clickid__", clickId);
                return callback && callback(true);
            }
            return callback && callback(false);
        }
        catch (e) {
            callback && callback(false);
        }
    }
    /**
     * 保存数据
     * @param key
     * @param data
     * @param callback
     */
    saveData(key, data, callback) {
        this.getOpenId((openId) => {
            if (!!openId) {
                let encryptData = this.encrypt(GxAdParams_1.AdParams.bilibili.appId, openId, key, data);
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
        this.getOpenId((openId) => {
            if (!!openId) {
                this.requestPost("https://api.sjzgxwl.com/commonData/data/getData/v1", {
                    appId: GxAdParams_1.AdParams.bilibili.appId,
                    openId: openId,
                    key: key
                }, (res) => {
                    if (res["data"] && res["data"]["code"] == 1 && res.data["data"]) {
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
    initThinkData() {
        let appId = "commonAppId";
        if (GxAdParams_1.AdParams.bilibili["fl_appId"]) {
            appId = GxAdParams_1.AdParams.bilibili["fl_appId"];
        }
        // TE SDK 配置对象
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
        let launchOptionsSync = window["bl"].getLaunchOptionsSync();
        let gameAppId = "";
        let gameAppVersion = "";
        if (launchOptionsSync && launchOptionsSync["extra"]) {
            gameAppId = launchOptionsSync.extra["appId"];
            gameAppVersion = launchOptionsSync.extra["mpVersion"];
        }
        // let sessionId = new Date().valueOf() + (Math.random() * 10000 + 100) + this.openId;
        var superProperties = {
            launchOptions: launchOptionsSync,
            gameAppId: gameAppId,
            gameAppVersion: gameAppVersion /*,
            "#session_id": sessionId*/
        };
        window["TDAnalytics"].setSuperProperties(superProperties);
        /*     window["TDAnalytics"].track({
                 eventName: "ta_login"  //上报登录事件

             });*/
    }
}
exports.default = BLAdapter;
