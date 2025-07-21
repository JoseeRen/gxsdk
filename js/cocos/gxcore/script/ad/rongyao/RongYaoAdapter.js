"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
class RongYaoAdapter extends BaseAdapter_1.default {
    static getInstance() {
        if (this.instance == null) {
            this.instance = new RongYaoAdapter();
        }
        return this.instance;
    }
    initAd() {
    }
    showBanner() {
        if (GxAdParams_1.AdParams.rongyao.banner == null || GxAdParams_1.AdParams.rongyao.banner == "")
            return;
        if (!!this.bannerAd) {
            console.warn("创建后在创建");
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
        console.log(GxAdParams_1.AdParams.rongyao.banner);
        // let style
        // if (qg.getSystemInfoSync().screenHeight > qg.getSystemInfoSync().screenWidth) {
        //      style = {
        //         left: qg.getSystemInfoSync().screenWidth / 4,
        //         top: qg.getSystemInfoSync().screenHeight,
        //         // right: qg.getSystemInfo().screenHeight,
        //         // width: qg.getSystemInfo().screenWidth / 2,
        //     }
        // } else {
        //      style = {
        //         left: qg.getSystemInfoSync().screenWidth / 2,
        //         top: qg.getSystemInfoSync().screenHeight,
        //         // right: qg.getSystemInfo().screenHeight,
        //         // width: qg.getSystemInfo().screenWidth / 2,
        //     }
        // }
        this.bannerAd = window["qg"].createBannerAd({
            adUnitId: GxAdParams_1.AdParams.rongyao.banner
            // style: style
        });
        console.log("bannerAd:", this.bannerAd);
        this.bannerAd.load().then(() => {
            console.log("广告加载成功");
        });
        this.bannerAd.show().then(() => {
            console.log("广告展示成功");
        });
        this.bannerAd.onError((res) => {
            console.log("banner load err", res);
        });
    }
    hideBanner() {
        if (this.bannerAd != null) {
            this.bannerAd.hide();
            this.bannerAd.destroy();
        }
    }
    showVideo(complete, flag = "") {
        if (GxAdParams_1.AdParams.rongyao.video == null || GxAdParams_1.AdParams.rongyao.inter == "") {
            console.log("rongyao video adUnitId null");
        }
        if (this.videoAd != null) {
            this.videoAd.destroy();
        }
        else {
        }
        this.videoAd = window["qg"].createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.rongyao.video,
            allowRecommend: false
        });
        this.videoAd.load();
        this.videoAd.show().then(() => {
        }).catch(() => {
            this.createToast("暂无视频，请稍后再试");
        });
        this.videoAd.onLoad((res) => {
            if (res) {
                console.log("onLoad video res :", JSON.stringify(res));
            }
        });
        this.videoAd.onShow((res) => {
            if (res) {
                console.log("onShow video res :", JSON.stringify(res));
            }
        });
        // this.videoAd.onReward((res) => {
        //     console.log("onReward 关闭视频:", res)
        //     if (res === "success") {
        //         complete && complete(true, 1)
        //     } else {
        //         complete && complete(false, 0)
        //     }
        // })
        this.videoAd.onClose((res) => {
            console.log("onClose", res);
            if (res && res.isEnded) {
                complete && complete(true, 1);
            }
            else {
                complete && complete(false, 0);
            }
        });
        // this.videoAd.onClose((res) => {
        //     console.log("onClose", res)
        //     this.videoAd.offClose()
        // });
        this.videoAd.onError((res) => {
            this.createToast("暂无视频，请稍后再试");
            console.log("video res ", JSON.stringify(res));
            complete && complete(false, 0);
        });
    }
    /**
     * 插屏
     * @param on_show 成功展示回调
     * @param on_hide 隐藏回调
     * @param on_fail
     * @returns
     */
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (GxAdParams_1.AdParams.rongyao.inter == null || GxAdParams_1.AdParams.rongyao.inter == "") {
            console.log("rongyao chaping adUnitId null");
        }
        if (this.nativeInter != null) {
            this.nativeInter.destroy();
        }
        this.nativeInter = window["qg"].createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.rongyao.inter
        });
        this.nativeInter.load();
        this.nativeInter.onLoad();
        this.nativeInter.show();
        this.nativeInter.onError((res) => {
            console.log("chaping err res", JSON.stringify(res));
        });
        this.nativeInter.onShow(() => {
            console.log("chaping onshow true");
        });
        this.nativeInter.onClose(() => {
            console.log("chaping close");
        });
    }
}
exports.default = RongYaoAdapter;
