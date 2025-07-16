"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const BaseGxGame_1 = __importDefault(require("./core/base/BaseGxGame"));
const GxConstant_1 = __importDefault(require("./core/GxConstant"));
const DataStorage_1 = __importDefault(require("./util/DataStorage"));
const GxAdParams_1 = require("./GxAdParams");
const GxUtils_1 = __importDefault(require("./util/GxUtils"));
const GxLog_1 = __importDefault(require("./util/GxLog"));
const ResUtil_1 = __importDefault(require("./util/ResUtil"));
const cc_1 = require("cc");
const Gx_submsg_1 = __importDefault(require("./prefab/Gx_submsg"));
const Gx_shareFriend_1 = __importDefault(require("./prefab/Gx_shareFriend"));
class GxGame extends BaseGxGame_1.default {
    /**
     * 是否需要显示隐私政策授权框
     */
    static needShowAuthorize() {
        if (GxConstant_1.default.IS_OPPO_GAME ||
            GxConstant_1.default.IS_VIVO_GAME ||
            GxConstant_1.default.IS_HUAWEI_GAME ||
            GxConstant_1.default.IS_QQ_GAME ||
            GxConstant_1.default.IS_MI_GAME ||
            GxConstant_1.default.IS_RONGYAO_Game) {
            //隐私政策和和适龄
            let item1 = DataStorage_1.default.getItem(GxConstant_1.default.KEY_PRIVACY_AGREE);
            if (item1) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * 是否需要显示隐私政策按钮
     */
    static needShowAuthorizeBtn() {
        /*    if (GxConstant.IS_ANDROID_H5) {

                if (this.isH5Hall) {
                    return true
                }

                Log.e("安卓h5子集不需要显示隐私政策按钮")
                return false

            }*/
        // return true;
        if (GxConstant_1.default.IS_OPPO_GAME ||
            GxConstant_1.default.IS_VIVO_GAME ||
            GxConstant_1.default.IS_HUAWEI_GAME ||
            GxConstant_1.default.IS_QQ_GAME ||
            GxConstant_1.default.IS_ANDROID_NATIVE ||
            GxConstant_1.default.IS_ANDROID_H5 ||
            GxConstant_1.default.IS_MI_GAME || GxConstant_1.default.IS_RONGYAO_Game) {
            //隐私政策和和适龄
            return true;
        }
        else {
            return false;
        }
    }
    /**
     *
     * 是否需要显示添加桌面按钮
     */
    static needAddDesktopBtn() {
        if (GxConstant_1.default.IS_OPPO_GAME ||
            GxConstant_1.default.IS_VIVO_GAME ||
            GxConstant_1.default.IS_QQ_GAME ||
            GxConstant_1.default.IS_KS_GAME) {
            return true;
        }
        else {
            return false;
        }
    }
    static needTTBoxBtn() {
        if (GxConstant_1.default.IS_TT_GAME) {
            // @ts-ignore
            if (tt["checkScene"]) {
                return true;
            }
            else
                return false;
        }
        else {
            return false;
        }
    }
    static getJkShowTime() {
        if (GxConstant_1.default.IS_KS_GAME) {
            // @ts-ignore
            let systemInfoSync = ks.getSystemInfoSync();
            let env = systemInfoSync.host.env;
            if (env == "kwaipro" || env == "snackvideo" || env == "kwaime") {
                return 0.001;
            }
            else {
                return 3;
            }
        }
        if (GxConstant_1.default.IS_OPPO_GAME ||
            GxConstant_1.default.IS_VIVO_GAME ||
            GxConstant_1.default.IS_HUAWEI_GAME ||
            GxConstant_1.default.IS_QQ_GAME ||
            GxConstant_1.default.IS_MI_GAME ||
            GxConstant_1.default.IS_ZFB_GAME ||
            GxConstant_1.default.IS_RONGYAO_Game) {
            return 3;
        }
        else if (GxConstant_1.default.IS_TT_GAME) {
            return 1;
        }
        else {
            return 0.001;
        }
    }
    /**
     * 获取游戏分级   8  12  16  0的话 不显示
     */
    static getGameAge() {
        if (GxConstant_1.default.IS_4399_H5_GAME || GxConstant_1.default.IS_WECHAT_GAME) {
            return -1;
        }
        if (GxConstant_1.default.IS_ANDROID_NATIVE) {
            return parseInt(GxUtils_1.default.callMethod("getGameAge"));
        }
        if (GxConstant_1.default.IS_ANDROID_H5) {
            return parseInt(this.Ad().getGameAge());
        }
        return GxAdParams_1.AdParams.age;
    }
    static showSubMsg() {
        if (GxConstant_1.default.IS_WECHAT_GAME || GxConstant_1.default.IS_QQ_GAME) {
            let subIds = GxGame.Ad().getSubIds();
            if (subIds && subIds.length > 0) {
                if (GxGame.Ad().waitSubIds.length > 0) {
                    ResUtil_1.default.loadPrefab("gx/prefab/submsg", (err, prefab) => {
                        if (err) {
                            GxLog_1.default.e("加载订阅预制体失败 无法显示订阅");
                            return;
                        }
                        let node = (0, cc_1.instantiate)(prefab);
                        if (!!GxGame.uiGroup) {
                            node.layer = GxGame.uiGroup;
                        }
                        let submsgView = node.getComponent(Gx_submsg_1.default);
                        submsgView.show();
                    });
                }
                else {
                    GxLog_1.default.w("未订阅id为空 已经全部订阅 不显示订阅");
                }
            }
            else {
                GxLog_1.default.w("订阅id为空或者没有配置 不显示订阅");
            }
        }
        else {
            GxLog_1.default.w("非qq 微信不显示订阅");
        }
    }
    static showShareFriend(callback) {
        if (GxConstant_1.default.IS_WECHAT_GAME || GxConstant_1.default.IS_QQ_GAME) {
            ResUtil_1.default.loadPrefab("gx/prefab/shareFriend", (err, prefab) => {
                if (err) {
                    GxLog_1.default.e("加载分享预制体失败 无法显示分享");
                    return;
                }
                let node = (0, cc_1.instantiate)(prefab);
                if (!!GxGame.uiGroup) {
                    node.layer = GxGame.uiGroup;
                }
                let shareView = node.getComponent(Gx_shareFriend_1.default);
                shareView.show();
                shareView.setShareCallback(callback);
            });
        }
        else {
            GxLog_1.default.w("非qq 微信不显示分享");
        }
    }
    static clickBtn(clickId, callback) {
        // GxChecker.getInstance().check(GxChecker.MsgType.btn_event, {clickId: clickId})
        GxGame.gameEvent(clickId);
        callback && callback();
    }
}
//隐私政策是否显示用户协议  qq必须显示
GxGame.canShowUser = false;
GxGame.LogoSp = null;
GxGame.canshowTTBoxBtn = true;
exports.default = GxGame;
