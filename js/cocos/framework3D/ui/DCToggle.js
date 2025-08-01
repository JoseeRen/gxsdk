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
const { ccclass, property, menu } = cc_1._decorator;
let DCToggle = (() => {
    let _classDecorators = [ccclass, menu("DCUI/DCToggle")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = DCUI_1.default;
    let _revserse_decorators;
    let _revserse_initializers = [];
    let _revserse_extraInitializers = [];
    let _autosync_decorators;
    let _autosync_initializers = [];
    let _autosync_extraInitializers = [];
    var DCToggle = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.revserse = __runInitializers(this, _revserse_initializers, false);
            this.autosync = (__runInitializers(this, _revserse_extraInitializers), __runInitializers(this, _autosync_initializers, true));
            this.isFromSelf = __runInitializers(this, _autosync_extraInitializers);
        }
        onLoad() {
            this.toggle = this.getComponent(cc_1.ToggleComponent);
            if (this.autosync) {
                let listener = new cc_1.EventHandler();
                listener.component = "DCToggle";
                listener.target = this.node;
                listener.handler = "onChecked";
                this.toggle.checkEvents.push(listener);
            }
        }
        onChecked(v) {
            if (this.isFromSelf)
                return;
            if (this.revserse) {
                this.setDCValue(!v.isChecked);
            }
            else {
                this.setDCValue(v.isChecked);
            }
        }
        setChecked(b) {
            this.isFromSelf = true;
            if (b)
                this.toggle.check();
            else
                this.toggle.uncheck();
            this.isFromSelf = false;
        }
        onValueChanged(v) {
            if (this.revserse) {
                this.setChecked(!v);
            }
            else {
                this.setChecked(v);
            }
        }
    };
    __setFunctionName(_classThis, "DCToggle");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _revserse_decorators = [property({ tooltip: "If reverse is enabled ,checked is false !, unchecked is true" })];
        _autosync_decorators = [property({ tooltip: " Make sure data bind type should be boolean" })];
        __esDecorate(null, null, _revserse_decorators, { kind: "field", name: "revserse", static: false, private: false, access: { has: obj => "revserse" in obj, get: obj => obj.revserse, set: (obj, value) => { obj.revserse = value; } }, metadata: _metadata }, _revserse_initializers, _revserse_extraInitializers);
        __esDecorate(null, null, _autosync_decorators, { kind: "field", name: "autosync", static: false, private: false, access: { has: obj => "autosync" in obj, get: obj => obj.autosync, set: (obj, value) => { obj.autosync = value; } }, metadata: _metadata }, _autosync_initializers, _autosync_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DCToggle = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DCToggle = _classThis;
})();
exports.default = DCToggle;
