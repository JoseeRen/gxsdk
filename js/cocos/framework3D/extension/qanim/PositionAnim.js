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
const UIBaseAnim_1 = __importDefault(require("./UIBaseAnim"));
let { ccclass, property, menu } = cc_1._decorator;
let PositionAnim = (() => {
    let _classDecorators = [ccclass("PositionAnim"), menu("qanim/PositionAnim")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = UIBaseAnim_1.default;
    let _from_decorators;
    let _from_initializers = [];
    let _from_extraInitializers = [];
    let _to_decorators;
    let _to_initializers = [];
    let _to_extraInitializers = [];
    let _useWorld_decorators;
    let _useWorld_initializers = [];
    let _useWorld_extraInitializers = [];
    var PositionAnim = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.from = __runInitializers(this, _from_initializers, (0, cc_1.v3)());
            this.to = (__runInitializers(this, _from_extraInitializers), __runInitializers(this, _to_initializers, (0, cc_1.v3)()));
            this.useWorld = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _useWorld_initializers, false));
            this.tmp_vec3 = (__runInitializers(this, _useWorld_extraInitializers), (0, cc_1.v3)());
        }
        onTick(t) {
            if (!this.useWorld) {
                this.node.position = cc_1.Vec3.lerp(this.tmp_vec3, this.from, this.to, t);
            }
            else {
                this.node.worldPosition = cc_1.Vec3.lerp(this.tmp_vec3, this.from, this.to, t);
            }
        }
        start() {
            this.pasr.reset();
        }
        play() {
            return super.play();
        }
        onEnable() {
            if (this.pasr)
                this.pasr.reset();
        }
        onDisable() {
        }
    };
    __setFunctionName(_classThis, "PositionAnim");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _from_decorators = [property(cc_1.Vec3)];
        _to_decorators = [property(cc_1.Vec3)];
        _useWorld_decorators = [property];
        __esDecorate(null, null, _from_decorators, { kind: "field", name: "from", static: false, private: false, access: { has: obj => "from" in obj, get: obj => obj.from, set: (obj, value) => { obj.from = value; } }, metadata: _metadata }, _from_initializers, _from_extraInitializers);
        __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: obj => "to" in obj, get: obj => obj.to, set: (obj, value) => { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
        __esDecorate(null, null, _useWorld_decorators, { kind: "field", name: "useWorld", static: false, private: false, access: { has: obj => "useWorld" in obj, get: obj => obj.useWorld, set: (obj, value) => { obj.useWorld = value; } }, metadata: _metadata }, _useWorld_initializers, _useWorld_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PositionAnim = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PositionAnim = _classThis;
})();
exports.default = PositionAnim;
