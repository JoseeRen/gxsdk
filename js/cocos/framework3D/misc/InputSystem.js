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
exports.InputSystem = exports.Input = void 0;
const cc_1 = require("cc");
const JoyStick_1 = __importDefault(require("../misc/JoyStick"));
const { ccclass, property } = cc_1._decorator;
exports.Input = null;
let InputSystem = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _joyStick_decorators;
    let _joyStick_initializers = [];
    let _joyStick_extraInitializers = [];
    var InputSystem = _classThis = class extends _classSuper {
        constructor() {
            // @property(EventHandler)
            // onKeyDown:EventHandler;
            super(...arguments);
            this._target = null;
            this.keys = {};
            this.__touchVec = cc_1.Vec2.ZERO;
            this.radius_axis = 256;
            this.joyStick = __runInitializers(this, _joyStick_initializers, null);
            this.__lastTouch = (__runInitializers(this, _joyStick_extraInitializers), cc_1.Vec2.ZERO);
            this.moveOffset = cc_1.Vec2.ZERO;
            this.__curTouchId = -1;
        }
        /**
         * if target is a Component ,this function must be called in onLoad
         * @param target
         */
        setDelegate(target) {
            this._target = target;
        }
        onLoad() {
            exports.Input = this;
            let components = this.getComponents(cc_1.Component);
            for (var i = 0; i < components.length; i++) {
                let comp = components[i];
                if (comp != this && (comp.onTouchBegan || comp.onTouchEnded || comp.onTouchMoved)) {
                    this._target = comp;
                    break;
                }
            }
            // g.setGlobalInstance(this, 'Input')
            // console.log("InputSystem Component -> target:", this._target)
        }
        //Horizontal
        //Vertical
        start() {
            cc_1.systemEvent.on(cc_1.SystemEvent.EventType.KEY_DOWN, this.triggerKeyDown, this);
            cc_1.systemEvent.on(cc_1.SystemEvent.EventType.KEY_UP, this.triggerKeyUp, this);
            // if(this._target)
            // {
            this.node.on(cc_1.SystemEventType.TOUCH_START, this.triggerTouchBegan, this);
            this.node.on(cc_1.SystemEventType.TOUCH_MOVE, this.triggerTouchMoved, this);
            this.node.on(cc_1.SystemEventType.TOUCH_END, this.triggerTouchEnded, this);
            this.node.on(cc_1.SystemEventType.TOUCH_CANCEL, this.triggerTouchCanceled, this);
            // }
        }
        get touch() {
            return this.__touch;
        }
        // only valid when joystick is enabled 
        get axis() {
            if (this.joyStick)
                return this.joyStick.axis;
            else
                return this.__touchVec;
        }
        getKey(k) {
            return this.keys[k];
        }
        triggerKeyUp(e) {
            if (this._target && this._target.onKeyUp)
                this._target.onKeyUp(event);
            this.keys[event["key"]] = false;
        }
        triggerKeyDown(e) {
            if (this._target && this._target.onKeyDown)
                this._target.onKeyDown(event);
            this.keys[event["key"]] = true;
        }
        triggerTouchEnded(e) {
            if (this.__curTouchId != -1 && e.getID() != this.__curTouchId) {
                return;
            }
            this.__curTouchId = -1;
            if (this._target && this._target.onTouchEnded)
                this._target.onTouchEnded(e);
            this.__touch = null;
            this.__touchVec = cc_1.Vec2.ZERO;
            if (e.currentTouch)
                if (this.joyStick)
                    this.joyStick.touchEnd(e.currentTouch.getLocation());
            this.moveOffset = cc_1.Vec2.ZERO;
        }
        triggerTouchMoved(e) {
            if (this.__curTouchId != -1 && e.getID() != this.__curTouchId) {
                return;
            }
            if (this._target && this._target.onTouchMoved)
                this._target.onTouchMoved(e);
            this.__touch = e.currentTouch.getLocation();
            this.moveOffset = this.__touch.subtract(this.__lastTouch);
            if (this.__touch && this.__startLocation) {
                this.__touchVec = this.__touch.subtract(this.__startLocation);
                if (this.joyStick)
                    this.joyStick.touchMove(this.__touch);
            }
            this.__lastTouch = this.__touch;
        }
        triggerTouchBegan(e) {
            if (this.__curTouchId != -1 && e.getID() != this.__curTouchId) {
                return;
            }
            if (this._target && this._target.onTouchBegan)
                this._target.onTouchBegan(e);
            this.__curTouchId = e.getID();
            this.__startLocation = e.currentTouch.getLocation();
            this.__touch = e.currentTouch.getLocation();
            this.__lastTouch = this.__touch;
            if (this.joyStick)
                this.joyStick.touchStart(this.__startLocation);
        }
        triggerTouchCanceled(e) {
            this.triggerTouchEnded(e);
        }
        onEnable() {
            this.schedule(this.checkTouch, 0.02);
        }
        onDisable() {
            this.unschedule(this.checkTouch);
        }
        checkTouch() {
            if (this.__touch) {
                this.moveOffset = this.__touch.subtract(this.__lastTouch);
            }
        }
    };
    __setFunctionName(_classThis, "InputSystem");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _joyStick_decorators = [property(JoyStick_1.default)];
        __esDecorate(null, null, _joyStick_decorators, { kind: "field", name: "joyStick", static: false, private: false, access: { has: obj => "joyStick" in obj, get: obj => obj.joyStick, set: (obj, value) => { obj.joyStick = value; } }, metadata: _metadata }, _joyStick_initializers, _joyStick_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InputSystem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InputSystem = _classThis;
})();
exports.InputSystem = InputSystem;
