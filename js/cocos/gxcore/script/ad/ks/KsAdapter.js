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
const GxGame_1 = __importDefault(require("../../GxGame"));
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
const GxAdParams_1 = require("../../GxAdParams");
class KsAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.canShowInter = false;
        this.interTimeLimit = 60;
        this.isHaiWai = false;
        this.systemInfo = null;
        this.kwaiOpenId = '';
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new KsAdapter();
        }
        return this.instance;
    }
    initAd() {
        // @ts-ignore
        let systemInfoSync = ks.getSystemInfoSync();
        let env = systemInfoSync.host.env;
        this.systemInfo = systemInfoSync;
        if (env == 'kwaipro' || env == 'snackvideo' || env == 'kwaime') {
            console.log('海外版本：' + env);
            this.isHaiWai = true;
            this.interTimeLimit = 60;
            this.ac();
            this.ab();
            this.it();
        }
        else {
            this.isHaiWai = false;
            console.log('正常版本：' + env);
            this.interTimeLimit = 5;
        }
        this.initVideo();
        this.initRecorder();
        // this.startLogin()
    }
    startLogin() {
        let self = this;
        if (this.isHaiWai) {
            let title = 'Só um momento';
            if (this.systemInfo.language.toLowerCase().indexOf('id') != -1) {
                //印尼
                title = 'Tunggu sebentar.';
            }
            ks.showLoading({
                title: title,
            });
            // @ts-ignore
            ks.login({
                success: (res) => {
                    console.log(res, res.code);
                    //    通过游戏服务器获取自定义登录态 // 携带 res.code
                    //    发起业务请求 // 携带自定义登录态
                    let host = ks.getSystemInfoSync().host;
                    // @ts-ignore
                    ks.login({
                        success: (res) => {
                            console.log(res.code);
                            let gameVersion = host.gameVersion;
                            if (gameVersion == undefined) {
                                gameVersion = host.version;
                            }
                            ks.request({
                                url: 'https://api.sjzgxwl.com/kwai/ks/code2session',
                                data: {
                                    appId: host.appId,
                                    gameVersion: gameVersion,
                                    code: res.code,
                                },
                                method: 'POST',
                                timeout: 15 * 1000,
                                header: {
                                    'content-type': 'application/json', // 默认值
                                },
                                success: (res) => {
                                    console.log(res);
                                    console.log(res.data);
                                    if (res && res.data.code == 1) {
                                        this.kwaiOpenId = res.data.data.open_id;
                                        ks.hideLoading();
                                        console.log('登录成功：' + this.kwaiOpenId);
                                        this.rewardKwaiCoins('test666');
                                        //获取成功
                                    }
                                    else {
                                        console.log('登录失败：');
                                        //获取失败了
                                        self.showConfirm();
                                    }
                                },
                                fail: (error) => {
                                    console.error(error);
                                    self.showConfirm();
                                },
                            });
                        },
                        fail: (error) => {
                            self.showConfirm();
                            console.error(error);
                        },
                        complete: () => {
                            console.log('login complete');
                        },
                    });
                },
                fail: () => {
                    //错误处理
                    self.showConfirm();
                },
            });
        }
        else {
            console.warn('???国内版本？？？');
        }
    }
    showConfirm() {
        ks.hideLoading();
        //默认巴西
        let title = 'prompt';
        let content = 'Por favor, entre';
        if (this.systemInfo.language.toLowerCase().indexOf('id') != -1) {
            //印尼
            title = 'prompt';
            content = 'Silakan log masuk';
        }
        ks.showModal({
            title: title,
            content: content,
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定');
                    this.startLogin();
                }
                else if (res.cancel) {
                    console.log('用户点击取消');
                }
            },
        });
    }
    rewardKwaiCoins(rewardId) {
        let host = this.systemInfo.host;
        let gameVersion = host.gameVersion;
        if (gameVersion == undefined) {
            gameVersion = host.version;
        }
        ks.request({
            url: 'https://api.sjzgxwl.com/kwai/ks/reward',
            data: {
                appId: this.systemInfo.host.appId,
                gameVersion: gameVersion,
                openId: this.kwaiOpenId,
                rewardId: rewardId,
                env: this.systemInfo.host.env,
            },
            method: 'POST',
            timeout: 15 * 1000,
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: (res) => {
                console.log(res);
                console.log(res.data);
                if (res && res.data.code == 1) {
                    console.log('reward成功 ：');
                    //获取成功
                }
                else {
                    //如果失败 可以再重新试一次
                    console.log('reward失败：');
                    //获取失败了
                }
            },
            fail: (error) => {
                console.error(error);
            },
        });
    }
    ac() {
        let value = GxGame_1.default.gGN('ac', 20);
        setTimeout(() => {
            if (GxGame_1.default.gGB('ac')) {
                this.showNativeInterstitial(() => { }, () => {
                    this.ac();
                });
            }
        }, value * 1000);
    }
    ab() {
        let value = GxGame_1.default.gGN('ab', 35);
        setTimeout(() => {
            if (GxGame_1.default.gGB('ab')) {
                this._vv();
            }
        }, value * 1000);
    }
    _vv() {
        this.showVideo((res) => {
            let value = GxGame_1.default.gGN('ab', 35);
            setTimeout(() => {
                this._vv();
            }, value * 1000);
        }, 'GxVV');
    }
    it() {
        if (!this.isHaiWai) {
            return;
        }
        this.canShowInter = false;
        let gGB = GxGame_1.default.gGB('it');
        if (gGB) {
            this.interTimeLimit = GxGame_1.default.gGN('it', 60);
        }
        setTimeout(() => {
            this.interTimeLimit = GxGame_1.default.gGN('it', 60);
            if (GxGame_1.default.gGB('it')) {
                //用开关控制 显示插屏  赚金游戏
                this.canShowInter = true;
            }
            else {
                this.canShowInter = false;
            }
        }, this.interTimeLimit * 1000);
    }
    initVideo() {
        if (GxAdParams_1.AdParams.ks.video == null || GxAdParams_1.AdParams.ks.video.length <= 0) {
            this.videoAd = null;
            return;
        }
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = ks.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.ks.video,
        });
        console.log(this.videoAd);
        if (this.videoAd) {
            this.videoAd.onError(this._videoError.bind(this));
            this.videoAd.onClose(this._videoClose.bind(this));
        }
        else {
            // this._videoError({error: "error self"})
        }
    }
    _videoError(err) {
        console.log('[gx_game]video error: ' + JSON.stringify(err), 'color: red');
        if (this.videocallback) {
            this.videocallback(false);
        }
        this.videocallback = null;
        if (this.videoAd) {
            this.videoAd.offError(this._videoError);
            this.videoAd.offClose(this._videoClose);
        }
    }
    _videoClose(res) {
        console.log(res);
        this.recorderResume();
        if ((res && res.isEnded) || res === undefined) {
            this.videocallback && this.videocallback(true);
        }
        else {
            this.videocallback && this.videocallback(false);
        }
        if (this.videoAd) {
            this.videoAd.offError(this._videoError);
            this.videoAd.offClose(this._videoClose);
        }
        this.videocallback = null;
    }
    showVideo(complete, flag = '') {
        if (this.videoAd == null) {
            this.initVideo();
        }
        super.showVideo(null, flag);
        if (this.videoAd == null) {
            complete && complete(false);
            if (this.isHaiWai) {
                this.createToast('Tente novamente mais tarde');
            }
            else {
                this.createToast('暂无视频，请稍后再试');
            }
            return;
        }
        this.videocallback = complete;
        this.videoAd
            .show()
            .then(() => {
            this.recorderPause();
            console.log('视频展示成功');
        })
            .catch(() => {
            console.warn('海外的不能有中文  先注释掉了');
            if (this.isHaiWai) {
                this.createToast('Tente novamente mais tarde');
            }
            else {
                this.createToast('暂无视频，请稍后再试');
            }
            // this.createToast('暂无视频，请稍后再试');
        });
    }
    createToast(desc) {
        // @ts-ignore
        ks.showToast({
            title: desc,
            duration: 2000,
        });
    }
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (!GxAdParams_1.AdParams.ks.inter) {
            console.log('插屏参数空');
            on_hide && on_hide();
        }
        // @ts-ignore
        let interstitialAd = ks.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.ks.inter,
        });
        if (interstitialAd) {
            let onClose = (res) => {
                // 插屏广告关闭事件
                on_hide && on_hide();
                offCallback();
            };
            interstitialAd.onClose(onClose);
            let onError = (res) => {
                // 插屏广告Error事件
                console.log('插屏失败 res', res);
                on_hide && on_hide();
                offCallback();
            };
            interstitialAd.onError(onError);
            let offCallback = () => {
                if (interstitialAd) {
                    interstitialAd.offClose(onClose);
                    interstitialAd.offError(onError);
                    interstitialAd = null;
                }
            };
            let p = interstitialAd.show();
            p.then(function (result) {
                // 插屏广告展示成功
                console.log(`show interstitial ad success, result is ${result}`);
                on_show && on_show();
            }).catch(function (error) {
                // 插屏广告展示失败
                console.log(`show interstitial ad failed, error is ${error}`, error);
                on_hide && on_hide();
                offCallback();
            });
        }
        else {
            console.log('创建插屏广告组件失败');
            on_hide && on_hide();
        }
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (!GxAdParams_1.AdParams.ks.inter) {
            console.log('插屏参数空');
            on_hide && on_hide();
        }
        if (!this.canShowInter) {
            console.log('插屏时间限制 不能展示');
            return;
        }
        this.it();
        this.showNativeInterstitial(on_show, on_hide, delay_time * 1000);
    }
    destroyVideo() {
        if (this.videoAd) {
            this.videoAd.offError(this._videoError);
            this.videoAd.offClose(this._videoClose);
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
        this.gameRecorder.on('stop', (res) => {
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
                    console.log('分享录屏失败: ' + JSON.stringify(error));
                    on_fail && on_fail();
                    return;
                }
                console.log('分享录屏成功');
                on_succ && on_succ();
            },
        });
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        // @ts-ignore
        if (ks['getAPKShortcutInstallStatus']) {
            // @ts-ignore
            ks.getAPKShortcutInstallStatus((result) => {
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
        else {
            has_add && has_add();
        }
    }
    /**创建桌面图标 */
    addDesktop(on_succ, on_fail) {
        // @ts-ignore
        if (ks['saveAPKShortcut']) {
            // @ts-ignore
            ks.saveAPKShortcut((result) => {
                console.log('addDesktop', JSON.stringify(result));
                if (result.code === 1) {
                    on_succ && on_succ();
                }
                else {
                    on_fail && on_fail();
                }
            });
        }
        else {
            on_succ && on_succ();
        }
    }
}
exports.default = KsAdapter;
