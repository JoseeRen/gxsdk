"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gx_ui_watch_video_1 = __importDefault(require("../../ui/gx_ui_watch_video"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
class UCAdapter extends BaseAdapter_1.default {
    static getInstance() {
        if (this.instance == null) {
            this.instance = new UCAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        this.isGameCd = GxGame_1.default.adConfig.adCdTime > 0;
        super.initAd();
        this._gameCd();
        this.initBanner();
        this.initNormalBanner();
        this.initVideo();
    }
    _gameCd() {
        setTimeout(() => {
            this.isGameCd = false;
            if (this.isNeedShowBanner) {
                this.showBanner();
            }
        }, GxGame_1.default.adConfig.adCdTime * 1000);
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
        if (GxAdParams_1.AdParams.uc.banner.length <= 0)
            return;
        this.destroyNormalBanner();
        //@ts-ignore
        this.bannerAd = uc.createBannerAd({
            style: {
                gravity: 7,
                // 3：左边垂直居中 4：居中 5：右边垂直居中
                // 6：左下 7：底部居中 8：右下 （默认为0）
                width: GxGame_1.default.screenWidth,
                height: 0, //如果不设置高度，会按比例适配
            }
        });
        this.bannerAd.onError(err => {
            console.error('[gx_game]normal banner error: ', JSON.stringify(err));
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
        this.bannerAd.show();
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
        if (this.bannerAd) {
            this.bannerAd.destroy();
        }
        this.bannerAd = null;
    }
    initBanner() {
    }
    showBanner() {
        if (this.isGameCd) {
            this.isNeedShowBanner = true;
            return console.log("%c[gx_game]showBanner 广告CD中", "color: #33ccff");
        }
        this.hideBanner();
        this.showNormalBanner();
    }
    hideBanner() {
        super.hideBanner();
        this.isNeedShowBanner = false;
        this.hideNormalBanner();
    }
    initVideo() {
        if (GxAdParams_1.AdParams.uc.video == null || GxAdParams_1.AdParams.uc.video.length <= 0)
            return;
        this.destroyVideo();
        //@ts-ignore
        this.videoAd = uc.createRewardVideoAd();
        this.videoAd.onLoad(function () {
            console.log("%c[gx_game]video load succ", "color: #33ccff");
        });
        this.videoAd.onError(function (err) {
            console.log("%c[gx_game]video error: " + JSON.stringify(err), "color: red");
        });
        this.videoAd.onClose(res => {
            if (res && res.isEnded) {
                this.videocallback && this.videocallback(true);
            }
            else {
                (new gx_ui_watch_video_1.default()).show(() => {
                    this.showVideo(this.videocallback);
                });
            }
            this.videoAd.load();
        });
        this.videoAd.load();
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
        this.videoAd.show().then().catch(() => {
            this.createToast('暂无视频，请稍后再试');
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
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        if (this.isGameCd) {
            this.showBanner();
            on_hide && on_hide();
            return console.log("%c[gx_game]广告CD中", "color: #33ccff");
        }
        this.showBanner();
        on_hide && on_hide();
    }
    /**普通插屏 */
    showInterstitial(on_show, on_close) {
        /*
                if (GxUtils.randomInt(1, 100) > GxGame.adInfo.showInteNormalRto) return on_close && on_close();
        */
        this.destroyNormalInter();
        //@ts-ignore
        this.interAd = uc.createInterstitialAd();
        this.interAd.onLoad(() => {
            console.log("插屏广告加载");
            on_show && on_show();
        });
        this.interAd.onError(err => {
            console.log("show inter err" + JSON.stringify(err));
        });
        this.interAd.onClose(() => {
            on_close && on_close();
        });
        this.interAd.load().then(res => {
            this.interAd.show().then(() => {
                this.hideBanner();
                this.interShowTime = this.get_time();
            });
        });
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.interAd.offLoad();
            this.interAd.offError();
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
    showNativeInterstitial(on_show, on_hide) {
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000)
            return on_hide && on_hide();
        setTimeout(() => {
            this.hideNativeInterstitial();
            this.showInterstitial(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : 1000);
    }
    login(on_succ, on_fail) {
        if (this.platformVersion() >= 1040) {
            //@ts-ignore
            uc.login({
                success: res => {
                    on_succ && on_succ(res);
                },
                fail: (err) => {
                    on_fail && on_fail(err);
                }
            });
        }
    }
}
exports.default = UCAdapter;
