"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
window.ovad = {
    _platform: window["qg"] ? window["qg"] : null,
    _touchEndCallback: null,
    _logEnable: true,
    _tvCD: false,
    _tvUtilKey: "tv",
    _boxShowing: false,
    _num: 0,
    init() {
        if (window["qg"]) {
            this._platform = window["qg"];
            let gGN = GxGame_1.default.gGN("box", 30);
            if (this._num == 1)
                return;
            this._num = 1;
            setTimeout(() => {
                if (GxGame_1.default.gGB("box")) {
                    this.aShowBox();
                }
            }, gGN * 1000);
        }
    },
    aShowBox() {
        this.showBox(() => {
        }, () => {
            setTimeout(() => {
                this.bShowBox();
            }, GxGame_1.default.gGN("box", 30) * 1000);
        }, () => {
        }, false);
    },
    bShowBox() {
        this.aShowBox();
    },
    //监听一次触摸播放激励广告 固定策略1：用户进入游戏后每关开始都弹激励视频（加时间间隔）
    enterLv(lvName, endCallback) {
        if (!this._platform) {
            this._logger("platform is null");
            endCallback && endCallback();
            return;
        }
        //时间间隔
        if (this._tvCD) {
            this._logger("tvcd ing");
            return;
        }
        this._tvCD = true;
        let b = GxGame_1.default.gGB(this._tvUtilKey);
        if (b) {
            this._touchEndCallback = endCallback;
            if (this._platform["offTouchStart"]) {
                this._platform.offTouchStart(this._touchEnd);
                //为啥用touchstart  如果用end的话 在按钮点击时调用 这个方法后 会马上回调end 就触发了
                this._platform.onTouchStart(this._touchEnd);
            }
            else {
                window.removeEventListener("touchstart", this._touchEnd, false);
                window.addEventListener("touchstart", this._touchEnd, false);
            }
        }
        else {
            this._logger("no tv");
        }
    },
    _touchEnd() {
        setTimeout(() => {
            window["ovad"]._tvCD = false;
        }, GxGame_1.default.gGN(window["ovad"]._tvUtilKey, 30) * 1000);
        ///播放广告
        if (window["ovad"]["offTouchStart"]) {
            window["ovad"]._platform.offTouchStart(window["ovad"]._touchEnd);
        }
        else {
            window.removeEventListener("touchstart", window["ovad"]._touchEnd, false);
        }
        window["ovad"]._logger("播放广告");
        GxGame_1.default.Ad().showVideo((res) => {
            window["ovad"]._touchEndCallback && window["ovad"]._touchEndCallback();
        }, "tv");
    },
    _logger(...msg) {
        if (this._logEnable) {
            console.log("ovad:" + msg);
        }
    },
    //天降宝箱   这有个开关控制 crazy  固定策略2：做天降宝箱的误点
    showBox(on_show, on_close, on_get, is_banner = false) {
        if (this._boxShowing) {
            on_close && on_close();
            return;
        }
        this._boxShowing = true;
        GxGame_1.default.Ad().showCrazyPoint(on_show, () => {
            this._boxShowing = false;
            on_close && on_close();
        }, on_get, is_banner);
    },
    showBanner(left, top, showCallback = null, failedCallback = null) {
        if (GxGame_1.default.gGB("tbanner")) {
            GxGame_1.default.Ad().showPositionBanner(left, top, showCallback, failedCallback);
        }
    }
};
//if (window["qg"]) {
//    window["ovad"].init();
//}
