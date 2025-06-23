"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const Signal_1 = __importDefault(require("../../core/Signal"));
const { ccclass, property, menu, executeInEditMode, inspector } = cc_1._decorator;
let Switcher = (() => {
    let _classDecorators = [ccclass, menu("扩展UI/Switcher"), executeInEditMode()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _instanceExtraInitializers = [];
    let __childrenCount_decorators;
    let __childrenCount_initializers = [];
    let __childrenCount_extraInitializers = [];
    let __currentIndex_decorators;
    let __currentIndex_initializers = [];
    let __currentIndex_extraInitializers = [];
    let _interactable_decorators;
    let _interactable_initializers = [];
    let _interactable_extraInitializers = [];
    let _get_currentIndex_decorators;
    let __currentChild_decorators;
    let __currentChild_initializers = [];
    let __currentChild_extraInitializers = [];
    var Switcher = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.children = (__runInitializers(this, _instanceExtraInitializers), null);
            this.onValueChanged = new Signal_1.default();
            this._childrenCount = __runInitializers(this, __childrenCount_initializers, 0);
            this._currentIndex = (__runInitializers(this, __childrenCount_extraInitializers), __runInitializers(this, __currentIndex_initializers, 0));
            this.interactable = (__runInitializers(this, __currentIndex_extraInitializers), __runInitializers(this, _interactable_initializers, false));
            this._currentChild = (__runInitializers(this, _interactable_extraInitializers), __runInitializers(this, __currentChild_initializers, null));
            this.btn = (__runInitializers(this, __currentChild_extraInitializers), null);
        }
        get currentIndex() {
            return this._currentIndex;
        }
        set currentIndex(value) {
            value = cc_1.math.clamp(value, 0, this.children.length - 1);
            value = Math.floor(value);
            this._select(value);
        }
        set resizeToCurrent(v) {
            if (v) {
                this.node.setContentSize(this._currentChild.getContentSize());
            }
        }
        set _checkInteractive(v) {
            if (v) {
                this.btn = this.getComponent(cc_1.ButtonComponent);
                if (this.btn == null) {
                    this.btn = this.addComponent(cc_1.ButtonComponent);
                    this.btn.target = this._currentChild;
                    let evt = new cc_1.EventHandler();
                    evt.target = this.node;
                    evt.component = "Switcher";
                    evt.handler = "switch";
                    this.btn.clickEvents.push(evt);
                }
            }
            else {
                if (this.btn) {
                    this.btn.destroy();
                }
            }
        }
        onLoad() {
            // this._currentIndex = this.children.indexOf(this.currentActiveNode);
        }
        resetInEditor() {
        }
        start() {
            this.children = this.node.children;
            this._childrenCount = this.children.length;
            this._select(this.currentIndex);
            // this.resizeToCurrent = true;
            this._checkInteractive = this.interactable;
        }
        _select(index) {
            this._currentIndex = index;
            this._currentChild = this.children[index];
            for (let i = 0; i < this.children.length; i++) {
                const element = this.children[i];
                if (i == index) {
                    element.active = true;
                }
                else {
                    element.active = false;
                }
            }
        }
        switch() {
            this.index = (this.currentIndex + 1) % (this._childrenCount);
        }
        set index(index) {
            if (!this.children) {
                this._currentIndex = index;
            }
            if (this.currentIndex != index) {
                this._select(index);
                this.onValueChanged.fire(index);
            }
        }
    };
    __setFunctionName(_classThis, "Switcher");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __childrenCount_decorators = [property({ visible: false })];
        __currentIndex_decorators = [property()];
        _interactable_decorators = [property({ displayName: "交互" })];
        _get_currentIndex_decorators = [property({ displayName: "当前值", slide: true, min: 0, max: 10, step: 1 })];
        __currentChild_decorators = [property({ type: cc_1.Node, visible: false })];
        __esDecorate(_classThis, null, _get_currentIndex_decorators, { kind: "getter", name: "currentIndex", static: false, private: false, access: { has: obj => "currentIndex" in obj, get: obj => obj.currentIndex }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, __childrenCount_decorators, { kind: "field", name: "_childrenCount", static: false, private: false, access: { has: obj => "_childrenCount" in obj, get: obj => obj._childrenCount, set: (obj, value) => { obj._childrenCount = value; } }, metadata: _metadata }, __childrenCount_initializers, __childrenCount_extraInitializers);
        __esDecorate(null, null, __currentIndex_decorators, { kind: "field", name: "_currentIndex", static: false, private: false, access: { has: obj => "_currentIndex" in obj, get: obj => obj._currentIndex, set: (obj, value) => { obj._currentIndex = value; } }, metadata: _metadata }, __currentIndex_initializers, __currentIndex_extraInitializers);
        __esDecorate(null, null, _interactable_decorators, { kind: "field", name: "interactable", static: false, private: false, access: { has: obj => "interactable" in obj, get: obj => obj.interactable, set: (obj, value) => { obj.interactable = value; } }, metadata: _metadata }, _interactable_initializers, _interactable_extraInitializers);
        __esDecorate(null, null, __currentChild_decorators, { kind: "field", name: "_currentChild", static: false, private: false, access: { has: obj => "_currentChild" in obj, get: obj => obj._currentChild, set: (obj, value) => { obj._currentChild = value; } }, metadata: _metadata }, __currentChild_initializers, __currentChild_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Switcher = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Switcher = _classThis;
})();
exports.default = Switcher;
