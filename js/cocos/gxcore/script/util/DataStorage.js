"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
class DataStorage {
    static getItem(key, defaultValue = null) {
        if (!!key) {
            let item = cc.sys.localStorage.getItem(key);
            if (item == null || item == 'null' || item === '' || item === undefined) {
                item = defaultValue;
            }
            return item;
        }
        return null;
    }
    static setItem(key, value) {
        cc.sys.localStorage.setItem(key, value);
    }
    /**背景音乐是否可播放 */
    static set musicPlay(type) {
        this.setItem('MUSIC', type);
    }
    static get musicPlay() {
        return this.getItem('MUSIC', true);
    }
    /**音效是否可播放 */
    static set soundPlay(type) {
        this.setItem('SOUND', type);
    }
    static get soundPlay() {
        return this.getItem('SOUND', true);
    }
    static set deviceid(deviceId) {
        this.setItem('DEVICEID', deviceId);
    }
    static get deviceid() {
        return this.getItem('DEVICEID', "");
    }
}
exports.default = DataStorage;
