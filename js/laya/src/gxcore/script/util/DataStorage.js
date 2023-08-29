"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseGxUserData_1 = __importDefault(require("../core/base/BaseGxUserData"));
const GxUtils_1 = __importDefault(require("./GxUtils"));
class DataStorage extends BaseGxUserData_1.default {
    static getItem(key, defaultValue = null) {
        if (!!key) {
            let item = Laya.LocalStorage.getItem(key);
            if (item == null || item == 'null' || item === '' || item === undefined) {
                item = defaultValue;
            }
            return item;
        }
        return null;
    }
    static setItem(key, value) {
        Laya.LocalStorage.setItem(key, value);
    }
    static set gads(count) {
        GxUtils_1.default.setItem('gads', count);
    }
    static get gads() {
        return GxUtils_1.default.getItem('gads', 0);
    }
    static set deviceid(id) {
        GxUtils_1.default.setItem('deviceid', id);
    }
    static get deviceid() {
        return GxUtils_1.default.getItem('deviceid', null);
    }
    static set glv(lv) {
        GxUtils_1.default.setItem('glv', lv);
    }
    static get glv() {
        return GxUtils_1.default.getItem('glv', 0);
    }
    static set gtime(time) {
        GxUtils_1.default.setItem('gtime', time);
    }
    static get gtime() {
        return GxUtils_1.default.getItem('gtime', 0);
    }
}
DataStorage.selectLevel = 1;
exports.default = DataStorage;
