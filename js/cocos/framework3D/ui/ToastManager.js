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
exports.Toast = void 0;
const ToastComponent_1 = __importDefault(require("./ToastComponent"));
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
exports.Toast = null;
let ToastManager = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _prefab_decorators;
    let _prefab_initializers = [];
    let _prefab_extraInitializers = [];
    var ToastManager = _classThis = class extends _classSuper {
        onLoad() {
            exports.Toast = this;
        }
        start() {
            this.toastPool = new cc_1.NodePool();
        }
        onDestroy() {
            this.toastPool.clear();
        }
        make(text, dur = 1.3) {
            //show toast 
            let node = this.toastPool.get();
            let toastComp = null;
            if (node == null) {
                node = (0, cc_1.instantiate)(this.prefab);
                toastComp = node.getComponent(ToastComponent_1.default);
                if (toastComp == null) {
                    console.warn("Toast.make : Toast Prefab must contains ToastComponent");
                }
                // ToastManager.toastPool.put(node);
                // node = ToastManager.toastPool.get();
            }
            else {
                toastComp = node.getComponent(ToastComponent_1.default);
            }
            if (node.parent == null)
                this.node.addChild(node);
            this.show(toastComp, text, dur);
            return toastComp;
        }
        show(toastComp, text, dur) {
            toastComp.show(text);
            this.scheduleOnce(_ => {
                toastComp.hide(_ => {
                    this.toastPool.put(toastComp.node);
                    console.log("Toast.hide toastpool size:", this.toastPool.size());
                });
            }, dur);
        }
        constructor() {
            super(...arguments);
            this.toastPool = null;
            this.prefab = __runInitializers(this, _prefab_initializers, null);
            __runInitializers(this, _prefab_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ToastManager");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _prefab_decorators = [property(cc_1.Prefab)];
        __esDecorate(null, null, _prefab_decorators, { kind: "field", name: "prefab", static: false, private: false, access: { has: obj => "prefab" in obj, get: obj => obj.prefab, set: (obj, value) => { obj.prefab = value; } }, metadata: _metadata }, _prefab_initializers, _prefab_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ToastManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ToastManager = _classThis;
})();
exports.default = ToastManager;
