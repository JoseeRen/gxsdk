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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gx_ui_share_rcorder_1 = __importDefault(require("../../ui/gx_ui_share_rcorder"));
const gx_ui_watch_video_1 = __importDefault(require("../../ui/gx_ui_watch_video"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
class BaiDuAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.recorderTime = 0;
        this.onRecoderStop = null;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new BaiDuAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        this.isGameCd = GxGame_1.default.adConfig.bannerDelay > 0;
        super.initAd();
        this._gameCd();
        this.initBanner();
        this.initNormalBanner();
        this.initVideo();
        this.initRecorder();
    }
    _gameCd() {
        setTimeout(() => {
            this.isGameCd = false;
            if (this.isNeedShowBanner) {
                this.showBanner();
            }
        }, GxGame_1.default.adConfig.bannerDelay * 1000);
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
        if (GxAdParams_1.AdParams.bd.banner.length <= 0)
            return;
        this.destroyNormalBanner();
        // @ts-ignore
        this.bannerAd = swan.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.bd.banner,
            appSid: GxAdParams_1.AdParams.bd.appSid,
            style: {
                top: GxGame_1.default.screenHeight,
                left: 0,
                width: GxGame_1.default.screenWidth
            }
        });
        this.bannerAd.onResize(res => {
            console.log(' banner 广告位宽度变化');
            this.bannerAd.style.top = GxGame_1.default.screenHeight - res.heiht;
            this.bannerAd.style.left = (GxGame_1.default.screenWidth - res.width) / 2;
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
        this.bannerAd.show().then(() => {
            console.log("%c[gx_game]normal banner show success", "color: #33ccff");
        });
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
        if (GxAdParams_1.AdParams.bd.video == null || GxAdParams_1.AdParams.bd.video.length <= 0)
            return;
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = swan.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.bd.video,
            appSid: GxAdParams_1.AdParams.bd.appSid
        });
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
            this.recorderResume();
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
        this.videoAd.show().then(() => {
            this.recorderPause();
        }).catch(() => {
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
    login(on_succ, on_fail) {
        if (this.platformVersion() >= 1040) {
            // @ts-ignore
            swan.login({
                success: res => {
                    on_succ && on_succ(res);
                },
                fail: (err) => {
                    on_fail && on_fail(err);
                }
            });
        }
    }
    initRecorder() {
        // @ts-ignore
        this.gameRecorder = swan.getVideoRecorderManager();
        // 设置录屏相关监听
        this.gameRecorder.onStart(res => {
            console.log('录制开始', JSON.stringify(res));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.START;
            this.recorderTime = this.get_time();
            this.videoPath = null;
        });
        // 监听录屏过程中的错误，需根据错误码处理对应逻辑
        this.gameRecorder.onError(err => {
            console.log('录制出错', JSON.stringify(err));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
        });
        // stop 事件的回调函数
        this.gameRecorder.onStop(res => {
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.STOP;
            this.videoPath = null;
            if (res && res.videoPath) {
                if (this.get_time() - this.recorderTime >= 15 * 1000) {
                    this.videoPath = res.videoPath;
                    console.log(`录屏停止，录制成功。videoID is ${res.videoPath}`);
                }
                else {
                    console.log(`录屏停止，录制失败。录屏时间<15s`);
                }
            }
            else {
                console.log(`录屏停止，录制失败`);
            }
            this.onRecoderStop && this.onRecoderStop(this.videoPath != null);
        });
        // pause 事件的回调函数
        this.gameRecorder.onPause(() => {
            console.log('暂停录制');
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.PAUSE;
        });
        // resume 事件的回调函数
        this.gameRecorder.onResume(() => {
            console.log('继续录制');
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.RESUME;
        });
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
    recorderStart() {
        if (this.gameRecorder && this.gameRecorderState == BaseAdapter_1.RECORDER_STATE.NO) {
            this.gameRecorder && this.gameRecorder.start({
                duration: 120
            });
        }
    }
    recorderStop(on_stop) {
        if (this.gameRecorder && this.gameRecorderState != BaseAdapter_1.RECORDER_STATE.NO) {
            this.onRecoderStop = on_stop;
            this.gameRecorder && this.gameRecorder.stop();
        }
    }
    shareRecorder(on_succ, on_fail) {
        if (this.gameRecorder == null || this.videoPath == null)
            return on_fail && on_fail();
        // @ts-ignore
        swan.shareVideo({
            videoPath: this.videoPath,
            success: () => {
                console.log("分享视频成功");
                on_succ && on_succ();
            },
            fail: res => {
                console.log("分享视频失败", res);
                on_fail && on_fail();
            }
        });
    }
    showRecorderLayer(on_succ, on_fail) {
        if (!this.shareRcorderLayer || this.shareRcorderLayer.destroyed) {
            this.shareRcorderLayer = new gx_ui_share_rcorder_1.default();
            this.shareRcorderLayer.show(on_succ, on_fail);
        }
    }
}
exports.default = BaiDuAdapter;
