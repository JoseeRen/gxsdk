"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const layaMaxUI_1 = require("../../..//ui/layaMaxUI");
class gx_ui_share_rcorder extends layaMaxUI_1.ui.gxui.ui_share_recorderUI {
    constructor() {
        super();
    }
    show(on_succ, on_fail) {
        if (this.parent == null) {
            Laya.stage.addChild(this);
            this.onSucc = on_succ;
            this.onFail = on_fail;
        }
    }
    onEnable() {
        this.size(Laya.stage.width, Laya.stage.height);
        GxGame_1.default.Ad().showBanner(() => {
        }, () => {
        });
        this.btnClose.clickHandler = Laya.Handler.create(this, () => {
            this.destroy();
        });
        this.btnShare.clickHandler = Laya.Handler.create(this, () => {
            GxGame_1.default.Ad().shareRecorder(() => {
                this.onSucc && this.onSucc();
                this.destroy();
            }, this.onFail);
        }, null, false);
    }
    onDisable() {
    }
}
exports.default = gx_ui_share_rcorder;
