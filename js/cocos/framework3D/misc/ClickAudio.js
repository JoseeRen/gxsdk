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
const Device_1 = __importDefault(require("../misc/Device"));
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
let ClickAudio = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _audio_decorators;
    let _audio_initializers = [];
    let _audio_extraInitializers = [];
    let _btn_decorators;
    let _btn_initializers = [];
    let _btn_extraInitializers = [];
    var ClickAudio = _classThis = class extends _classSuper {
        onLoad() {
            this.btn = this.getComponent(cc_1.ButtonComponent);
            // this.node.on('touchstart', _ => {
            // }, this.node);
            this.node.on(cc_1.Node.EventType.TOUCH_END, _ => {
                if (!this.audio)
                    return;
                if (this.btn.interactable) {
                    Device_1.default.playEffect(this.audio, false);
                    Device_1.default.vibrate(false);
                }
                else {
                    if (this.audio_invalid)
                        Device_1.default.playEffect(this.audio_invalid, false);
                }
            });
            // this.node.on("touchcancel", _ => {
            // })
        }
        constructor() {
            super(...arguments);
            this.audio = __runInitializers(this, _audio_initializers, null);
            this.vibrate = (__runInitializers(this, _audio_extraInitializers), false);
            this.audio_invalid = null;
            this.btn = __runInitializers(this, _btn_initializers, null);
            __runInitializers(this, _btn_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ClickAudio");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _audio_decorators = [property(cc_1.AudioClip)];
        _btn_decorators = [property(cc_1.ButtonComponent)];
        __esDecorate(null, null, _audio_decorators, { kind: "field", name: "audio", static: false, private: false, access: { has: obj => "audio" in obj, get: obj => obj.audio, set: (obj, value) => { obj.audio = value; } }, metadata: _metadata }, _audio_initializers, _audio_extraInitializers);
        __esDecorate(null, null, _btn_decorators, { kind: "field", name: "btn", static: false, private: false, access: { has: obj => "btn" in obj, get: obj => obj.btn, set: (obj, value) => { obj.btn = value; } }, metadata: _metadata }, _btn_initializers, _btn_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClickAudio = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClickAudio = _classThis;
})();
exports.default = ClickAudio;
