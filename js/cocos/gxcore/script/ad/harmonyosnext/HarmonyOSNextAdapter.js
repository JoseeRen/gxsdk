"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
class HarmonyOSNextAdapter extends BaseAdapter_1.default {
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
            this.instance = new HarmonyOSNextAdapter();
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
        this.initBanner();
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
        return "harmonyos_next";
    }
    showNormalBanner() {
        this.callMethod("showBanner", {}, ret => {
            if (ret == 2 /* RET_TYPE.SHOW */) {
                if (this.bannerTimer)
                    this.bannerTimer.stop();
            }
            else {
                this.closeNormalBannerTime = this.get_time();
            }
        });
    }
    hideNormalBanner() {
        this.callMethod("hideBanner", {});
    }
    destroyNormalBanner() {
        this.hideNormalBanner();
    }
    initBanner() {
        super.initBanner();
    }
    showBanner() {
        this.showNormalBanner();
    }
    hideBanner() {
        super.hideBanner();
        this.isNeedShowBanner = false;
        this.hideNormalBanner();
    }
    showVideo(complete, flag = "") {
        // 过滤多次触发
        if (this.get_time() - this.showVideoTime < 5000) {
            console.log("点击频繁---");
            return;
        }
        this.showVideoTime = this.get_time();
        super.showVideo(null, flag);
        this._videoCallEvent(flag);
        let tmflag = flag;
        if (typeof flag != "string") {
            tmflag = flag["flag"];
        }
        this.callMethod("showVideo", { flag: tmflag }, ret => {
            if (ret == -1 /* RET_TYPE.ERROR */) {
                this.createToast("暂无视频，请稍后再试");
            } /* else if (ret == RET_TYPE.CLOSE) {
                AudioUtil.setMusicVolume(1);
                AudioUtil.setSoundVolume(1);
            } else if (ret == RET_TYPE.SHOW) {
                AudioUtil.setMusicVolume(0);
                AudioUtil.setSoundVolume(0);
            }*/
            // if (flag && flag.length > 0) {
            if (ret == 1 /* RET_TYPE.SUCC */) {
                // GxGame.gameEvent("reward_complete_" + flag)
                this._videoCompleteEvent();
            }
            else {
                if (ret == -1 /* RET_TYPE.ERROR */) {
                    this._videoErrorEvent();
                    // GxGame.gameEvent("reward_error_" + flag)
                }
                else {
                    this._videoCloseEvent();
                    // GxGame.gameEvent("reward_close_" + flag)
                }
            }
            // }
            setTimeout(() => {
                //延迟下  防止字体乱
                complete && complete(ret == 1 /* RET_TYPE.SUCC */, ret == 1 /* RET_TYPE.SUCC */ ? 1 : 0);
                this.showVideoTime = 0;
            }, 100);
        });
    }
    destroyVideo() {
        this.callMethod("destroyVideo", {});
    }
    showInterstitial(on_show, on_close) {
        this.callMethod("showInter", null, ret => {
            console.log("[gx_game] showInter ret = ", ret);
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
    }
    showOtherInterstitial(on_show, on_close) {
        this.callMethod("showOtherInter", {}, ret => {
            console.log("[gx_game] showInter ret = ", ret);
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
        this.callMethod("destroyInter", {});
    }
    showInterVideo(on_show, on_close) {
        console.log("[gx_game]showInterVideo 不能用");
        this.callMethod("showFullScreen", null, ret => {
            console.log("[gx_game] 233 showFullScreen ret = ", ret);
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
    }
    showOtherInterVideo(on_show, on_close) {
        this.callMethod("showOtherFullScreen", null, ret => {
            console.log("[gx_game] hos showFullScreen ret = ", ret);
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
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        console.log("[gx_game]showInterstitialNative 不能用");
        on_hide && on_hide();
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
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 1) {
        this.showOtherInterstitial(on_show, on_hide);
    }
    hideNativeInterstitial() {
        super.hideNativeInterstitial();
    }
    openUrl(url) {
        this.callMethod("openUrl", { url: url });
    }
    showPrivacy(type = "privacy") {
        this.callMethod("showPrivacy", { type: type });
    }
    callMethod(method_name, params, callbak) {
        let result = null;
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        if (callbak && callbak !== undefined) {
            window[`onGx${listener_name}`] = callbak;
        }
        /* if (params != null && typeof params != "string") {
             params = JSON.stringify(params);
         }*/
        if (params == null) {
            params = {};
        }
        // isSync 调用的ArkTs的方法是同步方法或异步方法，如果调用异步的ArkTs方法可能会阻塞当前线程并等待异步回调的结果。
        // clsPath 脚本路径, 例如：entry/src/main/Tests/Test
        // methodName 模块名称/静态方法名称 例如：entry/test(模块名称可省略，省略为clsPath第一个字符串)
        // paramStr 方法入参, 如果是空的，需要传入'', 如果有多个参数，可以转换成JSON字符串
        // result返回值类型只支持基础的三种类型：string，number，boolean，如果需要返回复杂的类型，可以转换为json之后返回
        result = jsb.reflection.callStaticMethod(true, "entry/src/main/ets/gxbridge/GxBridge", "entry/gxCallMethod", JSON.stringify({
            method_name,
            params
        }));
        return result;
    }
    cancelAccount() {
        this.callMethod("cancelAccount", {}, () => {
            console.log("确定注销账号了");
            cc.sys.localStorage.clear();
        });
    }
    onClickBtn(type) {
        GxUtils_1.default.callMethod("onClickBtn", { type: type });
    }
}
exports.default = HarmonyOSNextAdapter;
