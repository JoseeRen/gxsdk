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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const Platform_1 = __importDefault(require("../../../framework3D/extension/Platform"));
const Signal_1 = __importDefault(require("../../../framework3D/core/Signal"));
const vm_1 = __importDefault(require("../../../framework3D/ui/vm"));
let { ccclass, property } = cc_1._decorator;
let SubpackageLoader = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _label_progress_decorators;
    let _label_progress_initializers = [];
    let _label_progress_extraInitializers = [];
    let _bar_decorators;
    let _bar_initializers = [];
    let _bar_extraInitializers = [];
    let _label_decorators;
    let _label_initializers = [];
    let _label_extraInitializers = [];
    let _btn_retry_decorators;
    let _btn_retry_initializers = [];
    let _btn_retry_extraInitializers = [];
    let _btn_close_decorators;
    let _btn_close_initializers = [];
    let _btn_close_extraInitializers = [];
    var SubpackageLoader = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.label_progress = __runInitializers(this, _label_progress_initializers, null);
            this.bar = (__runInitializers(this, _label_progress_extraInitializers), __runInitializers(this, _bar_initializers, null));
            this.label = (__runInitializers(this, _bar_extraInitializers), __runInitializers(this, _label_initializers, null));
            this.btn_retry = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _btn_retry_initializers, null));
            this.btn_close = (__runInitializers(this, _btn_retry_extraInitializers), __runInitializers(this, _btn_close_initializers, null));
            this.onSuccess = (__runInitializers(this, _btn_close_extraInitializers), new Signal_1.default());
            this.names = [];
            this.hideOnFinish = true;
        }
        onLoad() {
            this.btn_retry.node.on(cc_1.Node.EventType.TOUCH_END, this.click_retry, this);
            if (this.btn_close)
                this.btn_close.node.on(cc_1.Node.EventType.TOUCH_END, this.click_close, this);
        }
        onShown(names, hideOnFinish, callback, target) {
            this.hideOnFinish = hideOnFinish;
            this.onSuccess.clear();
            this.onSuccess.on(callback, target);
            this.names.splice(0);
            if (Array.isArray(names)) {
                this.names = names;
            }
            else if (typeof (names) == "string") {
                this.names.push(names);
            }
            else {
                console.error("[SubpackageLoader] fail to load : params error");
                return;
            }
            this.startLoad();
        }
        /**
         * 显示 当前下载 进度
         * @param name 子包名
         * @param percent  当前进度 x/100
         * @param c 下载字节数
         * @param t 总下载字节数
         */
        showStatus(name, percent, c, t) {
            this.label_progress.string = percent + "%";
            this.bar.progress = percent / 100;
            this.label.string = "加载[" + name + "]中";
        }
        startLoad() {
            return __awaiter(this, void 0, void 0, function* () {
                this.btn_retry.node.active = false;
                this.btn_close.node.active = false;
                try {
                    for (var i = 0; i < this.names.length; i++) {
                        let name = this.names[i];
                        yield Platform_1.default.loadSubPackage(name, (p, c, t) => {
                            this.showStatus(name, p, c, t);
                        });
                    }
                    this.onSuccess.fire(this);
                    if (this.hideOnFinish) {
                        vm_1.default.hide(this);
                    }
                }
                catch (e) {
                    console.error(e);
                    this.label.string = "加载失败,请点击重试!";
                    this.btn_retry.node.active = true;
                    this.btn_close.node.active = true;
                }
            });
        }
        cancel() {
            this.onSuccess.clear();
            vm_1.default.hide(this);
        }
        click_close() {
            vm_1.default.hide(this);
        }
        onHidden() {
            this.cancel();
        }
        click_retry() {
            this.btn_retry.node.active = false;
        }
    };
    __setFunctionName(_classThis, "SubpackageLoader");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _label_progress_decorators = [property(cc_1.LabelComponent)];
        _bar_decorators = [property(cc_1.ProgressBarComponent)];
        _label_decorators = [property(cc_1.LabelComponent)];
        _btn_retry_decorators = [property(cc_1.ButtonComponent)];
        _btn_close_decorators = [property(cc_1.ButtonComponent)];
        __esDecorate(null, null, _label_progress_decorators, { kind: "field", name: "label_progress", static: false, private: false, access: { has: obj => "label_progress" in obj, get: obj => obj.label_progress, set: (obj, value) => { obj.label_progress = value; } }, metadata: _metadata }, _label_progress_initializers, _label_progress_extraInitializers);
        __esDecorate(null, null, _bar_decorators, { kind: "field", name: "bar", static: false, private: false, access: { has: obj => "bar" in obj, get: obj => obj.bar, set: (obj, value) => { obj.bar = value; } }, metadata: _metadata }, _bar_initializers, _bar_extraInitializers);
        __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
        __esDecorate(null, null, _btn_retry_decorators, { kind: "field", name: "btn_retry", static: false, private: false, access: { has: obj => "btn_retry" in obj, get: obj => obj.btn_retry, set: (obj, value) => { obj.btn_retry = value; } }, metadata: _metadata }, _btn_retry_initializers, _btn_retry_extraInitializers);
        __esDecorate(null, null, _btn_close_decorators, { kind: "field", name: "btn_close", static: false, private: false, access: { has: obj => "btn_close" in obj, get: obj => obj.btn_close, set: (obj, value) => { obj.btn_close = value; } }, metadata: _metadata }, _btn_close_initializers, _btn_close_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubpackageLoader = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubpackageLoader = _classThis;
})();
exports.default = SubpackageLoader;
