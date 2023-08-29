"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
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
const GxGame_1 = __importDefault(require("../GxGame"));
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const OpenDataUtil_1 = __importDefault(require("../util/OpenDataUtil"));
const { ccclass, property } = cc._decorator;
let Gx_shareFriend = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _instanceExtraInitializers = [];
    let _sprite_decorators;
    let _sprite_initializers = [];
    var Gx_shareFriend = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.texture = (__runInitializers(this, _instanceExtraInitializers), new cc.Texture2D());
            this.shareCallback = null;
            this.shareSuccess = false;
            this.sprite = __runInitializers(this, _sprite_initializers, null);
            // update (dt) {}
        }
        onLoad() {
        }
        start() {
            if (!GxConstant_1.default.IS_QQ_GAME && !GxConstant_1.default.IS_WECHAT_GAME) {
                this.clickOnClose();
                return;
            }
            const shareCanvas = this.getShareCanvas();
            shareCanvas.width = this.sprite.node.width;
            shareCanvas.height = this.sprite.node.height;
            let bound = {};
            bound.width = this.sprite.node.getContentSize().width;
            bound.height = this.sprite.node.getContentSize().height;
            let phoneInfo = wx.getSystemInfoSync();
            console.log("phoneInfo:", phoneInfo);
            let winSize = cc.winSize;
            let scaleX = phoneInfo.screenWidth / winSize.width;
            let scaleY = phoneInfo.screenHeight / winSize.height;
            //微信像素
            let dX = winSize.width / 2 - (this.sprite.node.width / 2 - this.sprite.node.x);
            let xStart = dX * scaleX;
            let dY = winSize.height / 2 - this.sprite.node.height / 2 - this.sprite.node.y;
            let yStart = dY * scaleY;
            let startPos = {
                x: xStart,
                y: yStart
            };
            OpenDataUtil_1.default._postMessage("InitContext", {
                bound: bound,
                spacingY: 5,
                scaleX: scaleX,
                scaleY: scaleY,
                startPos: startPos
            });
            OpenDataUtil_1.default.showShareFriend();
            GxGame_1.default.Ad().setOpenDataShareCallback((res) => {
                if (!this.shareSuccess) {
                    this.shareSuccess = res;
                }
                else {
                    console.log("已经分享成功过了");
                }
                if (res) {
                    this.clickOnClose();
                }
                /*if (this && this.node.isValid) {
                    this.shareCallback && this.shareCallback(res)
                }*/
            });
        }
        show() {
            cc.director.getScene().addChild(this.node);
            this.on_show();
        }
        on_show() {
        }
        setShareCallback(shareCallback) {
            this.shareCallback = shareCallback;
        }
        clickOnRefresh() {
            //点击换一个好友
            OpenDataUtil_1.default.refreshShareFriend();
        }
        clickOnClose() {
            OpenDataUtil_1.default.closeShareFriend();
            this.node.destroy();
        }
        onDestroy() {
            console.log("销毁 分享结果：" + this.shareSuccess);
            this.shareCallback && this.shareCallback(this.shareSuccess);
        }
        clickOnShare() {
            /*   GxGame.Ad().shareMessageToFriend((res) => {
                   console.log("定向分享结果：" + res)
                   this.shareCallback && this.shareCallback(res)
               })*/
        }
        update() {
            this.render();
        }
        render() {
            const shareCanvas = this.getShareCanvas();
            this.texture.initWithElement(shareCanvas);
            this.texture.handleLoadedTexture();
            // if (!this.sprite.spriteFrame) {
            this.sprite.spriteFrame = new cc.SpriteFrame(this.texture);
            /* } else {
                 this.sprite.spriteFrame.setTexture(this.texture);
             }*/
        }
        getShareCanvas() {
            let openDataContext = wx.getOpenDataContext();
            if (openDataContext) {
                return openDataContext.canvas;
            }
        }
    };
    __setFunctionName(_classThis, "Gx_shareFriend");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _sprite_decorators = [property(cc.Sprite)];
        __esDecorate(null, null, _sprite_decorators, { kind: "field", name: "sprite", static: false, private: false, access: { has: obj => "sprite" in obj, get: obj => obj.sprite, set: (obj, value) => { obj.sprite = value; } }, metadata: _metadata }, _sprite_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_shareFriend = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_shareFriend = _classThis;
})();
exports.default = Gx_shareFriend;
