"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Signal_1 = __importDefault(require("./Signal"));
const cc_1 = require("cc");
class PoolManager {
    constructor(root, onCreateObject, target) {
        this.nodePool = {};
        this.nodes = {};
        this.managed = false;
        this.aliveObjects = [];
        this.onRecycleSignal = new Signal_1.default();
        this._id = '0';
        this._autoRecycle = false;
        this.log = false;
        this.onCreateObject = onCreateObject;
        this.target = target;
        this.root = root;
        this._id = PoolManager._idInc++ + "";
        PoolManager._instances[this._id] = this;
        // this.autoRecycle = this._autoRecycle;
    }
    set autoRecycle(v) {
        if (v) {
            this.root && this.root.on(cc_1.SystemEventType.CHILD_REMOVED, this.onNodeRemove, this);
        }
        else {
            this.root && this.root.off(cc_1.SystemEventType.CHILD_REMOVED, this.onNodeRemove, this);
        }
        this._autoRecycle = v;
    }
    set name(v) {
        delete PoolManager._instances[this._id];
        this._id = v;
        PoolManager._instances[this._id] = this;
    }
    static get(name) {
        return PoolManager._instances[name];
    }
    destroy() {
        this.clear();
        delete PoolManager._instances[this._id];
    }
    onNodeRemove(node) {
        this.put(node);
        this.onRecycleSignal.fire(node);
    }
    objects() {
        return this.aliveObjects;
    }
    clearAlives() {
        for (var i = 0; i < this.aliveObjects.length;) {
            let obj = this.aliveObjects[i];
            obj.destroy();
            obj.destroyAllChildren();
            delete this.aliveObjects[i];
        }
    }
    getPool(type) {
        if (typeof (type) == "object") {
            type = type._uuid || type.name;
        }
        let pool = this.nodePool[type];
        if (pool == null) {
            pool = new cc_1.NodePool();
            this.nodePool[type] = pool;
        }
        return pool;
    }
    get(type) {
        let node = this.getPool(type).get();
        if (this.onCreateObject) {
            if (node == null) {
                node = this.onCreateObject.call(this.target, type);
                if (this.root)
                    node.setParent(this.root);
                if (!node)
                    console.warn(node, "onCreateObject must return an object");
                if (this.managed)
                    this.aliveObjects.push(node);
                this.nodes[node.uuid] = type;
                return node;
            }
            else {
                if (this.log) {
                    console.warn("[PoolManager]retrive from pool:", node.name);
                }
            }
        }
        if (this.root) {
            node.active = true;
            node.setParent(this.root);
        }
        if (this.managed)
            this.aliveObjects.push(node);
        return node;
    }
    tag(node, type) {
        this.nodes[node.uuid] = type;
    }
    put(node, type = null) {
        if (type == null)
            type = this.nodes[node.uuid];
        this.getPool(type).put(node);
        if (this.managed)
            this.aliveObjects.splice(this.aliveObjects.indexOf(node), 1);
    }
    clear(type) {
        if (this.managed) {
            this.clearAlives();
        }
        if (type)
            this.getPool(type).clear();
        else {
            // this.root.off(SystemEventType.CHILD_REMOVED, this.onNodeRemove, this)
            for (var t in this.nodePool) {
                let pool = this.nodePool[t];
                pool.clear();
                delete this.nodePool[t];
            }
            for (var k in this.nodes) {
                delete this.nodes[k];
            }
        }
    }
    size(type) {
        return this.getPool(type).size();
    }
}
PoolManager._instances = {};
PoolManager._idInc = 0;
exports.default = PoolManager;
window['PoolManager'] = PoolManager;
