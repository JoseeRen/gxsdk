"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("../../core/GxEnum");
const GxGame_1 = __importDefault(require("../../GxGame"));
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
class gx_ui_banner extends layaMaxUI_1.ui.gxui.ui_native_bannerUI {
    constructor() {
        super();
        /**
         * 是否为易点击模式
         */
        this.easy_click_model = true;
        this.is_set_style = false;
        this.onShow = null;
        this.onHide = null;
        this.retryCount = 3;
        this.retryNum = 0;
        this.has_click_warp = false;
        this.icon_close.on(Laya.Event.CLICK, this, this.on_click_close);
        this.native_bg.on(Laya.Event.CLICK, this, this.on_click_adv);
        //设置默认位置
        this.set_default_pos();
    }
    click_adv_warp() {
        this.report_click();
        this.has_click_warp = true;
    }
    on_click_adv2() {
        this.report_click();
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
    /**
     * 广告被曝光
     */
    report_show() {
        if (this.native_data) {
            GxGame_1.default.Ad().reportAdShow(this.native_data);
        }
    }
    show(native_data, on_show, on_hide) {
        if (!this.parent) {
            Laya.stage.addChild(this);
            this.zOrder = 1000000;
            this.on_show(native_data);
            this.onShow = on_show;
            this.onHide = on_hide;
        }
    }
    update_view() {
        if (!this.parent || !this.visible) {
            this.hide();
            return;
        }
        if (GxGame_1.default.adConfig.canRefresh) {
            let native_data = GxGame_1.default.Ad().getLocalNativeData(GxEnum_1.ad_native_type.banner);
            if (native_data) {
                this.native_data = native_data;
                this.refresh();
            }
            else {
                this.hide();
            }
        }
        else {
            this.hide();
        }
    }
    /**
     * 应用默认的位置
     */
    set_default_pos() {
        if (Laya.stage.screenMode == 'vertical' || Laya.stage.height >= Laya.stage.width) {
            this.scaleX = this.scaleY = Laya.stage.width / this.width;
        }
        let size = { width: this.width * this.scaleX, height: this.height * this.scaleY };
        if (!this.is_set_style) {
            let x = (Laya.stage.width - size.width) / 2;
            this.x = x;
        }
        let y = Laya.stage.height - size.height;
        this.y = y;
    }
    resume_pos_and_scale() {
        this.is_set_style = false;
        //重新设置一下位置和缩放
        this.scaleX = this.scaleY = Laya.stage.width / this.width;
        this.set_default_pos();
    }
    on_hide() {
        if (this.easy_click_model) {
            this.native_bg.off(Laya.Event.MOUSE_OVER, this, this.on_click_adv2);
        }
        else {
            this.native_bg.off(Laya.Event.CLICK, this, this.on_click_adv);
        }
        this.timer.clearAll(this);
        this.onHide && this.onHide();
    }
    on_show(native_data) {
        //设置易点击
        if (this.easy_click_model) {
            this.native_bg.on(Laya.Event.MOUSE_OVER, this, this.on_click_adv2);
        }
        else {
            this.native_bg.on(Laya.Event.CLICK, this, this.on_click_adv);
        }
        if (native_data) {
            this.native_data = native_data;
            this.refresh();
            this.onShow && this.onShow();
        }
        else {
            this.hide();
        }
    }
    refresh() {
        let node = this.box_big_banner;
        // let icon = node.getChildByName("icon") as Laya.Image;
        let title = node.getChildByName("title");
        let desc = node.getChildByName("desc");
        this.initAdIcon(this.native_data.imgUrlList[0])
            .then(() => {
        }, () => {
            return this.initAdIcon(this.native_data.iconUrlList[0]);
        })
            .then(() => {
        }, () => {
            return this.update_view();
        });
        title.text = this.native_data.title || "";
        desc.text = this.native_data.desc || "";
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
                let icon = this.box_big_banner.getChildByName("icon");
                icon.texture = texture;
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
        }
        this.on_hide();
    }
    onDisable() {
        this.timer.clearAll(this);
    }
    onDestroy() {
        this.timer.clearAll(this);
    }
}
exports.default = gx_ui_banner;
