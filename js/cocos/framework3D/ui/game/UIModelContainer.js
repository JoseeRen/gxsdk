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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const ccUtil_1 = __importDefault(require("../../../framework3D/utils/ccUtil"));
const Signal_1 = __importDefault(require("../../../framework3D/core/Signal"));
let { ccclass, property, executeInEditMode } = cc_1._decorator;
let UIModelContainer = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _instanceExtraInitializers = [];
    let __prefab_path_decorators;
    let __prefab_path_initializers = [];
    let __prefab_path_extraInitializers = [];
    let _get_prefab_path_decorators;
    let _loadingNode_decorators;
    let _loadingNode_initializers = [];
    let _loadingNode_extraInitializers = [];
    let _resetToZero_decorators;
    let _resetToZero_initializers = [];
    let _resetToZero_extraInitializers = [];
    var UIModelContainer = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this._prefab_path = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __prefab_path_initializers, ""));
            this.loadingNode = (__runInitializers(this, __prefab_path_extraInitializers), __runInitializers(this, _loadingNode_initializers, null));
            this.resetToZero = (__runInitializers(this, _loadingNode_extraInitializers), __runInitializers(this, _resetToZero_initializers, true));
            this.onLoaded = (__runInitializers(this, _resetToZero_extraInitializers), new Signal_1.default());
        }
        get prefab_path() {
            return this._prefab_path;
        }
        set prefab_path(value) {
            this._prefab_path = value;
            this.loadPrefab();
        }
        onLoad() {
        }
        start() {
            this.loadPrefab();
        }
        showLoading() {
            if (this.loadingNode)
                this.loadingNode.active = true;
        }
        hideLoading() {
            if (this.loadingNode)
                this.loadingNode.active = false;
        }
        loadPrefab() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isEmpty(this.prefab_path)) {
                    try {
                        this.showLoading();
                        let prefab = yield ccUtil_1.default.getPrefab(this.prefab_path);
                        this.node.destroyAllChildren();
                        let node = (0, cc_1.instantiate)(prefab);
                        this.onLoaded.fire(node);
                        if (this.resetToZero) {
                            node.position = cc_1.Vec3.ZERO;
                        }
                        this.node.addChild(node);
                        this.hideLoading();
                        let models = node.getComponentsInChildren(cc_1.ModelComponent);
                        models.forEach(v => ccUtil_1.default.getOrAddComponent(v, cc_1.UIModelComponent));
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            });
        }
    };
    __setFunctionName(_classThis, "UIModelContainer");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __prefab_path_decorators = [property];
        _get_prefab_path_decorators = [property];
        _loadingNode_decorators = [property(cc_1.Node)];
        _resetToZero_decorators = [property()];
        __esDecorate(_classThis, null, _get_prefab_path_decorators, { kind: "getter", name: "prefab_path", static: false, private: false, access: { has: obj => "prefab_path" in obj, get: obj => obj.prefab_path }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, __prefab_path_decorators, { kind: "field", name: "_prefab_path", static: false, private: false, access: { has: obj => "_prefab_path" in obj, get: obj => obj._prefab_path, set: (obj, value) => { obj._prefab_path = value; } }, metadata: _metadata }, __prefab_path_initializers, __prefab_path_extraInitializers);
        __esDecorate(null, null, _loadingNode_decorators, { kind: "field", name: "loadingNode", static: false, private: false, access: { has: obj => "loadingNode" in obj, get: obj => obj.loadingNode, set: (obj, value) => { obj.loadingNode = value; } }, metadata: _metadata }, _loadingNode_initializers, _loadingNode_extraInitializers);
        __esDecorate(null, null, _resetToZero_decorators, { kind: "field", name: "resetToZero", static: false, private: false, access: { has: obj => "resetToZero" in obj, get: obj => obj.resetToZero, set: (obj, value) => { obj.resetToZero = value; } }, metadata: _metadata }, _resetToZero_initializers, _resetToZero_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UIModelContainer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UIModelContainer = _classThis;
})();
exports.default = UIModelContainer;
