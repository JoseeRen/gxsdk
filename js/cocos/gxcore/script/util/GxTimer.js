"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class mTimer {
    constructor() {
        this._state = 0 /* TIMER_STATE.NO */;
        this.timeoutHandler = null;
        this.remainTime = 0;
        this.intervalTime = 0;
        this.repeatCount = 0;
        this.remainCount = 0;
        this.callback = null;
        this.taskStartTime = 0;
    }
    static loop(callback, interval = 0, repeat = 0) {
        let timer = new mTimer();
        timer.run(callback, interval, repeat);
        return timer;
    }
    static once(callback, interval = 0) {
        let timer = new mTimer();
        timer.run(callback, interval, 1);
        return timer;
    }
    loop(callback, interval = 0, repeat = 0) {
        this.run(callback, interval, repeat);
    }
    once(callback, interval = 0) {
        this.run(callback, interval, 1);
    }
    run(callback, interval = 0, repeat = 0) {
        if (interval < 0)
            interval = 0;
        if (repeat < 0)
            repeat = 0;
        this.intervalTime = interval;
        this.remainTime = interval;
        this.repeatCount = repeat;
        this.remainCount = repeat;
        this.callback = callback;
        this.setTimeout();
    }
    setTimeout(callback = null, interval = null) {
        if (callback == null)
            callback = this.callback;
        if (interval == null)
            interval = this.intervalTime;
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
        this.timeoutHandler = null;
        this._state = 1 /* TIMER_STATE.START */;
        this.taskStartTime = (new Date()).getTime();
        this.timeoutHandler = setTimeout(() => {
            callback && callback();
            if (this.repeatCount == 0 || --this.remainCount > 0) {
                this.setTimeout();
            }
        }, interval);
    }
    pause() {
        if (this._state != 1 /* TIMER_STATE.START */)
            return console.warn('Timer Not Start');
        this._state = 2 /* TIMER_STATE.PAUSE */;
        this.remainTime = Math.max(this.intervalTime - (new Date()).getTime() - this.taskStartTime, 0);
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
        this.timeoutHandler = null;
    }
    resume() {
        if (this._state != 2 /* TIMER_STATE.PAUSE */)
            return console.warn('Timer Not Pause');
        this.setTimeout(this.callback, this.remainTime);
    }
    stop() {
        if (this._state == 0 /* TIMER_STATE.NO */)
            return console.warn('Timer Not Start');
        else if (this._state == 4 /* TIMER_STATE.STOP */)
            return console.warn('Timer Has Stop');
        this._state = 4 /* TIMER_STATE.STOP */;
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
        this.timeoutHandler = null;
        this.remainTime = 0;
        this.intervalTime = 0;
        this.repeatCount = 0;
        this.remainCount = 0;
        this.callback = null;
        this.taskStartTime = 0;
    }
    clear() {
        this._state = 0 /* TIMER_STATE.NO */;
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
        this.timeoutHandler = null;
        this.remainTime = 0;
        this.intervalTime = 0;
        this.repeatCount = 0;
        this.remainCount = 0;
        this.callback = null;
        this.taskStartTime = 0;
    }
    get state() {
        return this._state;
    }
}
exports.default = mTimer;
