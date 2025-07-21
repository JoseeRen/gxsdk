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
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const OpenDataUtil_1 = __importDefault(require("../util/OpenDataUtil"));
const { ccclass, property } = cc._decorator;
let Gx_subOpenRank = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _sprite_decorators;
    let _sprite_initializers = [];
    let _sprite_extraInitializers = [];
    let _rankId_decorators;
    let _rankId_initializers = [];
    let _rankId_extraInitializers = [];
    let _rankSuffix_decorators;
    let _rankSuffix_initializers = [];
    let _rankSuffix_extraInitializers = [];
    var Gx_subOpenRank = _classThis = class extends _classSuper {
        onLoad() {
            if (this.sprite.node.y != 0) {
                console.warn("y不为0可能触摸会有问题！！！！！！！！！");
                console.warn("y不为0可能触摸会有问题！！！！！！！！！");
                console.warn("y不为0可能触摸会有问题！！！！！！！！！");
                console.warn("y不为0可能触摸会有问题！！！！！！！！！");
            }
        }
        getNewData() {
            /**
             * 开放数据域用 Layout 来实现，必须告诉 Layout 开放数据域最终被绘制到屏幕上的包围盒
             * 比如 iPhone 12 Pro Max 的物理尺寸是 414 * 896，如果开放数据域的尺寸是 200 * 200，绘制在屏幕正中央
             * 那么最终包围盒是{ x: 107, y: 348, width: 200, height: 200 }
             * 但在 Cocos 中是跟 Cocos 的坐标系打交道，因此要将 Cocos 的坐标系换算成木屏幕坐标系，坐标原点为左上角
             * 下面是参考转换逻辑
             */
            // 返回节点在世界坐标系下的对齐轴向的包围盒（AABB），这个包围盒是相对于设计尺寸的
            const box = this.sprite.node.getBoundingBoxToWorld();
            // Cocos 的屏幕适配规则，详情可见：https://docs.cocos.com/creator/2.4/manual/zh/ui/multi-resolution.html?h=%E9%80%82%E9%85%8D
            const scaleX = cc.view.getScaleX();
            const scaleY = cc.view.getScaleY();
            const devicePixelRatio = cc.view.getDevicePixelRatio();
            // 设计尺寸
            const designSize = cc.view.getDesignResolutionSize();
            // canvas 画布的尺寸
            const vireportRect = cc.view.getViewportRect();
            // Cocos 实际的场景在 Canvas 画布中的偏移，比如按照 fixWidth 的适配规则而屏幕有比较长的话，最终渲染出来屏幕上下是有黑边的，这里计算的就是黑边的大小
            const offsetY = (vireportRect.height - (designSize.height * scaleY)) / 2;
            const offsetX = (vireportRect.width - (designSize.width * scaleX)) / 2;
            // 将计算出来的相对屏幕的包围盒信息发送给开放数据域，开放数据域根据这个事件来初始化
            let newVar = {
                event: 'layoutUpdateViewPort',
                x: ((box.x * scaleX) + offsetX) / devicePixelRatio,
                y: (box.y * scaleY + offsetY) / devicePixelRatio,
                width: box.width * scaleX / devicePixelRatio,
                height: box.height * scaleY / devicePixelRatio,
            };
            // window.__globalAdapter && window.__globalAdapter.getOpenDataContext().postMessage(newVar)
            return newVar;
        }
        start() {
            // cc.director.getScene().addChild(this.node);
            //要不点击位置 不对
            this.node.parent = cc.director.getScene();
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
            //@ts-ignore
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
                startPos: startPos,
                dataV3: this.getNewData()
            });
            OpenDataUtil_1.default.showRankFriend(this.rankId, this.rankSuffix);
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
            this.on_show();
        }
        on_show() {
        }
        setShareCallback(shareCallback) {
            this.shareCallback = shareCallback;
        }
        clickOnRefresh() {
            //点击换一个好友
            // OpenDataUtil.refreshShareFriend();
        }
        clickOnClose() {
            // OpenDataUtil.closeShareFriend();
            OpenDataUtil_1.default.closeRankFriend();
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
            //@ts-ignore
            let openDataContext = wx.getOpenDataContext();
            if (openDataContext) {
                return openDataContext.canvas;
            }
        }
        constructor() {
            super(...arguments);
            this.texture = new cc.Texture2D();
            this.shareCallback = null;
            this.shareSuccess = false;
            this.sprite = __runInitializers(this, _sprite_initializers, null);
            this.rankId = (__runInitializers(this, _sprite_extraInitializers), __runInitializers(this, _rankId_initializers, "")); //运营后台配置的
            this.rankSuffix = (__runInitializers(this, _rankId_extraInitializers), __runInitializers(this, _rankSuffix_initializers, "")); //显示的后缀  10关 100分等等   不传不显示
            __runInitializers(this, _rankSuffix_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Gx_subOpenRank");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _sprite_decorators = [property(cc.Sprite)];
        _rankId_decorators = [property];
        _rankSuffix_decorators = [property];
        __esDecorate(null, null, _sprite_decorators, { kind: "field", name: "sprite", static: false, private: false, access: { has: obj => "sprite" in obj, get: obj => obj.sprite, set: (obj, value) => { obj.sprite = value; } }, metadata: _metadata }, _sprite_initializers, _sprite_extraInitializers);
        __esDecorate(null, null, _rankId_decorators, { kind: "field", name: "rankId", static: false, private: false, access: { has: obj => "rankId" in obj, get: obj => obj.rankId, set: (obj, value) => { obj.rankId = value; } }, metadata: _metadata }, _rankId_initializers, _rankId_extraInitializers);
        __esDecorate(null, null, _rankSuffix_decorators, { kind: "field", name: "rankSuffix", static: false, private: false, access: { has: obj => "rankSuffix" in obj, get: obj => obj.rankSuffix, set: (obj, value) => { obj.rankSuffix = value; } }, metadata: _metadata }, _rankSuffix_initializers, _rankSuffix_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_subOpenRank = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_subOpenRank = _classThis;
})();
exports.default = Gx_subOpenRank;
