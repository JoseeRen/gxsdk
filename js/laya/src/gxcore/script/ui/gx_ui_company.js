"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
class gx_ui_company extends layaMaxUI_1.ui.gxui.gx_ui_companyUI {
    constructor() { super(); }
    onAwake() {
        this.zOrder = 9999;
        this.size(Laya.stage.width, Laya.stage.height);
    }
    show(company = null, copyright = null) {
        if (!this.parent) {
            Laya.stage.addChild(this);
        }
        if (company) {
            this.compamy.text = `著作权人：${company}`;
        }
        if (copyright) {
            this.copyright.text = `软著登记号：${copyright}`;
        }
        const show = GxGame_1.default.isShenHe || GxGame_1.default.showCompany;
        this.copyright.visible = show;
        this.compamy.visible = show;
    }
}
exports.default = gx_ui_company;
