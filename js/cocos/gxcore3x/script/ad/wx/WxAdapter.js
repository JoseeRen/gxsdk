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
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
const WxCustomAd_1 = __importStar(require("./WxCustomAd"));
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const OpenDataUtil_1 = __importDefault(require("../../util/OpenDataUtil"));
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const GxEngine_1 = __importDefault(require("../../sdk/GxEngine"));
const WxJump_1 = __importDefault(require("./WxJump"));
// import GravityEngine from "../../sdk/gravityengine.mg.cocoscreator.min"
const gravityengine_mg_cocoscreator_min_js_1 = __importDefault(require("../../sdk/gravityengine.mg.cocoscreator.min.js"));
const cc_1 = require("cc");
class WxAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.shareRcorderLayer = null;
        this.recorderTime = 0;
        this.customInterAd = null;
        this.customLeftAd = null;
        this.customRightAd = null;
        this._showedCustomInter = true;
        this._loadEndCustomInter = true;
        this.gxEngine = null;
        this.interCount = 0; //插屏显示次数
        this.appId = "";
        this.openId = "";
        this._shareToFriendCallback = null;
        this.normalInterShowed = true;
        this.unionId = null;
        this._errCount = 0;
        this._videoShowing = false;
        this._videoTryCount = 0;
        this.shareValue = 0;
        this.rewardValue = 0;
        this.getOpenidTry = 0;
        this._getOpenIdSuccess = false;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new WxAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        //@ts-ignore
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate);
        });
        updateManager.onUpdateReady(function () {
            //@ts-ignore
            wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，重启更好玩！",
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            });
        });
        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        });
        OpenDataUtil_1.default.initChannel(GxConstant_1.default.IS_WECHAT_GAME ? "wx" : "qq");
        this.gxEngine = new GxEngine_1.default();
        this.initOpenId();
        super.initAd();
        GxGame_1.default.adConfig.interTick = 0;
        // this.initBanner();
        // this.initVideo();
        this.initCustomInter();
        this.initCustomLeft();
        this.initCustomRight();
        this.initInter();
        this.initRecorder();
        this.initGridAd();
        this.initJump(GxAdParams_1.AdParams.wx.app_key, GxAdParams_1.AdParams.wx.app_version, () => {
        });
    }
    initOpenId() {
        // @ts-ignore
        wx.onShareMessageToFriend((res) => {
            // https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareMessageToFriend.html
            this.logi("定向分享结果：" + res.success);
            if (res && res.success) {
                this.logi("定向分享成功");
            }
            else {
                this.logi("定向分享失败");
            }
            this._shareToFriendCallback &&
                this._shareToFriendCallback(res && res.success);
            this._shareToFriendCallback = null;
        });
        if (window["qq"]) {
            this.appId = GxAdParams_1.AdParams.qq.appId;
        }
        else {
            this.appId = GxAdParams_1.AdParams.wx.appId;
        }
        this.getOpenId(() => {
            this.initSubmsg();
            this.gxEngine.init({
                openId: this.openId,
                appToken: GxAdParams_1.AdParams.wx.appId,
                appId: GxAdParams_1.AdParams.wx.appId,
                unionId: this.unionId
            }).then(e => {
                console.log("gxEngine初始化成功");
            }).catch(e => {
                console.log("gxEngine初始化失败");
            });
            this.initGravityEngine();
            this.initThinkData();
        });
        // // let item = cc.sys.localStorage.getItem("__gx_openId");
        // let item1 = DataStorage.getItem("__gx_openId__", "");
        // if (!!item1) {
        //     this.openId = item1;
        //     this.logi("获取到缓存的openId:" + this.openId);
        //     this.initSubmsg();
        //     return;
        // }
        // try {
        //     let self = this;
        //     if (!!this.appId) {
        //         this.logi("获取到appid:" + this.appId);
        //         // @ts-ignore
        //         wx.login({
        //             success(res) {
        //                 if (res.code) {
        //                     // 发起网络请求
        //                     self.logi("获取code成功：" + res.code);
        //                     self.requestGet(
        //                         `${GxConstant.Code2SessionUrl}?appId=${self.appId}&code=${res.code}`,
        //                         (res) => {
        //                             self.logi(res.data);
        //                             if (res.data.code == 1) {
        //                                 self.openId = res.data.data.openid;
        //                                 self.logi("获取openid成功：" + self.openId);
        //                                 DataStorage.setItem("__gx_openId__", self.openId);
        //                                 self.initSubmsg();
        //                             } else {
        //                                 self.logw("登录失败！" + res.data["msg"]);
        //                             }
        //                         },
        //                         (res) => {
        //                             self.logw("登录失败！" + res["errMsg"]);
        //                             self.logw(res);
        //                         }
        //                     );
        //                     /*             wx.request({
        //                                                    // url: `http://192.168.1.242:19210/openid/code2Session/v2?appId=${self.appId}&code=${res.code}`,
        //                                                    url: `${GxConstant.Code2SessionUrl}?appId=${self.appId}&code=${res.code}`,
        //                                                    success(res) {
        //                                                        console.log(res.data)
        //                                                        if (res.data.code == 1) {
        //                                                            self.openId = res.data.data.openid;
        //                                                            self.logi("获取openid成功：" + self.openId);
        //                                                            DataStorage.setItem("__gx_openId__", self.openId)
        //                                                            self.initSubmsg()
        //                                                        } else {
        //                                                            self.logw('登录失败！' + res.data["msg"])
        //                                                        }
        //                                                    },
        //                                                    fail(res) {
        //                                                        self.logw('登录失败！' + res["errMsg"])
        //                                                        self.logw(res)
        //                                                    }
        //                                                })*/
        //                 } else {
        //                     self.logw("获取登录code失败！" + res.errMsg);
        //                 }
        //             },
        //             fail(res) {
        //                 self.logw("wx login失败！" + res.errMsg);
        //             }
        //         });
        //     } else {
        //         self.logw("获取wx appid失败或者 GxAdParams中没有配置wx或者 qq的appid");
        //     }
        // } catch (e) {
        //     this.logw(e);
        //     this.logw("读取project.config.json失败");
        // }
    }
    initGravityEngine() {
        if (!!GxAdParams_1.AdParams.wx.gravityEngineAccessToken) {
            console.log("初始化ge");
            let debug = "none";
            if (window["geDebug"]) {
                debug = "debug";
            }
            const config = {
                accessToken: GxAdParams_1.AdParams.wx.gravityEngineAccessToken, // 项目通行证，在：网站后台-->设置-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
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
            }
            else {
                ge.initialize({
                    name: this.openId,
                    version: 100,
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
    initBanner() {
        if (GxAdParams_1.AdParams.wx.banner.length == 0)
            return;
        if (this.bannerAd)
            this.destroyBanner();
        let style = {};
        if (GxGame_1.default.screenHeight < GxGame_1.default.screenWidth) {
            //横屏
            style = {
                top: GxGame_1.default.screenHeight - 100, //横屏100  竖屏125
                left: (GxGame_1.default.screenWidth - GxGame_1.default.screenWidth * 0.3) / 2, //横屏 (AD_WX.sceneW - AD_WX.sceneW * 0.3) / 2 竖屏 0.9
                width: GxGame_1.default.screenWidth * 0.3 //横屏 AD_WX.sceneW * 0.3 竖屏 0.9
            };
        }
        else {
            //竖屏
            style = {
                top: GxGame_1.default.screenHeight - 125, //横屏100  竖屏125
                left: (GxGame_1.default.screenWidth - GxGame_1.default.screenWidth * 0.9) / 2, //横屏 (AD_WX.sceneW - AD_WX.sceneW * 0.3) / 2 竖屏 0.9
                width: GxGame_1.default.screenWidth * 0.9 //横屏 AD_WX.sceneW * 0.3 竖屏 0.9
            };
        }
        // @ts-ignore
        this.bannerAd = wx.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.wx.banner,
            adIntervals: Math.max(30, GxGame_1.default.adConfig.bannerUpdateTime),
            style: style /* {
                left: 0,
                top: GxGame.screenHeight,
                width: GxGame.screenWidth / 2
            }*/
        });
        this.bannerAd.onLoad(() => {
            console.log(" banner 加载完成");
        });
        this.bannerAd.onError((err) => {
            console.log(" banner 广告错误" + JSON.stringify(err));
        });
        this.bannerAd.onResize((res) => {
            /*    this.bannerAd.style.top = GxGame.screenHeight - res.height
                      this.bannerAd.style.left = (GxGame.screenWidth - res.width) / 2;*/
        });
    }
    showBanner() {
        // if (this.bannerAd == null) {
        this.initBanner();
        // }
        if (this.bannerAd == null) {
            console.log("banner == null  return le");
            return;
        }
        this.bannerAd
            .show()
            .then(() => {
        })
            .catch((res) => {
            this.initBanner();
            this.bannerAd.show().then(() => {
                /* if (window["ge"]) {
                     //@ts-ignore
                     ge.adShowEvent("banner", AdParams.wx.banner, {custom_param: ""});

                 }*/
            }).catch(e => {
            });
            ;
        });
    }
    hideBanner() {
        if (this.bannerAd) {
            this.bannerAd.offLoad();
            this.bannerAd.offError();
            this.bannerAd.offResize();
            this.bannerAd.hide();
        }
        this.destroyBanner();
    }
    destroyBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
        }
        this.bannerAd = null;
        // this.initBanner()
    }
    initVideo() {
        if (GxAdParams_1.AdParams.wx.video == null || GxAdParams_1.AdParams.wx.video.length <= 0)
            return;
        this.destroyVideo();
        let isnull = false;
        if (this.videoAd == null) {
            isnull = true;
            //@ts-ignore
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: GxAdParams_1.AdParams.wx.video
            });
            // this.videoAd.load();  //创建时会自己加载  如果再load会走两次onload
            this.videoAd.onLoad((res) => {
                console.log(res);
                console.log("激励视频加载");
                if (res) {
                    let resShareValue = res["shareValue"];
                    if (resShareValue == 1 || resShareValue === 0) {
                        this.shareValue = res.shareValue;
                    }
                    let resrewardValue = res["rewardValue"];
                    if (resrewardValue == 1 || resrewardValue === 0) {
                        this.rewardValue = res.rewardValue;
                    }
                }
                if (isnull) {
                    isnull = false;
                    this._videoAdShow();
                }
            });
            this.videoAd.onError((err) => {
                console.log(err);
                console.log("激励视频-失败");
                //这可能会上报 两次
                // this._videoErrorEvent();
                try {
                    let errCode = err["err_code"] || err["errno"] || err["errCode"] || "";
                    // this._videoErrorUploadEvent(errCode + err["errMsg"] || "", errCode, err["errMsg"] || "");
                    console.log(errCode + err["errMsg"] || "", errCode, err["errMsg"] || "");
                }
                catch (e) {
                }
            });
            this.videoAd.onClose((res) => {
                console.log("激励视频关闭");
                this.recorderResume();
                cc_1.director.resume();
                this._videoShowing = false;
                if (res && res.isEnded) {
                    console.log("激励视频完成");
                    this.videocallback && this.videocallback(true);
                    try {
                        this._videoCompleteEvent();
                    }
                    catch (e) {
                    }
                }
                else {
                    this.videocallback && this.videocallback(false);
                    try {
                        this._videoCloseEvent();
                    }
                    catch (e) {
                    }
                }
                //试试提升一下曝光
                // this.videoAd.load();
                this.destroyVideo();
            });
            if (this.videoAd == null && this._videoShowing) {
                this._videoShowing = false;
                this.videocallback && this.videocallback(false);
                try {
                    console.log("ad null");
                    // this._videoErrorEvent("ad null");
                }
                catch (e) {
                }
            }
        }
        else {
            this._videoAdShow();
        }
    }
    _videoAdShow() {
        try {
            GxGame_1.default.gameEvent("selfReward", {});
        }
        catch (e) {
        }
        if (this.videoAd) {
            this.videoAd
                .show()
                .then(() => {
                this._errCount = 0;
                if (window["ge"]) {
                    try {
                        //@ts-ignore
                        ge.adShowEvent("reward", GxAdParams_1.AdParams.wx.video, { custom_param: "" });
                    }
                    catch (e) {
                    }
                }
                try {
                    // this._videoShowEvent();
                }
                catch (e) {
                }
                try {
                    GxGame_1.default.gameEvent("selfRewardShowSuccess", {});
                }
                catch (e) {
                }
                this.recorderPause();
                cc_1.director.pause();
            })
                .catch((err) => {
                console.log("catch 1");
                console.warn(err);
                this._errCount++;
                if (this._errCount >= 4) {
                    this._errCount = 0;
                    this.videoAd.offClose();
                    this.videoAd.offLoad();
                    this.videoAd = null;
                    this.initVideo();
                }
                else {
                    this.videoAd
                        .load()
                        .then((res) => {
                        console.log("video load2");
                        return this.videoAd.show().then(() => {
                            this._errCount = 0;
                            if (window["ge"]) {
                                try {
                                    //@ts-ignore
                                    ge.adShowEvent("reward", GxAdParams_1.AdParams.wx.video, { custom_param: "" });
                                }
                                catch (e) {
                                }
                            }
                            try {
                                // this._videoShowEvent();
                            }
                            catch (e) {
                            }
                            try {
                                GxGame_1.default.gameEvent("selfRewardShowSuccess", {});
                            }
                            catch (e) {
                            }
                            this.recorderPause();
                            cc_1.director.pause();
                        });
                    })
                        .catch((e2) => {
                        // this._errCount = 0;
                        console.log("catch 2");
                        console.warn(e2);
                        try {
                            let errCode = err["err_code"] || err["errno"] || err["errCode"] || "";
                            // this._videoErrorEvent(errCode + err["errMsg"] || "", errCode, err["errMsg"] || "");
                            console.log(errCode + err["errMsg"] || "", errCode, err["errMsg"] || "");
                        }
                        catch (e) {
                        }
                        // this.videoAd.load();
                        //@ts-ignore
                        wx.showToast({
                            title: "暂无广告，请稍后再试",
                            icon: "none"
                        });
                        this._videoShowing = false;
                        this.videocallback && this.videocallback(false);
                    });
                }
            });
        }
        else {
            console.log("video null");
            this._videoShowing = false;
            try {
                // this._videoErrorEvent("isnull");
                console.log("isnull");
            }
            catch (e) {
            }
            try {
                //@ts-ignore
                wx.showToast({
                    title: "暂无广告，请稍后再试",
                    icon: "none"
                });
                this.videocallback && this.videocallback(false);
                this.destroyVideo();
                //2024年8月21日14:13:38  修改不重试了
            }
            catch (e) {
            }
        }
    }
    showVideo(complete, flag = "") {
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
        this.videocallback = complete;
        this.initVideo();
    }
    destroyVideo() {
        // if (this.videoAd) {
        //     this.videoAd.destroy();
        // }
        // this.videoAd = null;
    }
    initInter() {
        if (GxAdParams_1.AdParams.wx.inter == null || GxAdParams_1.AdParams.wx.inter.length <= 0)
            return;
        this.destroyNormalInter();
        //@ts-ignore
        // this.normalInterShowed=false;
        this.interAd = wx.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.wx.inter
        });
        this.interAd &&
            this.interAd.onLoad(() => {
                this.logi("插屏广告加载");
            });
        this.interAd &&
            this.interAd.onError((err) => {
                this.logi("show inter err" + JSON.stringify(err));
                this.destroyNormalInter();
            });
        this.interAd && this.interAd.load();
    }
    /**普通插屏 */
    showInterstitial(on_show, on_close) {
        //@ts-ignore
        if (!wx.createInterstitialAd ||
            GxAdParams_1.AdParams.wx.inter == null ||
            GxAdParams_1.AdParams.wx.inter.length <= 0) {
            return on_close && on_close();
        }
        console.log(this.interAd);
        if (this.interAd == null) {
            this.logi("需要重新加载插屏");
            this.initInter();
        }
        else {
            this.logi("不需要重新加载插屏");
        }
        if (this.interAd) {
            this.logi("插屏不空  直接 显示");
            this.interAd &&
                this.interAd.onClose(() => {
                    this.recorderResume();
                    cc_1.director.resume();
                    on_close && on_close();
                    this.destroyNormalInter();
                    this.initInter();
                });
            if (window["ge"]) {
                try {
                    //@ts-ignore
                    ge.adShowEvent("interstitial", GxAdParams_1.AdParams.wx.inter, { custom_param: "" });
                }
                catch (e) {
                }
            }
            this.interAd
                .show()
                .then(() => {
                this.recorderPause();
                cc_1.director.pause();
                on_show && on_show();
                this.hideBanner();
                this.interShowTime = this.get_time();
            })
                .catch((e) => {
                on_close && on_close();
                this.destroyNormalInter();
                this.initInter();
            });
        }
        else {
            this.logi("插屏空 不能展示了");
            on_close && on_close();
        }
    }
    destroyNormalInter() {
        this.logi("销毁插屏");
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
            this.interCount++;
            // if (this.interCount % 2 == 1) {
            this.showInterstitial(on_show, on_hide);
            // } else {
            //     this.showCustomInter(on_show, on_hide);
            // }
            /*  let native_data = this.getLocalNativeData(ad_native_type.inter1);
                  if (native_data == null || native_data === undefined) {
                      this.showInterstitial(on_show, on_hide);
                  } else {
                      let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_interstitial', cc.Prefab));
                      this.nativeInter = node.getComponent('gx_native_interstitial');
                      this.nativeInter && this.nativeInter.show(native_data, () => {
                          this.interShowTime = this.get_time();
                          this.hideBanner();
                          on_show && on_show();
                      }, on_hide);
                  }*/
        }, GxGame_1.default.isShenHe ? 0 : delay_time * 1000);
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        this.showNativeInterstitial(on_show, on_hide, delay_time);
    }
    initCustomInter() {
        if (GxAdParams_1.AdParams.wx.inter_custom == null || GxAdParams_1.AdParams.wx.inter_custom.length <= 0)
            return;
        this.customInterAd = new WxCustomAd_1.default();
        this.customInterAd.init(GxAdParams_1.AdParams.wx.inter_custom, WxCustomAd_1.CustomAdType.Type5x3, 30);
    }
    initCustomLeft() {
        if (GxAdParams_1.AdParams.wx.custom_left == null || GxAdParams_1.AdParams.wx.custom_left.length <= 0)
            return;
        this.customLeftAd = new WxCustomAd_1.default();
        this.customLeftAd.init(GxAdParams_1.AdParams.wx.custom_left, WxCustomAd_1.CustomAdType.TypeLeftOne, 30);
    }
    initCustomRight() {
        if (GxAdParams_1.AdParams.wx.custom_right == null || GxAdParams_1.AdParams.wx.custom_right.length <= 0)
            return;
        this.customRightAd = new WxCustomAd_1.default();
        this.customRightAd.init(GxAdParams_1.AdParams.wx.custom_right, WxCustomAd_1.CustomAdType.TypeRightOne, 30);
    }
    showCustomInter(on_show, on_close) {
        if (this.customInterAd) {
            if (window["ge"]) {
                try {
                    //@ts-ignore
                    ge.adShowEvent("native", GxAdParams_1.AdParams.wx.inter_custom, { custom_param: "" });
                }
                catch (e) {
                }
            }
            this.customInterAd.show(() => {
                on_show && on_show();
            }, on_close);
        }
        else {
            console.warn("customInter空 是不是没初始化init Ad");
            this.initCustomInter();
        }
    }
    showCustomLeft(on_show, on_close) {
        this.customLeftAd && this.customLeftAd.show(on_show, on_close);
    }
    showCustomRight(on_show, on_close) {
        this.customRightAd && this.customRightAd.show(on_show, on_close);
    }
    initGridAd() {
        if (GxAdParams_1.AdParams.wx.grid == null || GxAdParams_1.AdParams.wx.grid.length <= 0)
            return;
        this.gridad = new WxCustomAd_1.default();
        this.gridad.init(GxAdParams_1.AdParams.wx.grid, WxCustomAd_1.CustomAdType.TypeMoreBanner, 30);
    }
    showGridAd(on_show, on_close) {
        if (this.gridad) {
            this.gridad.show(on_show, on_close);
        }
        else {
            console.warn("GridAd空 是不是没初始化init Ad");
            this.initGridAd();
        }
    }
    hideGridAd() {
        console.log("hideGridAd: ", this.gridad);
        this.gridad && this.gridad.hide();
    }
    hideCustomInter() {
        this.customInterAd && this.customInterAd.hide();
    }
    hideCustomLeft() {
        this.customLeftAd && this.customLeftAd.hide();
    }
    hideCustomRight() {
        this.customRightAd && this.customRightAd.hide();
    }
    /*    destroyCustomInter() {


              if (this.customInterAd) {
                  this.customInterAd.destroy();
              }
              this.customInterAd = null;
          }*/
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
        // this.destroyNormalInter();  不销毁普通插屏了  可能预加载的也变空了
    }
    initRecorder() {
        /*    if (!wx.getGameRecorderManager) return;

                this.gameRecorder = wx.getGameRecorderManager();

                // 设置录屏相关监听
                this.gameRecorder.onStart(res => {
                    console.log('录制开始', JSON.stringify(res));
                    this.gameRecorderState = RECORDER_STATE.START;
                    this.recorderTime = this.get_time();
                    this.videoPath = null;
                })

                // 监听录屏过程中的错误，需根据错误码处理对应逻辑
                this.gameRecorder.onError(err => {
                    console.log('录制出错', JSON.stringify(err));
                    this.gameRecorderState = RECORDER_STATE.NO;
                })

                // stop 事件的回调函数
                this.gameRecorder.onStop(res => {
                    this.gameRecorderState = RECORDER_STATE.NO;
                    this.videoPath = null;
                    if (res && res.videoPath) {
                        if (this.get_time() - this.recorderTime >= 3 * 1000) {
                            this.videoPath = res.videoPath;
                            console.log(`录屏停止，录制成功。videoID is ${res.videoPath}`)
                        } else {
                            console.log(`录屏停止，录制失败。录屏时间<3s`)
                        }
                    } else {
                        console.log(`录屏停止，录制失败`)
                    }

                    this.onRecoderStop && this.onRecoderStop(this.videoPath != null);
                })

                // pause 事件的回调函数
                this.gameRecorder.onPause(() => {
                    console.log('暂停录制')
                    this.gameRecorderState = RECORDER_STATE.PAUSE;
                })

                // resume 事件的回调函数
                this.gameRecorder.onResume(() => {
                    console.log('继续录制')
                    this.gameRecorderState = RECORDER_STATE.RESUME;
                })*/
    }
    recorderPause() {
        /*  if (this.gameRecorder && this.gameRecorderState == RECORDER_STATE.START) {
                  this.gameRecorder.pause();
              }*/
    }
    recorderResume() {
        /* if (this.gameRecorder && this.gameRecorderState == RECORDER_STATE.PAUSE) {
                 this.gameRecorder.resume();
             }*/
    }
    recorderStart() {
        /* if (this.gameRecorder && this.gameRecorderState == RECORDER_STATE.NO) {
                 this.gameRecorder && this.gameRecorder.start({
                     duration: 300
                 });
             }*/
    }
    recorderStop(on_stop) {
        /* if (this.gameRecorder && this.gameRecorderState != RECORDER_STATE.NO) {
                 this.onRecoderStop = on_stop;
                 this.gameRecorder && this.gameRecorder.stop();
             }*/
    }
    shareRecorder(on_succ, on_fail) {
        if (this.gameRecorder == null || this.videoPath == null) {
            this.createToast("分享失败");
            return on_fail && on_fail();
        }
        // @ts-ignore
        wx.shareAppMessage({
            channel: "video",
            query: "",
            title: GxGame_1.default.shareWord[0] || "",
            desc: GxGame_1.default.shareWord[2] || GxGame_1.default.shareWord[1] || "",
            extra: {
                videoPath: this.videoPath, // 可用录屏得到的本地文件路径
                videoTopics: [GxGame_1.default.shareWord[2]],
                hashtag_list: [GxGame_1.default.shareWord[2]]
            },
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
        /*   if (this.shareRcorderLayer == null || this.shareRcorderLayer === undefined || !cc.isValid(this.shareRcorderLayer.node, true)) {
                   let node = cc.instantiate(Utils.getRes('hs_ui/ui_share_rcorder', cc.Prefab));
                   this.shareRcorderLayer = node.getComponent('hs_ui_share_rcorder');
                   this.shareRcorderLayer && this.shareRcorderLayer.show(on_succ, on_fail);
               }*/
    }
    logi(...data) {
        super.LOG("[WxAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[WxAdapter]", ...data);
    }
    logw(...data) {
        super.LOGW("[WxAdapter]", ...data);
    }
    /**
     * 定向分享给好友
     */
    shareMessageToFriend(callback) {
        console.log("微信设置回调");
        let boolean = OpenDataUtil_1.default.checkHasOpenData();
        if (boolean) {
            this._shareToFriendCallback = callback;
            OpenDataUtil_1.default.shareMessageToFriend();
        }
        else {
            callback && callback(false);
        }
    }
    getSubIds() {
        if (GxAdParams_1.AdParams.wx["subIds"] && GxAdParams_1.AdParams.wx.subIds.length > 0) {
            return GxAdParams_1.AdParams.wx.subIds;
        }
        return [];
    }
    requestGet(url, successCallback, failCallback) {
        // @ts-ignore
        wx.request({
            url: url,
            success(res) {
                successCallback && successCallback(res);
            },
            fail(res) {
                failCallback && failCallback(res);
            }
        });
    }
    initSubmsg() {
        // @ts-ignore
        if (wx.uma) {
            // @ts-ignore
            wx.uma.setOpenid(this.openId);
        }
        if (window["TDAPP"]) {
            window["TDAPP"].register({
                profileId: this.openId,
                profileType: 1
            });
            window["TDAPP"].login({
                profileId: this.openId,
                profileType: 1
            });
        }
        let subIds = this.getSubIds();
        let self = this;
        for (let i = 0; i < subIds.length; i++) {
            const tmplId = subIds[i];
            this.requestGet(`${GxConstant_1.default.SubmsgBaseUrl}/${GxConstant_1.default.IS_QQ_GAME ? "qq" : "wx"}/checkSub?appId=${GxAdParams_1.AdParams.wx.appId}&openId=${this.openId}&tmplId=${tmplId}`, (res) => {
                self.logi(res.data);
                if (res.data.code == 1) {
                    if (res.data.data.subnum > 0) {
                        this.logi("已订阅：" + tmplId);
                    }
                    else {
                        this.logi("未订阅：" + tmplId);
                        this.waitSubIds.push(tmplId);
                    }
                }
                else {
                    self.logw("获取失败！" + res.data["msg"]);
                    this.waitSubIds.push(tmplId);
                }
            }, (res) => {
                self.logw("获取失败2！" + res["errMsg"]);
                self.logw(res);
                this.waitSubIds.push(tmplId);
            });
        }
    }
    submsg(tmplId, callback) {
        let self = this;
        this.requestGet(`${GxConstant_1.default.SubmsgBaseUrl}/${GxConstant_1.default.IS_QQ_GAME ? "qq" : "wx"}/subMsg?appId=${GxAdParams_1.AdParams.wx.appId}&openId=${this.openId}&tmplId=${tmplId}`, (res) => {
            self.logi(res.data);
            if (res.data.code == 1) {
                self.logi("订阅成功");
                callback && callback(true);
            }
            else {
                self.logw("订阅失败！" + res.data["msg"]);
                callback && callback(false);
            }
        }, (res) => {
            self.logw("订阅失败2！" + res["errMsg"]);
            self.logw(res);
            callback && callback(false);
        });
    }
    setOpenDataShareCallback(callback) {
        this._shareToFriendCallback = callback;
    }
    userFrom(callback) {
        try {
            //@ts-ignore
            /*  if (window["testDataToServer"] && testDataToServer.isAdUser) {
                  return callback && callback(true);
              }*/
            let clickId = DataStorage_1.default.getItem("__clickid__");
            if (!!clickId) {
                return callback && callback(true);
            }
            //@ts-ignore
            let launchOptionsSync = wx.getLaunchOptionsSync();
            /*     let demoT = {
                     "getLaunchOptionsSync": {
                         "scene": 1095,
                         "query": {
                             "weixinadinfo": "12864698926.wx0vravolutzjzle00.1038.1",
                             "wx_aid": "12864698926",
                             "weixinadkey": "df2e74a83185620edceb3d296dfaac0bf797daec0f614e9a399f14e398575dfb906f6487493f749fd32c0cbc8937f358",
                             "wx_traceid": "wx0vravolutzjzle00",
                             "gdt_vid": "wx0vravolutzjzle00"
                         },
                         "referrerInfo": {"appId": "wxf8c664173edb07c3", "extraData": {}}
                     }, "channel": "wx"
                 };*/
            let query = launchOptionsSync.query;
            clickId = query["gdt_vid"];
            if (!!clickId) {
                DataStorage_1.default.setItem("__clickid__", clickId);
                return callback && callback(true);
            }
            let queryElement = query["weixinadinfo"];
            if (queryElement) {
                // aid.traceid.scene_type.0
                let aid = queryElement.weixinadinfo.split(".")[0];
                if (!!aid) {
                    return callback && callback(true);
                }
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
    preShowVideo(callback) {
        if (this.shareValue == 1) {
            callback && callback(true);
        }
        else {
            callback && callback(false);
        }
    }
    initJump(app_key, app_version, initCallback) {
        WxJump_1.default.Instance.init(app_key, app_version, initCallback);
    }
    showPlayBtn(parentNode, width = 100, height = 100) {
        WxJump_1.default.Instance.showPlayBtn(parentNode, width, height);
    }
    showPlayGames(nodeArr, width = 100, height = 100) {
        WxJump_1.default.Instance.showPlayGames(nodeArr, width, height);
    }
    getOpenId(callback) {
        let item1 = DataStorage_1.default.getItem("__gx_openId__", "");
        let unionId = DataStorage_1.default.getItem("__gx_unionId__", "");
        if ((!!item1 && !!unionId) || this._getOpenIdSuccess) {
            this.openId = item1;
            this.unionId = unionId;
            this.logi("获取到缓存的openId:" + this.openId);
            this.logi("获取到缓存的unionId:" + this.unionId);
            callback && callback(this.openId, this.unionId);
            return;
        }
        try {
            let self = this;
            if (self.getOpenidTry >= 5) {
                self.getOpenidTry = 0;
                console.warn("获取openId重试最大次数了");
                return;
            }
            if (!!this.appId) {
                this.logi("获取到appid:" + this.appId);
                // @ts-ignore
                wx.login({
                    success(res) {
                        if (res.code) {
                            // 发起网络请求
                            self.logi("获取code成功：" + res.code);
                            self.requestGet(`${GxConstant_1.default.Code2SessionUrl}?appId=${self.appId}&code=${res.code}`, (res) => {
                                self.logi(res.data);
                                if (res.data.code == 1) {
                                    self.openId = res.data.data.openid;
                                    self.unionId = res.data.data.unionid;
                                    self.logi("获取openid成功：" + self.openId);
                                    DataStorage_1.default.setItem("__gx_openId__", self.openId);
                                    DataStorage_1.default.setItem("__gx_unionId__", self.unionId);
                                    callback && callback(self.openId, self.unionId);
                                    self._getOpenIdSuccess = true;
                                }
                                else {
                                    self.logw("登录失败！" + res.data["msg"]);
                                    setTimeout(() => {
                                        self.getOpenidTry++;
                                        self.getOpenId(callback);
                                    }, 3000);
                                }
                            }, (res) => {
                                self.logw("登录失败！" + res["errMsg"]);
                                self.logw(res);
                                setTimeout(() => {
                                    self.getOpenidTry++;
                                    self.getOpenId(callback);
                                }, 3000);
                            });
                        }
                        else {
                            self.logw("获取登录code失败！" + res.errMsg);
                            setTimeout(() => {
                                self.getOpenidTry++;
                                self.getOpenId(callback);
                            }, 3000);
                        }
                    },
                    fail(res) {
                        self.logw("wx login失败！" + res.errMsg);
                        setTimeout(() => {
                            self.getOpenidTry++;
                            self.getOpenId(callback);
                        }, 3000);
                    }
                });
            }
            else {
                self.logw("获取wx appid失败或者 GxAdParams中没有配置wx或者 qq的appid");
                setTimeout(() => {
                    self.getOpenidTry++;
                    self.getOpenId(callback);
                }, 3000);
            }
        }
        catch (e) {
            this.logw(e);
            this.logw("读取project.config.json失败");
            setTimeout(() => {
                this.getOpenidTry++;
                this.getOpenId(callback);
            }, 3000);
        }
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
                let encryptData = this.encrypt(GxAdParams_1.AdParams.wx.appId, openId, key, data);
                this.requestPost("https://api.sjzgxwl.com/commonData/data/saveData/v1", encryptData, (res) => {
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
                    appId: GxAdParams_1.AdParams.wx.appId,
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
    requestPost(url, data, successCallback, failCallback) {
        //@ts-ignore
        wx.request({
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
    initThinkData() {
        if (window["TDAnalytics"]) {
            let appId = "commonAppId";
            if (GxAdParams_1.AdParams.wx["fl_appId"]) {
                appId = GxAdParams_1.AdParams.wx["fl_appId"];
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
            let launchOptionsSync = window["wx"].getLaunchOptionsSync();
            let gameAppId = "";
            let gameAppVersion = "";
            if (window["wx"]["getAccountInfoSync"]) {
                let newVar = window["wx"]["getAccountInfoSync"]();
                if (newVar["miniProgram"]) {
                    gameAppId = newVar["miniProgram"]["appId"];
                    gameAppVersion = newVar["miniProgram"]["version"];
                }
            }
            // let sessionId = new Date().valueOf() + (Math.random() * 10000 + 100) + this.openId;
            var superProperties = {
                launchOptions: launchOptionsSync,
                gameAppId: gameAppId,
                gameAppVersion: gameAppVersion,
                unionId: this.unionId /*,
                "#session_id": sessionId*/
            };
            window["TDAnalytics"].setSuperProperties(superProperties);
            // window["TDAnalytics"].unSetSuperProperties(superProperties);
            // window["TDAnalytics"].track({
            //     eventName: "ta_login"  //上报登录事件
            // });
        }
    }
}
exports.default = WxAdapter;
