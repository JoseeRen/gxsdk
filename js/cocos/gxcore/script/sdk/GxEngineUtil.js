"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEngineUtil = void 0;
const GxEngineConfig_1 = __importDefault(require("./GxEngineConfig"));
const GxEngineLogger_1 = require("./GxEngineLogger");
let ArrayProto = Array.prototype, ObjProto = Object.prototype, slice = ArrayProto.slice, nativeToString = ObjProto.toString, nativeHasOwnProperty = Object.prototype.hasOwnProperty, nativeForEach = ArrayProto.forEach, nativeIsArray = Array.isArray, breaker = {};
class GxEngineUtil {
    static getMpPlatform() {
        return this._mpPlatform;
    }
    static setMpPlatform(value) {
        this._mpPlatform = value;
    }
    static isNumber(e) {
        return "[object Number]" === nativeToString.call(e) && /[\d\.]+/.test(String(e));
    }
    static isObject(e) {
        return "[object Object]" === nativeToString.call(e) && null != e;
    }
    static isPromise(e) {
        return "[object Promise]" === nativeToString.call(e) && null != e;
    }
    static isFunction(e) {
        try {
            return "function" == typeof e;
        }
        catch (e) {
            return !1;
        }
    }
    static createExtraHeaders() {
        return {
            "GE-Integration-Type": GxEngineConfig_1.default.LIB_NAME,
            "GE-Integration-Version": GxEngineConfig_1.default.LIB_VERSION,
            "GE-Integration-Count": "1",
            "GE-Integration-Extra": this.getMpPlatform()
        };
    }
    static isJSONString(e) {
        try {
            JSON.parse(e);
        }
        catch (e) {
            return !1;
        }
        return !0;
    }
    static extend(n, ...args) {
        return this.each(slice.call(arguments, 1), function (e) {
            for (var t in e)
                void 0 !== e[t] && (n[t] = e[t]);
        }),
            n;
    }
    static each(e, t, ...n) {
        if (null == e)
            return !1;
        if (nativeForEach && e.forEach === nativeForEach)
            e.forEach(t, n);
        else if (e.length === +e.length) {
            for (var r = 0, i = e.length; r < i; r++)
                if (r in e && t.call(n, e[r], r, e) === breaker)
                    return !1;
        }
        else
            for (var a in e)
                if (nativeHasOwnProperty.call(e, a) && t.call(n, e[a], a, e) === breaker)
                    return !1;
    }
    static isString(e) {
        return "[object String]" === nativeToString.call(e);
    }
    static isDate(e) {
        return "[object Date]" === nativeToString.call(e);
    }
    static isBoolean(e) {
        return "[object Boolean]" === nativeToString.call(e);
    }
    static isArray(e) {
        return "[object Array]" === nativeToString.call(e);
    }
    static isEmptyObject(e) {
        if (this.isObject(e)) {
            for (var t in e)
                if (nativeHasOwnProperty.call(e, t))
                    return !1;
            return !0;
        }
        return !1;
    }
    static checkAppId(e) {
        if ("number" == typeof e)
            e = String(e);
        else if ("string" != typeof e)
            return "";
        return e = e.replace(/\s*/g, "");
    }
    static isUndefined(e) {
        return e == undefined || e == null;
    }
    static searchObjDate(n) {
        try {
            (this.isObject(n) || this.isArray(n)) && this.each(n, (e, t) => {
                this.isObject(e) || this.isArray(e) ? this.searchObjDate(n[t]) : this.isDate(e) && (n[t] = this.formatDate(e));
            });
        }
        catch (e) {
            GxEngineLogger_1.GxEngineLogger.warn(e);
        }
    }
    static generateEncryptyData(e, t) {
        /*    if (void 0 !== t) {
                var n = t.publicKey,
                    t = t.version;
                if (void 0 !== n && void 0 !== t && "undefined" != typeof CryptoJS && "undefined" != typeof JSEncrypt) {
                    var r = _.createAesKey();
                    try {
                        var i = CryptoJS.enc.Utf8.parse(r),
                            a = CryptoJS.enc.Utf8.parse(JSON.stringify(e)),
                            o = _.isUndefined(CryptoJS.pad.Pkcs7) ? CryptoJS.pad.PKCS7 : CryptoJS.pad.Pkcs7,
                            s = CryptoJS.AES.encrypt(a, i, {
                                mode: CryptoJS.mode.ECB,
                                padding: o
                            }).toString(),
                            c = new JSEncrypt,
                            u = (c.setPublicKey(n), c.encrypt(r));
                        return !1 === u ? (logger.warn("私钥加密失败，返回原数据"), e) : {
                            pkv: t,
                            ekey: u,
                            payload: s
                        }
                    } catch (e) {
                        logger.warn("数据加密失败，返回原数据: " + e)
                    }
                }
            }*/
        return e;
    }
    static base64Encode(e) {
        var t, n, r, i, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", o = 0, s = 0, c = "", u = [];
        if (!e)
            return e;
        for (e = GxEngineUtil.utf8Encode(e); t = (i = e.charCodeAt(o++) << 16 | e.charCodeAt(o++) << 8 | e.charCodeAt(o++)) >> 12 & 63, n = i >> 6 & 63, r = 63 & i, u[s++] = a.charAt(i >> 18 & 63) + a.charAt(t) + a.charAt(n) + a.charAt(r), o < e.length;)
            ;
        switch (c = u.join(""), e.length % 3) {
            case 1:
                c = c.slice(0, -2) + "==";
                break;
            case 2:
                c = c.slice(0, -1) + "=";
        }
        return c;
    }
    static utf8Encode(e) {
        for (var t, n = "", r = t = 0, i = (e = (e + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")).length, a = 0; a < i; a++) {
            var o = e.charCodeAt(a), s = null;
            o < 128 ? t++ : s = 127 < o && o < 2048 ? String.fromCharCode(o >> 6 | 192, 63 & o | 128) : String.fromCharCode(o >> 12 | 224, o >> 6 & 63 | 128, 63 & o | 128),
                null !== s && (r < t && (n += e.substring(r, t)), n += s, r = t = a + 1);
        }
        return r < t && (n += e.substring(r, e.length)),
            n;
    }
    static extend2Layers(...n) {
        return this.each(slice.call(arguments, 1), (e) => {
            for (var t in e)
                void 0 !== e[t] && (this.isObject(e[t]) && this.isObject(n[t]) ? this.extend(n[t], e[t]) : n[t] = e[t]);
        }),
            n;
    }
    static UUID() {
        var e = (new Date).getTime();
        return String(Math.random()).replace(".", "").slice(1, 11) + "-" + e;
    }
    static UUIDv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
            var t = 16 * Math.random() | 0;
            return ("x" === e ? t : 3 & t | 8).toString(16);
        });
    }
    static setQuery(e) {
        var t, n = [];
        for (t in e)
            e.hasOwnProperty(t) && n.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
        return n.join("&");
    }
    static formatDate(e) {
        function t(e) {
            return e < 10 ? "0" + e : e;
        }
        return e.getFullYear() + "-" + t(e.getMonth() + 1) + "-" + t(e.getDate()) + " " + t(e.getHours()) + ":" + t(e.getMinutes()) + ":" + t(e.getSeconds()) + "." + ((e = e.getMilliseconds()) < 100 && 9 < e ? "0" + e : e < 10 ? "00" + e : e);
    }
}
exports.GxEngineUtil = GxEngineUtil;
