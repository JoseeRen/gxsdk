"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxAudioUtil_1 = __importDefault(require("../../audio/GxAudioUtil"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const OpenDataUtil_1 = __importDefault(require("../../util/OpenDataUtil"));
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
class QQAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.customBanner = null;
        this.customInter = null;
        this.blockAdTimer = null;
        this.interShowCount = 0; //插屏显示次数  插屏和box循环显示
        this.canshowovervideo = false;
        this.canshowovervideo2 = false;
        this.isShowingVideo = false;
        this.ismailiang = false; //是买量用户吗
        this.appId = "";
        this.openId = "";
        this._shareToFriendCallback = null;
        this.isShowBlock = false;
        this.blockShowCount = 0; //积木显示次数,两个积木参数循环调用
        this.shuXinTime = -1;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new QQAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        // this.initsceneid();
        try {
            OpenDataUtil_1.default.initChannel(GxConstant_1.default.IS_WECHAT_GAME ? "wx" : "qq");
        }
        catch (error) {
        }
        this.initOpenId();
        super.initAd();
        this.initBanner();
        // this.initNormalBanner();
        this.initVideo();
        // this.initQQBlockAd();
        // this.initQQAppBox();
        if (GxGame_1.default.gGB("w")) {
            var time = GxGame_1.default.gGN("t", 60);
            setTimeout(() => {
                this.canshowovervideo = true;
            }, time * 1000);
        }
        if (GxGame_1.default.gGB("c")) {
            var time = GxGame_1.default.gGN("ct", 60);
            setTimeout(() => {
                this.canshowovervideo2 = true;
                this.showVideo((res) => {
                }, "GxQQInitAd");
            }, time * 1000);
        }
    }
    initOpenId() {
        // @ts-ignore
        qq.onShareMessageToFriend((res) => {
            // https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareMessageToFriend.html
            this.logi("定向分享结果：" + res.success);
            if (res && res.success) {
                this.logi("定向分享成功");
            }
            else {
                this.logi("定向分享失败");
            }
            if (this._shareToFriendCallback) {
                console.log("可以回调");
            }
            else {
                console.log("不可以回调了");
            }
            this._shareToFriendCallback && this._shareToFriendCallback(res && res.success);
            // this._shareToFriendCallback = null;
        });
        // let item = cc.sys.localStorage.getItem("__gx_openId");
        let item1 = DataStorage_1.default.getItem("__gx_openId__", "");
        if (!!item1) {
            this.openId = item1;
            this.logi("获取到缓存的openId:" + this.openId);
            this.initSubmsg();
            return;
        }
        try {
            if (window["qq"]) {
                this.appId = GxAdParams_1.AdParams.qq.appId;
            }
            else {
                this.appId = GxAdParams_1.AdParams.wx.appId;
            }
            let self = this;
            if (!!this.appId) {
                this.logi("获取到appid:" + this.appId);
                // @ts-ignore
                qq.login({
                    success(res) {
                        if (res.code) {
                            // 发起网络请求
                            self.logi("获取code成功：" + res.code);
                            self.requestGet(`${GxConstant_1.default.Code2SessionUrl}?appId=${self.appId}&code=${res.code}`, (res) => {
                                self.logi(res.data);
                                if (res.data.code == 1) {
                                    self.openId = res.data.data.openid;
                                    self.logi("获取openid成功：" + self.openId);
                                    DataStorage_1.default.setItem("__gx_openId__", self.openId);
                                    self.initSubmsg();
                                }
                                else {
                                    self.logw("登录失败！" + res.data["msg"]);
                                }
                            }, (res) => {
                                self.logw("登录失败！" + res["errMsg"]);
                                self.logw(res);
                            });
                        }
                        else {
                            self.logw("获取登录code失败！" + res.errMsg);
                        }
                    },
                    fail(res) {
                        self.logw("qq login失败！" + res.errMsg);
                    }
                });
            }
            else {
                self.logw("获取wx appid失败或者 GxAdParams中没有配置wx或者 qq的appid");
            }
            /*这种可能有问题 不如直接写死保险  let fs = qq.getFileSystemManager();
              let readFileSync = fs.accessSync("project.config.json");
              let projectContent = fs.readFileSync("project.config.json", "utf8");

              let parse = JSON.parse(projectContent);
              this.appId = parse.qqappid;
              let self = this;
              if (!!this.appId) {

                  this.logi("获取到appid:" + this.appId)
                  qq.login({
                      success(res) {
                          if (res.code) {
                              // 发起网络请求
                              self.logi("登录成功：" + res.code)
                              qq.request({
                                  // url: `http://192.168.1.242:19210/openid/code2Session/v2?appId=${self.appId}&code=${res.code}`,
                                   url: `${GxConstant.Code2SessionUrl}?appId=${self.appId}&code=${res.code}`,

                                  success(res) {
                                      console.log(res.data)
                                      if (res.data.code == 1) {
                                          self.openId = res.data.data.openid;

                                          self.logi("获取openid成功：" + self.openId);

                                          DataStorage.setItem("__gx_openId__", self.openId)
                                      } else {
                                          self.loge('登录失败！' + res.data["msg"])

                                      }
                                  },
                                  fail(res) {
                                      self.loge('登录失败！' + res["errMsg"])
                                      self.loge(res)

                                  }
                              })
                          } else {
                              self.loge('获取登录code失败！' + res.errMsg)
                          }
                      },
                      fail(res) {
                          self.loge('qq login失败！' + res.errMsg)

                      }
                  })

              } else {
                  self.loge("获取qq appid失败")

              }*/
        }
        catch (e) {
            this.logw(e);
            this.logw("读取project.config.json失败");
        }
    }
    initsceneid() {
        // @ts-ignore
        let sceneID = qq.getLaunchOptionsSync().scene;
        if (GxAdParams_1.AdParams.qq.sceneidtest) {
            var AllsceneID = ["2054", "1011"]; //, "1001", "1037", "3001", "3002", "3003", "1023", "3026" 1011扫码测试 2054 广告投放
        }
        else {
            var AllsceneID = ["2054"]; //, "1001", "1037", "3001", "3002", "3003", "1023", "3026" 1011扫码测试 2054 广告投放
        }
        for (let i = 0; i <= AllsceneID.length - 1; i++) {
            if (sceneID == AllsceneID[i]) {
                console.log("是买量用户");
                this.ismailiang = true;
            }
            else {
                console.log("是普通用户");
                this.ismailiang = false;
            }
        }
    }
    showGameOverAD() {
        if (GxGame_1.default.gGB("w")) {
            if (this.canshowovervideo == true) {
                this.showVideo((res) => {
                }, "GxQQGameOverAD");
                this.canshowovervideo = false;
                var time = GxGame_1.default.gGN("t", 60);
                setTimeout(() => {
                    this.canshowovervideo = true;
                }, time * 1000);
            }
        }
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner(initShow = false) {
        if (GxAdParams_1.AdParams.qq.banner.length <= 0)
            return;
        this.destroyNormalBanner();
        /*
                let self = this;
                let systemInfoSync = qq.getSystemInfoSync();

                let screenWidth = systemInfoSync.screenWidth;
                let screenHeight = systemInfoSync.screenHeight;
                this.bannerAd= qq.createBannerAd({
                    adUnitId: AdParams.qq.banner,
                    style: {
                        top: screenHeight - 92,
                        left: (screenWidth - screenWidth * 0.92) / 2,
                        width: screenWidth * 0.92,
                    },
                    testDemoType: "65",
                });
                this.bannerAd.onError(function (res) {
                   console.log("banner sdk bannerAd错误日志" + res.errMsg + res.errCode)
                });

                this.bannerAd .onResize(function (res) {
                   console.log("banner onResize:" + res.width, res.height)
                  console.log("banner onResize:" + (screenWidth - screenWidth * 0.4) / 2)
                    if (     self.bannerAd .style.left < ((screenWidth - res.width) / 2)) {
                        self.bannerAd .style.left = ((screenWidth - res.width) / 2);
                    }
                    self.bannerAd .show();
                })

                return;*/
        let style = {
            width: 300
        };
        //@ts-ignore
        let systemInfoSync = qq.getSystemInfoSync();
        let screenHeight = systemInfoSync.screenHeight;
        let screenWidth = systemInfoSync.screenWidth;
        if (GxAdParams_1.AdParams.qq.bannerOnTop) {
            style["top"] = 0;
            if (screenWidth > screenHeight) {
                //横屏
                style["left"] = screenWidth / 4;
            }
            else {
                //竖屏
            }
        }
        else {
            style["top"] = screenHeight - 92;
            style["left"] = (screenWidth - screenWidth * 0.92) / 2;
            style["width"] = screenWidth * 0.92;
        }
        // @ts-ignore
        this.bannerAd = qq.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.qq.banner,
            style: style,
            adIntervals: Math.max(GxGame_1.default.adConfig.bannerUpdateTime, 30)
        });
        if (initShow) {
            this.bannerAd.onLoad(() => {
                this.bannerAd.show().then(() => {
                    this.logi("init end banner success");
                }).catch((e) => {
                    this.logi("init end banner error");
                });
            });
        }
        this.bannerAd.onError(err => {
            this.loge("normal banner error: ", JSON.stringify(err));
            this.loge("banner 参数：" + GxAdParams_1.AdParams.qq.banner);
            if (err && (err.errCode == 30002 || err.errCode == 1001)) {
                this.logi("销毁banner");
                this.destroyNormalBanner();
            }
        });
        let self = this;
        this.bannerAd.onResize(res => {
            console.log("banner onResize:" + res.width, res.height);
            console.log("banner onResize:" + (screenWidth - screenWidth * 0.4) / 2);
            if (self.bannerAd.style.left < ((screenWidth - res.width) / 2)) {
                self.bannerAd.style.left = ((screenWidth - res.width) / 2);
            }
            if (GxAdParams_1.AdParams.qq.bannerOnTop) {
            }
            else {
                self.bannerAd.style.top = screenHeight - res.height;
            }
            // self.bannerAd.show();
        });
        /*     if (AdParams.qq.bannerOnTop) {
                 style = {
                     top: 0
                 };


                 if (screenWidth > screenHeight) {

                     //横屏
                     style["left"] =(screenWidth - screenWidth * 0.6) / 2;
                     style["width"] = 300;

                 } else {
                     //竖屏
                 }

             } else {

                 style = {}
                 if (screenWidth > screenHeight) {

                     //横屏
                     style = {

                         //横屏
                         top: screenHeight - (screenWidth * 0.6 * (88 / 208)) + 120, //根据系统约定尺寸计算出广告高度 1440 - (700 / 16 * 9)
                         left: (screenWidth - screenWidth * 0.6) / 2,
                         width: 300
                     }
                 } else {
                     //竖屏
                     style = {
                         //竖屏
                         top: screenHeight - (screenWidth * 0.6 * (88 / 208)) + 20, //根据系统约定尺寸计算出广告高度 1440 - (700 / 16 * 9)
                         left: (screenWidth - screenWidth * 0.6) / 2,
                         width: screenWidth * 0.6

                     }
                 }


             }

             // @ts-ignore
             this.bannerAd = qq.createBannerAd({
                 adUnitId: AdParams.qq.banner,
                 style: style,
                 adIntervals: Math.max(GxGame.adConfig.bannerUpdateTime, 30)
             })

             let errCallback = err => {
                 this.loge('normal banner error: ', JSON.stringify(err));
                 this.loge("banner 参数：" + AdParams.qq.banner)
                 if (err && (err.errCode == 30002 || err.errCode == 1001)) {
                     this.logi("销毁banner")
                     this.destroyNormalBanner();
                 }
                 // this.bannerAd.offError(errCallback)

             };
             this.bannerAd.onError(errCallback);*/
    }
    /**
     * 展示普通banner
     */
    showNormalBanner() {
        /*
                let self = this;
                let systemInfoSync = qq.getSystemInfoSync();

                let screenWidth = systemInfoSync.screenWidth;
                let screenHeight = systemInfoSync.screenHeight;
                this.bannerAd= qq.createBannerAd({
                    adUnitId: AdParams.qq.banner,
                    style: {
                        top: screenHeight - 92,
                        left: (screenWidth - screenWidth * 0.92) / 2,
                        width: screenWidth * 0.92,
                    },
                    testDemoType: "65",
                });
                this.bannerAd.onError(function (res) {
                    console.log("banner sdk bannerAd错误日志" + res.errMsg + res.errCode)
                });

                this.bannerAd .onResize(function (res) {
                    console.log("banner onResize:" + res.width, res.height)
                    console.log("banner onResize:" + (screenWidth - screenWidth * 0.4) / 2)
                    if (     self.bannerAd .style.left < ((screenWidth - res.width) / 2)) {
                        self.bannerAd .style.left = ((screenWidth - res.width) / 2);
                    }
                    self.bannerAd .show();
                })

                return;*/
        this.initNormalBanner(true);
        return;
        if (this.bannerAd == null) {
            this.logi("banner  空");
            this.initNormalBanner(false);
            return;
        }
        else {
            this.logi("banner  不空");
        }
        if (this.bannerAd == null)
            return;
        this.bannerAd.show().then(() => {
            this.logi("normal banner show success");
            // if (this.bannerTimer) this.bannerTimer.stop();
        }).catch(e => {
            this.logi(e);
            this.logi("normal banner show error");
        });
    }
    /**
     * 隐藏普通banner
     */
    hideNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
        // this.destroyNormalBanner();
    }
    /**
     * 销毁普通banner
     */
    destroyNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }
    initBanner() {
        super.initBanner();
    }
    showBanner() {
        let label = GxGame_1.default.gGB("b");
        if (!label) {
            return;
        }
        this.hideBanner();
        this.bannerDelayTimer = GxTimer_1.default.once(() => {
            if (GxGame_1.default.adConfig.bannerUpdateTime > 0) {
                if (this.bannerTimer == null)
                    this.bannerTimer = new GxTimer_1.default();
                this.bannerTimer && this.bannerTimer.once(() => {
                    this.showBanner();
                }, GxGame_1.default.adConfig.bannerUpdateTime * 1000);
            }
            this.showNormalBanner();
        }, 10);
    }
    hideBanner() {
        super.hideBanner();
        this.hideNormalBanner();
        this.destroyCustomBanner();
    }
    initVideo() {
        if (GxAdParams_1.AdParams.qq.video == null || GxAdParams_1.AdParams.qq.video == "")
            return;
        this.destroyVideo();
        // @ts-ignore
        this.logi("激励参数：" + GxAdParams_1.AdParams.qq.video);
        // @ts-ignore
        this.videoAd = qq.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.qq.video
        });
        let self = this;
        this.videoAd.onLoad(function () {
            self.logi("激励视频加载成功");
        });
        this.videoAd.onError(function (err) {
            // Utils.emit(EVENT_TYPE.AD_ERROR, 0);
            self._videoErrorEvent();
        });
        this.videoAd.onClose(res => {
            GxAudioUtil_1.default.setMusicVolume(1);
            GxAudioUtil_1.default.setSoundVolume(1);
            if (res && res.isEnded) {
                self.logi("正常播放结束，可以下发游戏奖励");
                this.videocallback && this.videocallback(true);
                this._videoCompleteEvent();
            }
            else {
                this._videoCloseEvent();
                this.videocallback && this.videocallback(false);
            }
            this.isShowingVideo = false;
            if (this.canshowovervideo2) {
                this.canshowovervideo2 = false;
                if (GxGame_1.default.gGB("c")) {
                    var time = GxGame_1.default.gGN("ct", 60);
                    setTimeout(() => {
                        this.canshowovervideo2 = true;
                        this.showVideo((res) => {
                        }, "GxQQGameEnd");
                    }, time * 1000);
                }
            }
            this.videoAd.load();
        });
        this.videoAd.load();
    }
    showVideo(complete, flag = "") {
        if (this.isShowingVideo) {
            complete && complete(false);
            return;
        }
        super.showVideo(null, flag);
        if (this.videoAd == null) {
            this.initVideo();
        }
        if (this.videoAd == null) {
            complete && complete(true);
            this._videoErrorEvent();
            return;
        }
        this.videocallback = complete;
        this.videoAd.show().then(() => {
            GxAudioUtil_1.default.setMusicVolume(0);
            GxAudioUtil_1.default.setSoundVolume(0);
            this.isShowingVideo = true;
        }).catch(() => {
            this._videoErrorEvent();
            this.createToast("暂无视频，请稍后再试");
            // this.videoAd.load()
            this.initVideo();
        });
    }
    destroyVideo() {
        if (this.videoAd) {
            this.videoAd.offLoad();
            this.videoAd.offError();
            this.videoAd.offClose();
        }
        this.videoAd = null;
    }
    /**普通插屏 */
    showInterstitial(on_show, on_close) {
        if (GxAdParams_1.AdParams.qq.inter == null || GxAdParams_1.AdParams.qq.inter.length == 0) {
            return on_close && on_close();
        }
        this.destroyNormalInter();
        // this.hideBanner();
        // @ts-ignore
        this.interAd = qq.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.qq.inter
        });
        let self = this;
        let newVar = () => {
            self.logi("插屏广告加载");
            this.interAd.offLoad(newVar);
        };
        this.interAd.onLoad(newVar);
        this.interAd.load().then(res => {
            this.logi("普通插屏加载成功");
            // this.hideBanner();
            this.interShowTime = this.get_time();
            this.interAd.show().then(() => {
                let closeCallback = () => {
                    self.logi("关闭插屏");
                    self.interAd.offClose(closeCallback);
                    on_close && on_close();
                };
                this.interAd.onClose(closeCallback);
                on_show && on_show();
            }).catch((e) => {
                this.logi(e);
                this.logi("普通插屏展示失败");
                // if (GxGame.gGB("w")) {
                //   this.showQQAppBox(on_show, on_close)
                // } else {
                on_close && on_close();
                // }
            });
        }).catch(err => {
            this.interAd.offLoad(newVar);
            this.logi("普通插屏加载失败" + JSON.stringify(err));
            // if (GxGame.gGB("w")) {
            //   this.showQQAppBox(on_show, on_close)
            // } else {
            on_close && on_close();
            // }
        });
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.interAd.offLoad();
            this.interAd.offError();
        }
        this.interAd = null;
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        this.loge("showInterstitialNative 没用");
        on_hide && on_hide();
    }
    /**隐藏原生横幅 */
    hideInterstitialNative() {
        super.hideInterstitialNative();
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
            return on_hide && on_hide();
        setTimeout(() => {
            this.hideNativeInterstitial();
            // this.hideBanner();
            // if (GxGame.gGB("w")) {
            //     if (this.interShowCount % 2 == 0) {
            //         this.showInterstitial(on_show, on_hide)
            //     } else {
            //         this.showQQAppBox(on_show, on_hide)
            //     }
            //     this.interShowCount++;
            // } else {
            this.showInterstitial(on_show, on_hide);
            // }
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (GxGame_1.default.gGB("w")) {
            this.showNativeInterstitial(on_show, on_hide, delay_time);
        }
        else {
            this.logi("标签没到时间");
            on_hide && on_hide();
        }
    }
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
        this.destroyCustomInter();
    }
    /**
     * 原生ICON
     * @param parent
     */
    showNativeIcon(parent) {
        this.logi("showNativeIcon无");
    }
    /**隐藏原生ICON */
    hideNativeIcon() {
        super.hideNativeIcon();
    }
    /**
     * 盒子9宫格
     */
    initQQBlockAd(on_show, on_hide, show_toast = true, image = "", marginTop = 300) {
        if (!GxAdParams_1.AdParams.qq.block) {
            on_hide && on_hide();
            return;
        }
        if (this.blockAd) {
            this.blockAd.destroy();
        }
        const { screenHeight, screenWidth
        // @ts-ignore
         } = qq.getSystemInfoSync();
        let ad_id = GxAdParams_1.AdParams.qq.block;
        if (this.blockShowCount % 2 == 0) {
            ad_id = GxAdParams_1.AdParams.qq.block;
            if (!ad_id || ad_id.length == 0) {
                ad_id = GxAdParams_1.AdParams.qq.block2;
            }
        }
        else {
            ad_id = GxAdParams_1.AdParams.qq.block2;
            if (!ad_id || ad_id.length == 0) {
                ad_id = GxAdParams_1.AdParams.qq.block;
            }
        }
        this.logi("block :" + ad_id);
        this.blockShowCount++;
        // @ts-ignore
        this.blockAd = qq.createBlockAd({
            adUnitId: ad_id,
            size: 1,
            orientation: "landscape",
            style: {
                // top: marginTop
                top: screenHeight / 2,
                left: 10
            }
        });
        if (this.blockAdTimer == null) {
            this.blockAdTimer = new GxTimer_1.default();
        }
        this.blockAd.onLoad((res) => {
            this.blockAd.show();
            this.logi("QQ游戏积木广告获取成功");
            on_show && on_show();
        });
        this.blockAd.onError((err) => {
            this.logi("QQ游戏积木广告获取失败");
            this.loge(err);
            on_hide && on_hide();
        });
        this.blockAd.onResize(size => {
            // this.logi("改变size");
            // this.blockAd.style.left = ((screenWidth - size.width - 10));
        });
        this.isShowBlock = true;
        this.destorBlock();
        this.shuaXinBlock();
        // this.blockAd.onClose(() => {
        //     on_hide && on_hide();
        //     if (this.blockAd.isDestroyed) {
        //         return
        //     }
        //     // 当九宫格关闭之后，再次展示Icon
        //     this.blockAd.show()
        // })
    }
    shuaXinBlock() {
        this.shuXinTime = setTimeout(() => {
            this.initQQBlockAd();
        }, 5 * 1000);
    }
    destorBlock() {
        if (this.shuXinTime = null) {
            // clearTimeout(this.shuXinTime);
            clearInterval(this.shuXinTime);
        }
    }
    showQQBlockAd(on_show, on_hide, show_toast = false, image = "", marginTop = 300) {
        if (this.isShowBlock) {
            console.log("只能主动调用一次");
            return;
        }
        // @ts-ignore
        if (qq.createBlockAd && GxAdParams_1.AdParams.qq.block) {
            // if (this.blockAd == null) {
            this.initQQBlockAd(on_show, on_hide, show_toast, image, marginTop);
            // }
            /*         if (this.blockAd != null) {
                         // 广告数据加载成功后展示
                         this.blockAd.show().then(() => {
                             this.logi('blockAd button show success')

                             if (this.blockAdTimer) {
                                 this.blockAdTimer.clear();
                             }
                             this.blockAdTimer = null;
                         }).catch(err => {
                             this.logi("盒子九宫格广告加载失败", err)
                             on_hide && on_hide();
                             show_toast && this.createToast('努力加载中,请稍后再试~');
                         /!*    if (err && (err.code == 30002 || err.code == 40218)) {
                                 this.blockAdTimer.once(() => {
                                     this.destroyQQBlockAd();
                                     this.showQQBlockAd(on_show, on_hide, false, image, marginTop);
                                 }, 10000)
                             } else {
                                 on_hide && on_hide();
                                 show_toast && this.createToast('努力加载中,请稍后再试~');
                             }*!/
                         })
                     } else {
                         this.logi('blockAd is null')

                     }*/
        }
        else {
            on_hide && on_hide();
            this.logi("暂不支持互推盒子相关 API");
        }
    }
    hideQQBlockAd() {
        if (this.blockAd) {
            this.blockAd.hide();
        }
        if (this.blockAdTimer) {
            this.blockAdTimer.clear();
        }
        this.blockAdTimer = null;
    }
    destroyQQBlockAd() {
        if (!this.blockAd)
            return;
        if (this.blockAdTimer) {
            this.blockAdTimer.clear();
        }
        this.blockAdTimer = null;
        this.blockAd.destroy();
        this.blockAd = null;
    }
    initQQAppBox(on_show, on_hide, loadEndShow = false) {
        // if (!AdParams.qq.box) {
        //     on_hide && on_hide();
        //     return
        // }
        // this.destroyAppBox()
        //
        // // @ts-ignore
        // let appBox = qq.createAppBox({
        //     adUnitId: AdParams.qq.box
        //
        // })
        //
        // appBox.load().then(() => {
        //
        //     this.appBox = appBox;
        //     if (loadEndShow) {
        //         this.showQQAppBox(on_show, on_hide)
        //     }
        // }).catch(e => {
        //     this.appBox = null;
        //     this.logi(e)
        //     this.logi("appbox加载失败")
        //     on_hide && on_hide()
        // })
    }
    showQQAppBox(on_show, on_close) {
        // @ts-ignore
        if (qq.createAppBox && GxAdParams_1.AdParams.qq.box) {
            if (this.appBox == null) {
                // @ts-ignore
                this.appBox = qq.createAppBox({
                    adUnitId: GxAdParams_1.AdParams.qq.box
                });
            }
            this.appBox.load().then(() => {
                this.appBox.show().then(() => {
                    this.logi("appBox button show success");
                    let closeCallback = () => {
                        this.logi("appbox close");
                        this.appBox.offClose(closeCallback);
                        on_close && on_close();
                    };
                    this.appBox.onClose(closeCallback);
                }).catch(err => {
                    this.logi("appBox 广告显示失败", err);
                    on_close && on_close();
                });
            }).catch(e => {
                this.appBox = null;
                this.logi(e);
                this.logi("appbox加载失败");
                on_close && on_close();
            });
            // if (this.appBox == null) {
            //     this.initQQAppBox(on_show, on_close, true);
            // } else {
            //
            //     // 广告数据加载成功后展示
            //     this.appBox.show().then(() => {
            //         this.logi('appBox button show success')
            //
            //         let closeCallback = () => {
            //             this.logi("appbox close")
            //
            //             this.appBox.offClose(closeCallback)
            //             on_close && on_close();
            //             this.initQQAppBox();
            //         }
            //         this.appBox.onClose(closeCallback)
            //     }).catch(err => {
            //         this.logi("appBox 广告显示失败", err)
            //         on_close && on_close();
            //
            //     })
            // }
        }
        else {
            on_close && on_close();
            this.logi("暂不支持appBox相关 API");
        }
    }
    hideQQAppBox() {
        this.destroyAppBox();
    }
    showGamePortal() {
        this.showQQAppBox(() => {
        }, () => {
        });
    }
    destroyAppBox() {
        if (this.appBox != null) {
            this.appBox.offClose();
            this.appBox.destroy();
        }
        this.appBox = null;
    }
    /**
     * 展示添加桌面界面
     * @param on_succ
     */
    showAddDesktop(on_close, on_succ) {
        // @ts-ignore
        if (this.addIconNode && this.addIconNode !== undefined && cc.isValid(this.addIconNode.node, true))
            return;
        // @ts-ignore
        let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/add_icon", cc.Prefab));
        this.addIconNode = node.getComponent("Gx_add_icon");
        this.addIconNode && this.addIconNode.show(on_succ);
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        if (this.platformVersion() >= 1041) {
            // @ts-ignore
            qq.hasShortcutInstalled({
                success: status => {
                    if (status) {
                        has_add && has_add();
                    }
                    else {
                        can_add && can_add();
                    }
                },
                fail: () => {
                    on_fail && on_fail();
                }
            });
        }
        else {
            this.logi("不支持添加桌面");
            on_fail && on_fail();
        }
    }
    /**创建桌面图标 */
    addDesktop(on_succe, on_fail) {
        // @ts-ignore
        if (qq.saveAppToDesktop) {
            // @ts-ignore
            qq.saveAppToDesktop({
                success: () => {
                    /*   setTimeout(() => {
                           this.hasAddDesktop(() => {
                               on_fail && on_fail();
                           }, () => {
                               on_succe && on_succe();
                           })
                       }, 1000);*/
                    on_succe();
                },
                fail: () => {
                    on_fail && on_fail();
                }
            });
        }
        else {
            on_fail && on_fail();
        }
    }
    login(on_succ, on_fail) {
        if (this.platformVersion() >= 1040) {
            // @ts-ignore
            qq.login({
                success: res => {
                    on_succ && on_succ(res);
                },
                fail: (err) => {
                    on_fail && on_fail(err);
                }
            });
        }
    }
    destroyCustomBanner() {
        if (this.customBanner) {
            this.customBanner.destroy();
        }
        this.customBanner = null;
    }
    destroyCustomInter() {
        if (this.customInter) {
            this.customInter.destroy();
        }
        this.customInter = null;
    }
    logi(...data) {
        super.LOG("[QQAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[QQAdapter]", ...data);
    }
    logw(...data) {
        super.LOGW("[QQAdapter]", ...data);
    }
    /**
     * 定向分享给好友
     */
    shareMessageToFriend(callback) {
        console.log("qq设置回调");
        let boolean = OpenDataUtil_1.default.checkHasOpenData();
        if (boolean) {
            this._shareToFriendCallback = callback;
            if (callback) {
                console.log("设置了回调");
            }
            else {
                console.log("没有设置回调");
            }
            OpenDataUtil_1.default.shareMessageToFriend();
        }
        else {
            callback && callback(false);
        }
    }
    requestGet(url, successCallback, failCallback) {
        // @ts-ignore
        qq.request({
            url: url,
            success(res) {
                successCallback && successCallback(res);
            },
            fail(res) {
                failCallback && failCallback(res);
            }
        });
    }
    getSubIds() {
        if (GxAdParams_1.AdParams.qq["subIds"] && GxAdParams_1.AdParams.qq.subIds.length > 0) {
            return GxAdParams_1.AdParams.qq.subIds;
        }
        return [];
    }
    initSubmsg() {
        // @ts-ignore
        if (qq.uma) {
            // @ts-ignore
            qq.uma.setOpenid(this.openId);
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
            this.requestGet(`${GxConstant_1.default.SubmsgBaseUrl}/${GxConstant_1.default.IS_QQ_GAME ? "qq" : "wx"}/checkSub?appId=${GxAdParams_1.AdParams.qq.appId}&openId=${this.openId}&tmplId=${tmplId}`, (res) => {
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
        this.requestGet(`${GxConstant_1.default.SubmsgBaseUrl}/${GxConstant_1.default.IS_QQ_GAME ? "qq" : "wx"}/subMsg?appId=${GxAdParams_1.AdParams.qq.appId}&openId=${this.openId}&tmplId=${tmplId}`, (res) => {
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
            if (window["testDataToServer"] && testDataToServer.isAdUser) {
                return callback && callback(true);
            }
            let clickId = DataStorage_1.default.getItem("__clickid__");
            if (!!clickId) {
                return callback && callback(true);
            }
            //@ts-ignore
            let launchOptionsSync = qq.getLaunchOptionsSync();
            let scene = launchOptionsSync.scene;
            if (scene == 2054 || scene == "2054") {
                return callback && callback(true);
            }
            let query = launchOptionsSync.query;
            clickId = query["gdt_vid"];
            if (!!clickId) {
                DataStorage_1.default.setItem("__clickid__", clickId);
                return callback && callback(true);
            }
            //https://e.qq.com/ads/helpcenter/detail?cid=3166&pid=9017
            clickId = query["qz_gdt"];
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
}
exports.default = QQAdapter;
