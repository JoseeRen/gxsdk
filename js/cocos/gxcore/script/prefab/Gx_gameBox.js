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
const GxGame_1 = __importDefault(require("../GxGame"));
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const GxUtils_1 = __importDefault(require("../util/GxUtils"));
const GxEnum_1 = require("../core/GxEnum");
const { ccclass, property } = cc._decorator;
let Gx_gameBox = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _boxNode_decorators;
    let _boxNode_initializers = [];
    let _boxNode_extraInitializers = [];
    let _zaiLaiSanGe_decorators;
    let _zaiLaiSanGe_initializers = [];
    let _zaiLaiSanGe_extraInitializers = [];
    let _rootLayout_decorators;
    let _rootLayout_initializers = [];
    let _rootLayout_extraInitializers = [];
    let _itemNode_decorators;
    let _itemNode_initializers = [];
    let _itemNode_extraInitializers = [];
    var Gx_gameBox = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.boxNode = __runInitializers(this, _boxNode_initializers, null);
            this.zaiLaiSanGe = (__runInitializers(this, _boxNode_extraInitializers), __runInitializers(this, _zaiLaiSanGe_initializers, null));
            this.rootLayout = (__runInitializers(this, _zaiLaiSanGe_extraInitializers), __runInitializers(this, _rootLayout_initializers, null));
            this.itemNode = (__runInitializers(this, _rootLayout_extraInitializers), __runInitializers(this, _itemNode_initializers, null));
            // LIFE-CYCLE CALLBACKS:
            this.key = (__runInitializers(this, _itemNode_extraInitializers), 3);
            this.openBoxNum = 0;
            this.openBoxArr = [];
            this.canClick = false;
            // update (dt) {},
        }
        onLoad() {
            if (Math.random() < 0.5) {
                this.key = 2;
            }
            let winSize = cc.winSize;
            if (winSize.width > winSize.height) {
                console.log("横屏");
                this.node.scale = 0.8;
            }
        }
        start() {
            this.initBox();
        }
        show(on_show, on_close, on_get) {
            this.onShow = on_show;
            this.onClose = on_close;
            this.onGet = on_get;
            this.onShow && this.onShow();
            this.scheduleOnce(() => {
                this.canClick = true;
            }, 1.5);
        }
        initBox() {
            for (let i = 0; i < 9; i++) {
                let node = cc.instantiate(this.itemNode);
                node.parent = this.rootLayout.node;
            }
            this.rootLayout.updateLayout();
            this.scheduleOnce(() => {
                var boxParent = this.rootLayout.node;
                for (let i = 0; i < boxParent.children.length; i++) {
                    boxParent.children[i].children[0].active = false;
                    boxParent.children[i].children[1].active = false;
                }
            }, 1 / 60 * 2);
        }
        onDestroy() {
            this.onClose && this.onClose();
            if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_VIVO_GAME) {
                let label = GxGame_1.default.gGB("z1");
                if (label) {
                    var gb = GxGame_1.default.gGN("gb");
                    if (Math.round(Math.random() * 99 + 1) < gb) {
                        GxGame_1.default.Ad().showVideo((res) => {
                        }, "GxGameBoxClose");
                    }
                }
            }
        }
        onCallBack(e, type) {
            if (!this.canClick) {
                return;
            }
            switch (type) {
                case "宝箱":
                    this.openBox(e);
                    break;
                case "继续游戏":
                    this.node.destroy();
                    break;
                case "再开三个":
                    GxGame_1.default.Ad().showVideo((res) => {
                        if (res) {
                            this.key += 3;
                            var boxParent = this.boxNode.getChildByName("content");
                            for (let i = 0; i < boxParent.children.length; i++) {
                                boxParent.children[i].children[1].active = false;
                            }
                            if (this.openBoxNum >= 7) {
                                this.zaiLaiSanGe.active = false;
                            }
                        }
                    }, "GxGameBoxOpen3");
                    break;
            }
        }
        openBox(e) {
            let callback = () => {
                this.openBoxNum++;
                if (this.openBoxNum == 1) {
                    if (GxConstant_1.default.IS_QQ_GAME) {
                        //开启第一个宝箱后弹插屏
                        // GxGame.Ad().showNativeInterstitial(() => {
                        // }, () => {
                        // }, 0)
                    }
                    else if (GxConstant_1.default.IS_ANDROID_NATIVE && GxUtils_1.default.getNativePlatform() == GxEnum_1.PLATFORM.G233) {
                        GxGame_1.default.Ad().showInterstitial(() => {
                        }, () => {
                        });
                    }
                }
                var randomCoinNum = Math.floor(Math.random() * 50 + 70);
                e.target.children[0].getChildByName("coin").getComponent(cc.Label).string = "" + randomCoinNum;
                this.onGet && this.onGet(randomCoinNum);
                e.target.children[0].active = true;
                let items = e.target._localZOrder; // - 1;
                console.log(items);
                this.openBoxArr.push(items);
                if (this.key <= 0) //没钥匙露出视频标
                 {
                    this.showVideoIcon();
                }
                if (this.openBoxNum >= 7) {
                    this.zaiLaiSanGe.active = false;
                }
            };
            if (this.key > 0) {
                this.key--;
                callback();
            }
            else {
                console.log("请看视频补充钥匙");
                GxGame_1.default.Ad().showVideo((res) => {
                    if (res) {
                        callback();
                    }
                }, "GxGameBoxKey");
            }
        }
        showVideoIcon() {
            var boxParent = this.boxNode.getChildByName("content");
            for (let i = 0; i < boxParent.children.length; i++) {
                let showVideo = true;
                let localZOrder = boxParent.children[i]._localZOrder;
                if (this.openBoxArr.includes(localZOrder)) {
                    showVideo = false;
                }
                if (showVideo) {
                    boxParent.children[i].children[1].active = true;
                }
                else {
                    boxParent.children[i].children[1].active = false;
                }
            }
        }
    };
    __setFunctionName(_classThis, "Gx_gameBox");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _boxNode_decorators = [property(cc.Node)];
        _zaiLaiSanGe_decorators = [property(cc.Node)];
        _rootLayout_decorators = [property(cc.Layout)];
        _itemNode_decorators = [property(cc.Node)];
        __esDecorate(null, null, _boxNode_decorators, { kind: "field", name: "boxNode", static: false, private: false, access: { has: obj => "boxNode" in obj, get: obj => obj.boxNode, set: (obj, value) => { obj.boxNode = value; } }, metadata: _metadata }, _boxNode_initializers, _boxNode_extraInitializers);
        __esDecorate(null, null, _zaiLaiSanGe_decorators, { kind: "field", name: "zaiLaiSanGe", static: false, private: false, access: { has: obj => "zaiLaiSanGe" in obj, get: obj => obj.zaiLaiSanGe, set: (obj, value) => { obj.zaiLaiSanGe = value; } }, metadata: _metadata }, _zaiLaiSanGe_initializers, _zaiLaiSanGe_extraInitializers);
        __esDecorate(null, null, _rootLayout_decorators, { kind: "field", name: "rootLayout", static: false, private: false, access: { has: obj => "rootLayout" in obj, get: obj => obj.rootLayout, set: (obj, value) => { obj.rootLayout = value; } }, metadata: _metadata }, _rootLayout_initializers, _rootLayout_extraInitializers);
        __esDecorate(null, null, _itemNode_decorators, { kind: "field", name: "itemNode", static: false, private: false, access: { has: obj => "itemNode" in obj, get: obj => obj.itemNode, set: (obj, value) => { obj.itemNode = value; } }, metadata: _metadata }, _itemNode_initializers, _itemNode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_gameBox = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_gameBox = _classThis;
})();
exports.default = Gx_gameBox;
