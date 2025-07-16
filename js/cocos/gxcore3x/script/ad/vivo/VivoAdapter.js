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
const cc_1 = require("cc");
const gx_native_banner_1 = __importDefault(require("../native/gx_native_banner"));
const gx_native_inner_interstitial_1 = __importDefault(require("../native/gx_native_inner_interstitial"));
const gx_native_interstitial_1 = __importDefault(require("../native/gx_native_interstitial"));
const gx_native_icon_1 = __importDefault(require("../native/gx_native_icon"));
const Gx_add_icon_1 = __importDefault(require("../../prefab/Gx_add_icon"));
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
class VivoAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.customBanner = null;
        this.customInter = null;
        this.portalAdTimer = null;
        this.videoArr = [];
        this.videoNum = 0;
        this.interShowCount = 0;
        this.videoShowing = false;
        this.openId = "";
        this.getOpenidTry = 0;
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
        this.getOpenId((openId) => {
            if (!!openId) {
                this.initGravityEngine();
            }
            else {
                this.loge("获取不到openid无法初始化引力");
            }
        });
        this.initNormalBanner();
        this.initNativeAd();
        //lsn  2024年5月10修改 视频参数可能多个 
        this.videoArr = [];
        if (GxAdParams_1.AdParams.vivo.video.includes("_")) {
            this.videoArr = GxAdParams_1.AdParams.vivo.video.split("_");
        }
        this.initVideo();
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
            if (window["ovad"]._boxShowing) {
                this.ac();
                return;
            }
            if (GxGame_1.default.gGB("ac")) {
                window["ovad"]._boxShowing = true;
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
            let node = (0, cc_1.instantiate)(GxUtils_1.default.getRes("gx/prefab/ad/native_banner", cc_1.Prefab));
            this.bannerNode = node.getComponent(gx_native_banner_1.default);
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
        console.log(this.videoArr, GxAdParams_1.AdParams.vivo.video, this.videoNum);
        console.log("视频参数是：", this.videoArr.length > 0 ? this.videoArr[this.videoNum] : GxAdParams_1.AdParams.vivo.video);
        this.videoAd = window["qg"].createRewardedVideoAd({
            posId: this.videoArr.length > 0 ? this.videoArr[this.videoNum] : GxAdParams_1.AdParams.vivo.video
        });
        let self = this;
        this.videoAd.onLoad(function () {
            self.logi("激励视频加载成功");
        });
        this.videoAd.onError(function (err) {
            // Utils.emit(EVENT_TYPE.AD_ERROR, 0);
            if (this.videoArr.length > 0) {
                this.videoNum++;
                if (this.videoNum < this.videoArr.length) {
                    this.initVideo();
                }
                else {
                    this.videoNum = 0;
                    self.logi("激励视频onerror");
                    self.logi(err);
                    if (isShow) {
                        self.createToast("暂无视频，请稍后再试");
                    }
                    self._videoErrorEvent();
                }
            }
            else {
                self.logi("激励视频onerror");
                self.logi(err);
                if (isShow) {
                    self.createToast("暂无视频，请稍后再试");
                }
                self._videoErrorEvent();
            }
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
            // this.logi(ad_type, "posId = ", posId);
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
            let node = (0, cc_1.instantiate)(GxUtils_1.default.getRes("gx/prefab/ad/native_inner_interstitial", cc_1.Prefab));
            this.innerInter = node.getComponent(gx_native_inner_interstitial_1.default);
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
        if (window["ovad"]._boxShowing)
            return;
        window["ovad"]._boxShowing = true;
        setTimeout(() => {
            this.privateShowInter(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    privateShowInter(on_show, on_hide) {
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000) {
            window["ovad"]._boxShowing = false;
            return on_hide && on_hide();
        }
        this.hideNativeInterstitial();
        // this.hideBanner();
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
        if (native_data == null || native_data === undefined) {
            // this.showInterstitial(on_show, on_hide);
            this.showCustomInter(on_show, () => {
                window["ovad"]._boxShowing = false;
                on_hide && on_hide();
            });
        }
        else {
            let node = (0, cc_1.instantiate)(GxUtils_1.default.getRes("gx/prefab/ad/native_interstitial", cc_1.Prefab));
            this.nativeInter = node.getComponent(gx_native_interstitial_1.default);
            this.nativeInter && this.nativeInter.show(native_data, () => {
                this.interShowTime = this.get_time();
                // this.hideBanner();
                on_show && on_show();
            }, () => {
                window["ovad"]._boxShowing = false;
                on_hide && on_hide();
            });
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
            window["ovad"]._boxShowing = true;
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
            let node = (0, cc_1.instantiate)(GxUtils_1.default.getRes("gx/prefab/ad/native_icon", cc_1.Prefab));
            this.nativeIcon = node.getComponent(gx_native_icon_1.default);
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
        if (this.addIconNode && this.addIconNode !== undefined && (0, cc_1.isValid)(this.addIconNode.node, true))
            return;
        let node = (0, cc_1.instantiate)(GxUtils_1.default.getRes("gx/prefab/add_icon", cc_1.Prefab));
        this.addIconNode = node.getComponent(Gx_add_icon_1.default);
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
                let childByName = cc_1.director.getScene().getChildByName("BLOCK");
                if (!childByName) {
                    let node = new cc_1.Node();
                    node.width = 2000;
                    node.height = 2000;
                    node.name = "BLOCK";
                    cc_1.director.getScene().addChild(node);
                    node.siblingIndex = 32765;
                    node.addComponent(cc_1.BlockInputEvents);
                    let winSize = cc_1.view.getVisibleSize();
                    node.x = winSize.width / 2;
                    node.y = winSize.height / 2;
                    let t = 0;
                    node.on(cc_1.Node.EventType.TOUCH_START, () => {
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
                let childByName = cc_1.director.getScene().getChildByName("BLOCK");
                if (childByName) {
                    childByName.destroy();
                }
            }
        });
        let on_hide = () => {
            if (window["cc"]) {
                let childByName = cc_1.director.getScene().getChildByName("BLOCK");
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
                let childByName = cc_1.director.getScene().getChildByName("BLOCK");
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
            let childByName = cc_1.director.getScene().getChildByName("BLOCK");
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
                /*            let demoD = {
                                "channel": "qg",
                                "systemInfo": {
                                    "system": "Android 11",
                                    "brand": "vivo",
                                    "manufacturer": "vivo",
                                    "model": "V2068A",
                                    "product": "PD2068",
                                    "osType": "android",
                                    "osVersionName": "11",
                                    "osVersionCode": 30,
                                    "platformVersionName": "1.10",
                                    "platformVersionCode": 1105,
                                    "language": "zh",
                                    "region": "CN",
                                    "screenWidth": 1600,
                                    "screenHeight": 720,
                                    "windowHeight": 720,
                                    "windowWidth": 1600,
                                    "pixelRatio": 2,
                                    "statusBarHeight": 46,
                                    "isHole": false,
                                    "isNotch": true,
                                    "hole_x": 0,
                                    "hole_y": 0,
                                    "hole_radius": 0,
                                    "safeArea": {
                                        "right": 1600,
                                        "bottom": 720,
                                        "left": 46,
                                        "top": 0,
                                        "width": 1554,
                                        "height": 720
                                    },
                                    "miniGame": {
                                        "package": "com.bjly.mhyhpk.vivominigame",
                                        "version": 20240202,
                                        "buildType": "release"
                                    },
                                    "battery": 0.8100000023841858,
                                    "wifiSignal": 4
                                },
                                "getNavigateOptionsSync": {},
                                "getEnterOptionsSync": {
                                    "query": {
                                        "packageName": "com.cbest.xszd.vivoad.vivo",
                                        "type": "ad",
                                        "channelInfo": "",
                                        "path": "/%5Bpath%5D%5B?key=value%5D&origin=fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA&__t__=eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0%3D&btn_name=__BTN_NAME__&backurl=__BACKURL__%26ad_id%3Da688262addc145309cddefb8319247d2%26enter_from%3D42528%26ad_token%3D1708682402078_bdba42d1e3aa40398f9576905c3798ff%26ad_position%3D3db9809828ed44b3860f4c918a08e061",
                                        "freedomGameLaunch": false,
                                        "extra": {
                                            "quick_app_st_channel": "VIVO_UNKNOWN_CHANNEL",
                                            "topRunningAct": "com.unity3d.player.GameActivity",
                                            "third_st_param": "{\"ad_a\":\"a688262addc145309cddefb8319247d2\",\"ad_p\":\"3db9809828ed44b3860f4c918a08e061\",\"ad_r\":\"1708682402078_bdba42d1e3aa40398f9576905c3798ff\",\"dspid\":\"1\",\"pkg\":\"com.bjly.mhyhpk.vivominigame\"}",
                                            "topRunningPkg": "com.cbest.xszd.vivoad.vivo",
                                            "define_pkg": "com.vivo.ad"
                                        },
                                        "internal": {
                                            "custom_params": "{\"cus_origin_uri\":\"hap:\\/\\/app\\/com.bjly.mhyhpk.vivominigame\\/[path][?key=value]&__SRC__={extra:{third_st_param:{\\\"ad_a\\\":\\\"a688262addc145309cddefb8319247d2\\\",\\\"ad_p\\\":\\\"3db9809828ed44b3860f4c918a08e061\\\",\\\"ad_r\\\":\\\"1708682402078_bdba42d1e3aa40398f9576905c3798ff\\\",\\\"dspid\\\":\\\"1\\\",\\\"pkg\\\":\\\"com.bjly.mhyhpk.vivominigame\\\"}},packageName:com.vivo.ad,type:ad}&origin=fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA&__t__=eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0%3D&btn_name=__BTN_NAME__&backurl=__BACKURL__%26ad_id%3Da688262addc145309cddefb8319247d2%26enter_from%3D42528%26ad_token%3D1708682402078_bdba42d1e3aa40398f9576905c3798ff%26ad_position%3D3db9809828ed44b3860f4c918a08e061\"}",
                                            "channel": "deeplink"
                                        }
                                    },
                                    "referrerInfo": {
                                        "package": "com.cbest.xszd.vivoad.vivo",
                                        "type": "ad",
                                        "extraData": {
                                            "key": "value]",
                                            "__SRC__": "{extra:{third_st_param:{\"ad_a\":\"a688262addc145309cddefb8319247d2\",\"ad_p\":\"3db9809828ed44b3860f4c918a08e061\",\"ad_r\":\"1708682402078_bdba42d1e3aa40398f9576905c3798ff\",\"dspid\":\"1\",\"pkg\":\"com.bjly.mhyhpk.vivominigame\"}},packageName:com.vivo.ad,type:ad}",
                                            "origin": "fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA",
                                            "__t__": "eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0=",
                                            "btn_name": "__BTN_NAME__",
                                            "backurl": "__BACKURL__",
                                            "ad_id": "a688262addc145309cddefb8319247d2",
                                            "enter_from": "42528",
                                            "ad_token": "1708682402078_bdba42d1e3aa40398f9576905c3798ff",
                                            "ad_position": "3db9809828ed44b3860f4c918a08e061"
                                        }
                                    },
                                    "appId": "com.bjly.mhyhpk.vivominigame",
                                    "path": "/%5Bpath%5D%5B?key=value%5D&origin=fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA&__t__=eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0%3D&btn_name=__BTN_NAME__&backurl=__BACKURL__%26ad_id%3Da688262addc145309cddefb8319247d2%26enter_from%3D42528%26ad_token%3D1708682402078_bdba42d1e3aa40398f9576905c3798ff%26ad_position%3D3db9809828ed44b3860f4c918a08e061"
                                },
                                "getLaunchOptionsSync": {
                                    "query": {
                                        "packageName": "com.cbest.xszd.vivoad.vivo",
                                        "type": "ad",
                                        "channelInfo": "",
                                        "path": "/%5Bpath%5D%5B?key=value%5D&origin=fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA&__t__=eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0%3D&btn_name=__BTN_NAME__&backurl=__BACKURL__%26ad_id%3Da688262addc145309cddefb8319247d2%26enter_from%3D42528%26ad_token%3D1708682402078_bdba42d1e3aa40398f9576905c3798ff%26ad_position%3D3db9809828ed44b3860f4c918a08e061",
                                        "freedomGameLaunch": false,
                                        "extra": {
                                            "quick_app_st_channel": "VIVO_UNKNOWN_CHANNEL",
                                            "topRunningAct": "com.unity3d.player.GameActivity",
                                            "third_st_param": "{\"ad_a\":\"a688262addc145309cddefb8319247d2\",\"ad_p\":\"3db9809828ed44b3860f4c918a08e061\",\"ad_r\":\"1708682402078_bdba42d1e3aa40398f9576905c3798ff\",\"dspid\":\"1\",\"pkg\":\"com.bjly.mhyhpk.vivominigame\"}",
                                            "topRunningPkg": "com.cbest.xszd.vivoad.vivo",
                                            "define_pkg": "com.vivo.ad"
                                        },
                                        "internal": {
                                            "custom_params": "{\"cus_origin_uri\":\"hap:\\/\\/app\\/com.bjly.mhyhpk.vivominigame\\/[path][?key=value]&__SRC__={extra:{third_st_param:{\\\"ad_a\\\":\\\"a688262addc145309cddefb8319247d2\\\",\\\"ad_p\\\":\\\"3db9809828ed44b3860f4c918a08e061\\\",\\\"ad_r\\\":\\\"1708682402078_bdba42d1e3aa40398f9576905c3798ff\\\",\\\"dspid\\\":\\\"1\\\",\\\"pkg\\\":\\\"com.bjly.mhyhpk.vivominigame\\\"}},packageName:com.vivo.ad,type:ad}&origin=fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA&__t__=eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0%3D&btn_name=__BTN_NAME__&backurl=__BACKURL__%26ad_id%3Da688262addc145309cddefb8319247d2%26enter_from%3D42528%26ad_token%3D1708682402078_bdba42d1e3aa40398f9576905c3798ff%26ad_position%3D3db9809828ed44b3860f4c918a08e061\"}",
                                            "channel": "deeplink"
                                        }
                                    },
                                    "referrerInfo": {
                                        "package": "com.cbest.xszd.vivoad.vivo",
                                        "type": "ad",
                                        "extraData": {
                                            "key": "value]",
                                            "__SRC__": "{extra:{third_st_param:{\"ad_a\":\"a688262addc145309cddefb8319247d2\",\"ad_p\":\"3db9809828ed44b3860f4c918a08e061\",\"ad_r\":\"1708682402078_bdba42d1e3aa40398f9576905c3798ff\",\"dspid\":\"1\",\"pkg\":\"com.bjly.mhyhpk.vivominigame\"}},packageName:com.vivo.ad,type:ad}",
                                            "origin": "fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA",
                                            "__t__": "eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0=",
                                            "btn_name": "__BTN_NAME__",
                                            "backurl": "__BACKURL__",
                                            "ad_id": "a688262addc145309cddefb8319247d2",
                                            "enter_from": "42528",
                                            "ad_token": "1708682402078_bdba42d1e3aa40398f9576905c3798ff",
                                            "ad_position": "3db9809828ed44b3860f4c918a08e061"
                                        }
                                    },
                                    "appId": "com.bjly.mhyhpk.vivominigame",
                                    "path": "/%5Bpath%5D%5B?key=value%5D&origin=fiAvlfP9Cl-qevLFZIh_PuAurJwf_QHnWaFJPKMkt7m6ZXxNOm76wYqGOuqXlEcd5RJZoDjbyyYE-lafWFng7LwWW1--Ud5nTPB9V6ujODZEJgiTQloU2lcnah-Wpg3vpyb0xPV3ltSWYYhYvJcYiIoc6AztXwLPIuleh5zNxWpfPLEDsvvEU2Nv5s39jLpQS-l_OXc4IO0Hfscspv4vFlf7o_oUZh0wNsNMEVyG8NyYlwz6zRzPZ_6NLHtMQZICYjFcQuhpi7To9F3-0HC8MA&__t__=eyJzb3VyY2VJZCI6IjEwMDExIiwidmVyaWZ5Q29kZSI6IjE3MDg2ODI0MDIwNzhfYmRiYTQyZDFlM2FhNDAzOThmOTU3NjkwNWMzNzk4ZmZfNjU0OTk2MTciLCJzaWduIjoiMTYyZjc4MjA0N2E4OTYxMmQ5MjhmNjM5MGZjZjBiZTk5OTEyMzYzZDYzYjQ5ZjAyOWJmYTNiZTg2M2FlZTNkMSIsInZlcnNpb24iOiIxLjAiLCJ0aW1lc3RhbXAiOiIxNzA4NjgyNDAyMzUxIn0%3D&btn_name=__BTN_NAME__&backurl=__BACKURL__%26ad_id%3Da688262addc145309cddefb8319247d2%26enter_from%3D42528%26ad_token%3D1708682402078_bdba42d1e3aa40398f9576905c3798ff%26ad_position%3D3db9809828ed44b3860f4c918a08e061"
                                }
                            };*/
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
    showPositionBanner(left, top, showCallback, failedCallback) {
        this.hideBanner();
        if (!!GxAdParams_1.AdParams.vivo.banner) {
            this.bannerAd = window["qg"].createBannerAd({
                adUnitId: GxAdParams_1.AdParams.vivo.banner,
                style: { left: left, top: top },
                adIntervals: Math.max(GxGame_1.default.adConfig.bannerUpdateTime, 30)
            });
            this.bannerAd.onError(err => {
                this.loge(" position normal banner error: ", JSON.stringify(err));
            });
            if (this.bannerAd == null) {
                this.logi("position banner空");
                failedCallback && failedCallback();
                return;
            }
            this.bannerAd.show().then(() => {
                showCallback && showCallback();
                this.logi("position normal banner show success");
            }).catch(e => {
                failedCallback && failedCallback();
                this.loge("position banner error", e);
            });
        }
        else {
            failedCallback && failedCallback();
        }
    }
    getOpenId(callback) {
        let self = this;
        if (self.getOpenidTry >= 5) {
            self.getOpenidTry = 0;
            console.warn("获取openId重试最大次数了");
            callback && callback(null);
            return;
        }
        let item = DataStorage_1.default.getItem("__gx_openId__", null);
        if (!!item) {
            console.log("获取到缓存的openid：" + item);
            self.openId = item;
            callback && callback(item);
            return;
        }
        if (GxAdParams_1.AdParams.vivo.accountAppKey && GxAdParams_1.AdParams.vivo.accountAppSecret) {
            // @ts-ignore  这个一直不能用 获取不到不知道什么原因
            if (qg.getAccountInfo && 1 == 2) {
                // @ts-ignore
                qg.getAccountInfo({
                    appKey: GxAdParams_1.AdParams.vivo.accountAppKey,
                    appSecret: GxAdParams_1.AdParams.vivo.accountAppSecret,
                    success(res) {
                        console.log(JSON.stringify(res));
                        console.log("getAccountInfo success");
                        self.getOpenidTry = 0;
                        callback && callback(res.data.openId);
                    },
                    fail(res) {
                        console.log(JSON.stringify(res));
                        console.log("getAccountInfo fail");
                        setTimeout(() => {
                            self.getOpenidTry++;
                            self.getOpenId(callback);
                        }, 3000);
                    }
                });
            }
            else {
                // @ts-ignore
                qg.login().then((res) => {
                    if (res.data.token) {
                        // 使用token进行服务端对接
                        self.requestGet(`${GxConstant.Code2SessionUrl}/ov?appKey=${GxAdParams_1.AdParams.vivo.accountAppKey}&appSecret=${GxAdParams_1.AdParams.vivo.accountAppSecret}&token=${res.data.token}&packageName=${GxAdParams_1.AdParams.vivo.packageName}&platform=vivo`, (res) => {
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
                        setTimeout(() => {
                            self.getOpenidTry++;
                            self.getOpenId(callback);
                        }, 3000);
                    }
                }, (err) => {
                    console.log("登录失败" + JSON.stringify(err));
                    setTimeout(() => {
                        self.getOpenidTry++;
                        self.getOpenId(callback);
                    }, 3000);
                });
            }
        }
        else {
            console.warn("没有配置appKey和appSecret 不能获取openid");
        }
    }
    requestGet(url, successCallback, failCallback) {
        //@ts-ignore
        qg.request({
            url: url,
            success(res) {
                successCallback && successCallback(res);
            },
            //@ts-ignore
            fail(res) {
                failCallback && failCallback(res);
            }
        });
    }
    logw(...data) {
        super.LOGW("[VivoAdapter]", ...data);
    }
    initGravityEngine() {
        if (!!GxAdParams_1.AdParams.vivo.gravityEngineAccessToken) {
            console.log("初始化ge");
            let debug = "none";
            if (window["geDebug"]) {
                debug = "debug";
            }
            const config = {
                accessToken: GxAdParams_1.AdParams.vivo.gravityEngineAccessToken, // 项目通行证，在：网站后台-->设置-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
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
                    if (qg["getSystemInfoSync"]) {
                        //@ts-ignore
                        let ttElementElement = qg["getSystemInfoSync"]()["miniGame"];
                        let mpVersion = ttElementElement["version"];
                        if (!!mpVersion) {
                            let re = parseInt(mpVersion);
                            if (!isNaN(re)) {
                                versionNumber = re;
                            }
                        }
                    }
                }
                catch (e) {
                }
                this.logi("init versionNumber:" + versionNumber);
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
            console.warn("没有参数 不初始化引力引擎");
        }
    }
}
exports.default = VivoAdapter;
