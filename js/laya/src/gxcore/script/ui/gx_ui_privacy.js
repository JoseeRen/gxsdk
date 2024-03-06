"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("../core/GxEnum");
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxAdParams_1 = require("../GxAdParams");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const GxGame_1 = __importDefault(require("../GxGame"));
class gx_ui_privacy extends layaMaxUI_1.ui.gxui.gx_ui_privacyUI {
    constructor() {
        super();
        this.tabType = null;
        this.privacyCon = null;
        this.prevX = 0;
        this.prevY = 0;
    }
    show(type = GxEnum_1.privacy_type.user) {
        this.tabType = type;
        if (this.parent)
            return;
        if (GxGame_1.default.canShowUser) {
            this.toggleContainer.visible = true;
        }
        else {
            this.toggleContainer.visible = false;
        }
        Laya.stage.addChild(this);
        this.on_show();
    }
    hide() {
        this.destroy();
    }
    onAwake() {
        this.zOrder = 10000;
        this.loading.visible = true;
        Laya.loader.load('gx/cfg/privacy.json', Laya.Handler.create(this, json => {
            this.loading.visible = false;
            this.privacyCon = json;
            this.change_tab(this.tabType);
        }), null, Laya.Loader.JSON);
        this.user.clickHandler = Laya.Handler.create(this, this.change_tab, [GxEnum_1.privacy_type.user], false);
        this.privacy.clickHandler = Laya.Handler.create(this, this.change_tab, [GxEnum_1.privacy_type.privacy], false);
        this.btnClose.clickHandler = Laya.Handler.create(this, this.hide, null, false);
        // this.panel.on(Laya.Event.CLICK, this, this.hide);
    }
    on_show() {
        this.set_frame_roi();
        this.loading.visible = true;
        this.change_tab(this.tabType);
        //
        // let  txt = new Laya.Text();
        // txt.overflow = Laya.Text.SCROLL;
        // this.textArea.on(Laya.Event.MOUSE_DOWN, this, this.startScrollText);
    }
    /* 开始滚动文本 */
    //   startScrollText(e: Event): void {
    //     this.prevX = this.textArea.mouseX;
    //     this.prevY = this.textArea.mouseY;
    //     Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.scrollText);
    //     Laya.stage.on(Laya.Event.MOUSE_UP, this, this.finishScrollText);
    // }
    /* 停止滚动文本 */
    //   finishScrollText(e: Event): void {
    //     Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.scrollText);
    //     Laya.stage.off(Laya.Event.MOUSE_UP, this, this.finishScrollText);
    // }
    // private scrollText(e: Event): void {
    //     var nowX: number = this.textArea.mouseX;
    //     var nowY: number = this.textArea.mouseY;
    //     // @ts-ignore
    //     this.textArea.scrollX += this.prevX - nowX;
    //     // @ts-ignore
    //     this.textArea.scrollY += this.prevY - nowY;
    //     this.prevX = nowX;
    //     this.prevY = nowY;
    // }
    set_frame_roi() {
        if (Laya.stage.width <= Laya.stage.height) {
            //竖屏
            this.bg.size(521, 717);
            console.log(1);
            // this.bg.centerX= 0
        }
        else {
            //横屏
            let height = Laya.stage.height * 0.7;
            let width = Laya.stage.width * 0.7;
            this.bg.size(width, height);
            this.height = height;
            this.width = width;
            const h = Laya.stage.height * 0.15;
            /*     this.centerY = 0
                 this.centerX = 0;
                 const h = Laya.stage.height * 0.15;
                 console.log(2)
                 this.centerY = h <= 200 ? h - 200 : 0;
                 this.centerX = (Laya.stage.width - width) / 4;
     */
            this.x = (Laya.stage.width - width) / 2;
            this.y = (Laya.stage.height - height) / 2;
            this.labelPanel.width = Laya.stage.width * 0.6;
            this.testLabel.width = Laya.stage.width * 0.6;
            this.labelPanel.height = Laya.stage.height * 0.5;
            this.testLabel.height = Laya.stage.height * 0.5;
        }
    }
    change_tab(type) {
        if (!GxGame_1.default.canShowUser) {
            type = "privacy";
        }
        this.tabType = type;
        let tab = this[type].parent;
        for (let i = 0; i < tab.numChildren; i++) {
            let child = tab.getChildAt(i);
            if (child == this[type]) {
                child.mouseEnabled = false;
                child.getChildByName('normal').visible = false;
                child.getChildByName('selected').visible = true;
            }
            else {
                child.mouseEnabled = true;
                child.getChildByName('normal').visible = true;
                child.getChildByName('selected').visible = false;
            }
        }
        if (this.privacyCon) {
            if (this.privacyCon.hasOwnProperty(this.tabType)) {
                let privacyConElement = "";
                if (GxConstant_1.default.IS_MI_GAME && this.tabType == "privacy") {
                    privacyConElement = this.privacyCon[this.tabType + "2"].replace("companyName", GxAdParams_1.AdParams.ysCompanyName).replace("mail", GxAdParams_1.AdParams.ysMail).replace(/gameName/g, GxAdParams_1.AdParams.mi.gameName).replace("address", GxAdParams_1.AdParams.ysAddress.length > 0 ? "" + GxAdParams_1.AdParams.ysAddress : "");
                }
                else {
                    privacyConElement = this.privacyCon[this.tabType].replace("companyName", GxAdParams_1.AdParams.ysCompanyName).replace("mail", GxAdParams_1.AdParams.ysMail).replace(/gameName/g, GxAdParams_1.AdParams.mi.gameName).replace("address", GxAdParams_1.AdParams.ysAddress.length > 0 ? "公司注册地址：" + GxAdParams_1.AdParams.ysAddress : "");
                }
                this.textArea.text = privacyConElement;
                this.testLabel.text = privacyConElement;
            }
            else {
                this.textArea.text = '';
                this.testLabel.text = '';
            }
            this.loading.visible = false;
        }
        if (Laya.stage.width <= Laya.stage.height) {
            if (type == "privacy") {
                this.testLabel.height = 9500;
            }
            else {
                this.testLabel.height = 5500;
            }
        }
        else {
            if (type == "privacy") {
                this.testLabel.height = 7500;
            }
            else {
                this.testLabel.height = 4000;
            }
        }
        /*     this.textArea.scrollTo(0);
             this.textArea.vScrollBarSkin = '';*/
    }
    onDisable() {
    }
}
exports.default = gx_ui_privacy;
