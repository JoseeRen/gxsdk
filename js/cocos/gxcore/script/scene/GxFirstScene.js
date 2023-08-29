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
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const GxGame_1 = __importDefault(require("../GxGame"));
const ResUtil_1 = __importDefault(require("../util/ResUtil"));
const GxAdParams_1 = require("../GxAdParams");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const { ccclass, property } = cc._decorator;
let FirstScene = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _instanceExtraInitializers = [];
    let _jkTitle_decorators;
    let _jkTitle_initializers = [];
    let _jkContent_decorators;
    let _jkContent_initializers = [];
    let _jkCompany_decorators;
    let _jkCompany_initializers = [];
    let _jkSoftCode_decorators;
    let _jkSoftCode_initializers = [];
    let _ageSp_decorators;
    let _ageSp_initializers = [];
    let _gameSceneName_decorators;
    let _gameSceneName_initializers = [];
    var FirstScene = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.jkTitle = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _jkTitle_initializers, null));
            this.jkContent = __runInitializers(this, _jkContent_initializers, null);
            //软著信息
            this.jkCompany = __runInitializers(this, _jkCompany_initializers, null);
            this.jkSoftCode = __runInitializers(this, _jkSoftCode_initializers, null);
            this.ageSp = __runInitializers(this, _ageSp_initializers, null);
            this.gameSceneName = __runInitializers(this, _gameSceneName_initializers, 'GameScene');
            // LIFE-CYCLE CALLBACKS:
            this.canJumpToNext = false;
            // update (dt) {}
        }
        onLoad() {
            let winSize = cc.winSize;
            if (winSize.width > winSize.height) {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(1280, 720);
                this.node.getComponent(cc.Canvas).fitHeight = true;
                this.node.getComponent(cc.Canvas).fitHeight = true;
            }
            else {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(720, 1280);
                this.node.getComponent(cc.Canvas).fitWidth = true;
                this.node.getComponent(cc.Canvas).fitHeight = false;
            }
            this.canJumpToNext = true;
            this.jkTitle.node.active = false;
            this.jkContent.node.active = false;
            GxGame_1.default.initPlatform(() => {
                GxGame_1.default.initGame(() => {
                    //隐私政策和和适龄
                    let jkShowTime = GxGame_1.default.getJkShowTime();
                    if (jkShowTime >= 1) {
                        let gameAge = GxGame_1.default.getGameAge();
                        if (gameAge > 0) {
                            ResUtil_1.default.loadSprite("gx/texture/icon" + gameAge, (err, spriteFrame) => {
                                if (err) {
                                }
                                else {
                                    if (this.ageSp && cc.isValid(this.ageSp)) {
                                        this.ageSp.spriteFrame = spriteFrame;
                                    }
                                    GxGame_1.default.ageSp = spriteFrame;
                                }
                            });
                            ResUtil_1.default.loadSprite("gx/texture/btn_yinsixieyi", (err, spriteFrame) => {
                                if (err) {
                                }
                                else {
                                    GxGame_1.default.btnPrivacySp = spriteFrame;
                                }
                            });
                            ResUtil_1.default.loadSprite("gx/texture/btn_zhuomian", (err, spriteFrame) => {
                                if (err) {
                                }
                                else {
                                    GxGame_1.default.btnAddDesktopSp = spriteFrame;
                                }
                            });
                            ResUtil_1.default.loadSprite("gx/texture/btn_QQShare", (err, spriteFrame) => {
                                if (err) {
                                }
                                else {
                                    GxGame_1.default.btnQQShareSp = spriteFrame;
                                }
                            });
                        }
                        if (GxConstant_1.default.IS_QQ_GAME) {
                            this.jkCompany.string = "";
                        }
                        else {
                            if (GxAdParams_1.AdParams.company && GxAdParams_1.AdParams.company.length > 0) {
                                this.jkCompany.string = "著作权人：" + GxAdParams_1.AdParams.company;
                            }
                            else {
                                if (GxConstant_1.default.IS_OPPO_GAME) {
                                    this.canJumpToNext = false;
                                    this.jkCompany.string = "需要著作权人：";
                                }
                            }
                        }
                        if (GxConstant_1.default.IS_QQ_GAME) {
                            this.jkCompany.string = "";
                        }
                        if (GxAdParams_1.AdParams.softCode && GxAdParams_1.AdParams.softCode.length > 0) {
                            this.jkSoftCode.string = "软著登记号：" + GxAdParams_1.AdParams.softCode;
                        }
                        else {
                            if (GxConstant_1.default.IS_OPPO_GAME) {
                                this.canJumpToNext = false;
                                this.jkCompany.string = "软著登记号：";
                            }
                        }
                        this.jkTitle.node.active = true;
                        this.jkContent.node.active = true;
                    }
                    this.scheduleOnce(() => {
                        if (GxGame_1.default.needShowAuthorize()) {
                            GxGame_1.default.Ad().showAuthorize(() => {
                                // 同意继续游戏
                                this.enterGame();
                            }, () => {
                                // 拒绝退出游戏，或者隔1秒再弹出强制同意
                            });
                        }
                        else {
                            this.enterGame();
                        }
                    }, jkShowTime);
                });
            });
        }
        start() {
        }
        enterGame() {
            setTimeout(() => {
                GxGame_1.default.Ad().initAd();
            }, 1000);
            GxGame_1.default.Ad().getDeviceId && GxGame_1.default.Ad().getDeviceId();
            if (this.canJumpToNext) {
                if (GxConstant_1.default.IS_HUAWEI_GAME || GxConstant_1.default.IS_MI_GAME) {
                    GxGame_1.default.Ad().login(() => {
                        // cc.director.loadScene(this.gameSceneName);
                        this.jumpScene();
                    }, () => {
                    });
                }
                else {
                    this.jumpScene();
                }
            }
            else {
                if (GxConstant_1.default.IS_OPPO_GAME) {
                    console.log("是不是没添加软著 信息");
                    console.log("是不是没添加软著 信息");
                    console.log("是不是没添加软著 信息");
                    console.log("是不是没添加软著 信息");
                    console.log("是不是没添加软著 信息");
                }
            }
        }
        jumpScene() {
            cc.director.loadScene(this.gameSceneName);
        }
    };
    __setFunctionName(_classThis, "FirstScene");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _jkTitle_decorators = [property(cc.Label)];
        _jkContent_decorators = [property(cc.Label)];
        _jkCompany_decorators = [property(cc.Label)];
        _jkSoftCode_decorators = [property(cc.Label)];
        _ageSp_decorators = [property(cc.Sprite)];
        _gameSceneName_decorators = [property];
        __esDecorate(null, null, _jkTitle_decorators, { kind: "field", name: "jkTitle", static: false, private: false, access: { has: obj => "jkTitle" in obj, get: obj => obj.jkTitle, set: (obj, value) => { obj.jkTitle = value; } }, metadata: _metadata }, _jkTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _jkContent_decorators, { kind: "field", name: "jkContent", static: false, private: false, access: { has: obj => "jkContent" in obj, get: obj => obj.jkContent, set: (obj, value) => { obj.jkContent = value; } }, metadata: _metadata }, _jkContent_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _jkCompany_decorators, { kind: "field", name: "jkCompany", static: false, private: false, access: { has: obj => "jkCompany" in obj, get: obj => obj.jkCompany, set: (obj, value) => { obj.jkCompany = value; } }, metadata: _metadata }, _jkCompany_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _jkSoftCode_decorators, { kind: "field", name: "jkSoftCode", static: false, private: false, access: { has: obj => "jkSoftCode" in obj, get: obj => obj.jkSoftCode, set: (obj, value) => { obj.jkSoftCode = value; } }, metadata: _metadata }, _jkSoftCode_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _ageSp_decorators, { kind: "field", name: "ageSp", static: false, private: false, access: { has: obj => "ageSp" in obj, get: obj => obj.ageSp, set: (obj, value) => { obj.ageSp = value; } }, metadata: _metadata }, _ageSp_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _gameSceneName_decorators, { kind: "field", name: "gameSceneName", static: false, private: false, access: { has: obj => "gameSceneName" in obj, get: obj => obj.gameSceneName, set: (obj, value) => { obj.gameSceneName = value; } }, metadata: _metadata }, _gameSceneName_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FirstScene = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FirstScene = _classThis;
})();
exports.default = FirstScene;
