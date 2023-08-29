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
const TDSDK_1 = __importDefault(require("../../td/TDSDK"));
// https://dev.mi.com/distribute/doc/details?pId=1102#_7
/*json文件是包名.json  放到src目录下*/
class MiAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.bannerIdx = 1;
        this.firstBanner = true;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new MiAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        // this.getDeviceId();
        GxGame_1.default.adConfig.bannerUpdateTime = 5;
        GxGame_1.default.adConfig.useNative = true;
        this.getGameInfo();
        GxGame_1.default.adConfig.interTick = 30;
        GxGame_1.default.adConfig.bannerTick = 30;
        GxGame_1.default.adConfig.adCdTime = GxGame_1.default.getValue("delay", 30);
        let label = GxGame_1.default.getLabel("switch");
        if (label) {
            GxGame_1.default.adConfig.adCdTime = 0;
        }
        this.isGameCd = GxGame_1.default.adConfig.adCdTime > 0;
        this.logi("广告冷却：" + this.isGameCd);
        super.initAd();
        let channel = "miDefault";
        if (this.manifestInfo != null) {
            channel = this.manifestInfo.package.replace(/\./g, "_");
        }
        TDSDK_1.default.getInstance().init("6D92901997C943FE9A91798414E30C6C", channel);
        this._gameCd();
        this.initBanner();
        this.initNormalBanner();
        this.initVideo();
        this.initNativeAd();
        this.initGamePortal();
        // ocpx 上传
        GxTimer_1.default.loop(() => {
            GxGame_1.default.uploadOcpx('gtime');
        }, 6e4);
    }
    getDeviceId() {
        if (window["qg"].getDeviceId) {
            window["qg"].getDeviceId({
                success: data => {
                    this.logi(`deviceId get success: ${data}`);
                    if (data && data.deviceId && DataStorage_1.default.deviceid != data.deviceId) {
                        DataStorage_1.default.deviceid = data.deviceId;
                    }
                    this.logi(DataStorage_1.default.deviceid);
                },
                fail: (data, code) => {
                    this.loge(`deviceId  get fail, code = ${code}`);
                },
            });
        }
    }
    getGameInfo() {
        if (window["qg"].getManifestInfo) {
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
        // @ts-ignore
        if (!qg["createBannerAd"] || GxAdParams_1.AdParams.mi.banner.length <= 0) {
            this.logi("环境不支持banner  或者banner广告参数空");
            return;
        }
        this.destroyNormalBanner();
        let screenWidth = GxGame_1.default.screenWidth;
        let screenHeight = GxGame_1.default.screenHeight;
        console.log("scree:" + screenWidth);
        console.log("screenHeight:" + screenHeight);
        let width = 500;
        let height = 200;
        let bannerShowTop = GxAdParams_1.AdParams.mi.bannerOnTop;
        if (screenWidth > screenHeight) {
            width = 900;
            height = 200;
        }
        else {
            width = 900;
            height = 200;
        }
        let style = {
            left: (screenWidth - screenWidth * 0.4) / 2,
            top: screenHeight - (screenWidth * 0.4 * (88 / 208)) + 80,
            width: 1000,
        };
        if (bannerShowTop) {
            style["top"] = 0;
        }
        this.bannerAd = window["qg"].createBannerAd({
            adUnitId: GxAdParams_1.AdParams.mi.banner,
            style: style
        });
        let setEnd = false;
        this.bannerAd.onError(err => {
            this.loge('normal banner error: ', JSON.stringify(err));
        });
        this.bannerAd.onClose(err => {
            this.loge('normal banner close: ');
            this.bannerShowTime = this.get_time();
            // if (this.bannerAd) {
            //     this.bannerAd.destroy()
            // }
            // this.bannerAd = null;
        });
        this.bannerAd.onResize(res => {
            this.loge('normal banner onResize: ', JSON.stringify(res));
            if (!setEnd) {
                if (this.bannerAd) {
                    this.loge('normal banner 改变: ');
                    if (screenWidth > screenHeight) {
                        this.bannerAd.style.top = screenHeight - (screenWidth * 0.4 * (88 / 208)) + 80;
                    }
                }
            }
            setEnd = false;
        });
    }
    /**
     * 展示普通banner
     */
    showNormalBanner(showCallback, failedCallback) {
        if (this.get_time() - this.bannerShowTime <= GxGame_1.default.adConfig.bannerTick * 1000 || GxGame_1.default.isShenHe || GxGame_1.default.inBlockArea) {
            this.logi("限制了2banner");
            return failedCallback && failedCallback();
        }
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
            if (this.bannerAd) {
                //不设置下面的话  banner 的left不生效？？？
                if (GxGame_1.default.screenWidth > GxGame_1.default.screenHeight) {
                    this.bannerAd.style.top = GxGame_1.default.screenHeight - (GxGame_1.default.screenWidth * 0.4 * (88 / 208)) + 80;
                    this.bannerAd.style.height = this.bannerAd.style.realHeight;
                    this.bannerAd.style.top = GxGame_1.default.screenHeight - 65;
                }
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
            this.bannerAd.destroy();
        }
        this.bannerAd = null;
        console.log("销毁banner");
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
        // if (this.isGameCd) {
        //     this.isNeedShowBanner = true;
        //     failedCallback && failedCallback()
        //     this.logi("showBanner 广告CD中")
        //     return;
        // }
        if (this.get_time() - this.bannerShowTime <= GxGame_1.default.adConfig.bannerTick * 1000 || GxGame_1.default.isShenHe || GxGame_1.default.inBlockArea) {
            this.logi("限制了2banner");
            return failedCallback && failedCallback();
        }
        if (!this.firstBanner) {
            this.hideBanner();
        }
        this.firstBanner = false;
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
        console.log("进入hideBanner");
        if (this.customBanner) {
            this.customBanner.hide();
            this.customBanner.destroy();
            this.customBanner = null;
        }
        this.hideNormalBanner();
    }
    initVideo() {
        if (!GxAdParams_1.AdParams.mi.video) {
            this.logi("video广告位参数空");
            return;
        }
        this.destroyVideo();
        this.videoAd = window["qg"].createRewardedVideoAd({
            adUnitId: GxAdParams_1.AdParams.mi.video
        });
        this.videoAd.onLoad(() => {
            this.logi("video load succ");
        });
        this.videoAd.onError((err) => {
            this.logi("video error: " + JSON.stringify(err), "color: red");
        });
        this.videoAd.onClose(res => {
            if (res && res.isEnded) {
                this.videocallback && this.videocallback(true);
            }
            else {
                this.videocallback && this.videocallback(false);
                /*   let node = cc.instantiate(Utils.getRes('hs_ui/ui_watch_video', cc.Prefab));
                   let ui_watch_video = node.getComponent('hs_ui_watch_video');
                   ui_watch_video && ui_watch_video.show(() => {
                       this.showVideo(this.videocallback);
                   });*/
            }
            this.videoAd.load();
        });
        this.videoAd.load();
    }
    showVideo(complete, flag = "") {
        if (this.videoAd == null) {
            this.initVideo();
        }
        if (this.videoAd == null) {
            this.createToast('暂无视频，请稍后再试');
            complete && complete(false);
            return;
        }
        this.videocallback = complete;
        this.videoAd.show().then(() => {
        }).catch(() => {
            this.createToast('暂无视频，请稍后再试');
            complete && complete(false);
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
                posId = GxAdParams_1.AdParams.mi.native_banner;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.mi.native1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.mi.native2;
            }
            this.logi(ad_type, 'posId = ', posId);
            // @ts-ignore
            if (posId == '' || posId === undefined || posId == null || this.is_limit_native_length(ad_type) || !qg["createNativeAd"])
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
            posId = GxAdParams_1.AdParams.mi.native_banner || GxAdParams_1.AdParams.mi.native_custom_banner;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.mi.native_custom_banner;
            }
        }
        else if (ad_type == GxEnum_1.ad_native_type.inter1) {
            posId = GxAdParams_1.AdParams.mi.native1 || GxAdParams_1.AdParams.mi.native_custom1;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.mi.native_custom1;
            }
        }
        else if (ad_type == GxEnum_1.ad_native_type.inter2) {
            posId = GxAdParams_1.AdParams.mi.native2 || GxAdParams_1.AdParams.mi.native_custom2;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.mi.native_custom2;
            }
        }
        if (ad_type == GxEnum_1.ad_native_type.banner) {
            if (GxAdParams_1.AdParams.mi.bannerOnTop) {
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
        this.logi(ad_type, 'posId = ', posId);
        if (posId == '' || posId === undefined || posId == null || !window["qg"].createCustomAd)
            return null;
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
                posId = GxAdParams_1.AdParams.mi.native_banner || GxAdParams_1.AdParams.mi.native_custom_banner;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.mi.native1 || GxAdParams_1.AdParams.mi.native_custom1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.mi.native2 || GxAdParams_1.AdParams.mi.native_custom2;
            }
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                if (GxAdParams_1.AdParams.mi.bannerOnTop) {
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
            this.logi(ad_type, 'posId = ', posId);
            if (posId == '' || posId === undefined || posId == null || window["qg"].createCustomAd)
                return resolve(null);
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
            let node = cc.instantiate(GxUtils_1.default.getRes('gx/prefab/ad/native_inner_interstitial', cc.Prefab));
            this.innerInter = node.getComponent('gx_native_inner_interstitial');
            this.innerInter && this.innerInter.show(parent, native_data, on_click, () => {
                // this.hideBanner();
                on_show && on_show();
            }, on_hide);
        }
    }
    /**普通插屏 */
    showInterstitial(on_show, on_close) {
        this.logi("普通 插屏");
        // @ts-ignore
        if (!qg["createInterstitialAd"] || GxAdParams_1.AdParams.mi.inter == null || GxAdParams_1.AdParams.mi.inter.length == 0) {
            return on_close && on_close();
        }
        this.destroyNormalInter();
        // this.hideBanner();
        // @ts-ignore
        this.interAd = qg.createInterstitialAd({
            adUnitId: GxAdParams_1.AdParams.mi.inter
        });
        let self = this;
        this.interAd.onLoad(() => {
            self.logi("插屏广告加载");
            this.interAd.show();
            on_show && on_show();
        });
        this.interAd.onError((err) => {
            this.logi('普通插屏展示失败' + JSON.stringify(err));
            on_close && on_close();
        });
        this.interAd.onClose(() => {
            self.logi("插屏广告关闭");
            this.interShowTime = this.get_time();
            on_close && on_close();
        });
        /*  this.interAd.load().then(res => {
              return this.interAd.show()
          }).then(() => {
              // this.hideBanner();
              this.interShowTime = this.get_time();
          }).catch(err => {
              this.logi('普通插屏展示失败' + JSON.stringify(err));
              on_close && on_close();
          });*/
    }
    destroyNormalInter() {
        if (this.interAd) {
            this.interAd.offLoad();
            this.interAd.offError();
        }
        this.interAd = null;
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
        /*  let label = GxGame.getLabel("switch");
          if (!label) {
              this.logi("限制了1")
              on_hide && on_hide()
              return
          }*/
        if (this.isGameCd) {
            on_hide && on_hide();
            this.logi("showNativeInterstitial 广告CD中");
            return;
        }
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000 || GxGame_1.default.isShenHe || GxGame_1.default.inBlockArea) {
            this.logi("限制了2");
            return on_hide && on_hide();
        }
        GxTimer_1.default.once(() => {
            this.hideNativeInterstitial();
            // this.hideBanner();
            let native_data = null;
            let tmpInter = 0;
            //循环加兜底
            if (GxGame_1.default.adConfig.useNative) {
                if (this.interIdx % 2 == 1) {
                    this.logi(" useNative interIdx:" + this.interIdx);
                    native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
                    tmpInter = GxEnum_1.ad_native_type.inter1;
                    if (native_data == null || native_data === undefined) {
                        native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
                        tmpInter = GxEnum_1.ad_native_type.inter2;
                    }
                }
                else {
                    this.logi(" useNative inter222Idx:" + this.interIdx);
                    this.logi("调用普通插屏");
                    this.interIdx++;
                    this.showInterstitial(on_show, on_hide);
                    return;
                    /*     native_data = this.getLocalNativeData(ad_native_type.inter2);
                         tmpInter = ad_native_type.inter2

                         if (native_data == null || native_data === undefined) {
                             native_data = this.getLocalNativeData(ad_native_type.inter1);
                             tmpInter = ad_native_type.inter1

                         } else {
                             this.logi("调用普通插屏")
                             this.interIdx++;
                             this.showInterstitial(on_show, on_hide);

                             return
                         }*/
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
            this.logi("interIdx:" + this.interIdx);
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
                    let node = cc.instantiate(GxUtils_1.default.getRes('gx/prefab/ad/native_interstitial', cc.Prefab));
                    this.nativeInter = node.getComponent('gx_native_interstitial');
                    this.nativeInter && this.nativeInter.show(native_data, () => {
                        // this.hideBanner();
                        on_show && on_show();
                    }, () => {
                        this.interShowTime = this.get_time();
                        on_hide && on_hide();
                    });
                }
                else {
                    if (this.customInter) {
                        this.customInter.destroy();
                        this.customInter = null;
                    }
                    this.logi("custom inter ");
                    native_data.onHide(() => {
                        this.interShowTime = this.get_time();
                        // console.log("隐藏block")
                        if (window["cc"]) {
                            let childByName = cc.director.getScene().getChildByName("BLOCK");
                            if (childByName) {
                                childByName.destroy();
                            }
                        }
                        native_data && native_data.offHide();
                        on_hide && on_hide();
                    });
                    native_data
                        .show()
                        .then(() => {
                        // console.log("显示block")
                        if (window["cc"]) {
                            let childByName = cc.director.getScene().getChildByName("BLOCK");
                            if (!childByName) {
                                let node = new cc.Node();
                                node.width = 2000;
                                node.height = 2000;
                                node.name = "BLOCK";
                                cc.director.getScene().addChild(node);
                                node.zIndex = cc.macro.MAX_ZINDEX;
                                node.addComponent(cc.BlockInputEvents);
                                let winSize = cc.winSize;
                                node.x = winSize.width / 2;
                                node.y = winSize.height / 2;
                            }
                        }
                        this.customInter = native_data;
                        this.logi("show custom inter  success");
                        on_show && on_show();
                    })
                        .catch((error) => {
                        this.logi("show custom inter fail with:" + error.errCode + "," + error.errMsg);
                        on_hide && on_hide();
                    });
                }
            }
        }, (GxGame_1.default.isShenHe || GxGame_1.default.inBlockArea) ? 0 : delay_time * 1000);
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        this.showNativeInterstitial(on_show, on_hide, delay_time);
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
        let posId = GxAdParams_1.AdParams.mi.native_icon;
        if (posId == GxAdParams_1.AdParams.mi.native1) {
            type = GxEnum_1.ad_native_type.inter1;
        }
        else if (posId == GxAdParams_1.AdParams.mi.native_banner) {
            type = GxEnum_1.ad_native_type.banner;
        }
        let native_data = this.getLocalNativeData(type);
        if (native_data == null || native_data === undefined) {
            return this.logi("showNativeIcon 暂无广告数据");
        }
        else {
            let node = cc.instantiate(GxUtils_1.default.getRes('gx/prefab/ad/native_icon', cc.Prefab));
            this.nativeIcon = node.getComponent('gx_native_icon');
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
        if (this.supportGameBox() && GxAdParams_1.AdParams.mi.gamePortal && window["qg"].createGamePortalAd) {
            this.destroyGamePortal();
            this.portalAd = window["qg"].createGamePortalAd({
                adUnitId: GxAdParams_1.AdParams.mi.gamePortal
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
            show_toast && this.createToast('努力加载中,请稍后再试~');
            return;
        }
        this._game_portal_hide = on_hide;
        this.portalAd.load().then(() => {
            this.portalAd.show().then(() => {
                this.logi('show success');
                this.hideBanner();
                on_show && on_show();
            }).catch(error => {
                this.loge('showGamePortal show error:', error);
                on_hide && on_hide();
                show_toast && this.createToast('努力加载中,请稍后再试~');
            });
        }).catch(error => {
            this.loge('showGamePortal load error:', error);
            on_hide && on_hide();
            show_toast && this.createToast('努力加载中,请稍后再试~');
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
        if (!window["qg"].createGameBannerAd && GxAdParams_1.AdParams.mi.gameBanner && window["qg"].createGameBannerAd) {
            this.destroyGameBanner();
            this.gameBannerAd = window["qg"].createGameBannerAd({
                adUnitId: GxAdParams_1.AdParams.mi.gameBanner
            });
            this.gameBannerAd.onLoad(function () {
                self.logi('盒子横幅广告加载成功');
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
            self.logi('show success');
        }).catch(function (error) {
            self.logi('show fail with:' + error.errCode + ',' + error.errMsg);
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
     * @param on_close
     * @param on_succ
     */
    showAddDesktop(on_close, on_succ) {
        if (this.addIconNode && this.addIconNode !== undefined && cc.isValid(this.addIconNode.node))
            return;
        let node = cc.instantiate(GxUtils_1.default.getRes('gx/prefab/add_icon', cc.Prefab));
        this.addIconNode = node.getComponent('Gx_add_icon');
        this.addIconNode && this.addIconNode.show(on_close, on_succ);
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        if (window["qg"].hasShortcutInstalled && window["qg"].hasShortcutInstalled) {
            window["qg"].hasShortcutInstalled({
                success: res => {
                    // 判断图标未存在时，创建图标
                    this.logi(" hasShortcutInstalled " + (res ? 'has add' : 'can add'));
                    if (res == false) {
                        can_add && can_add();
                    }
                    else {
                        has_add && has_add();
                    }
                },
                fail: err => {
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
    addDesktop(on_succ, on_fail) {
        if (window["qg"].installShortcut && window["qg"].installShortcut) {
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
                    window["qg"].showToast({
                        title: "请稍后再试",
                        icon: "none",
                    });
                }
            });
        }
        else {
            on_fail && on_fail();
        }
    }
    login(on_succ, on_fail) {
        // if (this.platformVersion() >= 1040 && window["qg"].login) {
        if (window["qg"].login) {
            window["qg"].login({
                success: res => {
                    on_succ && on_succ(res);
                },
                fail: (err) => {
                    on_fail && on_fail(err);
                }
            });
        }
        else {
            on_fail && on_fail("no login");
        }
    }
    reportAdClick(native_data) {
        super.reportAdClick(native_data);
        // ocpx 上传
        GxGame_1.default.uploadOcpx('gads');
    }
    /**
     * 开局自动跳转原生
     * @returns
     */
    openGameAd() {
        if (!GxGame_1.default.isShenHe && !GxGame_1.default.inBlockArea && GxGame_1.default.adConfig.showBanner > 0) {
            GxTimer_1.default.once(() => {
                this.clickNative();
            }, GxGame_1.default.adConfig.showBanner * 1000);
        }
    }
    logi(...data) {
        super.LOG("[MiAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[MiAdapter]", ...data);
    }
}
exports.default = MiAdapter;
