"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const GxConstant_2 = __importDefault(require("../core/GxConstant"));
class GxUtils {
    static randomInt(min, max) {
        return Math.floor(this.random(min, max));
    }
    static random(min, max) {
        min = Number(min);
        max = Number(max);
        if (min == NaN || max == NaN)
            return null;
        if (min > max)
            min = (max ^= min ^= max) ^ min;
        return Math.random() * (max - min + 1) + min;
    }
    static formatTime(time) {
        let m = Math.floor(time / 60);
        let s = time % 60;
        return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
    }
    static getNetworkTime() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("get", "/");
            xhr.send(null);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 2) {
                    let time = xhr.getResponseHeader("Date");
                    resolve(time);
                    xhr.abort();
                }
            };
        });
    }
    static getDay(timestamp) {
        let time = new Date(timestamp);
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let d = time.getDate();
        return Number(y + ('0' + M).slice(-2) + ('0' + d).slice(-2));
    }
    /**
     * 克隆对象
     * @param obj
     */
    static clone(obj) {
        let temp = null;
        if (obj instanceof Array) {
            temp = obj.concat();
        }
        else if (obj instanceof Function) {
            temp = obj;
        }
        else {
            temp = new Object();
            for (let item in obj) {
                let val = obj[item];
                temp[item] = typeof val == 'object' ? GxUtils.clone(val) : val;
            }
        }
        return temp;
    }
    /**
     * 发送自定义事件
     * @param name 事件名
     * @param arg （可选）回调数据。<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p ，且 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
     */
    static emit(name, arg) {
        if (this._notificationCenter == null) {
            this._notificationCenter = new Laya.EventDispatcher();
        }
        this._notificationCenter.event(name, arg);
    }
    /**
     * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
     * @param name 事件的类型。
     * @param target 事件侦听函数的执行域。
     * @param callback 事件侦听函数。
     */
    static once(name, target, callback) {
        if (this._notificationCenter) {
            if (this._eventNameList.indexOf(name) == -1) {
                this._eventNameList.push(name);
            }
            this._notificationCenter.once(name, target, callback);
        }
    }
    /**
     * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
     * @param name 事件的类型。
     * @param target 事件侦听函数的执行域。
     * @param callback 事件侦听函数。
     */
    static on(name, target, callback) {
        if (this._notificationCenter) {
            if (this._eventNameList.indexOf(name) == -1) {
                this._eventNameList.push(name);
            }
            this._notificationCenter.on(name, target, callback);
        }
    }
    /**
     * 从 EventDispatcher 对象中删除侦听器。
     * @param name 事件的类型。
     * @param target 事件侦听函数的执行域。
     * @param callback 事件侦听函数。
     * @param onceOnly （可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
     */
    static off(name, target, callback, onceOnly) {
        if (this._notificationCenter) {
            this._notificationCenter.off(name, target, callback, onceOnly);
        }
    }
    /**
     * 从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
     * @param name （可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。
     */
    static offAll(name) {
        if (this._notificationCenter) {
            this._notificationCenter.offAll(name);
        }
    }
    /**
     * 移除caller为target的所有事件监听
     * [-注-] 底层逻辑错误，无法清除监听事件，请用off/offAll
     */
    static targetOff(target) {
        if (this._notificationCenter) {
            // [-注-] 底层逻辑错误
            // this._notificationCenter.offAllCaller(target);
        }
        for (let name of this._eventNameList) {
            GxUtils.offAll(name);
        }
        this._eventNameList = [];
    }
    /**
     * 是否是数字
     * @param value
     */
    static isNumber(value) {
        if (typeof value == 'number')
            return true;
        if (typeof value !== 'string')
            return false;
        value = value.replace(/\s+/g, "");
        if (value == '')
            return false;
        if (isNaN(value))
            return false;
        let strP = /^\d+(\.\d+)?$/;
        return strP.test(value);
    }
    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 生成器
     * @param duration 持续时间（ms）
     */
    static executePreFrame(target, generator, duration = 5) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {
                // 执行之前，先记录开始时间戳
                let startTime = Laya.Browser.now();
                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next();; iter = gen.next()) {
                    // 判断是否已经执行完所有 Generator 的小代码段
                    // 如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        resolve(null);
                        return;
                    }
                    // 每执行完一段小代码段，都检查一下是否
                    // 已经超过我们分配给本帧，这些小代码端的最大可执行时间
                    if (Laya.Browser.now() - startTime > duration) {
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        Laya.timer.frameOnce(1, target, () => {
                            execute();
                        });
                        return;
                    }
                }
            };
            // 运行执行函数
            execute();
        });
    }
    /**
     * 存储指定键名和键值
     * @param key 键名。
     * @param value 键值。
     */
    static setItem(key, value) {
        let project = GxConstant_1.default.PROGECT_NAME.toString().toLocaleUpperCase();
        key = key.toString().toLocaleUpperCase();
        Laya.LocalStorage.setItem(`${project}${GxConstant_1.default.PLATFORM_CODE}_${key}`, JSON.stringify(value));
    }
    /**
     * 获取指定键名的值。
     * @param key 键名。
     * @param defaultValue 默认值
     */
    static getItem(key, defaultValue = null) {
        let project = GxConstant_1.default.PROGECT_NAME.toString().toLocaleUpperCase();
        key = key.toString().toLocaleUpperCase();
        let ret = Laya.LocalStorage.getItem(`${project}${GxConstant_1.default.PLATFORM_CODE}_${key}`);
        if (ret == null || ret === "" || ret === undefined) {
            return defaultValue;
        }
        else {
            return JSON.parse(ret);
        }
    }
    /**
     * 路径查找节点，不存在则返回null，存在多个则返回第一个
     * @param parent
     * @param url 以/拼接的节点路径
     */
    static findNode(url, parent) {
        if (!url || url === undefined || typeof url != 'string') {
            if (parent && parent !== undefined && parent instanceof Laya.Node) {
                return parent;
            }
            return null;
        }
        if (!parent || parent === undefined || !(parent instanceof Laya.Node)) {
            parent = Laya.stage;
        }
        // 分割路径
        let name_list = url.split('/');
        let child = null;
        for (let name of name_list) {
            child = parent.getChildByName(name);
            if (!child)
                return null;
            parent = child;
        }
        return child;
    }
    /**
     * 将色值转百分比
     * @param r
     * @param g
     * @param b
     * @param a
     */
    static color(r, g, b, a = 255) {
        return new Laya.Vector4(r / 255, g / 255, b / 255, a / 255);
    }
    /**
     * 向量转角度
     * @param vec 向量
     * @param isRadian  是否返回弧度制
     */
    static dirToAngle(vec, isRadian = false) {
        if (vec.x == 0 && vec.y == 0) {
            return 0;
        }
        if (isRadian) {
            return -Math.atan2(vec.y, vec.x) + Math.PI / 2;
        }
        return -Math.atan2(vec.y, vec.x) * 180 / Math.PI + 90;
    }
    /**
     * 角度转向量
     * @param vec 向量
     * @param angle 角度
     * @param isRadian  是否返回弧度制
     */
    static vecRotate(vec, angle, isRadian = false) {
        if (!isRadian) {
            angle *= Math.PI / 180;
        }
        return new Laya.Vector2(vec.x * Math.cos(angle) - vec.y * Math.sin(angle), vec.x * Math.sin(angle) + vec.y * Math.cos(angle));
    }
    /**
     * 三维向量转角度
     * @param vec
     * @param angle 弧度制
     */
    static vec3Rotate(vec, angle) {
        let out = new Laya.Quaternion();
        Laya.Quaternion.createFromYawPitchRoll(angle.y, angle.x, angle.z, out);
        let out_vec = new Laya.Vector3();
        Laya.Vector3.transformQuat(vec, out, out_vec);
        return out_vec;
    }
    /**
     * 3d坐标转2d坐标
     * @param camera
     * @param vec3 3d世界坐标
     * @returns
     */
    static vec3ToPoint(camera, vec3) {
        let out = new Laya.Vector4();
        //转换坐标
        camera.viewport.project(vec3, camera.projectionViewMatrix, out);
        //赋值给2D
        return new Laya.Point(out.x / Laya.stage.clientScaleX, out.y / Laya.stage.clientScaleY);
    }
    static callMethod(method_name, params = null, on_callback) {
        if (!GxConstant_1.default.IS_IOS_NATIVE && !GxConstant_1.default.IS_IOS_H5 && !GxConstant_1.default.IS_ANDROID_NATIVE && !GxConstant_1.default.IS_ANDROID_H5) {
            return null;
        }
        let platformClass = window['PlatformClass'];
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        let bridge;
        console.log('[gx_game] method_name = ' + method_name);
        console.log('[gx_game] params = ' + params);
        if (on_callback && on_callback !== undefined) {
            window[`onGx${listener_name}`] = on_callback;
        }
        if (GxConstant_2.default.IS_ANDROID_H5) {
            let result = window["H5Bridge"][method_name]();
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
            return result;
        }
        if (GxConstant_1.default.IS_IOS_NATIVE) {
            bridge = platformClass.createClass("GxBridge"); //创建脚步代理
        }
        else if (GxConstant_1.default.IS_ANDROID_NATIVE) {
            bridge = platformClass.createClass("com.gxgame.helper.GxBridge"); //创建脚步代理
        }
        if (params != null) {
            if (on_callback) {
                return bridge.callWithBack(value => {
                    on_callback && on_callback(JSON.parse(value));
                }, `${method_name}${GxConstant_1.default.IS_IOS_NATIVE ? ':' : ''}`, params);
            }
            else {
                return bridge.call(`${method_name}${GxConstant_1.default.IS_IOS_NATIVE ? ':' : ''}`, params);
            }
        }
        else {
            if (on_callback) {
                return bridge.callWithBack(value => {
                    on_callback && on_callback(JSON.parse(value));
                }, method_name);
            }
            else {
                return bridge.call(method_name);
            }
        }
    }
    static callMethodLabel(key, callbak) {
        let result = null;
        let method_name = "g";
        method_name = method_name + "etLabel";
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        let bridge;
        console.log('[gx_game] method_name = ' + method_name);
        console.log('[gx_game] key = ' + key);
        if (window["PlatformClass"]) {
            let platformClass = window['PlatformClass'];
            if (GxConstant_1.default.IS_IOS_NATIVE) {
                bridge = platformClass.createClass("GxBridge"); //创建脚步代理
            }
            else if (GxConstant_1.default.IS_ANDROID_NATIVE) {
                bridge = platformClass.createClass("com.gxgame.helper.GxBridge"); //创建脚步代理
            }
        }
        if (GxConstant_2.default.IS_ANDROID_NATIVE) {
            if (callbak && callbak !== undefined) {
                window[`onGx${listener_name}`] = callbak;
            }
            result = bridge.call(method_name, key);
        }
        else if (GxConstant_2.default.IS_ANDROID_H5) {
            result = window["H5Bridge"][method_name](key);
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        else {
        }
        return result;
    }
    static callMethodLabelValue(key, defaultValue = -1, callbak) {
        let result = null;
        let method_name = "g";
        method_name = method_name + "etValue";
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        let bridge;
        console.log('[gx_game] method_name = ' + method_name);
        console.log('[gx_game] key = ' + key);
        if (window["PlatformClass"]) {
            let platformClass = window['PlatformClass'];
            if (GxConstant_1.default.IS_IOS_NATIVE) {
                bridge = platformClass.createClass("GxBridge"); //创建脚步代理
            }
            else if (GxConstant_1.default.IS_ANDROID_NATIVE) {
                bridge = platformClass.createClass("com.gxgame.helper.GxBridge"); //创建脚步代理
            }
        }
        if (GxConstant_2.default.IS_ANDROID_NATIVE) {
            if (callbak && callbak !== undefined) {
                window[`onGx${listener_name}`] = callbak;
            }
            // result = jsb.reflection.callStaticMethod('com/gxgame/helper/GxBridge', method_name, '(Ljava/lang/String;I)I', key, defaultValue);
            result = bridge.call(method_name, key, defaultValue);
        }
        else if (GxConstant_2.default.IS_ANDROID_H5) {
            result = window["H5Bridge"][method_name](key, defaultValue);
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        else {
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        return result;
    }
    static getNativePlatform() {
        return this.callMethod('getNativePlatform');
    }
}
GxUtils._notificationCenter = new Laya.EventDispatcher();
GxUtils._eventNameList = [];
exports.default = GxUtils;
