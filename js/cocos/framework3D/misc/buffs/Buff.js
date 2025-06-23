"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Signal_1 = __importDefault(require("../../core/Signal"));
var EventType;
(function (EventType) {
    EventType[EventType["Start"] = 0] = "Start";
    EventType[EventType["End"] = 1] = "End";
    EventType[EventType["Update"] = 2] = "Update";
})(EventType || (EventType = {}));
class Buff {
    constructor() {
        this.duration = 10;
        this.finished = true;
        this.timeLeft = 0;
        //buff 名称 
        this.name = "";
        /** 可叠加 */
        this.canAdd = false;
        /** 最多可叠加 多长时间 */
        this.maxDuration = 0;
        //buff 刷新 间隔
        this.interval = 1;
        this.signals = {
            [EventType.Start]: new Signal_1.default(),
            [EventType.End]: new Signal_1.default(),
            [EventType.Update]: new Signal_1.default()
        };
        this.beganTimeSec = 0;
    }
    get isEnabled() {
        return this.timeLeft > 0;
    }
    step() { }
    onRecovery() { }
    onReset() { }
    save() { }
    load(offlineSec) { }
    pause() {
    }
    resume() {
    }
    on(type, callback, target) {
        this.signals[type].add(callback, target);
    }
    off(type, callback, target) {
        this.signals[type].remove(callback, target);
    }
    _emit(type, ...ps) {
        this.signals[type].fire(...ps);
    }
    /**增加buff 生命周期  */
    addLife(life) {
        // if (this.duration + life < this.maxDuration) {
        this.duration += life;
        this.timeLeft += life;
        // }
    }
    recovery() {
        if (this.timeLeft <= 0)
            return;
        this.duration = this.timeLeft;
        this.finished = false;
        this.beganTimeSec = Date.now() / 1000;
        this.onRecovery();
        this.onTimeLeftChanged();
        console.warn("[BuffSystem]恢复buff:" + "[" + this.name + "]", this.duration);
    }
    /**重置 buff 生命 周期  */
    resetLife() {
        this.beganTimeSec = Date.now() / 1000;
        this.finished = false;
        this.timeLeft = this.duration;
        this.onReset();
    }
    enable(duration, ...a) {
        this.duration = parseInt(duration) || this.duration;
        this.resetLife();
        this.onEnabled(...a);
        this.onTimeLeftChanged();
        this._emit(EventType.Start, this);
        console.warn("[BuffSystem]开启buff:" + "[" + this.name + "]", this.duration);
    }
    disable() {
        this.finished = true;
        this.timeLeft = 0;
        try {
            this.onDisabled();
            this.onTimeLeftChanged();
        }
        catch (e) {
            console.warn(e);
        }
        this._emit(EventType.End, this);
        console.warn("[BuffSystem]关闭buff:" + "[" + this.name + "]");
    }
    doStep(now) {
        if (this.finished)
            return;
        if (this.timeLeft > 0) {
            this.timeLeft = this.duration - (now - this.beganTimeSec);
            this.step();
            this._emit(EventType.Update, this);
            this.onTimeLeftChanged();
        }
    }
}
Buff.EventType = EventType;
exports.default = Buff;
