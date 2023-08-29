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
const GxEnum_1 = require("../../core/GxEnum");
const GxAdParams_1 = require("../../GxAdParams");
const gx_ui_inner_interstitial_1 = __importDefault(require("../native/gx_ui_inner_interstitial"));
const gx_ui_interstitial_1 = __importDefault(require("../native/gx_ui_interstitial"));
const gx_ui_native_icon_1 = require("../native/gx_ui_native_icon");
const gx_ui_add_icon_1 = __importDefault(require("../../ui/gx_ui_add_icon"));
const gx_ui_banner_1 = __importDefault(require("../native/gx_ui_banner"));
class HwAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.customBanner = null;
        this.customInter = null;
        this.portalAdTimer = null;
        this.videoShowing = false;
        this.canShowBanner = true;
        this.firstShowInter = true;
        this.interCount = 0;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new HwAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        super.initAd();
        GxGame_1.default.adConfig.useNative = true;
        /*    cc.game.on(cc.game.EVENT_HIDE, function () {
                console.log("游戏进入后台");
                cc.director.emit("清除原生")
            }, this);
            cc.game.on(cc.game.EVENT_SHOW, function () {
                console.log("重新返回游戏");
                cc.director.emit("清除原生")
            }, this);*/
        let canPreLoadAd = false;
        if (canPreLoadAd) {
            //华为不能预加载广告
            this.initBanner();
            this.initNormalBanner();
            this.initVideo();
            this.initNativeAd();
            this.initGamePortal();
        }
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
        console.log("banner1");
        if (GxAdParams_1.AdParams.hw.banner.length <= 0)
            return;
        //@ts-ignore
        let systemInfoSync = qg.getSystemInfoSync();
        let screenWidth = systemInfoSync.screenWidth;
        let screenHeight = systemInfoSync.screenHeight;
        console.log("banner2");
        this.destroyNormalBanner();
        console.log("banner3");
        //@ts-ignore
        this.bannerAd = qg.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.hw.banner,
            adIntervals: 60,
            style: {
                top: screenHeight - 57,
                left: 0,
                height: 57,
                width: 360
            } /*,
            adIntervals: Math.max(GxGame.adConfig.bannerUpdateTime, 30)
        */
        });
        console.log("banner4");
        this.bannerAd.onError(err => {
            console.error('[gx_game]normal banner error: ', JSON.stringify(err));
            // if (err && err.errCode == 30002) {
            this.destroyNormalBanner();
            //}
        });
    }
    /**
     * 展示普通banner
     */
    showNormalBanner() {
        this.logi("normal banner");
        if (this.bannerAd == null) {
            this.initNormalBanner();
        }
        if (this.bannerAd == null) {
            this.logi("banner null 显示失败");
            return;
        }
        this.logi("banner show");
        this.bannerAd.show().then(() => {
            this.logi(" normal banner show success");
            // if (this.bannerTimer) this.bannerTimer.stop();
        }).catch(e => {
            this.logi(" normal banner show error", e);
        });
    }
    /**
     * 隐藏普通banner
     */
    hideNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
            this.bannerAd.destroy();
        }
        this.bannerAd = null;
    }
    /**
     * 销毁普通banner
     */
    destroyNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
        }
    }
    initBanner() {
        super.initBanner();
    }
    showBanner() {
        if (!this.canShowBanner) {
            this.logi("banner can't show");
            return;
        }
        this.canShowBanner = false;
        //banner30秒调用 一次
        setTimeout(() => {
            this.canShowBanner = true;
        }, 30 * 1000);
        this.hideBanner();
        this.bannerDelayTimer = GxTimer_1.default.once(() => {
            this.logi("banner show");
            let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.banner);
            if (GxGame_1.default.adConfig.bannerUpdateTime > 0) {
                this.logi("banner refresh");
                if (this.bannerTimer == null)
                    this.bannerTimer = new GxTimer_1.default();
                this.bannerTimer && this.bannerTimer.once(() => {
                    this.showBanner();
                }, GxGame_1.default.adConfig.bannerUpdateTime * 1000);
            }
            if (native_data == null || native_data === undefined) {
                this.showNormalBanner();
                // this.showCustomBanner();
            }
            else {
                /*     let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_banner', cc.Prefab));
                     this.bannerNode = node.getComponent('gx_native_banner');*/
                this.bannerNode = new gx_ui_banner_1.default();
                this.bannerNode.show(native_data, () => {
                }, () => {
                    this.bannerTimer && this.bannerTimer.clear();
                });
            }
        }, 1000);
    }
    hideBanner() {
        this.logi("hide banner");
        super.hideBanner();
        this.hideNormalBanner();
        this.destroyCustomBanner();
    }
    initVideo() {
        if (GxAdParams_1.AdParams.hw.video == null || GxAdParams_1.AdParams.hw.video.length <= 0)
            return;
        this.destroyVideo();
        //@ts-ignore
        this.videoAd = qg.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.hw.video
        });
        this.videoAd.onLoad(() => {
            console.log("激励视频加载成功");
            this.videoAd.show().then(() => {
                GxAudioUtil_1.default.setMusicVolume(0);
                GxAudioUtil_1.default.setSoundVolume(0);
            }).catch(() => {
                this.createToast('暂无视频，请稍后再试');
                // this.videoAd.load()
                this.videoShowing = false;
                this.videocallback && this.videocallback(false);
            });
        });
        this.videoAd.onError((err) => {
            // Utils.emit(EVENT_TYPE.AD_ERROR, 0);
            this.destroyVideo();
            this.videoShowing = false;
            this.videocallback && this.videocallback(false);
        });
        this.videoAd.onClose(res => {
            GxAudioUtil_1.default.setMusicVolume(1);
            GxAudioUtil_1.default.setSoundVolume(1);
            if (res && res.isEnded) {
                console.log("正常播放结束，可以下发游戏奖励");
                this.videocallback && this.videocallback(true);
            }
            else {
                this.videocallback && this.videocallback(false);
            }
            // this.videoAd.load()
            this.videoShowing = false;
            this.destroyVideo();
        });
        this.videoAd.load();
    }
    showVideo(complete, flag = "") {
        if (this.videoShowing) {
            this.logi("video showing");
            return;
        }
        this.videoShowing = true;
        setTimeout(() => {
            this.videoShowing = false;
        }, 500);
        this.videocallback = complete;
        // if (this.videoAd == null) {
        this.initVideo();
        // }
        /*  if (this.videoAd == null) {
              complete && complete(true);
              return;
          }


          this.videoAd.show().then(() => {
              AudioUtil.setMusicVolume(0);
              AudioUtil.setSoundVolume(0);
          }).catch(() => {
              this.createToast('暂无视频，请稍后再试');
              this.videoAd.load()
          })*/
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
        if (GxAdParams_1.AdParams.hw.inter == null || GxAdParams_1.AdParams.hw.inter.length <= 0)
            return on_close && on_close();
        this.destroyNormalInter();
        this.logi("showInterstitial");
        //@ts-ignore
        this.interAd = qg.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.hw.inter
        });
        this.interAd.onLoad(() => {
            this.logi("插屏广告加载");
            this.hideBanner();
            this.interShowTime = this.get_time();
            this.interAd.show();
            on_show && on_show();
        });
        this.interAd.onError(() => {
            this.logi("插屏广告加载失败");
            on_close && on_close();
        });
        this.interAd.onClose(() => {
            on_close && on_close();
        });
        this.interAd.load().then(res => {
            this.logi("showInterstitial show");
        }).catch(err => {
            console.log('普通插屏展示失败' + JSON.stringify(err));
            on_close && on_close();
        });
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.interAd.offLoad();
            this.interAd.offError();
        }
        this.interAd = null;
    }
    create_ad(ad_type) {
        return new Promise((resolve, reject) => {
            let posId = "";
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                posId = GxAdParams_1.AdParams.hw.native_banner;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.hw.native1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.hw.native2;
            }
            this.logi(ad_type, 'posId = ', posId);
            if (posId == '' || posId === undefined || posId == null || this.is_limit_native_length(ad_type)) {
                this.logi('native null');
                return resolve(null);
            }
            //@ts-ignore
            let nativeAd = qg.createNativeAd({
                adUnitId: posId
            });
            let on_load = (res) => {
                console.log("[gx_game]native data load:");
                if (res && res.adList) {
                    let data = res.adList.pop();
                    data.ad = nativeAd;
                    data.type = ad_type;
                    this.add_native_data(data);
                    console.log("[gx_game]native data load succ:" + JSON.stringify(data));
                    nativeAd.offLoad(on_load);
                }
            };
            nativeAd.onLoad(on_load);
            let on_error = (err) => {
                console.log("[gx_game]native data error: " + JSON.stringify(err), "color: red");
                nativeAd.offError(on_error);
            };
            nativeAd.onError(on_error);
            nativeAd.load();
            setTimeout(resolve, 1500);
        });
    }
    /**原生广告 */
    initNativeAd() {
        // 拉取间隔1s
        this.create_ad(GxEnum_1.ad_native_type.banner).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.native_icon);
        }).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.inter1);
        }).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.inter2);
        }).then(() => {
            this.loop_get_native_data();
        });
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        this.hideInterstitialNative();
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
        if (native_data == null || native_data === undefined) {
            on_hide && on_hide();
        }
        else {
            this.innerInter = new gx_ui_inner_interstitial_1.default();
            this.innerInter && this.innerInter.show(parent, native_data, on_click, () => {
                this.hideBanner();
                on_show && on_show();
            }, on_hide);
        }
        this.hideInterstitialNative();
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
    showNativeInterstitial(on_show, on_hide, delay_time = 1) {
        // if (this.get_time() - this.interShowTime <= GxGame.adConfig.interTick * 1000) return on_hide && on_hide();
        if (this.firstShowInter) {
            //不能预加载
            // this.initNativeAd()
        }
        this.firstShowInter = false;
        setTimeout(() => {
            this.logi("showNativeInterstitial:" + this.interCount);
            this.hideNativeInterstitial();
            if (this.interCount % 2 == 0) {
                this.interCount++;
                this.showInterstitial(on_show, on_hide);
            }
            else {
                this.interCount++;
                //@ts-ignore
                let nativeAd = qg.createNativeAd({
                    adUnitId: GxAdParams_1.AdParams.hw.native1
                });
                let on_load = (res) => {
                    console.log("[gx_game]native data load:");
                    if (res && res.adList) {
                        let data = res.adList.pop();
                        data.ad = nativeAd;
                        data.type = GxEnum_1.ad_native_type.inter1;
                        this.add_native_data(data);
                        console.log("[gx_game]native data load succ:" + JSON.stringify(data));
                        nativeAd.offLoad(on_load);
                        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
                        if (native_data == null || native_data === undefined) {
                            this.logi("native data null showInter");
                            this.showInterstitial(on_show, on_hide);
                            // this.showCustomInter(on_show, on_hide);
                        }
                        else {
                            // if (Utils.randomInt(1, 100) > GxGame.adConfig.showInterRto) return on_hide && on_hide();
                            /*             let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_interstitial', cc.Prefab));
                                         this.nativeInter = node.getComponent('gx_native_interstitial');
             */
                            this.nativeInter = new gx_ui_interstitial_1.default();
                            this.nativeInter && this.nativeInter.show(native_data, () => {
                                this.interShowTime = this.get_time();
                                this.logi("showNativeInterstitial show");
                                this.hideBanner();
                                on_show && on_show();
                            }, on_hide);
                        }
                    }
                    else {
                        this.logi("native data null showInter");
                        this.showInterstitial(on_show, on_hide);
                    }
                };
                nativeAd.onLoad(on_load);
                let on_error = (err) => {
                    console.log("[gx_game]native data error: " + JSON.stringify(err), "color: red");
                    nativeAd.offError(on_error);
                    this.showInterstitial(on_show, on_hide);
                };
                nativeAd.onError(on_error);
                nativeAd.load();
                /*  let native_data = this.getLocalNativeData(ad_native_type.inter1);

                  if (native_data == null || native_data === undefined) {
                      this.logi("native data null showInter")
                      this.showInterstitial(on_show, on_hide);

                      // this.showCustomInter(on_show, on_hide);
                  } else {


                      // if (Utils.randomInt(1, 100) > GxGame.adConfig.showInterRto) return on_hide && on_hide();
                      let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_interstitial', cc.Prefab));
                      this.nativeInter = node.getComponent('gx_native_interstitial');
                      this.nativeInter && this.nativeInter.show(native_data, () => {
                          this.interShowTime = this.get_time();
                          this.logi("showNativeInterstitial show")

                          this.hideBanner();
                          on_show && on_show();
                      }, on_hide);
                  }*/
            }
        }, (GxGame_1.default.isShenHe || GxGame_1.default.inBlockArea) ? 0 : delay_time * 1000);
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (GxGame_1.default.getLabel("switch")) {
            this.showNativeInterstitial(on_show, on_hide, delay_time);
        }
        else {
            this.logi("标签没开");
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
        this.hideNativeIcon();
        // 特殊处理
        let type = GxEnum_1.ad_native_type.native_icon;
        let posId = GxAdParams_1.AdParams.hw.native_icon;
        if (posId == GxAdParams_1.AdParams.hw.native1) {
            type = GxEnum_1.ad_native_type.inter1;
        }
        else if (posId == GxAdParams_1.AdParams.hw.native2) {
            type = GxEnum_1.ad_native_type.inter2;
        }
        let native_data = this.getLocalNativeData(type);
        if (native_data == null || native_data === undefined) {
            return console.log("[gx_game]showNativeIcon 暂无广告数据");
        }
        else {
            this.nativeIcon = new gx_ui_native_icon_1.gx_ui_native_icon();
            this.nativeIcon && this.nativeIcon.show(parent, native_data);
        }
    }
    /**隐藏原生ICON */
    hideNativeIcon() {
        super.hideNativeIcon();
    }
    /**
     * 每隔n秒加载一条数据，保持数组内各类型数据有5条
     */
    loop_get_native_data() {
        let nextTimeLeft = this._native_data_cache.length < 5 ? GxUtils_1.default.randomInt(15, 20) * 1000 : 30000;
        setTimeout(this.initNativeAd.bind(this), nextTimeLeft);
    }
    /**
     * 盒子9宫格
     */
    initGamePortal(on_show, on_hide, show_toast = true, image = '', marginTop = 300) {
        /*   //@ts-ignore
           this.portalAd = qg.createBoxPortalAd({
               adUnitId: GxGame.adConfig.adunit_portal,
               image: image,
               marginTop: marginTop
           })

           if (this.portalAdTimer == null) {
               this.portalAdTimer = new mTimer();
           }

           this.portalAd.onShow(ret => {
               console.log("盒子九宫格广告展示", ret)
               on_show && on_show();
               this.hideBanner();
           });
           this.portalAd.onClose(() => {
               on_hide && on_hide();
               if (this.portalAd.isDestroyed) {
                   return
               }
               // 当九宫格关闭之后，再次展示Icon
               this.portalAd.show()
           })*/
    }
    showGamePortal(on_show, on_hide, show_toast = true, image = '', marginTop = 300) {
        console.log('暂不支持互推盒子相关 API');
        /* if (qg.createBoxPortalAd && GxGame.adConfig.adunit_portal) {
             if (this.portalAd == null) {
                 this.initGamePortal(on_show, on_hide, show_toast, image, marginTop);
             }

             // 广告数据加载成功后展示
             this.portalAd.show().then(() => {
                 console.log('portalAd button show success')

                 if (this.portalAdTimer) {
                     this.portalAdTimer.clear();
                 }
                 this.portalAdTimer = null;
             }).catch(err => {
                 console.log("盒子九宫格广告加载失败", err)
                 if (err && (err.code == 30002 || err.code == 40218)) {
                     this.portalAdTimer.once(() => {
                         this.destroyGamePortal();
                         this.showGamePortal(on_show, on_hide, false, image, marginTop);
                     }, 10000)
                 } else {
                     on_hide && on_hide();
                     show_toast && this.createToast('努力加载中,请稍后再试~');
                 }
             })
         } else {
             on_hide && on_hide();
             console.log('暂不支持互推盒子相关 API')
         }*/
    }
    hideGamePortal() {
        if (this.portalAd) {
            this.portalAd.hide();
        }
        if (this.portalAdTimer) {
            this.portalAdTimer.clear();
        }
        this.portalAdTimer = null;
    }
    destroyGamePortal() {
        if (!this.portalAd)
            return;
        if (this.portalAdTimer) {
            this.portalAdTimer.clear();
        }
        this.portalAdTimer = null;
        this.portalAd.destroy();
        this.portalAd = null;
    }
    /**
     * 展示添加桌面界面
     * @param on_succ
     * @param on_close
     */
    showAddDesktop(on_close, on_succ) {
        if (Laya.stage.width >= Laya.stage.height) {
            this.addDesktop(on_succ, on_close);
            return;
        }
        if (this.addIconNode && !this.addIconNode.destroyed)
            return;
        this.addIconNode = new gx_ui_add_icon_1.default();
        this.addIconNode.show(on_close, on_succ);
        /*   if (this.addIconNode && this.addIconNode !== undefined && cc.isValid(this.addIconNode.node, true)) return;
   
   
           let node = cc.instantiate(Utils.getRes('gx/prefab/add_icon', cc.Prefab));
           this.addIconNode = node.getComponent('Gx_add_icon');
           this.addIconNode && this.addIconNode.show(on_succ);*/
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        console.log('不支持添加桌面');
        on_fail && on_fail();
        /*  if (this.platformVersion() >= 1041) {
              qg.hasShortcutInstalled({
                  success: status => {
                      if (status) {
                          has_add && has_add();
                      } else {
                          can_add && can_add();
                      }
                  },
                  fail: () => {
                      on_fail && on_fail();
                  }
              })
          } else {
              console.log('不支持添加桌面');
              on_fail && on_fail();
          }*/
    }
    /**创建桌面图标 */
    addDesktop(on_succe, on_fail) {
        on_fail && on_fail();
        /*  if (qg.installShortcut) {
              qg.installShortcut({
                  success: () => {
                      setTimeout(() => {
                          this.hasAddDesktop(() => {
                              on_fail && on_fail();
                          }, () => {
                              on_succe && on_succe();
                          })
                      }, 1000);
                  },
                  fail: () => {
                      on_fail && on_fail();
                  }
              })
          } else {
              on_fail && on_fail();
          }*/
    }
    login(on_succ, on_fail) {
        if (GxAdParams_1.AdParams.hw.appId && GxAdParams_1.AdParams.hw.appId.length > 0) {
            let self = this;
            //@ts-ignore
            qg.gameLoginWithReal({
                forceLogin: 1,
                appid: GxAdParams_1.AdParams.hw.appId,
                success: function (data) {
                    // 登录成功后，可以存储帐号信息。
                    console.log(" game login with real success:" + JSON.stringify(data));
                    on_succ && on_succ(data);
                },
                fail: function (data, code) {
                    console.log("game login with real fail:" + data + ", code:" + code);
                    //根据状态码处理游戏的逻辑。
                    //状态码为7004或者2012，表示玩家取消登录。
                    //此时，建议返回游戏界面，可以让玩家重新进行登录操作。
                    if (code == 7004 || code == 2012) {
                        console.log("玩家取消登录，返回游戏界面让玩家重新登录。");
                    }
                    //状态码为7021表示玩家取消实名认证。
                    //在中国大陆的情况下，此时需要禁止玩家进入游戏。
                    if (code == 7021) {
                        console.log("The player has canceled identity verification. Forbid the player from entering the game.");
                        this.createToast('登录失败：' + code);
                    }
                    /*   let node = new cc.Node();
                       node.addComponent(cc.Label).string = "重新登录"
                       node.on(cc.Node.EventType.TOUCH_START, () => {
   
                           node.removeFromParent(true)
                           console.log("点击登录了")
   
                           self.login(on_succ,on_fail);
                       }, this);
                       node.parent = cc.find("Canvas")
                       node.zIndex = cc.macro.MAX_ZINDEX;
   
                       node.y = -240;*/
                    on_fail && on_fail(code);
                    // @ts-ignore
                    qg.showModal({
                        title: '提示',
                        content: '请登录后使用',
                        confirmText: "登录",
                        cancelText: "退出游戏",
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                // node.removeFromParent(true)
                                self.login(on_succ, on_fail);
                            }
                            else if (res.cancel) {
                                console.log('用户点击取消');
                                // @ts-ignore
                                qg.exitApplication({
                                    success: function () {
                                        console.log("exitApplication success");
                                    },
                                    fail: function () {
                                        console.log("exitApplication fail");
                                    },
                                    complete: function () {
                                        console.log("exitApplication complete");
                                    }
                                });
                            }
                        }
                    });
                    // on_succ&&on_succ( code);
                }
            });
        }
        else {
            this.logi("appId 空");
            on_fail && on_fail("appId 空");
        }
        // if (this.platformVersion() >= 1040) {
        //     //@ts-ignore
        //     qg.login({
        //         success: res => {
        //             on_succ && on_succ(res);
        //         },
        //         fail: (err) => {
        //             on_fail && on_fail(err);
        //         }
        //     })
        // }
    }
    /**
     * 原生模板
     */
    showCustomBanner() {
        let ad_id = GxAdParams_1.AdParams.hw.custom_banner;
        //@ts-ignore
        if (ad_id == null || ad_id === undefined || !qg.createCustomAd) {
            return this.showNormalBanner();
        }
        this.destroyCustomBanner();
        //@ts-ignore
        this.customBanner = qg.createCustomAd({
            adUnitId: ad_id,
            style: {}
        });
        this.customBanner.show().then(() => {
        }).catch(err => {
            console.error('[gx_game] custom banner show error: ' + JSON.stringify(err));
            this.destroyCustomBanner();
            this.showNormalBanner();
        });
        let on_hide = () => {
            this.customBanner.offClose(on_hide);
            this.destroyCustomBanner();
        };
        this.customBanner.onClose(on_hide);
    }
    destroyCustomBanner() {
        if (this.customBanner) {
            this.customBanner.destroy();
        }
        this.customBanner = null;
    }
    showCustomInter(on_show, on_close) {
        //@ts-ignore
        if (!qg["createCustomAd"]) {
            on_close && on_close();
            return;
        }
        let ad_id = GxAdParams_1.AdParams.hw.native1;
        if (ad_id == null || ad_id === undefined) {
            this.showInterstitial(on_show, on_close);
            return on_close && on_close();
        }
        this.destroyCustomInter();
        //@ts-ignore
        this.customInter = qg.createCustomAd({
            adUnitId: ad_id,
            style: {
                top: (GxGame_1.default.screenHeight - 630) / 2,
                left: 0
            }
        });
        this.customInter.show().then(() => {
            this.logi("customInter show");
            this.hideBanner();
            on_show && on_show();
        });
        let on_hide = () => {
            on_close && on_close();
            this.customInter.offClose(on_hide);
            this.destroyCustomInter();
        };
        this.customInter.onClose(on_hide);
        let on_error = err => {
            console.error('[gx_game] custom inter error: ' + JSON.stringify(err));
            this.customInter.offError(on_error);
            this.destroyCustomInter();
            this.showInterstitial(on_show, on_close);
        };
        this.customInter.onError(on_error);
    }
    destroyCustomInter() {
        if (this.customInter) {
            this.customInter.destroy();
        }
        this.customInter = null;
    }
    logi(...data) {
        super.LOG("[HwAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[HwAdapter]", ...data);
    }
}
exports.default = HwAdapter;
