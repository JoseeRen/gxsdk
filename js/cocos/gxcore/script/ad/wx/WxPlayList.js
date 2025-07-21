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
let WxPlayList = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _item_decorators;
    let _item_initializers = [];
    let _item_extraInitializers = [];
    let _listRoot_decorators;
    let _listRoot_initializers = [];
    let _listRoot_extraInitializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    var WxPlayList = _classThis = class extends _classSuper {
        // LIFE-CYCLE CALLBACKS:
        // onLoad () {}
        start() {
            WxJump_1.default.Instance.getConfig((config) => {
                if (config && config.list.length > 0) {
                    for (let i = 0; i < config.list.length; i++) {
                        try {
                            let dataListElement = config.list[i];
                            if (dataListElement.status != 1) {
                                continue;
                            }
                            let node = cc.instantiate(this.item);
                            this.listRoot.node.addChild(node);
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
                            /*
                                                if (dataListElement.label && dataListElement.label.length > 0) {
    
                                                    let childByName1 = node.getChildByName("label");
                                                    childByName1.active = true;
                                                    let childByName = childByName1.getChildByName("label");
    
                                                    childByName.getComponent(cc.Label).string = dataListElement.label[0];
    
    
                                                }*/
                            node /*.getChildByName("btn")*/.on(cc.Node.EventType.TOUCH_END, () => {
                                // clickCallback && clickCallback(dataListElement);
                                WxJump_1.default.Instance.wxJump(dataListElement);
                            }, this);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    this.listRoot.updateLayout();
                }
            });
        }
        onClickHome() {
            this._close();
        }
        onClickIKnow() {
            this._close();
        }
        _close() {
            try {
                if (WxJump_1.default.Instance.backMainCloseCallback) {
                    WxJump_1.default.Instance.backMainCloseCallback();
                }
            }
            catch (e) {
            }
            this.node.destroy();
        }
        constructor() {
            super(...arguments);
            this.item = __runInitializers(this, _item_initializers, null);
            this.listRoot = (__runInitializers(this, _item_extraInitializers), __runInitializers(this, _listRoot_initializers, null));
            this.text = (__runInitializers(this, _listRoot_extraInitializers), __runInitializers(this, _text_initializers, "hello"));
            __runInitializers(this, _text_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WxPlayList");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _item_decorators = [property(cc.Node)];
        _listRoot_decorators = [property(cc.Layout)];
        _text_decorators = [property];
        __esDecorate(null, null, _item_decorators, { kind: "field", name: "item", static: false, private: false, access: { has: obj => "item" in obj, get: obj => obj.item, set: (obj, value) => { obj.item = value; } }, metadata: _metadata }, _item_initializers, _item_extraInitializers);
        __esDecorate(null, null, _listRoot_decorators, { kind: "field", name: "listRoot", static: false, private: false, access: { has: obj => "listRoot" in obj, get: obj => obj.listRoot, set: (obj, value) => { obj.listRoot = value; } }, metadata: _metadata }, _listRoot_initializers, _listRoot_extraInitializers);
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WxPlayList = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WxPlayList = _classThis;
})();
exports.default = WxPlayList;
