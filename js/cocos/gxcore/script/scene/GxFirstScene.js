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
    let _jkInfo_decorators;
    let _jkInfo_initializers = [];
    let _jkInfo_extraInitializers = [];
    let _jkCompany_decorators;
    let _jkCompany_initializers = [];
    let _jkCompany_extraInitializers = [];
    let _ageSp_decorators;
    let _ageSp_initializers = [];
    let _ageSp_extraInitializers = [];
    let _gameSceneName_decorators;
    let _gameSceneName_initializers = [];
    let _gameSceneName_extraInitializers = [];
    var FirstScene = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.jkInfo = __runInitializers(this, _jkInfo_initializers, null);
            //软著信息
            this.jkCompany = (__runInitializers(this, _jkInfo_extraInitializers), __runInitializers(this, _jkCompany_initializers, null));
            this.ageSp = (__runInitializers(this, _jkCompany_extraInitializers), __runInitializers(this, _ageSp_initializers, null));
            this.gameSceneName = (__runInitializers(this, _ageSp_extraInitializers), __runInitializers(this, _gameSceneName_initializers, "GameScene"));
            // LIFE-CYCLE CALLBACKS:
            this.canJumpToNext = (__runInitializers(this, _gameSceneName_extraInitializers), false);
            // update (dt) {}
        }
        onLoad() {
            cc.assetManager.loadBundle("gxresbundle", (err, bundle) => {
                if (err) {
                    console.error(err);
                }
                if (bundle) {
                    GxGame_1.default.gxResBundle = bundle;
                }
                this.initSDK();
            });
        }
        initSDK() {
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
            this.jkInfo.node.active = false;
            this.jkCompany.node.active = false;
            this.ageSp.node.active = false;
            GxGame_1.default.initPlatform(() => {
                GxGame_1.default.initGame(() => {
                    //隐私政策和和适龄
                    let jkShowTime = GxGame_1.default.getJkShowTime();
                    if (jkShowTime >= 1) {
                        this.ageSp.node.active = true;
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
                            ResUtil_1.default.loadSprite("gx/texture/btn_TTBox", (err, spriteFrame) => {
                                if (err) {
                                }
                                else {
                                    GxGame_1.default.btnTTBoxSp = spriteFrame;
                                }
                            });
                        }
                        if (GxAdParams_1.AdParams.company && GxAdParams_1.AdParams.company.length > 0) {
                            this.jkCompany.string = "著作权人：" + GxAdParams_1.AdParams.company;
                        }
                        else {
                            if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_QQ_GAME) {
                                this.canJumpToNext = false;
                                this.jkCompany.string = "需要著作权人：";
                            }
                        }
                        let str = `著作权人:${GxAdParams_1.AdParams.company} 著作权登记号:${GxAdParams_1.AdParams.softCode}`;
                        /*
                        let str = `著作权人:${AdParams.company} 著作权登记号:${AdParams.softCode}
    审批文号:国新出审[2024]666号 出版物号:ISBN 978-7-498-13456-1
    出版服务单位：上海双盟网络科技有限公司`;*/
                        if (GxAdParams_1.AdParams.softCode && GxAdParams_1.AdParams.softCode.length > 0 && GxAdParams_1.AdParams.company && GxAdParams_1.AdParams.company.length > 0) {
                        }
                        else {
                            if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_QQ_GAME || GxConstant_1.default.IS_KS_GAME) {
                                this.canJumpToNext = false;
                            }
                        }
                        this.jkCompany.string = str;
                        this.jkInfo.node.active = true;
                        this.jkCompany.node.active = true;
                    }
                    this.scheduleOnce(() => {
                        if (GxConstant_1.default.IS_HUAWEI_GAME && !GxAdParams_1.AdParams.hw.privacy_url) {
                            console.warn("华为没有配置隐私政策链接");
                            return;
                        }
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
            GxGame_1.default.Ad().initAd();
            GxGame_1.default.Ad().getDeviceId && GxGame_1.default.Ad().getDeviceId();
            if (this.canJumpToNext) {
                if (GxConstant_1.default.IS_HUAWEI_GAME || GxConstant_1.default.IS_MI_GAME) {
                    GxGame_1.default.Ad().login(() => {
                        // cc.director.loadScene(this.gameSceneName);
                        this.jumpScene();
                    }, () => {
                    });
                }
                else if (GxConstant_1.default.IS_IOS_NATIVE || GxConstant_1.default.IS_IOS_H5) {
                    if (window["gameAnti"]) {
                        window["gameAnti"].init(this.node, () => {
                            this.jumpScene();
                        });
                    }
                    else {
                        this.jumpScene();
                    }
                }
                else {
                    this.jumpScene();
                }
            }
            else {
                if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_QQ_GAME || GxConstant_1.default.IS_KS_GAME) {
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
        _jkInfo_decorators = [property(cc.Label)];
        _jkCompany_decorators = [property(cc.Label)];
        _ageSp_decorators = [property(cc.Sprite)];
        _gameSceneName_decorators = [property];
        __esDecorate(null, null, _jkInfo_decorators, { kind: "field", name: "jkInfo", static: false, private: false, access: { has: obj => "jkInfo" in obj, get: obj => obj.jkInfo, set: (obj, value) => { obj.jkInfo = value; } }, metadata: _metadata }, _jkInfo_initializers, _jkInfo_extraInitializers);
        __esDecorate(null, null, _jkCompany_decorators, { kind: "field", name: "jkCompany", static: false, private: false, access: { has: obj => "jkCompany" in obj, get: obj => obj.jkCompany, set: (obj, value) => { obj.jkCompany = value; } }, metadata: _metadata }, _jkCompany_initializers, _jkCompany_extraInitializers);
        __esDecorate(null, null, _ageSp_decorators, { kind: "field", name: "ageSp", static: false, private: false, access: { has: obj => "ageSp" in obj, get: obj => obj.ageSp, set: (obj, value) => { obj.ageSp = value; } }, metadata: _metadata }, _ageSp_initializers, _ageSp_extraInitializers);
        __esDecorate(null, null, _gameSceneName_decorators, { kind: "field", name: "gameSceneName", static: false, private: false, access: { has: obj => "gameSceneName" in obj, get: obj => obj.gameSceneName, set: (obj, value) => { obj.gameSceneName = value; } }, metadata: _metadata }, _gameSceneName_initializers, _gameSceneName_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FirstScene = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FirstScene = _classThis;
})();
exports.default = FirstScene;
