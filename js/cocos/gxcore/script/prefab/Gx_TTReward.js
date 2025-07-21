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
const { ccclass, property } = cc._decorator;
let Gx_TTReward = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _blNode_decorators;
    let _blNode_initializers = [];
    let _blNode_extraInitializers = [];
    let _ttNode_decorators;
    let _ttNode_initializers = [];
    let _ttNode_extraInitializers = [];
    let _ksNode_decorators;
    let _ksNode_initializers = [];
    let _ksNode_extraInitializers = [];
    var Gx_TTReward = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.blNode = __runInitializers(this, _blNode_initializers, null);
            this.ttNode = (__runInitializers(this, _blNode_extraInitializers), __runInitializers(this, _ttNode_initializers, null));
            this.ksNode = (__runInitializers(this, _ttNode_extraInitializers), __runInitializers(this, _ksNode_initializers, null));
            this.curRootNode = __runInitializers(this, _ksNode_extraInitializers);
            this.havettreward = false;
            this.Reward = () => {
            };
        }
        onLoad() {
            var last = cc.sys.localStorage.getItem("TTRewardTime");
            if (last != null && last != "" && last != undefined) {
                var lasttime = parseInt(last);
                var now = new Date();
                var nowtime = parseInt("" + now.getFullYear() + (now.getMonth() + 1) + now.getDate());
                if (lasttime == nowtime) {
                    this.havettreward = true;
                }
            }
        }
        start() {
            this.getRewardBtn.active = false;
            this.ceBianLanBtn.active = false;
            this.haveRewardTip.active = false;
            // 是否已经领取奖励
            if (this.havettreward) {
                this.haveRewardTip.active = true;
            }
            else {
                if (GxGame_1.default.Ad().canReward) { // 判断是不是从侧边栏启动的
                    this.getRewardBtn.active = true;
                }
                else {
                    this.ceBianLanBtn.active = true;
                }
                if (GxConstant_1.default.IS_TT_GAME) {
                    // @ts-ignore
                    tt.onShow(this.onShow.bind(this));
                }
                else if (GxConstant_1.default.IS_BILI_GAME) {
                    // @ts-ignore
                    bl.onShow(this.onShow.bind(this));
                }
                else if (GxConstant_1.default.IS_KS_GAME) {
                    // @ts-ignore
                    ks.onShow(this.onShow.bind(this));
                }
            }
        }
        init(rewardCallback, rewardLabel, rewardUI, iconName, icon) {
            this.initUI(iconName, rewardUI);
            this.Reward = rewardCallback;
            let component = this.iconUI.getComponent(cc.Sprite);
            if (component && icon) {
                component.spriteFrame = icon;
            }
            if (rewardLabel && rewardLabel.length > 0) {
                this.rewardLabel.string = rewardLabel;
            }
            else {
                this.rewardLabel.string = "";
            }
        }
        initUI(iconName, rewardUI) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            let width = cc.winSize.width;
            let height = cc.winSize.height;
            this.ttNode.active = false;
            this.blNode.active = false;
            this.ksNode.active = false;
            //得到真正的UI
            if (GxConstant_1.default.IS_TT_GAME) {
                this.ttNode.active = true;
                this.ttNode.getChildByName("main").active = false;
                this.ttNode.getChildByName("land").active = false;
                if (width > height) {
                    this.curRootNode = (_a = this.ttNode) === null || _a === void 0 ? void 0 : _a.getChildByName("land");
                }
                else {
                    this.curRootNode = (_b = this.ttNode) === null || _b === void 0 ? void 0 : _b.getChildByName("main");
                }
            }
            else if (GxConstant_1.default.IS_BILI_GAME) {
                this.blNode.active = true;
                this.blNode.getChildByName("main").active = false;
                this.blNode.getChildByName("land").active = false;
                if (width > height) {
                    this.curRootNode = (_c = this.blNode) === null || _c === void 0 ? void 0 : _c.getChildByName("land");
                }
                else {
                    this.curRootNode = (_d = this.blNode) === null || _d === void 0 ? void 0 : _d.getChildByName("main");
                }
            }
            else if (GxConstant_1.default.IS_KS_GAME) {
                this.ksNode.active = true;
                this.ksNode.getChildByName("main").active = false;
                this.ksNode.getChildByName("land").active = false;
                if (width > height) {
                    this.curRootNode = (_e = this.ksNode) === null || _e === void 0 ? void 0 : _e.getChildByName("land");
                }
                else {
                    this.curRootNode = (_f = this.ksNode) === null || _f === void 0 ? void 0 : _f.getChildByName("main");
                }
            }
            else {
                this.ksNode.active = true;
                this.ksNode.getChildByName("main").active = false;
                this.ksNode.getChildByName("land").active = false;
                if (width > height) {
                    this.curRootNode = (_g = this.ksNode) === null || _g === void 0 ? void 0 : _g.getChildByName("land");
                }
                else {
                    this.curRootNode = (_h = this.ksNode) === null || _h === void 0 ? void 0 : _h.getChildByName("main");
                }
            }
            this.curRootNode.active = true;
            let btn = (_j = this.curRootNode) === null || _j === void 0 ? void 0 : _j.getChildByName("btn");
            this.getRewardBtn = btn === null || btn === void 0 ? void 0 : btn.getChildByName("lingQu");
            this.ceBianLanBtn = btn === null || btn === void 0 ? void 0 : btn.getChildByName("ceBianLan");
            this.haveRewardTip = (_k = this.curRootNode) === null || _k === void 0 ? void 0 : _k.getChildByName("haveReward");
            let body = (_l = this.curRootNode) === null || _l === void 0 ? void 0 : _l.getChildByName("body");
            this.rewardLabel = (_m = body === null || body === void 0 ? void 0 : body.getChildByName("3")) === null || _m === void 0 ? void 0 : _m.getChildByName("Layout").getChildByName("rewardLabel").getComponent(cc.Label);
            this.rewardLabel.node.active = true;
            let rewardUINode = (_o = body === null || body === void 0 ? void 0 : body.getChildByName("3")) === null || _o === void 0 ? void 0 : _o.getChildByName("Layout").getChildByName("rewardUI");
            rewardUINode.getComponent(cc.Sprite).spriteFrame = rewardUI;
            this.iconUI = (_r = (_q = (_p = body === null || body === void 0 ? void 0 : body.getChildByName("2")) === null || _p === void 0 ? void 0 : _p.getChildByName("quan")) === null || _q === void 0 ? void 0 : _q.getChildByName("mask")) === null || _r === void 0 ? void 0 : _r.getChildByName("iconUI");
            let iconNameNode = body === null || body === void 0 ? void 0 : body.getChildByName("iconName");
            for (let i = 0; i < iconNameNode.childrenCount; i++) {
                let iconNameLab = iconNameNode.children[i].getComponent(cc.Label);
                iconNameLab.string = iconName;
            }
        }
        // update (dt) {}
        onClickgotoBtn() {
            if (GxConstant_1.default.IS_TT_GAME) {
                // @ts-ignore
                tt.navigateToScene({
                    scene: "sidebar",
                    success: (res) => {
                        console.log("navigate to scene success");
                        // 跳转成功回调逻辑
                    },
                    fail: (res) => {
                        console.log("navigate to scene fail: ", res);
                        // 跳转失败回调逻辑
                    }
                });
            }
            else if (GxConstant_1.default.IS_BILI_GAME) {
                // @ts-ignore
                bl.navigateToScene({
                    scene: "sidebar",
                    success: (res) => {
                        console.log("navigate to scene success");
                        // 跳转成功回调逻辑
                    },
                    fail: (res) => {
                        console.log("navigate to scene fail: ", res);
                        // 跳转失败回调逻辑
                    }
                });
            }
            else if (GxConstant_1.default.IS_KS_GAME) {
                console.log("得自己手动进侧边栏......");
                this.close();
            }
            else {
                GxGame_1.default.Ad().canReward = true;
                this.close();
            }
        }
        onclickgetReward() {
            this.Reward && this.Reward();
            this.havettreward = true;
            var nowdate = new Date();
            var nowtime = "" + nowdate.getFullYear() + (nowdate.getMonth() + 1) + nowdate.getDate();
            cc.sys.localStorage.setItem("TTRewardTime", nowtime);
            this.getRewardBtn.active = false;
            this.haveRewardTip.active = true;
        }
        close() {
            this.node.destroy();
        }
        onShow(res) {
            console.warn("热启动场景字段：", res.from);
            if (res["scene"] == "021036" ||
                res.launch_from == "homepage" ||
                res.location == "sidebar_card" ||
                GxConstant_1.default.IS_KS_GAME && (res.from == "sidebar_miniprogram" || res.from == "sidebar_new")) {
                console.log("是从侧边栏启动的1");
                if (this && this.isValid) {
                    this.getRewardBtn.active = true;
                    this.ceBianLanBtn.active = false;
                    GxGame_1.default.Ad().canReward = true;
                }
            }
        }
        onDestroy() {
            if (GxConstant_1.default.IS_TT_GAME) {
                // @ts-ignore
                tt.offShow(this.onShow.bind(this));
            }
            else if (GxConstant_1.default.IS_BILI_GAME) {
                // @ts-ignore
                bl.offShow(this.onShow.bind(this));
            }
            else if (GxConstant_1.default.IS_KS_GAME) {
                // @ts-ignore
                ks.offShow(this.onShow.bind(this));
            }
        }
    };
    __setFunctionName(_classThis, "Gx_TTReward");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _blNode_decorators = [property(cc.Node)];
        _ttNode_decorators = [property(cc.Node)];
        _ksNode_decorators = [property(cc.Node)];
        __esDecorate(null, null, _blNode_decorators, { kind: "field", name: "blNode", static: false, private: false, access: { has: obj => "blNode" in obj, get: obj => obj.blNode, set: (obj, value) => { obj.blNode = value; } }, metadata: _metadata }, _blNode_initializers, _blNode_extraInitializers);
        __esDecorate(null, null, _ttNode_decorators, { kind: "field", name: "ttNode", static: false, private: false, access: { has: obj => "ttNode" in obj, get: obj => obj.ttNode, set: (obj, value) => { obj.ttNode = value; } }, metadata: _metadata }, _ttNode_initializers, _ttNode_extraInitializers);
        __esDecorate(null, null, _ksNode_decorators, { kind: "field", name: "ksNode", static: false, private: false, access: { has: obj => "ksNode" in obj, get: obj => obj.ksNode, set: (obj, value) => { obj.ksNode = value; } }, metadata: _metadata }, _ksNode_initializers, _ksNode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_TTReward = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_TTReward = _classThis;
})();
exports.default = Gx_TTReward;
