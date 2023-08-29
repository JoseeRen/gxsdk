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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataStorage_1 = __importDefault(require("../util/DataStorage"));
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const GxGame_1 = __importDefault(require("../GxGame"));
const { ccclass, property } = cc._decorator;
let Gx_authorize = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _instanceExtraInitializers = [];
    let _userNode_decorators;
    let _userNode_initializers = [];
    let _andTextNode_decorators;
    let _andTextNode_initializers = [];
    let _privacyNode_decorators;
    let _privacyNode_initializers = [];
    let _erCiNode_decorators;
    let _erCiNode_initializers = [];
    let _refuseBtn_decorators;
    let _refuseBtn_initializers = [];
    let _agreeBtn_decorators;
    let _agreeBtn_initializers = [];
    let _closeBtn_decorators;
    let _closeBtn_initializers = [];
    let _tipsLabel_decorators;
    let _tipsLabel_initializers = [];
    var Gx_authorize = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.onAgree = (__runInitializers(this, _instanceExtraInitializers), null);
            this.onRefuse = null;
            this.userNode = __runInitializers(this, _userNode_initializers, null);
            this.andTextNode = __runInitializers(this, _andTextNode_initializers, null);
            this.privacyNode = __runInitializers(this, _privacyNode_initializers, null);
            this.erCiNode = __runInitializers(this, _erCiNode_initializers, null);
            this.refuseBtn = __runInitializers(this, _refuseBtn_initializers, null);
            this.agreeBtn = __runInitializers(this, _agreeBtn_initializers, null);
            this.closeBtn = __runInitializers(this, _closeBtn_initializers, null);
            this.tipsLabel = __runInitializers(this, _tipsLabel_initializers, null);
        }
        show(on_agree, on_refuse) {
            if (this.node.parent)
                return;
            this.onAgree = on_agree;
            this.onRefuse = on_refuse;
            cc.director.getScene().addChild(this.node);
            this.on_show();
        }
        start() {
            if (!GxGame_1.default.canShowUser) {
                this.andTextNode.active = false;
                this.userNode.active = false;
                this.privacyNode.x = this.userNode.x;
            }
            if (DataStorage_1.default.getItem(GxConstant_1.default.KEY_PRIVACY_AGREE)) {
                this.closeBtn.active = true;
                this.refuseBtn.active = false;
                this.agreeBtn.active = false;
                this.tipsLabel.string = "您已同意上述协议和政策中的全部内容。";
            }
            else {
                this.closeBtn.active = false;
                this.refuseBtn.active = true;
                this.agreeBtn.active = true;
            }
            this.node.zIndex = cc.macro.MAX_ZINDEX;
        }
        on_show() {
        }
        show_privacy(event, type) {
            GxGame_1.default.Ad().showPrivacy(type);
        }
        on_agree() {
            DataStorage_1.default.setItem(GxConstant_1.default.KEY_PRIVACY_AGREE, "true");
            this.onAgree && this.onAgree();
            this.node.destroy();
        }
        on_refuse(event, cdata) {
            cdata = parseInt(cdata);
            if (cdata == 1) {
                this.erCiNode.active = true;
                return;
            }
            if (GxGame_1.default.canPlayWithRefuse) {
                this.onAgree && this.onAgree();
            }
            else {
                this.onRefuse && this.onRefuse();
                if (window["qg"] != undefined) {
                    window["qg"].exitApplication({});
                }
                else if (window["qq"] != undefined) {
                    window["qq"].exitMiniProgram({});
                }
                else {
                    console.warn("不退出");
                }
            }
            this.node.destroy();
        }
    };
    __setFunctionName(_classThis, "Gx_authorize");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _userNode_decorators = [property(cc.Node)];
        _andTextNode_decorators = [property(cc.Node)];
        _privacyNode_decorators = [property(cc.Node)];
        _erCiNode_decorators = [property(cc.Node)];
        _refuseBtn_decorators = [property(cc.Node)];
        _agreeBtn_decorators = [property(cc.Node)];
        _closeBtn_decorators = [property(cc.Node)];
        _tipsLabel_decorators = [property(cc.Label)];
        __esDecorate(null, null, _userNode_decorators, { kind: "field", name: "userNode", static: false, private: false, access: { has: obj => "userNode" in obj, get: obj => obj.userNode, set: (obj, value) => { obj.userNode = value; } }, metadata: _metadata }, _userNode_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _andTextNode_decorators, { kind: "field", name: "andTextNode", static: false, private: false, access: { has: obj => "andTextNode" in obj, get: obj => obj.andTextNode, set: (obj, value) => { obj.andTextNode = value; } }, metadata: _metadata }, _andTextNode_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _privacyNode_decorators, { kind: "field", name: "privacyNode", static: false, private: false, access: { has: obj => "privacyNode" in obj, get: obj => obj.privacyNode, set: (obj, value) => { obj.privacyNode = value; } }, metadata: _metadata }, _privacyNode_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _erCiNode_decorators, { kind: "field", name: "erCiNode", static: false, private: false, access: { has: obj => "erCiNode" in obj, get: obj => obj.erCiNode, set: (obj, value) => { obj.erCiNode = value; } }, metadata: _metadata }, _erCiNode_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _refuseBtn_decorators, { kind: "field", name: "refuseBtn", static: false, private: false, access: { has: obj => "refuseBtn" in obj, get: obj => obj.refuseBtn, set: (obj, value) => { obj.refuseBtn = value; } }, metadata: _metadata }, _refuseBtn_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _agreeBtn_decorators, { kind: "field", name: "agreeBtn", static: false, private: false, access: { has: obj => "agreeBtn" in obj, get: obj => obj.agreeBtn, set: (obj, value) => { obj.agreeBtn = value; } }, metadata: _metadata }, _agreeBtn_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _closeBtn_decorators, { kind: "field", name: "closeBtn", static: false, private: false, access: { has: obj => "closeBtn" in obj, get: obj => obj.closeBtn, set: (obj, value) => { obj.closeBtn = value; } }, metadata: _metadata }, _closeBtn_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _tipsLabel_decorators, { kind: "field", name: "tipsLabel", static: false, private: false, access: { has: obj => "tipsLabel" in obj, get: obj => obj.tipsLabel, set: (obj, value) => { obj.tipsLabel = value; } }, metadata: _metadata }, _tipsLabel_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_authorize = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_authorize = _classThis;
})();
exports.default = Gx_authorize;
