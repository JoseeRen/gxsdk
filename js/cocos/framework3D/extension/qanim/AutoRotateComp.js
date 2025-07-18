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
exports.AutoRotateComp = void 0;
const cc_1 = require("cc");
const { ccclass, property, menu } = cc_1._decorator;
var Axis;
(function (Axis) {
    Axis[Axis["X"] = 0] = "X";
    Axis[Axis["Y"] = 1] = "Y";
    Axis[Axis["Z"] = 2] = "Z";
})(Axis || (Axis = {}));
let AutoRotateComp = (() => {
    let _classDecorators = [ccclass("AutoRotateComp"), menu("qanim/AutoRotateComp")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _axis_decorators;
    let _axis_initializers = [];
    let _axis_extraInitializers = [];
    let _speed_decorators;
    let _speed_initializers = [];
    let _speed_extraInitializers = [];
    var AutoRotateComp = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.axis = __runInitializers(this, _axis_initializers, Axis.Y);
            this.speed = (__runInitializers(this, _axis_extraInitializers), __runInitializers(this, _speed_initializers, 1));
            this.rotateQuat = (__runInitializers(this, _speed_extraInitializers), (0, cc_1.quat)());
        }
        start() {
            // Your initialization goes here.
        }
        update(deltaTime) {
            // Your update function goes here.
            let s = this.speed;
            this.node.rotate(cc_1.Quat.fromEuler(this.rotateQuat, this.axis == Axis.X ? s : 0, this.axis == Axis.Y ? s : 0, this.axis == Axis.Z ? s : 0));
        }
    };
    __setFunctionName(_classThis, "AutoRotateComp");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _axis_decorators = [property({ type: (0, cc_1.Enum)(Axis) })];
        _speed_decorators = [property];
        __esDecorate(null, null, _axis_decorators, { kind: "field", name: "axis", static: false, private: false, access: { has: obj => "axis" in obj, get: obj => obj.axis, set: (obj, value) => { obj.axis = value; } }, metadata: _metadata }, _axis_initializers, _axis_extraInitializers);
        __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: obj => "speed" in obj, get: obj => obj.speed, set: (obj, value) => { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AutoRotateComp = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AutoRotateComp = _classThis;
})();
exports.AutoRotateComp = AutoRotateComp;
