"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
class LoadSubpackage {
    constructor() {
        this.packageList = [];
        this.loadedList = [];
        this.loadTotalCount = 0;
        this.mustLoadedCount = 0;
    }
    static init(on_progress, on_complete) {
        if (this.ins == null) {
            this.ins = new LoadSubpackage();
        }
        else {
            return this.ins;
        }
        this.ins.on_progress = on_progress;
        this.ins.on_complete = on_complete;
        if (GxConstant_1.default.subpackage.length <= 0 || GxConstant_1.default.IS_WEB_GAME || GxConstant_1.default.IS_ANDROID_NATIVE || GxConstant_1.default.IS_IOS_NATIVE || GxConstant_1.default.IS_ANDROID_H5 || GxConstant_1.default.IS_IOS_H5) {
            this.ins.on_progress && this.ins.on_progress(1);
            this.ins.on_complete && this.ins.on_complete();
        }
        else {
            this.ins.sortByPriority();
        }
        return this.ins;
    }
    sortByPriority() {
        for (let data of GxConstant_1.default.subpackage) {
            if (data.priority >= 5) {
            }
            else {
                ++this.loadTotalCount;
            }
            this.packageList.push(data);
        }
        this.packageList.sort((a, b) => {
            return a.priority - b.priority;
        });
        this.loadSubpackage();
    }
    loadSubpackage() {
        let data = this.packageList[0];
        let subTask = null;
        let on_succ = () => {
            console.log(`[${data.name}]子包加载成功`);
            this.loadedList.push(data.name);
            if (data.priority < 5) {
                ++this.mustLoadedCount;
                this.on_progress && this.on_progress(Math.min(this.mustLoadedCount / this.loadTotalCount, 1));
                if (this.mustLoadedCount >= this.loadTotalCount) {
                    this.on_complete && this.on_complete();
                }
            }
            this.packageList.splice(0, 1);
            if (this.packageList.length > 0) {
                this.loadSubpackage();
            }
        };
        let on_fail = err => {
            console.error(`[${data.name}]子包加载失败：${JSON.stringify(err)}`);
        };
        if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_VIVO_GAME) {
            subTask = qg.loadSubpackage({
                name: data.name,
                success: on_succ,
                fail: on_fail
            });
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            //@ts-ignore
            subTask = ks.loadSubpackage({
                name: data.name,
                success: on_succ,
                fail: on_fail
            });
        }
        else if (GxConstant_1.default.IS_BAIDU_GAME) {
            //@ts-ignore
            subTask = swan.loadSubpackage({
                name: data.name,
                success: on_succ,
                fail: on_fail
            });
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            //@ts-ignore
            subTask = wx.loadSubpackage({
                name: data.name,
                success: on_succ,
                fail: on_fail
            });
        }
        else {
            console.warn("未配置的平台加载子包");
            console.warn("未配置的平台加载子包");
            console.warn("未配置的平台加载子包");
            console.warn("未配置的平台加载子包");
        }
    }
    isLoaded(name) {
        return this.loadedList.indexOf(name || '') > -1;
    }
}
exports.default = LoadSubpackage;
