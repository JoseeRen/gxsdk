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
const cc_1 = require("cc");
const GxGame_1 = __importDefault(require("../GxGame"));
const { ccclass, property } = cc_1._decorator;
let Gx_add_icon = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _btnAddIcon_decorators;
    let _btnAddIcon_initializers = [];
    let _btnAddIcon_extraInitializers = [];
    let _btnWatchAd_decorators;
    let _btnWatchAd_initializers = [];
    let _btnWatchAd_extraInitializers = [];
    let _innerNative_decorators;
    let _innerNative_initializers = [];
    let _innerNative_extraInitializers = [];
    var Gx_add_icon = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.btnAddIcon = __runInitializers(this, _btnAddIcon_initializers, null);
            this.btnWatchAd = (__runInitializers(this, _btnAddIcon_extraInitializers), __runInitializers(this, _btnWatchAd_initializers, null));
            this.innerNative = (__runInitializers(this, _btnWatchAd_extraInitializers), __runInitializers(this, _innerNative_initializers, null));
            this.onSucc = (__runInitializers(this, _innerNative_extraInitializers), null);
            this.onHide = null;
        }
        onLoad() {
        }
        start() {
            this.node.siblingIndex = 10000;
        }
        show(on_hide, on_succ) {
            if (this.node.parent == null) {
                cc_1.director.getScene().getChildByName("Canvas").addChild(this.node);
            }
            this.onSucc = on_succ;
            this.onHide = on_hide;
        }
        tapAddIcon() {
            GxGame_1.default.Ad().addDesktop(() => {
                if (this.btnAddIcon) {
                    this.btnAddIcon.active = false;
                }
                this.onSucc && this.onSucc();
            });
        }
        tapClose() {
            this.node.destroy();
        }
        onDestroy() {
            this.onHide && this.onHide();
        }
        onEnable() {
            this.btnWatchAd.active = false;
            GxGame_1.default.Ad().showInterstitialNative(this.innerNative, () => {
            }, () => {
                this.btnWatchAd.active = true;
            }, () => {
                this.btnWatchAd.active = false;
                GxGame_1.default.Ad().showBanner(() => {
                }, () => {
                });
            });
        }
        tapWatchAd() {
            GxGame_1.default.Ad().clickNativeInnerInterstitial();
        }
    };
    __setFunctionName(_classThis, "Gx_add_icon");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _btnAddIcon_decorators = [property(cc_1.Node)];
        _btnWatchAd_decorators = [property(cc_1.Node)];
        _innerNative_decorators = [property(cc_1.Node)];
        __esDecorate(null, null, _btnAddIcon_decorators, { kind: "field", name: "btnAddIcon", static: false, private: false, access: { has: obj => "btnAddIcon" in obj, get: obj => obj.btnAddIcon, set: (obj, value) => { obj.btnAddIcon = value; } }, metadata: _metadata }, _btnAddIcon_initializers, _btnAddIcon_extraInitializers);
        __esDecorate(null, null, _btnWatchAd_decorators, { kind: "field", name: "btnWatchAd", static: false, private: false, access: { has: obj => "btnWatchAd" in obj, get: obj => obj.btnWatchAd, set: (obj, value) => { obj.btnWatchAd = value; } }, metadata: _metadata }, _btnWatchAd_initializers, _btnWatchAd_extraInitializers);
        __esDecorate(null, null, _innerNative_decorators, { kind: "field", name: "innerNative", static: false, private: false, access: { has: obj => "innerNative" in obj, get: obj => obj.innerNative, set: (obj, value) => { obj.innerNative = value; } }, metadata: _metadata }, _innerNative_initializers, _innerNative_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_add_icon = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_add_icon = _classThis;
})();
exports.default = Gx_add_icon;
