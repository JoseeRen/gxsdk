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
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importStar(require("../base/BaseAdapter"));
const GxEnum_1 = require("../../core/GxEnum");
const GxAdParams_1 = require("../../GxAdParams");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
class TTAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.shareRcorderLayer = null;
        this.recorderTime = 0;
        this.gameTime = 0;
        this.videoReward = 0;
        this.reported = false;
        this.checkInterval = 30; //10秒检查一次
        this.openId = '';
        this.ecpmObj = {
            targetEcpm: 300,
            gameTime: 10,
            targetVideo: 2, //目标激励视频次数
        };
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new TTAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        super.initAd();
        this.initBanner();
        this.initVideo();
        this.initRecorder();
        this.initAdMonitor();
    }
    initAdMonitor() {
        console.log('获取到的clickId:' + this.getClickId());
        this.getOpenId(() => {
            this.getAdConfig();
            this.ttReport();
        });
        //@ts-ignore
        if (tt.getEnvInfoSync) {
            //@ts-ignore
            GxAdParams_1.AdParams.tt.appId = tt.getEnvInfoSync().microapp.appId;
        }
        console.log('当前appid:' + GxAdParams_1.AdParams.tt.appId);
        //10秒检查 一次
        setInterval(() => {
            this.checkAdTarget();
        }, this.checkInterval * 1000);
    }
    getClickId() {
        let launchOptionsSync = tt.getLaunchOptionsSync();
        let query = launchOptionsSync.query;
        let clickId = query.clickid;
        if (!!clickId) {
        }
        else {
            clickId = DataStorage_1.default.getItem('__clickid__');
        }
        return clickId;
    }
    rewardAdEnd() {
        this.videoReward++;
        this.checkAdTarget();
    }
    getAdConfig() {
        let self = this;
        self.requestGet(`https://api.sjzgxwl.com/tt/getConfig?appId=${GxAdParams_1.AdParams.tt.appId}&openId=${self.openId}&name=${GxAdParams_1.AdParams.tt.ecpmConfigName}`, (res) => {
            self.logi(res.data);
            if (res.data.code == 1) {
                self.logi('获取ecpm配置成功：');
                self.ecpmObj = JSON.parse(res.data.data.content);
            }
            else {
                self.logw('获取ecpm配置失败！' + res.data['msg']);
                setTimeout(() => {
                    self.getAdConfig();
                }, 2000);
            }
        }, (res) => {
            self.logw('获取ecpm配置失败！' + res['errMsg']);
            setTimeout(() => {
                self.getAdConfig();
            }, 2000);
        });
    }
    checkAdTarget() {
        this.gameTime += this.checkInterval;
        //玩游戏大于等于10分钟
        if ((this.gameTime >= this.ecpmObj.gameTime * 60 &&
            this.videoReward >= this.ecpmObj.targetVideo) ||
            window['rywDEBUG']) {
            if (DataStorage_1.default.getItem('__ttTaq__') == 'true') {
                console.log('本地已经有上报记录了');
                return;
            }
            if (this.reported) {
                console.log('正在上报');
                return;
            }
            this.reported = true;
            let da = new Date();
            var year = da.getFullYear() + '年';
            var month = da.getMonth() + 1 + '月';
            var date = da.getDate() + '日';
            let data = [year, month, date].join('-');
            /*     let item = DataStorage.getItem("__tt_lastTime__");
                             if (!item || item == "" || item == null) {
                                 DataStorage.setItem("__tt_lastTime__", data)
                                 item = data;
                             }
                             if (item != data) {
                                 console.log("不是当天的用户 不激活了")
                                 return;
                             }*/
            let self = this;
            self.getOpenId((openId) => {
                self.requestGet(`https://api.sjzgxwl.com/tt/getEcpm?appId=${GxAdParams_1.AdParams.tt.appId}&openId=${self.openId}`, (res) => {
                    self.logi(res.data);
                    if (res.data.code == 1) {
                        self.logi('获取ecpm成功：');
                        let records = res.data.data.records;
                        let length = records.length;
                        let allConst = 0;
                        for (let i = 0; i < length; i++) {
                            let record = records[i];
                            allConst += record.cost;
                        }
                        console.log('总共的const:' + allConst);
                        let ecpm = ((allConst / 100000) * 1000) / length;
                        if (allConst <= 0 || length <= 0) {
                            // self.reported = false;
                            // console.log("ecpm没达到" + self.ecpmObj.targetEcpm + "  现在是0")
                            // return
                            ecpm = 0;
                        }
                        console.log('当前计算的ecmp:' + ecpm);
                        if (ecpm >= self.ecpmObj.targetEcpm) {
                            console.log('ecpm达到' + self.ecpmObj.targetEcpm + ' 上报');
                            //@ts-ignore
                            /* tt.sendtoTAQ({
                                                 event_type: 'game_addiction', //event_type 需替换为真实投放的事件英文名称，参考上面链接
                                                 extra: {
                                                     //extra 中的属性需替换为当前事件真实可回传的附加属性字段
                                                     product_name: 'ecpm',
                                                     product_price: ecpm,
                                                 },
                                             })*/
                            self.sendToTAQ('game_addiction', (res) => {
                                //服务端控制 每次上报
                                // DataStorage.setItem('__ttTaq__', 'true')
                                if (res) {
                                }
                                else {
                                    self.reported = false;
                                }
                            });
                        }
                        else {
                            self.reported = false;
                            console.log('ecpm没达到' + self.ecpmObj.targetEcpm);
                        }
                    }
                    else {
                        self.logw('获取ecpm失败！' + res.data['msg']);
                        self.reported = false;
                    }
                }, (res) => {
                    self.logw('获取ecpm失败！' + res['errMsg']);
                    self.logw(res);
                    self.reported = false;
                });
            });
        }
        else {
            console.log('时间：' +
                (this.gameTime >= this.ecpmObj.gameTime * 60) +
                '激励次数：' +
                (this.videoReward >= this.ecpmObj.targetVideo));
        }
    }
    getOpenId(callback) {
        let self = this;
        let item = DataStorage_1.default.getItem('__gx_openId__', null);
        if (item != null) {
            console.log('获取到缓存的openid：' + item);
            self.openId = item;
            callback && callback(item);
            return;
        }
        window['tt'].login({
            force: true,
            success(res) {
                console.log(`login 调用成功${res.code} ${res.anonymousCode}`);
                if (res.code) {
                    self.requestGet(`${GxConstant_1.default.Code2SessionUrl}?appId=${GxAdParams_1.AdParams.tt.appId}&code=${res.code}`, (res) => {
                        self.logi(res.data);
                        if (res.data.code == 1) {
                            self.openId = res.data.data.openid;
                            self.logi('获取openid成功：' + self.openId);
                            DataStorage_1.default.setItem('__gx_openId__', self.openId);
                            callback && callback(self.openId);
                        }
                        else {
                            self.logw('登录失败！' + res.data['msg']);
                            self.reported = false;
                        }
                    }, (res) => {
                        self.logw('登录失败！' + res['errMsg']);
                        self.logw(res);
                        self.reported = false;
                    });
                }
                else {
                    console.log('登录没code');
                    self.reported = false;
                }
            },
            fail(res) {
                console.log(`login 调用失败`);
                self.reported = false;
            },
        });
    }
    initBanner() {
        if (GxAdParams_1.AdParams.tt.banner.length == 0)
            return;
        if (this.bannerAd)
            this.destroyBanner();
        // @ts-ignore
        this.bannerAd = tt.createBannerAd({
            adUnitId: GxAdParams_1.AdParams.tt.banner,
            adIntervals: Math.max(30, GxGame_1.default.adConfig.bannerUpdateTime),
            style: {
                left: 0,
                top: GxGame_1.default.screenHeight,
                width: GxGame_1.default.screenWidth / 2,
            },
        });
        this.bannerAd.onLoad(() => {
            console.log(' banner 加载完成');
        });
        this.bannerAd.onError((err) => {
            console.log(' banner 广告错误' + JSON.stringify(err));
        });
        this.bannerAd.onResize((res) => {
            this.bannerAd.style.top = GxGame_1.default.screenHeight - res.height;
            this.bannerAd.style.left = (GxGame_1.default.screenWidth - res.width) / 2;
        });
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
        if (GxAdParams_1.AdParams.tt.video == null || GxAdParams_1.AdParams.tt.video.length <= 0)
            return;
        this.destroyVideo();
        // @ts-ignore
        this.videoAd = tt.createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.tt.video,
        });
        this.videoAd.load();
        this.videoAd.onLoad((res) => {
            console.log('激励视频加载', res);
        });
        this.videoAd.onError((err) => {
            console.log('激励视频-失败', err);
        });
        this.videoAd.onClose((res) => {
            console.log('激励视频关闭');
            this.recorderResume();
            if (res && res.isEnded) {
                this.videoReward++;
                this.checkAdTarget();
                console.log('激励视频完成');
                this.videocallback && this.videocallback(true);
            }
            else {
                this.videocallback && this.videocallback(false);
            }
            this.videoAd.load();
        });
    }
    showVideo(complete, flag = '') {
        if (this.videoAd == null)
            this.initVideo();
        if (this.videoAd == null)
            return;
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
                // @ts-ignore
                tt.showModal({
                    title: '暂无广告',
                    content: '分享游戏获取奖励？',
                    confirmText: '分享',
                    success: (res) => {
                        if (res.confirm) {
                            GxGame_1.default.shareGame((ret) => {
                                this.videocallback && this.videocallback(ret);
                            });
                        }
                    },
                    fail: (res) => {
                        // @ts-ignore
                        tt.showToast({
                            title: '暂无广告，请稍后再试',
                            icon: 'none',
                        });
                        this.videocallback && this.videocallback(false);
                    },
                });
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
        if (!tt.createInterstitialAd ||
            GxAdParams_1.AdParams.tt.inter == null ||
            GxAdParams_1.AdParams.tt.inter.length <= 0)
            return on_close && on_close();
        this.destroyNormalInter();
        // @ts-ignore
        this.interAd = tt.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.tt.inter,
        });
        this.interAd &&
            this.interAd.onLoad(() => {
                console.log('插屏广告加载');
                on_show && on_show();
            });
        this.interAd &&
            this.interAd.onError((err) => {
                console.log('show inter err' + JSON.stringify(err));
                this.destroyNormalInter();
            });
        this.interAd &&
            this.interAd.onClose(() => {
                this.recorderResume();
                on_close && on_close();
                this.destroyNormalInter();
            });
        this.interAd &&
            this.interAd.load().then(() => {
                this.interAd.show().then(() => {
                    this.recorderPause();
                    this.hideBanner();
                    this.interShowTime = this.get_time();
                });
            });
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.interAd.destroy();
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
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (this.get_time() - this.interShowTime <=
            GxGame_1.default.adConfig.interTick * 1000)
            return;
        this.hideNativeInterstitial();
        if (this.nativeInterTimer == null) {
            this.nativeInterTimer = new GxTimer_1.default();
        }
        this.nativeInterTimer.once(() => {
            let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
            if (native_data == null || native_data === undefined) {
                this.showInterstitial(on_show, on_hide);
            }
            else {
                let node = cc.instantiate(GxUtils_1.default.getRes('gx/prefab/ad/native_interstitial', cc.Prefab));
                this.nativeInter = node.getComponent('gx_native_interstitial');
                this.nativeInter &&
                    this.nativeInter.show(native_data, () => {
                        this.interShowTime = this.get_time();
                        this.hideBanner();
                        on_show && on_show();
                    }, on_hide);
            }
        }, GxGame_1.default.isShenHe || GxGame_1.default.inBlockArea ? 0 : delay_time * 1000);
    }
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
        this.destroyNormalInter();
    }
    initRecorder() {
        // @ts-ignore
        if (!tt.getGameRecorderManager)
            return;
        // @ts-ignore
        this.gameRecorder = tt.getGameRecorderManager();
        // 设置录屏相关监听
        this.gameRecorder.onStart((res) => {
            console.log('录制开始', JSON.stringify(res));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.START;
            this.recorderTime = this.get_time();
            this.videoPath = null;
        });
        // 监听录屏过程中的错误，需根据错误码处理对应逻辑
        this.gameRecorder.onError((err) => {
            console.log('录制出错', JSON.stringify(err));
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
        });
        // stop 事件的回调函数
        this.gameRecorder.onStop((res) => {
            this.gameRecorderState = BaseAdapter_1.RECORDER_STATE.NO;
            this.videoPath = null;
            if (res && res.videoPath) {
                if (this.get_time() - this.recorderTime >= 3 * 1000) {
                    this.videoPath = res.videoPath;
                    console.log(`录屏停止，录制成功。videoID is ${res.videoPath}`);
                }
                else {
                    console.log(`录屏停止，录制失败。录屏时间<3s`);
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
            this.gameRecorder &&
                this.gameRecorder.start({
                    duration: 300,
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
        if (this.gameRecorder == null || this.videoPath == null) {
            this.createToast('分享失败');
            return on_fail && on_fail();
        }
        // @ts-ignore
        tt.shareAppMessage({
            channel: 'video',
            query: '',
            title: GxAdParams_1.AdParams.tt.gameName,
            desc: GxAdParams_1.AdParams.tt.gameName,
            extra: {
                videoPath: this.videoPath,
                videoTopics: [GxAdParams_1.AdParams.tt.gameName],
                hashtag_list: [GxAdParams_1.AdParams.tt.gameName],
            },
            success: () => {
                console.log('分享视频成功');
                on_succ && on_succ();
                this.onRecoderStop = null;
                this.videoPath = null;
            },
            fail: (res) => {
                console.log('分享视频失败', res);
                on_fail && on_fail();
                if (res.errMsg.search(/short/gi) > -1) {
                    this.createToast('分享失败');
                }
                else if (res.errMsg.search(/cancel/gi) > -1) {
                    this.createToast('取消分享');
                }
                else {
                    this.createToast('分享失败，请重试！');
                }
            },
        });
    }
    showGamePortal() {
        // @ts-ignore
        const systemInfo = tt.getSystemInfoSync();
        if (systemInfo.platform !== 'ios') {
            let options = [];
            for (let appid of GxGame_1.default.recommedList) {
                options.push({
                    appId: appid,
                    query: '',
                    extraData: {},
                });
            }
            if (options.length > 0) {
                // @ts-ignore
                tt.showMoreGamesModal({
                    appLaunchOptions: options,
                    success(res) {
                        console.log('success', res.errMsg);
                    },
                    fail(res) {
                        console.log('fail', res.errMsg);
                    },
                });
            }
            else {
                this.createToast('暂无广告！');
            }
        }
    }
    showRecorderLayer(on_succ, on_fail) {
        console.warn('//TODO   show recorderLayer');
        if (this.shareRcorderLayer == null ||
            this.shareRcorderLayer === undefined ||
            !cc.isValid(this.shareRcorderLayer.node, true)) {
            /* let node = cc.instantiate(Utils.getRes('hs_ui/ui_share_rcorder', cc.Prefab));
                              this.shareRcorderLayer = node.getComponent('hs_ui_share_rcorder');
                              this.shareRcorderLayer && this.shareRcorderLayer.show(on_succ, on_fail);*/
        }
    }
    requestGet(url, successCallback, failCallback) {
        //@ts-ignore
        tt.request({
            url: url,
            success(res) {
                successCallback && successCallback(res);
            },
            fail(res) {
                failCallback && failCallback(res);
            },
        });
    }
    logi(...data) {
        super.LOG('[TTAdapter]', ...data);
    }
    loge(...data) {
        super.LOGE('[TTAdapter]', ...data);
    }
    logw(...data) {
        super.LOGW('[TTAdapter]', ...data);
    }
    ttReport() {
        let item = DataStorage_1.default.getItem('tt_event_active');
        item = 'nosuccess';
        //每次激活都上报   服务器控制多次上报
        if (item != 'success') {
            //保存激活状态
            this.sendToTAQ('active', (res) => {
                if (res) {
                    console.log('上报激活成功');
                    DataStorage_1.default.setItem('__clickid__', this.getClickId());
                    DataStorage_1.default.setItem('tt_event_active', 'success');
                    let item1 = DataStorage_1.default.getItem('tt_install_time');
                    if (!item1) {
                        DataStorage_1.default.setItem('tt_install_time', new Date().valueOf() + '');
                    }
                }
                else {
                    console.log('上报激活失败');
                }
            });
            /*  tt.sendtoTAQ({
                        event_type: 'active', //event_type 需替换为真实投放的事件英文名称，参考上面链接
                        extra: {
                            //extra 中的属性需替换为当前事件真实可回传的附加属性字段
                            product_name: '激活游戏',
                            product_price: 1,
                        },
                    })*/
        }
        let installTime = DataStorage_1.default.getItem('tt_install_time');
        if (!!installTime) {
            installTime = parseInt(installTime);
        }
        else {
            installTime = new Date().valueOf();
        }
        let installDate = new Date(new Date(installTime).toLocaleDateString()).valueOf();
        let curDate = new Date().valueOf();
        let number = curDate - installDate;
        let number1 = Math.floor(number / 24 / 60 / 60 / 1000);
        if (number1 >= 1 && number1 <= 6) {
            let arr = [
                'next_day_open',
                'retention_3d',
                'retention_4d',
                'retention_5d',
                'retention_6d',
                'retention_7d',
            ];
            let eventName = arr[number1 - 1];
            let item = DataStorage_1.default.getItem('tt_event_' + eventName);
            item = 'nosuccess';
            //每次达成都上报    服务器控制多次上报
            if (item != 'success') {
                //保存激活状态
                console.log('上报事件：' + eventName);
                /* tt.sendtoTAQ({
                             event_type: eventName, //event_type 需替换为真实投放的事件英文名称，参考上面链接
                             extra: {
                                 //extra 中的属性需替换为当前事件真实可回传的附加属性字段
                                 product_name: '',
                                 product_price: 1,
                             },
                         })*/
                this.sendToTAQ(eventName, (res) => {
                    if (res) {
                        console.log('上报事件：' + eventName + ':成功');
                        DataStorage_1.default.setItem('tt_event_' + eventName, 'success');
                    }
                    else {
                        console.log('上报事件：' + eventName + ':失败');
                    }
                });
            }
            else {
                console.log(eventName + '已经上报过了');
            }
        }
        else {
            console.log('传的number不能用：' + number1);
        }
    }
    sendToTAQ(event, callback) {
        let clickId = this.getClickId();
        if (!clickId) {
            console.warn('clickId空  不上报 了');
            callback(false);
            return;
        }
        let self = this;
        self.getOpenId((openId) => {
            self.requestGet(`https://api.sjzgxwl.com/tt/report?eventType=${event}&openId=${self.openId}&clickId=${clickId}`, (res) => {
                self.logi(res.data);
                if (res.data.code == 1) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            }, (res) => {
                callback(false);
            });
        });
    }
    addDesktop(callback) {
        // @ts-ignore
        tt.addShortcut({
            success() {
                if (callback)
                    callback();
            },
            fail(err) {
                console.log('添加桌面失败', err.errMsg);
            },
        });
    }
    hasAddDesktop(can_add, callback) {
        // @ts-ignore
        tt.checkShortcut({
            success(res) {
                console.log("检查快捷方式", res.status);
                if (res.status.exist) {
                    console.log("隐藏桌面");
                    callback && callback();
                }
            },
            fail(res) {
                console.log("检查快捷方式失败", res.errMsg);
            },
        });
    }
}
exports.default = TTAdapter;
