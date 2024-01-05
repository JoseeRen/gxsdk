"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxEnum_1 = require("../../core/GxEnum");
const GxAdParams_1 = require("../../GxAdParams");
const gx_ui_inner_interstitial_1 = __importDefault(require("../native/gx_ui_inner_interstitial"));
const gx_ui_interstitial_1 = __importDefault(require("../native/gx_ui_interstitial"));
const gx_ui_native_icon_1 = require("../native/gx_ui_native_icon");
const gx_ui_add_icon_1 = __importDefault(require("../../ui/gx_ui_add_icon"));
const GxGameUtil_1 = __importDefault(require("../../core/GxGameUtil"));
const DataStorage_2 = __importDefault(require("../../util/DataStorage"));
class OppoAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        // interIdx: number = 1;
        this.bannerIdx = 1;
        this.ecpmObj = {
            targetEcpm: 0,
            gameTime: 10,
            targetVideo: 3 //目标激励视频次数
        };
        this.checkInterval = 10; //10秒检查一次
        this.gameTime = 0;
        this.videoReward = 0;
        this.reported = false;
        this.canUpload = true;
        this.pkgName = "";
        this.videoShowing = false;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new OppoAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        // this.getDeviceId();
        GxGame_1.default.adConfig.bannerUpdateTime = 5;
        this.getGameInfo();
        GxGame_1.default.adConfig.adCdTime = GxGame_1.default.gGN("delay", 60);
        let label = GxGame_1.default.gGB("z1");
        if (label) {
            GxGame_1.default.adConfig.adCdTime = 0;
        }
        this.isGameCd = GxGame_1.default.adConfig.adCdTime > 0;
        this.logi("广告冷却：" + this.isGameCd);
        super.initAd();
        // @ts-ignore
        if (qg.getManifestInfo) {
            // @ts-ignore
            qg.getManifestInfo({
                success: (res) => {
                    console.log(JSON.stringify(res.manifest));
                    let info = JSON.parse(res.manifest);
                    this.setManifestInfo(info);
                    // TDSDK.getInstance().init("DEBB78D26E894F4FB174FAA2A8F4DE24", info.package.replace(/\./g, "_"))
                },
                fail: function (err) {
                },
                complete: function (res) {
                }
            });
        }
        this._gameCd();
        this.initBanner();
        this.initNormalBanner();
        this.initVideo();
        this.initNativeAd();
        this.initGamePortal();
        // ocpx 上传
        GxTimer_1.default.loop(() => {
            GxGame_1.default.uploadOcpx("gtime");
        }, 6e4);
        /*时候4 2023年9月4日11:30:59*/
        GxGame_1.default.adConfig.interTick = GxGame_1.default.gGN("ae", 10);
        /*修改3 2023年9月4日11:26:36*/
        this.ac();
        /* 修改2 2023年9月4日11:22:57 */
        this.ab();
        this.initAdMonitor();
    }
    ac() {
        let value = GxGameUtil_1.default.getInstance().gGN("ac", 20);
        setTimeout(() => {
            if (GxGameUtil_1.default.getInstance().gGB("ac")) {
                this.privateShowInter(() => {
                }, () => {
                    this.ac();
                });
            }
        }, value * 1000);
    }
    ab() {
        let value = GxGameUtil_1.default.getInstance().gGN("ab", 35);
        setTimeout(() => {
            if (GxGameUtil_1.default.getInstance().gGB("ab")) {
                this._vv();
            }
        }, value * 1000);
    }
    _vv() {
        this.showVideo((res) => {
            let value = GxGameUtil_1.default.getInstance().gGN("ab", 35);
            setTimeout(() => {
                this._vv();
            }, value * 1000);
        }, "GxVV");
    }
    initAdMonitor() {
        this.getAdConfig();
        //@ts-ignore
        //10秒检查 一次
        setInterval(() => {
            if (this.canUpload) {
                this.checkAdTarget();
            }
            else {
                console.log("不用上报 可能没有配置");
            }
        }, this.checkInterval * 1000);
    }
    checkAdTarget() {
        this.gameTime += this.checkInterval;
        //玩游戏大于等于10分钟
        if (this.gameTime >= this.ecpmObj.gameTime * 60 && this.videoReward >= this.ecpmObj.targetVideo || window["rywDEBUG"]) {
            if (DataStorage_2.default.getItem("__oppoTaq__") == "true") {
                console.log("本地已经有上报记录了");
                return;
            }
            if (this.reported) {
                console.log("已经上报过了");
                return;
            }
            this.reported = true;
            let da = new Date();
            var year = da.getFullYear() + "年";
            var month = da.getMonth() + 1 + "月";
            var date = da.getDate() + "日";
            let data = [year, month, date].join("-");
            /*     let item = cc.sys.localStorage.getItem("__oppo_lastTime__");
                 if (!item || item == "" || item == null) {
                     cc.sys.localStorage.setItem("__oppo_lastTime__", data)
                     item = data;
                 }
                 if (item != data) {
                     console.log("不是当天的用户 不激活了")
                     return;
                 }*/
            let self = this;
            // @ts-ignore
            self.getDeviceId((deviceId) => {
                if (!!deviceId) {
                    self.uploadAction("rpkAction", (res) => {
                        if (res) {
                            DataStorage_2.default.setItem("__oppoTaq__", "true");
                        }
                    });
                }
                else {
                    self.reported = false;
                    console.log("deviceId为空");
                }
            });
        }
    }
    /* let actionDataType = {
         "active": 1,
         "register": 2,
         "day2": 4,
         "day3": 9,
         "day4": 10,
         "day5": 11,
         "day6": 12,
         "day7": 13,
         "day8": 14,
         "rpkAction": 19,//rpk用
         "gameAction": 20//apk用
     }*/
    uploadAction(actionName, callback) {
        if (!this.canUpload) {
            this.logi("没有配置 不用上报");
            callback && callback(false);
            return;
        }
        let self = this;
        this.getDeviceId((deviceId) => {
            if (!!deviceId) {
                let url = "";
                if (deviceId.length > 24) {
                    url = `https://ocpx.sjzgxwl.com/ocpx/oppo/rpk/action?pkg=${self.pkgName}&action=${actionName}&OAID=${deviceId}`;
                }
                else {
                    //不用加密  服务器加密后去查找
                    url = `https://ocpx.sjzgxwl.com/ocpx/oppo/rpk/action?pkg=${self.pkgName}&action=${actionName}&imeiMD5=${deviceId}`;
                }
                GxGameUtil_1.default.getInstance()._httpGets(url, {}, (res) => {
                    if (res != -1 && res != -2) {
                        self.logi(res);
                        let parse = JSON.parse(res);
                        if (!!parse && parse.code == 1) {
                            self.logi("上报成功：");
                            callback && callback(true);
                        }
                        else {
                            if (parse.code == -2) {
                                // self.canUpload = false;
                                // self.logw('配置不存在 ！')
                                callback && callback(false);
                            }
                            else {
                                self.logw("上报失败2！" + res["msg"]);
                                callback && callback(false);
                                /*
                                                                setInterval(() => {
                                                                    self.getAdConfig()
                                                                }, 2000)*/
                            }
                        }
                    }
                    else {
                        self.logw("上报失败！" + res["msg"]);
                        callback && callback(false);
                    }
                });
            }
            else {
                console.log("deviceId空 不能上传 ");
                callback && callback(false);
            }
        });
    }
    getAdConfig() {
        let self = this;
        let saveKey = "oppo_install_time";
        if (window["qg"] && window["qg"]["getManifestInfo"]) {
            // @ts-ignore
            window["qg"].getManifestInfo({
                success: function (res) {
                    let data = JSON.parse(res.manifest);
                    self.logi(data);
                    self.pkgName = data["package"];
                    //获取配置的   激励次数和时长
                    GxGameUtil_1.default.getInstance()._httpGets("https://ocpx.sjzgxwl.com/ocpx/oppo/rpk/getconfig?pkg=" + data["package"], {}, (res) => {
                        if (res != -1 && res != -2) {
                            self.logi(res);
                            let parse = JSON.parse(res);
                            if (!!parse && parse.code == 1) {
                                self.logi("获取ecpm配置成功：");
                                self.ecpmObj = parse.data;
                                self.uploadAction("active", (res) => {
                                    if (res) {
                                        let item1 = DataStorage_2.default.getItem(saveKey);
                                        if (!item1) {
                                            DataStorage_2.default.setItem(saveKey, new Date().valueOf() + "");
                                        }
                                    }
                                    else {
                                        self.logi("上报激活失败");
                                    }
                                });
                                let installTime = DataStorage_2.default.getItem(saveKey);
                                if (!!installTime) {
                                    // @ts-ignore
                                    installTime = parseInt(installTime);
                                }
                                else {
                                    // @ts-ignore
                                    installTime = new Date().valueOf();
                                }
                                let installDate = new Date(new Date(installTime).toLocaleDateString()).valueOf();
                                let curDate = new Date().valueOf();
                                let number = curDate - installDate;
                                let number1 = Math.floor(number / 24 / 60 / 60 / 1000);
                                if (number1 >= 1 && number1 <= 7) {
                                    let arr = [
                                        "day2",
                                        "day3",
                                        "day4",
                                        "day5",
                                        "day6",
                                        "day7",
                                        "day8"
                                    ];
                                    let eventName = arr[number1 - 1];
                                    let item = DataStorage_2.default.getItem("tt_event_" + eventName);
                                    item = "nosuccess";
                                    //每次达成都上报    服务器控制多次上报
                                    if (item != "success") {
                                        //保存激活状态
                                        console.log("上报事件：" + eventName);
                                        /* tt.sendtoTAQ({
                                                     event_type: eventName, //event_type 需替换为真实投放的事件英文名称，参考上面链接
                                                     extra: {
                                                         //extra 中的属性需替换为当前事件真实可回传的附加属性字段
                                                         product_name: '',
                                                         product_price: 1,
                                                     },
                                                 })*/
                                        self.uploadAction(eventName, (res) => {
                                            if (res) {
                                                console.log("上报事件：" + eventName + ":成功");
                                                DataStorage_2.default.setItem("oppo_event_" + eventName, "success");
                                            }
                                            else {
                                                console.log("上报事件：" + eventName + ":失败");
                                            }
                                        });
                                    }
                                    else {
                                        console.log(eventName + "已经上报过了");
                                    }
                                }
                                else {
                                    console.log("传的number不能用：" + number1);
                                }
                            }
                            else {
                                if (parse.code == -2) {
                                    //配置不存在
                                    self.canUpload = false;
                                    self.logw("配置不存在 ！");
                                }
                                else {
                                    self.logw("获取ecpm配置失败2！" + res["msg"]);
                                    setTimeout(() => {
                                        self.getAdConfig();
                                    }, 5000);
                                }
                            }
                        }
                        else {
                            self.logw("获取ecpm配置失败！" + res["msg"]);
                            setTimeout(() => {
                                self.getAdConfig();
                            }, 5000);
                        }
                    });
                },
                fail: function (err) {
                    setTimeout(() => {
                        self.getAdConfig();
                    }, 5000);
                },
                complete: function (res) {
                }
            });
        }
        else {
            this.logi("版本低 不能获取 包名了");
        }
    }
    // @ts-ignore
    getDeviceId(callback) {
        //最低1096
        // @ts-ignore
        if (window["qg"].getDeviceId) {
            // @ts-ignore
            window["qg"].getDeviceId({
                success: data => {
                    this.logi(`deviceId get success: ${JSON.stringify(data)}`);
                    if (data && data.deviceId && DataStorage_1.default.deviceid != data.deviceId) {
                        DataStorage_1.default.deviceid = data.deviceId;
                    }
                    callback && callback(data.deviceId);
                    this.logi(DataStorage_1.default.deviceid);
                },
                fail: (data, code) => {
                    this.loge(`deviceId  get fail, code = ${code}`);
                    callback && callback(null);
                }
            });
        }
        else {
            console.log("不支持获取");
            callback && callback(null);
        }
    }
    getGameInfo() {
        // @ts-ignore
        if (window["qg"].getManifestInfo) {
            // @ts-ignore
            window["qg"].getManifestInfo({
                success: res => {
                    const ret = JSON.parse(res.manifest);
                    GxGame_1.default.gameInfo = {
                        package: ret.package,
                        name: ret.name,
                        versionName: ret.versionName,
                        versionCode: ret.versionCode
                    };
                    this.logi(JSON.stringify(GxGame_1.default.gameInfo));
                }
            });
        }
    }
    _gameCd() {
        let timer = new GxTimer_1.default();
        timer.once(() => {
            this.isGameCd = false;
            if (this.isNeedShowBanner) {
                this.showBanner(null, null);
            }
        }, GxGame_1.default.adConfig.adCdTime * 1000);
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
        if (this.platformVersion() < 1051 || GxAdParams_1.AdParams.oppo.banner.length <= 0) {
            this.logi("环境不支持banner  或者banner广告参数空");
            return;
        }
        this.destroyNormalBanner();
        let screenWidth = GxGame_1.default.screenWidth;
        let screenHeight = GxGame_1.default.screenHeight;
        let width = 500;
        let height = 200;
        let bannerShowTop = GxAdParams_1.AdParams.oppo.bannerOnTop;
        if (screenWidth > screenHeight) {
            width = 900;
            height = 200;
        }
        else {
            width = 900;
            height = 200;
        }
        let style = {
        /*left: (screenWidth - width) / 2,
        width: width,
        height: height*/
        };
        if (bannerShowTop) {
            style["top"] = 0;
        }
        this.bannerAd = window["qg"].createBannerAd({
            adUnitId: GxAdParams_1.AdParams.oppo.banner,
            style: style
        });
        this.bannerAd.onError(err => {
            this.loge("normal banner error: ", JSON.stringify(err));
        });
    }
    /**
     * 展示普通banner
     */
    showNormalBanner(showCallback, failedCallback) {
        if (this.bannerAd == null) {
            this.initNormalBanner();
        }
        if (this.bannerAd == null) {
            this.logi("banner空");
            failedCallback && failedCallback();
            return;
        }
        this.bannerAd.show().then(() => {
            showCallback && showCallback();
            this.logi("normal banner show success");
            if (GxGame_1.default.adConfig.bannerUpdateTime <= 0) {
                if (this.bannerTimer)
                    this.bannerTimer.stop();
            }
        }).catch(e => {
            failedCallback && failedCallback();
            this.loge("banner error", e);
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
    }
    initBanner() {
        super.initBanner();
    }
    showBanner(showCallback, failedCallback) {
        if (this.isGameCd) {
            this.isNeedShowBanner = true;
            failedCallback && failedCallback();
            this.logi("showBanner 广告CD中");
            return;
        }
        this.hideBanner();
        //  this.bannerDelayTimer = mTimer.once(() => {
        // this.logi("GxGame.adConfig.bannerUpdateTime" + GxGame.adConfig.bannerUpdateTime)
        // if (GxGame.adConfig.bannerUpdateTime > 0) {
        //   if (this.bannerTimer == null) {
        //     this.bannerTimer = new mTimer();
        //   }
        //   this.bannerTimer && this.bannerTimer.once(() => {
        //     this.showBanner(showCallback, failedCallback);
        //   }, GxGame.adConfig.bannerUpdateTime * 1000);
        // }
        // this.logi("bannerIdx:" + this.bannerIdx)
        // if (this.bannerIdx % 2 == 1) {
        //   let native_data = null;
        //   if (GxGame.adConfig.useNative) {
        //     native_data = this.getLocalNativeData(ad_native_type.banner);
        //   } else {
        //     native_data = this.create_custom_ad(ad_native_type.banner)
        //   }
        //   if (native_data == null || native_data === undefined) {
        //     this.logi("原生banner数据空:")
        //     failedCallback && failedCallback()
        //     /*this.bannerIdx++;
        //     this.showNormalBanner(showCallback, failedCallback);*/
        //   } else {
        //     if (GxGame.adConfig.useNative) {
        //       let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_banner', cc.Prefab));
        //       this.bannerNode = node.getComponent('gx_native_banner');
        //       this.bannerNode.show(native_data, () => {
        //       }, () => {
        //         if (GxGame.adConfig.bannerUpdateTime <= 0) {
        //           this.bannerTimer && this.bannerTimer.clear();
        //         }
        //       });
        //       showCallback && showCallback();
        //     } else {
        //       native_data
        //         .show()
        //         .then(() => {
        //           this.logi("custom banner成功")
        //           this.customBanner = native_data;
        //           showCallback && showCallback();
        //         })
        //         .catch((error) => {
        //           this.logi("custom show fail with:" + error.errCode + "," + error.errMsg);
        //           failedCallback && failedCallback()
        //         });
        //     }
        //     this.hideNormalBanner();
        //   }
        // } else {
        this.showNormalBanner(showCallback, failedCallback);
        // }
        // this.bannerIdx++;
        // }, 1000);
    }
    hideBanner() {
        super.hideBanner();
        this.isNeedShowBanner = false;
        if (this.customBanner) {
            this.customBanner.hide();
            this.customBanner.destroy();
            this.customBanner = null;
        }
        this.hideNormalBanner();
    }
    initVideo() {
        if (!GxAdParams_1.AdParams.oppo.video) {
            this.logi("video广告位参数空");
            return;
        }
        this.destroyVideo();
        this.videoAd = window["qg"].createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.oppo.video
        });
        this.videoAd.onLoad(() => {
            this.logi("video load succ");
        });
        this.videoAd.onError((err) => {
            this.logi("video error: " + JSON.stringify(err), "color: red");
            this._videoErrorEvent();
        });
        this.videoAd.onClose(res => {
            if (res && res.isEnded) {
                this.videoReward++;
                this.checkAdTarget();
                this._videoCompleteEvent();
                this.videocallback && this.videocallback(true);
            }
            else {
                this._videoCloseEvent();
                this.videocallback && this.videocallback(false);
                /*   let node = cc.instantiate(Utils.getRes('hs_ui/ui_watch_video', cc.Prefab));
                   let ui_watch_video = node.getComponent('hs_ui_watch_video');
                   ui_watch_video && ui_watch_video.show(() => {
                       this.showVideo(this.videocallback);
                   });*/
            }
            this.videoShowing = false;
            this.videoAd.load();
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
            this.initVideo();
        }
        if (this.videoAd == null) {
            this.createToast("暂无视频，请稍后再试");
            this.videoShowing = false;
            complete && complete(false);
            this._videoErrorEvent();
            return;
        }
        this.videocallback = complete;
        this.videoAd.show().then(() => {
        }).catch(() => {
            this.createToast("暂无视频，请稍后再试");
            complete && complete(false);
            this._videoErrorEvent();
            this.videoShowing = false;
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
            this.logi(ad_type, "posId = ", posId);
            if (posId == "" || posId === undefined || posId == null || this.is_limit_native_length(ad_type) || this.platformVersion() < 1051)
                return resolve(null);
            let nativeAd = window["qg"].createNativeAd({
                adUnitId: posId
            });
            let on_load = (res) => {
                this.logi("native data load:");
                if (res && res.adList) {
                    let data = res.adList.pop();
                    data.ad = nativeAd;
                    data.type = ad_type;
                    this.add_native_data(data);
                    this.logi("native data load succ:" + JSON.stringify(data));
                    nativeAd.offLoad(on_load);
                }
            };
            nativeAd.onLoad(on_load);
            let on_error = (err) => {
                this.logi("native data error: " + JSON.stringify(err), "color: red");
                nativeAd.offError(on_error);
            };
            nativeAd.onError(on_error);
            nativeAd.load();
            setTimeout(resolve, 500);
        });
    }
    create_custom_ad(ad_type) {
        let posId = "";
        let style = {};
        // 定义 CustomAd 左上角距离屏幕左边的距离，不传默认为底部居中，宽度为屏幕短边
        if (ad_type == GxEnum_1.ad_native_type.banner) {
            posId = GxAdParams_1.AdParams.oppo.native_banner || GxAdParams_1.AdParams.oppo.native_custom_banner;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.oppo.native_custom_banner;
            }
        }
        else if (ad_type == GxEnum_1.ad_native_type.inter1) {
            posId = GxAdParams_1.AdParams.oppo.native1 || GxAdParams_1.AdParams.oppo.native_custom1;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.oppo.native_custom1;
            }
        }
        else if (ad_type == GxEnum_1.ad_native_type.inter2) {
            posId = GxAdParams_1.AdParams.oppo.native2 || GxAdParams_1.AdParams.oppo.native_custom2;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.oppo.native_custom2;
            }
        }
        if (ad_type == GxEnum_1.ad_native_type.banner) {
            if (GxAdParams_1.AdParams.oppo.bannerOnTop) {
                style["top"] = 0;
            }
            else {
            }
        }
        else {
            let shortWidth = Math.min(GxGame_1.default.screenWidth, GxGame_1.default.screenHeight);
            let width = shortWidth * 0.85;
            let height = width / 16 * 15.125; //16	15.125
            //插屏 宽都是256  高  218   242   188 212 四种
            let left = (GxGame_1.default.screenWidth - width) / 2;
            let top = (GxGame_1.default.screenHeight - height) / 2 + 150; //0518策略往下挪点
            style["width"] = width;
            style["left"] = left;
            style["top"] = top;
            // console.log(JSON.stringify(style))
        }
        this.logi(ad_type, "posId = ", posId);
        if (posId == "" || posId === undefined || posId == null || this.platformVersion() < 1094)
            return null;
        // @ts-ignore
        let nativeAd = window["qg"].createCustomAd({
            adUnitId: posId,
            style: style
        });
        return nativeAd;
        return new Promise((resolve, reject) => {
            let posId = "";
            let style = {};
            // 定义 CustomAd 左上角距离屏幕左边的距离，不传默认为底部居中，宽度为屏幕短边
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                posId = GxAdParams_1.AdParams.oppo.native_banner || GxAdParams_1.AdParams.oppo.native_custom_banner;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.oppo.native1 || GxAdParams_1.AdParams.oppo.native_custom1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.oppo.native2 || GxAdParams_1.AdParams.oppo.native_custom2;
            }
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                if (GxAdParams_1.AdParams.oppo.bannerOnTop) {
                    style["top"] = 0;
                }
                else {
                }
            }
            else {
                let shortWidth = Math.min(GxGame_1.default.screenWidth, GxGame_1.default.screenHeight);
                let width = shortWidth * 0.85;
                let height = width / 16 * 15.125; //16	15.125
                //插屏 宽都是256  高  218   242   188 212 四种
                let left = (GxGame_1.default.screenWidth - width) / 2;
                let top = (GxGame_1.default.screenHeight - height) / 2;
                style["width"] = width;
                style["left"] = left;
                style["top"] = top;
                // console.log(JSON.stringify(style))
            }
            this.logi(ad_type, "posId = ", posId);
            if (posId == "" || posId === undefined || posId == null || this.platformVersion() < 1094)
                return resolve(null);
            // @ts-ignore
            let nativeAd = window["qg"].createCustomAd({
                adUnitId: posId,
                style: style
            });
            /* let on_load = (res) => {
                 this.logi("custom data load succ:");


                 nativeAd.offLoad(on_load);
                 if (ad_type == ad_native_type.banner) {
                     this._native_custom_banner_cache.push(nativeAd)

                 } else {
                     this._native_custom_inter_cache.push(nativeAd)

                 }

             }
             nativeAd.onLoad(on_load);

             let on_error = (err) => {
                 this.logi("custom data error: " + JSON.stringify(err));
                 nativeAd.offError(on_error);
             }
             nativeAd.onError(on_error);

             nativeAd.load();*/
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                this._native_custom_banner_cache.push(nativeAd);
            }
            else {
                this._native_custom_inter_cache.push(nativeAd);
            }
            setTimeout(resolve, 500);
        });
    }
    /**原生广告 */
    initNativeAd() {
        // 拉取间隔1s
        if (GxGame_1.default.adConfig.useNative) {
            this.logi("使用原生自渲染广告");
            this.create_ad(GxEnum_1.ad_native_type.banner).then(() => {
                return this.create_ad(GxEnum_1.ad_native_type.inter1);
            }).then(() => {
                return this.create_ad(GxEnum_1.ad_native_type.inter2);
            }).then(() => {
                this.loop_get_native_data();
            }); /* this.create_ad(ad_native_type.banner).then(() => {
            return this.create_ad(ad_native_type.native_icon);
        }).then(() => {
            return this.create_ad(ad_native_type.inter1);
        }).then(() => {
            return this.create_ad(ad_native_type.inter2);
        }).then(() => {
            this.loop_get_native_data();
        })*/
        }
        else {
            this.logi("使用原生模板广告");
            /* this.create_custom_ad(ad_native_type.banner).then(() => {
                 return this.create_custom_ad(ad_native_type.inter1);
             }).then(() => {
                 return this.create_custom_ad(ad_native_type.inter2);
             }).then(() => {
                 this.loop_get_custom_data();
             })*/
        }
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        on_hide && on_hide();
        this.logi("不使用这个广告");
        return;
        if (this.isGameCd) {
            on_hide && on_hide();
            return this.logi("广告CD中");
        }
        this.hideInterstitialNative();
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
        if (native_data == null || native_data === undefined) {
            on_hide && on_hide();
        }
        else {
            this.isNeedShowBanner = false;
            this.innerInter = new gx_ui_inner_interstitial_1.default();
            /* let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_inner_interstitial', cc.Prefab));
             this.innerInter = node.getComponent('gx_native_inner_interstitial');*/
            this.innerInter && this.innerInter.show(parent, native_data, on_click, () => {
                // this.hideBanner();
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
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (this.isGameCd) {
            on_hide && on_hide();
            this.logi("showNativeInterstitial 广告CD中");
            return;
        }
        setTimeout(() => {
            this.privateShowInter(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    privateShowInter(on_show, on_hide) {
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000 || GxGame_1.default.isShenHe) {
            this.logi("限制了2");
            return on_hide && on_hide();
        }
        this.hideNativeInterstitial();
        // this.hideBanner();
        let native_data = null;
        let tmpInter = 0;
        //循环加兜底
        if (GxGame_1.default.adConfig.useNative) {
            if (this.interIdx % 2 == 1) {
                native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
                tmpInter = GxEnum_1.ad_native_type.inter1;
                if (native_data == null || native_data === undefined) {
                    native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
                    tmpInter = GxEnum_1.ad_native_type.inter2;
                }
            }
            else {
                native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
                tmpInter = GxEnum_1.ad_native_type.inter2;
                if (native_data == null || native_data === undefined) {
                    native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
                    tmpInter = GxEnum_1.ad_native_type.inter1;
                }
            }
        }
        else {
            if (this.interIdx % 2 == 1) {
                native_data = this.create_custom_ad(GxEnum_1.ad_native_type.inter1);
                tmpInter = GxEnum_1.ad_native_type.inter1;
            }
            else {
                native_data = this.create_custom_ad(GxEnum_1.ad_native_type.inter2);
                tmpInter = GxEnum_1.ad_native_type.inter2;
            }
        }
        this.interIdx++;
        this.logi("显示:" + tmpInter);
        if (native_data == null || native_data === undefined) {
            this.logi("native_data null");
            on_hide && on_hide();
        }
        else {
            if (GxGame_1.default.adConfig.useNative) {
                this.logi("native inter ");
                /*if (Utils.randomInt(1, 100) > GxGame.adConfig.showInterRto) {
              this.logi("限制了3")

              return on_hide && on_hide()
          }*/
                /*  let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_interstitial', cc.Prefab));
                  this.nativeInter = node.getComponent('gx_native_interstitial');
        */
                this.nativeInter = new gx_ui_interstitial_1.default();
                this.nativeInter && this.nativeInter.show(native_data, () => {
                    this.interShowTime = this.get_time();
                    // this.hideBanner();
                    on_show && on_show();
                }, on_hide);
            }
            else {
                if (this.customInter) {
                    this.customInter.destroy();
                    this.customInter = null;
                }
                this.logi("custom inter ");
                native_data.onHide(() => {
                    // console.log("隐藏block")
                    if (this.interMask) {
                        this.interMask.destroy();
                    }
                    this.interMask = null;
                    native_data && native_data.offHide();
                    on_hide && on_hide();
                });
                native_data
                    .show()
                    .then(() => {
                    // console.log("显示block")
                    this.interShowTime = this.get_time();
                    if (!this.interMask) {
                        this.interMask = new Laya.Panel();
                        this.interMask.bgColor = "#000000";
                        this.interMask.alpha = 0.6;
                        this.interMask.size(Laya.stage.width, Laya.stage.height);
                        this.interMask.zOrder = 100000;
                        this.interMask.mouseEnabled = true;
                        this.interMask.mouseThrough = false;
                        Laya.stage.addChild(this.interMask);
                        let t = 0;
                        this.interMask.on(Laya.Event.CLICK, this, () => {
                            t++;
                            console.log("触摸了");
                            if (t == 4) {
                                if (this.interMask) {
                                    this.interMask.destroy();
                                    this.interMask = null;
                                }
                            }
                        });
                    }
                    this.customInter = native_data;
                    this.logi("show custom inter  success");
                    on_show && on_show();
                })
                    .catch((error) => {
                    if (this.interMask) {
                        this.interMask.destroy();
                    }
                    this.interMask = null;
                    this.logi("show custom inter fail with:" + error.errCode + "," + error.errMsg);
                    on_hide && on_hide();
                });
            }
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
        if (this.isGameCd) {
            on_hide && on_hide();
            this.logi("showNativeInterstitial 广告CD中");
            return;
        }
        let canShow = false;
        /*  let icLabel = GxGame.gGB("ic");
          if (icLabel) {
  */
        /*去掉了  let value = GxGame.gGN("ic", 0);
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
            on_hide && on_hide();
            this.logi("canShow ==false");
            return;
        }
        GxTimer_1.default.once(() => {
            this.privateShowInter(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    /**
     * 原生ICON
     * @param parent
     */
    showNativeIcon(parent) {
        if (this.isGameCd) {
            return this.logi("showNativeIcon 广告CD中");
        }
        if (!GxGame_1.default.adConfig.useNative) {
            return this.logi("native无法显示 现在是custom ");
            return;
        }
        // 特殊处理
        let type = GxEnum_1.ad_native_type.native_icon;
        let posId = GxAdParams_1.AdParams.oppo.native_icon;
        if (posId == GxAdParams_1.AdParams.oppo.native1) {
            type = GxEnum_1.ad_native_type.inter1;
        }
        else if (posId == GxAdParams_1.AdParams.oppo.native_banner) {
            type = GxEnum_1.ad_native_type.banner;
        }
        let native_data = this.getLocalNativeData(type);
        if (native_data == null || native_data === undefined) {
            return this.logi("showNativeIcon 暂无广告数据");
        }
        else {
            this.nativeIcon = new gx_ui_native_icon_1.gx_ui_native_icon();
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
    loop_get_custom_data() {
        let nextTimeLeft = (this._native_custom_inter_cache.length < 5 || this._native_custom_banner_cache.length < 5) ? GxUtils_1.default.randomInt(15, 20) * 1000 : 30000;
        setTimeout(this.initNativeAd.bind(this), nextTimeLeft);
    }
    /**
     * 盒子9宫格
     */
    initGamePortal() {
        let self = this;
        //@ts-ignore
        if (this.supportGameBox() && GxAdParams_1.AdParams.oppo.gamePortal && window["qg"].createGamePortalAd) {
            this.destroyGamePortal();
            //@ts-ignore
            this.portalAd = window["qg"].createGamePortalAd({
                adUnitId: GxAdParams_1.AdParams.oppo.gamePortal
            });
            this.portalAd.onLoad(function () {
                self.logi("game portal ad load succ");
            });
            this.portalAd.onClose(() => {
                self._game_portal_hide && this._game_portal_hide();
            });
            this.portalAd.onError(function (err) {
                self.logi("game portal ad error: " + JSON.stringify(err), "color: red");
            });
        }
    }
    showGamePortal(on_show, on_hide, show_toast = true) {
        if (!this.supportGameBox())
            return on_hide && on_hide();
        if (!this.portalAd) {
            this.initGamePortal();
        }
        if (!this.portalAd) {
            on_hide && on_hide();
            show_toast && this.createToast("努力加载中,请稍后再试~");
            return;
        }
        this._game_portal_hide = on_hide;
        this.portalAd.load().then(() => {
            this.portalAd.show().then(() => {
                this.logi("show success");
                this.hideBanner();
                on_show && on_show();
            }).catch(error => {
                this.loge("showGamePortal show error:", error);
                on_hide && on_hide();
                show_toast && this.createToast("努力加载中,请稍后再试~");
            });
        }).catch(error => {
            this.loge("showGamePortal load error:", error);
            on_hide && on_hide();
            show_toast && this.createToast("努力加载中,请稍后再试~");
        });
    }
    destroyGamePortal() {
        if (!this.portalAd)
            return;
        this.portalAd.destroy();
        this.portalAd = null;
    }
    /**
     * 盒子横幅
     */
    initGameBanner() {
        let self = this;
        //@ts-ignore
        if (window["qg"].getSystemInfoSync()["platformVersion"] >= 1076 && GxAdParams_1.AdParams.oppo.gameBanner && window["qg"].createGameBannerAd) {
            this.destroyGameBanner();
            //@ts-ignore
            this.gameBannerAd = window["qg"].createGameBannerAd({
                adUnitId: GxAdParams_1.AdParams.oppo.gameBanner
            });
            this.gameBannerAd.onLoad(function () {
                self.logi("盒子横幅广告加载成功");
            });
            this.gameBannerAd.onError(function (err) {
                self.logi(err);
            });
        }
        else {
        }
    }
    showGameBanner() {
        let self = this;
        if (!this.gameBannerAd) {
            this.initGameBanner();
        }
        if (!this.gameBannerAd)
            return;
        this.gameBannerAd.show().then(function () {
            self.logi("show success");
        }).catch(function (error) {
            self.logi("show fail with:" + error.errCode + "," + error.errMsg);
        });
    }
    hideGameBanner() {
        if (!this.gameBannerAd)
            return;
        this.gameBannerAd.hide();
    }
    destroyGameBanner() {
        if (!this.gameBannerAd)
            return;
        this.gameBannerAd.destroy();
        this.gameBannerAd = null;
    }
    /**
     * 展示添加桌面界面
     * @param on_hide
     * @param on_succ
     */
    showAddDesktop(on_close, on_succ) {
        if (Laya.stage.width >= Laya.stage.height) {
            this.addDesktop(on_succ, on_close);
            return;
        }
        if (this.addIconNode && !this.addIconNode.destroyed)
            return;
        this.addIconNode = new gx_ui_add_icon_1.default();
        this.addIconNode.show(on_close, on_succ);
        /*    if (this.addIconNode && this.addIconNode !== undefined && cc.isValid(this.addIconNode.node)) return;

            let node = cc.instantiate(Utils.getRes('gx/prefab/add_icon', cc.Prefab));
            this.addIconNode = node.getComponent('Gx_add_icon');
            this.addIconNode && this.addIconNode.show(on_close, on_succ);*/
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        //@ts-ignore
        if (this.platformVersion() >= 1044 && window["qg"].hasShortcutInstalled) {
            //@ts-ignore
            window["qg"].hasShortcutInstalled({
                success: res => {
                    // 判断图标未存在时，创建图标
                    this.logi(" hasShortcutInstalled " + (res ? "has add" : "can add"));
                    if (res == false) {
                        can_add && can_add();
                    }
                    else {
                        has_add && has_add();
                    }
                },
                fail: err => {
                    GxGame_1.default.Ad().createToast("操作频繁，请稍后再试~~");
                    this.loge(` hasShortcutInstalled error: ${JSON.stringify(err)}`);
                    on_fail && on_fail();
                },
                complete: function () {
                }
            });
        }
        else {
            on_fail && on_fail();
        }
    }
    /**创建桌面图标 */
    addDesktop(on_succ, on_fail, showToast = true) {
        //@ts-ignore
        if (this.platformVersion() >= 1040 && window["qg"].installShortcut) {
            //@ts-ignore
            window["qg"].installShortcut({
                success: () => {
                    setTimeout(() => {
                        this.hasAddDesktop(() => {
                            on_fail && on_fail();
                        }, () => {
                            on_succ && on_succ();
                        });
                    }, 1000);
                },
                fail: err => {
                    this.loge(` installShortcut error: ${JSON.stringify(err)}`);
                    on_fail && on_fail();
                    if (showToast) {
                        //@ts-ignore
                        window["qg"].showToast({
                            title: "请稍后再试",
                            icon: "none"
                        });
                    }
                }
            });
        }
        else {
            on_fail && on_fail();
        }
    }
    login(on_succ, on_fail) {
        if (this.platformVersion() >= 1040 && window["qg"].login) {
            window["qg"].login({
                success: res => {
                    on_succ && on_succ(res);
                },
                //@ts-ignore
                fail: (err) => {
                    on_fail && on_fail(err);
                }
            });
        }
    }
    reportAdClick(native_data) {
        super.reportAdClick(native_data);
        // ocpx 上传
        GxGame_1.default.uploadOcpx("gads");
    }
    /**
     * 开局自动跳转原生
     * @returns
     */
    openGameAd() {
        if (!GxGame_1.default.isShenHe && GxGame_1.default.adConfig.showBanner > 0) {
            GxTimer_1.default.once(() => {
                this.clickNative();
            }, GxGame_1.default.adConfig.showBanner * 1000);
        }
    }
    logi(...data) {
        super.LOG("[OppoAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[OppoAdapter]", ...data);
    }
    logw(...data) {
        super.LOGW("[OppoAdapter]", ...data);
    }
    showGameOverAD() {
        this.showVideo((res) => {
        }, "GxGameOverAd");
    }
}
exports.default = OppoAdapter;
