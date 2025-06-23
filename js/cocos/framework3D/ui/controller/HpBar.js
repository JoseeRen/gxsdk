"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const { ccclass, property, menu, executeInEditMode } = cc_1._decorator;
let HpBar = (() => {
    let _classDecorators = [ccclass, menu("Controller/HpBar")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _instanceExtraInitializers = [];
    let __maxHp_decorators;
    let __maxHp_initializers = [];
    let __maxHp_extraInitializers = [];
    let _get_maxHp_decorators;
    let __hp_decorators;
    let __hp_initializers = [];
    let __hp_extraInitializers = [];
    let _get_hp_decorators;
    var HpBar = _classThis = class extends _classSuper {
        get maxHp() {
            return this._maxHp;
        }
        set maxHp(value) {
            this._maxHp = value;
            let template = this.hpLayout.node.children[0];
            if (this.hpLayout.node.children.length > 1) {
                this.hpLayout.node.removeAllChildren();
                this.hpLayout.node.addChild(template);
            }
            //@ts-ignore
            this.hpLayout.showlist(this.createHpNodes.bind(this), range(0, this._maxHp - 1, 1));
            this.updateHp();
        }
        get hp() {
            return this._hp;
        }
        set hp(value) {
            this._hp = value;
            this.updateHp();
        }
        get(i) {
            return this.hpLayout.node.children[i];
        }
        cur() {
            let node = this.get(this.hp);
            return node.children[0];
        }
        onLoad() {
            this.hpLayout = this.getComponent(cc_1.LayoutComponent);
        }
        createHpNodes(node, data, i) {
            node.children[0].active = true;
        }
        updateHp() {
            let a = this.hpLayout.node.children.forEach((v, i) => {
                v.children[0].active = i < this.hp + 1;
            });
        }
        start() {
            this.updateHp();
        }
        onDisable() {
        }
        constructor() {
            super(...arguments);
            this._maxHp = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __maxHp_initializers, 0));
            this.hpLayout = (__runInitializers(this, __maxHp_extraInitializers), null);
            this._hp = __runInitializers(this, __hp_initializers, 0);
            __runInitializers(this, __hp_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "HpBar");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __maxHp_decorators = [property()];
        _get_maxHp_decorators = [property()];
        __hp_decorators = [property];
        _get_hp_decorators = [property];
        __esDecorate(_classThis, null, _get_maxHp_decorators, { kind: "getter", name: "maxHp", static: false, private: false, access: { has: obj => "maxHp" in obj, get: obj => obj.maxHp }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_hp_decorators, { kind: "getter", name: "hp", static: false, private: false, access: { has: obj => "hp" in obj, get: obj => obj.hp }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, __maxHp_decorators, { kind: "field", name: "_maxHp", static: false, private: false, access: { has: obj => "_maxHp" in obj, get: obj => obj._maxHp, set: (obj, value) => { obj._maxHp = value; } }, metadata: _metadata }, __maxHp_initializers, __maxHp_extraInitializers);
        __esDecorate(null, null, __hp_decorators, { kind: "field", name: "_hp", static: false, private: false, access: { has: obj => "_hp" in obj, get: obj => obj._hp, set: (obj, value) => { obj._hp = value; } }, metadata: _metadata }, __hp_initializers, __hp_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HpBar = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HpBar = _classThis;
})();
exports.default = HpBar;
