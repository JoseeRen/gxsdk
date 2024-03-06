"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("../core/GxEnum");
const GxGame_1 = __importDefault(require("../GxGame"));
const DataStorage_1 = __importDefault(require("../util/DataStorage"));
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
class gx_ui_authorize extends layaMaxUI_1.ui.gxui.gx_ui_authorizeUI {
    constructor() {
        super();
        this.onAgree = null;
        this.onRefuse = null;
    }
    show(on_agree, on_refuse) {
        if (this.parent)
            return;
        this.onAgree = on_agree;
        this.onRefuse = on_refuse;
        if (!GxGame_1.default.isShowAuthorize && !GxGame_1.default.isShenHe) {
            this.onAgree && this.onAgree();
            this.destroy();
        }
        else {
            Laya.stage.addChild(this);
            this.on_show();
        }
    }
    onAwake() {
        this.zOrder = 9999;
        this.user.on(Laya.Event.CLICK, this, this.show_privacy_content, [GxEnum_1.privacy_type.user]);
        this.privacy.on(Laya.Event.CLICK, this, this.show_privacy_content, [GxEnum_1.privacy_type.privacy]);
        this.btnSure.on(Laya.Event.CLICK, this, this.on_agree);
        this.btnCancel.on(Laya.Event.CLICK, this, this.on_refuse);
        this.btnClose.on(Laya.Event.CLICK, this, this.on_close);
        if (!GxGame_1.default.canShowUser) {
            this.andText.visible = false;
            this.user.visible = false;
            this.privacy.left = this.user.left;
        }
        if (DataStorage_1.default.getItem(GxConstant_1.default.KEY_PRIVACY_AGREE)) {
            this.btnClose.visible = true;
            this.btnSure.visible = false;
            this.btnCancel.visible = false;
            this.tipsLabel.text = "您已同意上述协议和政策中的全部内容。";
        }
        else {
            this.btnClose.visible = false;
            this.btnSure.visible = true;
            this.btnCancel.visible = true;
            this.tipsLabel.text = "";
        }
    }
    on_close() {
        this.destroy();
    }
    on_show() {
    }
    show_privacy_content(type) {
        GxGame_1.default.Ad().showPrivacy(type);
    }
    on_agree() {
        this.onAgree && this.onAgree();
        DataStorage_1.default.setItem(GxConstant_1.default.KEY_PRIVACY_AGREE, "true");
        this.destroy();
    }
    on_refuse() {
        if (GxGame_1.default.canPlayWithRefuse) {
            this.onAgree && this.onAgree();
        }
        else {
            this.onRefuse && this.onRefuse();
            if (window["qg"] != undefined) {
                window["qg"].exitApplication({});
            }
            else if (window["qq"] != undefined) {
                window["qq"].exitMiniProgram({});
            }
            else {
                console.warn("不退出");
            }
        }
        this.destroy();
    }
}
exports.default = gx_ui_authorize;
