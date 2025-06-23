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
const DCUI_1 = __importDefault(require("./DCUI"));
const cc_1 = require("cc");
const { ccclass, property, requireComponent, menu } = cc_1._decorator;
let DCLabel = (() => {
    let _classDecorators = [ccclass, menu("DCUI/DCLable"), requireComponent(cc_1.LabelComponent)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = DCUI_1.default;
    let _str_decorators;
    let _str_initializers = [];
    let _str_extraInitializers = [];
    let _hasAnim_decorators;
    let _hasAnim_initializers = [];
    let _hasAnim_extraInitializers = [];
    let _dur_decorators;
    let _dur_initializers = [];
    let _dur_extraInitializers = [];
    let _scale_decorators;
    let _scale_initializers = [];
    let _scale_extraInitializers = [];
    let _formatUnit_decorators;
    let _formatUnit_initializers = [];
    let _formatUnit_extraInitializers = [];
    var DCLabel = _classThis = class extends _classSuper {
        onLoad() {
            this.label = this.getComponent(cc_1.LabelComponent);
        }
        onValueChanged(v) {
            if (v == null) {
                console.warn("[DCLabel] warn!", "not found field [" + this.dataBind + "]");
                v = 0;
            }
            if (this.formatUnit) {
                this.label.string = cc_1.js.formatStr(this.str, v.toUnitString());
            }
            else {
                this.label.string = cc_1.js.formatStr(this.str, v);
            }
            if (this.hasAnim) {
                // this.node.stopActionByTag(1000);
                // let scale = cc.scaleTo(this.dur,this.scale).easing(cc.easeSineInOut())
                // let scale2 = cc.scaleTo(this.dur,1,1);
                // let seq = cc.sequence(scale,scale2)
                // seq.setTag(1000);
                // this.node.runAction(seq)
            }
        }
        constructor() {
            super(...arguments);
            this.str = __runInitializers(this, _str_initializers, "%s");
            this.hasAnim = (__runInitializers(this, _str_extraInitializers), __runInitializers(this, _hasAnim_initializers, true));
            this.dur = (__runInitializers(this, _hasAnim_extraInitializers), __runInitializers(this, _dur_initializers, 0.1));
            this.scale = (__runInitializers(this, _dur_extraInitializers), __runInitializers(this, _scale_initializers, 1.2));
            this.formatUnit = (__runInitializers(this, _scale_extraInitializers), __runInitializers(this, _formatUnit_initializers, true));
            __runInitializers(this, _formatUnit_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DCLabel");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _str_decorators = [property];
        _hasAnim_decorators = [property];
        _dur_decorators = [property({ visible() { return this.hasAnim; } })];
        _scale_decorators = [property({ visible() { return this.hasAnim; } })];
        _formatUnit_decorators = [property({ displayName: "单位格式化" })];
        __esDecorate(null, null, _str_decorators, { kind: "field", name: "str", static: false, private: false, access: { has: obj => "str" in obj, get: obj => obj.str, set: (obj, value) => { obj.str = value; } }, metadata: _metadata }, _str_initializers, _str_extraInitializers);
        __esDecorate(null, null, _hasAnim_decorators, { kind: "field", name: "hasAnim", static: false, private: false, access: { has: obj => "hasAnim" in obj, get: obj => obj.hasAnim, set: (obj, value) => { obj.hasAnim = value; } }, metadata: _metadata }, _hasAnim_initializers, _hasAnim_extraInitializers);
        __esDecorate(null, null, _dur_decorators, { kind: "field", name: "dur", static: false, private: false, access: { has: obj => "dur" in obj, get: obj => obj.dur, set: (obj, value) => { obj.dur = value; } }, metadata: _metadata }, _dur_initializers, _dur_extraInitializers);
        __esDecorate(null, null, _scale_decorators, { kind: "field", name: "scale", static: false, private: false, access: { has: obj => "scale" in obj, get: obj => obj.scale, set: (obj, value) => { obj.scale = value; } }, metadata: _metadata }, _scale_initializers, _scale_extraInitializers);
        __esDecorate(null, null, _formatUnit_decorators, { kind: "field", name: "formatUnit", static: false, private: false, access: { has: obj => "formatUnit" in obj, get: obj => obj.formatUnit, set: (obj, value) => { obj.formatUnit = value; } }, metadata: _metadata }, _formatUnit_initializers, _formatUnit_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DCLabel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DCLabel = _classThis;
})();
exports.default = DCLabel;
