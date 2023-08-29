"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("../GxEnum");
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
class BaseGxUserData {
    /**金币 */
    static set coin(coin) {
        GxUtils_1.default.setItem('COIN', coin);
        GxUtils_1.default.emit(GxEnum_1.EVENT_TYPE.CHANGE_COIN);
    }
    static get coin() {
        return GxUtils_1.default.getItem('COIN', 0);
    }
    /**体力 */
    static set power(power) {
        GxUtils_1.default.setItem('POWER', power);
    }
    static get power() {
        return GxUtils_1.default.getItem('POWER', 10);
    }
    static set powerTime(time) {
        GxUtils_1.default.setItem('POWERTIME', time);
    }
    static get powerTime() {
        return GxUtils_1.default.getItem('POWERTIME', 0);
    }
    /**已完成最大关卡 */
    static set maxLevel(lv) {
        GxUtils_1.default.setItem('MAXLEVEL', lv);
    }
    static get maxLevel() {
        return GxUtils_1.default.getItem('MAXLEVEL', 0);
    }
    /**签到时间 */
    static set signDay(day) {
        GxUtils_1.default.setItem('SIGNDAY', day);
    }
    static get signDay() {
        return GxUtils_1.default.getItem('SIGNDAY', 0);
    }
    /**签到次数 */
    static set signNum(num) {
        GxUtils_1.default.setItem('SIGNNUM', num);
    }
    static get signNum() {
        return GxUtils_1.default.getItem('SIGNNUM', 0);
    }
    /**皮肤信息 */
    static set skinInfo(info) {
        GxUtils_1.default.setItem('SKININFO', info);
    }
    static get skinInfo() {
        return GxUtils_1.default.getItem('SKININFO', {});
    }
    /**当前使用皮肤 */
    static set curSkinUsed(type) {
        GxUtils_1.default.setItem('CURSKINUSED', type);
    }
    static get curSkinUsed() {
        return GxUtils_1.default.getItem('CURSKINUSED', null);
    }
    /**背景音乐是否可播放 */
    static set musicPlay(type) {
        GxUtils_1.default.setItem('MUSIC', type);
    }
    static get musicPlay() {
        return GxUtils_1.default.getItem('MUSIC', true);
    }
    /**音效是否可播放 */
    static set soundPlay(type) {
        GxUtils_1.default.setItem('SOUND', type);
    }
    static get soundPlay() {
        return GxUtils_1.default.getItem('SOUND', true);
    }
    /**是否可震动 */
    static set vibrate(type) {
        GxUtils_1.default.setItem('VIBRATE', type);
    }
    static get vibrate() {
        return GxUtils_1.default.getItem('VIBRATE', true);
    }
    /**是否新玩家 */
    static set isNewPlay(newPlay) {
        GxUtils_1.default.setItem('NEWPLAY', newPlay);
    }
    static get isNewPlay() {
        return GxUtils_1.default.getItem('NEWPLAY', true);
    }
    /**
     * 随机生成用户UUID
     */
    static get uid() {
        let uid = GxUtils_1.default.getItem('UUID', null);
        if (uid == null) {
            let d = new Date().getTime();
            uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            GxUtils_1.default.setItem('UUID', uid);
        }
        return uid;
    }
}
exports.default = BaseGxUserData;
