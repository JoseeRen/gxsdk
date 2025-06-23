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
exports.LevelEndEventType = exports.EventType = void 0;
const { ccclass, property } = cc._decorator;
var EventType;
(function (EventType) {
    EventType[EventType["paySuccess"] = 0] = "paySuccess";
    EventType[EventType["payFail"] = 1] = "payFail";
    EventType[EventType["tools"] = 2] = "tools";
    EventType[EventType["revive"] = 3] = "revive";
    EventType[EventType["award"] = 4] = "award";
})(EventType || (exports.EventType = EventType = {}));
var LevelEndEventType;
(function (LevelEndEventType) {
    LevelEndEventType[LevelEndEventType["Exit"] = 0] = "Exit";
    LevelEndEventType[LevelEndEventType["Win"] = 1] = "Win";
    LevelEndEventType[LevelEndEventType["Lose"] = 2] = "Lose";
})(LevelEndEventType || (exports.LevelEndEventType = LevelEndEventType = {}));
let StatHepler = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var StatHepler = _classThis = class {
        static init(userId) {
            this._userId = userId;
        }
        static startLevel(levelId, lv_desc) {
            this.levelId = levelId;
            this.current_lv_desc = lv_desc;
            //默认为退出，其它 状态 会设置 成功或者 失败,不设置 就是退出
            StatHepler.level_end_event = LevelEndEventType.Exit;
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                wx.aldStage.onStart({
                    stageId: levelId,
                    stageName: this.current_lv_desc,
                    userId: this._userId
                });
            }
            this.isInLevel = true;
        }
        static setLevelEndEvent(evt) {
            StatHepler.level_end_event = evt;
        }
        static userAction(eventName, k, v) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                if (k) {
                    let param = {};
                    param[k] = v;
                    wx.aldSendEvent(eventName, param);
                }
                else {
                    let param = {};
                    param["userId"] = this._userId;
                    wx.aldSendEvent(eventName);
                }
            }
        }
        static doLevelEvent(eventType, itemName, itemId, itemCount = 1, itemMoney = "1") {
            if (!this.isInLevel)
                return;
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                wx.aldStage.onRunning({
                    stageId: this.levelId,
                    stageName: this.current_lv_desc,
                    userId: this._userId,
                    event: EventType[eventType],
                    params: {
                        itemName, itemId, itemCount, itemMoney
                    }
                });
            }
        }
        static endLevel() {
            //统计
            //------------------------------------------------------------------------------//
            let desc = "";
            let ald_event = '';
            switch (StatHepler.level_end_event) {
                case LevelEndEventType.Win:
                    desc = "完成关卡";
                    ald_event = 'complete';
                    break;
                case LevelEndEventType.Lose:
                    desc = "关卡失败";
                    ald_event = "fail";
                    break;
                case LevelEndEventType.Exit:
                    desc = "中途退出";
                    ald_event = "fail";
                    return;
                // break;
            }
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                wx.aldStage.onEnd({
                    stageId: this.levelId,
                    stageName: this.current_lv_desc,
                    userId: this._userId,
                    event: ald_event,
                    params: {
                        desc
                    }
                });
            }
            this.isInLevel = false;
            //------------------------------------------------------------------------------//
        }
    };
    __setFunctionName(_classThis, "StatHepler");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StatHepler = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.level_end_event = LevelEndEventType.Exit;
    _classThis.current_lv_desc = "";
    _classThis.isInLevel = false;
    _classThis._userId = '';
    _classThis.levelId = '0';
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StatHepler = _classThis;
})();
exports.default = StatHepler;
