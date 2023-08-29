"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gx_ui_native_icon = void 0;
const GxEnum_1 = require("../../core/GxEnum");
const GxGame_1 = __importDefault(require("../../GxGame"));
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
class gx_ui_native_icon extends layaMaxUI_1.ui.gxui.ui_native_iconUI {
    constructor() {
        super();
        this.game_icon.on(Laya.Event.CLICK, this, this.on_click_adv);
        this.btn_close.on(Laya.Event.CLICK, this, this.on_click_close);
    }
    on_click_adv(evt) {
        this.report_click();
    }
    on_click_close() {
        this.hide();
    }
    /**
     * 广告被点击
     */
    report_click() {
        if (this.native_data) {
            GxGame_1.default.Ad().reportAdClick(this.native_data);
            // 自动切换
            this.update_view();
        }
    }
    /**
     * 广告被曝光
     */
    report_show() {
        if (this.native_data) {
            GxGame_1.default.Ad().reportAdShow(this.native_data);
        }
    }
    show(parent, native_data) {
        if (!this.parent) {
            this.native_data = native_data;
            !this.parent && parent.addChild(this);
            this.on_show();
        }
    }
    onEnable() {
        // this.auto_update_ad();
        if (this.adflag) {
            if (GxConstant_1.default.IS_MI_GAME) {
                this.adflag.visible = false;
            }
            else {
                this.adflag.visible = true;
            }
        }
        if (this.adflagmi) {
            if (GxConstant_1.default.IS_MI_GAME) {
                this.adflagmi.visible = true;
            }
            else {
                this.adflagmi.visible = false;
            }
        }
    }
    auto_update_ad() {
        /*   if (GxGame.adInfo.bannerUpdateTime > 0) {
               this.timer.loop(GxGame.adInfo.bannerUpdateTime * 1000, this, this.update_view);
           }*/
    }
    update_view() {
        if (GxGame_1.default.adConfig.canRefresh) {
            this.hide();
            return;
        }
        if (!this.parent || !this.visible)
            return;
        let native_data = GxGame_1.default.Ad().getLocalNativeData(GxEnum_1.ad_native_type.native_icon);
        if (native_data) {
            this.native_data = native_data;
            this.refresh();
        }
    }
    /**
     * 上报点击后  重新拉取原生数据刷新界面
     */
    report_click_update_view(native_data) {
        if (this.parent) {
            this.native_data = native_data;
            this.refresh();
        }
    }
    on_hide() {
    }
    on_show() {
        this.refresh();
    }
    refresh() {
        this.initAdIcon(this.native_data.imgUrlList[0])
            .then(() => {
        }, () => {
            return this.initAdIcon(this.native_data.iconUrlList[0]);
        })
            .then(() => {
        }, () => {
            return this.update_view();
        });
        this.ad_logo.text = this.native_data.logoTxt || "广告";
        if (GxConstant_1.default.IS_HUAWEI_GAME) {
            this.ad_logo.text = "广告";
        }
        this.report_show();
    }
    initAdIcon(url) {
        return new Promise((resolve, reject) => {
            if (url == null || url == undefined) {
                reject();
                return;
            }
            Laya.loader.once(Laya.Event.ERROR, this, () => {
                reject && reject();
            });
            Laya.loader.load(url, Laya.Handler.create(this, texture => {
                if (this.destroyed)
                    return;
                this.game_icon.texture = texture;
                resolve && resolve();
            }), null, Laya.Loader.IMAGE);
        });
    }
    /**
     * 移除，并回收
     */
    hide() {
        if (this.parent) {
            this.removeSelf();
            this.on_hide();
        }
    }
}
exports.gx_ui_native_icon = gx_ui_native_icon;
