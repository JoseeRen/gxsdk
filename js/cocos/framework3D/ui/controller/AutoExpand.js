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
let { ccclass, property } = cc_1._decorator;
let AutoExpand = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _offset_decorators;
    let _offset_initializers = [];
    let _offset_extraInitializers = [];
    let _isOpen_decorators;
    let _isOpen_initializers = [];
    let _isOpen_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _autoClose_decorators;
    let _autoClose_initializers = [];
    let _autoClose_extraInitializers = [];
    let _closeDelay_decorators;
    let _closeDelay_initializers = [];
    let _closeDelay_extraInitializers = [];
    var AutoExpand = _classThis = class extends _classSuper {
        onLoad() {
            this.node.on(cc_1.Node.EventType.TOUCH_END, this.onClick, this);
            this.pos = this.node.position.clone();
            this.targetPos.set(this.pos);
            this.targetPos.x += this.offset;
        }
        start() {
        }
        onClick() {
            if (!this.isOpen) {
                this.open();
            }
            else {
                this.close();
            }
        }
        open() {
            (0, cc_1.tween)(this.node).to(this.duration, { position: this.targetPos }, { easing: "sineInOut" }).start();
            this.isOpen = true;
            //open 
            if (this.autoClose) {
                this.unschedule(this.close);
                this.scheduleOnce(this.close, this.closeDelay);
            }
        }
        close() {
            (0, cc_1.tween)(this.node).to(this.duration, { position: this.pos }, { easing: "sineInOut" }).start();
            this.isOpen = false;
        }
        constructor() {
            super(...arguments);
            this.offset = __runInitializers(this, _offset_initializers, 50);
            this.pos = (__runInitializers(this, _offset_extraInitializers), (0, cc_1.v3)());
            this.targetPos = (0, cc_1.v3)();
            /**当前状态  */
            this.isOpen = __runInitializers(this, _isOpen_initializers, false);
            this.duration = (__runInitializers(this, _isOpen_extraInitializers), __runInitializers(this, _duration_initializers, 0.4));
            this.autoClose = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _autoClose_initializers, true));
            this.closeDelay = (__runInitializers(this, _autoClose_extraInitializers), __runInitializers(this, _closeDelay_initializers, 2));
            __runInitializers(this, _closeDelay_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AutoExpand");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _offset_decorators = [property()];
        _isOpen_decorators = [property];
        _duration_decorators = [property];
        _autoClose_decorators = [property];
        _closeDelay_decorators = [property];
        __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
        __esDecorate(null, null, _isOpen_decorators, { kind: "field", name: "isOpen", static: false, private: false, access: { has: obj => "isOpen" in obj, get: obj => obj.isOpen, set: (obj, value) => { obj.isOpen = value; } }, metadata: _metadata }, _isOpen_initializers, _isOpen_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _autoClose_decorators, { kind: "field", name: "autoClose", static: false, private: false, access: { has: obj => "autoClose" in obj, get: obj => obj.autoClose, set: (obj, value) => { obj.autoClose = value; } }, metadata: _metadata }, _autoClose_initializers, _autoClose_extraInitializers);
        __esDecorate(null, null, _closeDelay_decorators, { kind: "field", name: "closeDelay", static: false, private: false, access: { has: obj => "closeDelay" in obj, get: obj => obj.closeDelay, set: (obj, value) => { obj.closeDelay = value; } }, metadata: _metadata }, _closeDelay_initializers, _closeDelay_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AutoExpand = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AutoExpand = _classThis;
})();
exports.default = AutoExpand;
