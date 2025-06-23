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
const TilemapLoader_1 = __importDefault(require("./TilemapLoader"));
const cc_1 = require("cc");
const Signal_1 = __importDefault(require("../../../framework3D/core/Signal"));
let { property, ccclass } = cc_1._decorator;
let Tilemap = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _instanceExtraInitializers = [];
    let _segCount_decorators;
    let _segCount_initializers = [];
    let _segCount_extraInitializers = [];
    let _segIndex_decorators;
    let _segIndex_initializers = [];
    let _segIndex_extraInitializers = [];
    let __path_decorators;
    let __path_initializers = [];
    let __path_extraInitializers = [];
    let _get_path_decorators;
    var Tilemap = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.data = __runInitializers(this, _instanceExtraInitializers);
            this.fromBottom = true;
            this.segCount = __runInitializers(this, _segCount_initializers, 1);
            this.segIndex = (__runInitializers(this, _segCount_extraInitializers), __runInitializers(this, _segIndex_initializers, 0));
            this._path = (__runInitializers(this, _segIndex_extraInitializers), __runInitializers(this, __path_initializers, ""));
            this.onLoaded = (__runInitializers(this, __path_extraInitializers), new Signal_1.default());
            this.onRenderGrid = new Signal_1.default();
        }
        get path() {
            return this._path;
        }
        get segHeight() {
            return this.data.height / this.segCount;
        }
        // 分段
        onLoad() {
        }
        set path(val) {
            this._path = val;
            TilemapLoader_1.default.loadTilemap(val).then(v => {
                this.data = v;
                this.onLoaded.fire(this);
                // this.render()
            });
        }
        start() {
        }
        getMapSize() {
            return (0, cc_1.size)(this.data.width, this.data.height);
        }
        getTileSize() {
            return (0, cc_1.size)(this.data.tilewidth, this.data.tileheight);
        }
        render() {
            for (var i = 0; i < this.data.layers.length; i++) {
                var alyer = this.data.layers[i];
                if (alyer.type == "tilelayer") {
                    this.renderLayer(alyer, i);
                }
                else if (alyer.type == 'objectgroup') {
                    this.renderObjectLayer(alyer, i);
                }
            }
        }
        getLayer(layerName) {
            return this.data.layers.find(v => v.name == layerName);
        }
        /** x, y coord 坐标，左下为0,0  */
        getGid(layer, x, y) {
            return layer.data[(this.data.height - y - 1) * layer.width + x];
        }
        getPositionAt(x, y) {
            return (0, cc_1.v2)(this.data.tilewidth * x, this.data.tileheight * (this.data.height - y - 1));
        }
        /**以0，0 为中心点，转换坐标 */
        translateToCenter(x, y, scale = 1) {
            let size = this.getMapSize();
            let hh = size.height / 2;
            let hw = size.width / 2;
            return (0, cc_1.v2)((x - hw + 0.5) * scale, (-y + hh - 0.5) * scale);
        }
        renderObjectLayer(layer, i) {
            console.warn("not implement !");
        }
        // 0 ,0 ,0, 0
        // 0 ,0 ,0, 0
        // 0 ,0 ,0, 0
        // 0 ,1 ,0, 0
        renderLayer(layer, layerIndex) {
            //左上开始 =》 左下开始
            for (var i = 0; i < layer.width; i++) {
                let segHeight = this.segHeight;
                for (var j = 0; j < segHeight; j++) {
                    let y = j;
                    if (this.fromBottom) {
                        y = layer.height - this.segIndex * this.segCount - 1 - j;
                    }
                    let ind = (y) * layer.width + i;
                    let gid = layer.data[ind];
                    if (gid > 0) {
                        this.renderGid(gid, i, j, layerIndex);
                    }
                }
            }
        }
        renderGid(gid, x, y, layerIndex) {
            this.onRenderGrid.fire(gid, x, y, layerIndex, this);
        }
        findRectangles(layerName) {
            let layer = this.getLayer(layerName);
            var IDX = (x, y) => y * layer.width + x;
            var G = (x, y) => layer.data[IDX(x, y)];
            let mw = this.data.width;
            let mh = this.data.height;
            //向右合并
            var moveR = (gid, x, y) => {
                let ret = [];
                for (var i = x; i < mw; i++) {
                    let g = G(i, y);
                    if (gid == g) {
                        ret.push((0, cc_1.v2)(i, y));
                    }
                    else {
                        break;
                    }
                }
                return ret;
            };
            var moveD = (gid, rs) => {
                let tl = rs[0];
                let rows = []; // e: rs 
                rows.push(rs);
                for (var i = tl.y + 1; i < mh; i++) {
                    let row = [];
                    let canMove = rs.every(v => {
                        let xy = cc.v2(v.x, i);
                        let g = G(xy.x, xy.y);
                        //向下合并
                        if (g == gid) {
                            row.push(xy);
                            return true;
                            // } else if (i == mh - 1) {
                            //     //最下面一行是空也可以合并
                            //     row.push(xy)
                            //     return true;
                        }
                    });
                    if (!canMove) {
                        break;
                    }
                    rows.push(row);
                }
                return rows;
            };
            let tags = {};
            let rects_map = {};
            let tilesize = this.getTileSize();
            // let sizeInPx = size(tilesize.width * mw, tilesize.height * mh)
            let tagRect = (rows) => {
                for (var i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    for (var j = 0; j < row.length; j++) {
                        let c = row[j];
                        let idx = IDX(c.x, c.y);
                        //将该cell标记为已处理
                        tags[idx] = true;
                    }
                }
                let lt = rows[0][0];
                let rb = rows[rows.length - 1].pop();
                // let origin = this.getPositionAt(lt.x, rb.y);
                // return cc.rect(origin.x, origin.y, (rb.x - lt.x + 1) * tilesize.width, (rb.y - lt.y + 1) * tilesize.height)
                return cc.rect(lt.x, mh - rb.y - 1, rb.x - lt.x + 1, rb.y - lt.y + 1);
            };
            for (var x = 0; x < mw; x++) {
                for (var y = 0; y < mh; y++) {
                    let c = (0, cc_1.v2)(x, y);
                    let gid = G(c.x, c.y);
                    let idx = IDX(c.x, c.y);
                    if (gid != 0 && tags[idx] == null) {
                        //move right 
                        let rows = moveD(gid, moveR(gid, x, y));
                        let rect = tagRect(rows);
                        let rects = rects_map[gid];
                        if (rects == null) {
                            rects = [];
                            rects_map[gid] = rects;
                        }
                        rects.push(rect);
                    }
                }
            }
            // let sum = Object.keys(rects_map).reduce((sum, v) => {
            //     return sum + v.length;
            // }, 0)
            // for (var gid in rects_map) {
            //     var rects = rects_map[gid]
            //     console.log(`${gid || "unknown type:" + gid}: ${rects.length} count`)
            // }
            return rects_map;
        }
    };
    __setFunctionName(_classThis, "Tilemap");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _segCount_decorators = [property];
        _segIndex_decorators = [property];
        __path_decorators = [property];
        _get_path_decorators = [property];
        __esDecorate(_classThis, null, _get_path_decorators, { kind: "getter", name: "path", static: false, private: false, access: { has: obj => "path" in obj, get: obj => obj.path }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _segCount_decorators, { kind: "field", name: "segCount", static: false, private: false, access: { has: obj => "segCount" in obj, get: obj => obj.segCount, set: (obj, value) => { obj.segCount = value; } }, metadata: _metadata }, _segCount_initializers, _segCount_extraInitializers);
        __esDecorate(null, null, _segIndex_decorators, { kind: "field", name: "segIndex", static: false, private: false, access: { has: obj => "segIndex" in obj, get: obj => obj.segIndex, set: (obj, value) => { obj.segIndex = value; } }, metadata: _metadata }, _segIndex_initializers, _segIndex_extraInitializers);
        __esDecorate(null, null, __path_decorators, { kind: "field", name: "_path", static: false, private: false, access: { has: obj => "_path" in obj, get: obj => obj._path, set: (obj, value) => { obj._path = value; } }, metadata: _metadata }, __path_initializers, __path_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Tilemap = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Tilemap = _classThis;
})();
exports.default = Tilemap;
