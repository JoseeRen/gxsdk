"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("../../core/GxEnum");
const GxGame_1 = __importDefault(require("../../GxGame"));
const ResUtil_1 = __importDefault(require("../../util/ResUtil"));
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
let native_inner_interstitial = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _icon_close_decorators;
    let _icon_close_initializers = [];
    let _icon_close_extraInitializers = [];
    let _lb_title_decorators;
    let _lb_title_initializers = [];
    let _lb_title_extraInitializers = [];
    let _lb_desc_decorators;
    let _lb_desc_initializers = [];
    let _lb_desc_extraInitializers = [];
    let _ad_logo_decorators;
    let _ad_logo_initializers = [];
    let _ad_logo_extraInitializers = [];
    let _img_icon_decorators;
    let _img_icon_initializers = [];
    let _img_icon_extraInitializers = [];
    var native_inner_interstitial = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.icon_close = __runInitializers(this, _icon_close_initializers, null);
            this.lb_title = (__runInitializers(this, _icon_close_extraInitializers), __runInitializers(this, _lb_title_initializers, null));
            this.lb_desc = (__runInitializers(this, _lb_title_extraInitializers), __runInitializers(this, _lb_desc_initializers, null));
            this.ad_logo = (__runInitializers(this, _lb_desc_extraInitializers), __runInitializers(this, _ad_logo_initializers, null));
            this.img_icon = (__runInitializers(this, _ad_logo_extraInitializers), __runInitializers(this, _img_icon_initializers, null));
            /**
             * 原生广告数据
             */
            this.native_data = __runInitializers(this, _img_icon_extraInitializers);
            //点击结算原生回调
            this.click_back = undefined;
            this.has_click_warp = false;
        }
        on_click_adv() {
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
                // 自动切换
                this.update_view();
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
            else {
            }
        }
        show(parent, native_data, click_back, show_back, hide_back, is_new_type) {
            if (this.node && !this.node.parent) {
                this.native_data = native_data;
                this.show_back = show_back || undefined;
                this.hide_back = hide_back || undefined;
                this.click_back = click_back || undefined;
                this.node.parent = parent;
                this.set_default_pos();
                this.on_show();
            }
        }
        update_view() {
            if (GxGame_1.default.adConfig.canRefresh) {
                let native_data = GxGame_1.default.Ad().getLocalNativeData(GxEnum_1.ad_native_type.inter1);
                if (native_data && (0, cc_1.isValid)(this.node, true) && this.node.activeInHierarchy) {
                    this.native_data = native_data;
                    this.refresh();
                }
            }
            else {
                this.hide();
            }
        }
        /**
         * 上报点击后  重新拉取原生数据刷新界面
         */
        report_click_update_view(native_data) {
            if (this.node && this.node.parent) {
                this.native_data = native_data;
                this.refresh();
            }
        }
        start() {
            let childByName = this.node.getChildByName("native_node");
            if (childByName) {
                let adflag = childByName.getChildByName("adflag");
                let adflagmi = childByName.getChildByName("adflagmi");
                if (adflag) {
                    if (GxConstant_1.default.IS_MI_GAME) {
                        adflag.active = false;
                    }
                    else {
                        adflag.active = true;
                    }
                }
                if (adflagmi) {
                    if (GxConstant_1.default.IS_MI_GAME) {
                        adflagmi.active = true;
                    }
                    else {
                        adflagmi.active = false;
                    }
                }
            }
        }
        on_show() {
            this.icon_close.on(cc_1.Node.EventType.TOUCH_END, this.on_click_close, this);
            this.img_icon.node.on(cc_1.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.refresh();
            this.show_back && this.show_back();
        }
        refresh() {
            this.lb_title.string = this.native_data.title || "";
            this.lb_desc.string = this.native_data.desc || "";
            this.ad_logo.string = this.native_data.logoTxt || "广告";
            if (GxConstant_1.default.IS_HUAWEI_GAME) {
                this.ad_logo.string = "广告";
            }
            let image_list = this.native_data.imgUrlList;
            if (image_list.length <= 0) {
                image_list = this.native_data.iconUrlList;
            }
            if (image_list.length > 0) {
                let url = image_list[0];
                let index = url.lastIndexOf(".");
                let type = url.substring(index + 1) || 'png';
                ResUtil_1.default.loadRemoteSpiteFrame(url, (err, sp) => {
                    if (!(0, cc_1.isValid)(this.node, true))
                        return;
                    if (err) {
                        return this.img_icon.getComponent(cc_1.Sprite).spriteFrame = null;
                    }
                    this.img_icon.getComponent(cc_1.Sprite).spriteFrame = sp;
                });
                /*    cc.loader.load({
                        url: url,
                        type: type
                    }, (err: Error, tex:cc.Texture2D)=>{
                        if (!cc.isValid(this.node, true)) return;
                        if (err) {
                            return this.img_icon.getComponent(cc.Sprite).spriteFrame = null;
                        }
                        this.img_icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                    });*/
            }
            this.report_show();
        }
        hide() {
            if (this.node && this.node.parent) {
                this.node.parent.removeChild(this.node);
                this.on_hide();
            }
        }
        on_hide() {
            this.icon_close.off(cc_1.Node.EventType.TOUCH_END, this.on_click_close, this);
            this.img_icon.node.off(cc_1.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.hide_back && this.hide_back();
        }
        set_default_pos() {
            let parent = this.node.parent;
            let x = parent.width * (0.5 - parent.anchorX);
            let y = parent.height * (0.5 - parent.anchorY);
            this.node.position = (0, cc_1.v3)(x, y, 0);
        }
        set_style_pos(x, y) {
        }
        onDisable() {
            this.hide_back && this.hide_back();
            this.hide_back = null;
            this.unschedule(this.update_view);
        }
        onDestroy() {
            this.hide_back && this.hide_back();
            this.hide_back = null;
            this.unschedule(this.update_view);
        }
    };
    __setFunctionName(_classThis, "native_inner_interstitial");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _icon_close_decorators = [property(cc_1.Node)];
        _lb_title_decorators = [property(cc_1.Label)];
        _lb_desc_decorators = [property(cc_1.Label)];
        _ad_logo_decorators = [property(cc_1.Label)];
        _img_icon_decorators = [property(cc_1.Sprite)];
        __esDecorate(null, null, _icon_close_decorators, { kind: "field", name: "icon_close", static: false, private: false, access: { has: obj => "icon_close" in obj, get: obj => obj.icon_close, set: (obj, value) => { obj.icon_close = value; } }, metadata: _metadata }, _icon_close_initializers, _icon_close_extraInitializers);
        __esDecorate(null, null, _lb_title_decorators, { kind: "field", name: "lb_title", static: false, private: false, access: { has: obj => "lb_title" in obj, get: obj => obj.lb_title, set: (obj, value) => { obj.lb_title = value; } }, metadata: _metadata }, _lb_title_initializers, _lb_title_extraInitializers);
        __esDecorate(null, null, _lb_desc_decorators, { kind: "field", name: "lb_desc", static: false, private: false, access: { has: obj => "lb_desc" in obj, get: obj => obj.lb_desc, set: (obj, value) => { obj.lb_desc = value; } }, metadata: _metadata }, _lb_desc_initializers, _lb_desc_extraInitializers);
        __esDecorate(null, null, _ad_logo_decorators, { kind: "field", name: "ad_logo", static: false, private: false, access: { has: obj => "ad_logo" in obj, get: obj => obj.ad_logo, set: (obj, value) => { obj.ad_logo = value; } }, metadata: _metadata }, _ad_logo_initializers, _ad_logo_extraInitializers);
        __esDecorate(null, null, _img_icon_decorators, { kind: "field", name: "img_icon", static: false, private: false, access: { has: obj => "img_icon" in obj, get: obj => obj.img_icon, set: (obj, value) => { obj.img_icon = value; } }, metadata: _metadata }, _img_icon_initializers, _img_icon_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        native_inner_interstitial = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return native_inner_interstitial = _classThis;
})();
exports.default = native_inner_interstitial;
