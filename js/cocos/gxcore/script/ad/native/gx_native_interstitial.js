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
let native_interstitial = (() => {
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
    let _img_bg_decorators;
    let _img_bg_initializers = [];
    let _btn_check_decorators;
    let _btn_check_initializers = [];
    let _easy_click_decorators;
    let _easy_click_initializers = [];
    let _native_node_decorators;
    let _native_node_initializers = [];
    let _lageBg_decorators;
    let _lageBg_initializers = [];
    var native_interstitial = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.icon_close = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _icon_close_initializers, null));
            this.lb_title = __runInitializers(this, _lb_title_initializers, null);
            this.lb_desc = __runInitializers(this, _lb_desc_initializers, null);
            this.ad_logo = __runInitializers(this, _ad_logo_initializers, null);
            this.img_icon = __runInitializers(this, _img_icon_initializers, null);
            this.img_bg = __runInitializers(this, _img_bg_initializers, null);
            this.btn_check = __runInitializers(this, _btn_check_initializers, null);
            this.easy_click = __runInitializers(this, _easy_click_initializers, null);
            this.native_node = __runInitializers(this, _native_node_initializers, null);
            this.lageBg = __runInitializers(this, _lageBg_initializers, null);
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
            this.node.zIndex = 10001;
            cc.director.once("清除原生", this.hide.bind(this));
        }
        on_click_adv2() {
            this.easy_click.active = false;
            this.has_easy_click = true;
            this.report_click();
        }
        on_click_adv() {
            this.report_click();
        }
        on_click_close() {
            /*  if (!GxGame.isShenHe && !GxGame.inBlockArea && GxGame.adConfig.closeClickRto >= 0 && Math.random() * 100 <= GxGame.adConfig.closeClickRto && !this.has_easy_click) {
                  this.easy_click.active = false;
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
                    if (native_data && cc.isValid(this.node, true)) {
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
            if (this.node && !this.node.parent) {
                this.native_data = native_data;
                this.node.parent = cc.director.getScene();
                this.node.zIndex = 100000;
                this.show_back = on_show || undefined;
                this.hide_back = on_hide || undefined;
                this.on_show();
            }
        }
        on_show() {
            if (GxGame_1.default.Ad().canIn() && this.lageBg) {
                this.lageBg.active = true;
                this.lageBg.on(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            }
            else {
                this.lageBg.active = false;
            }
            this.native_node.on(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.icon_close.on(cc.Node.EventType.TOUCH_END, this.on_click_close, this);
            this.img_bg.node.on(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.btn_check.on(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.easy_click.on(cc.Node.EventType.TOUCH_END, this.on_click_adv2, this);
            // this.set_easy_click_size();
            this.refresh();
            this.show_back && this.show_back();
        }
        refresh() {
            this.lb_title.string = this.native_data.title || "";
            this.lb_desc.string = this.native_data.desc || "";
            this.ad_logo.string = this.native_data.logoTxt || this.native_data.source || "广告";
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
                /*  if (url.endsWith(".webp")) {
    
    
                      if (this.native_data["iconUrlList"] && this.native_data.iconUrlList.length > 0) {
                          url = this.native_data.iconUrlList[0]
                      }
                      if (url.endsWith(".webp") && this.native_data["icon"]) {
                          url = this.native_data.icon
    
    
                      }
    
                  }*/
                console.log("1111finalUrl:" + url);
                ResUtil_1.default.loadRemoteSpiteFrame(url, (err, sp) => {
                    if (!cc.isValid(this.node, true))
                        return;
                    if (err) {
                        return this.img_bg.getComponent(cc.Sprite).spriteFrame = null;
                    }
                    this.img_bg.getComponent(cc.Sprite).spriteFrame = sp;
                });
                let iconUrl = "";
                if (this.native_data["iconUrlList"] && this.native_data["iconUrlList"].length > 0) {
                    iconUrl = this.native_data["iconUrlList"][0];
                }
                else if (this.native_data["icon"]) {
                    iconUrl = this.native_data["icon"];
                }
                if (!!iconUrl) {
                    this.img_icon.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    this.img_icon.node.width = 150;
                    this.img_icon.node.width = 150;
                    ResUtil_1.default.loadRemoteSpiteFrame(iconUrl, (err, sp) => {
                        if (!cc.isValid(this.node, true))
                            return;
                        if (err) {
                            return this.img_icon.spriteFrame = null;
                        }
                        this.img_icon.spriteFrame = sp;
                    });
                }
                /*  cc.loader.load({
                      url: url,
                      type: 'png'
                  }, (err: Error, tex: cc.Texture2D) => {
                      if (!cc.isValid(this.node, true)) return;
                      if (err) {
                          return this.img_bg.getComponent(cc.Sprite).spriteFrame = null;
                      }
                      this.img_bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                  });*/
            }
            this.report_show();
            this.has_easy_click = false;
            // this.set_easy_click_size();
        }
        hide() {
            if (this.node && this.node.parent) {
                this.node.destroy();
                this.on_hide();
            }
        }
        on_hide() {
            // this.lageBg.active=true;
            this.lageBg && this.lageBg.active && this.lageBg.on(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.lageBg.active = false;
            this.native_node.off(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.icon_close.off(cc.Node.EventType.TOUCH_END, this.on_click_close, this);
            this.img_bg.node.off(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.btn_check.off(cc.Node.EventType.TOUCH_END, this.on_click_adv, this);
            this.easy_click.off(cc.Node.EventType.TOUCH_END, this.on_click_adv2, this);
            this.hide_back && this.hide_back();
        }
        /*    set_easy_click_size() {
                this.easy_click.active = false;
             /!*   if (!GxGame.isShenHe && !GxGame.inBlockArea && GxGame.adConfig.forceClickRto >= 0) {
                    if (GxGame.adConfig.forceClickRto <= 30) {
                        if (cc.winSize.width > cc.winSize.height) {
                            this.easy_click.height = cc.winSize.height;
                            this.easy_click.width = 800;
                        } else {
                            this.easy_click.width = cc.winSize.width;
                            this.easy_click.height = 800;
                        }
                    } else if (GxGame.adConfig.forceClickRto <= 60) {
                        if (cc.winSize.width > cc.winSize.height) {
                            this.easy_click.height = cc.winSize.height;
                            this.easy_click.width = 800 + (cc.winSize.width - 800) / 3;
                        } else {
                            this.easy_click.width = cc.winSize.width;
                            this.easy_click.height = 800 + (cc.winSize.height - 800) / 3;
                        }
                    } else {
                        this.easy_click.height = cc.winSize.height;
                        this.easy_click.width = cc.winSize.width;
                    }
                    this.easy_click.active = true;
                }*!/
            }*/
        onDisable() {
            this.hide_back && this.hide_back();
            this.hide_back = null;
        }
        onDestroy() {
            cc.director.off("清除原生", this.hide.bind(this));
            this.hide_back = null;
        }
    };
    __setFunctionName(_classThis, "native_interstitial");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _icon_close_decorators = [property(cc.Node)];
        _lb_title_decorators = [property(cc.Label)];
        _lb_desc_decorators = [property(cc.Label)];
        _ad_logo_decorators = [property(cc.Label)];
        _img_icon_decorators = [property(cc.Sprite)];
        _img_bg_decorators = [property(cc.Sprite)];
        _btn_check_decorators = [property(cc.Node)];
        _easy_click_decorators = [property(cc.Node)];
        _native_node_decorators = [property(cc.Node)];
        _lageBg_decorators = [property(cc.Node)];
        __esDecorate(null, null, _icon_close_decorators, { kind: "field", name: "icon_close", static: false, private: false, access: { has: obj => "icon_close" in obj, get: obj => obj.icon_close, set: (obj, value) => { obj.icon_close = value; } }, metadata: _metadata }, _icon_close_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lb_title_decorators, { kind: "field", name: "lb_title", static: false, private: false, access: { has: obj => "lb_title" in obj, get: obj => obj.lb_title, set: (obj, value) => { obj.lb_title = value; } }, metadata: _metadata }, _lb_title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lb_desc_decorators, { kind: "field", name: "lb_desc", static: false, private: false, access: { has: obj => "lb_desc" in obj, get: obj => obj.lb_desc, set: (obj, value) => { obj.lb_desc = value; } }, metadata: _metadata }, _lb_desc_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _ad_logo_decorators, { kind: "field", name: "ad_logo", static: false, private: false, access: { has: obj => "ad_logo" in obj, get: obj => obj.ad_logo, set: (obj, value) => { obj.ad_logo = value; } }, metadata: _metadata }, _ad_logo_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _img_icon_decorators, { kind: "field", name: "img_icon", static: false, private: false, access: { has: obj => "img_icon" in obj, get: obj => obj.img_icon, set: (obj, value) => { obj.img_icon = value; } }, metadata: _metadata }, _img_icon_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _img_bg_decorators, { kind: "field", name: "img_bg", static: false, private: false, access: { has: obj => "img_bg" in obj, get: obj => obj.img_bg, set: (obj, value) => { obj.img_bg = value; } }, metadata: _metadata }, _img_bg_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _btn_check_decorators, { kind: "field", name: "btn_check", static: false, private: false, access: { has: obj => "btn_check" in obj, get: obj => obj.btn_check, set: (obj, value) => { obj.btn_check = value; } }, metadata: _metadata }, _btn_check_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _easy_click_decorators, { kind: "field", name: "easy_click", static: false, private: false, access: { has: obj => "easy_click" in obj, get: obj => obj.easy_click, set: (obj, value) => { obj.easy_click = value; } }, metadata: _metadata }, _easy_click_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _native_node_decorators, { kind: "field", name: "native_node", static: false, private: false, access: { has: obj => "native_node" in obj, get: obj => obj.native_node, set: (obj, value) => { obj.native_node = value; } }, metadata: _metadata }, _native_node_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lageBg_decorators, { kind: "field", name: "lageBg", static: false, private: false, access: { has: obj => "lageBg" in obj, get: obj => obj.lageBg, set: (obj, value) => { obj.lageBg = value; } }, metadata: _metadata }, _lageBg_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        native_interstitial = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return native_interstitial = _classThis;
})();
exports.default = native_interstitial;
