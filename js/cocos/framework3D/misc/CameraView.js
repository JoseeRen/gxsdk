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
exports.CameraView = void 0;
const cc_1 = require("cc");
const { ccclass, property, executeInEditMode, menu } = cc_1._decorator;
let CameraView = (() => {
    let _classDecorators = [ccclass("CameraView"), menu("游戏脚本/CameraView")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _offset_decorators;
    let _offset_initializers = [];
    let _offset_extraInitializers = [];
    let _followScalar_decorators;
    let _followScalar_initializers = [];
    let _followScalar_extraInitializers = [];
    var CameraView = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.target = __runInitializers(this, _target_initializers, null);
            this.offset = (__runInitializers(this, _target_extraInitializers), __runInitializers(this, _offset_initializers, (0, cc_1.v3)()));
            this.followScalar = (__runInitializers(this, _offset_extraInitializers), __runInitializers(this, _followScalar_initializers, 0.1));
            this.pos = (__runInitializers(this, _followScalar_extraInitializers), (0, cc_1.v3)());
            this._paused = false;
        }
        start() {
            // Your initialization goes here.
        }
        update(dt) {
            if (this._paused)
                return;
            // Your update function goes here.
            var target = cc_1.Vec3.add(this.pos, this.target.position, this.offset);
            this.node.position = cc_1.Vec3.lerp(this.pos, this.node.position, target, this.followScalar * dt * 40);
            // this.node.position = Vec3.lerp(this.pos, this.node.position, target, this.followScalar);
            // this.node.position = target;
        }
        pause() {
            this._paused = true;
        }
        resume() {
            this._paused = false;
        }
    };
    __setFunctionName(_classThis, "CameraView");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _target_decorators = [property(cc_1.Node)];
        _offset_decorators = [property(cc_1.Vec3)];
        _followScalar_decorators = [property];
        __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
        __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
        __esDecorate(null, null, _followScalar_decorators, { kind: "field", name: "followScalar", static: false, private: false, access: { has: obj => "followScalar" in obj, get: obj => obj.followScalar, set: (obj, value) => { obj.followScalar = value; } }, metadata: _metadata }, _followScalar_initializers, _followScalar_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CameraView = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CameraView = _classThis;
})();
exports.CameraView = CameraView;
