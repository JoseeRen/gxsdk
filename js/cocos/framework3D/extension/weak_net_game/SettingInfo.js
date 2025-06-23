"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingInfo = void 0;
const DataCenter_1 = __importStar(require("../../core/DataCenter"));
const Device_1 = __importDefault(require("../../misc/Device"));
let SettingInfoDC = (() => {
    let _classDecorators = [(0, DataCenter_1.dc)("SettingInfo")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = DataCenter_1.default;
    let _music_decorators;
    let _music_initializers = [];
    let _music_extraInitializers = [];
    let _effect_decorators;
    let _effect_initializers = [];
    let _effect_extraInitializers = [];
    let _vibrate_decorators;
    let _vibrate_initializers = [];
    let _vibrate_extraInitializers = [];
    let _shake_decorators;
    let _shake_initializers = [];
    let _shake_extraInitializers = [];
    var SettingInfoDC = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            //背景音乐
            this.music = __runInitializers(this, _music_initializers, true);
            //音效
            this.effect = (__runInitializers(this, _music_extraInitializers), __runInitializers(this, _effect_initializers, true));
            //手机震动
            this.vibrate = (__runInitializers(this, _effect_extraInitializers), __runInitializers(this, _vibrate_initializers, true));
            //屏幕晃动
            this.shake = (__runInitializers(this, _vibrate_extraInitializers), __runInitializers(this, _shake_initializers, true));
            this.isfirst = (__runInitializers(this, _shake_extraInitializers), false);
        }
        onLoadAll() {
            Device_1.default.setBGMEnable(this.music);
            Device_1.default.setSFXEnable(this.effect);
            Device_1.default.isVibrateEnabled = this.vibrate;
            console.log("load settings:---------------");
            console.log("music:", this.music);
            console.log("effect:", this.effect);
            console.log("vibrate:", this.vibrate);
        }
        saveSettings() {
            this.music = Device_1.default.isBgmEnabled;
            this.effect = Device_1.default.isSfxEnabled;
            this.vibrate = Device_1.default.isVibrateEnabled;
            this.save();
        }
    };
    __setFunctionName(_classThis, "SettingInfoDC");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _music_decorators = [(0, DataCenter_1.field)()];
        _effect_decorators = [(0, DataCenter_1.field)()];
        _vibrate_decorators = [(0, DataCenter_1.field)()];
        _shake_decorators = [(0, DataCenter_1.field)()];
        __esDecorate(null, null, _music_decorators, { kind: "field", name: "music", static: false, private: false, access: { has: obj => "music" in obj, get: obj => obj.music, set: (obj, value) => { obj.music = value; } }, metadata: _metadata }, _music_initializers, _music_extraInitializers);
        __esDecorate(null, null, _effect_decorators, { kind: "field", name: "effect", static: false, private: false, access: { has: obj => "effect" in obj, get: obj => obj.effect, set: (obj, value) => { obj.effect = value; } }, metadata: _metadata }, _effect_initializers, _effect_extraInitializers);
        __esDecorate(null, null, _vibrate_decorators, { kind: "field", name: "vibrate", static: false, private: false, access: { has: obj => "vibrate" in obj, get: obj => obj.vibrate, set: (obj, value) => { obj.vibrate = value; } }, metadata: _metadata }, _vibrate_initializers, _vibrate_extraInitializers);
        __esDecorate(null, null, _shake_decorators, { kind: "field", name: "shake", static: false, private: false, access: { has: obj => "shake" in obj, get: obj => obj.shake, set: (obj, value) => { obj.shake = value; } }, metadata: _metadata }, _shake_initializers, _shake_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettingInfoDC = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettingInfoDC = _classThis;
})();
exports.default = SettingInfoDC;
exports.SettingInfo = DataCenter_1.default.register(SettingInfoDC);
