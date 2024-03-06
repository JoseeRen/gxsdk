"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEngineLogger = void 0;
class GxEngineLogger {
    static info(...args) {
        if (typeof console === "object" && console.log && GxEngineLogger.enabled) {
            try {
                console.log.apply(console, arguments);
            }
            catch (e) {
                console.log(arguments[0]);
            }
        }
    }
    static warn(...args) {
        if (typeof console === "object" && console.warn && GxEngineLogger.enabled) {
            try {
                console.warn.apply(console, arguments);
            }
            catch (e) {
                console.warn(arguments[0]);
            }
        }
    }
}
exports.GxEngineLogger = GxEngineLogger;
GxEngineLogger.enabled = true;
