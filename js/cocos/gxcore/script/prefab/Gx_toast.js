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
const { ccclass, property } = cc._decorator;
let Gx_toast = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _label_decorators;
    let _label_initializers = [];
    let _label_extraInitializers = [];
    let _tips_box_decorators;
    let _tips_box_initializers = [];
    let _tips_box_extraInitializers = [];
    var Gx_toast = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.label = __runInitializers(this, _label_initializers, null);
            this.tips_box = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _tips_box_initializers, null));
            this.tips_tween = __runInitializers(this, _tips_box_extraInitializers);
        }
        show(desc) {
            if (this.node && !this.node.parent) {
                let order = cc.macro.MAX_ZINDEX;
                this.node.parent = cc.director.getScene();
                this.node.zIndex = order;
                this.on_show(desc);
            }
        }
        on_hide() {
        }
        on_show(desc) {
            this.show_tips(desc);
        }
        show_tips(desc) {
            let self = this;
            this.label.string = desc;
            this.tips_tween = null;
            this.tips_tween = cc.moveBy(1.5, cc.v2(0, 150)).easing(cc.easeSineIn());
            let call_back = cc.callFunc(function () {
                if (cc.isValid(self)) {
                    self.hide();
                }
            });
            this.tips_box.runAction(cc.sequence(this.tips_tween, call_back));
        }
        /**
         * 应用默认的位置
         */
        set_default_pos() {
        }
        set_style_pos(x, y) {
        }
        /**
         * 移除，并回收
         */
        hide() {
            if (this.node && this.node.parent) {
                this.tips_box.y = 0;
                this.node.parent.removeChild(this.node);
                this.on_hide();
            }
        }
    };
    __setFunctionName(_classThis, "Gx_toast");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _label_decorators = [property(cc.Label)];
        _tips_box_decorators = [property(cc.Node)];
        __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
        __esDecorate(null, null, _tips_box_decorators, { kind: "field", name: "tips_box", static: false, private: false, access: { has: obj => "tips_box" in obj, get: obj => obj.tips_box, set: (obj, value) => { obj.tips_box = value; } }, metadata: _metadata }, _tips_box_initializers, _tips_box_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_toast = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_toast = _classThis;
})();
exports.default = Gx_toast;
