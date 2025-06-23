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
const { ccclass, property, menu } = cc_1._decorator;
let wxSysInfo;
let WxFeedbackButton = (() => {
    let _classDecorators = [ccclass, menu("Wxsdk/WxFeedbackButton")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _handler_decorators;
    let _handler_initializers = [];
    let _handler_extraInitializers = [];
    var WxFeedbackButton = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.handler = __runInitializers(this, _handler_initializers, new cc_1.EventHandler());
            this.button = (__runInitializers(this, _handler_extraInitializers), null);
        }
        onLoad() {
        }
        onEnable() {
            this.button && this.button.show();
        }
        onDisable() {
            this.button && this.button.hide();
        }
        onDestroy() {
            this.button && this.button.destroy();
        }
        createButton(callback) {
            if (!wxSysInfo) {
                wxSysInfo = wx.getSystemInfoSync();
            }
            var leftPos = wxSysInfo.windowWidth * 0.5 - 100;
            var topPos = wxSysInfo.windowHeight * 0.5 - 20;
            var width = 200;
            var height = 40;
            if (this.button) {
                this.button.destroy();
            }
            var btnRect = this.node.getComponent(cc_1.UITransformComponent).getBoundingBoxToWorld();
            var ratio = cc.view.getDevicePixelRatio();
            var scale = cc.view.getScaleX();
            var factor = scale / ratio;
            leftPos = btnRect.x * factor;
            topPos = wxSysInfo.screenHeight - (btnRect.y + btnRect.height) * factor;
            width = btnRect.width * factor;
            height = btnRect.height * factor;
            this.button = wx.createFeedbackButton({
                type: "text",
                text: "        ",
                style: {
                    left: leftPos,
                    top: topPos,
                    width: width,
                    height: height,
                    lineHeight: 60,
                    textAlign: 'center',
                    backgroundColor: '#00000000',
                    color: '#ffffff'
                }
            });
            this.button.onTap((res) => {
                if (res) {
                    if (callback)
                        callback(res);
                }
                else if (callback)
                    callback(null);
            });
        }
        start() {
            if (CC_WECHAT) {
                this.createButton(res => {
                    this.handler.emit([res]);
                });
            }
        }
    };
    __setFunctionName(_classThis, "WxFeedbackButton");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _handler_decorators = [property(cc_1.EventHandler)];
        __esDecorate(null, null, _handler_decorators, { kind: "field", name: "handler", static: false, private: false, access: { has: obj => "handler" in obj, get: obj => obj.handler, set: (obj, value) => { obj.handler = value; } }, metadata: _metadata }, _handler_initializers, _handler_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WxFeedbackButton = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WxFeedbackButton = _classThis;
})();
exports.default = WxFeedbackButton;
