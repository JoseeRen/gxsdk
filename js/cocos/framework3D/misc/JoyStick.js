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
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
let JoyStick = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _outterCircle_decorators;
    let _outterCircle_initializers = [];
    let _outterCircle_extraInitializers = [];
    let _innerCircle_decorators;
    let _innerCircle_initializers = [];
    let _innerCircle_extraInitializers = [];
    let _radius_decorators;
    let _radius_initializers = [];
    let _radius_extraInitializers = [];
    let _innerCircleRadius_decorators;
    let _innerCircleRadius_initializers = [];
    let _innerCircleRadius_extraInitializers = [];
    let _dynamicJoystick_decorators;
    let _dynamicJoystick_initializers = [];
    let _dynamicJoystick_extraInitializers = [];
    let _autoRadius_decorators;
    let _autoRadius_initializers = [];
    let _autoRadius_extraInitializers = [];
    let _bmove_decorators;
    let _bmove_initializers = [];
    let _bmove_extraInitializers = [];
    var JoyStick = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.outterCircle = __runInitializers(this, _outterCircle_initializers, null);
            this.innerCircle = (__runInitializers(this, _outterCircle_extraInitializers), __runInitializers(this, _innerCircle_initializers, null));
            this.radius = (__runInitializers(this, _innerCircle_extraInitializers), __runInitializers(this, _radius_initializers, 250));
            this.innerCircleRadius = (__runInitializers(this, _radius_extraInitializers), __runInitializers(this, _innerCircleRadius_initializers, 20));
            this.real_radius = (__runInitializers(this, _innerCircleRadius_extraInitializers), 100);
            // dynamic Joystick
            this.dynamicJoystick = __runInitializers(this, _dynamicJoystick_initializers, false);
            this.autoRadius = (__runInitializers(this, _dynamicJoystick_extraInitializers), __runInitializers(this, _autoRadius_initializers, true));
            this._isReleased = (__runInitializers(this, _autoRadius_extraInitializers), true);
            /**移动到指定位置手指位置 */
            this.bmove = __runInitializers(this, _bmove_initializers, false);
            this._axis = (__runInitializers(this, _bmove_extraInitializers), (0, cc_1.v2)());
            this._power = 0;
            this._tmp_moveOffset = (0, cc_1.v2)();
            this._originPos = (0, cc_1.v2)();
            this._startPos = cc_1.Vec2.ZERO;
            this.touch_id = null;
        }
        onLoad() {
            if (this.autoRadius) {
                this.radius = this.outterCircle.width / 2;
                this.innerCircleRadius = this.innerCircle.width / 2;
            }
            this.real_radius = this.outterCircle.width / 2;
            this.innerCircle.setPosition(cc_1.Vec3.ZERO);
            this.node.active = false;
        }
        start() {
            // this.releaseStick();
        }
        get isReleased() {
            return this._isReleased;
        }
        releaseStick() {
            // let move = cc.moveTo(0.5, cc.Vec2.ZERO);
            // let action = move.easing(cc.easeExponentialOut());
            // this.innerCircle.runAction(action);
            this.innerCircle.setPosition(cc_1.Vec3.ZERO);
            this._isReleased = true;
            if (this.dynamicJoystick) {
                this.scheduleOnce(this.delayClose, 0.1);
            }
        }
        delayClose() {
            this.node.active = false;
        }
        get power() {
            return this._power;
        }
        get axis() {
            if (this._isReleased)
                return (0, cc_1.v2)();
            let vec = this.innerCircle.getPosition();
            let len = vec.length();
            var power = len / this.radius;
            vec.multiplyScalar(1 / len);
            this._axis.set(vec.x * power, vec.y * power);
            this._power = power;
            return this._axis;
        }
        move(p) {
            let worldP = p.clone();
            let vec = p.subtract(this._startPos);
            let mag = vec.length();
            let offset = mag - this.radius;
            if (offset > 0) {
                vec.normalize();
                if (this.bmove) {
                    cc_1.Vec2.copy(this._tmp_moveOffset, vec);
                    offset = mag - this.real_radius;
                    if (offset > 0) {
                        this._tmp_moveOffset.multiplyScalar(offset);
                        let v = this.innerCircle.getPosition();
                        this._startPos.x = worldP.x - v.x;
                        this._startPos.y = worldP.y - v.y;
                        let pos = this.node.parent.transform.convertToNodeSpaceAR((0, cc_1.v3)(this._startPos.x, this._startPos.y, 0));
                        this.node.position = pos;
                    }
                }
                vec.multiplyScalar(this.radius);
            }
            this.innerCircle.setPosition(vec.x, vec.y, 0);
        }
        touchStart(e) {
            if (this.touch_id != null && e.getID() != this.touch_id)
                return;
            let p = e.getUILocation();
            this._isReleased = false;
            this._startPos = p;
            this.unschedule(this.delayClose);
            this.node.active = true;
            if (this.dynamicJoystick) {
                // converto screen position
                let pos = this.node.getParent().getComponent(cc_1.UITransformComponent).convertToNodeSpaceAR((0, cc_1.v3)(p.x, p.y, 0));
                this._originPos = (0, cc_1.v2)(pos.x, pos.y);
                this.node.setPosition(pos);
                // this.node.opacity = 0;
                // this.node.runAction(cc.fadeIn(0.5));
            }
        }
        touchMove(e) {
            if (this.touch_id != null && e.getID() != this.touch_id)
                return;
            let p = e.getUILocation();
            this.move(p);
        }
        touchEnd(p) {
            // this.move(p);
            this.releaseStick();
            this.touch_id = null;
        }
        touchCancel(e) {
            this.releaseStick();
            this.touch_id = null;
        }
    };
    __setFunctionName(_classThis, "JoyStick");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _outterCircle_decorators = [property(cc_1.Node)];
        _innerCircle_decorators = [property(cc_1.Node)];
        _radius_decorators = [property({ visible() { return !this.autoRadius; } })];
        _innerCircleRadius_decorators = [property({ visible() { return !this.autoRadius; } })];
        _dynamicJoystick_decorators = [property];
        _autoRadius_decorators = [property];
        _bmove_decorators = [property({ displayName: "是否可移动", tooltip: "超过范围时，将随手指移动" })];
        __esDecorate(null, null, _outterCircle_decorators, { kind: "field", name: "outterCircle", static: false, private: false, access: { has: obj => "outterCircle" in obj, get: obj => obj.outterCircle, set: (obj, value) => { obj.outterCircle = value; } }, metadata: _metadata }, _outterCircle_initializers, _outterCircle_extraInitializers);
        __esDecorate(null, null, _innerCircle_decorators, { kind: "field", name: "innerCircle", static: false, private: false, access: { has: obj => "innerCircle" in obj, get: obj => obj.innerCircle, set: (obj, value) => { obj.innerCircle = value; } }, metadata: _metadata }, _innerCircle_initializers, _innerCircle_extraInitializers);
        __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius, set: (obj, value) => { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
        __esDecorate(null, null, _innerCircleRadius_decorators, { kind: "field", name: "innerCircleRadius", static: false, private: false, access: { has: obj => "innerCircleRadius" in obj, get: obj => obj.innerCircleRadius, set: (obj, value) => { obj.innerCircleRadius = value; } }, metadata: _metadata }, _innerCircleRadius_initializers, _innerCircleRadius_extraInitializers);
        __esDecorate(null, null, _dynamicJoystick_decorators, { kind: "field", name: "dynamicJoystick", static: false, private: false, access: { has: obj => "dynamicJoystick" in obj, get: obj => obj.dynamicJoystick, set: (obj, value) => { obj.dynamicJoystick = value; } }, metadata: _metadata }, _dynamicJoystick_initializers, _dynamicJoystick_extraInitializers);
        __esDecorate(null, null, _autoRadius_decorators, { kind: "field", name: "autoRadius", static: false, private: false, access: { has: obj => "autoRadius" in obj, get: obj => obj.autoRadius, set: (obj, value) => { obj.autoRadius = value; } }, metadata: _metadata }, _autoRadius_initializers, _autoRadius_extraInitializers);
        __esDecorate(null, null, _bmove_decorators, { kind: "field", name: "bmove", static: false, private: false, access: { has: obj => "bmove" in obj, get: obj => obj.bmove, set: (obj, value) => { obj.bmove = value; } }, metadata: _metadata }, _bmove_initializers, _bmove_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JoyStick = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JoyStick = _classThis;
})();
exports.default = JoyStick;
