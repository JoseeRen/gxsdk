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
const Signal_1 = __importDefault(require("../../core/Signal"));
const { ccclass, property, menu } = cc_1._decorator;
let PandoraPoint = (() => {
    let _classDecorators = [ccclass, menu("扩展UI/PandoraPoint")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _numberVisible_decorators;
    let _numberVisible_initializers = [];
    let _numberVisible_extraInitializers = [];
    let _subPoints_decorators;
    let _subPoints_initializers = [];
    let _subPoints_extraInitializers = [];
    var PandoraPoint = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.numberVisible = __runInitializers(this, _numberVisible_initializers, true);
            this.subPoints = (__runInitializers(this, _numberVisible_extraInitializers), __runInitializers(this, _subPoints_initializers, []));
            this.sprite = __runInitializers(this, _subPoints_extraInitializers);
            this.n = 0;
            this.signal = new Signal_1.default;
            // update (dt) {}
        }
        onLoad() {
            this.sprite = this.getComponent(cc_1.SpriteComponent);
            this.label = this.getComponentInChildren(cc_1.LabelComponent);
            if (this.label)
                this.label.node.active = this.numberVisible;
            this.subPoints.forEach(v => {
                v.signal.add(this.onSubChanged, this);
            });
        }
        onSubChanged(n) {
            let b = this.subPoints.some(v => v.n > 0);
            this.setNumber(b ? 1 : 0);
        }
        start() {
        }
        setNumber(n) {
            if (this.label) {
                if (this.numberVisible) {
                    this.label.string = n + "";
                }
                if (this.numberVisible) {
                    this.label.node.active = n != 0;
                }
            }
            this.sprite.enabled = n != 0;
            this.n = n;
            this.signal.fire(n);
        }
    };
    __setFunctionName(_classThis, "PandoraPoint");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _numberVisible_decorators = [property];
        _subPoints_decorators = [property([PandoraPoint])];
        __esDecorate(null, null, _numberVisible_decorators, { kind: "field", name: "numberVisible", static: false, private: false, access: { has: obj => "numberVisible" in obj, get: obj => obj.numberVisible, set: (obj, value) => { obj.numberVisible = value; } }, metadata: _metadata }, _numberVisible_initializers, _numberVisible_extraInitializers);
        __esDecorate(null, null, _subPoints_decorators, { kind: "field", name: "subPoints", static: false, private: false, access: { has: obj => "subPoints" in obj, get: obj => obj.subPoints, set: (obj, value) => { obj.subPoints = value; } }, metadata: _metadata }, _subPoints_initializers, _subPoints_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PandoraPoint = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PandoraPoint = _classThis;
})();
exports.default = PandoraPoint;
