"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
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
const GxGame_1 = __importDefault(require("../GxGame"));
const GxLog_1 = __importDefault(require("../util/GxLog"));
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
let Gx_submsg = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    var Gx_submsg = _classThis = class extends _classSuper {
        onLoad() {
        }
        start() {
            this.canClose = true;
            if (!GxConstant_1.default.IS_QQ_GAME && !GxConstant_1.default.IS_WECHAT_GAME) {
                this.clickOnClose();
            }
        }
        show() {
            cc_1.director.getScene().getChildByName("Canvas").addChild(this.node);
            this.on_show();
        }
        on_show() {
        }
        clickOnClose() {
            this.node.destroy();
        }
        clickOnSub() {
            let self = this;
            let waitSubIds = GxGame_1.default.Ad().waitSubIds;
            if (GxConstant_1.default.IS_QQ_GAME) {
                window["qq"].subscribeAppMsg({
                    tmplIds: waitSubIds,
                    subscribe: true,
                    success(res) {
                        GxLog_1.default.i("调用订阅返回结果");
                        GxLog_1.default.i(res);
                        for (let i = 0; i < waitSubIds.length; i++) {
                            let waitSubId = waitSubIds[i];
                            if (res[waitSubId] == "accept") {
                                GxGame_1.default.Ad().submsg(waitSubId, (res) => {
                                });
                                GxGame_1.default.Ad().createToast("订阅成功");
                                if (self.canClose) {
                                    self.canClose = false;
                                    self.clickOnClose();
                                }
                            }
                            else {
                                GxLog_1.default.i(waitSubId + "订阅失败：" + res[waitSubId]);
                                GxGame_1.default.Ad().createToast("订阅失败");
                            }
                        }
                        setTimeout(() => {
                            GxGame_1.default.Ad().initSubmsg();
                        }, 1000);
                    },
                    fail(res) {
                        console.log("----subscribeAppMsg----fail", res);
                        GxLog_1.default.e("订阅失败");
                        GxLog_1.default.e(res);
                        GxGame_1.default.Ad().createToast("订阅失败");
                    }
                });
            }
            else if (GxConstant_1.default.IS_WECHAT_GAME) {
                window["wx"].requestSubscribeMessage({
                    tmplIds: waitSubIds,
                    success(res) {
                        GxLog_1.default.i("调用订阅返回结果");
                        GxLog_1.default.i(res);
                        for (let i = 0; i < waitSubIds.length; i++) {
                            let waitSubId = waitSubIds[i];
                            if (res[waitSubId] == "accept") {
                                GxGame_1.default.Ad().submsg(waitSubId, (res) => {
                                });
                                GxGame_1.default.Ad().createToast("订阅成功");
                                if (self.canClose) {
                                    self.canClose = false;
                                    self.clickOnClose();
                                }
                            }
                            else {
                                GxLog_1.default.i(waitSubId + "订阅失败：" + res[waitSubId]);
                                GxGame_1.default.Ad().createToast("订阅失败");
                            }
                        }
                        setTimeout(() => {
                            GxGame_1.default.Ad().initSubmsg();
                        }, 1000);
                    },
                    fail(res) {
                        console.log("----subscribeAppMsg----fail", res);
                        GxLog_1.default.e("订阅失败");
                        GxLog_1.default.e(res);
                        GxGame_1.default.Ad().createToast("订阅失败");
                    }
                });
            }
            else {
                this.clickOnClose();
            }
        }
    };
    __setFunctionName(_classThis, "Gx_submsg");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_submsg = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_submsg = _classThis;
})();
exports.default = Gx_submsg;
