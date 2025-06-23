"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Signal {
    constructor(c, t) {
        this.allReceivers = [];
    }
    add(c, t) {
        let receiver = this.allReceivers.find(v => v.c == c && v.t == t);
        if (!receiver)
            this.allReceivers.push({ c, t });
    }
    remove(c, t) {
        this.allReceivers = this.allReceivers.filter(v => v.c != c && v.t != t);
    }
    fire(...ps) {
        for (var i = 0; i < this.allReceivers.length; i++) {
            let v = this.allReceivers[i];
            if (v.c)
                v.c.call(v.t, ...ps);
            else
                console.warn("not found callback ", v.c, v.t);
        }
    }
    on(c, t) {
        this.remove(c, t);
        this.add(c, t);
    }
    off(c, t) {
        this.remove(c, t);
    }
    clear() {
        this.allReceivers.splice(0);
    }
    once(callback) {
        let h = () => {
            this.remove(h);
            callback && callback();
        };
        this.add(h);
    }
    wait() {
        return new Promise((resolve, reject) => {
            this.once(resolve);
        });
    }
}
exports.default = Signal;
