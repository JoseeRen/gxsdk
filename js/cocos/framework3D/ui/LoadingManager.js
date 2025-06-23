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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loading = void 0;
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
exports.Loading = null;
let LoadingManager = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _prefab_decorators;
    let _prefab_initializers = [];
    let _prefab_extraInitializers = [];
    var LoadingManager = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.prefab = __runInitializers(this, _prefab_initializers, null);
            this.loadingNode = (__runInitializers(this, _prefab_extraInitializers), null);
            this.loadingSprite = null;
            this.loadingText = null;
            this.blockEventComp = null;
            this._callback = null;
            this._target = null;
            // update (dt) {}
        }
        onLoad() {
            this.loadingNode = (0, cc_1.instantiate)(this.prefab);
            this.blockEventComp = this.loadingNode.getComponent(cc_1.BlockInputEventsComponent);
            this.loadingNode.parent = this.node;
            this.loadingNode.getComponent(cc_1.UIReorderComponent).priority = 9999;
            this.loadingSprite = this.loadingNode.getComponentInChildren(cc_1.SpriteComponent);
            this.loadingText = this.loadingNode.getComponentInChildren(cc_1.LabelComponent);
            this.hide();
            exports.Loading = this;
        }
        start() {
            // this.loadingSprite.node.runAction(cc.rotateBy(4,360).repeatForever());
        }
        dealyClose() {
            this.hide();
            if (this._callback) {
                this._callback.call(this._target);
            }
        }
        show(timeout, text = null, modal = true, callback = null, target = null) {
            if (!this.loadingNode)
                return;
            this.loadingNode.active = true;
            // this.loadingNode.resumeAllActions();
            this.blockEventComp.enabled = modal;
            this._callback = callback;
            this._target = target;
            if (text)
                this.loadingText.string = text;
            if (timeout > 0) {
                this.unschedule(this.dealyClose);
                this.scheduleOnce(this.dealyClose, timeout);
            }
        }
        hide() {
            this.loadingNode.active = false;
            // this.loadingNode.pauseAllActions();
        }
    };
    __setFunctionName(_classThis, "LoadingManager");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _prefab_decorators = [property(cc_1.Prefab)];
        __esDecorate(null, null, _prefab_decorators, { kind: "field", name: "prefab", static: false, private: false, access: { has: obj => "prefab" in obj, get: obj => obj.prefab, set: (obj, value) => { obj.prefab = value; } }, metadata: _metadata }, _prefab_initializers, _prefab_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoadingManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoadingManager = _classThis;
})();
exports.default = LoadingManager;
