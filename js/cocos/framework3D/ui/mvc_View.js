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
const cc_1 = require("cc");
const ccUtil_1 = __importDefault(require("../utils/ccUtil"));
const Switcher_1 = __importDefault(require("./controller/Switcher"));
const { ccclass, property } = cc_1._decorator;
let mvc_View = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    var mvc_View = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            // @property
            this.render_interval = mvc_View.DisableAutoRender;
            // @property
            this.auto_render_list = true;
            this.labels = [];
            this.sprites = [];
            this.bars = [];
            this.buttons = [];
            this.nodes = [];
            this.switchers = [];
            this.subViews = [];
            this.events = [];
            this.layouts = [];
        }
        getData() {
            return this.__data;
        }
        registerSubViews(viewComp, exp) {
            try {
                let views = this.getComponentsInChildren(viewComp);
                if (views) {
                    views = views.filter(v => v != this);
                }
                this.registerMVCViews(views, exp);
            }
            catch (e) {
                console.error(e);
            }
        }
        register(view_comp, exp, ext) {
            try {
                if (typeof (view_comp) == "string") {
                    let node = (0, cc_1.find)(view_comp, this.node);
                    if (!node) {
                        throw new Error(view_comp + " not found");
                    }
                    let label = node.getComponent(cc_1.LabelComponent);
                    if (label) {
                        this.registerLabel(label, exp);
                    }
                    else {
                        let bar = node.getComponent(cc_1.ProgressBarComponent);
                        if (!bar) {
                            let sp = node.getComponent(cc_1.SpriteComponent);
                            if (sp) {
                                this.registerSprite(sp, exp);
                            }
                            else {
                                console.warn("[mvc-View] not found : " + view_comp);
                            }
                        }
                        else {
                            this.registerProgressBar(bar, exp);
                        }
                    }
                }
                else {
                    if (view_comp instanceof cc_1.LabelComponent || (cc_1.RichTextComponent && view_comp instanceof cc_1.RichTextComponent)) {
                        this.registerLabel(view_comp, exp);
                    }
                    else if (view_comp instanceof cc_1.ProgressBarComponent) {
                        this.registerProgressBar(view_comp, exp);
                    }
                    else if (view_comp instanceof cc_1.SpriteComponent) {
                        this.registerSprite(view_comp, exp);
                    }
                    else if (view_comp instanceof cc_1.ButtonComponent) {
                        this.onClick(view_comp.node, exp);
                    }
                    else if (view_comp instanceof cc_1.LayoutComponent || view_comp instanceof cc_1.ScrollViewComponent) {
                        this.registerList(view_comp, exp, ext);
                    }
                    else if (view_comp instanceof Switcher_1.default) {
                        this.registerSwitcher(view_comp, exp);
                    }
                    else if (Array.isArray(view_comp)) {
                        this.registerMVCViews(view_comp, exp);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        //注册 子view 
        registerMVCViews(views, exp) {
            this.subViews.push({ views, exp });
        }
        registerList(layout, exp, callback) {
            if (callback == null) {
                callback = (node, data, i) => {
                    let subview = node.getComponent(mvc_View);
                    if (subview)
                        subview.render(data);
                };
            }
            layout.node['dataBind'] = exp;
            layout.node['setItemCallback'] = callback;
            this.layouts.push(layout);
        }
        registerLabel(label, exp) {
            label.node['getViewString'] = exp;
            this.labels.push(label);
        }
        onClick(btnNode, exp) {
            if (typeof (btnNode) == "string")
                btnNode = this.node.getChildByPath(btnNode);
            if (btnNode) {
                let btn = ccUtil_1.default.newButton(btnNode, "mvc_View", "__onButtonClicked", this.node);
                btnNode.attr({ onClick: exp.bind(this) });
                return btn;
            }
        }
        __onButtonClicked(e) {
            e.target.onClick(this.__data, this.__data2);
        }
        onVisible(view_comp, exp) {
            if (typeof (view_comp) == "string") {
                view_comp = (0, cc_1.find)(view_comp, this.node);
                if (!view_comp) {
                    console.warn("[mvc-View] not found : " + view_comp);
                    return;
                }
            }
            view_comp.attr({ isVisible: exp });
            this.nodes.push(view_comp);
        }
        onInteractable(view_comp, exp) {
            if (typeof (view_comp) == "string") {
                view_comp = (0, cc_1.find)(view_comp, this.node);
                if (!view_comp) {
                    console.warn("[mvc-View] not found : " + view_comp);
                    return;
                }
            }
            if (view_comp instanceof cc_1.Node) {
                view_comp = view_comp.getComponent(cc_1.ButtonComponent);
            }
            view_comp.node['isInteractable'] = exp;
            this.buttons.push(view_comp);
        }
        observe(exp, callback, policy) {
            let triggered = false;
            let evt = { exp, callback, policy, triggered };
            this.events.push(evt);
        }
        registerSwitcher(switcher, exp) {
            switcher.node["which"] = exp;
            this.switchers.push(switcher);
            return switcher;
        }
        registerSprite(sp, exp) {
            sp.node['url'] = exp;
            this.sprites.push(sp);
            return sp;
        }
        registerProgressBar(bar, exp) {
            bar.node['progress'] = exp;
            this.bars.push(bar);
            return bar;
        }
        renderList(data, data2) {
            this.layouts.forEach(layout => {
                if (!layout.node.activeInHierarchy)
                    return;
                let list_data = layout.node.dataBind(data, data2);
                let callback = layout.node.setItemCallback;
                layout.showlist(callback, list_data || []);
            });
        }
        disableAutoRender() {
            this.render_interval = mvc_View.DisableAutoRender;
        }
        onLaterRender() {
        }
        _updateView(data, data2) {
            if (this.node.active == false)
                return;
            if (this.auto_render_list) {
                this.renderList(data, data2);
            }
            this.nodes.forEach(node => {
                let bVisible = node['isVisible'](data, data2);
                node.active = bVisible;
            });
            this.labels.forEach(label => {
                if (!label.node.activeInHierarchy)
                    return;
                let str = label.node["getViewString"](data, data2);
                if (str == null)
                    console.warn("[mvc_View] failed to render label:" + label.node.name, label.node['getViewString']);
                label.string = str || "0";
            });
            this.sprites.forEach(sp => {
                if (!sp.node.activeInHierarchy)
                    return;
                let url = sp.node['url'](data, data2);
                if (!url)
                    return;
                ccUtil_1.default.setDisplay(sp, url);
            });
            this.events.forEach(evt => {
                if (!evt.triggered && evt.exp(data, data2)) {
                    evt.callback && evt.callback.call(this);
                    if (evt.policy) {
                    }
                    evt.triggered = true;
                }
            });
            // reset event trigger 
            this.events.forEach(evt => {
                if (evt.triggered && !evt.exp(data, data2)) {
                    evt.triggered = false;
                }
            });
            this.subViews.forEach(viewd => {
                let res;
                if (viewd.exp) {
                    res = viewd.exp(data, data2);
                }
                viewd.views.forEach((v, i) => v.render(res && res[i], data));
            });
            this.buttons.forEach(btn => {
                if (!btn.node.activeInHierarchy)
                    return;
                let bInteractable = btn.node['isInteractable'](data, data2);
                btn.interactable = bInteractable;
                let sp = btn.node.getComponent(cc_1.SpriteComponent);
                if (sp) {
                    let color = sp.color;
                    let newColor = color.clone();
                    newColor.a = bInteractable && 255 || 120;
                    sp.color = newColor;
                }
            });
            this.switchers.forEach(v => {
                if (!v.node.activeInHierarchy)
                    return;
                let exp = v.node["which"];
                let res = exp(data, data2);
                v.index = res;
            });
            // this.bars.forEach(bar=>{
            //     let progress = bar.node.progress(data);
            //     bar.progress = progress;
            // })
            this._renderBars(data, data2);
            this.onLaterRender();
        }
        _renderBars(data, data2) {
            this.bars.forEach(bar => {
                let progress = bar.node['progress'](data, data2);
                bar.progress = progress;
            });
        }
        update(dt) {
            // this._renderBars();
        }
        render(d, d2) {
            this.__data = d || this.__data;
            this.__data2 = d2 || this.__data2;
            this._updateView(this.__data, this.__data2);
        }
        renderLabel(label) {
            let str = label.node['getViewString']();
            label.string = str;
        }
        onEnable() {
            if (this.render_interval != -1)
                this.schedule(this.render, this.render_interval);
        }
        onDisable() {
            this.unschedule(this.render);
        }
    };
    __setFunctionName(_classThis, "mvc_View");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        mvc_View = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.DisableAutoRender = -1;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return mvc_View = _classThis;
})();
exports.default = mvc_View;
