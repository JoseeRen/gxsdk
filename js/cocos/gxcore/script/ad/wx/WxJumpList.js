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
const GxGame_1 = __importDefault(require("../../GxGame"));
const { ccclass, property } = cc._decorator;
let WxJumpList = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _itemPrefab_decorators;
    let _itemPrefab_initializers = [];
    let _itemPrefab_extraInitializers = [];
    let _rootLayout_decorators;
    let _rootLayout_initializers = [];
    let _rootLayout_extraInitializers = [];
    let _rootNode_decorators;
    let _rootNode_initializers = [];
    let _rootNode_extraInitializers = [];
    var WxJumpList = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.itemPrefab = __runInitializers(this, _itemPrefab_initializers, null);
            this.rootLayout = (__runInitializers(this, _itemPrefab_extraInitializers), __runInitializers(this, _rootLayout_initializers, null));
            this.rootNode = (__runInitializers(this, _rootLayout_extraInitializers), __runInitializers(this, _rootNode_initializers, null));
            // LIFE-CYCLE CALLBACKS:
            // onLoad () {}
            this.isLandscape = (__runInitializers(this, _rootNode_extraInitializers), false);
            // update (dt) {}
        }
        start() {
            console.log("start");
        }
        onClickClose() {
            this.node.destroy();
        }
        initData(dataList, type, clickCallback) {
            let height = cc.winSize.height;
            let width = cc.winSize.width;
            if (width > height) {
                this.isLandscape = true;
                this.node.getChildByName("dikuang").height = 600; // cc.winSize.height*0.8//600;
            }
            let victoryList = WxJump_1.default.Instance.getVictoryList();
            let passLvCount = victoryList.length;
            for (let i = 0; i < dataList.length; i++) {
                let dataListElement = dataList[i];
                if (dataListElement.status == 1) {
                    if (dataListElement["inGame"] == 1 && !WxJump_1.default.Instance.inGamePlayCallback) {
                        //如果是游戏内跳转 并且不设置回调的话不显示游戏内跳转的游戏
                        console.error("该游戏是游戏内跳转 但没设置inGamePlayCallback ");
                        continue;
                    }
                    let node = cc.instantiate(this.itemPrefab);
                    this.rootNode.addChild(node);
                    let unlock = false;
                    if (type == 0) {
                        //正常的
                        unlock = true;
                    }
                    else {
                        //需要解锁的
                        //判断是否已经解锁 或者提前解锁
                        //已经解锁的显示前往
                        //未解锁的显示解锁和通过几关才解锁
                        unlock = WxJump_1.default.Instance.checkIsUnlockPlay(dataListElement.appId);
                        //是否已经提前解锁
                        if (!unlock) {
                            if (passLvCount >= dataListElement.unlockNum) {
                                //能否达到解锁条件
                                unlock = true;
                            }
                        }
                    }
                    node.getChildByName("btn").on(cc.Node.EventType.TOUCH_END, () => {
                        clickCallback && clickCallback(dataListElement);
                    }, this);
                    if (unlock) {
                        node.getChildByName("btn").active = true;
                        node.getChildByName("lockedbtn").active = false;
                    }
                    else {
                        node.getChildByName("btn").active = false;
                        node.getChildByName("lockedbtn").active = true;
                        node.getChildByName("lockedbtn").getChildByName("label").getComponent(cc.Label).string = `再通过${dataListElement.unlockNum - passLvCount}关即可解锁`;
                    }
                    let sprite = node.getChildByName("icon").getComponent(cc.Sprite);
                    cc.assetManager.loadRemote(dataListElement.icon, cc.Texture2D, (err, sp) => {
                        try {
                            if (err) {
                                console.warn(err);
                            }
                            if (sp && sprite.isValid) {
                                sprite.spriteFrame = new cc.SpriteFrame(sp);
                            }
                        }
                        catch (e) {
                            console.warn(e);
                        }
                    });
                    let component = node.getChildByName("name").getComponent(cc.Label);
                    if (component) {
                        component.string = dataListElement.name;
                    }
                    if (dataListElement.label && dataListElement.label.length > 0) {
                        let childByName1 = node.getChildByName("label");
                        childByName1.active = true;
                        let childByName = childByName1.getChildByName("label");
                        childByName.getComponent(cc.Label).string = dataListElement.label[0];
                    }
                    if (unlock) {
                    }
                    else {
                        node.getChildByName("lockedbtn").getChildByName("btn").on(cc.Node.EventType.TOUCH_END, () => {
                            GxGame_1.default.Ad().showVideo((res) => {
                                if (res) {
                                    node.getChildByName("btn").active = true;
                                    node.getChildByName("lockedbtn").active = false;
                                    //提前解锁
                                    WxJump_1.default.Instance.preUnlockPlay(dataListElement.appId);
                                    clickCallback && clickCallback(dataListElement);
                                }
                            }, "unlock_" + dataListElement.appId);
                        }, this);
                    }
                }
            }
            this.rootLayout.updateLayout();
        }
    };
    __setFunctionName(_classThis, "WxJumpList");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _itemPrefab_decorators = [property(cc.Node)];
        _rootLayout_decorators = [property(cc.Layout)];
        _rootNode_decorators = [property(cc.Node)];
        __esDecorate(null, null, _itemPrefab_decorators, { kind: "field", name: "itemPrefab", static: false, private: false, access: { has: obj => "itemPrefab" in obj, get: obj => obj.itemPrefab, set: (obj, value) => { obj.itemPrefab = value; } }, metadata: _metadata }, _itemPrefab_initializers, _itemPrefab_extraInitializers);
        __esDecorate(null, null, _rootLayout_decorators, { kind: "field", name: "rootLayout", static: false, private: false, access: { has: obj => "rootLayout" in obj, get: obj => obj.rootLayout, set: (obj, value) => { obj.rootLayout = value; } }, metadata: _metadata }, _rootLayout_initializers, _rootLayout_extraInitializers);
        __esDecorate(null, null, _rootNode_decorators, { kind: "field", name: "rootNode", static: false, private: false, access: { has: obj => "rootNode" in obj, get: obj => obj.rootNode, set: (obj, value) => { obj.rootNode = value; } }, metadata: _metadata }, _rootNode_initializers, _rootNode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WxJumpList = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WxJumpList = _classThis;
})();
exports.default = WxJumpList;
