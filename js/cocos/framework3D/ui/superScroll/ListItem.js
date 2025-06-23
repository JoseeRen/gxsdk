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
Object.defineProperty(exports, "__esModule", { value: true });
/******************************************
 * @author kL <klk0@qq.com>
 * @date 2019/6/6
 * @doc 列表Item组件.
 * 说明：
 *      1、此组件须配合List组件使用。（配套的配套的..）
 * @end
 ******************************************/
const { ccclass, property, disallowMultiple, menu, executionOrder } = cc_1._decorator;
const cc_1 = require("cc");
var SelectedType;
(function (SelectedType) {
    SelectedType[SelectedType["NONE"] = 0] = "NONE";
    SelectedType[SelectedType["TOGGLE"] = 1] = "TOGGLE";
    SelectedType[SelectedType["SWITCH"] = 2] = "SWITCH";
})(SelectedType || (SelectedType = {}));
function scale(x) {
    return new cc_1.Vec3(x, x, x);
}
let ListItem = (() => {
    let _classDecorators = [ccclass, disallowMultiple(), menu('自定义组件/List Item'), executionOrder(-5001)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _icon_decorators;
    let _icon_initializers = [];
    let _icon_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _selectedMode_decorators;
    let _selectedMode_initializers = [];
    let _selectedMode_extraInitializers = [];
    let _selectedFlag_decorators;
    let _selectedFlag_initializers = [];
    let _selectedFlag_extraInitializers = [];
    let _selectedSpriteFrame_decorators;
    let _selectedSpriteFrame_initializers = [];
    let _selectedSpriteFrame_extraInitializers = [];
    let _adaptiveSize_decorators;
    let _adaptiveSize_initializers = [];
    let _adaptiveSize_extraInitializers = [];
    var ListItem = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            //图标
            this.icon = __runInitializers(this, _icon_initializers, null);
            //标题
            this.title = (__runInitializers(this, _icon_extraInitializers), __runInitializers(this, _title_initializers, null));
            //选择模式
            this.selectedMode = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _selectedMode_initializers, SelectedType.NONE));
            //被选标志
            this.selectedFlag = (__runInitializers(this, _selectedMode_extraInitializers), __runInitializers(this, _selectedFlag_initializers, null));
            //被选择的SpriteFrame
            this.selectedSpriteFrame = (__runInitializers(this, _selectedFlag_extraInitializers), __runInitializers(this, _selectedSpriteFrame_initializers, null));
            //未被选择的SpriteFrame
            this._unselectedSpriteFrame = (__runInitializers(this, _selectedSpriteFrame_extraInitializers), null);
            //自适应尺寸
            this.adaptiveSize = __runInitializers(this, _adaptiveSize_initializers, false);
            //选择
            this._selected = (__runInitializers(this, _adaptiveSize_extraInitializers), false);
            //是否已经注册过事件
            this._eventReg = false;
        }
        set selected(val) {
            this._selected = val;
            if (!this.selectedFlag)
                return;
            switch (this.selectedMode) {
                case SelectedType.TOGGLE:
                    this.selectedFlag.active = val;
                    break;
                case SelectedType.SWITCH:
                    let sp = this.selectedFlag.getComponent(cc_1.SpriteComponent);
                    if (sp)
                        sp.spriteFrame = val ? this.selectedSpriteFrame : this._unselectedSpriteFrame;
                    break;
            }
        }
        get selected() {
            return this._selected;
        }
        get btnCom() {
            if (!this._btnCom)
                this._btnCom = this.node.getComponent(cc_1.ButtonComponent);
            return this._btnCom;
        }
        onLoad() {
            //没有按钮组件的话，selectedFlag无效
            if (!this.btnCom)
                this.selectedMode == SelectedType.NONE;
            //有选择模式时，保存相应的东西
            if (this.selectedMode == SelectedType.SWITCH) {
                let com = this.selectedFlag.getComponent(cc_1.SpriteComponent);
                this._unselectedSpriteFrame = com.spriteFrame;
            }
        }
        onDestroy() {
            let t = this;
            t.node.off(cc_1.Node.EventType.SIZE_CHANGED, t._onSizeChange, t);
        }
        _registerEvent() {
            let t = this;
            if (!t._eventReg) {
                if (t.btnCom && t.list.selectedMode > 0) {
                    t.btnCom.clickEvents.unshift(t.createEvt(t, 'onClickThis'));
                }
                if (t.adaptiveSize) {
                    t.node.on(cc_1.Node.EventType.SIZE_CHANGED, t._onSizeChange, t);
                }
                t._eventReg = true;
            }
        }
        _onSizeChange() {
            this.list._onItemAdaptive(this.node);
        }
        /**
         * 创建事件
         * @param {Component} component 组件脚本
         * @param {string} handlerName 触发函数名称
         * @param {Node} node 组件所在node（不传的情况下取component.node）
         * @returns EventHandler
         */
        createEvt(component, handlerName, node = null) {
            if (!component.isValid)
                return; //有些异步加载的，节点以及销毁了。
            component['comName'] = component['comName'] || component.name.match(/\<(.*?)\>/g).pop().replace(/\<|>/g, '');
            let evt = new cc_1.EventHandler();
            evt.target = node || component.node;
            evt.component = component['comName'];
            evt.handler = handlerName;
            return evt;
        }
        showAni(aniType, callFunc, del) {
            let acts;
            let tweener = (0, cc_1.tween)(this.node);
            switch (aniType) {
                case 0: //向上消失
                    // acts = [
                    //     cc.scaleTo(.2, .7),
                    //     cc.moveBy(.3, 0, this.node.height * 2),
                    // ];
                    tweener.to(.2, { scale: scale(.7) }).by(.3, { position: (0, cc_1.v3)(0, this.node.height * 2, 0) });
                    break;
                case 1: //向右消失
                    // acts = [
                    //     cc.scaleTo(.2, .7),
                    //     cc.moveBy(.3, this.node.width * 2, 0),
                    // ];
                    tweener.to(.2, { scale: scale(.7) }).by(.3, { position: (0, cc_1.v3)(this.node.width * 2, 0, 0) });
                    break;
                case 2: //向下消失
                    // acts = [
                    //     cc.scaleTo(.2, .7),
                    //     cc.moveBy(.3, 0, this.node.height * -2),
                    // ];
                    tweener.to(.2, { scale: scale(.7) }).by(.3, { position: (0, cc_1.v3)(0, this.node.height * -2, 0) });
                    break;
                case 3: //向左消失
                    // acts = [
                    //     cc.scaleTo(.2, .7),
                    //     cc.moveBy(.3, this.node.width * -2, 0),
                    // ];
                    tweener.to(.2, { scale: scale(.7) }).by(.3, { position: (0, cc_1.v3)(this.node.width * -2, 0, 0) });
                    break;
                default: //默认：缩小消失
                    // acts = [
                    //     cc.scaleTo(.3, .1),
                    // ];
                    tweener.to(.3, { scale: scale(.1) });
                    break;
            }
            if (callFunc || del) {
                tweener.call(_ => {
                    if (del) {
                        this.list._delSingleItem(this.node);
                        for (let n = this.list.displayData.length - 1; n >= 0; n--) {
                            if (this.list.displayData[n].id == this.listId) {
                                this.list.displayData.splice(n, 1);
                                break;
                            }
                        }
                    }
                    callFunc();
                });
            }
            // this.node.runAction(cc.sequence(acts));
            tweener.start();
        }
        onClickThis() {
            this.list.selectedId = this.listId;
        }
    };
    __setFunctionName(_classThis, "ListItem");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _icon_decorators = [property({ type: cc_1.SpriteComponent, tooltip: CC_DEV && '图标' })];
        _title_decorators = [property({ type: cc_1.Node, tooltip: CC_DEV && '标题' })];
        _selectedMode_decorators = [property({
                type: cc.Enum(SelectedType),
                tooltip: CC_DEV && '选择模式'
            })];
        _selectedFlag_decorators = [property({
                type: cc_1.Node, tooltip: CC_DEV && '被选标志',
                visible() { return this.selectedMode > SelectedType.NONE; }
            })];
        _selectedSpriteFrame_decorators = [property({
                type: cc_1.SpriteFrame, tooltip: CC_DEV && '被选择的SpriteFrame',
                visible() { return this.selectedMode == SelectedType.SWITCH; }
            })];
        _adaptiveSize_decorators = [property({
                tooltip: CC_DEV && '自适应尺寸（宽或高）',
            })];
        __esDecorate(null, null, _icon_decorators, { kind: "field", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } }, metadata: _metadata }, _icon_initializers, _icon_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _selectedMode_decorators, { kind: "field", name: "selectedMode", static: false, private: false, access: { has: obj => "selectedMode" in obj, get: obj => obj.selectedMode, set: (obj, value) => { obj.selectedMode = value; } }, metadata: _metadata }, _selectedMode_initializers, _selectedMode_extraInitializers);
        __esDecorate(null, null, _selectedFlag_decorators, { kind: "field", name: "selectedFlag", static: false, private: false, access: { has: obj => "selectedFlag" in obj, get: obj => obj.selectedFlag, set: (obj, value) => { obj.selectedFlag = value; } }, metadata: _metadata }, _selectedFlag_initializers, _selectedFlag_extraInitializers);
        __esDecorate(null, null, _selectedSpriteFrame_decorators, { kind: "field", name: "selectedSpriteFrame", static: false, private: false, access: { has: obj => "selectedSpriteFrame" in obj, get: obj => obj.selectedSpriteFrame, set: (obj, value) => { obj.selectedSpriteFrame = value; } }, metadata: _metadata }, _selectedSpriteFrame_initializers, _selectedSpriteFrame_extraInitializers);
        __esDecorate(null, null, _adaptiveSize_decorators, { kind: "field", name: "adaptiveSize", static: false, private: false, access: { has: obj => "adaptiveSize" in obj, get: obj => obj.adaptiveSize, set: (obj, value) => { obj.adaptiveSize = value; } }, metadata: _metadata }, _adaptiveSize_initializers, _adaptiveSize_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ListItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ListItem = _classThis;
})();
exports.default = ListItem;
