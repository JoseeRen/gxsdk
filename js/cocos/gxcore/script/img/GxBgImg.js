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
const GxImgMgr_1 = __importDefault(require("./GxImgMgr"));
const { ccclass, property } = cc._decorator;
let ObjImgName = {
    NONE: 0,
    bgUrl: 1,
    lvUrl: 2
};
let ImgNameEnum = cc.Enum(ObjImgName);
let GxBgImg = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _imgName_decorators;
    let _imgName_initializers = [];
    let _imgName_extraInitializers = [];
    var GxBgImg = _classThis = class extends _classSuper {
        // LIFE-CYCLE CALLBACKS:
        onLoad() {
            this.node.opacity = 0;
            let component = this.node.getComponent(cc.Sprite);
            if (!component) {
                component = this.node.addComponent(cc.Sprite);
            }
            if (component && this.imgName != ImgNameEnum.NONE) {
                let strings = Object.keys(ObjImgName);
                GxImgMgr_1.default.getInstance().getImgByName(strings[this.imgName], (sp) => {
                    if (sp) {
                        if (component && component.isValid) {
                            component.spriteFrame = sp;
                            this.node.opacity = 255;
                        }
                    }
                    else {
                        if (this && this.node && this.node.isValid) {
                            this.node.opacity = 255;
                        }
                    }
                });
            }
            else {
                this.node.opacity = 255;
            }
        }
        start() {
        }
        constructor() {
            super(...arguments);
            this.imgName = __runInitializers(this, _imgName_initializers, ImgNameEnum.NONE);
            __runInitializers(this, _imgName_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GxBgImg");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _imgName_decorators = [property({ type: cc.Enum(ImgNameEnum) })];
        __esDecorate(null, null, _imgName_decorators, { kind: "field", name: "imgName", static: false, private: false, access: { has: obj => "imgName" in obj, get: obj => obj.imgName, set: (obj, value) => { obj.imgName = value; } }, metadata: _metadata }, _imgName_initializers, _imgName_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GxBgImg = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GxBgImg = _classThis;
})();
exports.default = GxBgImg;
