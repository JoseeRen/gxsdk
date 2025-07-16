"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEngineSenderQueue = void 0;
const GxEngineLogger_1 = require("./GxEngineLogger");
const GxEngineUtil_1 = require("./GxEngineUtil");
const GxEngineHttpTask_1 = __importDefault(require("./GxEngineHttpTask"));
class GxEngineSenderQueue {
    constructor() {
        this.items = [];
        this.isRunning = !1;
        this.showDebug = !1;
    }
    enqueue(e, t, n) {
        var r = !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3], i = "debug" === n.debugMode, a = this;
        let httpTask = new GxEngineHttpTask_1.default(JSON.stringify(e), t, n.maxRetries, n.sendTimeout, n.debugMode, function (e) {
            a.isRunning = !1,
                GxEngineUtil_1.GxEngineUtil.isFunction(n.callback) && n.callback(e),
                a._runNext(i),
                i && GxEngineLogger_1.GxEngineLogger.info("code ".concat(e.code, " and msg is ").concat(e.msg));
        });
        !0 === r ? (this.items.push(httpTask), this._runNext(i)) : httpTask.run();
    }
    _dequeue() {
        return this.items.shift();
    }
    _runNext(e) {
        if (0 < this.items.length && !this.isRunning)
            if (this.isRunning = !0, e)
                this._dequeue().run();
            else {
                for (var t = this.items.splice(0, this.items.length), e = t[0], n = JSON.parse(e.data), r = 1; r < t.length; r++) {
                    var i = t[r], i = JSON.parse(i.data);
                    n.event_list = n.event_list.concat(i.event_list);
                }
                var a = (new Date).getTime();
                n.$flush_time = a,
                    new GxEngineHttpTask_1.default(JSON.stringify(n), e.serverUrl, e.tryCount, e.timeout, null == e ? void 0 : e.debugMode, e.callback).run();
            }
    }
}
exports.GxEngineSenderQueue = GxEngineSenderQueue;
