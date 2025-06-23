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
const Switcher_1 = __importDefault(require("./Switcher"));
const Signal_1 = __importDefault(require("../../core/Signal"));
const cc_1 = require("cc");
const { ccclass, property, menu } = cc_1._decorator;
let AutoSwitch = (() => {
    let _classDecorators = [ccclass, menu("扩展UI/AutoSwitch")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _interval_decorators;
    let _interval_initializers = [];
    let _interval_extraInitializers = [];
    let _loop_decorators;
    let _loop_initializers = [];
    let _loop_extraInitializers = [];
    var AutoSwitch = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.switcher = null;
            this.interval = __runInitializers(this, _interval_initializers, 1);
            this.onFinish = (__runInitializers(this, _interval_extraInitializers), new Signal_1.default());
            this.loop = __runInitializers(this, _loop_initializers, false);
            this.isPlaying = (__runInitializers(this, _loop_extraInitializers), false);
            this.c = 0;
        }
        onLoad() {
            this.switcher = this.getComponent(Switcher_1.default);
            this.isPlaying = false;
        }
        play(interval = 0) {
            this.isPlaying = true;
            this.interval = interval || this.interval;
            this.c = 0;
            this.switch();
            this.schedule(this.switch, this.interval);
            return this.onFinish.wait();
        }
        switch() {
            this.switcher.switch();
            this.c++;
            if (this.loop)
                return;
            if (this.c >= this.switcher._childrenCount) {
                this.unschedule(this.switch);
                this.isPlaying = false;
                this.onFinish.fire();
            }
        }
    };
    __setFunctionName(_classThis, "AutoSwitch");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _interval_decorators = [property];
        _loop_decorators = [property];
        __esDecorate(null, null, _interval_decorators, { kind: "field", name: "interval", static: false, private: false, access: { has: obj => "interval" in obj, get: obj => obj.interval, set: (obj, value) => { obj.interval = value; } }, metadata: _metadata }, _interval_initializers, _interval_extraInitializers);
        __esDecorate(null, null, _loop_decorators, { kind: "field", name: "loop", static: false, private: false, access: { has: obj => "loop" in obj, get: obj => obj.loop, set: (obj, value) => { obj.loop = value; } }, metadata: _metadata }, _loop_initializers, _loop_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AutoSwitch = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AutoSwitch = _classThis;
})();
exports.default = AutoSwitch;
