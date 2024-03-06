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
const { ccclass, property } = cc._decorator;
let NewClass = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _instanceExtraInitializers = [];
    let _getReward_decorators;
    let _getReward_initializers = [];
    let _gotoBtn_decorators;
    let _gotoBtn_initializers = [];
    let _stringlabel_decorators;
    let _stringlabel_initializers = [];
    let _haverewardtip_decorators;
    let _haverewardtip_initializers = [];
    var NewClass = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.getReward = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _getReward_initializers, null));
            this.gotoBtn = __runInitializers(this, _gotoBtn_initializers, null);
            this.stringlabel = __runInitializers(this, _stringlabel_initializers, null);
            this.haverewardtip = __runInitializers(this, _haverewardtip_initializers, null);
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
            let width = cc.winSize.width;
            let height = cc.winSize.height;
            if (width > height) {
                //横屏
                this.curRootNode = this.node.getChildByName("land");
                this.node.getChildByName("land").active = true;
                this.node.getChildByName("main").active = false;
            }
            else {
                this.curRootNode = this.node.getChildByName("main");
                this.node.getChildByName("land").active = false;
                this.node.getChildByName("main").active = true;
            }
            this.getReward = this.curRootNode.getChildByName("领取奖励");
            this.gotoBtn = this.curRootNode.getChildByName("去侧边栏");
            this.stringlabel = this.curRootNode.getChildByName("rewardlabel").getComponent(cc.Label);
            this.haverewardtip = this.curRootNode.getChildByName("havereward");
        }
        start() {
            this.haverewardtip.active = false;
            if (this.havettreward) {
                // if (GxGame.havettreward) {//当天是否已经领取过奖励
                this.getReward.getComponent(cc.Button).interactable = false;
                this.getReward.active = true;
                this.gotoBtn.active = false;
                this.haverewardtip.active = true;
            }
            else {
                if (GxGame_1.default.Ad().canReward) { //判断是不是从侧边栏启动的
                    this.getReward.active = true;
                    this.gotoBtn.active = false;
                }
                else {
                    this.getReward.active = false;
                    this.gotoBtn.active = true;
                }
                // @ts-ignore
                tt.onShow(this.onShow.bind(this));
            }
        }
        // update (dt) {}
        onClickgotoBtn() {
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
        onclickgetReward() {
            this.Reward();
            this.havettreward = true;
            var nowdate = new Date();
            var nowtime = "" + nowdate.getFullYear() + (nowdate.getMonth() + 1) + nowdate.getDate();
            cc.sys.localStorage.setItem("TTRewardTime", nowtime);
            this.getReward.getComponent(cc.Button).interactable = false;
            this.haverewardtip.active = true;
        }
        close() {
            this.node.destroy();
        }
        onShow(res) {
            console.log("启动场景字段：", res.launch_from, ", ", res.location);
            if (res.launch_from == "homepage" || res.location == "sidebar_card") {
                console.log("是从侧边栏启动的");
                this.getReward.active = true;
                this.gotoBtn.active = false;
                /* if (GxGame.havettreward) {
                     this.getReward.getComponent(cc.Button).interactable = false;
                     this.haverewardtip.active = true;
                 }*/
            }
        }
        init(rewardCallback, rewardNum, iconAndName) {
            this.Reward = rewardCallback;
            let component = this.curRootNode.getChildByName("icon").getComponent(cc.Sprite);
            if (component) {
                component.spriteFrame = iconAndName;
            }
        }
        onDestroy() {
            // @ts-ignore
            tt.offShow(this.onShow);
        }
    };
    __setFunctionName(_classThis, "NewClass");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _getReward_decorators = [property(cc.Node)];
        _gotoBtn_decorators = [property(cc.Node)];
        _stringlabel_decorators = [property(cc.Label)];
        _haverewardtip_decorators = [property(cc.Node)];
        __esDecorate(null, null, _getReward_decorators, { kind: "field", name: "getReward", static: false, private: false, access: { has: obj => "getReward" in obj, get: obj => obj.getReward, set: (obj, value) => { obj.getReward = value; } }, metadata: _metadata }, _getReward_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _gotoBtn_decorators, { kind: "field", name: "gotoBtn", static: false, private: false, access: { has: obj => "gotoBtn" in obj, get: obj => obj.gotoBtn, set: (obj, value) => { obj.gotoBtn = value; } }, metadata: _metadata }, _gotoBtn_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _stringlabel_decorators, { kind: "field", name: "stringlabel", static: false, private: false, access: { has: obj => "stringlabel" in obj, get: obj => obj.stringlabel, set: (obj, value) => { obj.stringlabel = value; } }, metadata: _metadata }, _stringlabel_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _haverewardtip_decorators, { kind: "field", name: "haverewardtip", static: false, private: false, access: { has: obj => "haverewardtip" in obj, get: obj => obj.haverewardtip, set: (obj, value) => { obj.haverewardtip = value; } }, metadata: _metadata }, _haverewardtip_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NewClass = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NewClass = _classThis;
})();
exports.default = NewClass;
