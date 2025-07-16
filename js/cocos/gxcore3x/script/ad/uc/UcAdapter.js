"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
class UcAdapter extends BaseAdapter_1.default {
    static getInstance() {
        if (this.instance == null) {
            this.instance = new UcAdapter();
        }
        return this.instance;
    }
    initAd() {
    }
    ac() {
        let value = GxGame_1.default.gGN("ac", 20);
        setTimeout(() => {
            if (GxGame_1.default.gGB("ac")) {
                this.showNativeInterstitial(() => {
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
    showBanner() {
        console.log('bannerAd 广告加载 start ');
        let res = uc.getSystemInfoSync();
        if (typeof res === 'string') {
            try {
                res = JSON.parse(res);
            }
            catch (e) { }
        }
        let deviceWidth = res.screenWidth > res.screenHeight ? res.screenHeight : res.screenWidth;
        let width = deviceWidth / 2;
        let height = (width * 194) / 345;
        let bannerAd = uc.createBannerAd({
            style: {
                width: width,
                height: height,
                gravity: 7,
            },
        });
        bannerAd.onError(err => {
            console.log('bannerAd 广告加载出错', err);
        });
        bannerAd.onLoad(() => {
            console.log('bannerAd 广告加载成功');
        });
        bannerAd.show();
    }
    showVideo(complete, flag = "") {
        const rewardedVideoAd = uc.createRewardVideoAd();
        rewardedVideoAd
            .show()
            .then()
            .catch(err => console.log(err));
        rewardedVideoAd.onLoad(() => {
            console.log('激励视频-广告加载成功');
        });
        rewardedVideoAd.onError(err => {
            console.log('激励视频-广告加载失败', err);
        });
        rewardedVideoAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            if (res && res.isEnded) {
                complete && complete(true);
                console.log('正常播放结束，可以下发游戏奖励 res: ', res);
            }
            else {
                console.log('播放中途退出，不下发游戏奖励 res : ', res);
            }
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
        const interstitialAd = uc.createInterstitialAd();
        interstitialAd
            .show()
            .then()
            .catch(err => console.log(err));
        interstitialAd.onLoad(() => {
            console.log('插屏-广告加载成功');
        });
        interstitialAd.onError(err => {
            console.log('插屏-广告加载失败', err);
        });
        interstitialAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            console.log('插屏-关闭');
        });
    }
}
exports.default = UcAdapter;
