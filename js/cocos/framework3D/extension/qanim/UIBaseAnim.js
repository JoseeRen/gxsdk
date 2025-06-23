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
const PasrTimer_1 = require("../../misc/PasrTimer");
const EaseType_1 = require("./EaseType");
const Signal_1 = __importDefault(require("../../core/Signal"));
const { ccclass, property } = cc._decorator;
let UIBaseAnim = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _easeType_decorators;
    let _easeType_initializers = [];
    let _easeType_extraInitializers = [];
    var UIBaseAnim = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pasr = new PasrTimer_1.PasrTimer(0, 0, 0, 0);
            this.easeType = __runInitializers(this, _easeType_initializers, EaseType_1.EaseType.linear);
            this.onFinish = (__runInitializers(this, _easeType_extraInitializers), new Signal_1.default());
        }
        set duration(v) {
            this.pasr.a = v;
        }
        onFinished() {
            this.enabled = false;
        }
        onLoad() {
            this.onFinish.add(this.onFinished, this);
        }
        onDestroy() {
            this.onFinish.remove(this.onFinished, this);
        }
        start() {
        }
        play() {
            this.enabled = true;
            this.pasr.reset();
            return this.onFinish.wait();
        }
        update(dt) {
            if (!this.pasr.isFinished()) {
                let t = this.pasr.Tick(dt);
                if (this.pasr.isFinished()) {
                    this.onFinish.fire();
                    return;
                }
                let f = cc_1.easing[EaseType_1.EaseType[this.easeType]];
                t = f(t);
                this.onTick(t);
            }
        }
        onTick(t) { }
        ;
    };
    __setFunctionName(_classThis, "UIBaseAnim");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _easeType_decorators = [property({ type: (0, cc_1.Enum)(EaseType_1.EaseType) })];
        __esDecorate(null, null, _easeType_decorators, { kind: "field", name: "easeType", static: false, private: false, access: { has: obj => "easeType" in obj, get: obj => obj.easeType, set: (obj, value) => { obj.easeType = value; } }, metadata: _metadata }, _easeType_initializers, _easeType_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UIBaseAnim = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UIBaseAnim = _classThis;
})();
exports.default = UIBaseAnim;
