"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("../../core/GxEnum");
const GxGame_1 = __importDefault(require("../../GxGame"));
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
class gx_ui_inner_interstitial extends layaMaxUI_1.ui.gxui.ui_inner_interstitialUI {
    constructor() {
        super();
        // 点击结算原生回调
        this.click_back = undefined;
        this.retryCount = 3;
        this.retryNum = 0;
        this.has_click_warp = false;
        this.box_close.on(Laya.Event.CLICK, this, this.on_click_close);
        this.icon_video.on(Laya.Event.CLICK, this, this.on_click_adv);
        this.set_background_on_show();
    }
    on_click_adv(evt) {
        this.report_click();
    }
    click_adv_warp() {
        this.report_click();
        this.has_click_warp = true;
    }
    on_click_close() {
        this.hide();
    }
    /**
     * 广告被点击
     */
    report_click() {
        if (this.native_data) {
            this.click_back && this.click_back();
            GxGame_1.default.Ad().reportAdClick(this.native_data);
            console.log("has clicked native inner interstitial");
            // 自动切换
            this.update_view();
        }
        else {
            console.log("ui_inner_interstitial report_click native_data is null!");
        }
    }
    /**
     * 广告被曝光
     */
    report_show() {
        if (this.native_data) {
            GxGame_1.default.Ad().reportAdShow(this.native_data);
        }
        else {
        }
    }
    show(parent, native_data, click_back, show_back, hide_back, is_new_type) {
        if (!this.parent && parent) {
            this.native_data = native_data;
            this.show_back = show_back || undefined;
            this.hide_back = hide_back || undefined;
            this.click_back = click_back || undefined;
            parent.addChild(this);
            this.set_default_pos(parent);
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
    /*    protected auto_update_ad() {
            if (GxGame.adInfo.bannerUpdateTime > 0) {
                this.timer.loop(GxGame.adInfo.bannerUpdateTime * 1000, this, this.update_view);
            }
        }*/
    update_view() {
        if (GxGame_1.default.adConfig.canRefresh) {
            let native_data = GxGame_1.default.Ad().getLocalNativeData(GxEnum_1.ad_native_type.inter1);
            if (native_data && this.parent && this.activeInHierarchy) {
                this.native_data = native_data;
                this.refresh();
            }
        }
        else {
            this.hide();
        }
    }
    /**
     * 应用默认的位置
     * 位于父节点中心
     */
    set_default_pos(parent) {
        if (parent) {
            this.x = parent.width / 2 - (this.width * this.scaleX) / 2;
            this.y = parent.height / 2 - (this.height * this.scaleY) / 2;
        }
    }
    set_style_pos(x, y) {
    }
    on_hide() {
        this.timer.clearAll(this);
    }
    on_show() {
        this.refresh();
        // ad_native_inner_interstitial.show_count++
        this.show_back && this.show_back();
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
        this.txt_title.text = this.native_data.title || "";
        this.text_desc.text = this.native_data.desc || "";
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
                this.icon_video.texture = texture;
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
    set_background_on_show() {
    }
    onDisable() {
        this.hide_back && this.hide_back();
        this.hide_back = null;
        this.timer.clearAll(this);
    }
    onDestroy() {
        this.hide_back && this.hide_back();
        this.hide_back = null;
        this.timer.clearAll(this);
    }
}
exports.default = gx_ui_inner_interstitial;
