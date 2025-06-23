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
const ViewManager_1 = __importDefault(require("./ViewManager"));
const UIFunctions_1 = __importDefault(require("./UIFunctions"));
const cc_1 = require("cc");
const EventManager_1 = require("../core/EventManager");
const { ccclass, property } = cc_1._decorator;
let View = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _isDialog_decorators;
    let _isDialog_initializers = [];
    let _isDialog_extraInitializers = [];
    let _closeOnClick_decorators;
    let _closeOnClick_initializers = [];
    let _closeOnClick_extraInitializers = [];
    let _opacity_decorators;
    let _opacity_initializers = [];
    let _opacity_extraInitializers = [];
    let _childrenAnimation_decorators;
    let _childrenAnimation_initializers = [];
    let _childrenAnimation_extraInitializers = [];
    let __topMost_decorators;
    let __topMost_initializers = [];
    let __topMost_extraInitializers = [];
    var View = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.isDialog = __runInitializers(this, _isDialog_initializers, false);
            this.closeOnClick = (__runInitializers(this, _isDialog_extraInitializers), __runInitializers(this, _closeOnClick_initializers, false));
            this.target = __runInitializers(this, _closeOnClick_extraInitializers);
            this.opacity = __runInitializers(this, _opacity_initializers, 160);
            this.childrenAnimation = (__runInitializers(this, _opacity_extraInitializers), __runInitializers(this, _childrenAnimation_initializers, false));
            this._topMost = (__runInitializers(this, _childrenAnimation_extraInitializers), __runInitializers(this, __topMost_initializers, false));
            this.touchBlocker = (__runInitializers(this, __topMost_extraInitializers), null);
            this.touchBlockerComp = null;
            this.animations = [];
            this._isHiding = false;
        }
        // isTouchEnabled: boolean = true;
        emit(e, msg) {
            EventManager_1.evt.emit(msg);
        }
        call(event, exp) {
            // eval(exp);
            g.execScript(exp);
        }
        setDelegate(target) {
            this.target = target;
        }
        emitEvent(e, exp) {
            EventManager_1.evt.emit(exp);
        }
        /** 打开其它界面  */
        showUI(e, viewPath) {
            ViewManager_1.default.instance.show(viewPath);
        }
        onLoad() {
            if (this.childrenAnimation) {
                this.animations = UIFunctions_1.default.getChildrenAnimations(this.node);
            }
            else {
                var anim = this.node.getComponent(cc_1.AnimationComponent);
                if (anim)
                    this.animations.push(anim);
            }
            let components = this.getComponents(cc_1.Component);
            for (var i = 0; i < components.length; i++) {
                let comp = components[i];
                if (comp != this) {
                    if (comp.onShown || comp.onShow || comp.onHidden) {
                        this.target = comp;
                        break;
                    }
                }
            }
            /** 点击背景退出弹窗 */
            if (this.isDialog) {
                if (this.closeOnClick) {
                    this.node.on(cc_1.SystemEventType.TOUCH_END, this.hide, this);
                    this.node.children[0] && this.node.children[0].addComponent(cc_1.BlockInputEventsComponent);
                }
            }
            if (this.animations.length > 0) {
                // this.touchBlocker = new Node();
                // this.touchBlocker.name = "TouchBlocker"
                // this.touchBlocker.width = 2000;
                // this.touchBlocker.height = 2000;
                // this.touchBlockerComp = this.touchBlocker.addComponent(BlockInputEventsComponent)
                // this.node.addChild(this.touchBlocker, 1000)
            }
        }
        start() {
            this.touchEnabled = true;
        }
        init(viewname) {
            this.name = viewname;
            let idx = viewname.lastIndexOf("/") + 1;
            // idx = Math.max(0,idx);
            this.node.name = viewname.substr(idx);
        }
        hideAnimationCallback() {
            this.node.active = this.visible;
            ViewManager_1.default.instance.checkViewStacks();
        }
        /**
         * //如果 实现了view的animation那么需要 animation 去做隐藏
         * 否则会不会有animtion ，系统 将直接 设置 active 为false
         */
        doHideAnimation() {
            // if (!this.isDialog)
            // {
            //todo is in hide animtion return ;
            // if(this.isInHideAnimation())return;
            this.node.active = true;
            this._isHiding = true;
            if (!UIFunctions_1.default.doHideAnimations(this.animations, this.hideAnimationCallback, this)) {
                this.node.active = false;
                this._isHiding = false;
                ViewManager_1.default.instance.checkViewStacks();
            }
            console.log("[View] hide:", this.name);
            this._visibleDirty = false;
        }
        isInHideAnimation() {
            return this._isHiding;
        }
        onHidden() {
            this._visibleDirty = false;
            if (this.target && this.target.onHidden)
                this.target.onHidden();
            // EventHandler.emitEvents(this.onHiddenEvents,[params]);
        }
        hide() {
            // super.hide()
            //ViewManager remove dd
            this.touchEnabled = false;
            ViewManager_1.default.instance.hide(this.node);
        }
        get visible() { return this._visibleDirty; }
        set topMost(b) {
            if (this._topMost)
                this._topMost = b;
            this.node.getComponent(cc_1.UITransformComponent).priority = 9999;
        }
        get topMost() {
            return this._topMost;
        }
        showAnimationNextFrame(callback) {
            this.scheduleOnce(_ => {
                UIFunctions_1.default.doShowAnimations(this.animations, callback);
            }, 0);
        }
        get touchEnabled() {
            if (this.touchBlocker) {
                return !this.touchBlocker.active;
            }
            return true;
        }
        set touchEnabled(b) {
            if (this.touchBlocker) {
                this.touchBlocker.active = !b;
            }
        }
        // setTouchEnabled(bEnabled){
        //     this.touchBlockerComp.enabled = bEnabled;
        //     // UIFunctions.setTouchEnabled(this.node,bEnabled);
        // }
        show(...params) {
            this.node.active = true;
            //reset zindex 
            if (this.topMost)
                this.node.getComponent(cc_1.UITransformComponent).priority = 9999;
            console.log("[View] show:", this.name);
            UIFunctions_1.default.stopAnimations(this.animations);
            // call next frames 
            // this.showAnimationDelay()
            //确保在widget 更新结束后开始动画 ，
            return new Promise((resolve, reject) => {
                let self = this;
                let showFinishCallback = function () {
                    if (!self.touchEnabled)
                        self.touchEnabled = true;
                    let ret = null;
                    if (self.target && self.target.onShown) {
                        try {
                            ret = self.target.onShown(...params);
                        }
                        catch (err) {
                            console.error(err);
                        }
                    }
                    EventManager_1.evt.emit(self.node.name + ".onShown.After", self, ret, params);
                    EventManager_1.evt.emit("View.onShown", self, ret, params);
                    resolve(self);
                };
                this.showAnimationNextFrame(showFinishCallback);
                this._visibleDirty = true;
                EventManager_1.evt.emitDelay(0, self.node.name + ".onShown.Before", self, params);
                EventManager_1.evt.emit("View.onShow", self, params);
                // mvc view 
                // let mv = this.getComponent(mvc_View)
                // mv && mv.render()
                if (this.target && this.target.onShow) {
                    try {
                        this.target.onShow(...params);
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                // EventHandler.emitEvents(this.onShownEvents,[params]);
            });
        }
    };
    __setFunctionName(_classThis, "View");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _isDialog_decorators = [property];
        _closeOnClick_decorators = [property];
        _opacity_decorators = [property];
        _childrenAnimation_decorators = [property];
        __topMost_decorators = [property({ visible: true, displayName: "topMost" })];
        __esDecorate(null, null, _isDialog_decorators, { kind: "field", name: "isDialog", static: false, private: false, access: { has: obj => "isDialog" in obj, get: obj => obj.isDialog, set: (obj, value) => { obj.isDialog = value; } }, metadata: _metadata }, _isDialog_initializers, _isDialog_extraInitializers);
        __esDecorate(null, null, _closeOnClick_decorators, { kind: "field", name: "closeOnClick", static: false, private: false, access: { has: obj => "closeOnClick" in obj, get: obj => obj.closeOnClick, set: (obj, value) => { obj.closeOnClick = value; } }, metadata: _metadata }, _closeOnClick_initializers, _closeOnClick_extraInitializers);
        __esDecorate(null, null, _opacity_decorators, { kind: "field", name: "opacity", static: false, private: false, access: { has: obj => "opacity" in obj, get: obj => obj.opacity, set: (obj, value) => { obj.opacity = value; } }, metadata: _metadata }, _opacity_initializers, _opacity_extraInitializers);
        __esDecorate(null, null, _childrenAnimation_decorators, { kind: "field", name: "childrenAnimation", static: false, private: false, access: { has: obj => "childrenAnimation" in obj, get: obj => obj.childrenAnimation, set: (obj, value) => { obj.childrenAnimation = value; } }, metadata: _metadata }, _childrenAnimation_initializers, _childrenAnimation_extraInitializers);
        __esDecorate(null, null, __topMost_decorators, { kind: "field", name: "_topMost", static: false, private: false, access: { has: obj => "_topMost" in obj, get: obj => obj._topMost, set: (obj, value) => { obj._topMost = value; } }, metadata: _metadata }, __topMost_initializers, __topMost_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        View = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return View = _classThis;
})();
exports.default = View;
