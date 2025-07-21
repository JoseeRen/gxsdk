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
const WxJump_1 = __importDefault(require("./WxJump"));
const { ccclass, property } = cc._decorator;
let WxShare = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _imgSp_decorators;
    let _imgSp_initializers = [];
    let _imgSp_extraInitializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    var WxShare = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.imgSp = __runInitializers(this, _imgSp_initializers, null);
            this.text = (__runInitializers(this, _imgSp_extraInitializers), __runInitializers(this, _text_initializers, 'hello'));
            // LIFE-CYCLE CALLBACKS:
            // onLoad () {}
            this.shareContent = (__runInitializers(this, _text_extraInitializers), null);
            // update (dt) {}
        }
        start() {
            WxJump_1.default.Instance.showCount++;
            WxJump_1.default.Instance.getShareContent(1, (shareContent) => {
                this.shareContent = shareContent;
                if (shareContent) {
                    let imageUrl = shareContent.imageUrl;
                    cc.assetManager.loadRemote(imageUrl, { ext: ".png" }, (err, txt2d) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            this.imgSp.spriteFrame = new cc.SpriteFrame(txt2d);
                            let contentSize = this.imgSp.node.getContentSize();
                            console.log(contentSize);
                            if (contentSize.width > 600) {
                                this.imgSp.node.scale = 600 / contentSize.width;
                            }
                        }
                    });
                }
            });
        }
        onClickClose() {
            this.node.destroy();
        }
        onClickShare() {
            WxJump_1.default.Instance.isShare = true;
            if (window["wx"]) {
                if (this.shareContent && this.shareContent.imageUrl) {
                    //@ts-ignore
                    wx.downloadFile({
                        url: this.shareContent.imageUrl,
                        success: (res) => {
                            //@ts-ignore
                            wx.showShareImageMenu({
                                path: res.tempFilePath
                            });
                        }
                    });
                }
                else {
                    //直接普通分享
                    //@ts-ignore
                    wx.shareAppMessage({});
                }
            }
        }
    };
    __setFunctionName(_classThis, "WxShare");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _imgSp_decorators = [property(cc.Sprite)];
        _text_decorators = [property];
        __esDecorate(null, null, _imgSp_decorators, { kind: "field", name: "imgSp", static: false, private: false, access: { has: obj => "imgSp" in obj, get: obj => obj.imgSp, set: (obj, value) => { obj.imgSp = value; } }, metadata: _metadata }, _imgSp_initializers, _imgSp_extraInitializers);
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WxShare = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WxShare = _classThis;
})();
exports.default = WxShare;
