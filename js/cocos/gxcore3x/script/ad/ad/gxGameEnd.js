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
const cc_1 = require("cc");
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const { ccclass, property } = cc_1._decorator;
let GxGameEnd = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _btnArr_decorators;
    let _btnArr_initializers = [];
    let _btnArr_extraInitializers = [];
    let _touchNode_decorators;
    let _touchNode_initializers = [];
    let _touchNode_extraInitializers = [];
    let _dotNode_decorators;
    let _dotNode_initializers = [];
    let _dotNode_extraInitializers = [];
    var GxGameEnd = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.btnArr = __runInitializers(this, _btnArr_initializers, []);
            this.touchNode = (__runInitializers(this, _btnArr_extraInitializers), __runInitializers(this, _touchNode_initializers, null));
            this.dotNode = (__runInitializers(this, _touchNode_extraInitializers), __runInitializers(this, _dotNode_initializers, null));
            this.switchOpen = (__runInitializers(this, _dotNode_extraInitializers), false);
            // update (dt) {}
        }
        // LIFE-CYCLE CALLBACKS:
        // onLoad () {}
        start() {
            this.touchNode.on(cc_1.Node.EventType.TOUCH_END, () => {
                this.touchNodeFunc();
            });
            for (let i = 0; i < this.btnArr.length; i++) {
                let btnArrElement = this.btnArr[i];
                if (btnArrElement) {
                    // btnArrElement.enableAutoGrayEffect = false;
                    btnArrElement.interactable = false;
                    btnArrElement.node.on(cc_1.Node.EventType.TOUCH_END, (event) => {
                        if (this.dotNode.active || (GxConstant_1.default.IS_WECHAT_GAME && GxGame_1.default.gGB("qiangtan")) && window["AD"].isGameEndFirst == true) {
                            window["AD"].isGameEndFirst = false;
                            GxGame_1.default.Ad().showVideo((res) => {
                                if (res) {
                                    window["XR_GameDate"].XR_Date.jb += Math.floor(window["XR_GameDate"].gamejs.levelJB);
                                    window["XR_GameDate"].saveXR_Date();
                                }
                                // btnArrElement.clickEvents[0].emit([]);
                                cc_1.Component.EventHandler.emitEvents(btnArrElement.clickEvents, event);
                            });
                        }
                        else {
                            // btnArrElement.clickEvents[0].emit([]);
                            cc_1.Component.EventHandler.emitEvents(btnArrElement.clickEvents, event);
                        }
                    }, this);
                }
            }
        }
        touchNodeFunc() {
            if (this.switchOpen) {
                console.log("可以的");
                this.dotNode.active = !this.dotNode.active;
                let videoActive = this.dotNode.active;
                for (let i = 0; i < this.btnArr.length; i++) {
                    let btnArrElement1 = this.btnArr[i];
                    if (btnArrElement1) {
                        let childByName = btnArrElement1.node.getChildByName("videoIcon");
                        if (childByName) {
                            childByName.active = false; // videoActive;
                        }
                    }
                }
            }
        }
        onEnable() {
            this.switchOpen = GxGame_1.default.gGB("qiangtan");
            if (window["ks"]) {
                console.log("快手渠道  gxGameEnd");
                this.switchOpen = window["AD"].kstime;
            }
            this.touchNode.active = this.switchOpen;
            this.dotNode.active = this.switchOpen;
            for (let i = 0; i < this.btnArr.length; i++) {
                if (this.btnArr[i]) {
                    let childByName = this.btnArr[i].node.getChildByName("videoIcon");
                    if (childByName) {
                        childByName.active = false; // this.switchOpen;
                    }
                }
            }
        }
    };
    __setFunctionName(_classThis, "GxGameEnd");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _btnArr_decorators = [property({ type: cc_1.Button, tooltip: "要控制的按钮" })];
        _touchNode_decorators = [property({ type: cc_1.Node, tooltip: "触摸控制点显示不显示" })];
        _dotNode_decorators = [property({ type: cc_1.Node, tooltip: "点" })];
        __esDecorate(null, null, _btnArr_decorators, { kind: "field", name: "btnArr", static: false, private: false, access: { has: obj => "btnArr" in obj, get: obj => obj.btnArr, set: (obj, value) => { obj.btnArr = value; } }, metadata: _metadata }, _btnArr_initializers, _btnArr_extraInitializers);
        __esDecorate(null, null, _touchNode_decorators, { kind: "field", name: "touchNode", static: false, private: false, access: { has: obj => "touchNode" in obj, get: obj => obj.touchNode, set: (obj, value) => { obj.touchNode = value; } }, metadata: _metadata }, _touchNode_initializers, _touchNode_extraInitializers);
        __esDecorate(null, null, _dotNode_decorators, { kind: "field", name: "dotNode", static: false, private: false, access: { has: obj => "dotNode" in obj, get: obj => obj.dotNode, set: (obj, value) => { obj.dotNode = value; } }, metadata: _metadata }, _dotNode_initializers, _dotNode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GxGameEnd = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GxGameEnd = _classThis;
})();
exports.default = GxGameEnd;
