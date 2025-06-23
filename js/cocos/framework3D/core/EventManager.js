"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evt = void 0;
class EventManager {
    constructor() {
        this._eventList = {};
    }
    on(key, listen, target) {
        if (this._eventList[key] != null) {
            let array = this._eventList[key];
            array.push({ listen: listen, target: target });
        }
        else {
            let array = new Array();
            array.push({ listen: listen, target: target });
            this._eventList[key] = array;
        }
    }
    off(key, listener, target) {
        if (listener != null && !(listener instanceof Function)) {
            target = listener;
            listener = null;
        }
        if (this._eventList[key] != null) {
            if (listener == null && target == null) {
                delete this._eventList[key];
            }
            else {
                let array = this._eventList[key];
                for (let i = array.length - 1; i >= 0; i--) {
                    if (listener != null && target != null) {
                        if (array[i].listen == listener && array[i].target == target) {
                            array.splice(i, 1);
                        }
                    }
                    else if (listener != null && array[i].listen == listener) {
                        array.splice(i, 1);
                    }
                    else if (target != null && array[i].target == target) {
                        array.splice(i, 1);
                    }
                }
                if (array.length == 0) {
                    delete this._eventList[key];
                }
            }
        }
        else {
            this.offTarget(key);
        }
    }
    offTarget(target) {
        for (let k in this._eventList) {
            let listeners = this._eventList[k];
            this._eventList[k] = listeners.filter(v => v.target != target);
            let array = this._eventList[k];
            if (array.length == 0) {
                delete this._eventList[k];
            }
        }
    }
    emitDelay(delay, tag, ...params) {
        setTimeout(v => {
            this.emit(tag, ...params);
        }, delay * 1000);
    }
    emit(tag, ...params) {
        let sendOk = false;
        if (this._eventList[tag] != null) {
            let array = this._eventList[tag];
            // if (!cc.sys.isMobile) { console.warn("emit message: ", tag, params); }
            for (let i = 0; i < array.length; i++) {
                let obj = array[i];
                if (obj.target != null) {
                    if (obj.listen.apply(obj.target, params))
                        sendOk = true;
                }
                else {
                    if (obj.listen.apply(this, params))
                        sendOk = true;
                }
            }
        }
        return sendOk;
    }
    wait(msg, timeoutSec = 0) {
        return new Promise((resolve, reject) => {
            let self = this;
            let timeoutId = 0;
            let callback = function (...params) {
                exports.evt.off(msg, callback, self);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                resolve(params);
            };
            if (timeoutSec > 0) {
                timeoutId = setTimeout(v => {
                    exports.evt.off(msg, callback, self);
                    resolve('timeout');
                }, timeoutSec * 1000);
            }
            exports.evt.on(msg, callback, this);
        });
    }
    sleep(timeout) {
        return new Promise((resolve, reject) => {
            timeout = timeout < 0 ? 0 : timeout;
            setTimeout(() => {
                resolve();
            }, timeout * 1000);
        });
    }
}
exports.evt = new EventManager();
window['evt'] = exports.evt;
