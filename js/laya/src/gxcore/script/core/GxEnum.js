"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventName = exports.AUTO_AD_TYPE = exports.e_sdk_type = exports.HTTP_ERROR = exports.HTTP_TYPE = exports.REWARD_TYPE = exports.EVENT_TYPE = exports.CUSTOM_EVENT = exports.privacy_type = exports.PLATFORM = exports.ad_native_state = exports.ad_native_type = void 0;
var ad_native_type;
(function (ad_native_type) {
    /**原生Banner */
    ad_native_type[ad_native_type["banner"] = 0] = "banner";
    /**原生大图 */
    ad_native_type[ad_native_type["inter1"] = 1] = "inter1";
    /**原生图文 */
    ad_native_type[ad_native_type["inter2"] = 2] = "inter2";
    /**原生ICON */
    ad_native_type[ad_native_type["native_icon"] = 3] = "native_icon";
})(ad_native_type || (exports.ad_native_type = ad_native_type = {}));
var ad_native_state;
(function (ad_native_state) {
    ad_native_state[ad_native_state["none"] = 0] = "none";
    ad_native_state[ad_native_state["need_show"] = 1] = "need_show";
    ad_native_state[ad_native_state["show"] = 2] = "show";
    ad_native_state[ad_native_state["click"] = 3] = "click";
})(ad_native_state || (exports.ad_native_state = ad_native_state = {}));
var PLATFORM;
(function (PLATFORM) {
    PLATFORM["MI"] = "mi";
    PLATFORM["OPPO"] = "oppo";
    PLATFORM["VIVO"] = "vivo";
    PLATFORM["G233"] = "233";
    PLATFORM["MMY"] = "mmy";
    PLATFORM["HUAWEI"] = "huawei";
    PLATFORM["G4399"] = "4399";
})(PLATFORM || (exports.PLATFORM = PLATFORM = {}));
var privacy_type;
(function (privacy_type) {
    privacy_type["user"] = "user";
    privacy_type["privacy"] = "privacy";
})(privacy_type || (exports.privacy_type = privacy_type = {}));
/**自定义事件 */
var CUSTOM_EVENT;
(function (CUSTOM_EVENT) {
})(CUSTOM_EVENT || (exports.CUSTOM_EVENT = CUSTOM_EVENT = {}));
/**固定事件 */
var EVENT_TYPE;
(function (EVENT_TYPE) {
    /**更新体力 */
    EVENT_TYPE["CHANGE_POWER"] = "CHANGE_POWER";
    /**更新金币 */
    EVENT_TYPE["CHANGE_COIN"] = "CHANGE_COIN";
    /**使用新皮肤 */
    EVENT_TYPE["CHANGE_SKIN"] = "CHANGE_SKIN";
    /**获取新皮肤 */
    EVENT_TYPE["GET_NEW_SKIN"] = "GET_NEW_SKIN";
    /**显示Banner */
    EVENT_TYPE["SHOW_BANNER"] = "SHOW_BANNER";
    /**隐藏Banner */
    EVENT_TYPE["HIDE_BANNER"] = "HIDE_BANNER";
    /**更新Banner高度 */
    EVENT_TYPE["CHANGE_BANNER_HEIGHT"] = "CHANGE_BANNER_HEIGHT";
    /**视频广告错误 */
    EVENT_TYPE["AD_ERROR"] = "AD_ERROR";
    /**游戏结束 */
    EVENT_TYPE["GAME_OVER"] = "GAME_OVER";
    EVENT_TYPE["LOAD_SUBPACKAGE_COMPLETE"] = "LOAD_SUBPACKAGE_COMPLETE";
    EVENT_TYPE["LOAD_SUBPACKAGE_PROGRESS"] = "LOAD_SUBPACKAGE_PROGRESS";
    EVENT_TYPE["OPEN_SETTING_VIEW"] = "OPEN_SETTING_VIEW";
    EVENT_TYPE["OPEN_SKIN_VIEW"] = "OPEN_SKIN_VIEW";
    EVENT_TYPE["OPEN_RESULT_VIEW"] = "OPEN_RESULT_VIEW";
    EVENT_TYPE["OPEN_PAUSE_VIEW"] = "OPEN_PAUSE_VIEW";
    EVENT_TYPE["OPEN_GAME_SCENE"] = "OPEN_GAME_SCENE";
    EVENT_TYPE["CLOSE_LOADING_VIEW"] = "CLOSE_LOADING_VIEW";
    EVENT_TYPE["CLOSE_SETTING_VIEW"] = "CLOSE_SETTING_VIEW";
    EVENT_TYPE["CLOSE_SKIN_VIEW"] = "CLOSE_SKIN_VIEW";
    EVENT_TYPE["CLOSE_RESULT_VIEW"] = "CLOSE_RESULT_VIEW";
    EVENT_TYPE["CLOSE_PAUSE_VIEW"] = "CLOSE_PAUSE_VIEW";
    EVENT_TYPE["CLOSE_WATCH_VIDEO"] = "CLOSE_WATCH_VIDEO";
    EVENT_TYPE["SHARE_RECORDER_SUCC"] = "SHARE_RECORDER_SUCC";
})(EVENT_TYPE || (exports.EVENT_TYPE = EVENT_TYPE = {}));
var REWARD_TYPE;
(function (REWARD_TYPE) {
    REWARD_TYPE[REWARD_TYPE["NO"] = 0] = "NO";
    REWARD_TYPE[REWARD_TYPE["SHARE"] = 1] = "SHARE";
    REWARD_TYPE[REWARD_TYPE["VIDEO"] = 2] = "VIDEO";
})(REWARD_TYPE || (exports.REWARD_TYPE = REWARD_TYPE = {}));
;
var HTTP_TYPE;
(function (HTTP_TYPE) {
    HTTP_TYPE["GET"] = "GET";
    HTTP_TYPE["POST"] = "POST";
})(HTTP_TYPE || (exports.HTTP_TYPE = HTTP_TYPE = {}));
var HTTP_ERROR;
(function (HTTP_ERROR) {
    HTTP_ERROR[HTTP_ERROR["TIME_OUT"] = 0] = "TIME_OUT";
})(HTTP_ERROR || (exports.HTTP_ERROR = HTTP_ERROR = {}));
var e_sdk_type;
(function (e_sdk_type) {
    e_sdk_type[e_sdk_type["NO"] = 0] = "NO";
    e_sdk_type[e_sdk_type["HS"] = 1] = "HS";
    e_sdk_type[e_sdk_type["QL"] = 2] = "QL";
    e_sdk_type[e_sdk_type["YDHW"] = 3] = "YDHW";
})(e_sdk_type || (exports.e_sdk_type = e_sdk_type = {}));
var AUTO_AD_TYPE;
(function (AUTO_AD_TYPE) {
    AUTO_AD_TYPE[AUTO_AD_TYPE["NO"] = 0] = "NO";
    AUTO_AD_TYPE[AUTO_AD_TYPE["CLICK"] = 1] = "CLICK";
    AUTO_AD_TYPE[AUTO_AD_TYPE["INTER"] = 2] = "INTER";
    AUTO_AD_TYPE[AUTO_AD_TYPE["VIDEO"] = 3] = "VIDEO";
})(AUTO_AD_TYPE || (exports.AUTO_AD_TYPE = AUTO_AD_TYPE = {}));
var EventName;
(function (EventName) {
    EventName["main"] = "main";
    EventName["lvStart"] = "lvStart";
    EventName["lvEnd"] = "lvEnd";
    EventName["modeLvChoice"] = "modeLvChoice";
})(EventName || (exports.EventName = EventName = {}));
