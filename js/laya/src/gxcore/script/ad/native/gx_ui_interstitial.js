"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const GxEnum_1 = require("../../core/GxEnum");
const GxGame_1 = __importDefault(require("../../GxGame"));
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const GxConstant_2 = __importDefault(require("../../core/GxConstant"));
class gx_ui_interstitial extends layaMaxUI_1.ui.gxui.ui_interstitialUI {
    constructor() {
        super();
        this.box_close.on(Laya.Event.CLICK, this, this.on_click_close);
        this.btn_click_button.on(Laya.Event.CLICK, this, this.on_click_adv);
        this.icon_video.on(Laya.Event.CLICK, this, this.on_click_adv);
        this.easy_click.on(Laya.Event.CLICK, this, this.on_click_adv2);
        this.ad_bg.on(Laya.Event.CLICK, this, this.on_click_adv);
        this.set_background_on_show();
        if (GxConstant_1.default.IS_OPPO_GAME) {
            this.ad_bg.skin = '';
            this.ad_logo.parent.bottom = 300;
            this.txt_title.color = '#ffffff';
            this.text_desc.color = '#ffffff';
        }
    }
    on_click_adv(evt) {
        this.report_click();
    }
    on_click_adv2(evt) {
        this.easy_click.visible = false;
        this.has_easy_click = true;
        this.report_click();
    }
    on_click_close() {
        /*    if (!GxGame.isShieldArea && GxGame.adInfo.closeClickRto >= 0 && Math.random() * 100 <= GxGame.adInfo.closeClickRto && !this.has_easy_click) {
                this.easy_click.visible = false;
                this.report_click()
            }*/
        this.hide();
    }
    /**
     * 广告被点击
     */
    report_click() {
        if (this.native_data) {
            GxGame_1.default.Ad().reportAdClick(this.native_data);
            // 自动切换
            if (GxGame_1.default.adConfig.canRefresh) {
                let native_data = GxGame_1.default.Ad().getLocalNativeData(GxEnum_1.ad_native_type.inter2);
                if (native_data && this.parent) {
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
        else {
            this.hide();
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
            this.native_data = native_data;
            let order = 10000;
            Laya.stage.addChild(this);
            this.zOrder = order;
            this.show_back = on_show;
            this.hide_back = on_hide;
            this.on_show();
        }
        if (GxConstant_2.default.IS_HUAWEI_GAME) {
            /*   qg.onHide(() => {
                   console.log("游戏进入后台");
                   /!*   this.hide()
                       qg.offHide();
                       qg.offShow();*!/
               });*/
            let showCallback = () => {
                this.hide();
                console.log("重新返回游戏");
                qg.offShow(showCallback);
            };
            qg.onShow(showCallback);
        }
    }
    onEnable() {
        if (this.adflag) {
            if (GxConstant_2.default.IS_MI_GAME) {
                this.adflag.visible = false;
            }
            else {
                this.adflag.visible = true;
            }
        }
        if (this.adflagmi) {
            if (GxConstant_2.default.IS_MI_GAME) {
                this.adflagmi.visible = true;
            }
            else {
                this.adflagmi.visible = false;
            }
        }
    }
    /**
     * 应用默认的位置
     */
    set_default_pos() {
        // let size = syyx_sdk_utils.get_size(this);
        // let x = (Laya.stage.width - size.width) / 2;
        // let y = (Laya.stage.height - size.height) / 2;
        // this.pos(x, y)
    }
    set_style_pos(x, y) {
    }
    on_hide() {
    }
    on_show() {
        this.refresh();
        // this.set_easy_click_size();
        this.show_back && this.show_back();
    }
    update_view() {
        let native_data = GxGame_1.default.Ad().getLocalNativeData(GxEnum_1.ad_native_type.inter2);
        if (native_data && this.parent && this.activeInHierarchy) {
            this.native_data = native_data;
            this.refresh();
        }
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
        if (GxConstant_2.default.IS_HUAWEI_GAME) {
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
    /*    set_easy_click_size() {
            this.easy_click.visible = false;
            if (!GxGame.isShieldArea && GxGame.adInfo.forceClickRto >= 0 && Math.random() * 100 <= GxGame.adInfo.forceClickRto) {
                if (GxGame.adInfo.forceClickRto <= 30) {
                    if (Laya.stage.screenMode == 'horizontal') {
                        this.easy_click.height = Laya.stage.height;
                        this.easy_click.width = 800;
                    } else {
                        this.easy_click.width = Laya.stage.width;
                        this.easy_click.height = 800;
                    }
                } else if (GxGame.adInfo.forceClickRto <= 60) {
                    if (Laya.stage.screenMode == 'horizontal') {
                        this.easy_click.height = Laya.stage.height;
                        this.easy_click.width = 800 + (Laya.stage.width - 800) / 3;
                    } else {
                        this.easy_click.width = Laya.stage.width;
                        this.easy_click.height = 800 + (Laya.stage.height - 800) / 3;
                    }
                } else {
                    this.easy_click.height = Laya.stage.height;
                    this.easy_click.width = Laya.stage.width;
                }
                this.easy_click.visible = true;
            }
        }*/
    onDisable() {
        this.hide_back && this.hide_back();
        this.hide_back = null;
    }
    onDestroy() {
        //@ts-ignore
        qg.offShow();
        this.hide_back = null;
    }
}
exports.default = gx_ui_interstitial;
