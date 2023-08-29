"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
class H54399Adapter extends BaseAdapter_1.default {
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
            this.instance = new H54399Adapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        this.isGameCd = GxGame_1.default.adConfig.adCdTime > 0;
        super.initAd();
        this.initBanner();
        this.initNativeAd();
    }
    getNativePlatform() {
        return "";
    }
    showNormalBanner() {
        /*   GxUtils.callMethod('showBanner', null, ret => {
               if (ret == RET_TYPE.SHOW) {
                   if (this.bannerTimer) this.bannerTimer.stop();
               } else {
                   this.closeNormalBannerTime = this.get_time();
               }
           });*/
    }
    hideNormalBanner() {
        // GxUtils.callMethod('hideBanner');
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
        //
        // this.hideNormalBanner();
    }
    showVideo(complete, flag = "") {
        // 过滤多次触发
        if (this.get_time() - this.showVideoTime < 500)
            return;
        this.showVideoTime = this.get_time();
        let self = this;
        /**
         * 此callback回调函数的形式
         *
         * @param obj  广告状态
         */
        function callback(obj) {
            console.log("代码:" + obj.code);
            if (obj.code === 10000) {
                cc.audioEngine.setEffectsVolume(0);
                cc.audioEngine.setMusicVolume(0);
                cc.director.pause();
                console.log("开始播放");
            }
            else if (obj.code === 10001) {
                console.log("播放结束");
                cc.director.resume();
                cc.audioEngine.setEffectsVolume(1);
                cc.audioEngine.setMusicVolume(1);
                complete && complete(true);
            }
            else {
                cc.director.resume();
                cc.audioEngine.setEffectsVolume(1);
                cc.audioEngine.setMusicVolume(1);
                // AD.showToast("广告异常，明天再来吧~")
                console.log("广告异常");
                // @ts-ignore
                window.h5api.canPlayAd((data) => {
                    if (data.remain <= 0) {
                        // self.createToast('暂无视频，请明天再来');
                    }
                    else {
                        self.createToast('暂无视频，请稍后再试');
                    }
                });
                complete && complete(false);
            }
        }
        /**
         * 播放全屏广告
         * @param callback   播放广告时的广告状态回调函数
         */
        // @ts-ignore
        window.h5api.playAd(callback);
        /*       GxUtils.callMethod('showVideo', null, ret => {
                   if (ret == RET_TYPE.ERROR) {
                       this.createToast('暂无视频，请稍后再试');
                   }/!* else if (ret == RET_TYPE.CLOSE) {
                       AudioUtil.setMusicVolume(1);
                       AudioUtil.setSoundVolume(1);
                   } else if (ret == RET_TYPE.SHOW) {
                       AudioUtil.setMusicVolume(0);
                       AudioUtil.setSoundVolume(0);
                   }*!/
                   complete && complete(ret == RET_TYPE.SUCC);
               });*/
    }
    destroyVideo() {
        // GxUtils.callMethod('destroyVideo');
    }
    showInterstitial(on_show, on_close) {
        /*      GxUtils.callMethod('showInter', null, ret => {
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
        // GxUtils.callMethod('destroyInter');
    }
    showInterVideo(on_show, on_close) {
        console.log("[gx_game]showInterVideo 不能用");
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
        // GxUtils.callMethod('destroyInterVideo');
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
        /*  return
          // 拉取间隔1s
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
        this.showInterstitial(on_show, on_hide);
        /*    if (this.get_time() - this.closeNativeTime < this.showLimmitTime
                || this.get_time() - this.interShowTime <= GxGame.adConfig.interTick * 1000
                || this.isGameCd) {
                on_hide && on_hide();
                return console.log("[gx_game]showNativeInterstitial 广告CD中");
            }

            this.hideNativeInterstitial();

            if (!this.nativeInterTimer) {
                this.nativeInterTimer = new mTimer();
            }
            this.nativeInterTimer.once(() => {
                this.isNeedShowBanner = false;
                let native_data = this.getLocalNativeData(ad_native_type.inter2);
                if (native_data == null || native_data === undefined) {
                    console.log('[gx_game] 普通插屏');
                    this.showInterstitial(on_show, on_hide);
                } else {
           /!*         console.log('[gx_game] 插屏概率', GxGame.adConfig.showInterRto);
                    if (GxUtils.randomInt(1, 100) > GxGame.adConfig.showInterRto) return on_hide && on_hide();*!/
                    let node = cc.instantiate(GxUtils.getRes('gx/prefab/ad/native_interstitial', cc.Prefab));
                    this.nativeInter = node.getComponent('gx_native_interstitial');
                    console.log('[gx_game] 插屏展示', JSON.stringify(native_data))
                    this.nativeInter.show(native_data, () => {
                        this.interShowTime = this.get_time();
                        this.hideBanner();
                        on_show && on_show();
                    }, () => {
                        this.closeNativeTime = this.get_time();
                        this.isNeedShowBanner = true;
                        on_hide && on_hide();
                    });
                }
            }, (GxGame.isShenHe || GxGame.inBlockArea) ? 0 : delay_time * 1000);*/
    }
    supportGameBox() {
        return false;
    }
}
exports.default = H54399Adapter;
