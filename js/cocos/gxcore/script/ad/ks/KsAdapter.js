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
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
class KsAdapter extends BaseAdapter_1.default {
    static getInstance() {
        if (this.instance == null) {
            this.instance = new KsAdapter();
        }
        return this.instance;
    }
    initAd() {
        this.initVideo();
        this.initRecorder();
    }
    initVideo() {
        if (GxAdParams_1.AdParams.ks.video == null || GxAdParams_1.AdParams.ks.video.length <= 0)
            return;
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = ks.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.ks.video
        });
        console.log(this.videoAd);
        this.videoAd.onError && this.videoAd.onError(err => {
            console.log("[gx_game]video error: " + JSON.stringify(err), "color: red");
        });
        this.videoAd.onClose(res => {
            console.log(res);
            this.recorderResume();
            if (res && res.isEnded || res === undefined) {
                this.videocallback && this.videocallback(true);
            }
            else {
            }
        });
    }
    showVideo(complete, flag = "") {
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
            console.log('视频展示成功');
        }).catch(() => {
            this.createToast('暂无视频，请稍后再试');
        });
    }
    destroyVideo() {
        if (this.videoAd) {
            this.videoAd.destroy();
        }
        this.videoAd = null;
    }
    initRecorder() {
        // @ts-ignore
        this.gameRecorder = ks.getGameRecorder();
        // 设置录屏相关监听
        this.gameRecorder.on('start', () => {
            console.log('录制开始');
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.START;
        });
        // 监听录屏过程中的错误，需根据错误码处理对应逻辑
        this.gameRecorder.on('error', (err) => {
            console.log('录制出错', JSON.stringify(err));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
        });
        // stop 事件的回调函数
        this.gameRecorder.on('stop', res => {
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.STOP;
            this.videoPath = null;
            if (res && res.videoID) {
                this.videoPath = res.videoID;
                console.log(`录屏停止，录制成功。videoID is ${res.videoID}`);
            }
            else {
                /****注意：没有videoID时不可展示分享录屏按钮，审核会过此case****/
                /****测试方法：点击右上角"..."按钮打开设置页面，关闭录屏开关，录屏不会产生videoID****/
                // 没有videoID时，可以通过onError回调获取录制失败的原因
                console.log(`录屏停止，录制失败`);
            }
            this.onRecoderStop && this.onRecoderStop(this.videoPath != null);
        });
        // pause 事件的回调函数
        this.gameRecorder.on('pause', () => {
            console.log('暂停录制');
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.PAUSE;
        });
        // resume 事件的回调函数
        this.gameRecorder.on('resume', () => {
            console.log('继续录制');
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.RESUME;
        });
        // abort 事件的回调函数，表示录制中的游戏画面已经被舍弃
        this.gameRecorder.on('abort', () => {
            console.log('废弃已录制视频');
        });
    }
    recorderPause() {
        if (this.gameRecorder && this.gameRecorderState != BaseAdapter_1.RECORDER_STATE.NO) {
            this.gameRecorder.pause();
        }
    }
    recorderResume() {
        if (this.gameRecorder && this.gameRecorderState != BaseAdapter_1.RECORDER_STATE.NO) {
            this.gameRecorder.resume();
        }
    }
    recorderStart() {
        this.gameRecorder && this.gameRecorder.start();
    }
    recorderStop(on_stop) {
        this.onRecoderStop = on_stop;
        this.gameRecorder && this.gameRecorder.stop();
    }
    shareRecorder(on_succ, on_fail) {
        if (this.gameRecorder == null || this.videoPath == null)
            return;
        this.gameRecorder.publishVideo({
            video: this.videoPath,
            callback: (error) => {
                if (error != null && error != undefined) {
                    console.log("分享录屏失败: " + JSON.stringify(error));
                    on_fail && on_fail();
                    return;
                }
                console.log("分享录屏成功");
                on_succ && on_succ();
            }
        });
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        // @ts-ignore
        ks.getAPKShortcutInstallStatus(result => {
            console.log('hasAddDesktop', JSON.stringify(result));
            if (result.code === 1) {
                if (!result.installed) {
                    can_add && can_add();
                }
                else {
                    has_add && has_add();
                }
            }
            else {
                on_fail && on_fail();
            }
        });
    }
    /**创建桌面图标 */
    addDesktop(on_succ, on_fail) {
        // @ts-ignore
        ks.saveAPKShortcut(result => {
            console.log('addDesktop', JSON.stringify(result));
            if (result.code === 1) {
                on_succ && on_succ();
            }
            else {
                on_fail && on_fail();
            }
        });
    }
}
exports.default = KsAdapter;
