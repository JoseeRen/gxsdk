"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/******************************************
 * @author kL <klk0@qq.com>
 * @date 2019/6/6
 * @doc 列表组件.
 * @end
 ******************************************/
const { ccclass, property, disallowMultiple, menu, executionOrder, requireComponent } = cc_1._decorator;
const ListItem_1 = __importDefault(require("./ListItem"));
const cc_1 = require("cc");
var TemplateType;
(function (TemplateType) {
    TemplateType[TemplateType["NODE"] = 1] = "NODE";
    TemplateType[TemplateType["PREFAB"] = 2] = "PREFAB";
})(TemplateType || (TemplateType = {}));
var SlideType;
(function (SlideType) {
    SlideType[SlideType["NORMAL"] = 1] = "NORMAL";
    SlideType[SlideType["ADHERING"] = 2] = "ADHERING";
    SlideType[SlideType["PAGE"] = 3] = "PAGE";
})(SlideType || (SlideType = {}));
var SelectedType;
(function (SelectedType) {
    SelectedType[SelectedType["NONE"] = 0] = "NONE";
    SelectedType[SelectedType["SINGLE"] = 1] = "SINGLE";
    SelectedType[SelectedType["MULT"] = 2] = "MULT";
})(SelectedType || (SelectedType = {}));
let List = (() => {
    let _classDecorators = [ccclass, disallowMultiple(), menu('自定义组件/List'), requireComponent(cc_1.ScrollViewComponent), executionOrder(-5000)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _instanceExtraInitializers = [];
    let _templateType_decorators;
    let _templateType_initializers = [];
    let _templateType_extraInitializers = [];
    let _tmpNode_decorators;
    let _tmpNode_initializers = [];
    let _tmpNode_extraInitializers = [];
    let _tmpPrefab_decorators;
    let _tmpPrefab_initializers = [];
    let _tmpPrefab_extraInitializers = [];
    let __slideMode_decorators;
    let __slideMode_initializers = [];
    let __slideMode_extraInitializers = [];
    let _set_slideMode_decorators;
    let _pageDistance_decorators;
    let _pageDistance_initializers = [];
    let _pageDistance_extraInitializers = [];
    let _pageChangeEvent_decorators;
    let _pageChangeEvent_initializers = [];
    let _pageChangeEvent_extraInitializers = [];
    let __virtual_decorators;
    let __virtual_initializers = [];
    let __virtual_extraInitializers = [];
    let _set_virtual_decorators;
    let _cyclic_decorators;
    let _cyclic_initializers = [];
    let _cyclic_extraInitializers = [];
    let _lackCenter_decorators;
    let _lackCenter_initializers = [];
    let _lackCenter_extraInitializers = [];
    let _lackSlide_decorators;
    let _lackSlide_initializers = [];
    let _lackSlide_extraInitializers = [];
    let __updateRate_decorators;
    let __updateRate_initializers = [];
    let __updateRate_extraInitializers = [];
    let _set_updateRate_decorators;
    let _frameByFrameRenderNum_decorators;
    let _frameByFrameRenderNum_initializers = [];
    let _frameByFrameRenderNum_extraInitializers = [];
    let _renderEvent_decorators;
    let _renderEvent_initializers = [];
    let _renderEvent_extraInitializers = [];
    let _selectedMode_decorators;
    let _selectedMode_initializers = [];
    let _selectedMode_extraInitializers = [];
    let _repeatEventSingle_decorators;
    let _repeatEventSingle_initializers = [];
    let _repeatEventSingle_extraInitializers = [];
    let _selectedEvent_decorators;
    let _selectedEvent_initializers = [];
    let _selectedEvent_extraInitializers = [];
    let __numItems_decorators;
    let __numItems_initializers = [];
    let __numItems_extraInitializers = [];
    var List = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            //模板类型
            this.templateType = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _templateType_initializers, TemplateType.NODE));
            //模板Item（Node）
            this.tmpNode = (__runInitializers(this, _templateType_extraInitializers), __runInitializers(this, _tmpNode_initializers, null));
            //模板Item（Prefab）
            this.tmpPrefab = (__runInitializers(this, _tmpNode_extraInitializers), __runInitializers(this, _tmpPrefab_initializers, null));
            //滑动模式
            this._slideMode = (__runInitializers(this, _tmpPrefab_extraInitializers), __runInitializers(this, __slideMode_initializers, SlideType.NORMAL));
            //翻页作用距离
            this.pageDistance = (__runInitializers(this, __slideMode_extraInitializers), __runInitializers(this, _pageDistance_initializers, .3));
            //页面改变事件
            this.pageChangeEvent = (__runInitializers(this, _pageDistance_extraInitializers), __runInitializers(this, _pageChangeEvent_initializers, new cc_1.EventHandler()));
            //是否为虚拟列表（动态列表）
            this._virtual = (__runInitializers(this, _pageChangeEvent_extraInitializers), __runInitializers(this, __virtual_initializers, true));
            //是否为循环列表
            this.cyclic = (__runInitializers(this, __virtual_extraInitializers), __runInitializers(this, _cyclic_initializers, false));
            //缺省居中
            this.lackCenter = (__runInitializers(this, _cyclic_extraInitializers), __runInitializers(this, _lackCenter_initializers, false));
            //缺省可滑动
            this.lackSlide = (__runInitializers(this, _lackCenter_extraInitializers), __runInitializers(this, _lackSlide_initializers, false));
            //刷新频率
            this._updateRate = (__runInitializers(this, _lackSlide_extraInitializers), __runInitializers(this, __updateRate_initializers, 0));
            //分帧渲染（每帧渲染的Item数量（<=0时关闭分帧渲染））
            this.frameByFrameRenderNum = (__runInitializers(this, __updateRate_extraInitializers), __runInitializers(this, _frameByFrameRenderNum_initializers, 0));
            //渲染事件（渲染器）
            this.renderEvent = (__runInitializers(this, _frameByFrameRenderNum_extraInitializers), __runInitializers(this, _renderEvent_initializers, new cc_1.EventHandler()));
            //选择模式
            this.selectedMode = (__runInitializers(this, _renderEvent_extraInitializers), __runInitializers(this, _selectedMode_initializers, SelectedType.NONE));
            this.repeatEventSingle = (__runInitializers(this, _selectedMode_extraInitializers), __runInitializers(this, _repeatEventSingle_initializers, false));
            //触发选择事件
            this.selectedEvent = (__runInitializers(this, _repeatEventSingle_extraInitializers), __runInitializers(this, _selectedEvent_initializers, null
            //当前选择id
            )); //new EventHandler();
            //当前选择id
            this._selectedId = (__runInitializers(this, _selectedEvent_extraInitializers), -1);
            this._forceUpdate = false;
            this._updateDone = true;
            //列表数量
            this._numItems = __runInitializers(this, __numItems_initializers, 0);
            this._inited = (__runInitializers(this, __numItems_extraInitializers), false);
            this._needUpdateWidgetComponent = false;
            this._aniDelRuning = false;
            this._doneAfterUpdate = false;
            this.adhering = false;
            this._adheringBarrier = false;
            this.curPageNum = 0;
        }
        set slideMode(val) {
            this._slideMode = val;
        }
        get slideMode() {
            return this._slideMode;
        }
        set virtual(val) {
            if (val != null)
                this._virtual = val;
            if (!CC_DEV && this._numItems != 0) {
                this._onScrolling();
            }
        }
        get virtual() {
            return this._virtual;
        }
        set updateRate(val) {
            if (val >= 0 && val <= 6) {
                this._updateRate = val;
            }
        }
        get updateRate() {
            return this._updateRate;
        }
        set selectedId(val) {
            let t = this;
            let item;
            switch (t.selectedMode) {
                case SelectedType.SINGLE: {
                    if (!t.repeatEventSingle && val == t._selectedId)
                        return;
                    item = t.getItemByListId(val);
                    // if (!item && val >= 0)
                    //     return;
                    let listItem;
                    if (t._selectedId >= 0)
                        t._lastSelectedId = t._selectedId;
                    else //如果＜0则取消选择，把_lastSelectedId也置空吧，如果以后有特殊需求再改吧。
                        t._lastSelectedId = null;
                    t._selectedId = val;
                    if (item) {
                        listItem = item.getComponent(ListItem_1.default);
                        listItem.selected = true;
                    }
                    if (t._lastSelectedId >= 0 && t._lastSelectedId != t._selectedId) {
                        let lastItem = t.getItemByListId(t._lastSelectedId);
                        if (lastItem) {
                            lastItem.getComponent(ListItem_1.default).selected = false;
                        }
                    }
                    if (t.selectedEvent) {
                        cc_1.EventHandler.emitEvents([t.selectedEvent], item, t._lastSelectedId == null ? null : (t._lastSelectedId % this._actualNumItems));
                    }
                    break;
                }
                case SelectedType.MULT: {
                    item = t.getItemByListId(val);
                    if (!item)
                        return;
                    let listItem = item.getComponent(ListItem_1.default);
                    if (t._selectedId >= 0)
                        t._lastSelectedId = t._selectedId;
                    t._selectedId = val;
                    let bool = !listItem.selected;
                    listItem.selected = bool;
                    let sub = t.multSelected.indexOf(val);
                    if (bool && sub < 0) {
                        t.multSelected.push(val);
                    }
                    else if (!bool && sub >= 0) {
                        t.multSelected.splice(sub, 1);
                    }
                    if (t.selectedEvent) {
                        cc_1.EventHandler.emitEvents([t.selectedEvent], item, t._lastSelectedId == null ? null : (t._lastSelectedId % this._actualNumItems), bool);
                    }
                    break;
                }
            }
        }
        get selectedId() {
            return this._selectedId;
        }
        set numItems(val) {
            let t = this;
            if (!t.checkInited(false))
                return;
            if (val == null || val < 0) {
                cc.error('numItems set the wrong::', val);
                return;
            }
            t._actualNumItems = t._numItems = val;
            t._forceUpdate = true;
            if (t._virtual) {
                t._resizeContent();
                if (t.cyclic) {
                    t._numItems = t._cyclicNum * t._numItems;
                }
                t._onScrolling();
                if (!t.frameByFrameRenderNum && t.slideMode == SlideType.PAGE)
                    t.curPageNum = t.nearestListId;
            }
            else {
                let layout = t.content.getComponent(cc_1.LayoutComponent);
                if (layout) {
                    layout.enabled = true;
                }
                t._delRedundantItem();
                t.firstListId = 0;
                if (t.frameByFrameRenderNum > 0) {
                    //先渲染几个出来
                    let len = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum;
                    for (let n = 0; n < len; n++) {
                        t._createOrUpdateItem2(n);
                    }
                    if (t.frameByFrameRenderNum < t._numItems) {
                        t._updateCounter = t.frameByFrameRenderNum;
                        t._updateDone = false;
                    }
                }
                else {
                    for (let n = 0; n < val; n++) {
                        t._createOrUpdateItem2(n);
                    }
                    t.displayItemNum = val;
                }
            }
        }
        get numItems() {
            return this._actualNumItems;
        }
        get ScrollViewComponent() {
            return this._ScrollViewComponent;
        }
        //----------------------------------------------------------------------------
        onLoad() {
            this._init();
        }
        onDestroy() {
            if (this._itemTmp && this._itemTmp.isValid)
                this._itemTmp.destroy();
            // let total = this._pool.size();
            while (this._pool.size()) {
                let node = this._pool.get();
                node.destroy();
            }
            // if (total)
            //     cc.log('-----------------' + this.node.name + '<List> destroy node total num. =>', total);
        }
        onEnable() {
            // if (!CC_EDITOR) 
            this._registerEvent();
            this._init();
        }
        onDisable() {
            // if (!CC_EDITOR) 
            this._unregisterEvent();
        }
        //注册事件
        _registerEvent() {
            let t = this;
            t.node.on(cc_1.Node.EventType.TOUCH_START, t._onTouchStart, t, true);
            t.node.on('touch-up', t._onTouchUp, t);
            t.node.on(cc_1.Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t, true);
            t.node.on('scroll-began', t._onScrollBegan, t, true);
            t.node.on('scroll-ended', t._onScrollEnded, t, true);
            t.node.on('scrolling', t._onScrolling, t, true);
            t.node.on(cc_1.Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
        }
        //卸载事件
        _unregisterEvent() {
            let t = this;
            t.node.off(cc_1.Node.EventType.TOUCH_START, t._onTouchStart, t, true);
            t.node.off('touch-up', t._onTouchUp, t);
            t.node.off(cc_1.Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t, true);
            t.node.off('scroll-began', t._onScrollBegan, t, true);
            t.node.off('scroll-ended', t._onScrollEnded, t, true);
            t.node.off('scrolling', t._onScrolling, t, true);
            t.node.off(cc_1.Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
        }
        //初始化各种..
        _init() {
            let t = this;
            if (t._inited)
                return;
            t._ScrollViewComponent = t.node.getComponent(cc_1.ScrollViewComponent);
            t.content = t._ScrollViewComponent.content;
            if (!t.content) {
                cc.error(t.node.name + "'s cc.ScrollViewComponent unset content!");
                return;
            }
            t._layout = t.content.getComponent(cc_1.LayoutComponent);
            t._align = t._layout.type; //排列模式
            t._resizeMode = t._layout.resizeMode; //自适应模式
            t._startAxis = t._layout.startAxis;
            t._topGap = t._layout.paddingTop; //顶边距
            t._rightGap = t._layout.paddingRight; //右边距
            t._bottomGap = t._layout.paddingBottom; //底边距
            t._leftGap = t._layout.paddingLeft; //左边距
            t._columnGap = t._layout.spacingX; //列距
            t._lineGap = t._layout.spacingY; //行距
            t._colLineNum; //列数或行数（非GRID模式则=1，表示单列或单行）;
            t._verticalDir = t._layout.verticalDirection; //垂直排列子节点的方向
            t._horizontalDir = t._layout.horizontalDirection; //水平排列子节点的方向
            t.setTemplateItem((0, cc_1.instantiate)(t.templateType == TemplateType.PREFAB ? t.tmpPrefab : t.tmpNode));
            // 特定的滑动模式处理
            if (t._slideMode == SlideType.ADHERING || t._slideMode == SlideType.PAGE) {
                t._ScrollViewComponent.inertia = false;
                t._ScrollViewComponent._onMouseWheel = function () {
                    return;
                };
            }
            if (!t.virtual) // lackCenter 仅支持 Virtual 模式
                t.lackCenter = false;
            t._lastDisplayData = []; //最后一次刷新的数据
            t.displayData = []; //当前数据
            t._pool = new cc_1.NodePool(); //这是个池子..
            t._forceUpdate = false; //是否强制更新
            t._updateCounter = 0; //当前分帧渲染帧数
            t._updateDone = true; //分帧渲染是否完成
            t.curPageNum = 0; //当前页数
            if (t.cyclic || 0) {
                t._ScrollViewComponent._processAutoScrolling = this._processAutoScrolling.bind(t);
                t._ScrollViewComponent._startBounceBackIfNeeded = function () {
                    return false;
                };
                // t._ScrollViewComponent._scrollChildren = function () {
                //     return false;
                // }
            }
            switch (t._align) {
                case cc_1.LayoutComponent.Type.HORIZONTAL: {
                    switch (t._horizontalDir) {
                        case cc_1.LayoutComponent.HorizontalDirection.LEFT_TO_RIGHT:
                            t._alignCalcType = 1;
                            break;
                        case cc_1.LayoutComponent.HorizontalDirection.RIGHT_TO_LEFT:
                            t._alignCalcType = 2;
                            break;
                    }
                    break;
                }
                case cc_1.LayoutComponent.Type.VERTICAL: {
                    switch (t._verticalDir) {
                        case cc_1.LayoutComponent.VerticalDirection.TOP_TO_BOTTOM:
                            t._alignCalcType = 3;
                            break;
                        case cc_1.LayoutComponent.VerticalDirection.BOTTOM_TO_TOP:
                            t._alignCalcType = 4;
                            break;
                    }
                    break;
                }
                case cc_1.LayoutComponent.Type.GRID: {
                    switch (t._startAxis) {
                        case cc_1.LayoutComponent.AxisDirection.HORIZONTAL:
                            switch (t._verticalDir) {
                                case cc_1.LayoutComponent.VerticalDirection.TOP_TO_BOTTOM:
                                    t._alignCalcType = 3;
                                    break;
                                case cc_1.LayoutComponent.VerticalDirection.BOTTOM_TO_TOP:
                                    t._alignCalcType = 4;
                                    break;
                            }
                            break;
                        case cc_1.LayoutComponent.AxisDirection.VERTICAL:
                            switch (t._horizontalDir) {
                                case cc_1.LayoutComponent.HorizontalDirection.LEFT_TO_RIGHT:
                                    t._alignCalcType = 1;
                                    break;
                                case cc_1.LayoutComponent.HorizontalDirection.RIGHT_TO_LEFT:
                                    t._alignCalcType = 2;
                                    break;
                            }
                            break;
                    }
                    break;
                }
            }
            // 清空 content
            t.content.children.forEach((child) => {
                child.removeFromParent();
                if (child != t.tmpNode && child.isValid)
                    child.destroy();
            });
            t._inited = true;
        }
        /**
         * 为了实现循环列表，必须覆写cc.ScrollViewComponent的某些函数
         * @param {Number} dt
         */
        _processAutoScrolling(dt) {
            // let isAutoScrollBrake = this._ScrollViewComponent._isNecessaryAutoScrollBrake();
            let brakingFactor = 1;
            this._ScrollViewComponent['_autoScrollAccumulatedTime'] += dt * (1 / brakingFactor);
            let percentage = Math.min(1, this._ScrollViewComponent['_autoScrollAccumulatedTime'] / this._ScrollViewComponent['_autoScrollTotalTime']);
            if (this._ScrollViewComponent['_autoScrollAttenuate']) {
                let time = percentage - 1;
                percentage = time * time * time * time * time + 1;
            }
            let newPosition = this._ScrollViewComponent['_autoScrollStartPosition'].clone().add(this._ScrollViewComponent['_autoScrollTargetDelta'].multiplyScalar(percentage));
            let EPSILON = this._ScrollViewComponent['getScrollEndedEventTiming']();
            let reachedEnd = Math.abs(percentage - 1) <= EPSILON;
            // cc.log(reachedEnd, Math.abs(percentage - 1), EPSILON)
            let fireEvent = Math.abs(percentage - 1) <= this._ScrollViewComponent['getScrollEndedEventTiming']();
            if (fireEvent && !this._ScrollViewComponent['_isScrollEndedWithThresholdEventFired']) {
                this._ScrollViewComponent['_dispatchEvent']('scroll-ended-with-threshold');
                this._ScrollViewComponent['_isScrollEndedWithThresholdEventFired'] = true;
            }
            // if (this._ScrollViewComponent.elastic && !reachedEnd) {
            //     let brakeOffsetPosition = newPosition.sub(this._ScrollViewComponent._autoScrollBrakingStartPosition);
            //     if (isAutoScrollBrake) {
            //         brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
            //     }
            //     newPosition = this._ScrollViewComponent._autoScrollBrakingStartPosition.add(brakeOffsetPosition);
            // } else {
            //     let moveDelta = newPosition.sub(this._ScrollViewComponent.getContentPosition());
            //     let outOfBoundary = this._ScrollViewComponent._getHowMuchOutOfBoundary(moveDelta);
            //     if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            //         newPosition = newPosition.add(outOfBoundary);
            //         reachedEnd = true;
            //     }
            // }
            if (reachedEnd) {
                this._ScrollViewComponent['_autoScrolling'] = false;
            }
            let deltaMove = newPosition.subtract(this._ScrollViewComponent.getContentPosition());
            // cc.log(deltaMove)
            this._ScrollViewComponent['_moveContent'](this._ScrollViewComponent['_clampDelta'](deltaMove), reachedEnd);
            this._ScrollViewComponent['_dispatchEvent']('scrolling');
            // scollTo API controll move
            if (!this._ScrollViewComponent['_autoScrolling']) {
                this._ScrollViewComponent['_isBouncing'] = false;
                this._ScrollViewComponent['_scrolling'] = false;
                this._ScrollViewComponent['_dispatchEvent']('scroll-ended');
            }
        }
        //设置模板Item
        setTemplateItem(item) {
            if (!item)
                return;
            let t = this;
            t._itemTmp = item;
            if (t._resizeMode == cc_1.LayoutComponent.ResizeMode.CHILDREN)
                t._itemSize = t._layout.cellSize;
            else
                t._itemSize = cc.size(item.width, item.height);
            //获取ListItem，如果没有就取消选择模式
            let com = item.getComponent(ListItem_1.default);
            let remove = false;
            if (!com)
                remove = true;
            if (com) {
                if (!com._btnCom && !item.getComponent(cc_1.ButtonComponent)) {
                    remove = true;
                }
            }
            if (remove) {
                t.selectedMode = SelectedType.NONE;
            }
            com = item.getComponent(cc_1.WidgetComponent);
            if (com && com.enabled) {
                t._needUpdateWidgetComponent = true;
            }
            if (t.selectedMode == SelectedType.MULT)
                t.multSelected = [];
            switch (t._align) {
                case cc_1.LayoutComponent.Type.HORIZONTAL:
                    t._colLineNum = 1;
                    t._sizeType = false;
                    break;
                case cc_1.LayoutComponent.Type.VERTICAL:
                    t._colLineNum = 1;
                    t._sizeType = true;
                    break;
                case cc_1.LayoutComponent.Type.GRID:
                    switch (t._startAxis) {
                        case cc_1.LayoutComponent.AxisDirection.HORIZONTAL:
                            //计算列数
                            let trimW = t.content.width - t._leftGap - t._rightGap;
                            t._colLineNum = Math.floor((trimW + t._columnGap) / (t._itemSize.width + t._columnGap));
                            t._sizeType = true;
                            break;
                        case cc_1.LayoutComponent.AxisDirection.VERTICAL:
                            //计算行数
                            let trimH = t.content.height - t._topGap - t._bottomGap;
                            t._colLineNum = Math.floor((trimH + t._lineGap) / (t._itemSize.height + t._lineGap));
                            t._sizeType = false;
                            break;
                    }
                    break;
            }
        }
        /**
         * 检查是否初始化
         * @param {Boolean} printLog 是否打印错误信息
         * @returns
         */
        checkInited(printLog = true) {
            if (!this._inited) {
                if (printLog)
                    cc.error('List initialization not completed!');
                return false;
            }
            return true;
        }
        //禁用 Layout 组件，自行计算 Content Size
        _resizeContent() {
            let t = this;
            let result;
            switch (t._align) {
                case cc_1.LayoutComponent.Type.HORIZONTAL: {
                    if (t._customSize) {
                        let fixed = t._getFixedSize(null);
                        result = t._leftGap + fixed.val + (t._itemSize.width * (t._numItems - fixed.count)) + (t._columnGap * (t._numItems - 1)) + t._rightGap;
                    }
                    else {
                        result = t._leftGap + (t._itemSize.width * t._numItems) + (t._columnGap * (t._numItems - 1)) + t._rightGap;
                    }
                    break;
                }
                case cc_1.LayoutComponent.Type.VERTICAL: {
                    if (t._customSize) {
                        let fixed = t._getFixedSize(null);
                        result = t._topGap + fixed.val + (t._itemSize.height * (t._numItems - fixed.count)) + (t._lineGap * (t._numItems - 1)) + t._bottomGap;
                    }
                    else {
                        result = t._topGap + (t._itemSize.height * t._numItems) + (t._lineGap * (t._numItems - 1)) + t._bottomGap;
                    }
                    break;
                }
                case cc_1.LayoutComponent.Type.GRID: {
                    //网格模式不支持居中
                    if (t.lackCenter)
                        t.lackCenter = false;
                    switch (t._startAxis) {
                        case cc_1.LayoutComponent.AxisDirection.HORIZONTAL:
                            let lineNum = Math.ceil(t._numItems / t._colLineNum);
                            result = t._topGap + (t._itemSize.height * lineNum) + (t._lineGap * (lineNum - 1)) + t._bottomGap;
                            break;
                        case cc_1.LayoutComponent.AxisDirection.VERTICAL:
                            let colNum = Math.ceil(t._numItems / t._colLineNum);
                            result = t._leftGap + (t._itemSize.width * colNum) + (t._columnGap * (colNum - 1)) + t._rightGap;
                            break;
                    }
                    break;
                }
            }
            let layout = t.content.getComponent(cc_1.LayoutComponent);
            if (layout)
                layout.enabled = false;
            t._allItemSize = result;
            t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? (t._topGap + t._bottomGap) : (t._leftGap + t._rightGap));
            if (t.cyclic) {
                let totalSize = (t._sizeType ? t.node.height : t.node.width);
                t._cyclicPos1 = 0;
                totalSize -= t._cyclicPos1;
                t._cyclicNum = Math.ceil(totalSize / t._allItemSizeNoEdge) + 1;
                let spacing = t._sizeType ? t._lineGap : t._columnGap;
                t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + spacing;
                t._cyclicAllItemSize = t._allItemSize + (t._allItemSizeNoEdge * (t._cyclicNum - 1)) + (spacing * (t._cyclicNum - 1));
                t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
                t._cycilcAllItemSizeNoEdge += spacing * (t._cyclicNum - 1);
                // cc.log('_cyclicNum ->', t._cyclicNum, t._allItemSizeNoEdge, t._allItemSize, t._cyclicPos1, t._cyclicPos2);
            }
            t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t.node.height : t.node.width);
            let slideOffset = ((!t._lack || !t.lackCenter) && t.lackSlide) ? 0 : .1;
            let targetWH = t._lack ? ((t._sizeType ? t.node.height : t.node.width) - slideOffset) : (t.cyclic ? t._cyclicAllItemSize : t._allItemSize);
            if (targetWH < 0)
                targetWH = 0;
            if (t._sizeType) {
                t.content.height = targetWH;
            }
            else {
                t.content.width = targetWH;
            }
            // cc.log('_resizeContent()  numItems =', t._numItems, '，content =', t.content);
        }
        //滚动进行时...
        _onScrolling(ev = null) {
            if (this.frameCount == null)
                this.frameCount = this._updateRate;
            if (!this._forceUpdate && (ev && ev.type != 'scroll-ended') && this.frameCount > 0) {
                this.frameCount--;
                return;
            }
            else
                this.frameCount = this._updateRate;
            if (this._aniDelRuning)
                return;
            //循环列表处理
            if (this.cyclic) {
                let scrollPos = this.content.getPosition();
                scrollPos = this._sizeType ? scrollPos.y : scrollPos.x;
                let addVal = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
                let add = this._sizeType ? (0, cc_1.v3)(0, addVal, 0) : (0, cc_1.v3)(addVal, 0, 0);
                switch (this._alignCalcType) {
                    case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                        if (scrollPos > -this._cyclicPos1) {
                            // this.content.x = -this._cyclicPos2;
                            let o = this.content.position;
                            this.node.setPosition(o.x - this._cyclicPos2, o.y, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].subtract(add);
                            }
                            // if (this._beganPos) {
                            //     this._beganPos += add;
                            // }
                        }
                        else if (scrollPos < -this._cyclicPos2) {
                            let o = this.content.position;
                            this.node.setPosition(o.x - this._cyclicPos1, o.y, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].add(add);
                            }
                            // if (this._beganPos) {
                            //     this._beganPos -= add;
                            // }
                        }
                        break;
                    case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                        if (scrollPos < this._cyclicPos1) {
                            let o = this.content.position;
                            this.node.setPosition(this._cyclicPos2, o.y, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].add(add);
                            }
                        }
                        else if (scrollPos > this._cyclicPos2) {
                            let o = this.content.position;
                            this.node.setPosition(this._cyclicPos1, o.y, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].subtract(add);
                            }
                        }
                        break;
                    case 3: //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                        if (scrollPos < this._cyclicPos1) {
                            let o = this.content.position;
                            this.node.setPosition(o.x, this._cyclicPos2, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].add(add);
                            }
                        }
                        else if (scrollPos > this._cyclicPos2) {
                            let o = this.content.position;
                            this.node.setPosition(o.x, this._cyclicPos1, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].subtract(add);
                            }
                        }
                        break;
                    case 4: //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                        if (scrollPos > -this._cyclicPos1) {
                            let o = this.content.position;
                            this.node.setPosition(o.x, o.y - this._cyclicPos2, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].subtract(add);
                            }
                        }
                        else if (scrollPos < -this._cyclicPos2) {
                            let o = this.content.position;
                            this.node.setPosition(o.x, o.y - this._cyclicPos1, o.z);
                            if (this._ScrollViewComponent.isAutoScrolling()) {
                                this._ScrollViewComponent['_autoScrollStartPosition'] = this._ScrollViewComponent['_autoScrollStartPosition'].add(add);
                            }
                        }
                        break;
                }
            }
            this._calcViewPos();
            let vTop, vRight, vBottom, vLeft;
            if (this._sizeType) {
                vTop = this.viewTop;
                vBottom = this.viewBottom;
            }
            else {
                vRight = this.viewRight;
                vLeft = this.viewLeft;
            }
            if (this._virtual) {
                this.displayData = [];
                let itemPos;
                let curId = 0;
                let endId = this._numItems - 1;
                if (this._customSize) {
                    let breakFor = false;
                    //如果该item的位置在可视区域内，就推入displayData
                    for (; curId <= endId && !breakFor; curId++) {
                        itemPos = this._calcItemPos(curId);
                        switch (this._align) {
                            case cc_1.LayoutComponent.Type.HORIZONTAL:
                                if (itemPos.right >= vLeft && itemPos.left <= vRight) {
                                    this.displayData.push(itemPos);
                                }
                                else if (curId != 0 && this.displayData.length > 0) {
                                    breakFor = true;
                                }
                                break;
                            case cc_1.LayoutComponent.Type.VERTICAL:
                                if (itemPos.bottom <= vTop && itemPos.top >= vBottom) {
                                    this.displayData.push(itemPos);
                                }
                                else if (curId != 0 && this.displayData.length > 0) {
                                    breakFor = true;
                                }
                                break;
                            case cc_1.LayoutComponent.Type.GRID:
                                switch (this._startAxis) {
                                    case cc_1.LayoutComponent.AxisDirection.HORIZONTAL:
                                        if (itemPos.bottom <= vTop && itemPos.top >= vBottom) {
                                            this.displayData.push(itemPos);
                                        }
                                        else if (curId != 0 && this.displayData.length > 0) {
                                            breakFor = true;
                                        }
                                        break;
                                    case cc_1.LayoutComponent.AxisDirection.VERTICAL:
                                        if (itemPos.right >= vLeft && itemPos.left <= vRight) {
                                            this.displayData.push(itemPos);
                                        }
                                        else if (curId != 0 && this.displayData.length > 0) {
                                            breakFor = true;
                                        }
                                        break;
                                }
                                break;
                        }
                    }
                }
                else {
                    let ww = this._itemSize.width + this._columnGap;
                    let hh = this._itemSize.height + this._lineGap;
                    switch (this._alignCalcType) {
                        case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                            curId = (vLeft + this._leftGap) / ww;
                            endId = (vRight + this._rightGap) / ww;
                            break;
                        case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                            curId = (-vRight - this._rightGap) / ww;
                            endId = (-vLeft - this._leftGap) / ww;
                            break;
                        case 3: //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                            curId = (-vTop - this._topGap) / hh;
                            endId = (-vBottom - this._bottomGap) / hh;
                            break;
                        case 4: //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                            curId = (vBottom + this._bottomGap) / hh;
                            endId = (vTop + this._topGap) / hh;
                            break;
                    }
                    curId = Math.floor(curId) * this._colLineNum;
                    endId = Math.ceil(endId) * this._colLineNum;
                    endId--;
                    if (curId < 0)
                        curId = 0;
                    if (endId >= this._numItems)
                        endId = this._numItems - 1;
                    for (; curId <= endId; curId++) {
                        this.displayData.push(this._calcItemPos(curId));
                    }
                }
                if (this.displayData.length <= 0 || !this._numItems) { //if none, delete all.
                    this._lastDisplayData = [];
                    this._delRedundantItem();
                    return;
                }
                this.firstListId = this.displayData[0].id;
                this.displayItemNum = this.displayData.length;
                let len = this._lastDisplayData.length;
                //判断数据是否与当前相同，如果相同，return。
                //因List的显示数据是有序的，所以只需要判断数组长度是否相等，以及头、尾两个元素是否相等即可。
                if (this._forceUpdate ||
                    this.displayItemNum != len ||
                    this.firstListId != this._lastDisplayData[0] ||
                    this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[len - 1]) {
                    this._lastDisplayData = [];
                    if (this.frameByFrameRenderNum > 0) { //逐帧渲染
                        if (this._numItems > 0) {
                            if (!this._updateDone) {
                                this._doneAfterUpdate = true;
                            }
                            else {
                                this._updateCounter = 0;
                            }
                            this._updateDone = false;
                        }
                        else {
                            this._delRedundantItem();
                            this._updateCounter = 0;
                            this._updateDone = true;
                        }
                        // cc.log('List Display Data I::', this.displayData);
                    }
                    else { //直接渲染
                        // cc.log('List Display Data II::', this.displayData);
                        for (let c = 0; c < this.displayItemNum; c++) {
                            this._createOrUpdateItem(this.displayData[c]);
                        }
                        this._delRedundantItem();
                        this._forceUpdate = false;
                    }
                }
                this._calcNearestItem();
            }
        }
        //计算可视范围
        _calcViewPos() {
            let scrollPos = this.content.getPosition();
            switch (this._alignCalcType) {
                case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    this.elasticLeft = scrollPos.x > 0 ? scrollPos.x : 0;
                    this.viewLeft = (scrollPos.x < 0 ? -scrollPos.x : 0) - this.elasticLeft;
                    this.viewRight = this.viewLeft + this.node.width;
                    this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
                    this.viewRight += this.elasticRight;
                    // cc.log(this.elasticLeft, this.elasticRight, this.viewLeft, this.viewRight);
                    break;
                case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    this.elasticRight = scrollPos.x < 0 ? -scrollPos.x : 0;
                    this.viewRight = (scrollPos.x > 0 ? -scrollPos.x : 0) + this.elasticRight;
                    this.viewLeft = this.viewRight - this.node.width;
                    this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
                    this.viewLeft -= this.elasticLeft;
                    // cc.log(this.elasticLeft, this.elasticRight, this.viewLeft, this.viewRight);
                    break;
                case 3: //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    this.elasticTop = scrollPos.y < 0 ? Math.abs(scrollPos.y) : 0;
                    this.viewTop = (scrollPos.y > 0 ? -scrollPos.y : 0) + this.elasticTop;
                    this.viewBottom = this.viewTop - this.node.height;
                    this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
                    this.viewBottom += this.elasticBottom;
                    // cc.log(this.elasticTop, this.elasticBottom, this.viewTop, this.viewBottom);
                    break;
                case 4: //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    this.elasticBottom = scrollPos.y > 0 ? Math.abs(scrollPos.y) : 0;
                    this.viewBottom = (scrollPos.y < 0 ? -scrollPos.y : 0) - this.elasticBottom;
                    this.viewTop = this.viewBottom + this.node.height;
                    this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
                    this.viewTop -= this.elasticTop;
                    // cc.log(this.elasticTop, this.elasticBottom, this.viewTop, this.viewBottom);
                    break;
            }
        }
        //计算位置 根据id
        _calcItemPos(id) {
            let width, height, top, bottom, left, right, itemX, itemY;
            switch (this._align) {
                case cc_1.LayoutComponent.Type.HORIZONTAL:
                    switch (this._horizontalDir) {
                        case cc_1.LayoutComponent.HorizontalDirection.LEFT_TO_RIGHT: {
                            if (this._customSize) {
                                let fixed = this._getFixedSize(id);
                                left = this._leftGap + ((this._itemSize.width + this._columnGap) * (id - fixed.count)) + (fixed.val + (this._columnGap * fixed.count));
                                let cs = this._customSize[id];
                                width = (cs > 0 ? cs : this._itemSize.width);
                            }
                            else {
                                left = this._leftGap + ((this._itemSize.width + this._columnGap) * id);
                                width = this._itemSize.width;
                            }
                            right = left + width;
                            if (this.lackCenter) {
                                let offset = (this.content.width / 2) - (this._allItemSizeNoEdge / 2);
                                left += offset;
                                right += offset;
                            }
                            return {
                                id: id,
                                left: left,
                                right: right,
                                x: left + (this._itemTmp.anchorX * width),
                                y: this._itemTmp.position.y,
                            };
                        }
                        case cc_1.LayoutComponent.HorizontalDirection.RIGHT_TO_LEFT: {
                            if (this._customSize) {
                                let fixed = this._getFixedSize(id);
                                right = -this._rightGap - ((this._itemSize.width + this._columnGap) * (id - fixed.count)) - (fixed.val + (this._columnGap * fixed.count));
                                let cs = this._customSize[id];
                                width = (cs > 0 ? cs : this._itemSize.width);
                            }
                            else {
                                right = -this._rightGap - ((this._itemSize.width + this._columnGap) * id);
                                width = this._itemSize.width;
                            }
                            left = right - width;
                            if (this.lackCenter) {
                                let offset = (this.content.width / 2) - (this._allItemSizeNoEdge / 2);
                                left -= offset;
                                right -= offset;
                            }
                            return {
                                id: id,
                                right: right,
                                left: left,
                                x: left + (this._itemTmp.anchorX * width),
                                y: this._itemTmp.position.y,
                            };
                        }
                    }
                    break;
                case cc_1.LayoutComponent.Type.VERTICAL: {
                    switch (this._verticalDir) {
                        case cc_1.LayoutComponent.VerticalDirection.TOP_TO_BOTTOM: {
                            if (this._customSize) {
                                let fixed = this._getFixedSize(id);
                                top = -this._topGap - ((this._itemSize.height + this._lineGap) * (id - fixed.count)) - (fixed.val + (this._lineGap * fixed.count));
                                let cs = this._customSize[id];
                                height = (cs > 0 ? cs : this._itemSize.height);
                            }
                            else {
                                top = -this._topGap - ((this._itemSize.height + this._lineGap) * id);
                                height = this._itemSize.height;
                            }
                            bottom = top - height;
                            if (this.lackCenter) {
                                let offset = (this.content.height / 2) - (this._allItemSizeNoEdge / 2);
                                top -= offset;
                                bottom -= offset;
                            }
                            return {
                                id: id,
                                top: top,
                                bottom: bottom,
                                x: this._itemTmp.position.x,
                                y: bottom + (this._itemTmp.anchorY * height),
                            };
                        }
                        case cc_1.LayoutComponent.VerticalDirection.BOTTOM_TO_TOP: {
                            if (this._customSize) {
                                let fixed = this._getFixedSize(id);
                                bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * (id - fixed.count)) + (fixed.val + (this._lineGap * fixed.count));
                                let cs = this._customSize[id];
                                height = (cs > 0 ? cs : this._itemSize.height);
                            }
                            else {
                                bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * id);
                                height = this._itemSize.height;
                            }
                            top = bottom + height;
                            if (this.lackCenter) {
                                let offset = (this.content.height / 2) - (this._allItemSizeNoEdge / 2);
                                top += offset;
                                bottom += offset;
                            }
                            return {
                                id: id,
                                top: top,
                                bottom: bottom,
                                x: this._itemTmp.position.x,
                                y: bottom + (this._itemTmp.anchorY * height),
                            };
                            break;
                        }
                    }
                }
                case cc_1.LayoutComponent.Type.GRID: {
                    let colLine = Math.floor(id / this._colLineNum);
                    switch (this._startAxis) {
                        case cc_1.LayoutComponent.AxisDirection.HORIZONTAL: {
                            switch (this._verticalDir) {
                                case cc_1.LayoutComponent.VerticalDirection.TOP_TO_BOTTOM: {
                                    top = -this._topGap - ((this._itemSize.height + this._lineGap) * colLine);
                                    bottom = top - this._itemSize.height;
                                    itemY = bottom + (this._itemTmp.anchorY * this._itemSize.height);
                                    break;
                                }
                                case cc_1.LayoutComponent.VerticalDirection.BOTTOM_TO_TOP: {
                                    bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * colLine);
                                    top = bottom + this._itemSize.height;
                                    itemY = bottom + (this._itemTmp.anchorY * this._itemSize.height);
                                    break;
                                }
                            }
                            itemX = this._leftGap + ((id % this._colLineNum) * (this._itemSize.width + this._columnGap));
                            switch (this._horizontalDir) {
                                case cc_1.LayoutComponent.HorizontalDirection.LEFT_TO_RIGHT: {
                                    itemX += (this._itemTmp.anchorX * this._itemSize.width);
                                    itemX -= (this.content.anchorX * this.content.width);
                                    break;
                                }
                                case cc_1.LayoutComponent.HorizontalDirection.RIGHT_TO_LEFT: {
                                    itemX += ((1 - this._itemTmp.anchorX) * this._itemSize.width);
                                    itemX -= ((1 - this.content.anchorX) * this.content.width);
                                    itemX *= -1;
                                    break;
                                }
                            }
                            return {
                                id: id,
                                top: top,
                                bottom: bottom,
                                x: itemX,
                                y: itemY,
                            };
                        }
                        case cc_1.LayoutComponent.AxisDirection.VERTICAL: {
                            switch (this._horizontalDir) {
                                case cc_1.LayoutComponent.HorizontalDirection.LEFT_TO_RIGHT: {
                                    left = this._leftGap + ((this._itemSize.width + this._columnGap) * colLine);
                                    right = left + this._itemSize.width;
                                    itemX = left + (this._itemTmp.anchorX * this._itemSize.width);
                                    itemX -= (this.content.anchorX * this.content.width);
                                    break;
                                }
                                case cc_1.LayoutComponent.HorizontalDirection.RIGHT_TO_LEFT: {
                                    right = -this._rightGap - ((this._itemSize.width + this._columnGap) * colLine);
                                    left = right - this._itemSize.width;
                                    itemX = left + (this._itemTmp.anchorX * this._itemSize.width);
                                    itemX += ((1 - this.content.anchorX) * this.content.width);
                                    break;
                                }
                            }
                            itemY = -this._topGap - ((id % this._colLineNum) * (this._itemSize.height + this._lineGap));
                            switch (this._verticalDir) {
                                case cc_1.LayoutComponent.VerticalDirection.TOP_TO_BOTTOM: {
                                    itemY -= ((1 - this._itemTmp.anchorY) * this._itemSize.height);
                                    itemY += ((1 - this.content.anchorY) * this.content.height);
                                    break;
                                }
                                case cc_1.LayoutComponent.VerticalDirection.BOTTOM_TO_TOP: {
                                    itemY -= ((this._itemTmp.anchorY) * this._itemSize.height);
                                    itemY += (this.content.anchorY * this.content.height);
                                    itemY *= -1;
                                    break;
                                }
                            }
                            return {
                                id: id,
                                left: left,
                                right: right,
                                x: itemX,
                                y: itemY,
                            };
                        }
                    }
                    break;
                }
            }
        }
        //计算已存在的Item的位置
        _calcExistItemPos(id) {
            let item = this.getItemByListId(id);
            if (!item)
                return null;
            let data = {
                id: id,
                x: item.x,
                y: item.y,
            };
            if (this._sizeType) {
                data.top = item.y + (item.height * (1 - item.anchorY));
                data.bottom = item.y - (item.height * item.anchorY);
            }
            else {
                data.left = item.x - (item.width * item.anchorX);
                data.right = item.x + (item.width * (1 - item.anchorX));
            }
            return data;
        }
        //获取Item位置
        getItemPos(id) {
            if (this._virtual)
                return this._calcItemPos(id);
            else {
                if (this.frameByFrameRenderNum)
                    return this._calcItemPos(id);
                else
                    return this._calcExistItemPos(id);
            }
        }
        //获取固定尺寸
        _getFixedSize(listId) {
            if (!this._customSize)
                return null;
            if (listId == null)
                listId = this._numItems;
            let fixed = 0;
            let count = 0;
            for (let id in this._customSize) {
                if (parseInt(id) < listId) {
                    fixed += this._customSize[id];
                    count++;
                }
            }
            return {
                val: fixed,
                count: count,
            };
        }
        //滚动结束时..
        _onScrollBegan() {
            this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
        }
        //滚动结束时..
        _onScrollEnded() {
            let t = this;
            if (t.scrollToListId != null) {
                let item = t.getItemByListId(t.scrollToListId);
                t.scrollToListId = null;
                if (item) {
                    (0, cc_1.tween)(item).to(0.1, { scale: (0, cc_1.v3)(1.05, 1.05, 1.05) }).to(0.1, cc_1.Vec3.ONE).start();
                    // item.runAction(cc.sequence(
                    //     cc.scaleTo(.1, 1.06),
                    //     cc.scaleTo(.1, 1),
                    //     //new cc.callFunc(function (runNode) {
                    //     // })
                    // ));
                }
            }
            t._onScrolling();
            if (t._slideMode == SlideType.ADHERING &&
                !t.adhering) {
                //cc.log(t.adhering, t._ScrollViewComponent.isAutoScrolling(), t._ScrollViewComponent.isScrolling());
                t.adhere();
            }
            else if (t._slideMode == SlideType.PAGE) {
                if (t._beganPos != null) {
                    this._pageAdhere();
                }
                else {
                    t.adhere();
                }
            }
        }
        // 触摸时
        _onTouchStart(ev, captureListeners) {
            if (this._ScrollViewComponent['_hasNestedViewGroup'](ev, captureListeners))
                return;
            let isMe = ev.eventPhase === cc_1.Event.AT_TARGET && ev.target === this.node;
            if (!isMe) {
                let itemNode = ev.target;
                while (itemNode._listId == null && itemNode.parent)
                    itemNode = itemNode.parent;
                this._scrollItem = itemNode._listId != null ? itemNode : ev.target;
            }
        }
        //触摸抬起时..
        _onTouchUp() {
            let t = this;
            t._scrollPos = null;
            if (t._slideMode == SlideType.ADHERING) {
                if (this.adhering)
                    this._adheringBarrier = true;
                t.adhere();
            }
            else if (t._slideMode == SlideType.PAGE) {
                if (t._beganPos != null) {
                    this._pageAdhere();
                }
                else {
                    t.adhere();
                }
            }
            this._scrollItem = null;
        }
        _onTouchCancelled(ev, captureListeners) {
            let t = this;
            if (t._ScrollViewComponent['_hasNestedViewGroup'](ev, captureListeners) || ev.simulate)
                return;
            t._scrollPos = null;
            if (t._slideMode == SlideType.ADHERING) {
                if (t.adhering)
                    t._adheringBarrier = true;
                t.adhere();
            }
            else if (t._slideMode == SlideType.PAGE) {
                if (t._beganPos != null) {
                    t._pageAdhere();
                }
                else {
                    t.adhere();
                }
            }
            this._scrollItem = null;
        }
        //当尺寸改变
        _onSizeChanged() {
            if (this.checkInited(false))
                this._onScrolling();
        }
        //当Item自适应
        _onItemAdaptive(item) {
            if (this.checkInited(false)) {
                if ((!this._sizeType && item.width != this._itemSize.width)
                    || (this._sizeType && item.height != this._itemSize.height)) {
                    if (!this._customSize)
                        this._customSize = {};
                    let val = this._sizeType ? item.height : item.width;
                    if (this._customSize[item._listId] != val) {
                        this._customSize[item._listId] = val;
                        this._resizeContent();
                        this.content.children.forEach((child) => {
                            this._updateItemPos(child);
                        });
                        // 如果当前正在运行 scrollTo，肯定会不准确，在这里做修正
                        if (!isNaN(this._scrollToListId)) {
                            this._scrollPos = null;
                            this.unschedule(this._scrollToSo);
                            this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - ((new Date()).getTime() / 1000)));
                        }
                    }
                }
            }
        }
        //PAGE粘附
        _pageAdhere() {
            let t = this;
            if (!t.cyclic && (t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0))
                return;
            let curPos = t._sizeType ? t.viewTop : t.viewLeft;
            let dis = (t._sizeType ? t.node.height : t.node.width) * t.pageDistance;
            let canSkip = Math.abs(t._beganPos - curPos) > dis;
            if (canSkip) {
                let timeInSecond = .5;
                switch (t._alignCalcType) {
                    case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    case 4: //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                        if (t._beganPos > curPos) {
                            t.prePage(timeInSecond);
                            // cc.log('_pageAdhere   PPPPPPPPPPPPPPP');
                        }
                        else {
                            t.nextPage(timeInSecond);
                            // cc.log('_pageAdhere   NNNNNNNNNNNNNNN');
                        }
                        break;
                    case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    case 3: //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                        if (t._beganPos < curPos) {
                            t.prePage(timeInSecond);
                        }
                        else {
                            t.nextPage(timeInSecond);
                        }
                        break;
                }
            }
            else if (t.elasticTop <= 0 && t.elasticRight <= 0 && t.elasticBottom <= 0 && t.elasticLeft <= 0) {
                t.adhere();
            }
            t._beganPos = null;
        }
        //粘附
        adhere() {
            let t = this;
            if (!t.checkInited())
                return;
            if (t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0)
                return;
            t.adhering = true;
            t._calcNearestItem();
            let offset = (t._sizeType ? t._topGap : t._leftGap) / (t._sizeType ? t.node.height : t.node.width);
            let timeInSecond = .7;
            t.scrollTo(t.nearestListId, timeInSecond, offset);
        }
        //Update..
        update(dt) {
            if (this.frameByFrameRenderNum <= 0 || this._updateDone)
                return;
            // cc.log(this.displayData.length, this._updateCounter, this.displayData[this._updateCounter]);
            if (this._virtual) {
                let len = (this._updateCounter + this.frameByFrameRenderNum) > this.displayItemNum ? this.displayItemNum : (this._updateCounter + this.frameByFrameRenderNum);
                for (let n = this._updateCounter; n < len; n++) {
                    let data = this.displayData[n];
                    if (data)
                        this._createOrUpdateItem(data);
                }
                if (this._updateCounter >= this.displayItemNum - 1) { //最后一个
                    if (this._doneAfterUpdate) {
                        this._updateCounter = 0;
                        this._updateDone = false;
                        if (!this._ScrollViewComponent.isScrolling())
                            this._doneAfterUpdate = false;
                    }
                    else {
                        this._updateDone = true;
                        this._delRedundantItem();
                        this._forceUpdate = false;
                        this._calcNearestItem();
                        if (this.slideMode == SlideType.PAGE)
                            this.curPageNum = this.nearestListId;
                    }
                }
                else {
                    this._updateCounter += this.frameByFrameRenderNum;
                }
            }
            else {
                if (this._updateCounter < this._numItems) {
                    let len = (this._updateCounter + this.frameByFrameRenderNum) > this._numItems ? this._numItems : (this._updateCounter + this.frameByFrameRenderNum);
                    for (let n = this._updateCounter; n < len; n++) {
                        this._createOrUpdateItem2(n);
                    }
                    this._updateCounter += this.frameByFrameRenderNum;
                }
                else {
                    this._updateDone = true;
                    this._calcNearestItem();
                    if (this.slideMode == SlideType.PAGE)
                        this.curPageNum = this.nearestListId;
                }
            }
        }
        /**
         * 创建或更新Item（虚拟列表用）
         * @param {Object} data 数据
         */
        _createOrUpdateItem(data) {
            let item = this.getItemByListId(data.id);
            if (!item) { //如果不存在
                let canGet = this._pool.size() > 0;
                if (canGet) {
                    item = this._pool.get();
                    // cc.log('从池中取出::   旧id =', item['_listId'], '，新id =', data.id, item);
                }
                else {
                    item = cc.instantiate(this._itemTmp);
                    // cc.log('新建::', data.id, item);
                }
                if (item._listId != data.id) {
                    item._listId = data.id;
                    item.setContentSize(this._itemSize);
                }
                item.setPosition(data.x, data.y, 0);
                this._resetItemSize(item);
                this.content.addChild(item);
                if (canGet && this._needUpdateWidgetComponent) {
                    let widget = item.getComponent(cc_1.WidgetComponent);
                    if (widget)
                        widget.updateAlignment();
                }
                item.setSiblingIndex(this.content.children.length - 1);
                let listItem = item.getComponent(ListItem_1.default);
                item['listItem'] = listItem;
                if (listItem) {
                    listItem.listId = data.id;
                    listItem.list = this;
                    listItem._registerEvent();
                }
                if (this.renderEvent) {
                    cc_1.EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
                }
            }
            else if (this._forceUpdate && this.renderEvent) { //强制更新
                item.setPosition(data.x, data.y, 0);
                this._resetItemSize(item);
                // cc.log('ADD::', data.id, item);
                if (this.renderEvent) {
                    cc_1.EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
                }
            }
            this._resetItemSize(item);
            this._updateListItem(item['listItem']);
            if (this._lastDisplayData.indexOf(data.id) < 0) {
                this._lastDisplayData.push(data.id);
            }
        }
        //创建或更新Item（非虚拟列表用）
        _createOrUpdateItem2(listId) {
            let item = this.content.children[listId];
            let listItem;
            if (!item) { //如果不存在
                item = (0, cc_1.instantiate)(this._itemTmp);
                item._listId = listId;
                this.content.addChild(item);
                listItem = item.getComponent(ListItem_1.default);
                item['listItem'] = listItem;
                if (listItem) {
                    listItem.listId = listId;
                    listItem.list = this;
                    listItem._registerEvent();
                }
                if (this.renderEvent) {
                    cc_1.EventHandler.emitEvents([this.renderEvent], item, listId);
                }
            }
            else if (this._forceUpdate && this.renderEvent) { //强制更新
                item._listId = listId;
                if (listItem)
                    listItem.listId = listId;
                if (this.renderEvent) {
                    cc_1.EventHandler.emitEvents([this.renderEvent], item, listId);
                }
            }
            this._updateListItem(listItem);
            if (this._lastDisplayData.indexOf(listId) < 0) {
                this._lastDisplayData.push(listId);
            }
        }
        _updateListItem(listItem) {
            if (!listItem)
                return;
            if (this.selectedMode > SelectedType.NONE) {
                switch (this.selectedMode) {
                    case SelectedType.SINGLE:
                        listItem.selected = this.selectedId == listItem.node['_listId'];
                        break;
                    case SelectedType.MULT:
                        listItem.selected = this.multSelected.indexOf(listItem.node['_listId']) >= 0;
                        break;
                }
            }
        }
        //仅虚拟列表用
        _resetItemSize(item) {
            return;
            let size;
            if (this._customSize && this._customSize[item._listId]) {
                size = this._customSize[item._listId];
            }
            else {
                if (this._colLineNum > 1)
                    item.setContentSize(this._itemSize);
                else
                    size = this._sizeType ? this._itemSize.height : this._itemSize.width;
            }
            if (size) {
                if (this._sizeType)
                    item.height = size;
                else
                    item.width = size;
            }
        }
        /**
         * 更新Item位置
         * @param {Number||Node} listIdOrItem
         */
        _updateItemPos(listIdOrItem) {
            let item = isNaN(listIdOrItem) ? listIdOrItem : this.getItemByListId(listIdOrItem);
            let pos = this.getItemPos(item['_listId']);
            item.setPosition(pos.x, pos.y, pos.z);
        }
        /**
         * 设置多选
         * @param {Array} args 可以是单个listId，也可是个listId数组
         * @param {Boolean} bool 值，如果为null的话，则直接用args覆盖
         */
        setMultSelected(args, bool) {
            let t = this;
            if (!t.checkInited())
                return;
            if (!Array.isArray(args)) {
                args = [args];
            }
            if (bool == null) {
                t.multSelected = args;
            }
            else {
                let listId, sub;
                if (bool) {
                    for (let n = args.length - 1; n >= 0; n--) {
                        listId = args[n];
                        sub = t.multSelected.indexOf(listId);
                        if (sub < 0) {
                            t.multSelected.push(listId);
                        }
                    }
                }
                else {
                    for (let n = args.length - 1; n >= 0; n--) {
                        listId = args[n];
                        sub = t.multSelected.indexOf(listId);
                        if (sub >= 0) {
                            t.multSelected.splice(sub, 1);
                        }
                    }
                }
            }
            t._forceUpdate = true;
            t._onScrolling();
        }
        /**
         * 更新指定的Item
         * @param {Array} args 单个listId，或者数组
         * @returns
         */
        updateItem(args) {
            if (!this.checkInited())
                return;
            if (!Array.isArray(args)) {
                args = [args];
            }
            for (let n = 0, len = args.length; n < len; n++) {
                let listId = args[n];
                let item = this.getItemByListId(listId);
                if (item)
                    cc_1.EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems);
            }
        }
        /**
         * 更新全部
         */
        updateAll() {
            if (!this.checkInited())
                return;
            this.numItems = this.numItems;
        }
        /**
         * 根据ListID获取Item
         * @param {Number} listId
         * @returns
         */
        getItemByListId(listId) {
            for (let n = this.content.children.length - 1; n >= 0; n--) {
                if (this.content.children[n]['_listId'] == listId)
                    return this.content.children[n];
            }
        }
        /**
         * 获取在显示区域外的Item
         * @returns
         */
        _getOutsideItem() {
            let item, isOutside;
            let result = [];
            for (let n = this.content.children.length - 1; n >= 0; n--) {
                item = this.content.children[n];
                isOutside = true;
                if (isOutside) {
                    for (let c = this.displayItemNum - 1; c >= 0; c--) {
                        if (!this.displayData[c])
                            continue;
                        let listId = this.displayData[c].id;
                        if (item['_listId'] == listId) {
                            isOutside = false;
                            break;
                        }
                    }
                }
                if (isOutside) {
                    result.push(item);
                }
            }
            return result;
        }
        //删除显示区域以外的Item
        _delRedundantItem() {
            if (this._virtual) {
                let arr = this._getOutsideItem();
                for (let n = arr.length - 1; n >= 0; n--) {
                    let item = arr[n];
                    if (this._scrollItem && item['_listId'] == this._scrollItem['_listId'])
                        continue;
                    this._pool.put(item);
                }
                // cc.log('存入::', str, '    pool.length =', this._pool.length);
            }
            else {
                while (this.content.children.length > this._numItems) {
                    this._delSingleItem(this.content.children[this.content.children.length - 1]);
                }
            }
        }
        //删除单个Item
        _delSingleItem(item) {
            // cc.log('DEL::', item['_listId'], item);
            item.removeFromParent();
            if (item.destroy)
                item.destroy();
            item = null;
        }
        /**
         * 动效删除Item（此方法只适用于虚拟列表，即_virtual=true）
         * 一定要在回调函数里重新设置新的numItems进行刷新，毕竟本List是靠数据驱动的。
         */
        aniDelItem(listId, callFunc, aniType) {
            let t = this;
            if (!t.checkInited() || t.cyclic || !t._virtual)
                return cc.error('This function is not allowed to be called!');
            if (t._aniDelRuning)
                return cc.warn('Please wait for the current deletion to finish!');
            let item = t.getItemByListId(listId);
            let listItem;
            if (!item) {
                callFunc(listId);
                return;
            }
            else {
                listItem = item.getComponent(ListItem_1.default);
            }
            t._aniDelRuning = true;
            let curLastId = t.displayData[t.displayData.length - 1].id;
            let resetSelectedId = listItem.selected;
            listItem.showAni(aniType, () => {
                //判断有没有下一个，如果有的话，创建粗来
                let newId;
                if (curLastId < t._numItems - 2) {
                    newId = curLastId + 1;
                }
                if (newId != null) {
                    let newData = t._calcItemPos(newId);
                    t.displayData.push(newData);
                    if (t._virtual)
                        t._createOrUpdateItem(newData);
                    else
                        t._createOrUpdateItem2(newId);
                }
                else
                    t._numItems--;
                if (t.selectedMode == SelectedType.SINGLE) {
                    if (resetSelectedId) {
                        t._selectedId = -1;
                    }
                    else if (t._selectedId - 1 >= 0) {
                        t._selectedId--;
                    }
                }
                else if (t.selectedMode == SelectedType.MULT && t.multSelected.length) {
                    let sub = t.multSelected.indexOf(listId);
                    if (sub >= 0) {
                        t.multSelected.splice(sub, 1);
                    }
                    //多选的数据，在其后的全部减一
                    for (let n = t.multSelected.length - 1; n >= 0; n--) {
                        let id = t.multSelected[n];
                        if (id >= listId)
                            t.multSelected[n]--;
                    }
                }
                if (t._customSize) {
                    if (t._customSize[listId])
                        delete t._customSize[listId];
                    let newCustomSize = {};
                    let size;
                    for (let id in t._customSize) {
                        size = t._customSize[id];
                        let idNumber = parseInt(id);
                        newCustomSize[idNumber - (idNumber >= listId ? 1 : 0)] = size;
                    }
                    t._customSize = newCustomSize;
                }
                //后面的Item向前怼的动效
                let sec = .2333;
                let acts, haveCB;
                for (let n = newId != null ? newId : curLastId; n >= listId + 1; n--) {
                    item = t.getItemByListId(n);
                    if (item) {
                        let tweener = (0, cc_1.tween)(item);
                        let posData = t._calcItemPos(n - 1);
                        // acts = [
                        // cc.moveTo(sec, cc.v2(posData.x, posData.y)),
                        // ];
                        tweener.to(sec, { position: (0, cc_1.v3)(posData.x, posData.y, 0) });
                        if (n <= listId + 1) {
                            haveCB = true;
                            // acts.push(cc.callFunc(() => {
                            //     t._aniDelRuning = false;
                            //     callFunc(listId);
                            // }));
                            tweener.call(() => {
                                t._aniDelRuning = false;
                                callFunc(listId);
                            });
                        }
                        tweener.start();
                        // if (acts.length > 1)
                        //     // item.runAction(cc.sequence(acts))
                        // else
                        //     item.runAction(acts[0]);
                    }
                }
                if (!haveCB) {
                    t._aniDelRuning = false;
                    callFunc(listId);
                }
            }, true);
        }
        /**
         * 滚动到..
         * @param {Number} listId 索引（如果<0，则滚到首个Item位置，如果>=_numItems，则滚到最末Item位置）
         * @param {Number} timeInSecond 时间
         * @param {Number} offset 索引目标位置偏移，0-1
         * @param {Boolean} overStress 滚动后是否强调该Item（这只是个实验功能）
         */
        scrollTo(listId, timeInSecond = .5, offset = null, overStress = false) {
            let t = this;
            if (!t.checkInited(false))
                return;
            // t._ScrollViewComponent.stopAutoScroll();
            if (timeInSecond == null) //默认0.5
                timeInSecond = .5;
            else if (timeInSecond < 0)
                timeInSecond = 0;
            if (listId < 0)
                listId = 0;
            else if (listId >= t._numItems)
                listId = t._numItems - 1;
            // 以防设置了numItems之后layout的尺寸还未更新
            if (!t._virtual && t._layout && t._layout.enabled)
                t._layout.updateLayout();
            let pos = t.getItemPos(listId);
            let targetX, targetY;
            switch (t._alignCalcType) {
                case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    targetX = pos.left;
                    if (offset != null)
                        targetX -= t.node.width * offset;
                    else
                        targetX -= t._leftGap;
                    pos = (0, cc_1.v3)(targetX, 0, 0);
                    break;
                case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    targetX = pos.right - t.node.width;
                    if (offset != null)
                        targetX += t.node.width * offset;
                    else
                        targetX += t._rightGap;
                    pos = (0, cc_1.v3)(targetX + t.content.width, 0, 0);
                    break;
                case 3: //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    targetY = pos.top;
                    if (offset != null)
                        targetY += t.node.height * offset;
                    else
                        targetY += t._topGap;
                    pos = (0, cc_1.v3)(0, -targetY, 0);
                    break;
                case 4: //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    targetY = pos.bottom + t.node.height;
                    if (offset != null)
                        targetY -= t.node.height * offset;
                    else
                        targetY -= t._bottomGap;
                    pos = (0, cc_1.v3)(0, -targetY + t.content.height, 0);
                    break;
            }
            let viewPos = t.content.getPosition();
            viewPos = Math.abs(t._sizeType ? viewPos.y : viewPos.x);
            let comparePos = t._sizeType ? pos.y : pos.x;
            let runScroll = Math.abs((t._scrollPos != null ? t._scrollPos : viewPos) - comparePos) > .5;
            // cc.log(runScroll, t._scrollPos, viewPos, comparePos)
            // t._ScrollViewComponent.stopAutoScroll();
            if (runScroll) {
                t._ScrollViewComponent.scrollToOffset(pos, timeInSecond);
                t._scrollToListId = listId;
                t._scrollToEndTime = ((new Date()).getTime() / 1000) + timeInSecond;
                // cc.log(listId, t.content.width, t.content.getPosition(), pos);
                t._scrollToSo = t.scheduleOnce(() => {
                    if (!t._adheringBarrier) {
                        t.adhering = t._adheringBarrier = false;
                    }
                    t._scrollPos =
                        t._scrollToListId =
                            t._scrollToEndTime =
                                t._scrollToSo =
                                    null;
                    //cc.log('2222222222', t._adheringBarrier)
                    if (overStress) {
                        // t.scrollToListId = listId;
                        let item = t.getItemByListId(listId);
                        if (item) {
                            (0, cc_1.tween)(item).to(0.1, { scale: (0, cc_1.v3)(1.05, 1.05, 1.05) }).to(0.1, cc_1.Vec3.ONE).start();
                            // item.runAction(cc.sequence(
                            //     cc.scaleTo(.1, 1.05),
                            //     cc.scaleTo(.1, 1),
                            // ));
                        }
                    }
                }, timeInSecond + .1);
                if (timeInSecond <= 0) {
                    t._onScrolling();
                }
            }
        }
        /**
         * 计算当前滚动窗最近的Item
         */
        _calcNearestItem() {
            let t = this;
            t.nearestListId = null;
            let data, center;
            if (t._virtual)
                t._calcViewPos();
            let vTop, vRight, vBottom, vLeft;
            vTop = t.viewTop;
            vRight = t.viewRight;
            vBottom = t.viewBottom;
            vLeft = t.viewLeft;
            let breakFor = false;
            for (let n = 0; n < t.content.children.length && !breakFor; n += t._colLineNum) {
                data = t._virtual ? t.displayData[n] : t._calcExistItemPos(n);
                center = t._sizeType ? ((data.top + data.bottom) / 2) : (center = (data.left + data.right) / 2);
                switch (t._alignCalcType) {
                    case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                        if (data.right >= vLeft) {
                            t.nearestListId = data.id;
                            if (vLeft > center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                    case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                        if (data.left <= vRight) {
                            t.nearestListId = data.id;
                            if (vRight < center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                    case 3: //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                        if (data.bottom <= vTop) {
                            t.nearestListId = data.id;
                            if (vTop < center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                    case 4: //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                        if (data.top >= vBottom) {
                            t.nearestListId = data.id;
                            if (vBottom > center)
                                t.nearestListId += t._colLineNum;
                            breakFor = true;
                        }
                        break;
                }
            }
            //判断最后一个Item。。。（哎，这些判断真心恶心，判断了前面的还要判断最后一个。。。一开始呢，就只有一个布局（单列布局），那时候代码才三百行，后来就想着完善啊，艹..这坑真深，现在这行数都一千五了= =||）
            data = t._virtual ? t.displayData[t.displayItemNum - 1] : t._calcExistItemPos(t._numItems - 1);
            if (data && data.id == t._numItems - 1) {
                center = t._sizeType ? ((data.top + data.bottom) / 2) : (center = (data.left + data.right) / 2);
                switch (t._alignCalcType) {
                    case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                        if (vRight > center)
                            t.nearestListId = data.id;
                        break;
                    case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                        if (vLeft < center)
                            t.nearestListId = data.id;
                        break;
                    case 3: //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                        if (vBottom < center)
                            t.nearestListId = data.id;
                        break;
                    case 4: //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                        if (vTop > center)
                            t.nearestListId = data.id;
                        break;
                }
            }
            // cc.log('t.nearestListId =', t.nearestListId);
        }
        //上一页
        prePage(timeInSecond = .5) {
            // cc.log('👈');
            if (!this.checkInited())
                return;
            this.skipPage(this.curPageNum - 1, timeInSecond);
        }
        //下一页
        nextPage(timeInSecond = .5) {
            // cc.log('👉');
            if (!this.checkInited())
                return;
            this.skipPage(this.curPageNum + 1, timeInSecond);
        }
        //跳转到第几页
        skipPage(pageNum, timeInSecond) {
            let t = this;
            if (!t.checkInited())
                return;
            if (t._slideMode != SlideType.PAGE)
                return cc.error('This function is not allowed to be called, Must SlideMode = PAGE!');
            if (pageNum < 0 || pageNum >= t._numItems)
                return;
            if (t.curPageNum == pageNum)
                return;
            // cc.log(pageNum);
            t.curPageNum = pageNum;
            if (t.pageChangeEvent) {
                cc_1.EventHandler.emitEvents([t.pageChangeEvent], pageNum);
            }
            t.scrollTo(pageNum, timeInSecond);
        }
        //计算 CustomSize（这个函数还是保留吧，某些罕见的情况的确还是需要手动计算customSize的）
        calcCustomSize(numItems) {
            let t = this;
            if (!t.checkInited())
                return;
            if (!t._itemTmp)
                return cc.error('Unset template item!');
            if (!t.renderEvent)
                return cc.error('Unset Render-Event!');
            t._customSize = {};
            let temp = (0, cc_1.instantiate)(t._itemTmp);
            t.content.addChild(temp);
            for (let n = 0; n < numItems; n++) {
                cc_1.EventHandler.emitEvents([t.renderEvent], temp, n);
                if (temp.height != t._itemSize.height || temp.width != t._itemSize.width) {
                    t._customSize[n] = t._sizeType ? temp.height : temp.width;
                }
            }
            if (!Object.keys(t._customSize).length)
                t._customSize = null;
            temp.removeFromParent();
            if (temp.destroy)
                temp.destroy();
            return t._customSize;
        }
    };
    __setFunctionName(_classThis, "List");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _templateType_decorators = [property({ type: (0, cc_1.Enum)(TemplateType), tooltip: CC_DEV && '模板类型', })];
        _tmpNode_decorators = [property({
                type: cc_1.Node,
                tooltip: CC_DEV && '模板Item',
                visible() { return this.templateType == TemplateType.NODE; }
            })];
        _tmpPrefab_decorators = [property({
                type: cc_1.Prefab,
                tooltip: CC_DEV && '模板Item',
                visible() { return this.templateType == TemplateType.PREFAB; }
            })];
        __slideMode_decorators = [property()];
        _set_slideMode_decorators = [property({
                type: (0, cc_1.Enum)(SlideType),
                tooltip: CC_DEV && '滑动模式'
            })];
        _pageDistance_decorators = [property({
                type: cc.Float,
                range: [0, 1, .1],
                tooltip: CC_DEV && '翻页作用距离',
                slide: true,
                visible() { return this._slideMode == SlideType.PAGE; }
            })];
        _pageChangeEvent_decorators = [property({
                type: cc_1.EventHandler,
                tooltip: CC_DEV && '页面改变事件',
                visible() { return this._slideMode == SlideType.PAGE; }
            })];
        __virtual_decorators = [property()];
        _set_virtual_decorators = [property({
                type: cc.Boolean,
                tooltip: CC_DEV && '是否为虚拟列表（动态列表）'
            })];
        _cyclic_decorators = [property({
                tooltip: CC_DEV && '是否为循环列表',
                visible() {
                    let val = this.virtual && this.slideMode == SlideType.NORMAL;
                    if (!val)
                        this.cyclic = false;
                    return val;
                }
            })];
        _lackCenter_decorators = [property({
                tooltip: CC_DEV && 'Item数量不足以填满Content时，是否居中显示Item（不支持Grid布局）',
                visible() { return this.virtual; }
            })];
        _lackSlide_decorators = [property({
                tooltip: CC_DEV && 'Item数量不足以填满Content时，是否可滑动',
                visible() {
                    let val = this.virtual && !this.lackCenter;
                    if (!val)
                        this.lackSlide = false;
                    return val;
                }
            })];
        __updateRate_decorators = [property({ type: cc.Integer })];
        _set_updateRate_decorators = [property({
                type: cc.Integer,
                range: [0, 6, 1],
                tooltip: CC_DEV && '刷新频率（值越大刷新频率越低、性能越高）',
                slide: true,
            })];
        _frameByFrameRenderNum_decorators = [property({
                type: cc.Integer,
                range: [0, 12, 1],
                tooltip: CC_DEV && '逐帧渲染时，每帧渲染的Item数量（<=0时关闭分帧渲染）',
                slide: true,
            })];
        _renderEvent_decorators = [property({
                type: cc_1.EventHandler,
                tooltip: CC_DEV && '渲染事件（渲染器）',
            })];
        _selectedMode_decorators = [property({
                type: cc.Enum(SelectedType),
                tooltip: CC_DEV && '选择模式'
            })];
        _repeatEventSingle_decorators = [property({
                tooltip: CC_DEV && '是否重复响应单选事件',
                visible() { return this.selectedMode == SelectedType.SINGLE; }
            })];
        _selectedEvent_decorators = [property({
                type: cc_1.EventHandler,
                tooltip: CC_DEV && '触发选择事件',
                visible() { return this.selectedMode > SelectedType.NONE; }
            })];
        __numItems_decorators = [property({
                serializable: false
            })];
        __esDecorate(_classThis, null, _set_slideMode_decorators, { kind: "setter", name: "slideMode", static: false, private: false, access: { has: obj => "slideMode" in obj, set: (obj, value) => { obj.slideMode = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _set_virtual_decorators, { kind: "setter", name: "virtual", static: false, private: false, access: { has: obj => "virtual" in obj, set: (obj, value) => { obj.virtual = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _set_updateRate_decorators, { kind: "setter", name: "updateRate", static: false, private: false, access: { has: obj => "updateRate" in obj, set: (obj, value) => { obj.updateRate = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _templateType_decorators, { kind: "field", name: "templateType", static: false, private: false, access: { has: obj => "templateType" in obj, get: obj => obj.templateType, set: (obj, value) => { obj.templateType = value; } }, metadata: _metadata }, _templateType_initializers, _templateType_extraInitializers);
        __esDecorate(null, null, _tmpNode_decorators, { kind: "field", name: "tmpNode", static: false, private: false, access: { has: obj => "tmpNode" in obj, get: obj => obj.tmpNode, set: (obj, value) => { obj.tmpNode = value; } }, metadata: _metadata }, _tmpNode_initializers, _tmpNode_extraInitializers);
        __esDecorate(null, null, _tmpPrefab_decorators, { kind: "field", name: "tmpPrefab", static: false, private: false, access: { has: obj => "tmpPrefab" in obj, get: obj => obj.tmpPrefab, set: (obj, value) => { obj.tmpPrefab = value; } }, metadata: _metadata }, _tmpPrefab_initializers, _tmpPrefab_extraInitializers);
        __esDecorate(null, null, __slideMode_decorators, { kind: "field", name: "_slideMode", static: false, private: false, access: { has: obj => "_slideMode" in obj, get: obj => obj._slideMode, set: (obj, value) => { obj._slideMode = value; } }, metadata: _metadata }, __slideMode_initializers, __slideMode_extraInitializers);
        __esDecorate(null, null, _pageDistance_decorators, { kind: "field", name: "pageDistance", static: false, private: false, access: { has: obj => "pageDistance" in obj, get: obj => obj.pageDistance, set: (obj, value) => { obj.pageDistance = value; } }, metadata: _metadata }, _pageDistance_initializers, _pageDistance_extraInitializers);
        __esDecorate(null, null, _pageChangeEvent_decorators, { kind: "field", name: "pageChangeEvent", static: false, private: false, access: { has: obj => "pageChangeEvent" in obj, get: obj => obj.pageChangeEvent, set: (obj, value) => { obj.pageChangeEvent = value; } }, metadata: _metadata }, _pageChangeEvent_initializers, _pageChangeEvent_extraInitializers);
        __esDecorate(null, null, __virtual_decorators, { kind: "field", name: "_virtual", static: false, private: false, access: { has: obj => "_virtual" in obj, get: obj => obj._virtual, set: (obj, value) => { obj._virtual = value; } }, metadata: _metadata }, __virtual_initializers, __virtual_extraInitializers);
        __esDecorate(null, null, _cyclic_decorators, { kind: "field", name: "cyclic", static: false, private: false, access: { has: obj => "cyclic" in obj, get: obj => obj.cyclic, set: (obj, value) => { obj.cyclic = value; } }, metadata: _metadata }, _cyclic_initializers, _cyclic_extraInitializers);
        __esDecorate(null, null, _lackCenter_decorators, { kind: "field", name: "lackCenter", static: false, private: false, access: { has: obj => "lackCenter" in obj, get: obj => obj.lackCenter, set: (obj, value) => { obj.lackCenter = value; } }, metadata: _metadata }, _lackCenter_initializers, _lackCenter_extraInitializers);
        __esDecorate(null, null, _lackSlide_decorators, { kind: "field", name: "lackSlide", static: false, private: false, access: { has: obj => "lackSlide" in obj, get: obj => obj.lackSlide, set: (obj, value) => { obj.lackSlide = value; } }, metadata: _metadata }, _lackSlide_initializers, _lackSlide_extraInitializers);
        __esDecorate(null, null, __updateRate_decorators, { kind: "field", name: "_updateRate", static: false, private: false, access: { has: obj => "_updateRate" in obj, get: obj => obj._updateRate, set: (obj, value) => { obj._updateRate = value; } }, metadata: _metadata }, __updateRate_initializers, __updateRate_extraInitializers);
        __esDecorate(null, null, _frameByFrameRenderNum_decorators, { kind: "field", name: "frameByFrameRenderNum", static: false, private: false, access: { has: obj => "frameByFrameRenderNum" in obj, get: obj => obj.frameByFrameRenderNum, set: (obj, value) => { obj.frameByFrameRenderNum = value; } }, metadata: _metadata }, _frameByFrameRenderNum_initializers, _frameByFrameRenderNum_extraInitializers);
        __esDecorate(null, null, _renderEvent_decorators, { kind: "field", name: "renderEvent", static: false, private: false, access: { has: obj => "renderEvent" in obj, get: obj => obj.renderEvent, set: (obj, value) => { obj.renderEvent = value; } }, metadata: _metadata }, _renderEvent_initializers, _renderEvent_extraInitializers);
        __esDecorate(null, null, _selectedMode_decorators, { kind: "field", name: "selectedMode", static: false, private: false, access: { has: obj => "selectedMode" in obj, get: obj => obj.selectedMode, set: (obj, value) => { obj.selectedMode = value; } }, metadata: _metadata }, _selectedMode_initializers, _selectedMode_extraInitializers);
        __esDecorate(null, null, _repeatEventSingle_decorators, { kind: "field", name: "repeatEventSingle", static: false, private: false, access: { has: obj => "repeatEventSingle" in obj, get: obj => obj.repeatEventSingle, set: (obj, value) => { obj.repeatEventSingle = value; } }, metadata: _metadata }, _repeatEventSingle_initializers, _repeatEventSingle_extraInitializers);
        __esDecorate(null, null, _selectedEvent_decorators, { kind: "field", name: "selectedEvent", static: false, private: false, access: { has: obj => "selectedEvent" in obj, get: obj => obj.selectedEvent, set: (obj, value) => { obj.selectedEvent = value; } }, metadata: _metadata }, _selectedEvent_initializers, _selectedEvent_extraInitializers);
        __esDecorate(null, null, __numItems_decorators, { kind: "field", name: "_numItems", static: false, private: false, access: { has: obj => "_numItems" in obj, get: obj => obj._numItems, set: (obj, value) => { obj._numItems = value; } }, metadata: _metadata }, __numItems_initializers, __numItems_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        List = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return List = _classThis;
})();
exports.default = List;
