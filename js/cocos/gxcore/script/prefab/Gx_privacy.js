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
const GxEnum_1 = require("../core/GxEnum");
const ResUtil_1 = __importDefault(require("../util/ResUtil"));
const GxGame_1 = __importDefault(require("../GxGame"));
const GxAdParams_1 = require("../GxAdParams");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const { ccclass, property } = cc._decorator;
let Gx_privacy = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _instanceExtraInitializers = [];
    let _bg_decorators;
    let _bg_initializers = [];
    let _textArea_decorators;
    let _textArea_initializers = [];
    let _toggleContainer_decorators;
    let _toggleContainer_initializers = [];
    let _userGroup_decorators;
    let _userGroup_initializers = [];
    let _privacyGroup_decorators;
    let _privacyGroup_initializers = [];
    let _loading_decorators;
    let _loading_initializers = [];
    let _titleSp_decorators;
    let _titleSp_initializers = [];
    let _titleSpUser_decorators;
    let _titleSpUser_initializers = [];
    let _titleSpPrivacy_decorators;
    let _titleSpPrivacy_initializers = [];
    var Gx_privacy = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.bg = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _bg_initializers, null));
            this.textArea = __runInitializers(this, _textArea_initializers, null);
            this.toggleContainer = __runInitializers(this, _toggleContainer_initializers, null);
            this.userGroup = __runInitializers(this, _userGroup_initializers, null);
            this.privacyGroup = __runInitializers(this, _privacyGroup_initializers, null);
            this.loading = __runInitializers(this, _loading_initializers, null);
            this.titleSp = __runInitializers(this, _titleSp_initializers, null);
            this.titleSpUser = __runInitializers(this, _titleSpUser_initializers, null);
            this.titleSpPrivacy = __runInitializers(this, _titleSpPrivacy_initializers, null);
            this.tabType = null;
            this.privacyCon = null;
        }
        show(type = GxEnum_1.privacy_type.user) {
            if (this.node.parent)
                return;
            this.tabType = type;
            if (GxGame_1.default.canShowUser) {
                this.toggleContainer.active = true;
            }
            else {
                this.toggleContainer.active = false;
            }
            cc.director.getScene().addChild(this.node);
            this.on_show();
        }
        hide() {
            this.node.destroy();
        }
        start() {
            this.node.zIndex = cc.macro.MAX_ZINDEX;
            this.loading.active = true;
            cc.tween(this.loading).repeatForever(cc.tween().to(1.5, { angle: -360 }).to(0.001, { angle: 0 })).start();
            ResUtil_1.default.loadJsonAsset('gx/cfg/privacy', (err, json) => {
                this.loading.active = false;
                if (err) {
                    return;
                }
                this.privacyCon = json.json;
                this.change_tab(this.tabType);
            });
            /*  cc.loader.loadRes('gx/cfg/privacy', cc.JsonAsset, (err, json) => {
                  this.loading.active = false;
                  if (err) {
                      console.error('[gx_game] 隐私文件读取失败' + JSON.stringify(err));
                      return;
                  }
                  this.privacyCon = json.json;
                  this.change_tab(this.tabType);
              });*/
        }
        on_show() {
            this.set_frame_roi();
            this.change_tab(this.tabType);
        }
        set_frame_roi() {
            if (cc.winSize.width <= cc.winSize.height) {
                this.bg.width = 521;
                this.bg.height = 717;
            }
            else {
                this.bg.width = 717;
                this.bg.height = 521;
            }
        }
        on_change_tab(event, type) {
            this.change_tab(type);
        }
        change_tab(type) {
            if (!GxGame_1.default.canShowUser) {
                type = "privacy";
            }
            this.tabType = type;
            /*    for (let item of this.toggleContainer.toggleItems) {
                    if (item.name.indexOf(type) >= 0) {
                        item.check();
                    }
                }*/
            if (type == "user") {
                this.userGroup.getChildByName("checkmark").active = true;
                this.privacyGroup.getChildByName("checkmark").active = false;
                this.titleSp.spriteFrame = this.titleSpUser;
            }
            else if (type == "privacy") {
                this.userGroup.getChildByName("checkmark").active = false;
                this.privacyGroup.getChildByName("checkmark").active = true;
                this.titleSp.spriteFrame = this.titleSpPrivacy;
            }
            if (this.privacyCon) {
                let label = this.textArea.content.getComponent(cc.Label);
                if (this.privacyCon.hasOwnProperty(this.tabType)) {
                    let privacyConElement = "";
                    if (GxConstant_1.default.IS_MI_GAME && this.tabType == "privacy") {
                        privacyConElement = this.privacyCon[this.tabType + "2"].replace(/companyName/g, GxAdParams_1.AdParams.ysCompanyName).replace(/mail/g, GxAdParams_1.AdParams.ysMail).replace(/gameName/g, GxAdParams_1.AdParams.mi.gameName).replace(/address/g, GxAdParams_1.AdParams.ysAddress.length > 0 ? "" + GxAdParams_1.AdParams.ysAddress : "");
                    }
                    else {
                        privacyConElement = this.privacyCon[this.tabType].replace(/companyName/g, GxAdParams_1.AdParams.ysCompanyName).replace(/mail/g, GxAdParams_1.AdParams.ysMail).replace(/gameName/g, GxAdParams_1.AdParams.ysMail).replace(/address/g, GxAdParams_1.AdParams.ysAddress.length > 0 ? "" + GxAdParams_1.AdParams.ysAddress : "");
                    }
                    label.string = privacyConElement;
                }
                else {
                    label.string = '';
                }
                this.textArea.scrollTo(cc.v2(0, 1), 0);
            }
        }
        onDisable() {
        }
    };
    __setFunctionName(_classThis, "Gx_privacy");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _bg_decorators = [property(cc.Node)];
        _textArea_decorators = [property(cc.ScrollView)];
        _toggleContainer_decorators = [property(cc.Node)];
        _userGroup_decorators = [property(cc.Node)];
        _privacyGroup_decorators = [property(cc.Node)];
        _loading_decorators = [property(cc.Node)];
        _titleSp_decorators = [property(cc.Sprite)];
        _titleSpUser_decorators = [property(cc.SpriteFrame)];
        _titleSpPrivacy_decorators = [property(cc.SpriteFrame)];
        __esDecorate(null, null, _bg_decorators, { kind: "field", name: "bg", static: false, private: false, access: { has: obj => "bg" in obj, get: obj => obj.bg, set: (obj, value) => { obj.bg = value; } }, metadata: _metadata }, _bg_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _textArea_decorators, { kind: "field", name: "textArea", static: false, private: false, access: { has: obj => "textArea" in obj, get: obj => obj.textArea, set: (obj, value) => { obj.textArea = value; } }, metadata: _metadata }, _textArea_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _toggleContainer_decorators, { kind: "field", name: "toggleContainer", static: false, private: false, access: { has: obj => "toggleContainer" in obj, get: obj => obj.toggleContainer, set: (obj, value) => { obj.toggleContainer = value; } }, metadata: _metadata }, _toggleContainer_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _userGroup_decorators, { kind: "field", name: "userGroup", static: false, private: false, access: { has: obj => "userGroup" in obj, get: obj => obj.userGroup, set: (obj, value) => { obj.userGroup = value; } }, metadata: _metadata }, _userGroup_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _privacyGroup_decorators, { kind: "field", name: "privacyGroup", static: false, private: false, access: { has: obj => "privacyGroup" in obj, get: obj => obj.privacyGroup, set: (obj, value) => { obj.privacyGroup = value; } }, metadata: _metadata }, _privacyGroup_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _loading_decorators, { kind: "field", name: "loading", static: false, private: false, access: { has: obj => "loading" in obj, get: obj => obj.loading, set: (obj, value) => { obj.loading = value; } }, metadata: _metadata }, _loading_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _titleSp_decorators, { kind: "field", name: "titleSp", static: false, private: false, access: { has: obj => "titleSp" in obj, get: obj => obj.titleSp, set: (obj, value) => { obj.titleSp = value; } }, metadata: _metadata }, _titleSp_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _titleSpUser_decorators, { kind: "field", name: "titleSpUser", static: false, private: false, access: { has: obj => "titleSpUser" in obj, get: obj => obj.titleSpUser, set: (obj, value) => { obj.titleSpUser = value; } }, metadata: _metadata }, _titleSpUser_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _titleSpPrivacy_decorators, { kind: "field", name: "titleSpPrivacy", static: false, private: false, access: { has: obj => "titleSpPrivacy" in obj, get: obj => obj.titleSpPrivacy, set: (obj, value) => { obj.titleSpPrivacy = value; } }, metadata: _metadata }, _titleSpPrivacy_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_privacy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_privacy = _classThis;
})();
exports.default = Gx_privacy;
