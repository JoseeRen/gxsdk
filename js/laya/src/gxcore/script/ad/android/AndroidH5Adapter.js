"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxAudioUtil_1 = __importDefault(require("../..//audio/GxAudioUtil"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxEnum_1 = require("../../core/GxEnum");
class AndroidH5Adapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        this.closeInterTime = 0;
        this.closeNativeTime = 0;
        this.closeNormalBannerTime = 0;
        this.showLimmitTime = 0;
        this.showVideoTime = 0;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new AndroidH5Adapter();
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
        /*
                if (this.getNativePlatform() == PLATFORM.MI) {
                    this.showLimmitTime = GxGame.adConfig.miAdGapLimt;
                }*/
        this.initBanner();
        this.initNativeAd();
    }
    _gameCd() {
        let timer = new GxTimer_1.default();
        timer.once(() => {
            this.isGameCd = false;
            if (this.isNeedShowBanner) {
                this.showBanner();
            }
        }, GxGame_1.default.adConfig.adCdTime * 1000);
    }
    getNativePlatform() {
        return this.callMethod('getNativePlatform');
    }
    showNormalBanner() {
        this.callMethod('showBanner', null, ret => {
            if (ret == 2 /* RET_TYPE.SHOW */) {
                if (this.bannerTimer)
                    this.bannerTimer.stop();
            }
            else {
                this.closeNormalBannerTime = this.get_time();
            }
        });
        /*   if (this.get_time() - this.closeNormalBannerTime < this.showLimmitTime) return;
           this.callMethod('showNormalBanner', null, ret => {
               if (ret == RET_TYPE.SHOW) {
                   if (this.bannerTimer) this.bannerTimer.stop();
               } else {
                   this.closeNormalBannerTime = this.get_time();
               }
           });*/
    }
    hideNormalBanner() {
        this.callMethod('hideBanner');
    }
    destroyNormalBanner() {
        this.hideNormalBanner();
    }
    initBanner() {
        super.initBanner();
    }
    showBanner() {
        this.showNormalBanner();
        /*  if (this.isGameCd) {
              this.isNeedShowBanner = true;
              return console.log("[gx_game]showBanner 广告CD中");
          }

          this.hideBanner();
          this.bannerDelayTimer = mTimer.once(() => {
              let is_native_banner_limit = this.get_time() - this.closeNativeTime < this.showLimmitTime;
              console.log(`[gx_game]当前${is_native_banner_limit ? '不' : ''}可以展示Banner`);

              if (is_native_banner_limit) return;

              let native_data = this.getLocalNativeData(ad_native_type.banner);

              if (this.bannerTimer == null) this.bannerTimer = new mTimer();
              if (GxGame.adConfig.bannerUpdateTime > 0) {
                  let self = this
                  this.bannerTimer.once(() => {
                      console.log('[gx_game]this.bannerTimer.once');

                      self.showBanner();
                  }, GxGame.adConfig.bannerUpdateTime * 1000);
              }

              if (native_data == null || native_data === undefined) {
                  this.showNormalBanner();
              } else {

                  let node = cc.instantiate(this.getRes('gx/prefab/ad/native_banner', cc.Prefab));
                  this.bannerNode = node.getComponent('gx_native_banner');
                  this.bannerNode.show(native_data, () => {

                  }, () => {
                      this.closeNativeTime = this.get_time();
                  });
              }
          }, 1000);*/
    }
    hideBanner() {
        super.hideBanner();
        this.isNeedShowBanner = false;
        this.hideNormalBanner();
    }
    showVideo(complete, flag = "") {
        // 过滤多次触发
        if (this.get_time() - this.showVideoTime < 500)
            return;
        this.showVideoTime = this.get_time();
        if (flag && flag.length > 0) {
            GxGame_1.default.gameEvent("reward_" + flag);
        }
        this.callMethod('showVideo', null, ret => {
            if (ret == -1 /* RET_TYPE.ERROR */) {
                this.createToast('暂无视频，请稍后再试');
            } /* else if (ret == RET_TYPE.CLOSE) {
                AudioUtil.setMusicVolume(1);
                AudioUtil.setSoundVolume(1);
            } else if (ret == RET_TYPE.SHOW) {
                AudioUtil.setMusicVolume(0);
                AudioUtil.setSoundVolume(0);
            }*/
            if (flag && flag.length > 0) {
                if (ret == 1 /* RET_TYPE.SUCC */) {
                    GxGame_1.default.gameEvent("reward_complete_" + flag);
                }
                else {
                    if (ret == -1 /* RET_TYPE.ERROR */) {
                        GxGame_1.default.gameEvent("reward_error_" + flag);
                    }
                    else {
                        GxGame_1.default.gameEvent("reward_close_" + flag);
                    }
                }
            }
            complete && complete(ret == 1 /* RET_TYPE.SUCC */);
        });
    }
    destroyVideo() {
        this.callMethod('destroyVideo');
    }
    showInterstitial(on_show, on_close) {
        this.callMethod('showInter', null, ret => {
            console.log('[gx_game] showInter ret = ', ret);
            if (ret == 2 /* RET_TYPE.SHOW */) {
                this.hideBanner();
                on_show && on_show();
            }
            else {
                if (ret == 3 /* RET_TYPE.CLOSE */) {
                    this.closeInterTime = this.get_time();
                }
                this.isNeedShowBanner = true;
                on_close && on_close();
            }
        });
        /* if (this.get_time() - this.closeInterTime < this.showLimmitTime) return on_close && on_close();
         let can_show =true;
         this.callMethod('showInter', can_show, ret => {
             console.log('[gx_game] showInter ret = ', ret);

             if (ret == RET_TYPE.SHOW) {
                 this.hideBanner();
                 on_show && on_show();
             } else {
                 if (ret == RET_TYPE.CLOSE) {
                     this.closeInterTime = this.get_time();
                 }
                 this.isNeedShowBanner = true;
                 on_close && on_close();
             }
         });*/
    }
    showOtherInterstitial(on_show, on_close) {
        this.callMethod('showOtherInter', null, ret => {
            console.log('[gx_game] showInter ret = ', ret);
            if (ret == 2 /* RET_TYPE.SHOW */) {
                this.hideBanner();
                on_show && on_show();
            }
            else {
                if (ret == 3 /* RET_TYPE.CLOSE */) {
                    this.closeInterTime = this.get_time();
                }
                this.isNeedShowBanner = true;
                on_close && on_close();
            }
        });
        /* if (this.get_time() - this.closeInterTime < this.showLimmitTime) return on_close && on_close();
         let can_show =true;
         this.callMethod('showInter', can_show, ret => {
             console.log('[gx_game] showInter ret = ', ret);

             if (ret == RET_TYPE.SHOW) {
                 this.hideBanner();
                 on_show && on_show();
             } else {
                 if (ret == RET_TYPE.CLOSE) {
                     this.closeInterTime = this.get_time();
                 }
                 this.isNeedShowBanner = true;
                 on_close && on_close();
             }
         });*/
    }
    destroyNormalInter() {
        this.callMethod('destroyInter');
    }
    showInterVideo(on_show, on_close) {
        console.log("[gx_game]showInterVideo 不能用");
        this.callMethod('showFullScreen', null, ret => {
            console.log('[gx_game] 233 showFullScreen ret = ', ret);
            if (ret == 2 /* RET_TYPE.SHOW */) {
                this.hideBanner();
                on_show && on_show();
            }
            else {
                if (ret == 3 /* RET_TYPE.CLOSE */) {
                    this.closeInterTime = this.get_time();
                }
                this.isNeedShowBanner = true;
                on_close && on_close();
            }
        });
        /*   if (this.isGameCd) {
               on_close && on_close();
               return console.log("[gx_game]showInterVideo 广告CD中");
           }

           if (this.get_time() - this.closeInterTime < this.showLimmitTime) return on_close && on_close();
           let can_show =true;
           this.callMethod('showInterVideo', can_show, ret => {
               if (ret == RET_TYPE.SHOW) {
                   on_show && on_show();
                   AudioUtil.setMusicVolume(0);
                   AudioUtil.setSoundVolume(0);
               } else {
                   if (ret == RET_TYPE.CLOSE) {
                       this.closeInterTime = this.get_time();
                   }
                   on_close && on_close();
                   AudioUtil.setMusicVolume(1);
                   AudioUtil.setSoundVolume(1);
               }
           });*/
    }
    showOtherInterVideo(on_show, on_close) {
        console.log("[gx_game]showInterVideo 不能用");
        this.callMethod('showOtherFullScreen', null, ret => {
            console.log('[gx_game] 233 showFullScreen ret = ', ret);
            if (ret == 2 /* RET_TYPE.SHOW */) {
                this.hideBanner();
                on_show && on_show();
            }
            else {
                if (ret == 3 /* RET_TYPE.CLOSE */) {
                    this.closeInterTime = this.get_time();
                }
                this.isNeedShowBanner = true;
                on_close && on_close();
            }
        });
        /*   if (this.isGameCd) {
               on_close && on_close();
               return console.log("[gx_game]showInterVideo 广告CD中");
           }

           if (this.get_time() - this.closeInterTime < this.showLimmitTime) return on_close && on_close();
           let can_show =true;
           this.callMethod('showInterVideo', can_show, ret => {
               if (ret == RET_TYPE.SHOW) {
                   on_show && on_show();
                   AudioUtil.setMusicVolume(0);
                   AudioUtil.setSoundVolume(0);
               } else {
                   if (ret == RET_TYPE.CLOSE) {
                       this.closeInterTime = this.get_time();
                   }
                   on_close && on_close();
                   AudioUtil.setMusicVolume(1);
                   AudioUtil.setSoundVolume(1);
               }
           });*/
    }
    destroyInterVideo() {
        this.callMethod('destroyInterVideo');
    }
    create_ad(ad_type) {
        return new Promise((resolve, reject) => {
            this.callMethod('createNativeAd', ad_type.toString(), ret => {
                console.log("[gx_game]native data load succ:" + JSON.stringify(ret));
                if (ret == -1 /* RET_TYPE.ERROR */) {
                }
                else {
                    try {
                        this.add_native_data(ret);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            });
            setTimeout(resolve, 100);
        });
    }
    /**原生广告 */
    initNativeAd() {
        return;
        /*        // 拉取间隔1s
                this.create_ad(ad_native_type.banner).then(() => {
                    return this.create_ad(ad_native_type.native_icon);
                }).then(() => {
                    return this.create_ad(ad_native_type.inter2);
                }).then(() => {
                    return this.create_ad(ad_native_type.inter1);
                }).then(() => {
                    this.loop_get_native_data();
                })*/
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        console.log("[gx_game]showInterstitialNative 不能用");
        on_hide && on_hide();
        /*   if (this.isGameCd || GxGame.inBlockArea) {
               on_hide && on_hide();
               return console.log("[gx_game]showInterstitialNative 广告CD中");
           }

           if (this.get_time() - this.closeNativeTime < this.showLimmitTime) return on_hide && on_hide();

           this.hideInterstitialNative();

           let native_data = this.getLocalNativeData(ad_native_type.inter1);

           if (native_data == null || native_data === undefined) {
               on_hide && on_hide();
           } else {
               this.isNeedShowBanner = false;
               let node = cc.instantiate(this.getRes('gx/prefab/ad/native_inner_interstitial', cc.Prefab));
               this.innerInter = node.getComponent('gx_native_inner_interstitial');
               this.innerInter && this.innerInter.show(parent, native_data, on_click, () => {
                   this.hideBanner();
                   on_show && on_show();
               }, () => {
                   this.closeNativeTime = this.get_time();

                   on_hide && on_hide();
               });
           }*/
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
    showNativeInterstitial(on_show, on_hide, delay_time = 1) {
        if (this.getNativePlatform() == GxEnum_1.PLATFORM.G233) {
            this.showInterVideo(on_show, on_hide);
        }
        else {
            this.showInterstitial(on_show, on_hide);
        }
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 1) {
        if (this.getNativePlatform() == GxEnum_1.PLATFORM.G233) {
            this.showOtherInterVideo(on_show, on_hide);
        }
        else {
            this.showOtherInterstitial(on_show, on_hide);
        }
    }
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
    }
    /**
     * 原生ICON
     * @param parent
     */
    showNativeIcon(parent) {
        // 特殊处理
        if (this.isGameCd) {
            return console.log("[gx_game]showNativeIcon 广告CD中");
        }
        // vivo 原生icon
        /*  if (this.platformVersion() == PLATFORM.VIVO) {
              let offset = {x: 0, y: 0};
              if (parent != null) {
                  offset.x = (parent.x - parent.anchorX * parent.width) * GxGame.scale;
                  offset.y = (parent.y - parent.anchorY * parent.height) * GxGame.scale;
              }
              this.callMethod('showNativeIcon', JSON.stringify(offset))
          } else {
              let type = ad_native_type.native_icon;
              let posId = GxGame.adConfig.adunit_native[type];
              if (posId == GxGame.adConfig.adunit_native[ad_native_type.inter1]) {
                  type = ad_native_type.inner_interstitial;
              } else if (posId == GxGame.adConfig.adunit_native[ad_native_type.banner]) {
                  type = ad_native_type.banner;
              }
              let native_data = this.getLocalNativeData(type);

              if (native_data == null || native_data === undefined) {
                  return console.log("[gx_game]showNativeIcon 暂无广告数据");
              } else {
                  let node = cc.instantiate(this.getRes('gx/prefab/ad/native_icon', cc.Prefab));
                  this.nativeIcon = node.getComponent('gx_native_icon');
                  this.nativeIcon && this.nativeIcon.show(parent, native_data);
              }
          }*/
    }
    /**隐藏原生ICON */
    hideNativeIcon() {
        super.hideNativeIcon();
        if (this.platformVersion() == GxEnum_1.PLATFORM.VIVO) {
            this.callMethod('hideNativeIcon');
        }
    }
    /**
     * 每隔n秒加载一条数据，保持数组内各类型数据有5条
     */
    loop_get_native_data() {
        let nextTimeLeft = this._native_data_cache.length < 5 ? GxUtils_1.default.randomInt(15, 20) * 1000 : 30000;
        setTimeout(this.initNativeAd.bind(this), nextTimeLeft);
    }
    reportAdClick(native_data) {
        if (!native_data || native_data === undefined)
            return;
        this.callMethod('reportAdClick', native_data.adId);
        this.remove_native_data(native_data);
    }
    showFeedAd(on_show, on_close) {
        if (this.isGameCd) {
            return console.log("[gx_game]showFeedAd 广告CD中");
        }
        this.callMethod('showFeedAd', null, ret => {
            if (ret == 2 /* RET_TYPE.SHOW */) {
                on_show && on_show();
                GxAudioUtil_1.default.setMusicVolume(0);
                GxAudioUtil_1.default.setSoundVolume(0);
            }
            else {
                on_close && on_close();
                GxAudioUtil_1.default.setMusicVolume(1);
                GxAudioUtil_1.default.setSoundVolume(1);
            }
        });
    }
    destroyFeedAd() {
        this.callMethod('destroyFeedAd');
    }
    showGamePortal() {
        this.callMethod('jumpLeisureSubject');
    }
    openUrl(url) {
        this.callMethod('openUrl', url);
    }
    showPrivacy(type = "privacy") {
        this.callMethod('showPrivacy', type);
    }
    showVivoIcon() {
        this.callMethod('showVivoIcon');
    }
    hideVivoIcon() {
        this.callMethod('hideVivoIcon');
    }
    callMethod(method_name, params = null, callbak) {
        let result = null;
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        if (callbak && callbak !== undefined) {
            window[`onGx${listener_name}`] = callbak;
        }
        if (params == null) {
            result = window["H5Bridge"][method_name]();
        }
        else {
            result = window["H5Bridge"][method_name](params);
        }
        return result;
    }
    supportGameBox() {
        if (this.getNativePlatform() == GxEnum_1.PLATFORM.OPPO || this.getNativePlatform() == GxEnum_1.PLATFORM.VIVO) {
            return true;
        }
        return false;
    }
    backGameHall() {
        this.callMethod('backGameHall');
    }
    getGameAge() {
        return this.callMethod('getGameAge');
    }
    getConfigUrl() {
        return this.callMethod('getConfigUrl');
    }
    jumpGame(url) {
        return this.callMethod('jumpGame', url);
    }
}
exports.default = AndroidH5Adapter;
