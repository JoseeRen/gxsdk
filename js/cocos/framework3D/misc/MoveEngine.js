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
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
let { ccclass, property, executionOrder } = cc_1._decorator;
let MoveEngine = (() => {
    let _classDecorators = [ccclass("MoveEngine"), executionOrder(10)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _instanceExtraInitializers = [];
    let _acceleration_decorators;
    let _acceleration_initializers = [];
    let _acceleration_extraInitializers = [];
    let _damping_decorators;
    let _damping_initializers = [];
    let _damping_extraInitializers = [];
    let __maxSpeed_decorators;
    let __maxSpeed_initializers = [];
    let __maxSpeed_extraInitializers = [];
    let _get_maxSpeed_decorators;
    let _isPathLoop_decorators;
    let _isPathLoop_initializers = [];
    let _isPathLoop_extraInitializers = [];
    let _isPathPingPong_decorators;
    let _isPathPingPong_initializers = [];
    let _isPathPingPong_extraInitializers = [];
    var MoveEngine = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.acceleration = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _acceleration_initializers, 2));
            this.velocity = (__runInitializers(this, _acceleration_extraInitializers), (0, cc_1.v3)());
            this._maxVel = (0, cc_1.v3)();
            this._minVel = (0, cc_1.v3)();
            this.force = (0, cc_1.v3)();
            this.tmp_vec = (0, cc_1.v3)();
            this.tmp_pos = (0, cc_1.v3)();
            this._target = (0, cc_1.v3)();
            this.damping = __runInitializers(this, _damping_initializers, 0.98);
            this._maxSpeed = (__runInitializers(this, _damping_extraInitializers), __runInitializers(this, __maxSpeed_initializers, 10));
            this.tmpQuat = (__runInitializers(this, __maxSpeed_extraInitializers), (0, cc_1.quat)());
            this._vel_normalized = (0, cc_1.v3)();
            this._lookQuat = (0, cc_1.quat)();
            this.follow_vec = (0, cc_1.v3)();
            this.seek_vec = (0, cc_1.v3)();
            this._pause = false;
            this._isWorldSpace = false;
            this._speed = 0;
            this._isFullClamp = false;
            this._tmp_dir = (0, cc_1.v3)();
            this.isPathLoop = __runInitializers(this, _isPathLoop_initializers, true);
            this.isPathPingPong = (__runInitializers(this, _isPathLoop_extraInitializers), __runInitializers(this, _isPathPingPong_initializers, false));
            this._currentPathIndex = (__runInitializers(this, _isPathPingPong_extraInitializers), 0);
        }
        get target() {
            return this._target;
        }
        set target(value) {
            cc_1.Vec3.copy(this._target, value);
        }
        get maxSpeed() {
            return this._maxSpeed;
        }
        set maxSpeed(v) {
            this._maxSpeed = v;
            this.updateMaxVelocity(v);
        }
        updateMaxVelocity(v) {
            this._maxVel = (0, cc_1.v3)(v, v, v);
            this._minVel = (0, cc_1.v3)(-v, -v, -v);
        }
        onLoad() {
            this.updateMaxVelocity(this.maxSpeed);
        }
        updateRotationY() {
            let quat = this.rotationY;
            this.node.rotation = quat;
        }
        get rotationY() {
            let v = this.velocity;
            if (v.x == 0 && v.z == 0)
                return new cc_1.Quat();
            let angle = (0, cc_1.v2)(v.x, v.z).signAngle(cc_1.Vec2.UNIT_Y);
            let quat = cc_1.Quat.fromAxisAngle(this.tmpQuat, cc_1.Vec3.UNIT_Y, angle);
            return quat;
        }
        get velocityNormalized() {
            let v = this.velocity;
            cc_1.Vec3.normalize(this._vel_normalized, v);
            return this._vel_normalized;
        }
        updateRotation() {
            let v = this.velocity;
            // Vec3.multiplyScalar(this._lookat_target, v, 2).add(this.node.position);
            cc_1.Vec3.normalize(this._vel_normalized, v);
            cc_1.Quat.fromViewUp(this._lookQuat, this._vel_normalized);
            this.node.rotation = this._lookQuat;
            // this.node.lookAt(this._lookat_target);
        }
        stop() {
            cc_1.Vec3.zero(this.force);
            cc_1.Vec3.zero(this.velocity);
        }
        pause() {
            this._pause = true;
        }
        resume() {
            this._pause = false;
        }
        follow() {
            cc_1.Vec3.subtract(this.follow_vec, this.target, this.node.position);
            this.follow_vec.normalize();
            this.follow_vec.multiplyScalar(this.acceleration);
            // this.follow_vec.multiplyScalar(1).subtract(this.velocity);
            // this.addForce(this.follow_vec);
            return this.follow_vec;
        }
        seek() {
            if (this._isWorldSpace) {
                cc_1.Vec3.subtract(this.seek_vec, this.target, this.node.worldPosition);
            }
            else {
                cc_1.Vec3.subtract(this.seek_vec, this.target, this.node.position);
            }
            this.seek_vec.normalize();
            this.seek_vec.multiplyScalar(this.maxSpeed).subtract(this.velocity);
            return this.seek_vec;
        }
        static pauseAll() {
            this._pauseAll = true;
        }
        static set timeScale(v) {
            this._timeScale = v;
        }
        static resumeAll() {
            this._pauseAll = false;
        }
        setWorldSpace(b = true) {
            this._isWorldSpace = b;
        }
        /**使用精准限速 */
        setClampSpeed(b = true) {
            this._isFullClamp = b;
        }
        get speed() {
            if (this._isFullClamp) {
                return this._speed;
            }
            else {
                this.velocity.length();
            }
        }
        get dir() {
            this._tmp_dir.set(this.velocity);
            let s = this.speed;
            this._tmp_dir.set(this._tmp_dir.x / s, this._tmp_dir.y / s, this._tmp_dir.z / s);
            return this._tmp_dir;
        }
        update(dt) {
            if (this._pause)
                return;
            if (MoveEngine._pauseAll)
                return;
            // let dt2 = director.getDeltaTime();
            // console.log(dt, dt2);
            // this.force.multiplyScalar(dt * MoveEngine._timeScale);
            this.velocity.add(this.force);
            if (this._isFullClamp) {
                let len = this.velocity.length();
                let len2 = Math.min(len, this.maxSpeed);
                this._speed = len2;
                this.velocity.set(this.velocity.x / len * len2, this.velocity.y / len * len2, this.velocity.z / len * len2);
            }
            else {
                this.velocity.clampf(this._minVel, this._maxVel);
            }
            // let dtscale: number = dt / (1 / 60.0);
            cc_1.Vec3.multiplyScalar(this.tmp_vec, this.velocity, dt * MoveEngine._timeScale);
            if (this._isWorldSpace) {
                var pos = this.node.worldPosition;
                pos.add(this.tmp_vec);
                this.node.setWorldPosition(pos);
            }
            else {
                var pos = this.node.position;
                pos.add(this.tmp_vec);
                this.node.setPosition(pos);
            }
            this.force.set(0, 0, 0);
            this.velocity.multiplyScalar(this.damping);
        }
        addForce(f) {
            this.force.add(f);
        }
        getNormalPoint(point, a, b) {
            let ab = b.clone().subtract(a);
            let ap = point.clone().subtract(a);
            // ab.normalizeSelf()
            // let ap_ab = ab.mul(ap.dot(ab))
            let ap_ab = ap.project(ab);
            // return a.add(ap_ab);
            return ap_ab.add(a);
        }
        followPath(path, pathPredict = 1, fuzzyReachDistsq = 1) {
            if (this._currentPathIndex == path.length - 1) {
                return (0, cc_1.v3)();
            }
            // this.drawPath(Game.instance.graphics);
            let predict = (0, cc_1.v2)(this.velocity.x, this.velocity.z);
            predict.normalize();
            predict.multiplyScalar(pathPredict);
            let pos = this.node.position;
            let pos2D = cc.v2(pos.x, pos.z);
            predict.add(pos2D); //predictLocation
            let target;
            let a = path[this._currentPathIndex].clone();
            let b = path[this._currentPathIndex + 1].clone();
            let normalpoint = this.getNormalPoint(predict, a, b);
            let distsq = cc_1.Vec2.squaredDistance(normalpoint, b);
            if (distsq <= fuzzyReachDistsq) {
                this._currentPathIndex += 1;
                if (this.isPathLoop && this._currentPathIndex >= path.length - 1) {
                    this._currentPathIndex = 0;
                    if (this.isPathPingPong) {
                        path.reverse();
                        return this.seek();
                    }
                }
            }
            target = (normalpoint).add(b.subtract(a).normalize().multiplyScalar(pathPredict));
            if (distsq > fuzzyReachDistsq) {
                this.target = (0, cc_1.v3)(target.x, 0, target.y);
                return this.seek();
            }
            return (0, cc_1.v3)();
        }
        get currentPathIndex() {
            return this._currentPathIndex;
        }
        set currentPathIndex(v) {
            this._currentPathIndex = v;
        }
    };
    __setFunctionName(_classThis, "MoveEngine");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _acceleration_decorators = [property];
        _damping_decorators = [property];
        __maxSpeed_decorators = [property];
        _get_maxSpeed_decorators = [property];
        _isPathLoop_decorators = [property()];
        _isPathPingPong_decorators = [property()];
        __esDecorate(_classThis, null, _get_maxSpeed_decorators, { kind: "getter", name: "maxSpeed", static: false, private: false, access: { has: obj => "maxSpeed" in obj, get: obj => obj.maxSpeed }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _acceleration_decorators, { kind: "field", name: "acceleration", static: false, private: false, access: { has: obj => "acceleration" in obj, get: obj => obj.acceleration, set: (obj, value) => { obj.acceleration = value; } }, metadata: _metadata }, _acceleration_initializers, _acceleration_extraInitializers);
        __esDecorate(null, null, _damping_decorators, { kind: "field", name: "damping", static: false, private: false, access: { has: obj => "damping" in obj, get: obj => obj.damping, set: (obj, value) => { obj.damping = value; } }, metadata: _metadata }, _damping_initializers, _damping_extraInitializers);
        __esDecorate(null, null, __maxSpeed_decorators, { kind: "field", name: "_maxSpeed", static: false, private: false, access: { has: obj => "_maxSpeed" in obj, get: obj => obj._maxSpeed, set: (obj, value) => { obj._maxSpeed = value; } }, metadata: _metadata }, __maxSpeed_initializers, __maxSpeed_extraInitializers);
        __esDecorate(null, null, _isPathLoop_decorators, { kind: "field", name: "isPathLoop", static: false, private: false, access: { has: obj => "isPathLoop" in obj, get: obj => obj.isPathLoop, set: (obj, value) => { obj.isPathLoop = value; } }, metadata: _metadata }, _isPathLoop_initializers, _isPathLoop_extraInitializers);
        __esDecorate(null, null, _isPathPingPong_decorators, { kind: "field", name: "isPathPingPong", static: false, private: false, access: { has: obj => "isPathPingPong" in obj, get: obj => obj.isPathPingPong, set: (obj, value) => { obj.isPathPingPong = value; } }, metadata: _metadata }, _isPathPingPong_initializers, _isPathPingPong_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MoveEngine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis._pauseAll = false;
    _classThis._timeScale = 1;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MoveEngine = _classThis;
})();
exports.default = MoveEngine;
