"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseGxConstant {
    static get IS_WEB_GAME() {
        let ret = true;
        if (this.IS_IOS_NATIVE || this.IS_ANDROID_NATIVE)
            return false;
        for (let name in this) {
            if (name == 'IS_WEB_GAME')
                continue;
            if (name.search(/IS_.*?_GAME$/i) >= 0) {
                ret = ret && !this[name];
            }
            if (!ret)
                return ret;
        }
        return ret;
    }
    static get PLATFORM_CODE() {
        let code = 0;
        if (this.IS_WECHAT_GAME) {
            code = 1;
        }
        else if (this.IS_QQ_GAME) {
            code = 2;
        }
        else if (this.IS_OPPO_GAME) {
            code = 3;
        }
        else if (this.IS_VIVO_GAME) {
            code = 4;
        }
        else if (this.IS_BAIDU_GAME) {
            code = 5;
        }
        else if (this.IS_TT_GAME) {
            code = 6;
        }
        else if (this.IS_HUAWEI_GAME) {
            code = 7;
        }
        else if (this.IS_MEIZU_GAME) {
            code = 8;
        }
        else if (this.IS_UC_GAME) {
            code = 9;
        }
        return code;
    }
}
/*
    /!**请求地址 *!/
    static readonly BASE_URL = "https://gamesdata.hongshunet.com:8443/";

    /!**是否原生平台 *!/
    static readonly IS_IOS = window['conchConfig'] && window['conchConfig'].getOS() == "Conch-ios";

    static readonly IS_ANDROID = window['conchConfig'] && window['conchConfig'].getOS() == "Conch-android";

    /!**微信小游戏 *!/
    static readonly IS_WECHAT_GAME = (Laya.Browser.onMiniGame || typeof window['wx'] != 'undefined') && window['tt'] == undefined;

    /!**QQ小游戏 *!/
    static readonly IS_QQ_GAME = Laya.Browser.onQQMiniGame || typeof window['qq'] != 'undefined';

    /!**OPPO小游戏 *!/
    static readonly IS_OPPO_GAME = Laya.Browser.onQGMiniGame || typeof window['qg'] != 'undefined' && window['qg'].getProvider() == 'OPPO';

    /!**VIVO小游戏 *!/
    static readonly IS_VIVO_GAME = Laya.Browser.onVVMiniGame || typeof window['qg'] != 'undefined' && window['qg'].getProvider() == 'vivo';

    /!**百度小游戏 *!/
    static readonly IS_BAIDU_GAME = Laya.Browser.onBDMiniGame || typeof window['swan'] != 'undefined';

    /!**字节小游戏 *!/
    static readonly IS_BYTEDANCE_GAME = Laya.Browser.onTTMiniGame || typeof window['tt'] != 'undefined';

    /!**华为小游戏 *!/
    static readonly IS_HUAWEI_GAME = Laya.Browser.onHWMiniGame || typeof window['hbs'] != 'undefined';

    /!**魅族小游戏 *!/
    static readonly IS_MEIZU_GAME = typeof window['mz_jsb'] != 'undefined';

    /!**UC小游戏 *!/
    static readonly IS_UC_GAME = typeof window['uc'] != 'undefined';

    /!**快手小游戏 *!/
    static readonly IS_KS_GAME = typeof window['ks'] != 'undefined';
*/
/**vivo小游戏*/
BaseGxConstant.IS_VIVO_GAME = false;
/**oppo小游戏*/
BaseGxConstant.IS_OPPO_GAME = false;
/**小米小游戏*/
BaseGxConstant.IS_MI_GAME = false;
/*苹果原生*/
BaseGxConstant.IS_IOS_NATIVE = false;
/**苹果h5*/
BaseGxConstant.IS_IOS_H5 = false;
/**安卓原生*/
BaseGxConstant.IS_ANDROID_NATIVE = false;
/**安卓 h5*/
BaseGxConstant.IS_ANDROID_H5 = false;
/**微信小游戏*/
BaseGxConstant.IS_WECHAT_GAME = false;
/**qq小游戏*/
BaseGxConstant.IS_QQ_GAME = false;
/*头条小游戏*/
BaseGxConstant.IS_TT_GAME = false;
/*百度小游戏*/
BaseGxConstant.IS_BAIDU_GAME = false;
/*华为小游戏*/
BaseGxConstant.IS_HUAWEI_GAME = false;
/*uc小游戏*/
BaseGxConstant.IS_UC_GAME = false;
/*快手小游戏*/
BaseGxConstant.IS_KS_GAME = false;
/*  4399小游戏*/
BaseGxConstant.IS_4399_H5_GAME = false;
BaseGxConstant.IS_4399_BOX_GAME = false;
BaseGxConstant.IS_MEIZU_GAME = false;
BaseGxConstant.IS_WEB_DEBUG = false;
/**支付宝小游戏 */
BaseGxConstant.IS_ZFB_GAME = false;
BaseGxConstant.KEY_PRIVACY_AGREE = "_GxPrivacyAgree_";
exports.default = BaseGxConstant;
