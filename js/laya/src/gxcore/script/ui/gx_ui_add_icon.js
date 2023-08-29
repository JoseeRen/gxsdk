"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
// @ts-ignore
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
class gx_ui_add_icon extends layaMaxUI_1.ui.gxui.gx_ui_add_iconUI {
    constructor() {
        super();
    }
    onAwake() {
        this.size(Laya.stage.width, Laya.stage.height);
        this.zOrder = 10000;
    }
    onEnable() {
        this.btnWatchAd.visible = false;
        this.btnAddIcon.clickHandler = Laya.Handler.create(this, this.tapAddIcon, null, false);
        this.btnClose.clickHandler = Laya.Handler.create(this, this.tapClose, null, false);
        this.btnWatchAd.clickHandler = Laya.Handler.create(this, this.tapWatchAd, null, false);
        this.showInterstitialNative();
    }
    show(on_close, on_succ) {
        if (this.parent == null) {
            Laya.stage.addChild(this);
            this.on_succ = on_succ;
            this.on_close = on_close;
        }
    }
    tapAddIcon() {
        GxGame_1.default.Ad().addDesktop(() => {
            this.btnAddIcon.visible = false;
            this.on_succ && this.on_succ();
        }, null);
    }
    tapClose() {
        this.destroy();
        this.on_close && this.on_close();
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
exports.default = gx_ui_add_icon;
