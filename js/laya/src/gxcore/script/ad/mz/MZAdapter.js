"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gx_ui_banner_1 = __importDefault(require("../native/gx_ui_banner"));
const gx_ui_inner_interstitial_1 = __importDefault(require("../native/gx_ui_inner_interstitial"));
const gx_ui_interstitial_1 = __importDefault(require("../native/gx_ui_interstitial"));
const gx_ui_native_icon_1 = require("../native/gx_ui_native_icon");
const gx_ui_add_icon_1 = __importDefault(require("../../ui/gx_ui_add_icon"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxEnum_1 = require("../../core/GxEnum");
const GxAdParams_1 = require("../../GxAdParams");
class MZAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.isSecond = false;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new MZAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        console.log('MZAd initad');
        super.initAd();
        this.initBanner();
        this.initNormalBanner();
        this.initVideo();
        this.initNativeAd();
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
        if (!qg.createBannerAd || GxAdParams_1.AdParams.mz.banner.length <= 0)
            return;
        let width = Math.min(GxGame_1.default.screenWidth, GxGame_1.default.screenHeight);
        let height = 200;
        this.bannerAd = qg.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.mz.banner,
            style: {
                left: (GxGame_1.default.screenWidth - width) / 2,
                top: GxGame_1.default.screenHeight - height,
                width: width,
                height: height
            },
            adIntervals: Math.min(GxGame_1.default.adConfig.bannerUpdateTime, 30)
        });
        this.bannerAd.onError(function (err) {
            console.log("%c[gx_game]normal banner error: " + JSON.stringify(err), "color: red");
        }.bind(this));
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
        this.bannerAd.show();
        if (this.bannerTimer)
            this.bannerTimer.stop();
    }
    /**
     * 隐藏普通banner
     */
    hideNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }
    /**
     * 销毁普通banner
     */
    destroyNormalBanner() {
        if (this.bannerAd && this.bannerAd.destroy) {
            this.bannerAd.destroy();
        }
    }
    initBanner() {
        super.initBanner();
    }
    showBanner() {
        this.hideBanner();
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.banner);
        if (GxGame_1.default.adConfig.bannerUpdateTime > 0) {
            if (this.bannerTimer == null)
                this.bannerTimer = new GxTimer_1.default();
            this.bannerTimer && this.bannerTimer.once(() => {
                this.showBanner();
            }, GxGame_1.default.adConfig.bannerUpdateTime * 1000);
        }
        if (native_data == null || native_data === undefined) {
            this.showNormalBanner();
        }
        else {
            this.bannerNode = new gx_ui_banner_1.default();
            this.bannerNode.show(native_data, () => {
            }, () => {
                this.bannerTimer && this.bannerTimer.clear();
            });
            this.hideNormalBanner();
        }
    }
    hideBanner() {
        super.hideBanner();
        this.hideNormalBanner();
    }
    initVideo() {
        if (!qg.createRewardedVideoAd || GxAdParams_1.AdParams.mz.video == null || GxAdParams_1.AdParams.mz.video.length <= 0)
            return;
        this.destroyVideo();
        this.videoAd = qg.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.mz.video
        });
        this.videoAd.onError(function (err) {
            console.log("%c[gx_game]video error: " + JSON.stringify(err), "color: red");
            if (err.errCode == 1004) {
                this.createToast('暂无视频，请稍后再试');
            }
        }.bind(this));
        this.videoAd.onClose(function (res) {
            console.log(res);
            if (res && res.isEnded || res === undefined) {
                console.log("%c[gx_game]video close succ", "color: #33ccff");
                this.videocallback && this.videocallback(true);
                this.isSecond = false;
            }
            else {
                console.log("%c[gx_game]video closed: " + (this.isSecond ? 'second' : 'first'), "color: blue");
                if (!GxGame_1.default.isShenHe && !this.isSecond) {
                    this.isSecond = true;
                    this.showVideo(this.videocallback);
                }
                else {
                    this.isSecond = false;
                    this.videocallback && this.videocallback(false);
                }
            }
            if (this.videoAd.load) {
                this.videoAd.load();
            }
        }.bind(this));
        this.videoAd.onLoad(function (res) {
            console.log("%c[gx_game]video onLoad: " + JSON.stringify(res), "color: #33ccff");
        });
        if (this.videoAd.load) {
            this.videoAd.load();
        }
    }
    showVideo(complete) {
        if (this.videoAd == null) {
            this.initVideo();
        }
        if (this.videoAd == null) {
            complete && complete(true);
            return;
        }
        this.videocallback = complete;
        if (this.videoAd.load) {
            this.videoAd.load();
        }
        setTimeout(() => {
            this.videoAd.show();
        }, 500);
    }
    destroyVideo() {
        if (this.videoAd) {
            this.videoAd.offLoad();
            this.videoAd.offError();
            this.videoAd.offClose();
            if (this.videoAd.destroy) {
                this.videoAd.destroy();
            }
        }
        this.videoAd = null;
    }
    /**普通插屏 */
    showInterstitial(on_show, on_hide) {
        //@ts-ignore
        if (!qg.createInterstitialAd || GxAdParams_1.AdParams.mz.inter == null || GxAdParams_1.AdParams.mz.inter.length <= 0)
            return on_hide && on_hide();
        ;
        // if (GxUtils.randomInt(1, 100) > GxGame.adInfo.showInteNormalRto) return on_hide && on_hide();
        this.destroyNormalInter();
        //@ts-ignore
        this.interAd = qg.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.mz.inter
        });
        this.interAd.onError(function (err) {
            console.log("show inter err" + JSON.stringify(err));
        }.bind(this));
        this.interAd.onClose(function () {
            console.log('inter closed');
            on_hide && on_hide();
        }.bind(this));
        this.interAd.onLoad(function (res) {
            console.log('inter onLoad', res);
            this.hideBanner();
            on_show && on_show();
        }.bind(this));
        if (this.interAd.load) {
            this.interAd.load();
        }
        setTimeout(function () {
            this.interAd.show();
            this.interShowTime = this.get_time();
        }.bind(this), 500);
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.videoAd.offLoad();
            this.videoAd.offError();
            if (this.interAd.destroy) {
                this.interAd.destroy();
            }
        }
        this.interAd = null;
    }
    create_ad(ad_type) {
        return new Promise((resolve, reject) => {
            let posId = "";
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                posId = GxAdParams_1.AdParams.oppo.native_banner;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.oppo.native1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.oppo.native2;
            }
            if (posId == '' || posId === undefined || posId == null || this.is_limit_native_length(ad_type) || this.platformVersion() < 1051)
                return resolve(null);
            console.log(ad_type, 'posId = ', posId);
            if (posId === undefined || posId == null || this.is_limit_native_length(ad_type) || !qg.createNativeAd)
                return resolve(null);
            setTimeout(() => {
                resolve(null);
            }, 1000);
            let nativeAd = qg.createNativeAd({
                adUnitId: posId
            });
            function on_load(res) {
                console.log("%c[gx_game]native data load:", "color: #33ccff");
                if (res && res.adList) {
                    let data = res.adList.pop();
                    data.ad = nativeAd;
                    data.type = ad_type;
                    this.add_native_data(data);
                    console.log("%c[gx_game]native data load succ:" + JSON.stringify(data), "color: #33ccff");
                    nativeAd.offLoad(on_load);
                }
            }
            nativeAd.onLoad(on_load.bind(this));
            function on_error(err) {
                console.log("%c[gx_game]native data error: " + JSON.stringify(err), "color: red");
                nativeAd.offError(on_error);
            }
            nativeAd.onError(on_error.bind(this));
            nativeAd.load();
        });
    }
    /**原生广告 */
    initNativeAd() {
        // 拉取间隔1s
        this.create_ad(GxEnum_1.ad_native_type.banner).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.inter1);
        }).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.inter2);
        }).then(() => {
            this.loop_get_native_data();
        });
        /* this.create_ad(ad_native_type.banner).then(()=>{
             return this.create_ad(ad_native_type.native_icon);
         }).then(()=>{
             return this.create_ad(ad_native_type.inner_interstitial);
         }).then(()=>{
             return this.create_ad(ad_native_type.interstitial);
         }).then(()=>{
             this.loop_get_native_data();
         })*/
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        this.hideInterstitialNative();
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
        if (native_data == null || native_data === undefined) {
            this.showBanner();
            on_hide && on_hide();
        }
        else {
            this.innerInter = new gx_ui_inner_interstitial_1.default();
            this.innerInter.show(parent, native_data, on_click, () => {
                this.hideBanner();
                on_show && on_show();
            }, on_hide);
        }
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
    showNativeInterstitial(on_show, on_hide) {
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000)
            return on_hide && on_hide();
        setTimeout(() => {
            this.hideNativeInterstitial();
            let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
            if (native_data == null || native_data === undefined) {
                native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
            }
            if (native_data == null || native_data === undefined) {
                this.showInterstitial(on_show, on_hide);
            }
            else {
                // if (GxUtils.randomInt(1, 100) > GxGame.adInfo.showInterRto) return on_hide && on_hide();
                this.nativeInter = new gx_ui_interstitial_1.default();
                this.nativeInter.show(native_data, () => {
                    this.interShowTime = this.get_time();
                    this.hideBanner();
                    on_show && on_show();
                }, on_hide);
            }
        }, (GxGame_1.default.isShenHe) ? 0 : 1000);
    }
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
    }
    /**
     * 原生ICON
     * @param parent
     */
    showNativeIcon(parent) {
        this.hideNativeIcon();
        // 特殊处理
        /*    let type = ad_native_type.native_icon;
            let posId = GxGame.adInfo.adunit_native[type];
            if (posId == GxGame.adInfo.adunit_native[ad_native_type.inner_interstitial]) {
                type = ad_native_type.inner_interstitial;
            } else if (posId == GxGame.adInfo.adunit_native[ad_native_type.banner]) {
                type = ad_native_type.banner;
            }*/
        let type = GxEnum_1.ad_native_type.native_icon;
        let posId = GxAdParams_1.AdParams.mz.native_icon;
        if (posId == GxAdParams_1.AdParams.mz.native1) {
            type = GxEnum_1.ad_native_type.inter1;
        }
        else if (posId == GxAdParams_1.AdParams.mz.native_banner) {
            type = GxEnum_1.ad_native_type.banner;
        }
        let native_data = this.getLocalNativeData(type);
        if (native_data == null || native_data === undefined) {
            return console.log("%c[gx_game]showNativeIcon 暂无广告数据", "color: #33ccff");
        }
        else {
            this.nativeIcon = new gx_ui_native_icon_1.gx_ui_native_icon();
            this.nativeIcon.show(parent, native_data);
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
     * 展示添加桌面界面
     * @param on_close
     * @param on_succ
     */
    showAddDesktop(on_close, on_succ) {
        if (this.addIconNode && !this.addIconNode.destroyed)
            return;
        this.addIconNode = new gx_ui_add_icon_1.default();
        this.addIconNode.show(on_succ);
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        //@ts-ignore
        if (qg.hasShortcutInstalled) {
            //@ts-ignore
            qg.hasShortcutInstalled({
                success: function (status) {
                    if (status) {
                        has_add && has_add();
                    }
                    else {
                        can_add && can_add();
                    }
                }.bind(this),
                fail: function () {
                    on_fail && on_fail();
                }.bind(this)
            });
        }
        else {
            console.log('不支持添加桌面');
            on_fail && on_fail();
        }
    }
    /**创建桌面图标 */
    addDesktop(on_succe, on_fail) {
        //@ts-ignore
        if (qg.installShortcut) {
            //@ts-ignore
            qg.installShortcut({
                success: function () {
                    setTimeout(function () {
                        this.hasAddDesktop(function () {
                            on_fail && on_fail();
                        }.bind(this), function () {
                            on_succe && on_succe();
                        }.bind(this));
                    }.bind(this), 1000);
                }.bind(this),
                fail: function () {
                    on_fail && on_fail();
                }.bind(this)
            });
        }
        else {
            on_fail && on_fail();
        }
    }
}
exports.default = MZAdapter;
