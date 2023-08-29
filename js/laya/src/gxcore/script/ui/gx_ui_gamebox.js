"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const DataStorage_1 = __importDefault(require("../util/DataStorage"));
const GxUtils_1 = __importDefault(require("../util/GxUtils"));
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
class gx_ui_gamebox extends layaMaxUI_1.ui.gxui.gx_ui_gameboxUI {
    constructor() {
        super();
        this.onAgree = null;
        this.onRefuse = null;
    }
    show(on_agree, on_refuse, coinNumCallback) {
        if (this.parent)
            return;
        Laya.stage.addChild(this);
        /* this.onAgree = on_agree;
         this.onRefuse = on_refuse;

         if (this.is_agree || !GxGame.isShowAuthorize && !GxGame.isShenHe && !GxGame.isShieldArea) {
             this.onAgree && this.onAgree();

             this.destroy();
         } else {
             Laya.stage.addChild(this);
             this.on_show();
         }*/
    }
    onAwake() {
        this.zOrder = 9999;
        /*       this.user.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.user]);
               this.privacy.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.privacy]);
               this.btnSure.on(Laya.Event.CLICK, this, this.on_agree);
               this.btnCancel.on(Laya.Event.CLICK, this, this.on_refuse);*/
    }
    on_show() {
    }
    show_privacy_content(type) {
        GxGame_1.default.Ad().showPrivacy(type);
    }
    on_agree() {
        this.onAgree && this.onAgree();
        GxUtils_1.default.setItem(`${DataStorage_1.default.uid}privacy`, this.get_time());
        this.destroy();
    }
    on_refuse() {
        if (GxGame_1.default.canPlayWithRefuse) {
            this.onAgree && this.onAgree();
        }
        else {
            this.onRefuse && this.onRefuse();
            if (qg != undefined) {
                qg.exitApplication({});
            }
        }
        this.destroy();
    }
    get is_agree() {
        let time = GxUtils_1.default.getItem(`${DataStorage_1.default.uid}privacy`, 0);
        return this.get_time() - time < 120 * 24 * 3600 * 1000;
    }
    get_time() {
        return new Date().getTime();
    }
}
exports.default = gx_ui_gamebox;
