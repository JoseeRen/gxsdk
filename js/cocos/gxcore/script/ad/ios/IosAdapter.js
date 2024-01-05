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
class IosAdapter extends BaseAdapter_1.default {
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
            this.instance = new IosAdapter();
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
        return GxUtils_1.default.callMethod('getNativePlatform');
    }
    showNormalBanner() {
        GxUtils_1.default.callMethod('showBanner', null, ret => {
            if (ret == 2 /* RET_TYPE.SHOW */) {
                if (this.bannerTimer)
                    this.bannerTimer.stop();
            }
            else {
                this.closeNormalBannerTime = this.get_time();
            }
        });
        /*   if (this.get_time() - this.closeNormalBannerTime < this.showLimmitTime) return;
           GxUtils.callMethod('showNormalBanner', null, ret => {
               if (ret == RET_TYPE.SHOW) {
                   if (this.bannerTimer) this.bannerTimer.stop();
               } else {
                   this.closeNormalBannerTime = this.get_time();
               }
           });*/
    }
    hideNormalBanner() {
        GxUtils_1.default.callMethod('hideBanner');
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

                  let node = cc.instantiate(GxUtils.getRes('gx/prefab/ad/native_banner', cc.Prefab));
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
        super.showVideo(null, flag);
        GxUtils_1.default.callMethod('showVideo', null, ret => {
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
                    // GxGame.gameEvent("reward_complete_" + flag)
                    this._videoCompleteEvent();
                }
                else {
                    if (ret == -1 /* RET_TYPE.ERROR */) {
                        // GxGame.gameEvent("reward_error_" + flag)
                        this._videoErrorEvent();
                    }
                    else {
                        // GxGame.gameEvent("reward_close_" + flag)
                        this._videoCloseEvent();
                    }
                }
            }
            setTimeout(() => {
                //延迟下  防止字体乱
                complete && complete(ret == 1 /* RET_TYPE.SUCC */);
            }, 500);
        });
    }
    destroyVideo() {
        GxUtils_1.default.callMethod('destroyVideo');
    }
    showInterstitial(on_show, on_close) {
        GxUtils_1.default.callMethod('showInter', null, ret => {
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
         GxUtils.callMethod('showInter', can_show, ret => {
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
        GxUtils_1.default.callMethod('showOtherInter', null, ret => {
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
         GxUtils.callMethod('showInter', can_show, ret => {
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
        GxUtils_1.default.callMethod('destroyInter');
    }
    showInterVideo(on_show, on_close) {
        console.log("[gx_game]showInterVideo 不能用");
        GxUtils_1.default.callMethod('showFullScreen', null, ret => {
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
           GxUtils.callMethod('showInterVideo', can_show, ret => {
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
        GxUtils_1.default.callMethod('showOtherFullScreen', null, ret => {
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
           GxUtils.callMethod('showInterVideo', can_show, ret => {
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
        GxUtils_1.default.callMethod('destroyInterVideo');
    }
    create_ad(ad_type) {
        return new Promise((resolve, reject) => {
            GxUtils_1.default.callMethod('createNativeAd', ad_type.toString(), ret => {
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
        // 拉取间隔1s
        this.create_ad(GxEnum_1.ad_native_type.banner).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.native_icon);
        }).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.inter2);
        }).then(() => {
            return this.create_ad(GxEnum_1.ad_native_type.inter1);
        }).then(() => {
            this.loop_get_native_data();
        });
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
               let node = cc.instantiate(GxUtils.getRes('gx/prefab/ad/native_inner_interstitial', cc.Prefab));
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
        if (GxUtils_1.default.getNativePlatform() == GxEnum_1.PLATFORM.G233) {
            this.showInterVideo(on_show, on_hide);
        }
        else {
            this.showInterstitial(on_show, on_hide);
        }
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 1) {
        if (GxUtils_1.default.getNativePlatform() == GxEnum_1.PLATFORM.G233) {
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
              GxUtils.callMethod('showNativeIcon', JSON.stringify(offset))
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
                  let node = cc.instantiate(GxUtils.getRes('gx/prefab/ad/native_icon', cc.Prefab));
                  this.nativeIcon = node.getComponent('gx_native_icon');
                  this.nativeIcon && this.nativeIcon.show(parent, native_data);
              }
          }*/
    }
    /**隐藏原生ICON */
    hideNativeIcon() {
        super.hideNativeIcon();
        if (this.platformVersion() == GxEnum_1.PLATFORM.VIVO) {
            GxUtils_1.default.callMethod('hideNativeIcon');
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
        GxUtils_1.default.callMethod('reportAdClick', native_data.adId);
        this.remove_native_data(native_data);
    }
    showFeedAd(on_show, on_close) {
        if (this.isGameCd) {
            return console.log("[gx_game]showFeedAd 广告CD中");
        }
        GxUtils_1.default.callMethod('showFeedAd', null, ret => {
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
        GxUtils_1.default.callMethod('destroyFeedAd');
    }
    showGamePortal() {
        GxUtils_1.default.callMethod('jumpLeisureSubject');
    }
    openUrl(url) {
        GxUtils_1.default.callMethod('openUrl', url);
    }
    showPrivacy(type = "privacy") {
        GxUtils_1.default.callMethod('showPrivacy', type);
    }
    showVivoIcon() {
        GxUtils_1.default.callMethod('showVivoIcon');
    }
    hideVivoIcon() {
        GxUtils_1.default.callMethod('hideVivoIcon');
    }
    supportGameBox() {
        if (this.getNativePlatform() == GxEnum_1.PLATFORM.OPPO || this.getNativePlatform() == GxEnum_1.PLATFORM.VIVO) {
            return true;
        }
        return false;
    }
}
exports.default = IosAdapter;
