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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PsFx_1 = __importDefault(require("./PsFx"));
const PoolManager_1 = __importDefault(require("../../core/PoolManager"));
const cc_1 = require("cc");
const { ccclass, property, menu } = cc_1._decorator;
let PsSpawner = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    var PsSpawner = _classThis = class extends _classSuper {
        onLoad() {
            this.poolmgr = new PoolManager_1.default();
        }
        start() {
        }
        clear() {
            if (this.poolmgr)
                this.poolmgr.clear();
        }
        getFx(prefabPath) {
            return new Promise((resolve, reject) => {
                let node = this.poolmgr.get(prefabPath);
                if (node == null) {
                    if (prefabPath instanceof cc_1.Prefab) {
                        node = (0, cc_1.instantiate)(prefabPath);
                        this.poolmgr.tag(node, prefabPath);
                    }
                    else {
                        cc_1.resources.load(prefabPath, cc_1.Prefab, (e, prefab) => {
                            node = (0, cc_1.instantiate)(prefab);
                            node.setParent(this.node);
                            this.poolmgr.tag(node, prefabPath);
                            let psfx = node.getOrAddComponent(PsFx_1.default);
                            psfx.name = prefabPath;
                            resolve(psfx);
                        });
                        return;
                    }
                }
                node.setParent(this.node);
                node.active = false;
                let psfx = node.getOrAddComponent(PsFx_1.default);
                psfx.reset();
                resolve(psfx);
            });
        }
        preload(prefabPath, num) {
            for (var i = 0; i < num; i++) {
                this.getFx(prefabPath).then(fx => {
                    this.onFxFinshPlay(fx);
                });
            }
        }
        onFxFinshPlay(fx) {
            this.poolmgr.put(fx.node);
        }
        finish(fx) {
            this.poolmgr.put(fx.node);
        }
        play(prefabPath_1) {
            return __awaiter(this, arguments, void 0, function* (prefabPath, pos = cc_1.Vec3.ZERO, rotation = 0, audio, spriteframe) {
                let fx = yield this.getFx(prefabPath);
                fx.node.worldPosition = pos;
                fx.node.eulerAngles = (0, cc_1.v3)(0, 0, rotation);
                yield fx.play(audio, spriteframe);
                this.onFxFinshPlay(fx);
            });
        }
        playWithoutFinish(prefabPath_1) {
            return __awaiter(this, arguments, void 0, function* (prefabPath, pos = cc_1.Vec3.ZERO, rotation = 0, audio, spriteframe) {
                let fx = yield this.getFx(prefabPath);
                fx.node.worldPosition = pos;
                fx.node.eulerAngles = (0, cc_1.v3)(0, 0, rotation);
                yield fx.play(audio, spriteframe);
                //this.onFxFinshPlay(fx);
            });
        }
        play2(prefabPath_1) {
            return __awaiter(this, arguments, void 0, function* (prefabPath, pos = cc_1.Vec3.ZERO, rotation = 0, scale = 0) {
                let fx = yield this.getFx(prefabPath);
                fx.node.worldPosition = pos;
                fx.node.scale = (0, cc_1.v3)(scale, scale, scale);
                fx.node.eulerAngles = (0, cc_1.v3)(0, 0, rotation);
                yield fx.play();
                this.onFxFinshPlay(fx);
            });
        }
        play3(prefabPath_1) {
            return __awaiter(this, arguments, void 0, function* (prefabPath, pos = cc_1.Vec3.ZERO) {
                let fx = yield this.getFx(prefabPath);
                fx.node.worldPosition = pos;
                fx.play().then(_ => this.onFxFinshPlay(fx));
                return fx;
            });
        }
        playWithTxt(prefabPath_1) {
            return __awaiter(this, arguments, void 0, function* (prefabPath, pos = cc_1.Vec3.ZERO, text) {
                let fx = yield this.getFx(prefabPath);
                fx.node.worldPosition = pos;
                let label = fx.node.getComponentInChildren(cc_1.LabelComponent);
                if (label) {
                    label.string = text;
                }
                fx.play().then(_ => this.onFxFinshPlay(fx));
                return fx;
            });
        }
    };
    __setFunctionName(_classThis, "PsSpawner");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PsSpawner = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PsSpawner = _classThis;
})();
exports.default = PsSpawner;
