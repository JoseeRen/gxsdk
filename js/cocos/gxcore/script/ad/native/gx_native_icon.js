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
const { ccclass, property } = cc._decorator;
let native_icon = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _icon_close_decorators;
    let _icon_close_initializers = [];
    let _icon_close_extraInitializers = [];
    let _native_node_decorators;
    let _native_node_initializers = [];
    let _native_node_extraInitializers = [];
    let _img_icon_decorators;
    let _img_icon_initializers = [];
    let _img_icon_extraInitializers = [];
    let _ad_logo_decorators;
    let _ad_logo_initializers = [];
    let _ad_logo_extraInitializers = [];
    var native_icon = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.icon_close = __runInitializers(this, _icon_close_initializers, null);
            this.native_node = (__runInitializers(this, _icon_close_extraInitializers), __runInitializers(this, _native_node_initializers, null));
            this.img_icon = (__runInitializers(this, _native_node_extraInitializers), __runInitializers(this, _img_icon_initializers, null));
            this.ad_logo = (__runInitializers(this, _img_icon_extraInitializers), __runInitializers(this, _ad_logo_initializers, null));
            /**
             * 原生广告数据
             */
            this.native_data = __runInitializers(this, _ad_logo_extraInitializers);
            this.set_background_on_show();
        }
        on_click_adv() {
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
        /**
         * 广告被曝光
         */
        report_show() {
            if (this.native_data) {
                GxGame_1.default.Ad().reportAdShow(this.native_data);
            }
        }
        show(parent, native_data) {
            if (this.node && !this.node.parent && parent && native_data) {
                this.native_data = native_data;
                this.node.parent = parent;
                this.on_show();
            }
        }
        update_view() {
            if (GxGame_1.default.adConfig.canRefresh) {
                this.hide();
                return;
            }
            if (!cc.isValid(this.node) || !this.node.activeInHierarchy)
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
            if (this.node && this.node.parent) {
                this.native_data = native_data;
                this.refresh();
            }
        }
        on_show() {
            this.icon_close.on(cc.Node.EventType.TOUCH_END, this.on_click_close, this);
            this.img_icon.node.on(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.refresh();
        }
        refresh() {
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
                    if (!cc.isValid(this.node, true))
                        return;
                    if (err) {
                        return this.img_icon.getComponent(cc.Sprite).spriteFrame = null;
                    }
                    this.img_icon.getComponent(cc.Sprite).spriteFrame = sp;
                });
                /*    cc.loader.load({
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
        }
        hide() {
            if (this.node && this.node.parent) {
                this.node.parent.removeChild(this.node);
                this.on_hide();
            }
        }
        on_hide() {
            this.icon_close.off(cc.Node.EventType.TOUCH_END, this.on_click_close, this);
            this.img_icon.node.off(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
        }
        set_default() {
        }
        set_background_on_show() {
            let self = this;
        }
    };
    __setFunctionName(_classThis, "native_icon");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _icon_close_decorators = [property(cc.Node)];
        _native_node_decorators = [property(cc.Node)];
        _img_icon_decorators = [property(cc.Sprite)];
        _ad_logo_decorators = [property(cc.Label)];
        __esDecorate(null, null, _icon_close_decorators, { kind: "field", name: "icon_close", static: false, private: false, access: { has: obj => "icon_close" in obj, get: obj => obj.icon_close, set: (obj, value) => { obj.icon_close = value; } }, metadata: _metadata }, _icon_close_initializers, _icon_close_extraInitializers);
        __esDecorate(null, null, _native_node_decorators, { kind: "field", name: "native_node", static: false, private: false, access: { has: obj => "native_node" in obj, get: obj => obj.native_node, set: (obj, value) => { obj.native_node = value; } }, metadata: _metadata }, _native_node_initializers, _native_node_extraInitializers);
        __esDecorate(null, null, _img_icon_decorators, { kind: "field", name: "img_icon", static: false, private: false, access: { has: obj => "img_icon" in obj, get: obj => obj.img_icon, set: (obj, value) => { obj.img_icon = value; } }, metadata: _metadata }, _img_icon_initializers, _img_icon_extraInitializers);
        __esDecorate(null, null, _ad_logo_decorators, { kind: "field", name: "ad_logo", static: false, private: false, access: { has: obj => "ad_logo" in obj, get: obj => obj.ad_logo, set: (obj, value) => { obj.ad_logo = value; } }, metadata: _metadata }, _ad_logo_initializers, _ad_logo_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        native_icon = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return native_icon = _classThis;
})();
exports.default = native_icon;
