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
// import GravityEngine from "../../sdk/gravityengine.mg.cocoscreator.min.js";
let GravityEngine = require("../../sdk/gravityengine.mg.cocoscreator.min");
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
        this.unionId = "";
        this.session_key = "";
        this._shareToFriendCallback = null;
        this.normalInterShowed = true;
        this._errCount = 0;
        /*
            initVideobc() {
                if (AdParams.wx.video == null || AdParams.wx.video.length <= 0) return;
    
                this.destroyVideo();
                //@ts-ignore
    
                this.videoAd = wx.createRewardedVideoAd({
                    adUnitId: AdParams.wx.video
                });
                // this.videoAd.load();  //创建时会自己加载  如果再load会走两次onload
    
                this.videoAd.onLoad((res) => {
                    console.log("激励视频加载", res);
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
    
                });
    
                this.videoAd.onError((err) => {
                    console.log("激励视频-失败", err);
                    //这可能会上报 两次
                    // this._videoErrorEvent();
                    this._videoErrorUploadEvent(err["errCode"] || "");
    
                });
    
                this.videoAd.onClose((res) => {
                    console.log("激励视频关闭");
                    this.recorderResume();
                    cc.director.resume();
                    this._videoShowing = false;
    
                    if (res && res.isEnded) {
                        console.log("激励视频完成");
                        this.videocallback && this.videocallback(true);
                        this._videoCompleteEvent();
                    } else {
                        this.videocallback && this.videocallback(false);
                        this._videoCloseEvent();
                    }
    
    
                    //试试提升一下曝光
                    // this.videoAd.load();
                    this.destroyVideo();
                });
            }*/
        this._videoShowing = false;
        this._videoTryCount = 0;
        this.shareValue = 0;
        this.rewardValue = 0;
        this.getOpenidTry = 0;
        this._getOpenIdSuccess = false;
        //没有结算页面的激励 https://sw8iftdom2w.feishu.cn/wiki/B3QKw5xPgiWL14k3NbJcXXwunne#share-FhmzduC52ocD9Jx2yXHcAjcAn9b
        this._noGameOverClickTimer = -1;
        this.loopInterCount = 0;
        /**
         * 显示竖版格子  默认是左侧垂直居中
         * @param left 是getNodeToScreenRect的x 如果传0是靠左 1水平居中 2是靠右  非0、1、2值则就是实际left值
         * @param top   是getNodeToScreenRect的y  如果传0是靠上 1是垂直居中  非0、1值则就是实际top值
         * @param scale  微信后台的缩放值
         * @param gridVNumber  每列几个
         * @param gridHNumber  每行几个
         */
        this._customAdV = {};
        /**
         * 显示横版格子  默认是上方水平居中
         * @param left 是getNodeToScreenRect的x 如果传1是水平居中
         * @param top   是getNodeToScreenRect的y  如果传0是靠上 1是垂直居中  2是底部居中
         * @param scale  微信后台的缩放值 80%就是0.8
         * @param gridVNumber  每列几个
         * @param gridHNumber  每行几个
         */
        this._customAdH = {};
        this._customAdBanner = {};
        /**
         * 显示单格子  默认是左侧垂直居中
         * @param left 是getNodeToScreenRect的x 如果传0是靠左 1水平 2是靠右  非0、1、2值则就是实际left值
         * @param top   是getNodeToScreenRect的y  如果传0是靠上 1是垂直居中  2是底部对齐 非0、1、2值则就是实际top值
         * @param scale  微信后台的缩放值
         */
        this._customAdSingle = {};
        this.miniGameCommon = null;
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
        if (window["qq"]) {
            this.appId = GxAdParams_1.AdParams.qq.appId;
        }
        else {
            this.appId = GxAdParams_1.AdParams.wx.appId;
        }
        this.refreshOpenId(() => {
        });
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
        this.initJump(GxAdParams_1.AdParams.wx.appId, GxAdParams_1.AdParams.wx.app_version, () => {
        });
        //@ts-ignore
        wx.onShow(res => {
            this.checkAddShare(res["query"]);
        });
        this.userFrom((a) => {
            this.userFromAd = a;
        });
        let item = parseInt(DataStorage_1.default.getItem("gx_startGameCount", 0));
        if (!item || Number.isNaN(item)) {
            item = 0;
        }
        item++;
        DataStorage_1.default.setItem("gx_startGameCount", item);
        this.getPlugin();
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
            this.initShareQuery(() => {
            });
            //@ts-ignore
            let launchOptionsSync = wx.getLaunchOptionsSync();
            this.checkAddShare(launchOptionsSync["query"]);
        });
        /*        return;

                // let item = cc.sys.localStorage.getItem("__gx_openId");
                let item1 = DataStorage.getItem("__gx_openId__", "");
                let unionId = DataStorage.getItem("__gx_unionId__", "");
                if (!!item1 && !!unionId) {
                    this.openId = item1;
                    this.unionId = unionId;
                    this.logi("获取到缓存的openId:" + this.openId);
                    this.logi("获取到缓存的unionId:" + this.unionId);
                    this.initSubmsg();
                    this.gxEngine.init({
                        openId: this.openId,
                        appToken: AdParams.wx.appId,
                        appId: AdParams.wx.appId,
                        unionId: this.unionId
                    }).then(e => {
                        console.log("gxEngine初始化成功");

                    }).catch(e => {
                        console.log("gxEngine初始化失败");
                    });


                    this.initGravityEngine();

                    return;
                }

                try {
                    let self = this;
                    if (!!this.appId) {
                        this.logi("获取到appid:" + this.appId);
                        // @ts-ignore

                        wx.login({
                            success(res) {
                                if (res.code) {
                                    // 发起网络请求
                                    self.logi("获取code成功：" + res.code);

                                    self.requestGet(
                                        `${GxConstant.Code2SessionUrl}?appId=${self.appId}&code=${res.code}`,
                                        (res) => {
                                            self.logi(res.data);
                                            if (res.data.code == 1) {
                                                self.openId = res.data.data.openid;
                                                self.unionId = res.data.data.unionid;

                                                self.logi("获取openid成功：" + self.openId);

                                                DataStorage.setItem("__gx_openId__", self.openId);
                                                DataStorage.setItem("__gx_unionId__", self.unionId);
                                                self.initSubmsg();
                                                self.gxEngine.init({
                                                    openId: self.openId,
                                                    appToken: AdParams.wx.appId,
                                                    appId: AdParams.wx.appId,
                                                    unionId: self.unionId
                                                }).then(e => {
                                                    console.log("gxEngine初始化成功");

                                                }).catch(e => {
                                                    console.log("gxEngine初始化失败");
                                                });

                                                self.initGravityEngine();

                                            } else {
                                                self.logw("登录失败！" + res.data["msg"]);
                                            }
                                        },
                                        (res) => {
                                            self.logw("登录失败！" + res["errMsg"]);
                                            self.logw(res);
                                        }
                                    );

                                } else {
                                    self.logw("获取登录code失败！" + res.errMsg);
                                }
                            },
                            fail(res) {
                                self.logw("wx login失败！" + res.errMsg);
                            }
                        });
                    } else {
                        self.logw("获取wx appid失败或者 GxAdParams中没有配置wx或者 qq的appid");
                    }
                } catch (e) {
                    this.logw(e);
                    this.logw("读取project.config.json失败");
                }*/
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
            const ge = new GravityEngine(config);
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
        if (this.bannerAd == null)
            return;
        if (window["ge"]) {
            try {
                //@ts-ignore
                ge.adShowEvent("banner", GxAdParams_1.AdParams.wx.banner, { custom_param: "" });
            }
            catch (e) {
            }
        }
        this.bannerAd
            .show()
            .then(() => {
            // if (window["ge"]) {
            //     //@ts-ignore
            //     ge.adShowEvent("banner", AdParams.wx.banner, {custom_param: ""});
            //
            // }
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
                    this._videoErrorUploadEvent(errCode + err["errMsg"] || "", errCode, err["errMsg"] || "");
                }
                catch (e) {
                }
            });
            this.videoAd.onClose((res) => {
                console.log("激励视频关闭");
                this.recorderResume();
                // cc.director.resume();
                this._videoShowing = false;
                if (res && res.isEnded) {
                    console.log("激励视频完成");
                    this.videocallback && this.videocallback(true, 1);
                    try {
                        this._videoCompleteEvent();
                    }
                    catch (e) {
                    }
                    this.uploadUserLabel(true);
                }
                else {
                    this.videocallback && this.videocallback(false, 0);
                    try {
                        this._videoCloseEvent();
                    }
                    catch (e) {
                    }
                    this.uploadUserLabel(false);
                }
                //试试提升一下曝光
                // this.videoAd.load();
                this.destroyVideo();
            });
            if (this.videoAd == null && this._videoShowing) {
                this._videoShowing = false;
                this.videocallback && this.videocallback(false, 0);
                try {
                    this._videoErrorEvent("ad null");
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
                    this._videoShowEvent();
                }
                catch (e) {
                }
                try {
                    GxGame_1.default.gameEvent("selfRewardShowSuccess", {});
                }
                catch (e) {
                }
                this.recorderPause();
                // cc.director.pause();
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
                                this._videoShowEvent();
                            }
                            catch (e) {
                            }
                            try {
                                GxGame_1.default.gameEvent("selfRewardShowSuccess", {});
                            }
                            catch (e) {
                            }
                            this.recorderPause();
                            // cc.director.pause();
                        });
                    })
                        .catch((e2) => {
                        // this._errCount = 0;
                        console.log("catch 2");
                        console.warn(e2);
                        try {
                            let errCode = err["err_code"] || err["errno"] || err["errCode"] || "";
                            this._videoErrorEvent(errCode + err["errMsg"] || "", errCode, err["errMsg"] || "");
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
                        this.videocallback && this.videocallback(false, 0);
                    });
                }
            });
        }
        else {
            console.log("video null");
            this._videoShowing = false;
            try {
                this._videoErrorEvent("isnull");
            }
            catch (e) {
            }
            try {
                //@ts-ignore
                wx.showToast({
                    title: "暂无广告，请稍后再试",
                    icon: "none"
                });
                this.videocallback && this.videocallback(false, 0);
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
            complete && complete(false, 0);
            if (this._videoTryCount >= 2) {
                this._videoShowing = false;
                this._videoTryCount = 0;
            }
            return;
        }
        this._videoShowing = true;
        this._videoTryCount = 0;
        this.addGiftValue(flag);
        super.showVideo(null, flag);
        try {
            this._videoCallEvent(flag);
        }
        catch (e) {
        }
        this.videocallback = complete;
        this.initVideo();
        if (this.videoAd == null) {
            //@ts-ignore
            wx.showToast({
                title: "暂无广告，请稍后再试",
                icon: "none"
            });
            complete(false, 0);
            this._videoShowing = false;
        }
    }
    /*
        showVideobc(complete?: (res: boolean) => void, flag = "") {
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
            if (this.videoAd == null) {
                this.initVideo();
            }
            if (this.videoAd == null) {
                this._videoShowing = false;
                complete && complete(false);
                this._videoErrorEvent("ad null");
                return;
            }
            this.videocallback = complete;
            if (window["ge"]) {
                try {
                    //@ts-ignore
                    ge.adShowEvent("reward", AdParams.wx.video, {custom_param: ""});
                } catch (e) {
                }
            }
            try {
                GxGame.gameEvent("selfReward", {});
            } catch (e) {

            }

            this.videoAd
                .show()
                .then(() => {
                    this._videoShowEvent();

                    try {
                        GxGame.gameEvent("selfRewardShowSuccess", {});
                    } catch (e) {

                    }
                    /!*    if (window["ge"]) {
                                            try{
                                                //@ts-ignore
                                                ge.adShowEvent("reward", AdParams.wx.video, {custom_param: ""});

                                            }catch(e){

                                            }
                                        }*!/
                    this.recorderPause();
                    cc.director.pause();
                })
                .catch((err) => {
                    console.warn(err);


                    this._videoErrorEvent(err["errCode"] || "");

                    //@ts-ignore
                    wx.showToast({
                        title: "暂无广告，请稍后再试",
                        icon: "none"
                    });
                    this._videoShowing = false;
                    this.videocallback && this.videocallback(false);
                    this.destroyVideo();
                    //2024年8月21日14:13:38  修改不重试了
                    return;

                    this.videoAd
                        .load()
                        .then((res) => {
                            return this.videoAd.show();
                        })
                        .then(() => {
                            this._videoShowEvent();

                            try {
                                GxGame.gameEvent("selfRewardShowSuccess", {});
                            } catch (e) {

                            }
                            /!*    if (window["ge"]) {
                                    try{
                                        //@ts-ignore
                                        ge.adShowEvent("reward", AdParams.wx.video, {custom_param: ""});

                                    }catch(e){

                                    }
                                }*!/
                            this.recorderPause();
                            cc.director.pause();
                        })
                        .catch((e2) => {
                            console.warn(e2);
                            this._videoErrorEvent(err["errCode"] || "");
                            // this.videoAd.load();
                            this.initVideo();
                            //@ts-ignore
                            wx.showToast({
                                title: "暂无广告，请稍后再试",
                                icon: "none"
                            });
                            this._videoShowing = false;
                            this.videocallback && this.videocallback(false);

                        });
                });
        }*/
    destroyVideo() {
        /*  try {
              if (this.videoAd) {
                  this.videoAd.offLoad();
                  this.videoAd.offError();
                  this.videoAd.offClose();
                  this.videoAd.destroy();
              }
          } catch (e) {

          }
          this.videoAd = null;*/
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
                    // cc.director.resume();
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
                // cc.director.pause();
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
            if (this.interCount % 2 == 1) {
                this.showInterstitial(on_show, on_hide);
            }
            else {
                this.showCustomInter(on_show, on_hide);
            }
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
        if ((!!item1 /*&& !!unionId*/) || this._getOpenIdSuccess) {
            this.openId = item1;
            this.unionId = unionId;
            this.logi("获取到缓存的openId:" + this.openId);
            this.logi("获取到缓存的unionId:" + this.unionId);
            callback && callback(this.openId, this.unionId);
            return;
        }
        this.refreshOpenId(callback);
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
                let data1 = res;
                try {
                    data1 = JSON.parse(res.data);
                }
                catch (e) {
                    console.log(e);
                    console.log("转换失败");
                    // successCallback && successCallback(res);
                }
                successCallback && successCallback({
                    statusCode: res.statusCode,
                    header: res.header,
                    data: data1
                });
                // console.log("转换成功");
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
            /*    window["TDAnalytics"].track({
                    eventName: "ta_login"  //上报登录事件

                });*/
        }
    }
    /**
     * 上报排行得分
     * @param key
     * @param score
     * @param successCallback
     * @param failedCallback
     */
    uploadRankScore(key, score, successCallback, failedCallback) {
        /*    successCallback && successCallback();

            let k = "guanqia";//运营后台配置的排行 字段
            let score=11;//上报的关卡数*/
        let gameScoreData = {
            wxgame: {
                score: score,
                update_time: new Date().getTime()
            } /*,
                    k: score*/
        };
        gameScoreData[key] = score;
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: key, value: JSON.stringify(gameScoreData) }
            ],
            success() {
                console.log("上传微信排行成功");
            },
            fail(err) {
                console.warn("上传微信排行 失败");
                console.warn(err);
            }
        });
    }
    initShareQuery(callback) {
        let item = DataStorage_1.default.getItem("flShareQuery", "");
        if (!!item) {
            callback && callback(item);
            return;
        }
        this.requestPost("https://api.sjzgxwl.com/game_api/common/share/getShareQuery", {
            appId: GxAdParams_1.AdParams.wx.appId,
            openId: this.openId
        }, (res) => {
            if (res["data"] && res["data"]["code"] == 1 && res["data"]["data"]) {
                let query = res.data.data.query;
                DataStorage_1.default.setItem("flShareQuery", query);
                callback && callback(query);
            }
            else {
                callback && callback("");
            }
        }, (err) => {
            callback && callback("");
        });
    }
    /**
     * 邀请好友分享
     * @param shareObj
     * @param shareType  比如可以传 tili   pifu  等等 不超过10个字符 分享的场景

     */
    inviteShare(shareObj, shareType) {
        try {
            // successCallback && successCallback();
            let tmpObj = {};
            this.initShareQuery((query) => {
                Object.assign(tmpObj, shareObj);
                if (!!query) {
                    let flShareKey = "&flShareKey=" + new Date().valueOf() + "";
                    if (!!tmpObj["query"]) {
                        tmpObj["query"] = tmpObj["query"] + "&" + query + "&flShareType=" + shareType + flShareKey;
                    }
                    else {
                        tmpObj["query"] = query + "&flShareType=" + shareType + flShareKey;
                    }
                }
                console.log(tmpObj["query"]);
                //@ts-ignore
                wx.shareAppMessage(tmpObj);
            });
        }
        catch (e) {
            console.warn(e);
        }
    }
    /**
     * 获取邀请到的好友数量
     * @param shareType
     * @param successCallback  第一个返回的是去重好友数量   第二个返回的是好友点击次数（可能会有单个好友点击多次）
     * @param failedCallback
     */
    getInviteNum(shareType, successCallback, failedCallback) {
        try {
            // successCallback && successCallback(0);
            this.requestPost("https://api.sjzgxwl.com/game_api/common/share/getSharedRecord", {
                appId: GxAdParams_1.AdParams.wx.appId,
                openId: this.openId,
                shareTypes: [shareType]
            }, (res) => {
                if (res["data"] && res["data"]["code"] == 1 && res["data"]["data"]) {
                    let list = res.data.data.list;
                    let inviteNum = 0;
                    let friendNum = 0;
                    for (let i = 0; i < list.length; i++) {
                        let listElement = list[i];
                        if (listElement["shareType"] == shareType) {
                            inviteNum = listElement.num;
                            friendNum = listElement.friendNum;
                            break;
                        }
                    }
                    successCallback && successCallback(friendNum, inviteNum);
                }
                else {
                    successCallback && successCallback(0);
                }
            }, (err) => {
                failedCallback && failedCallback(err);
            });
        }
        catch (e) {
            console.warn(e);
        }
    }
    checkAddShare(query) {
        try {
            if (!query) {
                return;
            }
            let flShareId = query["flShareId"];
            let flShareType = query["flShareType"];
            let flShareKey = query["flShareKey"];
            if (!!flShareId && !!flShareType) {
                this.requestPost("https://api.sjzgxwl.com/game_api/common/share/addShare", {
                    appId: GxAdParams_1.AdParams.wx.appId,
                    openId: this.openId,
                    shareType: flShareType,
                    flShareId: flShareId,
                    flShareKey: flShareKey
                }, (res) => {
                    console.log(res);
                    /*    if (res["data"] && res["data"]["code"] == 1 && res["data"]["data"]) {
                            let list = res.data.data.list;

                            let count = 0;
                            for (let i = 0; i < list.lenth; i++) {

                                let listElement = list[i];
                                if (listElement["shareType"] == shareType) {

                                    count = listElement.num;
                                    break;
                                }


                            }

                            successCallback && successCallback(count);

                        } else {
                            successCallback && successCallback(0);

                        }*/
                }, (err) => {
                    console.log(err);
                    // failedCallback && failedCallback(err);
                });
            }
        }
        catch (e) {
            console.warn(e);
        }
    }
    shareAppMessage(shareObj = {}) {
        //@ts-ignore
        wx.shareAppMessage(shareObj);
    }
    checkMsgText(content, scene = 1, callback) {
        this.requestPost("https://api.sjzgxwl.com/game_api/wx/msgcheck/text", {
            appId: GxAdParams_1.AdParams.wx.appId,
            openId: this.openId,
            scene: scene,
            content: content
        }, (res) => {
            console.log(res);
            if (res["data"] && res["data"]["code"] == 1 && res["data"]["data"]) {
                let pass = res.data.data.pass;
                if (pass) {
                    callback && callback(true);
                }
                else {
                    //@ts-ignore
                    wx.showToast({
                        title: "输入内容违规",
                        icon: "none"
                    });
                    callback && callback(false);
                }
            }
            else {
                callback && callback(false);
            }
        }, (err) => {
            console.log(err);
            callback && callback(false);
            // failedCallback && failedCallback(err);
        });
    }
    showPlayBtnWithUnlock(parentNode, inGamePlayCallback, width = 100, height = 100) {
        WxJump_1.default.Instance.showPlayBtnWithUnlock(parentNode, inGamePlayCallback, width, height);
    }
    showUnlockPlayGameList(groupName, inGamePlayCallback) {
        WxJump_1.default.Instance.showUnlockPlayGameList(groupName, inGamePlayCallback);
    }
    addVictory(lvName) {
        WxJump_1.default.Instance.addVictory(lvName);
    }
    showBackMainPlay(closeCallback) {
        WxJump_1.default.Instance.showBackMainPlay(closeCallback);
    }
    noGameOverClickStartGame() {
        if (this._noGameOverClickTimer != -1) {
            clearTimeout(this._noGameOverClickTimer);
            this._noGameOverClickTimer = -1;
        }
        if (!this.canUseAdScene()) {
            return;
        }
        if (GxGame_1.default.gGB("gevjili")) {
            this.showVideo((res) => {
                this._showNoGameOver();
            }, "noGameOverClickStartGame");
        }
    }
    _showNoGameOver() {
        if (this._noGameOverClickTimer != -1) {
            clearTimeout(this._noGameOverClickTimer);
            this._noGameOverClickTimer = -1;
        }
        let gGN = GxGame_1.default.gGN("gevjili", 30);
        let item = parseInt(DataStorage_1.default.getItem("gx_startGameCount", 0));
        if (!item || Number.isNaN(item)) {
            item = 0;
        }
        let timeout = gGN * 1000;
        if (item > 1) {
            timeout = gGN * 1000 * 2; //2025年6月23日10:39:09 修改冷启动后时间是两倍
        }
        this._noGameOverClickTimer = setTimeout(() => {
            this.showVideo((res) => {
                this._showNoGameOver();
            }, "noGameOverClickStartGame");
        }, timeout);
    }
    canUseAdScene() {
        //https://sw8iftdom2w.feishu.cn/wiki/B3QKw5xPgiWL14k3NbJcXXwunne#share-FWrxdjuEuotCRoxZMxbcWzqtnBd
        let gGB = GxGame_1.default.gGB("mailiang");
        if (gGB) {
            return true;
        }
        else {
            if (this.userFromAd) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    showWxLoopInter(on_show, on_hide) {
        if (this.canUseAdScene()) {
            this.loopInterCount++;
            if (this.loopInterCount % 2 == 1) {
                this.showInterstitial(on_show, on_hide);
            }
            else {
                this.showCustomInter(on_show, on_hide);
                this.showCustomInter(on_show, on_hide);
                this.showCustomInter(on_show, on_hide);
            }
        }
    }
    getNodeToScreenRect(ccNode) {
        // 获取节点在微信小游戏屏幕中的位置和尺寸  是左上角的位置
        // 获取节点在世界坐标系中的包围盒
        const boundingBox = ccNode.getBoundingBoxToWorld();
        // 获取系统信息
        const wx = window["wx"];
        const systemInfo = wx.getWindowInfo();
        let devicePixelRatio = systemInfo.pixelRatio; //cc.view.getDevicePixelRatio();
        let scale = cc.view.getScaleX();
        let factor = scale / devicePixelRatio;
        // 转换为微信屏幕坐标
        return {
            x: boundingBox.x * factor,
            y: systemInfo.windowHeight - (boundingBox.y + boundingBox.height) * factor,
            width: boundingBox.width * factor,
            height: boundingBox.height * factor
        };
    }
    showCustomV(customAdOptions) {
        // showCustomV({left = 0, top = 1, scale = 0.8, gridVNumber = 5, gridHNumber = 1}: CustomAdOptions) {
        let { left = 0, top = 1, scale = 0.8, gridVNumber = 5, gridHNumber = 1, adIntervals = 30 } = customAdOptions || {};
        if (!GxAdParams_1.AdParams.wx.custom_v || GxAdParams_1.AdParams.wx.custom_v.length == 0) {
            this.logw("没有配置竖版格子参数");
            return;
        }
        if (adIntervals < 30) {
            adIntervals = 30;
        }
        let defaultWidth = 72 * scale; //默认5个竖格子的宽高
        let defaultHeight = 410 * scale;
        let singleWidth = 72 * scale; //默认单个格子的宽高
        let singleHeight = 82 * scale;
        //@ts-ignore
        const windowInfo = wx.getWindowInfo();
        let str = `${left}-${top}`;
        if (this._customAdV[str]) {
            try {
                this._customAdV[str].destroy();
                this._customAdV[str] = null;
            }
            catch (e) {
            }
        }
        if (left == 1) {
            //水平居中
            left = (windowInfo.windowWidth - defaultWidth) / 2;
        }
        else if (left == 2) {
            //靠右
            left = windowInfo.windowWidth - defaultWidth;
        }
        if (top == 1) {
            //垂直居中
            top = (windowInfo.windowHeight - defaultHeight - ((5 - gridVNumber) * singleHeight)) / 2;
        }
        //@ts-ignore
        let customAd = wx.createCustomAd({
            adUnitId: GxAdParams_1.AdParams.wx.custom_v[0],
            adIntervals: adIntervals,
            style: {
                left: left,
                top: top
            }
        });
        if (customAd) {
            this._customAdV[str] = customAd;
            customAd.show().then(res => {
            }).catch(err => {
                this.logw(err);
            });
            customAd.onClose(() => {
                customAd.offClose();
                this._customAdV[str] = null;
            });
        }
        return customAd;
    }
    hideCustomV() {
        let strings = Object.keys(this._customAdV);
        for (let s = 0; s < strings.length; s++) {
            let str = strings[s];
            if (this._customAdV[str]) {
                try {
                    this._customAdV[str].destroy();
                    this._customAdV[str] = null;
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    }
    showCustomH(customAdOptions) {
        // showCustomV({left = 0, top = 1, scale = 0.8, gridVNumber = 5, gridHNumber = 1}: CustomAdOptions) {
        let { left = 1, top = 0, scale = 0.8, gridVNumber = 1, gridHNumber = 5, adIntervals = 30 } = customAdOptions || {};
        if (adIntervals < 30) {
            adIntervals = 30;
        }
        if (!GxAdParams_1.AdParams.wx.custom_h || GxAdParams_1.AdParams.wx.custom_h.length == 0) {
            this.logw("没有配置竖版格子参数");
            return;
        }
        let defaultWidth = 360 * scale; //默认5个竖格子的宽高
        let defaultHeight = 106 * scale;
        let singleWidth = 72 * scale; //默认单个格子的宽高
        let singleHeight = 82 * scale;
        //@ts-ignore
        const windowInfo = wx.getWindowInfo();
        let str = `${left}-${top}`;
        if (this._customAdH[str]) {
            try {
                this._customAdH[str].destroy();
                this._customAdH[str] = null;
            }
            catch (e) {
            }
        }
        if (left == 1) {
            //水平居中
            left = (windowInfo.windowWidth - defaultWidth - ((5 - gridHNumber) * singleWidth)) / 2;
        }
        if (top == 1) {
            //垂直居中
            top = (windowInfo.windowHeight - defaultHeight) / 2;
        }
        else if (top == 2) {
            //底部
            top = (windowInfo.windowHeight - defaultHeight);
        }
        //@ts-ignore
        let customAd = wx.createCustomAd({
            adIntervals: adIntervals,
            adUnitId: GxAdParams_1.AdParams.wx.custom_h[0],
            style: {
                left: left,
                top: top
            }
        });
        if (customAd) {
            this._customAdH[str] = customAd;
            customAd.show().then(res => {
            }).catch(err => {
                this.logw(err);
            });
            customAd.onClose(() => {
                customAd.offClose();
                this._customAdH[str] = null;
            });
        }
        return customAd;
    }
    hideCustomH() {
        let strings = Object.keys(this._customAdH);
        for (let s = 0; s < strings.length; s++) {
            let str = strings[s];
            if (this._customAdH[str]) {
                try {
                    this._customAdH[str].destroy();
                    this._customAdH[str] = null;
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    }
    /**
     * 显示横幅banner
     * @param customAdOptions left 是getNodeToScreenRect的x 如果传1是水平居中
     *  top   是getNodeToScreenRect的y  如果传0是靠上 1是垂直居中  2是底部居中

     */
    showCustomBanner(customAdOptions) {
        let { left = 1, top = 0, width = 300, adIntervals = 30 } = customAdOptions || {};
        if (adIntervals < 30) {
            adIntervals = 30;
        }
        if (width < 30) {
            width = 300;
        }
        if (!GxAdParams_1.AdParams.wx.banner || GxAdParams_1.AdParams.wx.banner.length == 0) {
            this.logw("没有配置banner参数");
            return;
        }
        //宽高  比3:1
        let defaultWidth = width;
        let defaultHeight = width / 3;
        //@ts-ignore
        const windowInfo = wx.getWindowInfo();
        let str = `${left}-${top}`;
        if (this._customAdBanner[str]) {
            try {
                this._customAdBanner[str].destroy();
                this._customAdBanner[str] = null;
            }
            catch (e) {
            }
        }
        if (left == 1) {
            //水平居中
            left = (windowInfo.windowWidth - defaultWidth) / 2;
        }
        if (top == 1) {
            //垂直居中
            top = (windowInfo.windowHeight - defaultHeight) / 2;
        }
        else if (top == 2) {
            //底部
            top = (windowInfo.windowHeight - defaultHeight);
        }
        //@ts-ignore
        let customAd = wx.createCustomAd({
            adIntervals: adIntervals,
            adUnitId: GxAdParams_1.AdParams.wx.banner,
            style: {
                left: left,
                top: top,
                width: defaultWidth
            }
        });
        if (customAd) {
            this._customAdBanner[str] = customAd;
            customAd.show().then(res => {
            }).catch(err => {
                this.logw(err);
            });
            customAd.onClose(() => {
                customAd.offClose();
                this._customAdBanner[str] = null;
            });
        }
        return customAd;
    }
    hideCustomBanner() {
        let strings = Object.keys(this._customAdBanner);
        for (let s = 0; s < strings.length; s++) {
            let str = strings[s];
            if (this._customAdBanner[str]) {
                try {
                    this._customAdBanner[str].destroy();
                    this._customAdBanner[str] = null;
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    }
    showCustomSingle(customAdOptions) {
        let { left = 0, top = 1, scale = 0.8, gridVNumber = 1, gridHNumber = 1, adIntervals = 30 } = customAdOptions || {};
        if (!GxAdParams_1.AdParams.wx.custom_left || GxAdParams_1.AdParams.wx.custom_left.length == 0) {
            this.logw("没有配置竖版格子参数");
            return;
        }
        if (adIntervals < 30) {
            adIntervals = 30;
        }
        // 常规样式默认画布为 60×104 像素
        //卡片样式默认画布为 68×106 像素
        let defaultWidth = 68 * scale; //默认5个竖格子的宽高
        let defaultHeight = 106 * scale;
        //@ts-ignore
        const windowInfo = wx.getWindowInfo();
        let str = `${left}-${top}`;
        if (this._customAdSingle[str]) {
            try {
                this._customAdSingle[str].destroy();
                this._customAdSingle[str] = null;
            }
            catch (e) {
            }
        }
        if (left == 1) {
            //水平居中
            left = (windowInfo.windowWidth - defaultWidth) / 2;
        }
        else if (left == 2) {
            //靠右
            left = windowInfo.windowWidth - defaultWidth;
        }
        if (top == 1) {
            //垂直居中
            top = (windowInfo.windowHeight - defaultHeight) / 2;
        }
        else if (top == 2) {
            //垂直居中
            top = windowInfo.windowHeight - defaultHeight;
        }
        //@ts-ignore
        let customAd = wx.createCustomAd({
            adUnitId: GxAdParams_1.AdParams.wx.custom_left,
            adIntervals: adIntervals,
            style: {
                left: left,
                top: top
            }
        });
        if (customAd) {
            this._customAdSingle[str] = customAd;
            customAd.show().then(res => {
            }).catch(err => {
                this.logw(err);
            });
            customAd.onClose(() => {
                customAd.offClose();
                this._customAdSingle[str] = null;
            });
        }
        return customAd;
    }
    hideCustomSingle() {
        let strings = Object.keys(this._customAdSingle);
        for (let s = 0; s < strings.length; s++) {
            let str = strings[s];
            if (this._customAdSingle[str]) {
                try {
                    this._customAdSingle[str].destroy();
                    this._customAdSingle[str] = null;
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    }
    refreshOpenId(callback) {
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
                                    self.session_key = res.data.data.encrypted_session_key;
                                    self.logi("获取openid成功：" + self.openId);
                                    self.logi("获取session_key成功：" + self.session_key);
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
                self.logw("没有配置appId");
                setTimeout(() => {
                    self.getOpenidTry++;
                    self.getOpenId(callback);
                }, 3000);
            }
        }
        catch (e) {
            this.logw(e);
            this.logw("获取opid异常");
            setTimeout(() => {
                this.getOpenidTry++;
                this.getOpenId(callback);
            }, 3000);
        }
    }
    getPlugin() {
        try {
            //@ts-ignore
            if (typeof requirePlugin !== "undefined") {
                //@ts-ignore
                const createMiniGameCommon = requirePlugin("MiniGameCommon", {
                    enableRequireHostModule: true,
                    customEnv: {
                        //@ts-ignore
                        wx
                    }
                }).default;
                this.miniGameCommon = createMiniGameCommon();
                if (typeof this.miniGameCommon === "undefined" || typeof this.miniGameCommon.canIUse === "undefined") {
                    // 插件初始化失败
                    console.error("miniGameCommon create error");
                }
                else {
                    // 插件初始化成功
                    //@ts-ignore
                    GameGlobal.miniGameCommon = this.miniGameCommon;
                    console.warn("miniGameCommon create success");
                }
            }
        }
        catch (e) {
            // 基础库版本过低
            console.error("miniGameCommon create error 基础库版本过低");
            console.error(e);
        }
    }
    uploadUserLabel(videoIsEnded) {
        if (this.miniGameCommon) {
            let formatFlag = this.formatFlag(this.curVideoFlag);
            let flag = formatFlag.flag;
            let gift_scene = formatFlag.gift_scene;
            let gift_name = formatFlag.gift_name;
            let event_name = "";
            if (videoIsEnded) {
                event_name = "reward_complete_delay";
                this.addGiftValueSuccess(this.curVideoFlag);
            }
            else {
                event_name = "reward_close_delay";
            }
            let giftValue = this.getGiftValue(this.curVideoFlag);
            setTimeout(() => {
                //30秒后延迟获取
                //获取后再上报
                let value = {
                    gift_scene: gift_scene,
                    gift_name: gift_name,
                    gift_value: giftValue.gift_value,
                    gift_value_success: giftValue.gift_value_success
                };
                let reportData = JSON.stringify(value);
                console.log(reportData);
                this.miniGameCommon.getUserLabel({
                    reportData: reportData,
                    labelId: "iaa_feature" //固定的
                }).then(res => {
                    console.log("getUserLabel success", res);
                    let encryptedData = res.encryptedData;
                    let iv = res.iv;
                    if (!!encryptedData && !!iv) {
                        //解密
                        if (!!this.session_key) {
                            this.requestPost("https://api.sjzgxwl.com/game_api/wx/user/open_data_decode", {
                                appId: GxAdParams_1.AdParams.wx.appId,
                                encryptedData: encryptedData,
                                iv: iv,
                                encrypted_session_key: this.session_key
                            }, (data) => {
                                if (data.data && data.data.code == 1) {
                                    let data1 = data.data.data;
                                    GxGame_1.default.gameEvent(event_name, {
                                        ad_ecpm_level: data1.value,
                                        today_play_duration: data1.today_play_duration,
                                        weekly_login_cnt: data1.weekly_login_cnt,
                                        continuous_login_days: data1.continuous_login_days
                                    });
                                }
                                else {
                                    console.warn(data);
                                }
                            }, (er) => {
                                console.warn(er);
                                console.warn("解密失败");
                            });
                        }
                        else {
                            console.warn("没有session_key无法解密");
                        }
                    }
                    else {
                        console.warn("没有获取到数据");
                    }
                }).catch(e => {
                    console.warn("getUserLabel error");
                    console.error(e);
                });
            }, 30 * 1000);
        }
        else {
            console.error("没有小游戏插件");
        }
    }
    addGiftValue(flag) {
        try {
            let formatFlag = this.formatFlag(flag);
            let date = new Date();
            let fullYear = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            let giftValue = this.getGiftValue(flag);
            giftValue.gift_value++;
            let key = `label.${fullYear}${month}${day}.${formatFlag.gift_scene}.${formatFlag.gift_name}`;
            DataStorage_1.default.setItem(key, JSON.stringify(giftValue));
        }
        catch (e) {
            console.warn(e);
        }
    }
    addGiftValueSuccess(flag) {
        try {
            let formatFlag = this.formatFlag(flag);
            let date = new Date();
            let fullYear = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            let giftValue = this.getGiftValue(flag);
            giftValue.gift_value_success++;
            let key = `label.${fullYear}${month}${day}.${formatFlag.gift_scene}.${formatFlag.gift_name}`;
            DataStorage_1.default.setItem(key, JSON.stringify(giftValue));
        }
        catch (e) {
            console.warn(e);
        }
    }
    getGiftValue(flag) {
        try {
            let formatFlag = this.formatFlag(flag);
            let date = new Date();
            let fullYear = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            let key = `label.${fullYear}${month}${day}.${formatFlag.gift_scene}.${formatFlag.gift_name}`;
            let item = DataStorage_1.default.getItem(key, null);
            if (!!item) {
                let parse = JSON.parse(item);
                return parse;
            }
            else {
            }
        }
        catch (e) {
            console.warn(e);
        }
        return {
            gift_value: 0,
            gift_value_success: 0
        };
    }
    formatFlag(curVideoFlag) {
        let flag = curVideoFlag;
        let gift_scene = "";
        let gift_name = flag;
        if (typeof curVideoFlag === "string") {
        }
        else {
            flag = curVideoFlag.flag;
            //如果 scene是空的就保持空的
            if (!!curVideoFlag.gift_scene) {
                gift_scene = curVideoFlag.gift_scene;
            }
            //如果gift_name是空的就默认用flag
            if (!!curVideoFlag.gift_name) {
                gift_name = curVideoFlag.gift_name;
            }
            else {
                gift_name = flag;
            }
        }
        return {
            flag, gift_scene, gift_name
        };
    }
}
exports.default = WxAdapter;
/* 添加微信插件
   "plugins": {
      "MiniGameCommon": {
        "version": "latest",
        "provider": "wxaed5ace05d92b218",
        "contexts": [
          {
            "type": "isolatedContext"
          }
        ]
      }
    }
*
* */
