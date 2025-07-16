"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventName = exports.privacy_type = exports.PLATFORM = exports.ad_native_state = exports.ad_native_type = void 0;
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
var EventName;
(function (EventName) {
    EventName["main"] = "main";
    EventName["lvStart"] = "lvStart";
    EventName["lvEnd"] = "lvEnd";
    EventName["modeLvChoice"] = "modeLvChoice";
})(EventName || (exports.EventName = EventName = {}));
