"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEnginePropertyChecker = void 0;
const GxEngineUtil_1 = require("./GxEngineUtil");
const GxEngineLogger_1 = require("./GxEngineLogger");
const KEY_NAME_MATCH_REGEX = /^\$?[a-zA-Z][a-zA-Z0-9_]{0,49}$/;
class GxEnginePropertyChecker {
    static stripProperties(e) {
        for (const key in e) {
            if (Object.prototype.hasOwnProperty.call(e, key)) {
                const value = e[key];
                if (!(GxEngineUtil_1.GxEngineUtil.isString(value) ||
                    GxEngineUtil_1.GxEngineUtil.isNumber(value) ||
                    GxEngineUtil_1.GxEngineUtil.isDate(value) ||
                    GxEngineUtil_1.GxEngineUtil.isBoolean(value) ||
                    GxEngineUtil_1.GxEngineUtil.isArray(value) ||
                    GxEngineUtil_1.GxEngineUtil.isObject(value))) {
                    GxEngineLogger_1.GxEngineLogger.warn(`Your data - ${key}: ${value} - format does not meet requirements and may not be stored correctly. Attribute values only support String, Number, Date, Boolean, Array, Object`);
                }
            }
        }
        return e;
    }
    static _checkPropertiesKey(e) {
        let isValid = true;
        for (const key in e) {
            if (Object.prototype.hasOwnProperty.call(e, key)) {
                if (!KEY_NAME_MATCH_REGEX.test(key)) {
                    GxEngineLogger_1.GxEngineLogger.warn(`Invalid KEY: ${key}`);
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    static event(e) {
        let b = GxEngineUtil_1.GxEngineUtil.isString(e);
        let b1 = KEY_NAME_MATCH_REGEX.test(e);
        if (b && b1) {
            return true;
        }
        else {
            GxEngineLogger_1.GxEngineLogger.warn(`Check the parameter format. The eventName must start with an English letter and contain no more than 50 characters including letters, digits, and underscores: ${e}`);
            return false;
        }
    }
    static propertyName(e) {
        if (GxEngineUtil_1.GxEngineUtil.isString(e) && KEY_NAME_MATCH_REGEX.test(e)) {
            return true;
        }
        else {
            GxEngineLogger_1.GxEngineLogger.warn(`Check the parameter format. PropertyName must start with a letter and contain letters, digits, and underscores (_). The value is a string of no more than 50 characters: ${e}`);
            return false;
        }
    }
    static properties(e) {
        this.stripProperties(e);
        return e && GxEngineUtil_1.GxEngineUtil.isObject(e) ? this._checkPropertiesKey(e) : (GxEngineLogger_1.GxEngineLogger.warn("properties can be none, but it must be an object"), false);
    }
    static propertiesMust(e) {
        this.stripProperties(e);
        if (e === undefined || !GxEngineUtil_1.GxEngineUtil.isObject(e) || GxEngineUtil_1.GxEngineUtil.isEmptyObject(e)) {
            GxEngineLogger_1.GxEngineLogger.warn("properties must be an object with a value");
            return false;
        }
        else {
            return this._checkPropertiesKey(e);
        }
    }
    static userId(e) {
        if (GxEngineUtil_1.GxEngineUtil.isString(e) && /^.{1,64}$/.test(e)) {
            return true;
        }
        else {
            GxEngineLogger_1.GxEngineLogger.warn("The user ID must be a string of less than 64 characters and cannot be null");
            return false;
        }
    }
    static userAddProperties(e) {
        if (!this.propertiesMust(e)) {
            return false;
        }
        for (const key in e) {
            if (!GxEngineUtil_1.GxEngineUtil.isNumber(e[key])) {
                GxEngineLogger_1.GxEngineLogger.warn("The attributes of userAdd need to be Number");
                return false;
            }
        }
        return true;
    }
    static userAppendProperties(e) {
        if (!this.propertiesMust(e)) {
            return false;
        }
        for (const key in e) {
            if (!GxEngineUtil_1.GxEngineUtil.isArray(e[key])) {
                GxEngineLogger_1.GxEngineLogger.warn("The attribute of userAppend must be Array");
                return false;
            }
        }
        return true;
    }
}
exports.GxEnginePropertyChecker = GxEnginePropertyChecker;
