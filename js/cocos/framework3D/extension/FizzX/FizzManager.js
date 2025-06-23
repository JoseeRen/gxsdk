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
const fizz_1 = __importDefault(require("./fizz"));
const shapes_1 = __importDefault(require("./shapes"));
const { ccclass, property, executionOrder } = cc_1._decorator;
let FizzManager = (() => {
    let _classDecorators = [ccclass, executionOrder(-1)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _partionEnabled_decorators;
    let _partionEnabled_initializers = [];
    let _partionEnabled_extraInitializers = [];
    let _gravity_decorators;
    let _gravity_initializers = [];
    let _gravity_extraInitializers = [];
    let _debug_decorators;
    let _debug_initializers = [];
    let _debug_extraInitializers = [];
    let _ignore_up_drag_decorators;
    let _ignore_up_drag_initializers = [];
    let _ignore_up_drag_extraInitializers = [];
    let _colDetectOnly_decorators;
    let _colDetectOnly_initializers = [];
    let _colDetectOnly_extraInitializers = [];
    let _collisionFilter_decorators;
    let _collisionFilter_initializers = [];
    let _collisionFilter_extraInitializers = [];
    var FizzManager = _classThis = class extends _classSuper {
        onLoad() {
            FizzManager.instance = this;
            fizz_1.default.ignore_up_drag = this.ignore_up_drag;
            window['fizz'] = fizz_1.default;
        }
        onDestroy() {
            fizz_1.default.cleanup();
            FizzManager.instance = null;
        }
        _init() {
            // if (this.tiledmap) {
            //     let size = this.tiledmap.getMapSize();
            //     let tilesize = this.tiledmap.getTileSize();
            //     let w = size.width * tilesize.width;
            //     let h = size.height * tilesize.height
            //     Fizz.init(w, h, this.shouldCollide.bind(this));
            //     FizzHelper.initWithMap(this.tiledmap);
            // }
            if (this.collisionFilter) {
                fizz_1.default.init(this.shouldCollide.bind(this));
            }
            fizz_1.default.setPartition(this.partionEnabled);
            fizz_1.default.setGravity(this.gravity.x, this.gravity.y);
        }
        init() {
            if (!this._inited) {
                this._init();
                this._inited = true;
            }
        }
        start() {
            this.init();
        }
        getCenter(node) {
            // return Common.getPositionToNodeSpaceAR(node,this.node);
            // let rect = node.getBoundingBox()
            // let c = node.parent.convertToWorldSpaceAR(rect.center)
            // return this.node.convertToNodeSpaceAR(c);
            return cc_1.Vec3.ZERO;
        }
        drawRect(shape) {
            let [x, y, hw, hh] = shapes_1.default.bounds(shape);
            // this.graphics.fillRect(x - hw, y - hh, hw * 2, hh * 2);
        }
        lateUpdate() {
            fizz_1.default.update(cc.director.getDeltaTime());
            // if (this.debug) {
            //     // this.graphics.clear()
            //     Fizz.statics.forEach(v => this.drawRect(v))
            //     Fizz.dynamics.forEach(v => this.drawRect(v))
            //     Fizz.kinematics.forEach(v => this.drawRect(v))
            // }
            // Fizz.statics.forEach(v=>{
            //     if(v.node)
            //         v.node.position = v
            // })
            // Fizz.kinematics.forEach(v=>v.node.position = v)
        }
        shouldCollide(c1, c2) {
            let node1 = c1.node, node2 = c2.node;
            if (node1 == node2)
                return;
            if (node1 == null || node2 == null)
                return true;
            let collisionMatrix = FizzManager.collisionMatrix;
            return collisionMatrix[node1.layer][node2.layer];
        }
        constructor() {
            super(...arguments);
            /**是否使用QuadTree分区, 地图小，刚体大时建议关闭 */
            this.partionEnabled = __runInitializers(this, _partionEnabled_initializers, true);
            this.gravity = (__runInitializers(this, _partionEnabled_extraInitializers), __runInitializers(this, _gravity_initializers, (0, cc_1.v3)(0, -1000, 0)));
            this.debug = (__runInitializers(this, _gravity_extraInitializers), __runInitializers(this, _debug_initializers, false));
            this.ignore_up_drag = (__runInitializers(this, _debug_extraInitializers), __runInitializers(this, _ignore_up_drag_initializers, true));
            this._inited = (__runInitializers(this, _ignore_up_drag_extraInitializers), false);
            /**仅做碰撞检测 */
            this.colDetectOnly = __runInitializers(this, _colDetectOnly_initializers, true);
            this.collisionFilter = (__runInitializers(this, _colDetectOnly_extraInitializers), __runInitializers(this, _collisionFilter_initializers, false));
            __runInitializers(this, _collisionFilter_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FizzManager");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _partionEnabled_decorators = [property];
        _gravity_decorators = [property];
        _debug_decorators = [property];
        _ignore_up_drag_decorators = [property];
        _colDetectOnly_decorators = [property({ displayName: "仅碰撞检测" })];
        _collisionFilter_decorators = [property({ displayName: "开启碰撞过滤", tooltip: "开启后,FizzManager.collisionMatrix需要被设置" })];
        __esDecorate(null, null, _partionEnabled_decorators, { kind: "field", name: "partionEnabled", static: false, private: false, access: { has: obj => "partionEnabled" in obj, get: obj => obj.partionEnabled, set: (obj, value) => { obj.partionEnabled = value; } }, metadata: _metadata }, _partionEnabled_initializers, _partionEnabled_extraInitializers);
        __esDecorate(null, null, _gravity_decorators, { kind: "field", name: "gravity", static: false, private: false, access: { has: obj => "gravity" in obj, get: obj => obj.gravity, set: (obj, value) => { obj.gravity = value; } }, metadata: _metadata }, _gravity_initializers, _gravity_extraInitializers);
        __esDecorate(null, null, _debug_decorators, { kind: "field", name: "debug", static: false, private: false, access: { has: obj => "debug" in obj, get: obj => obj.debug, set: (obj, value) => { obj.debug = value; } }, metadata: _metadata }, _debug_initializers, _debug_extraInitializers);
        __esDecorate(null, null, _ignore_up_drag_decorators, { kind: "field", name: "ignore_up_drag", static: false, private: false, access: { has: obj => "ignore_up_drag" in obj, get: obj => obj.ignore_up_drag, set: (obj, value) => { obj.ignore_up_drag = value; } }, metadata: _metadata }, _ignore_up_drag_initializers, _ignore_up_drag_extraInitializers);
        __esDecorate(null, null, _colDetectOnly_decorators, { kind: "field", name: "colDetectOnly", static: false, private: false, access: { has: obj => "colDetectOnly" in obj, get: obj => obj.colDetectOnly, set: (obj, value) => { obj.colDetectOnly = value; } }, metadata: _metadata }, _colDetectOnly_initializers, _colDetectOnly_extraInitializers);
        __esDecorate(null, null, _collisionFilter_decorators, { kind: "field", name: "collisionFilter", static: false, private: false, access: { has: obj => "collisionFilter" in obj, get: obj => obj.collisionFilter, set: (obj, value) => { obj.collisionFilter = value; } }, metadata: _metadata }, _collisionFilter_initializers, _collisionFilter_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FizzManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.instance = null;
    _classThis.collisionMatrix = [[], [], []];
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FizzManager = _classThis;
})();
exports.default = FizzManager;
