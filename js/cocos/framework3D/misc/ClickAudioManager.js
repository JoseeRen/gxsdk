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
const ClickAudio_1 = __importDefault(require("./ClickAudio"));
const cc_1 = require("cc");
const { ccclass, property, disallowMultiple, menu } = cc_1._decorator;
let ClickAudioManager = (() => {
    let _classDecorators = [ccclass, disallowMultiple, menu("Controller/ClickAudioManager")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _audio_decorators;
    let _audio_initializers = [];
    let _audio_extraInitializers = [];
    let _vibrate_decorators;
    let _vibrate_initializers = [];
    let _vibrate_extraInitializers = [];
    let _withSiblings_decorators;
    let _withSiblings_initializers = [];
    let _withSiblings_extraInitializers = [];
    let _withChildren_decorators;
    let _withChildren_initializers = [];
    let _withChildren_extraInitializers = [];
    var ClickAudioManager = _classThis = class extends _classSuper {
        onLoad() {
            if (this.withSiblings) {
                this.make(this.node.parent);
            }
            if (this.withChildren) {
                this.make(this.node);
            }
        }
        make(node) {
            node.walk(this.each.bind(this), _ => 0);
            node.on(cc_1.Node.EventType.CHILD_ADDED, this.onChildAdd, this);
        }
        onChildAdd(node) {
            node.walk(this.each.bind(this), _ => 0);
        }
        onDestroy() {
            this.node.parent.off(cc_1.Node.EventType.CHILD_ADDED, this.onChildAdd, this);
            this.node.off(cc_1.Node.EventType.CHILD_ADDED, this.onChildAdd, this);
        }
        each(item) {
            //if button 
            if (!item.getComponent(cc_1.ButtonComponent))
                return;
            let comp = item.getComponent(ClickAudio_1.default);
            if (comp == null) {
                comp = item.addComponent(ClickAudio_1.default);
                comp.audio = this.audio;
                comp.vibrate = this.vibrate;
            }
        }
        start() {
        }
        constructor() {
            super(...arguments);
            this.audio = __runInitializers(this, _audio_initializers, null);
            this.vibrate = (__runInitializers(this, _audio_extraInitializers), __runInitializers(this, _vibrate_initializers, true));
            this.withSiblings = (__runInitializers(this, _vibrate_extraInitializers), __runInitializers(this, _withSiblings_initializers, true));
            this.withChildren = (__runInitializers(this, _withSiblings_extraInitializers), __runInitializers(this, _withChildren_initializers, true));
            __runInitializers(this, _withChildren_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ClickAudioManager");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _audio_decorators = [property(cc_1.AudioClip)];
        _vibrate_decorators = [property];
        _withSiblings_decorators = [property];
        _withChildren_decorators = [property];
        __esDecorate(null, null, _audio_decorators, { kind: "field", name: "audio", static: false, private: false, access: { has: obj => "audio" in obj, get: obj => obj.audio, set: (obj, value) => { obj.audio = value; } }, metadata: _metadata }, _audio_initializers, _audio_extraInitializers);
        __esDecorate(null, null, _vibrate_decorators, { kind: "field", name: "vibrate", static: false, private: false, access: { has: obj => "vibrate" in obj, get: obj => obj.vibrate, set: (obj, value) => { obj.vibrate = value; } }, metadata: _metadata }, _vibrate_initializers, _vibrate_extraInitializers);
        __esDecorate(null, null, _withSiblings_decorators, { kind: "field", name: "withSiblings", static: false, private: false, access: { has: obj => "withSiblings" in obj, get: obj => obj.withSiblings, set: (obj, value) => { obj.withSiblings = value; } }, metadata: _metadata }, _withSiblings_initializers, _withSiblings_extraInitializers);
        __esDecorate(null, null, _withChildren_decorators, { kind: "field", name: "withChildren", static: false, private: false, access: { has: obj => "withChildren" in obj, get: obj => obj.withChildren, set: (obj, value) => { obj.withChildren = value; } }, metadata: _metadata }, _withChildren_initializers, _withChildren_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClickAudioManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClickAudioManager = _classThis;
})();
exports.default = ClickAudioManager;
