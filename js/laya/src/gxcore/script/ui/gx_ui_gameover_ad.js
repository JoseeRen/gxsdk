"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxGame_1 = __importDefault(require("../GxGame"));
class gx_ui_gameover_ad extends layaMaxUI_1.ui.gxui.gx_ui_gameover_adUI {
    constructor() {
        super();
        this.onAgree = null;
        this.onRefuse = null;
    }
    // show(on_agree?: () => void, on_refuse?: () => void) {
    show() {
        if (this.parent)
            return;
        Laya.stage.addChild(this);
        this.height = Laya.stage.height;
        this.width = Laya.stage.width;
        console.log("gameover ad show success");
        this.btn.on(Laya.Event.CLICK, this, function () {
            console.log("destroy gameoverad");
            GxGame_1.default.Ad().showVideo((res) => {
            }, "GxGameOverAd");
            this.destroy();
        });
    }
    onAwake() {
        this.zOrder = 9999;
        /*        this.user.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.user]);
                this.privacy.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.privacy]);
                this.btnSure.on(Laya.Event.CLICK, this, this.on_agree);
                this.btnCancel.on(Laya.Event.CLICK, this, this.on_refuse);*/
    }
    on_show() {
    }
}
exports.default = gx_ui_gameover_ad;
