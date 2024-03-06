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
class VivoAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.customBanner = null;
        this.customInter = null;
        this.portalAdTimer = null;
        this.interShowCount = 0;
        this.videoShowing = false;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new VivoAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        super.initAd();
        /*9066EF5283E848D69F28921A96A9FF54*/
        // @ts-ignore
        var data = qg.getSystemInfoSync();
        if (data["miniGame"]) {
            let packageName = data.miniGame.package;
            /*            TDSDK.getInstance().initApp(packageName, "", data.miniGame.version + "", data.miniGame.version)

                        TDSDK.getInstance().init("9066EF5283E848D69F28921A96A9FF54", packageName.replace(/\./g, "_"))*/
        }
        this.initBanner();
        this.initNormalBanner();
        this.initVideo();
        this.initNativeAd();
        this.initGamePortal();
        /*时候4 2023年9月4日11:30:59*/
        GxGame_1.default.adConfig.interTick = GxGame_1.default.gGN("ae", 10);
        /*修改3 2023年9月4日11:26:36*/
        this.ac();
        /* 修改2 2023年9月4日11:22:57 */
        this.ab();
    }
    ac() {
        let value = GxGame_1.default.gGN("ac", 20);
        setTimeout(() => {
            if (GxGame_1.default.gGB("ac")) {
                this.privateShowInter(() => {
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
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
        if (this.platformVersion() < 1031 || GxAdParams_1.AdParams.vivo.banner.length <= 0)
            return;
        this.destroyNormalBanner();
        let style = {};
        if (GxAdParams_1.AdParams.vivo.bannerOnTop) {
            style = {
                top: 0
            };
            //@ts-ignore
            let systemInfoSync = qg.getSystemInfoSync();
            let screenHeight = systemInfoSync.screenHeight;
            let screenWidth = systemInfoSync.screenWidth;
            if (screenWidth > screenHeight) {
                //横屏
                style["left"] = screenWidth / 4;
            }
            else {
                //竖屏
            }
        }
        else {
            style = {};
        }
        // @ts-ignore
        this.bannerAd = qg.createBannerAd({
            posId: GxAdParams_1.AdParams.vivo.banner,
            style: style,
            adIntervals: Math.max(GxGame_1.default.adConfig.bannerUpdateTime, 30)
        });
        this.bannerAd.onError(err => {
            this.loge("normal banner error: ", JSON.stringify(err));
            if (err && err.errCode == 30002) {
                this.logi("销毁banner");
                this.destroyNormalBanner();
            }
        });
    }
    /**
     * 展示普通banner
     */
    showNormalBanner() {
        if (this.bannerAd == null) {
            this.initNormalBanner();
        }
        if (this.bannerAd == null)
            return;
        this.bannerAd.show().then(() => {
            this.logi("normal banner show success");
            // if (this.bannerTimer) this.bannerTimer.stop();
        });
    }
    /**
     * 隐藏普通banner
     */
    hideNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
        this.destroyNormalBanner();
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
        this.hideBanner();
        console.error("这里不走啥原因");
        // this.bannerDelayTimer = mTimer.once(() => {
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.banner);
        if (GxGame_1.default.adConfig.bannerUpdateTime > 0) {
            if (this.bannerTimer == null)
                this.bannerTimer = new GxTimer_1.default();
            this.bannerTimer && this.bannerTimer.once(() => {
                this.showBanner();
            }, GxGame_1.default.adConfig.bannerUpdateTime * 1000);
        }
        if (native_data == null || native_data === undefined) {
            // this.showNormalBanner();
            this.showCustomBanner();
        }
        else {
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_banner", cc.Prefab));
            this.bannerNode = node.getComponent("gx_native_banner");
            this.bannerNode.show(native_data, () => {
            }, () => {
                this.bannerTimer && this.bannerTimer.clear();
            });
        }
        //  }, 1000);
    }
    hideBanner() {
        super.hideBanner();
        this.hideNormalBanner();
        this.destroyCustomBanner();
    }
    initVideo(isShow = false) {
        if (this.platformVersion() < 1041 || GxAdParams_1.AdParams.vivo.video == null || GxAdParams_1.AdParams.vivo.video == "")
            return;
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = qg.createRewardedVideoAd({
            posId: GxAdParams_1.AdParams.vivo.video
        });
        let self = this;
        this.videoAd.onLoad(function () {
            self.logi("激励视频加载成功");
        });
        this.videoAd.onError(function (err) {
            // Utils.emit(EVENT_TYPE.AD_ERROR, 0);
            self.logi("激励视频onerror");
            self.logi(err);
            if (isShow) {
                self.createToast("暂无视频，请稍后再试");
            }
            self._videoErrorEvent();
        });
        this.videoAd.onClose(res => {
            GxAudioUtil_1.default.setMusicVolume(1);
            GxAudioUtil_1.default.setSoundVolume(1);
            if (res && res.isEnded) {
                self.logi("正常播放结束，可以下发游戏奖励");
                this.videocallback && this.videocallback(true);
                self._videoCompleteEvent();
            }
            else {
                self._videoCloseEvent();
                this.videocallback && this.videocallback(false);
            }
            this.videoAd.load();
            this.videoShowing = false;
        });
        this.videoAd.load();
    }
    showVideo(complete, flag = "") {
        if (this.videoShowing) {
            complete && complete(false);
            return;
        }
        super.showVideo(null, flag);
        this.videoShowing = true;
        if (this.videoAd == null) {
            this.initVideo(true);
        }
        if (this.videoAd == null) {
            this.createToast("暂无视频，请稍后再试");
            this.videoShowing = false;
            this._videoErrorEvent();
            complete && complete(false);
            return;
        }
        this.videocallback = complete;
        this.videoAd.show().then(() => {
            GxAudioUtil_1.default.setMusicVolume(0);
            GxAudioUtil_1.default.setSoundVolume(0);
        }).catch(() => {
            this._videoErrorEvent();
            this.logi("激励视频onerror2");
            this.videocallback && this.videocallback(false);
            this.videocallback = null;
            this.createToast("暂无视频，请稍后再试");
            this.videoShowing = false;
            this.videoAd.load();
        });
    }
    createToast(desc) {
        console.log("toast:" + desc);
        //@ts-ignore
        qg.showToast({
            message: desc
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
        console.log("普通 插屏");
        if (this.platformVersion() < 1031 || GxAdParams_1.AdParams.vivo.inter == null || GxAdParams_1.AdParams.vivo.inter.length == 0) {
            return on_close && on_close();
        }
        this.destroyNormalInter();
        // this.hideBanner();
        // @ts-ignore
        this.interAd = qg.createInterstitialAd({
            posId: GxAdParams_1.AdParams.vivo.inter
        });
        let self = this;
        this.interAd.onLoad(() => {
            self.logi("插屏广告加载");
            on_show && on_show();
        });
        this.interAd.onClose(() => {
            on_close && on_close();
        });
        this.interAd.load().then(res => {
            return this.interAd.show();
        }).then(() => {
            // this.hideBanner();
            this.interShowTime = this.get_time();
        }).catch(err => {
            this.logi("普通插屏展示失败" + JSON.stringify(err));
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
            if (ad_type == GxEnum_1.ad_native_type.native_icon) {
                posId = GxAdParams_1.AdParams.vivo.native_icon;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.vivo.native1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.vivo.native2;
            }
            this.logi(ad_type, "posId = ", posId);
            if (posId == "" || posId === undefined || posId == null || this.is_limit_native_length(ad_type) || this.platformVersion() < 1053)
                return resolve(null);
            // @ts-ignore
            let nativeAd = qg.createNativeAd({
                posId: posId
            });
            let on_load = (res) => {
                this.logi("[gx_game]native data load:");
                if (res && res.adList) {
                    let data = res.adList.pop();
                    data.ad = nativeAd;
                    data.type = ad_type;
                    this.add_native_data(data);
                    this.logi("[gx_game]native data load succ:" + JSON.stringify(data));
                    nativeAd.offLoad(on_load);
                }
            };
            nativeAd.onLoad(on_load);
            let on_error = (err) => {
                this.logi("[gx_game]native data error: " + JSON.stringify(err), "color: red");
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
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_inner_interstitial", cc.Prefab));
            this.innerInter = node.getComponent("gx_native_inner_interstitial");
            this.innerInter && this.innerInter.show(parent, native_data, on_click, () => {
                // this.hideBanner();
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
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        setTimeout(() => {
            this.privateShowInter(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    privateShowInter(on_show, on_hide) {
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000)
            return on_hide && on_hide();
        this.hideNativeInterstitial();
        // this.hideBanner();
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
        if (native_data == null || native_data === undefined) {
            // this.showInterstitial(on_show, on_hide);
            this.showCustomInter(on_show, on_hide);
        }
        else {
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_interstitial", cc.Prefab));
            this.nativeInter = node.getComponent("gx_native_interstitial");
            this.nativeInter && this.nativeInter.show(native_data, () => {
                this.interShowTime = this.get_time();
                // this.hideBanner();
                on_show && on_show();
            }, on_hide);
        }
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        /*修改5 2023年9月4日11:44:48*/
        let label = GxGame_1.default.gGB("af");
        if (!label) {
            this.logi("限制了1");
            on_hide && on_hide();
            return;
        }
        let canShow = false;
        /*  let icLabel = GxGame.gGB("ic");
          if (icLabel) {
    */
        /*      let value = GxGame.gGN("ic", 0);
              if (value > 0) {
                  if (this.icNum == -1) {
                      this.icNum = value;
                      setInterval(() => {
                          console.log("重置icNum")
                          this.icNum = value;
                      }, 90 * 1000)
                  }
                  if (this.icNum > 0) {
                      this.icNum--;
                      canShow = true
                  } else {
                      console.log("icNum <0")
                  }
              } else {
                  console.log("ic <0")
              }*/
        /*
                } else {
                    console.log("ic false")
                }*/
        canShow = true;
        if (!canShow) {
            return;
        }
        setTimeout(() => {
            this.privateShowInter(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
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
        let posId = GxAdParams_1.AdParams.vivo.native_icon;
        if (posId == GxAdParams_1.AdParams.vivo.native1) {
            type = GxEnum_1.ad_native_type.inter1;
        }
        else if (posId == GxAdParams_1.AdParams.vivo.native2) {
            type = GxEnum_1.ad_native_type.inter2;
        }
        let native_data = this.getLocalNativeData(type);
        if (native_data == null || native_data === undefined) {
            this.logi("showNativeIcon 暂无广告数据");
            return;
        }
        else {
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_icon", cc.Prefab));
            this.nativeIcon = node.getComponent("gx_native_icon");
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
    initGamePortal(on_show, on_hide, show_toast = true, image = "", marginTop = 300) {
        if (!GxAdParams_1.AdParams.vivo.boxPortal) {
            on_hide && on_hide();
            return;
        }
        // @ts-ignore
        this.portalAd = qg.createBoxPortalAd({
            posId: GxAdParams_1.AdParams.vivo.boxPortal,
            image: image,
            marginTop: marginTop
        });
        if (this.portalAdTimer == null) {
            this.portalAdTimer = new GxTimer_1.default();
        }
        this.portalAd.onShow(ret => {
            this.logi("盒子九宫格广告展示", ret);
            on_show && on_show();
            this.hideBanner();
        });
        this.portalAd.onClose(() => {
            on_hide && on_hide();
            if (this.portalAd.isDestroyed) {
                return;
            }
            // 当九宫格关闭之后，再次展示Icon
            this.portalAd.show();
        });
    }
    showGamePortal(on_show, on_hide, show_toast = true, image = "", marginTop = 300) {
        // @ts-ignore
        if (qg.createBoxPortalAd && GxGame_1.default.adConfig.adunit_portal) {
            if (this.portalAd == null) {
                this.initGamePortal(on_show, on_hide, show_toast, image, marginTop);
            }
            if (this.portalAd != null) {
                // 广告数据加载成功后展示
                this.portalAd.show().then(() => {
                    this.logi("portalAd button show success");
                    if (this.portalAdTimer) {
                        this.portalAdTimer.clear();
                    }
                    this.portalAdTimer = null;
                }).catch(err => {
                    this.logi("盒子九宫格广告加载失败", err);
                    if (err && (err.code == 30002 || err.code == 40218)) {
                        this.portalAdTimer.once(() => {
                            this.destroyGamePortal();
                            this.showGamePortal(on_show, on_hide, false, image, marginTop);
                        }, 10000);
                    }
                    else {
                        on_hide && on_hide();
                        show_toast && this.createToast("努力加载中,请稍后再试~");
                    }
                });
            }
            else {
                this.logi("portalAd is null");
            }
        }
        else {
            on_hide && on_hide();
            this.logi("暂不支持互推盒子相关 API");
        }
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
     * @param on_close
     * @param on_succ
     */
    showAddDesktop(on_close, on_succ) {
        if (this.addIconNode && this.addIconNode !== undefined && cc.isValid(this.addIconNode.node, true))
            return;
        let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/add_icon", cc.Prefab));
        this.addIconNode = node.getComponent("Gx_add_icon");
        this.addIconNode && this.addIconNode.show(on_succ);
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        if (this.platformVersion() >= 1041) {
            // @ts-ignore
            qg.hasShortcutInstalled({
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
        if (qg.installShortcut) {
            // @ts-ignore
            qg.installShortcut({
                success: () => {
                    setTimeout(() => {
                        this.hasAddDesktop(() => {
                            on_fail && on_fail();
                        }, () => {
                            on_succe && on_succe();
                        });
                    }, 1000);
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
            qg.login({
                success: res => {
                    on_succ && on_succ(res);
                },
                fail: (err) => {
                    on_fail && on_fail(err);
                }
            });
        }
    }
    /**
     * 原生模板
     */
    showCustomBanner() {
        let ad_id = GxAdParams_1.AdParams.vivo.custom_banner;
        // @ts-ignore
        if (ad_id == null || ad_id === undefined || ad_id.length <= 0 || !qg.createCustomAd) {
            return this.showNormalBanner();
        }
        this.destroyCustomBanner();
        // @ts-ignore
        this.customBanner = qg.createCustomAd({
            posId: ad_id,
            style: {}
        });
        this.customBanner.show().then(() => {
        }).catch(err => {
            this.loge("custom banner show error: " + JSON.stringify(err));
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
        let ad_id = GxAdParams_1.AdParams.vivo.custom1;
        if (this.interShowCount % 2 == 0) {
            ad_id = GxAdParams_1.AdParams.vivo.custom1;
            if (!ad_id || ad_id.length == 0) {
                ad_id = GxAdParams_1.AdParams.vivo.custom2;
            }
        }
        else {
            ad_id = GxAdParams_1.AdParams.vivo.custom2;
            if (!ad_id || ad_id.length == 0) {
                ad_id = GxAdParams_1.AdParams.vivo.custom1;
            }
        }
        this.logi("custom :" + ad_id);
        this.interShowCount++;
        if (ad_id == null || ad_id === undefined) {
            this.showInterstitial(on_show, on_close);
            return on_close && on_close();
        }
        this.destroyCustomInter();
        // @ts-ignore
        this.customInter = qg.createCustomAd({
            posId: ad_id,
            style: this._getNativeInterStyle()
            /*style: {
                top: (GxGame.screenHeight - 630) / 2,
                left: 0
            }*/
        });
        this.customInter.show().then(() => {
            this.interShowTime = this.get_time();
            // this.hideBanner();
            if (window["cc"]) {
                let childByName = cc.director.getScene().getChildByName("BLOCK");
                if (!childByName) {
                    let node = new cc.Node();
                    node.width = 2000;
                    node.height = 2000;
                    node.name = "BLOCK";
                    cc.director.getScene().addChild(node);
                    node.zIndex = cc.macro.MAX_ZINDEX;
                    node.addComponent(cc.BlockInputEvents);
                    let winSize = cc.winSize;
                    node.x = winSize.width / 2;
                    node.y = winSize.height / 2;
                    let t = 0;
                    node.on(cc.Node.EventType.TOUCH_START, () => {
                        t++;
                        console.log("触摸了");
                        if (t == 4) {
                            node.destroy();
                        }
                    });
                }
            }
            on_show && on_show();
        }).catch(() => {
            if (window["cc"]) {
                let childByName = cc.director.getScene().getChildByName("BLOCK");
                if (childByName) {
                    childByName.destroy();
                }
            }
        });
        let on_hide = () => {
            if (window["cc"]) {
                let childByName = cc.director.getScene().getChildByName("BLOCK");
                if (childByName) {
                    childByName.destroy();
                }
            }
            on_close && on_close();
            this.customInter.offClose(on_hide);
            this.destroyCustomInter();
        };
        this.customInter.onClose(on_hide);
        let on_error = err => {
            if (window["cc"]) {
                let childByName = cc.director.getScene().getChildByName("BLOCK");
                if (childByName) {
                    childByName.destroy();
                }
            }
            this.loge(" custom inter error: " + JSON.stringify(err));
            this.customInter.offError(on_error);
            this.destroyCustomInter();
            this.showInterstitial(on_show, on_close);
        };
        this.customInter.onError(on_error);
    }
    _getNativeInterStyle() {
        //@ts-ignore
        let systemInfoSync = qg.getSystemInfoSync();
        let screenHeight = systemInfoSync.screenHeight;
        let screenWidth = systemInfoSync.screenWidth;
        let style = {};
        if (screenWidth > screenHeight) {
            //横屏
            if (screenWidth > 1280) {
            }
            else {
            }
            let number = screenWidth / 1080;
            let number1 = number * 720;
            // console.log("计算宽：" + number1);
            /*    if (number1 < 720) {
                     number1 = 720;
                 }*/
            if (number1 > 1280) {
                number1 = 1280;
            }
            let number2 = (number1 / 720) * 525;
            // console.log("计算高：" + number2);
            /*   if (number2 < 525) {
                    number2 = 525;
                }*/
            if (number2 > 720) {
                number2 = 720;
            }
            /*  console.log("实际设置宽：" + number1);
              console.log("实际设置高：" + number2);
      */
            let number3 = (screenHeight - number2) / 2;
            if (number3 <= 15) {
                number3 = 50;
            }
            number3 = 50;
            style = {
                left: (screenWidth - number1) / 2,
                top: (number3)
            };
        }
        else {
            let number = screenWidth / 1080;
            let number1 = number * 720;
            if (number1 < 720) {
                number1 = 720;
            }
            if (number1 > 1280) {
                number1 = 1280;
            }
            let number2 = (number1 / 720) * 525;
            if (number2 < 525) {
                number2 = 525;
            }
            if (number2 > 720) {
                number2 = 720;
            }
            //竖屏
            style = {
                left: 0,
                top: ((screenHeight - number2) / 2) + 150 //0518策略往下挪点
            };
        }
        return style;
    }
    destroyCustomInter() {
        if (window["cc"]) {
            let childByName = cc.director.getScene().getChildByName("BLOCK");
            if (childByName) {
                childByName.destroy();
            }
        }
        if (this.customInter) {
            this.customInter.destroy();
        }
        this.customInter = null;
    }
    logi(...data) {
        super.LOG("[VivoAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[VivoAdapter]", ...data);
    }
    showGameOverAD() {
        this.showVideo((res) => {
        }, "GxGameOverAd");
    }
    userFrom(callback) {
        // https://minigame.vivo.com.cn/documents/#/lesson/game/game_promoting?id=%e4%ba%8c%e3%80%81vivo%e5%b9%bf%e5%91%8a%e8%81%94%e7%9b%9f%e4%b9%b0%e9%87%8f%e8%af%b4%e6%98%8e
        try {
            //@ts-ignore
            if (window["testDataToServer"] && testDataToServer.isAdUser) {
                return callback && callback(true);
            }
            let isBuy = false;
            //@ts-ignore
            if (qg["getLaunchOptionsSync"]) {
                //@ts-ignore
                var e = null, 
                //@ts-ignore
                t = qg.getLaunchOptionsSync();
                console.log(JSON.stringify(t));
                console.log(t["query"]);
                if (t["query"]) {
                    console.log(t["query"]["type"]);
                }
                if ("ad" === t.query.type) {
                    isBuy = true;
                }
                try {
                    var o = t.referrerInfo.extraData;
                    if (o) {
                        e = o.ad_id || o.adid || null;
                    }
                    else {
                        var n = t.query.internal;
                        if ("deeplink" === (n && n.channel ? n.channel : "")) {
                            var i = n.custom_params;
                            console.log(i);
                            var r = JSON.parse(i)
                                .cus_origin_uri;
                            let match = r.match(/ad_id=([^&]+)/);
                            let match1 = r.match(/adid=([^&]+)/);
                            if (match && match.length >= 2) {
                                e = match[1];
                            }
                            if (match1 && match1.length >= 2) {
                                e = match1[1];
                            }
                        }
                    }
                }
                catch (e) {
                    console.log("----异常了");
                    console.log(e);
                }
                if (!!e) {
                    isBuy = true;
                }
                console.log("---e" + e);
            }
            else {
                console.log("---低版本");
            }
            return callback && callback(isBuy);
        }
        catch (e) {
            callback && callback(false);
        }
    }
}
exports.default = VivoAdapter;
