"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
class display {
    static lazyInit() {
        if (!this._inited) {
            let size = cc_1.director.getWinSize();
            this._width = size.width;
            this._height = size.height;
            this._hw = this._width / 2;
            this._hh = this._height / 2;
            this._inited = true;
        }
    }
    static get center() {
        this.lazyInit();
        return (0, cc_1.v3)(this.hw, this.hh, 0);
    }
    static get leftTop() {
        this.lazyInit();
        return (0, cc_1.v3)(0, this._height, 0);
    }
    static get hw() {
        this.lazyInit();
        return this._hw;
    }
    static get hh() {
        this.lazyInit();
        return this._hh;
    }
}
display._width = 0;
display._height = 0;
display._hw = 0;
display._hh = 0;
display._inited = false;
exports.default = display;
