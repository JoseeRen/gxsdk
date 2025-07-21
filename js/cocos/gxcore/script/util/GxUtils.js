"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const GxGame_1 = __importDefault(require("../GxGame"));
class GxUtils {
    static randomInt(min, max) {
        return Math.floor(this.random(min, max));
    }
    static random(min, max) {
        min = Number(min);
        max = Number(max);
        if (Number.isNaN(min) || Number.isNaN(max)) {
            return null;
        }
        if (min > max)
            min = (max ^= min ^= max) ^ min;
        return Math.random() * (max - min + 1) + min;
    }
    /**
     * 加载远程资源
     * @param  {String}
     * @return {Promise}
     */
    static loadRemoteRes(remoteUrl) {
        return new Promise((resolve, reject) => {
            cc.loader.load(remoteUrl, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    /**
     * 加载本地资源
     * @param  {String} 本地文件路径（不包含后缀名），文件必须在resources中
     * @param  {Assert} cc.Texture2D、cc.SpriteFrame、cc.AudioClip等
     * @return {Promise}
     * Utils.loadRes('cocos', cc.SpriteFrame).then((spriteFrame) => {
     * 		// success
     * }).catch((err) => {
     * 		// fail
     * })
     */
    static loadRes(path, type) {
        return new Promise((resolve, reject) => {
            if (cc.js.isChildClassOf(type, cc.Asset)) {
                cc.loader.loadRes(path, type, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            }
            else {
                cc.loader.loadRes(path, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            }
        });
    }
    static loadResDir(path, type) {
        return new Promise((resolve, reject) => {
            cc.loader.loadResDir(path, type, (err, assets) => {
                if (err) {
                    console.error("加载失败：" + path);
                    return reject(err);
                }
                resolve(assets);
            });
        });
    }
    static getRes(path, type) {
        if (GxGame_1.default.gxResBundle) {
            return GxGame_1.default.gxResBundle.get(path, type);
        }
        else if (cc.resources) {
            return cc.resources.get(path, type);
        }
        return cc.loader.getRes(path, type);
    }
    static formatTime(time) {
        let m = Math.floor(time / 60);
        let s = time % 60;
        return ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
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
        return Number(y + ("0" + M).slice(-2) + ("0" + d).slice(-2));
    }
    static degreesToVectors(degree) {
        let radian = cc.misc.degreesToRadians(degree);
        let comVec = cc.v2(0, 1);
        let dirVec = comVec.rotate(-radian);
        return dirVec;
    }
    static vectorsToDegress(dirVec) {
        if (dirVec.equals(cc.Vec2.ZERO))
            return 0;
        let comVec = cc.v2(0, 1);
        let radian = dirVec.signAngle(comVec);
        let degree = cc.misc.radiansToDegrees(radian);
        return degree;
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
                temp[item] = typeof val == "object" ? GxUtils.clone(val) : val;
            }
        }
        return temp;
    }
    static emit(name, ...params) {
        if (cc.director.getScene()) {
            cc.director.getScene().emit(name, params[0], params[1], params[2], params[3], params[4]);
        }
    }
    static once(name, callback, target) {
        if (cc.director.getScene()) {
            cc.director.getScene().once(name, callback, target);
        }
    }
    static on(name, callback, target) {
        if (cc.director.getScene()) {
            cc.director.getScene().on(name, callback, target);
        }
    }
    static off(name, callback, target) {
        if (cc.director.getScene()) {
            cc.director.getScene().off(name, callback, target);
        }
    }
    static targetOff(target) {
        if (cc.director.getScene()) {
            cc.director.getScene().targetOff(target);
        }
    }
    static newPrefab(url, parent, cbk) {
        url = "prefab/" + url;
        let create = () => {
            let node = cc.instantiate(this.getRes(url, cc.Prefab));
            if (cc.isValid(parent, true)) {
                node.parent = parent;
            }
            cbk && cbk(node);
        };
        if (this.getRes(url, cc.Prefab)) {
            create();
        }
        else {
            this.loadRes(url, cc.Prefab).then((res) => {
                create();
            });
        }
    }
    /**
     * 是否是数字
     * @param value
     */
    static isNumber(value) {
        if (typeof value == "number")
            return true;
        if (typeof value !== "string")
            return false;
        value = value.replace(/\s+/g, "");
        if (value == "")
            return false;
        if (isNaN(value))
            return false;
        let strP = /^\d+(\.\d+)?$/;
        return strP.test(value);
    }
    /*
        /!**
         * 存储指定键名和键值
         * @param key 键名。
         * @param value 键值。
         *!/
        static setItem(key: string, value: any) {
            let project = Constant.PROGECT_NAME.toString().toLocaleUpperCase();
            key = key.toString().toLocaleUpperCase();
            cc.sys.localStorage.setItem(`${project}${Constant.PLATFORM_CODE}_${key}`, JSON.stringify(value));
        }

        /!**
         * 获取指定键名的值。
         * @param key 键名。
         * @param defaultValue 默认值
         *!/
        static getItem(key: string, defaultValue: any = null) {
            let project = Constant.PROGECT_NAME.toString().toLocaleUpperCase();
            key = key.toString().toLocaleUpperCase();
            let ret = cc.sys.localStorage.getItem(`${project}${Constant.PLATFORM_CODE}_${key}`);
            if (ret == null || ret === "" || ret === undefined) {
                return defaultValue;
            } else {
                return JSON.parse(ret);
            }
        }
    */
    /**
     * 路径查找节点，不存在则返回null，存在多个则返回第一个
     * @param parent
     * @param url 以/拼接的节点路径
     */
    static findNode(url, parent) {
        if (!url || url === undefined || typeof url != "string") {
            if (parent && parent !== undefined && parent instanceof cc.Node) {
                return parent;
            }
            return null;
        }
        if (!parent || parent === undefined || !(parent instanceof cc.Node)) {
            parent = cc.director.getScene();
        }
        // 分割路径
        let name_list = url.split("/");
        let child = null;
        for (let name of name_list) {
            child = parent.getChildByName(name);
            if (!child)
                return null;
            parent = child;
        }
        return child;
    }
    static callMethod(method_name, params = null, callbak) {
        let result = null;
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        if (callbak && callbak !== undefined) {
            window[`onGx${listener_name}`] = callbak;
        }
        if (params != null && typeof params != "string") {
            params = JSON.stringify(params);
        }
        if (GxConstant_1.default.IS_ANDROID_NATIVE) {
            let signature = `(${params == null ? "" : "Ljava/lang/String;"})Ljava/lang/String;`;
            console.log(`[gx_game]callMethod method = ${method_name} signature = ${signature} params = ${params}`);
            if (params == null || params === undefined) {
                result = jsb.reflection.callStaticMethod("com/gxgame/helper/GxBridge", method_name, "()Ljava/lang/String;");
            }
            else {
                result = jsb.reflection.callStaticMethod("com/gxgame/helper/GxBridge", method_name, "(Ljava/lang/String;)Ljava/lang/String;", params);
            }
        }
        else if (GxConstant_1.default.IS_ANDROID_H5) {
            try {
                if (!!params) {
                }
                else {
                    params = "";
                }
                result = window["H5Bridge"][method_name](params);
            }
            catch (e) {
            }
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        else if (GxConstant_1.default.IS_IOS_NATIVE) {
            let signature = ``;
            console.log(`[gx_game]callMethod method = ${method_name} signature = ${signature} params = ${params}`);
            if (params == null || params === undefined) {
                result = jsb.reflection.callStaticMethod("GxBridge", method_name + ":", "");
            }
            else {
                result = jsb.reflection.callStaticMethod("GxBridge", method_name + ":", params);
            }
        }
        else {
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        return result;
    }
    static callMethodLabel(key, callbak) {
        let result = null;
        let method_name = "getLabel";
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        if (GxConstant_1.default.IS_ANDROID_NATIVE) {
            if (callbak && callbak !== undefined) {
                window[`onGx${listener_name}`] = callbak;
            }
            /*   let signature = `(${params == null ? '' : 'Ljava/lang/String;'})Ljava/lang/String;`

               if (params != null && typeof params != 'string') {
                   params = JSON.stringify(params)
               }
               console.log(`[gx_game]callMethod method = ${method_name} signature = ${signature} params = ${params}`);

               if (params == null || params === undefined) {
                   result = jsb.reflection.callStaticMethod('com/gxgame/helper/GxBridge', method_name, '()Ljava/lang/String;');
               } else {
                   result = jsb.reflection.callStaticMethod('com/gxgame/helper/GxBridge', method_name, '(Ljava/lang/String;)Z', params);
               }*/
            result = jsb.reflection.callStaticMethod("com/gxgame/helper/GxBridge", method_name, "(Ljava/lang/String;)Z", key);
        }
        else if (GxConstant_1.default.IS_ANDROID_H5) {
            result = window["H5Bridge"][method_name](key);
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        else if (GxConstant_1.default.IS_IOS_NATIVE) {
            result = jsb.reflection.callStaticMethod("GxBridge", method_name + ":", key);
        }
        else {
        }
        return result;
    }
    static callMethodLabelValue(key, defaultValue = -1, callbak) {
        let result = null;
        let method_name = "getValue";
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        if (GxConstant_1.default.IS_ANDROID_NATIVE) {
            if (callbak && callbak !== undefined) {
                window[`onGx${listener_name}`] = callbak;
            }
            /*   let signature = `(${params == null ? '' : 'Ljava/lang/String;'})Ljava/lang/String;`

               if (params != null && typeof params != 'string') {
                   params = JSON.stringify(params)
               }
               console.log(`[gx_game]callMethod method = ${method_name} signature = ${signature} params = ${params}`);

               if (params == null || params === undefined) {
                   result = jsb.reflection.callStaticMethod('com/gxgame/helper/GxBridge', method_name, '()Ljava/lang/String;');
               } else {
                   result = jsb.reflection.callStaticMethod('com/gxgame/helper/GxBridge', method_name, '(Ljava/lang/String;)Z', params);
               }*/
            result = jsb.reflection.callStaticMethod("com/gxgame/helper/GxBridge", method_name, "(Ljava/lang/String;I)I", key, defaultValue);
        }
        else if (GxConstant_1.default.IS_ANDROID_H5) {
            result = window["H5Bridge"][method_name](key, defaultValue);
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        else if (GxConstant_1.default.IS_IOS_NATIVE) {
            result = jsb.reflection.callStaticMethod("GxBridge", method_name + ":defaultValue:", key, defaultValue);
        }
        else {
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        return result;
    }
    static callMethodLabelValueStr(key, defaultValue = "", callbak) {
        let result = null;
        let method_name = "getSelfValueStr";
        let listener_name = method_name.substring(0, 1).toUpperCase() + method_name.substring(1);
        if (GxConstant_1.default.IS_ANDROID_NATIVE) {
            if (callbak && callbak !== undefined) {
                window[`onGx${listener_name}`] = callbak;
            }
            /*   let signature = `(${params == null ? '' : 'Ljava/lang/String;'})Ljava/lang/String;`

               if (params != null && typeof params != 'string') {
                   params = JSON.stringify(params)
               }
               console.log(`[gx_game]callMethod method = ${method_name} signature = ${signature} params = ${params}`);

               if (params == null || params === undefined) {
                   result = jsb.reflection.callStaticMethod('com/gxgame/helper/GxBridge', method_name, '()Ljava/lang/String;');
               } else {
                   result = jsb.reflection.callStaticMethod('com/gxgame/helper/GxBridge', method_name, '(Ljava/lang/String;)Z', params);
               }*/
            result = jsb.reflection.callStaticMethod("com/gxgame/helper/GxBridge", method_name, "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", key, defaultValue);
        }
        else if (GxConstant_1.default.IS_ANDROID_H5) {
            result = window["H5Bridge"][method_name](key, defaultValue);
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        else if (GxConstant_1.default.IS_IOS_NATIVE) {
            result = jsb.reflection.callStaticMethod("GxBridge", method_name + ":defaultValue:", key, defaultValue);
        }
        else {
            // jsb.reflection.callStaticMethod('GxBridge', `${method_name}${params.length == 0 ? '' : ':'}`, ...params);
        }
        return result;
    }
    static getNativePlatform() {
        return this.callMethod("getNativePlatform");
    }
    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 生成器
     * @param duration 持续时间（ms）
     */
    static executePreFrame(target, generator, duration = 1) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {
                // 执行之前，先记录开始时间戳
                let startTime = cc.sys.now();
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
                    if (cc.sys.now() - startTime > duration) {
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        target.scheduleOnce(() => {
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
}
exports.default = GxUtils;
