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
exports.FizzBodyType = void 0;
const cc_1 = require("cc");
const fizz_1 = __importDefault(require("./fizz"));
const shapes_1 = __importDefault(require("./shapes"));
const Signal_1 = __importDefault(require("../../../framework3D/core/Signal"));
const FizzManager_1 = __importDefault(require("./FizzManager"));
const { ccclass, property } = cc_1._decorator;
var FizzBodyType;
(function (FizzBodyType) {
    FizzBodyType[FizzBodyType["Static"] = 0] = "Static";
    FizzBodyType[FizzBodyType["Dynamic"] = 1] = "Dynamic";
    FizzBodyType[FizzBodyType["Kinematic"] = 2] = "Kinematic";
})(FizzBodyType || (exports.FizzBodyType = FizzBodyType = {}));
var FizzShapeType;
(function (FizzShapeType) {
    FizzShapeType[FizzShapeType["rect"] = 0] = "rect";
    FizzShapeType[FizzShapeType["circle"] = 1] = "circle";
    FizzShapeType[FizzShapeType["line"] = 2] = "line";
})(FizzShapeType || (FizzShapeType = {}));
let FizzBody = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _bodyType_decorators;
    let _bodyType_initializers = [];
    let _bodyType_extraInitializers = [];
    let _shapeType_decorators;
    let _shapeType_initializers = [];
    let _shapeType_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _friction_decorators;
    let _friction_initializers = [];
    let _friction_extraInitializers = [];
    let _bounce_decorators;
    let _bounce_initializers = [];
    let _bounce_extraInitializers = [];
    let _damping_decorators;
    let _damping_initializers = [];
    let _damping_extraInitializers = [];
    let _gravity_decorators;
    let _gravity_initializers = [];
    let _gravity_extraInitializers = [];
    let _isTrigger_decorators;
    let _isTrigger_initializers = [];
    let _isTrigger_extraInitializers = [];
    let _left_decorators;
    let _left_initializers = [];
    let _left_extraInitializers = [];
    let _right_decorators;
    let _right_initializers = [];
    let _right_extraInitializers = [];
    let _top_decorators;
    let _top_initializers = [];
    let _top_extraInitializers = [];
    let _bottom_decorators;
    let _bottom_initializers = [];
    let _bottom_extraInitializers = [];
    let _destroyAfterTrigger_decorators;
    let _destroyAfterTrigger_initializers = [];
    let _destroyAfterTrigger_extraInitializers = [];
    let _response_decorators;
    let _response_initializers = [];
    let _response_extraInitializers = [];
    var FizzBody = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.bodyType = __runInitializers(this, _bodyType_initializers, FizzBodyType.Dynamic);
            this.shapeType = (__runInitializers(this, _bodyType_extraInitializers), __runInitializers(this, _shapeType_initializers, FizzShapeType.rect));
            // @property({visible(){return this.bodyType==FizzBodyType.Static},slide:true,range:[0,10],step:1})
            // isTrigger:boolean = false;
            this.size = (__runInitializers(this, _shapeType_extraInitializers), __runInitializers(this, _size_initializers, (0, cc_1.size)()));
            this.friction = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _friction_initializers, 1));
            this.bounce = (__runInitializers(this, _friction_extraInitializers), __runInitializers(this, _bounce_initializers, 0));
            this.damping = (__runInitializers(this, _bounce_extraInitializers), __runInitializers(this, _damping_initializers, 0));
            this.gravity = (__runInitializers(this, _damping_extraInitializers), __runInitializers(this, _gravity_initializers, 0));
            this.isTrigger = (__runInitializers(this, _gravity_extraInitializers), __runInitializers(this, _isTrigger_initializers, true));
            this.left = (__runInitializers(this, _isTrigger_extraInitializers), __runInitializers(this, _left_initializers, false));
            this.right = (__runInitializers(this, _left_extraInitializers), __runInitializers(this, _right_initializers, false));
            this.top = (__runInitializers(this, _right_extraInitializers), __runInitializers(this, _top_initializers, false));
            this.bottom = (__runInitializers(this, _top_extraInitializers), __runInitializers(this, _bottom_initializers, false));
            this.destroyAfterTrigger = (__runInitializers(this, _bottom_extraInitializers), __runInitializers(this, _destroyAfterTrigger_initializers, false));
            /**
             * x 方向的速度
             */
            this.xv = (__runInitializers(this, _destroyAfterTrigger_extraInitializers), 0);
            /**
             * 方向的速度
             */
            this.yv = 0;
            this.sx = 0;
            this.sy = 0;
            this.x = 0;
            this.y = 0;
            this.hw = 0;
            this.hh = 0;
            this._sid_ = 0;
            this.response = __runInitializers(this, _response_initializers, false);
            this._shape = (__runInitializers(this, _response_extraInitializers), null);
            this.intersections = {};
            this.mass = 1;
            this.isFalling = false;
            this.isLand = false;
            this._bodyAttached = false;
            //扩展 force 
            this.force = (0, cc_1.v3)();
            // group 扩展参数
            this.group = "";
            this._runningPath = [];
            this.isPathLoop = false;
            this._currentPathIndex = 0;
            this.pathSigal = new Signal_1.default();
            //------------------------------------------------------------------------------//
        }
        get sid() {
            return this._sid_;
        }
        get shape() {
            return this._shape;
        }
        set shape(value) {
            this._shape = value;
        }
        get active() {
            return this.node.active;
        }
        onLoad() {
            let components = this.getComponents(cc.Component);
            this._targetComponent = components.find(v => v["onFizzCollideEnter"] != null && v != this);
        }
        reset() {
            this.remove();
            this.respawn();
        }
        setBodyType(body) {
            this.remove();
            this.bodyType = body;
            this.respawn();
        }
        onDisable() {
            this.remove();
            this.unschedule(this.checkExit);
        }
        onEnable() {
            this.respawn();
            this.unschedule(this.checkExit);
            this.schedule(this.checkExit, 0.5);
        }
        start() {
            this.respawn();
        }
        get isStanding() {
            return this.isLand && !this.isFalling && this.yv <= 0;
        }
        onCollide(body, nx, ny, pen) {
            if (!this._bodyAttached) {
                return;
            }
            let r = true;
            if (body._sid_ != null) {
                if (this.intersections[body._sid_] == null) {
                    this.intersections[body._sid_] = body;
                    r = this.onFizzCollideEnter(body, nx, ny, pen);
                }
                else {
                    r = this.onFizzCollideStay(body, nx, ny, pen);
                }
                r = r == null ? true : r;
            }
            if (this.isTrigger) {
                return false;
            }
            else {
                return r;
            }
        }
        syncRotation() {
            // this.node.angle = Math.atan2(this.yv, this.xv) * cc.macro.DEG
        }
        setVelocity(x, y) {
            if (x instanceof cc_1.Vec3) {
                y = x.y;
                x = x.x;
            }
            this.xv = x;
            this.yv = y;
        }
        applyForce(f) {
            this.force.add(f);
        }
        applyImpulse(x, y) {
            this.xv += x;
            this.yv += y;
        }
        getDisplacement() {
            return cc.v2(this.sx || 0, this.sy || 0);
        }
        get velocity() {
            return cc.v2(this.xv || 0, this.yv || 0);
        }
        getVelocity() {
            return cc.v2(this.xv || 0, this.yv || 0);
        }
        getPosition() {
            return (0, cc_1.v3)(this.x, this.node.position.y, this.y);
        }
        // sets the position of a shape
        setPosition(x, y, z) {
            let pos = this.node.position;
            fizz_1.default.changePosition(this, pos.x - this.x, pos.z - this.y);
            // this.node.x = x;
            // this.node.z = y;
            this.node.setPosition(x, pos.y, z);
        }
        syncPosition() {
            let pos = this.node.position;
            fizz_1.default.changePosition(this, pos.x - this.x, pos.z - this.y);
        }
        respawn() {
            if (!this._bodyAttached && FizzManager_1.default.instance) {
                // let center = FizzManager.instance.getCenter(this.node);
                let center = this.node.worldPosition;
                let hw = this.size.width / 2 * this.node.scale.x;
                let hh = this.size.height / 2 * this.node.scale.y;
                if (this.shapeType == FizzShapeType.line) {
                    fizz_1.default.addShapeType(this, this.bodyType, FizzShapeType[this.shapeType], center.x - hw, center.z, center.x + hw, center.z);
                }
                else {
                    fizz_1.default.addShapeType(this, this.bodyType, FizzShapeType[this.shapeType], center.x, center.z, hw, hh);
                }
                if (this.bodyType == FizzBodyType.Dynamic)
                    fizz_1.default.setMass(this, 1);
                this._bodyAttached = true;
            }
        }
        /**
         * 临时删除，后面可以使用respawn 恢复
         */
        remove() {
            this.force = cc_1.Vec3.ZERO;
            this.isFalling = false;
            this.isLand = false;
            this.intersections = {};
            fizz_1.default.removeShape(this);
            this._bodyAttached = false;
        }
        onDestroy() {
            fizz_1.default.removeShape(this);
        }
        onFizzCollideEnter(b, nx, ny, pen) {
            if (this.isTrigger) {
                // this.triggerCallback.emit([this.triggerCallback.customEventData])
            }
            if (this._targetComponent)
                return this._targetComponent.onFizzCollideEnter(b, nx, ny, pen);
            if (this.destroyAfterTrigger) {
                this.destroy();
            }
            return true;
        }
        onFizzCollideStay(b, nx, ny, pen) {
            if (this._targetComponent && this._targetComponent.onFizzCollideStay)
                return this._targetComponent.onFizzCollideStay(b, nx, ny, pen);
            return true;
        }
        onFizzCollideExit(b) {
            if (this._targetComponent && this._targetComponent.onFizzCollideExit)
                return this._targetComponent.onFizzCollideExit(b);
            return true;
        }
        get bounds() {
            return shapes_1.default.bounds(this);
        }
        checkExit() {
            for (let k in this.intersections) {
                let v = this.intersections[k];
                if (cc.isValid(v)) {
                    let b = shapes_1.default.fasttest(this, v);
                    if (!b) {
                        this.onFizzCollideExit(v);
                        delete this.intersections[v._sid_];
                    }
                }
                else {
                    delete this.intersections[v._sid_];
                }
            }
        }
        update(dt) {
            if (FizzManager_1.default.instance.colDetectOnly) {
                return this.syncPosition();
            }
            if (this.bodyType == FizzBodyType.Dynamic || this.bodyType == FizzBodyType.Kinematic) {
                // this.node.x = this.x;
                // this.node.y = this.y;
                this.node.setPosition(this.x, this.node.position.y, this.y);
                this.xv += this.force.x;
                this.yv += this.force.y;
                this.force.set(0, 0, 0);
            }
        }
        lookAt(target, c = 0.1) {
            // let angle = this.node.angle
            // let toTarget = target.clone().subtract(this.node.position);
            // let targetAngle = Math.atan2(toTarget.y, toTarget.x) * cc.macro.DEG
            // let toAngle = targetAngle - angle;
            // this.node.angle += toAngle * c;
        }
        seek(target, maxSpeed = 100) {
            let toTarget = target.clone().subtract(this.node.position);
            toTarget.normalize();
            toTarget.multiplyScalar(maxSpeed);
            toTarget.subtract(this.velocity);
            return toTarget;
        }
        map(val, s1, s2, e1, e2) {
            let newVal = (e2 - e1) * val / (s2 - s1) + e1;
            return Math.max(e1, Math.min(newVal, e2));
        }
        arrive(target, maxSpeed = 100, deacc_dist = 50) {
            let toTarget = target.clone().subtract(this.node.position);
            let d = toTarget.length();
            toTarget.multiplyScalar(1 / d);
            // toTarget.normalizeSelf();
            //--------------------------------------快达到目标点时减速----------------------------------------//
            if (d < deacc_dist) {
                let m = this.map(d, 0, deacc_dist, 0, maxSpeed);
                toTarget.multiplyScalar(m);
            }
            else {
                toTarget.multiplyScalar(maxSpeed);
            }
            //--------------------------------------需要用的力 = 到目标点期待的速度 - 当前速度----------------------------------------//
            toTarget.subtract(this.velocity);
            return toTarget;
        }
        //--------------------------------------follow path----------------------------------------//
        getNormalPoint(point, a, b) {
            let ab = b.sub(a);
            let ap = point.subtract(a);
            // ab.normalizeSelf()
            // let ap_ab = ab.mul(ap.dot(ab))
            let ap_ab = ap.project(ab);
            return a.add(ap_ab);
        }
        drawPath(context) {
            // context.clear();
            context.moveTo(this._runningPath[0].x, this._runningPath[0].y);
            for (var i = 0; i < this._runningPath.length - 1; i++) {
                let a = this._runningPath[i];
                let b = this._runningPath[i + 1];
                context.lineTo(b.x, b.y);
            }
            // Game.instance.graphics.ellipse(target.x,target.y ,4,4)
            context.stroke();
        }
        isPathFinished() {
            return this._currentPathIndex != 0 && this._currentPathIndex == this._runningPath.length;
        }
        followPath(path, stopAtEnd = false, maxSpeed = 100, pathRadius = 20, distDeacc = 100) {
            this._runningPath = path;
            if (this._currentPathIndex == path.length - 1) {
                // let distsq = this.node.position.sub(this._runningPath[this._currentPathIndex]).magSqr();
                // if(distsq < MoveEntity.ReachPathEndThreshold)
                // {
                // console.log("resetpath wehne finei");
                // if (this.resetPathWhenFinish)
                // {
                //     this.resetPath();
                // }
                // }
                if (stopAtEnd) {
                    let f = this.arrive(path[this._currentPathIndex], maxSpeed, distDeacc);
                    if (f.equals(cc_1.Vec3.ZERO, 1)) {
                        this._currentPathIndex = this._currentPathIndex + 1;
                        this.pathSigal.fire('Finished', path, this._currentPathIndex);
                    }
                    return f;
                }
                return cc_1.Vec3.ZERO;
            }
            else if (this._currentPathIndex == path.length) {
                return this.arrive(path[path.length - 1], maxSpeed, distDeacc);
            }
            // this.drawPath(Game.instance.graphics);
            let predict = this.velocity.clone();
            predict.normalizeSelf();
            predict.mulSelf(FizzBody.PathPredictLength);
            predict.addSelf(this.node.position); //predictLocation
            let target;
            // for (var i = 0 ;i < 2; i++)
            // {
            let a = path[this._currentPathIndex];
            let b = path[this._currentPathIndex + 1];
            let normalpoint = this.getNormalPoint(predict, a, b);
            let distsq = normalpoint.subtract(b).lengthSqr();
            if (distsq < FizzBody.ReachPathEndThreshold) {
                this._currentPathIndex += 1;
                this.pathSigal.fire('WayPoint', path, this._currentPathIndex);
                if (this.isPathLoop && this._currentPathIndex >= path.length - 1) {
                    this._currentPathIndex = 0;
                }
            }
            if (distsq > pathRadius * pathRadius) {
                target = (normalpoint).add(b.clone().subtract(a).normalize().multiplyScalar(FizzBody.PathPredictLength + 10));
                return this.seek(target, maxSpeed);
            }
            return cc_1.Vec3.ZERO;
        }
        setPath(path, isLoop = false, isRelativePath = true) {
            this.isPathLoop = isLoop;
            this._runningPath.splice(0);
            for (var i = 0; i < path.length; i++) {
                let pos = path[i].clone();
                if (isRelativePath) {
                    pos.add(this.node.position);
                }
                this._runningPath.push(pos);
            }
            if (this.isPathLoop) {
                if (this._runningPath.length > 0) {
                    let pathWayPoint = this._runningPath[0];
                    this._runningPath.push(pathWayPoint);
                }
            }
            this._currentPathIndex = 0;
        }
        resetPath() {
            this._currentPathIndex = 0;
        }
    };
    __setFunctionName(_classThis, "FizzBody");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _bodyType_decorators = [property({ type: cc.Enum(FizzBodyType) })];
        _shapeType_decorators = [property({ type: cc.Enum(FizzShapeType) })];
        _size_decorators = [property(cc_1.Size)];
        _friction_decorators = [property({ slide: true, range: [0, 1], step: 0.1 })];
        _bounce_decorators = [property({ slide: true, range: [0, 10], step: 0.1 })];
        _damping_decorators = [property({ slide: true, range: [0, 50], step: 0.1 })];
        _gravity_decorators = [property({ visible() { return this.bodyType == FizzBodyType.Dynamic; }, slide: true, range: [0, 10], step: 1 })];
        _isTrigger_decorators = [property()];
        _left_decorators = [property({ visible() { return !this.isTrigger && this.shapeType == FizzShapeType.rect; } })];
        _right_decorators = [property({ visible() { return !this.isTrigger && this.shapeType == FizzShapeType.rect; } })];
        _top_decorators = [property({ visible() { return !this.isTrigger && this.shapeType == FizzShapeType.rect; } })];
        _bottom_decorators = [property({ visible() { return !this.isTrigger && this.shapeType == FizzShapeType.rect; } })];
        _destroyAfterTrigger_decorators = [property({ visible() { return this.isTrigger; } })];
        _response_decorators = [property({ tooltip: "是否需要计算碰撞反应" })];
        __esDecorate(null, null, _bodyType_decorators, { kind: "field", name: "bodyType", static: false, private: false, access: { has: obj => "bodyType" in obj, get: obj => obj.bodyType, set: (obj, value) => { obj.bodyType = value; } }, metadata: _metadata }, _bodyType_initializers, _bodyType_extraInitializers);
        __esDecorate(null, null, _shapeType_decorators, { kind: "field", name: "shapeType", static: false, private: false, access: { has: obj => "shapeType" in obj, get: obj => obj.shapeType, set: (obj, value) => { obj.shapeType = value; } }, metadata: _metadata }, _shapeType_initializers, _shapeType_extraInitializers);
        __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
        __esDecorate(null, null, _friction_decorators, { kind: "field", name: "friction", static: false, private: false, access: { has: obj => "friction" in obj, get: obj => obj.friction, set: (obj, value) => { obj.friction = value; } }, metadata: _metadata }, _friction_initializers, _friction_extraInitializers);
        __esDecorate(null, null, _bounce_decorators, { kind: "field", name: "bounce", static: false, private: false, access: { has: obj => "bounce" in obj, get: obj => obj.bounce, set: (obj, value) => { obj.bounce = value; } }, metadata: _metadata }, _bounce_initializers, _bounce_extraInitializers);
        __esDecorate(null, null, _damping_decorators, { kind: "field", name: "damping", static: false, private: false, access: { has: obj => "damping" in obj, get: obj => obj.damping, set: (obj, value) => { obj.damping = value; } }, metadata: _metadata }, _damping_initializers, _damping_extraInitializers);
        __esDecorate(null, null, _gravity_decorators, { kind: "field", name: "gravity", static: false, private: false, access: { has: obj => "gravity" in obj, get: obj => obj.gravity, set: (obj, value) => { obj.gravity = value; } }, metadata: _metadata }, _gravity_initializers, _gravity_extraInitializers);
        __esDecorate(null, null, _isTrigger_decorators, { kind: "field", name: "isTrigger", static: false, private: false, access: { has: obj => "isTrigger" in obj, get: obj => obj.isTrigger, set: (obj, value) => { obj.isTrigger = value; } }, metadata: _metadata }, _isTrigger_initializers, _isTrigger_extraInitializers);
        __esDecorate(null, null, _left_decorators, { kind: "field", name: "left", static: false, private: false, access: { has: obj => "left" in obj, get: obj => obj.left, set: (obj, value) => { obj.left = value; } }, metadata: _metadata }, _left_initializers, _left_extraInitializers);
        __esDecorate(null, null, _right_decorators, { kind: "field", name: "right", static: false, private: false, access: { has: obj => "right" in obj, get: obj => obj.right, set: (obj, value) => { obj.right = value; } }, metadata: _metadata }, _right_initializers, _right_extraInitializers);
        __esDecorate(null, null, _top_decorators, { kind: "field", name: "top", static: false, private: false, access: { has: obj => "top" in obj, get: obj => obj.top, set: (obj, value) => { obj.top = value; } }, metadata: _metadata }, _top_initializers, _top_extraInitializers);
        __esDecorate(null, null, _bottom_decorators, { kind: "field", name: "bottom", static: false, private: false, access: { has: obj => "bottom" in obj, get: obj => obj.bottom, set: (obj, value) => { obj.bottom = value; } }, metadata: _metadata }, _bottom_initializers, _bottom_extraInitializers);
        __esDecorate(null, null, _destroyAfterTrigger_decorators, { kind: "field", name: "destroyAfterTrigger", static: false, private: false, access: { has: obj => "destroyAfterTrigger" in obj, get: obj => obj.destroyAfterTrigger, set: (obj, value) => { obj.destroyAfterTrigger = value; } }, metadata: _metadata }, _destroyAfterTrigger_initializers, _destroyAfterTrigger_extraInitializers);
        __esDecorate(null, null, _response_decorators, { kind: "field", name: "response", static: false, private: false, access: { has: obj => "response" in obj, get: obj => obj.response, set: (obj, value) => { obj.response = value; } }, metadata: _metadata }, _response_initializers, _response_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FizzBody = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.ReachPathEndThreshold = 400; //20 x 20
    _classThis.PathPredictLength = 25;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FizzBody = _classThis;
})();
exports.default = FizzBody;
