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
Object.defineProperty(exports, "__esModule", { value: true });
const GxAdParams_1 = require("../../GxAdParams");
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
class ZFBAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this._systemInfo = null;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new ZFBAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        // @ts-ignore
        this._systemInfo = my.getSystemInfoSync();
        super.initAd();
        this.initBanner();
        this.initVideo();
    }
    initBanner() {
        if (GxAdParams_1.AdParams.zfb.banner.length == 0)
            return;
        if (this.bannerAd)
            this.destroyBanner();
        // console.log(JSON.stringify(this._systemInfo))
        // console.log("windowHeight" + this._systemInfo.windowHeight)
        // console.log("windowWidth" + this._systemInfo.windowWidth)
        // console.log("screenWidth" + this._systemInfo.screenWidth)
        // console.log("screenHeight" + this._systemInfo.screenHeight)
        // console.log("titleBarHeight" + this._systemInfo.titleBarHeight)
        // console.log("statusBarHeight" + this._systemInfo.statusBarHeight)
        let bannerWidth = this._systemInfo.windowWidth * 0.8;
        if (bannerWidth > 320) {
            bannerWidth = 320;
        }
        let bannerHeight = bannerWidth * 0.26;
        // bannerHeight += 15;
        let bannerLeft = (this._systemInfo.windowWidth - bannerWidth) / 2;
        let bannerTop = this._systemInfo.windowHeight - bannerHeight;
        //  bannerLeft=0;
        // console.log("bannerLeft:" + bannerLeft)
        // console.log("bannerTop:" + bannerTop)
        // console.log("bannerWidth:" + bannerWidth)
        // @ts-ignore
        this.bannerAd = my.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.zfb.banner,
            style: {
                left: bannerLeft,
                top: bannerTop,
                width: bannerWidth
            }
        });
        this.bannerAd.onLoad(() => {
            console.log(" banner 加载完成");
            console.log("能获得什么：" + JSON.stringify(this.bannerAd));
        });
        this.bannerAd.onError((err) => {
            console.log(" banner 广告错误" + JSON.stringify(err));
        });
        console.log(JSON.stringify(this.bannerAd));
    }
    showBanner() {
        if (this.bannerAd == null) {
            this.initBanner();
        }
        if (this.bannerAd == null)
            return;
        this.bannerAd
            .show()
            .then(() => {
        })
            .catch((res) => {
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
        if (GxAdParams_1.AdParams.zfb.video == null || GxAdParams_1.AdParams.zfb.video.length <= 0) {
            console.warn("激励视频参数空");
            return;
        }
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = my.createRewardedAd({
            adUnitId: GxAdParams_1.AdParams.zfb.video
        });
        this.videoAd.onLoad((res) => {
            console.log("激励视频加载", res);
        });
        this.videoAd.onError((err) => {
            console.log("激励视频-失败", err);
        });
        this.videoAd.onClose((res) => {
            console.log("激励视频关闭");
            this.recorderResume();
            if (res && res.isEnded) {
                console.log("激励视频完成");
                this.videocallback && this.videocallback(true, 1);
            }
            else {
                this.videocallback && this.videocallback(false, 0);
            }
        });
    }
    showVideo(complete, flag = "") {
        super.showVideo(null, flag);
        if (this.videoAd == null)
            this.initVideo();
        if (this.videoAd == null) {
            complete && complete(false, 0);
            return;
        }
        this.videocallback = complete;
        this.videoAd
            .show()
            .then(() => {
            this.recorderPause();
        })
            .catch((err) => {
            this.videoAd
                .load()
                .then((res) => {
                return this.videoAd.show();
            })
                .then(() => {
                this.recorderPause();
            })
                .catch(() => {
                this.videoAd.load();
                console.log("暂无广告");
                this.videocallback && this.videocallback(false, 0);
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
        if (!my.createInterstitialAd ||
            GxAdParams_1.AdParams.zfb.inter == null ||
            GxAdParams_1.AdParams.zfb.inter.length <= 0)
            return on_close && on_close();
        this.destroyNormalInter();
        // @ts-ignore
        this.interAd = my.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.zfb.inter
        });
        this.interAd &&
            this.interAd.onLoad(() => {
                console.log("插屏广告加载");
                this.interAd.show().then(() => {
                    this.recorderPause();
                    on_show && on_show();
                });
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
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.interAd.destroy();
        }
        this.interAd = null;
    }
    showNativeInterstitial(on_show, on_close) {
        this.showInterstitial(on_show, on_close);
    }
    showOtherNativeInterstitial(on_show, on_close) {
        this.showInterstitial(on_show, on_close);
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
}
exports.default = ZFBAdapter;
