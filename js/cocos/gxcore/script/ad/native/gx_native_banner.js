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
const GxAdParams_1 = require("../../GxAdParams");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const { ccclass, property } = cc._decorator;
let native_banner = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _instanceExtraInitializers = [];
    let _icon_close_decorators;
    let _icon_close_initializers = [];
    let _lb_title_decorators;
    let _lb_title_initializers = [];
    let _lb_desc_decorators;
    let _lb_desc_initializers = [];
    let _ad_logo_decorators;
    let _ad_logo_initializers = [];
    let _img_icon_decorators;
    let _img_icon_initializers = [];
    var native_banner = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.icon_close = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _icon_close_initializers, null));
            this.lb_title = __runInitializers(this, _lb_title_initializers, null);
            this.lb_desc = __runInitializers(this, _lb_desc_initializers, null);
            this.ad_logo = __runInitializers(this, _ad_logo_initializers, null);
            this.img_icon = __runInitializers(this, _img_icon_initializers, null);
            /**
             * 是否上报过点击
             */
            this.is_reprot_click = false;
            this.onShow = null;
            this.onHide = null;
            this.has_click_warp = false;
        }
        click_adv_warp() {
            this.report_click();
            this.has_click_warp = true;
        }
        show(native_data, on_show, on_hide) {
            this.onShow = on_show;
            this.onHide = on_hide;
            if (this.node && cc.isValid(this.node)) {
                this.node.parent = cc.director.getScene();
                cc.game.addPersistRootNode(this.node);
                this.node.zIndex = cc.macro.MAX_ZINDEX;
                this.node.active = false;
            }
            if (cc.isValid(this.node) && !this.node.active) {
                if (cc.winSize.width <= cc.winSize.height) {
                    this.node.scale = cc.winSize.width / this.node.width;
                }
                else {
                    this.node.scale = 0.7;
                }
                if (GxAdParams_1.AdParams.oppo.bannerOnTop) {
                    let component = this.node.getComponent(cc.Widget);
                    if (component) {
                        component.isAlignBottom = false;
                        component.isAlignTop = true;
                        component.top = 0;
                    }
                    else {
                        component.isAlignTop = false;
                        component.isAlignBottom = true;
                        component.bottom = 0;
                    }
                }
                this.set_default_pos();
                this.on_show(native_data);
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
            this.node.on(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
        }
        update_view() {
            if (!cc.isValid(this.node) || !this.node.activeInHierarchy) {
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
        on_show(native_data) {
            if (native_data) {
                this.native_data = native_data;
            }
            else {
                this.native_data = GxGame_1.default.Ad().getLocalNativeData(GxEnum_1.ad_native_type.banner);
            }
            if (this.native_data) {
                this.node.active = true;
                this.is_reprot_click = false;
                this.refresh();
            }
            else {
                this.hide();
            }
        }
        refresh() {
            this.lb_desc.string = this.native_data.desc || "";
            this.lb_title.string = this.native_data.title || "";
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
                // let type= url.substring(index + 1) || 'png';
                ResUtil_1.default.loadRemoteSpiteFrame(url, (err, sp) => {
                    if (!cc.isValid(this.node, true))
                        return;
                    if (err) {
                        return this.img_icon.getComponent(cc.Sprite).spriteFrame = null;
                    }
                    this.img_icon.getComponent(cc.Sprite).spriteFrame = sp;
                });
                /* cc.loader.load({
                     url: url,
                     type: 'png'
                 }, (err: Error, tex:cc.Texture2D)=>{
                     if (!cc.isValid(this.node, true)) return;
                     if (err) {
                         return this.img_icon.getComponent(cc.Sprite).spriteFrame = null;
                     }
                     this.img_icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                 });*/
            }
            this.report_show();
            this.onShow && this.onShow();
        }
        on_click_adv2() {
            this.on_click_adv();
        }
        on_click_adv() {
            if (this.is_reprot_click) {
                return;
            }
            this.is_reprot_click = true;
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
        hide() {
            if (this.node && this.node.active) {
                this.node.active = false;
            }
            this.on_hide();
        }
        on_hide() {
            this.onHide && this.onHide();
        }
        set_default_pos() {
            this.node.x = 0;
            this.node.y = -cc.winSize.height / 2;
        }
        onDisable() {
            this.unschedule(this.update_view);
        }
        onDestroy() {
            this.unschedule(this.update_view);
        }
    };
    __setFunctionName(_classThis, "native_banner");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _icon_close_decorators = [property(cc.Node)];
        _lb_title_decorators = [property(cc.Label)];
        _lb_desc_decorators = [property(cc.Label)];
        _ad_logo_decorators = [property(cc.Label)];
        _img_icon_decorators = [property(cc.Sprite)];
        __esDecorate(null, null, _icon_close_decorators, { kind: "field", name: "icon_close", static: false, private: false, access: { has: obj => "icon_close" in obj, get: obj => obj.icon_close, set: (obj, value) => { obj.icon_close = value; } }, metadata: _metadata }, _icon_close_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lb_title_decorators, { kind: "field", name: "lb_title", static: false, private: false, access: { has: obj => "lb_title" in obj, get: obj => obj.lb_title, set: (obj, value) => { obj.lb_title = value; } }, metadata: _metadata }, _lb_title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lb_desc_decorators, { kind: "field", name: "lb_desc", static: false, private: false, access: { has: obj => "lb_desc" in obj, get: obj => obj.lb_desc, set: (obj, value) => { obj.lb_desc = value; } }, metadata: _metadata }, _lb_desc_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _ad_logo_decorators, { kind: "field", name: "ad_logo", static: false, private: false, access: { has: obj => "ad_logo" in obj, get: obj => obj.ad_logo, set: (obj, value) => { obj.ad_logo = value; } }, metadata: _metadata }, _ad_logo_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _img_icon_decorators, { kind: "field", name: "img_icon", static: false, private: false, access: { has: obj => "img_icon" in obj, get: obj => obj.img_icon, set: (obj, value) => { obj.img_icon = value; } }, metadata: _metadata }, _img_icon_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        native_banner = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return native_banner = _classThis;
})();
exports.default = native_banner;
