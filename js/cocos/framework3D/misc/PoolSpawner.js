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
exports.Spawner = void 0;
const cc_1 = require("cc");
const PoolManager_1 = __importDefault(require("../core/PoolManager"));
const ccUtil_1 = __importDefault(require("../utils/ccUtil"));
let { ccclass, property, menu } = cc_1._decorator;
let Spawner = (() => {
    let _classDecorators = [ccclass("Spawner")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _spawnerName_decorators;
    let _spawnerName_initializers = [];
    let _spawnerName_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    let _prefab_decorators;
    let _prefab_initializers = [];
    let _prefab_extraInitializers = [];
    let _usePrefab_decorators;
    let _usePrefab_initializers = [];
    let _usePrefab_extraInitializers = [];
    var Spawner = _classThis = class {
        constructor() {
            this.spawnerName = __runInitializers(this, _spawnerName_initializers, "");
            this.template = (__runInitializers(this, _spawnerName_extraInitializers), __runInitializers(this, _template_initializers, null));
            this.prefab = (__runInitializers(this, _template_extraInitializers), __runInitializers(this, _prefab_initializers, null));
            this.usePrefab = (__runInitializers(this, _prefab_extraInitializers), __runInitializers(this, _usePrefab_initializers, true));
            __runInitializers(this, _usePrefab_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Spawner");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _spawnerName_decorators = [property];
        _template_decorators = [property({ type: cc_1.Node, visible() { return !this.usePrefab; } })];
        _prefab_decorators = [property({ type: cc_1.Prefab, visible() { return this.usePrefab; } })];
        _usePrefab_decorators = [property()];
        __esDecorate(null, null, _spawnerName_decorators, { kind: "field", name: "spawnerName", static: false, private: false, access: { has: obj => "spawnerName" in obj, get: obj => obj.spawnerName, set: (obj, value) => { obj.spawnerName = value; } }, metadata: _metadata }, _spawnerName_initializers, _spawnerName_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, null, _prefab_decorators, { kind: "field", name: "prefab", static: false, private: false, access: { has: obj => "prefab" in obj, get: obj => obj.prefab, set: (obj, value) => { obj.prefab = value; } }, metadata: _metadata }, _prefab_initializers, _prefab_extraInitializers);
        __esDecorate(null, null, _usePrefab_decorators, { kind: "field", name: "usePrefab", static: false, private: false, access: { has: obj => "usePrefab" in obj, get: obj => obj.usePrefab, set: (obj, value) => { obj.usePrefab = value; } }, metadata: _metadata }, _usePrefab_initializers, _usePrefab_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Spawner = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Spawner = _classThis;
})();
exports.Spawner = Spawner;
let PoolSpawner = (() => {
    let _classDecorators = [ccclass, menu("mimgame/PoolSpawner")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _poolName_decorators;
    let _poolName_initializers = [];
    let _poolName_extraInitializers = [];
    let _spawners_decorators;
    let _spawners_initializers = [];
    let _spawners_extraInitializers = [];
    var PoolSpawner = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.poolManager = null;
            this.target = __runInitializers(this, _target_initializers, null);
            this.poolName = (__runInitializers(this, _target_extraInitializers), __runInitializers(this, _poolName_initializers, ""));
            this.spawners = (__runInitializers(this, _poolName_extraInitializers), __runInitializers(this, _spawners_initializers, []));
            this.dynamicPrefabs = (__runInitializers(this, _spawners_extraInitializers), {});
            this.dynamicPrefabs_loaded = {};
            this._spawners = {};
        }
        addSpawner(key, prefab) {
            let spawner = this._spawners[key];
            if (spawner == null) {
                spawner = new Spawner();
                spawner.usePrefab = true;
                spawner.prefab = prefab;
                this._spawners[key] = spawner;
            }
        }
        hasSpawner(key) {
            return this._spawners[key] != null;
        }
        static get(name) {
            return PoolSpawner._instances[name];
        }
        onLoad() {
            this.poolManager = new PoolManager_1.default(this.target || this.node, this.onCreateObject, this);
            this.poolManager.name = this.poolName;
            this.spawners.forEach(v => {
                this._spawners[v.spawnerName] = v;
            });
            PoolSpawner._instances[this.poolName] = this;
        }
        //mark first,later load 
        preload(key, path) {
            this.dynamicPrefabs[key] = path;
            this.dynamicPrefabs_loaded[key] = false;
        }
        //preload prefab 
        preloadPrefabs() {
            let arr = [];
            for (let k in this.dynamicPrefabs) {
                let v = this.dynamicPrefabs[k];
                let loaded = this.dynamicPrefabs_loaded[k];
                if (!loaded) {
                    let promise = ccUtil_1.default.getRes(v, cc_1.Prefab).then(v => {
                        let spawner = new Spawner();
                        spawner.usePrefab = true;
                        spawner.prefab = v;
                        this._spawners[k] = spawner;
                        this.dynamicPrefabs_loaded[k] = true;
                    });
                    arr.push(promise);
                }
            }
            return Promise.all(arr);
        }
        onDestroy() {
            this.poolManager.destroy();
            PoolSpawner._instances[this.poolName] = null;
        }
        onCreateObject(type) {
            let cfg = this._spawners[type];
            if (cfg == null) {
                return console.error("Cannot get node from [" + this.poolName + "] pool by " + type);
            }
            return (0, cc_1.instantiate)(cfg.usePrefab && cfg.prefab || cfg.template);
        }
        start() {
            this.preloadPrefabs();
        }
    };
    __setFunctionName(_classThis, "PoolSpawner");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _target_decorators = [property(cc_1.Node)];
        _poolName_decorators = [property];
        _spawners_decorators = [property([Spawner])];
        __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
        __esDecorate(null, null, _poolName_decorators, { kind: "field", name: "poolName", static: false, private: false, access: { has: obj => "poolName" in obj, get: obj => obj.poolName, set: (obj, value) => { obj.poolName = value; } }, metadata: _metadata }, _poolName_initializers, _poolName_extraInitializers);
        __esDecorate(null, null, _spawners_decorators, { kind: "field", name: "spawners", static: false, private: false, access: { has: obj => "spawners" in obj, get: obj => obj.spawners, set: (obj, value) => { obj.spawners = value; } }, metadata: _metadata }, _spawners_initializers, _spawners_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PoolSpawner = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis._instances = {};
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PoolSpawner = _classThis;
})();
exports.default = PoolSpawner;
