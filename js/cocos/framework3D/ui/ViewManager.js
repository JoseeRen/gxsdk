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
const View_1 = __importDefault(require("./View"));
const EventManager_1 = require("../core/EventManager");
const cc_1 = require("cc");
const Device_1 = __importDefault(require("../misc/Device"));
const { ccclass, property, menu } = cc_1._decorator;
var TAG = "[ViewManager]";
let ViewManager = (() => {
    let _classDecorators = [ccclass, menu("UI相关/ViewManager")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _modalNode_decorators;
    let _modalNode_initializers = [];
    let _modalNode_extraInitializers = [];
    let _audio_show_decorators;
    let _audio_show_initializers = [];
    let _audio_show_extraInitializers = [];
    let _audio_hide_decorators;
    let _audio_hide_initializers = [];
    let _audio_hide_extraInitializers = [];
    var ViewManager = _classThis = class extends _classSuper {
        onLoad() {
            // this.node.zIndex = 1000;
            ViewManager.instance = this;
            this.modalNode.active = false;
            this.modal = this.modalNode.getComponent(cc_1.SpriteComponent);
            // this.modal.zIndex = 999;
            // cc.game.addPersistRootNode(this.node);
            // this.node.getComponent(WidgetComponent).target = find("Canvas")
            window["vm"] = this;
        }
        get allViews() {
            return Object.keys(this._views).map(k => this._views[k]);
        }
        onEnable() {
        }
        onDestroy() {
            // cc.game.removePersistRootNode(this.node);
            for (var key in this._views) {
                delete this._views[key];
            }
            ViewManager.instance = null;
        }
        start() {
            //load prefab
            // this.modal.active = false;
            // this.sprite = this.getComponent(SpriteComponent)
            // this.modal.zIndex = 999;
        }
        getVisibleDialog() {
            let viewStacks = Object.keys(this._views).map(k => this._views[k]).sort((a, b) => b.node.getComponent(cc_1.UITransformComponent).priority - a.node.getComponent(cc_1.UITransformComponent).priority);
            return viewStacks.find(v => v.isDialog && v.node.active);
        }
        hasVisibleDialog() {
            for (var name in this._views) {
                let view = this._views[name];
                if (view.isDialog) {
                    if (this.isVisible(name)) {
                        return true;
                    }
                }
            }
            return false;
        }
        isVisible(viewname) {
            let view = null;
            if (typeof (viewname) == "string")
                view = this._views[viewname];
            else
                view = viewname;
            //todo check type 
            if (view) {
                return view.node.active;
            }
            return false;
        }
        view(name) {
            return this._views[name];
        }
        attachViewComp(existingView) {
            let viewComp = null;
            if (viewComp == null || viewComp == undefined) {
                viewComp = existingView.getComponent(View_1.default);
                if (viewComp == null) {
                    viewComp = existingView.addComponent(View_1.default);
                    viewComp.init(existingView.name);
                }
                this._views[viewComp.name] = viewComp;
            }
            return viewComp;
        }
        setModalOpacity(opacty) {
            let c = this.modal.color;
            this.modal.color = (0, cc_1.color)(c.r, c.g, c.b, opacty);
        }
        showView(view, ...params) {
            this.modalNode.active = view.isDialog;
            //check has popuped dialog and  all currentview is dialog show modal forcely.
            if (this.hasVisibleDialog() || view.isDialog) {
                this.modalNode.active = true;
            }
            if (view.isDialog) {
                this.setModalOpacity(view.opacity);
            }
            this.updateZIndex(view);
            this.audio_show && Device_1.default.playEffect(this.audio_show);
            return view.show(...params);
        }
        showFromPrefab(prefab, prefabPath, ...params) {
            let view = this._views[prefabPath];
            if (view == null) {
                let node = (0, cc_1.instantiate)(prefab);
                if (node == null) {
                    throw new Error("Error Occurs While Creating View:" + prefabPath);
                }
                view = node.getComponent(View_1.default);
                if (view == null) {
                    view = node.addComponent(View_1.default);
                    view.isDialog = true;
                    //default is dialog
                }
                let widget = view.getComponent(cc_1.WidgetComponent);
                if (widget)
                    widget.target = (0, cc_1.find)("Canvas");
                view.init(prefabPath);
                this._views[prefabPath] = view;
                if (view.isDialog) {
                    this.node.addChild(node);
                }
                else {
                    this.node.addChild(node);
                }
            }
            return this.showView(view, ...params);
        }
        showFromPrefabPath(prefabPath, ...params) {
            let view = this._views[prefabPath];
            if (view == null || view == undefined) {
                return new Promise((resolve, reject) => {
                    cc_1.resources.load(prefabPath, cc_1.Prefab, (e, prefab) => {
                        console.log(TAG, "prefab loaded : " + prefabPath);
                        this.showFromPrefab(prefab, prefabPath, ...params).then(resolve);
                    });
                });
            }
            else {
                // this.sprite.enabled = false;
                this.modalNode.active = view.isDialog;
                if (this.hasVisibleDialog() || view.isDialog) {
                    // this.modal.active = true;
                    this.modalNode.active = true;
                    this.setModalOpacity(view.opacity);
                    // this.modal.opacity = view.opacity;
                }
                // console.log(TAG, "show view:" + prefabPath, params)
                this.updateZIndex(view);
                this.audio_show && Device_1.default.playEffect(this.audio_show);
                return view.show(...params);
            }
        }
        preload(prefabPath) {
            let view = this._views[prefabPath];
            if (view == null || view == undefined) {
                cc_1.resources.load(prefabPath, cc_1.Prefab, (e, prefab) => {
                    console.log(TAG, "preload view" + prefabPath);
                    let node = (0, cc_1.instantiate)(prefab);
                    view = node.getComponent(View_1.default);
                    let widget = view.getComponent(cc_1.WidgetComponent);
                    if (widget)
                        widget.target = (0, cc_1.find)("Canvas");
                    view.init(prefabPath);
                    this._views[prefabPath] = view;
                    // this.scheduleOnce(_=>node.active = false,0);
                    if (view.isDialog) {
                        this.node.addChild(node);
                    }
                    else {
                        this.node.addChild(node);
                    }
                    view.hide();
                });
            }
            else {
            }
        }
        // will enableTouch next show up
        disableTouch(viewNode) {
            let view = viewNode.getComponent(View_1.default);
            if (view) {
                view.touchEnabled = false;
            }
        }
        enableTouch(viewNode) {
            let view = viewNode.getComponent(View_1.default);
            if (view) {
                view.touchEnabled = true;
            }
        }
        show(view, ...params) {
            // disable current view 's touch 
            let isDialog = false;
            if (view instanceof cc_1.Component) {
                let v = view.getComponent(View_1.default);
                isDialog = v.isDialog;
            }
            // if (isDialog) {
            for (var i = 0; i < this.node.children.length; i++) {
                let v = this.node.children[i];
                let view = v.getComponent(View_1.default);
                if (view) {
                    if (view.topMost) {
                        v.getComponent(cc_1.UITransformComponent).priority = 9999;
                    }
                    else {
                        v.getComponent(cc_1.UITransformComponent).priority = i * 2;
                    }
                }
                else {
                    v.getComponent(cc_1.UITransformComponent).priority = i;
                }
            }
            // }
            if (typeof (view) == "string") {
                return this.showFromPrefabPath(view, ...params);
            }
            else {
                if (view == null || view == undefined)
                    return;
                if (view.node)
                    view = view.node;
                let v = this.attachViewComp(view);
                return this.showView(v, ...params);
            }
        }
        updateZIndex(view) {
            if (!view.topMost) {
                if (view.isDialog) {
                    view.node.getComponent(cc_1.UITransformComponent).priority = 1000;
                    this.modalNode.getComponent(cc_1.UITransformComponent).priority = 999;
                }
            }
        }
        hide(viewname, playHideAnim = true) {
            if (typeof (viewname) != "string") {
                // get view name 
                if (viewname == null || viewname == undefined)
                    return;
                let v = this.attachViewComp(viewname);
                viewname = v.name;
            }
            let view = this._views[viewname];
            if (view != null && view != undefined) {
                if (view.node.active == false)
                    return;
                view.node.active = false;
                if (view.isDialog) {
                    //todo: should support dialog hide animtion  later 
                    this.modalNode.active = false;
                }
                if (this.hasVisibleDialog()) {
                    this.modalNode.active = true;
                }
                // if(view.isInHideAnimation())
                //     return;
                // view.hide();
                if (playHideAnim) {
                    view.doHideAnimation();
                    view.onHidden();
                }
                else {
                    view.onHidden();
                    this.checkViewStacks();
                }
                console.log("[View] hide :" + view.name);
                this.audio_hide && Device_1.default.playEffect(this.audio_hide);
                EventManager_1.evt.emit(view.node.name + ".onHidden");
                EventManager_1.evt.emit("View.onHidden", view);
            }
        }
        checkViewStacks() {
            let dialog = this.getVisibleDialog();
            if (dialog) {
                this.modalNode.active = true;
                this.setModalOpacity(dialog.opacity);
                this.updateZIndex(dialog);
            }
        }
        hideAll() {
            for (var viewname in this._views) {
                // let view = this._views[viewname]
                this.hide(viewname);
            }
        }
        constructor() {
            super(...arguments);
            // onLoad () {}
            // baseDir:string = "assets/"
            this._views = {};
            // 
            this.modalNode = __runInitializers(this, _modalNode_initializers, null);
            this.modal = (__runInitializers(this, _modalNode_extraInitializers), null);
            this.audio_show = __runInitializers(this, _audio_show_initializers, null);
            this.audio_hide = (__runInitializers(this, _audio_show_extraInitializers), __runInitializers(this, _audio_hide_initializers, null));
            __runInitializers(this, _audio_hide_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ViewManager");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _modalNode_decorators = [property(cc_1.Node)];
        _audio_show_decorators = [property(cc_1.AudioClip)];
        _audio_hide_decorators = [property(cc_1.AudioClip)];
        __esDecorate(null, null, _modalNode_decorators, { kind: "field", name: "modalNode", static: false, private: false, access: { has: obj => "modalNode" in obj, get: obj => obj.modalNode, set: (obj, value) => { obj.modalNode = value; } }, metadata: _metadata }, _modalNode_initializers, _modalNode_extraInitializers);
        __esDecorate(null, null, _audio_show_decorators, { kind: "field", name: "audio_show", static: false, private: false, access: { has: obj => "audio_show" in obj, get: obj => obj.audio_show, set: (obj, value) => { obj.audio_show = value; } }, metadata: _metadata }, _audio_show_initializers, _audio_show_extraInitializers);
        __esDecorate(null, null, _audio_hide_decorators, { kind: "field", name: "audio_hide", static: false, private: false, access: { has: obj => "audio_hide" in obj, get: obj => obj.audio_hide, set: (obj, value) => { obj.audio_hide = value; } }, metadata: _metadata }, _audio_hide_initializers, _audio_hide_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ViewManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ViewManager = _classThis;
})();
exports.default = ViewManager;
