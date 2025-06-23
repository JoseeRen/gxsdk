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
const cc_1 = require("cc");
const Signal_1 = __importDefault(require("../../core/Signal"));
const DynamicMapSegment_1 = __importDefault(require("./DynamicMapSegment"));
const PoolManager_1 = __importDefault(require("../../core/PoolManager"));
const { ccclass, property, menu } = cc_1._decorator;
var Direction;
(function (Direction) {
    Direction[Direction["x"] = 0] = "x";
    Direction[Direction["y"] = 1] = "y";
    Direction[Direction["z"] = 2] = "z";
})(Direction || (Direction = {}));
let DynamicMap = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _instanceExtraInitializers = [];
    let _usePool_decorators;
    let _usePool_initializers = [];
    let _usePool_extraInitializers = [];
    let _segments_decorators;
    let _segments_initializers = [];
    let _segments_extraInitializers = [];
    let _cursor_decorators;
    let _cursor_initializers = [];
    let _cursor_extraInitializers = [];
    let __dir_decorators;
    let __dir_initializers = [];
    let __dir_extraInitializers = [];
    let _get_dir_decorators;
    let _isLoop_decorators;
    let _isLoop_initializers = [];
    let _isLoop_extraInitializers = [];
    let _referenceNode_decorators;
    let _referenceNode_initializers = [];
    let _referenceNode_extraInitializers = [];
    let _thesholdToCreateNext_decorators;
    let _thesholdToCreateNext_initializers = [];
    let _thesholdToCreateNext_extraInitializers = [];
    let _interval_check_decorators;
    let _interval_check_initializers = [];
    let _interval_check_extraInitializers = [];
    let _thesholdToRemovePrev_decorators;
    let _thesholdToRemovePrev_initializers = [];
    let _thesholdToRemovePrev_extraInitializers = [];
    var DynamicMap = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.curSeg = __runInitializers(this, _instanceExtraInitializers);
            this.segIdx = -1;
            this.event = new Signal_1.default();
            this.isEnd = false;
            this.running = false;
            this.usePool = __runInitializers(this, _usePool_initializers, true);
            this.isLoadOnce = (__runInitializers(this, _usePool_extraInitializers), false);
            this.segments = __runInitializers(this, _segments_initializers, []
            /**创建游标 */
            );
            /**创建游标 */
            this.cursor = (__runInitializers(this, _segments_extraInitializers), __runInitializers(this, _cursor_initializers, -1));
            this.dirName = __runInitializers(this, _cursor_extraInitializers);
            this._dir = __runInitializers(this, __dir_initializers, Direction.z);
            //是否是无尽
            this.isLoop = (__runInitializers(this, __dir_extraInitializers), __runInitializers(this, _isLoop_initializers, false));
            /**参照物 */
            this.referenceNode = (__runInitializers(this, _isLoop_extraInitializers), __runInitializers(this, _referenceNode_initializers, null));
            /**参照物离cursor多远时创建下一块 */
            this.thesholdToCreateNext = (__runInitializers(this, _referenceNode_extraInitializers), __runInitializers(this, _thesholdToCreateNext_initializers, 5));
            /**检测创建 频率 */
            this.interval_check = (__runInitializers(this, _thesholdToCreateNext_extraInitializers), __runInitializers(this, _interval_check_initializers, 0.5));
            /**前一块物体离参照物多远时删除 */
            this.thesholdToRemovePrev = (__runInitializers(this, _interval_check_extraInitializers), __runInitializers(this, _thesholdToRemovePrev_initializers, 5));
            this.poolmgr = (__runInitializers(this, _thesholdToRemovePrev_extraInitializers), null);
            this.prefabSegments = [];
            this.timer_check = 0;
        }
        get dir() {
            return this._dir;
        }
        set dir(value) {
            this._dir = value;
            this.dirName = Direction[value];
        }
        onLoad() {
            this.dirName = Direction[this.dir];
            this.segments.forEach((v, i) => this.prefabSegments[i] = v);
            if (this.usePool) {
                this.poolmgr = new PoolManager_1.default(null, this.onCreateSegment, this);
                this.poolmgr.name = 'DynamicMap-Pool';
            }
        }
        onDestroy() {
            this.event.clear();
            this.segments.splice(0);
        }
        halfSegmentSize(v) {
            let seg = v.getComponent(DynamicMapSegment_1.default);
            if (seg == null) {
                return v[this.dirName];
            }
            let s = seg.size / 2;
            return s;
        }
        start() {
            this.cursor = this.node.children.reduce((sum, v) => { return sum + this.halfSegmentSize(v) * 2; }, 0);
            let first = this.node.children[0];
            if (first) {
                this.cursor -= this.halfSegmentSize(first);
            }
            this.begin(true);
        }
        onCreateSegment(prefab) {
            let node = (0, cc_1.instantiate)(prefab);
            // node.name = prefab.data.name;
            return node;
        }
        /**bLoadAll 是否一次性加载地图 */
        begin(bLoadAll) {
            this.running = true;
            this.isLoadOnce = bLoadAll;
            //开始生成关卡
            console.warn("开始生成关卡");
            let segcount = this.segments.length;
            if (bLoadAll) {
                for (var i = 0; i < segcount + 1; i++) {
                    this.curSeg = this.createNextSeg();
                }
            }
            else {
                if (this.curSeg == null) {
                    this.curSeg = this.createNextSeg();
                }
            }
        }
        addSements(...prefabs) {
            this.segments.push(...prefabs);
        }
        createNextSeg() {
            let idx = this.segIdx + 1;
            if (idx > this.segments.length - 1) {
                if (this.isLoop) {
                }
                else {
                    //没有关卡了
                    console.log("没有关卡段了");
                    this.isEnd = true;
                    this.event.fire("finish", this.cursor);
                    return;
                }
            }
            this.segIdx = (0, cc_1.clamp)(idx, 0, this.segments.length - 1);
            let prefab = this.segments[this.segIdx];
            console.warn("create next level:", prefab.name);
            let node;
            if (this.usePool) {
                node = this.poolmgr.get(prefab);
            }
            else {
                node = (0, cc_1.instantiate)(prefab);
                // node.name = prefab.data.name;
            }
            // let roadType = this.levels_roadAvatar[this.levelIndex]
            if (node == null) {
                console.error("create segment failed:", this.segments, this.segIdx);
                return null;
            }
            let size = this.halfSegmentSize(node);
            this.cursor += size;
            if (this.dir == Direction.x) {
                node.setPosition(this.cursor, 0, 0);
            }
            else if (this.dir == Direction.y) {
                node.setPosition(0, 0, this.cursor);
            }
            else if (this.dir == Direction.z) {
                node.setPosition(0, 0, this.cursor);
            }
            this.cursor += size;
            //删除
            let first = this.segments.shift();
            this.segIdx -= 1;
            node.setParent(this.node);
            if (this.isLoop) {
                this.addSements(first);
            }
            this.event.fire("add", node);
            return node;
        }
        update(dt) {
            if (!this.running)
                return;
            this.timer_check += dt;
            if (this.timer_check < this.interval_check) {
                return;
            }
            this.timer_check = 0;
            for (let i = 0; i < this.node.children.length; i++) {
                const child = this.node.children[i];
                let segP = child.position[this.dirName];
                let objP = this.referenceNode.position[this.dirName];
                let distance = objP - segP;
                if (distance < 0)
                    continue;
                if (distance > this.thesholdToRemovePrev) {
                    this.event.fire('remove', child);
                    if (this.usePool) {
                        this.poolmgr.put(child);
                    }
                    else {
                        child.destroy();
                    }
                    break;
                }
            }
            let distance2 = this.cursor - this.referenceNode.position[this.dirName];
            if (distance2 < this.thesholdToCreateNext) {
                this.curSeg = this.createNextSeg();
            }
        }
    };
    __setFunctionName(_classThis, "DynamicMap");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _usePool_decorators = [property];
        _segments_decorators = [property(cc_1.Prefab)];
        _cursor_decorators = [property];
        __dir_decorators = [property({ type: cc.Enum(Direction) })];
        _get_dir_decorators = [property({ type: cc.Enum(Direction) })];
        _isLoop_decorators = [property];
        _referenceNode_decorators = [property(cc_1.Node)];
        _thesholdToCreateNext_decorators = [property];
        _interval_check_decorators = [property];
        _thesholdToRemovePrev_decorators = [property];
        __esDecorate(_classThis, null, _get_dir_decorators, { kind: "getter", name: "dir", static: false, private: false, access: { has: obj => "dir" in obj, get: obj => obj.dir }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _usePool_decorators, { kind: "field", name: "usePool", static: false, private: false, access: { has: obj => "usePool" in obj, get: obj => obj.usePool, set: (obj, value) => { obj.usePool = value; } }, metadata: _metadata }, _usePool_initializers, _usePool_extraInitializers);
        __esDecorate(null, null, _segments_decorators, { kind: "field", name: "segments", static: false, private: false, access: { has: obj => "segments" in obj, get: obj => obj.segments, set: (obj, value) => { obj.segments = value; } }, metadata: _metadata }, _segments_initializers, _segments_extraInitializers);
        __esDecorate(null, null, _cursor_decorators, { kind: "field", name: "cursor", static: false, private: false, access: { has: obj => "cursor" in obj, get: obj => obj.cursor, set: (obj, value) => { obj.cursor = value; } }, metadata: _metadata }, _cursor_initializers, _cursor_extraInitializers);
        __esDecorate(null, null, __dir_decorators, { kind: "field", name: "_dir", static: false, private: false, access: { has: obj => "_dir" in obj, get: obj => obj._dir, set: (obj, value) => { obj._dir = value; } }, metadata: _metadata }, __dir_initializers, __dir_extraInitializers);
        __esDecorate(null, null, _isLoop_decorators, { kind: "field", name: "isLoop", static: false, private: false, access: { has: obj => "isLoop" in obj, get: obj => obj.isLoop, set: (obj, value) => { obj.isLoop = value; } }, metadata: _metadata }, _isLoop_initializers, _isLoop_extraInitializers);
        __esDecorate(null, null, _referenceNode_decorators, { kind: "field", name: "referenceNode", static: false, private: false, access: { has: obj => "referenceNode" in obj, get: obj => obj.referenceNode, set: (obj, value) => { obj.referenceNode = value; } }, metadata: _metadata }, _referenceNode_initializers, _referenceNode_extraInitializers);
        __esDecorate(null, null, _thesholdToCreateNext_decorators, { kind: "field", name: "thesholdToCreateNext", static: false, private: false, access: { has: obj => "thesholdToCreateNext" in obj, get: obj => obj.thesholdToCreateNext, set: (obj, value) => { obj.thesholdToCreateNext = value; } }, metadata: _metadata }, _thesholdToCreateNext_initializers, _thesholdToCreateNext_extraInitializers);
        __esDecorate(null, null, _interval_check_decorators, { kind: "field", name: "interval_check", static: false, private: false, access: { has: obj => "interval_check" in obj, get: obj => obj.interval_check, set: (obj, value) => { obj.interval_check = value; } }, metadata: _metadata }, _interval_check_initializers, _interval_check_extraInitializers);
        __esDecorate(null, null, _thesholdToRemovePrev_decorators, { kind: "field", name: "thesholdToRemovePrev", static: false, private: false, access: { has: obj => "thesholdToRemovePrev" in obj, get: obj => obj.thesholdToRemovePrev, set: (obj, value) => { obj.thesholdToRemovePrev = value; } }, metadata: _metadata }, _thesholdToRemovePrev_initializers, _thesholdToRemovePrev_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DynamicMap = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DynamicMap = _classThis;
})();
exports.default = DynamicMap;
