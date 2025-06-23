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
const cc_1 = require("cc");
const PasrTimer_1 = require("../../misc/PasrTimer");
const EaseType_1 = require("./EaseType");
let { ccclass, property, menu } = cc_1._decorator;
let BreathAnim = (() => {
    let _classDecorators = [ccclass("BreathAnim"), menu("qanim/BreathAnim")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _minScale_decorators;
    let _minScale_initializers = [];
    let _minScale_extraInitializers = [];
    let _maxScale_decorators;
    let _maxScale_initializers = [];
    let _maxScale_extraInitializers = [];
    let _easeType_decorators;
    let _easeType_initializers = [];
    let _easeType_extraInitializers = [];
    var BreathAnim = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.pasrTimer = null;
            this.duration = __runInitializers(this, _duration_initializers, 1.0);
            this.minScale = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _minScale_initializers, (0, cc_1.v3)()));
            this.maxScale = (__runInitializers(this, _minScale_extraInitializers), __runInitializers(this, _maxScale_initializers, (0, cc_1.v3)()));
            this.easeType = (__runInitializers(this, _maxScale_extraInitializers), __runInitializers(this, _easeType_initializers, EaseType_1.EaseType.linear));
            this.tmp_scale = (__runInitializers(this, _easeType_extraInitializers), (0, cc_1.v3)());
        }
        // @property({ type: EasingEnum })
        // easingType: typeof easing = null
        onLoad() {
            this.pasrTimer = new PasrTimer_1.PasrTimer(0, this.duration / 2, 0, this.duration / 2);
        }
        start() {
        }
        onEnable() {
            this.pasrTimer.reset();
        }
        reset() {
            this.pasrTimer.a = this.duration / 2;
            this.pasrTimer.r = this.duration / 2;
        }
        update(dt) {
            var t = this.pasrTimer.Tick(dt);
            t = cc_1.easing[EaseType_1.EaseType[this.easeType]](t);
            this.node.scale = cc_1.Vec3.lerp(this.tmp_scale, this.maxScale, this.minScale, t);
            if (this.pasrTimer.isFinished()) {
                this.pasrTimer.reset();
            }
        }
    };
    __setFunctionName(_classThis, "BreathAnim");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _duration_decorators = [property];
        _minScale_decorators = [property(cc_1.Vec3)];
        _maxScale_decorators = [property(cc_1.Vec3)];
        _easeType_decorators = [property({ type: (0, cc_1.Enum)(EaseType_1.EaseType) })];
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _minScale_decorators, { kind: "field", name: "minScale", static: false, private: false, access: { has: obj => "minScale" in obj, get: obj => obj.minScale, set: (obj, value) => { obj.minScale = value; } }, metadata: _metadata }, _minScale_initializers, _minScale_extraInitializers);
        __esDecorate(null, null, _maxScale_decorators, { kind: "field", name: "maxScale", static: false, private: false, access: { has: obj => "maxScale" in obj, get: obj => obj.maxScale, set: (obj, value) => { obj.maxScale = value; } }, metadata: _metadata }, _maxScale_initializers, _maxScale_extraInitializers);
        __esDecorate(null, null, _easeType_decorators, { kind: "field", name: "easeType", static: false, private: false, access: { has: obj => "easeType" in obj, get: obj => obj.easeType, set: (obj, value) => { obj.easeType = value; } }, metadata: _metadata }, _easeType_initializers, _easeType_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BreathAnim = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BreathAnim = _classThis;
})();
exports.default = BreathAnim;
