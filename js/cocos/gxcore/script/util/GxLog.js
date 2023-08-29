"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GxLog {
    static setTag(tag) {
        this.tag = tag || 'gx_game';
    }
    static setDebug(debug) {
        this.debug = debug || true;
    }
    static i(...data) {
        this.debug && console.info(`[${this.tag}]`, ...data);
    }
    static e(...data) {
        this.debug && console.error(`[${this.tag}]`, ...data);
    }
    static l(...data) {
        this.debug && console.log(`[${this.tag}]`, ...data);
    }
    static d(...data) {
        this.debug && console.debug(`[${this.tag}]`, ...data);
    }
    static w(...data) {
        this.debug && console.warn(`[${this.tag}]`, ...data);
    }
}
GxLog.tag = 'gx_game';
GxLog.debug = true;
exports.default = GxLog;
