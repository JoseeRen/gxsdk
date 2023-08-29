"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
class gx_ui_watch_video extends layaMaxUI_1.ui.gxui.gx_ui_watch_videoUI {
    constructor() {
        super();
    }
    onAwake() {
        this.size(Laya.stage.width, Laya.stage.height);
        this.zOrder = 10000;
    }
    show(on_succ) {
        if (this.parent == null) {
            Laya.stage.addChild(this);
            this.onSucc = on_succ;
        }
    }
    onEnable() {
        this.btnWatchAd.visible = false;
        this.btnClose.clickHandler = Laya.Handler.create(this, this.tapClose, null, false);
        this.btnWatchAd.clickHandler = Laya.Handler.create(this, this.tapWatchAd, null, false);
        this.btnWatchVideo.clickHandler = Laya.Handler.create(this, this.tapWatchVideo);
        this.showInterstitialNative();
    }
    tapWatchVideo() {
        this.onSucc && this.onSucc();
        this.destroy();
    }
    tapClose() {
        this.destroy();
    }
    tapWatchAd() {
        GxGame_1.default.Ad().clickNativeInnerInterstitial();
    }
    onDisable() {
    }
    showInterstitialNative() {
        this.btnWatchAd.visible = false;
        this.btnWatchAd.clickHandler = Laya.Handler.create(this, () => {
            GxGame_1.default.Ad().clickNativeInnerInterstitial();
        });
        GxGame_1.default.Ad().showInterstitialNative(this.nativeInner, () => {
        }, () => {
            this.btnWatchAd.visible = true;
        }, () => {
            this.btnWatchAd.visible = false;
            GxGame_1.default.Ad().showBanner(() => {
            }, () => {
            });
        });
    }
}
exports.default = gx_ui_watch_video;
