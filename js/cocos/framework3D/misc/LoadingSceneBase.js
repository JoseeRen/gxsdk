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
const cc_1 = require("cc");
const Platform_1 = __importDefault(require("../extension/Platform"));
const { ccclass, property } = cc_1._decorator;
let targetScene = null;
let LoadingSceneBase = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _defaultSceneName_decorators;
    let _defaultSceneName_initializers = [];
    let _defaultSceneName_extraInitializers = [];
    let _label_decorators;
    let _label_initializers = [];
    let _label_extraInitializers = [];
    let _percentLabel_decorators;
    let _percentLabel_initializers = [];
    let _percentLabel_extraInitializers = [];
    let _bar_decorators;
    let _bar_initializers = [];
    let _bar_extraInitializers = [];
    var LoadingSceneBase = _classThis = class extends _classSuper {
        onLoad() {
            targetScene = targetScene || this.defaultSceneName;
        }
        start() {
            this.bar.progress = 0;
            this.label.string = "加载中...";
        }
        set progress(p) {
            if (this.bar) {
                this.bar.progress = p;
                this.percentLabel.string = Math.floor(p * 100) + "%";
            }
        }
        loadNextScene(prefabTobeLoad) {
            targetScene = targetScene || this.defaultSceneName;
            this.label.string = '加载场景资源';
            return new Promise((resolve, reject) => {
                cc_1.director.preloadScene(targetScene, (c, t, i) => {
                    this.percentLabel.string = `${(c / t * 100).toFixed(1)}%`;
                    this.bar.progress = c / t;
                }, _ => {
                    // evt.emit("SceneChange")
                    if (prefabTobeLoad) {
                        cc_1.resources.load(prefabTobeLoad, cc_1.Prefab, (err, prefab) => {
                            cc_1.director.loadScene(targetScene, _ => {
                                let node = (0, cc_1.instantiate)(prefab);
                                cc_1.director.getScene().addChild(node);
                                resolve(1);
                                this.onLoadFinished();
                            }, null);
                        });
                    }
                    else {
                        cc_1.director.loadScene(targetScene, _ => {
                            resolve(1);
                            this.onLoadFinished();
                        }, null);
                    }
                });
            });
        }
        onLoadFinished(node) {
            let root = (0, cc_1.find)("Canvas");
            if (root) {
                root.getComponents(cc_1.Component).forEach((v) => {
                    if (v.onLoadFinished) {
                        v.onLoadFinished(LoadingSceneBase.param, node);
                    }
                });
            }
        }
        loadSubPackage(packageName, txt) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(0, cc_1.isValid)(this))
                    return;
                if (this.label) {
                    this.label.string = txt;
                }
                yield Platform_1.default.loadSubPackage(packageName, (p, k, t) => {
                    this.progress = p / 100;
                });
            });
        }
        static setNextScene(scene) {
            targetScene = scene;
        }
        static getNextScene() {
            return targetScene;
        }
        static goto(sceneName, loadingSceneName = "LoadingScene", param = null) {
            LoadingSceneBase.param = param;
            targetScene = sceneName;
            cc_1.director.loadScene(loadingSceneName, null, null);
        }
        constructor() {
            super(...arguments);
            this.defaultSceneName = __runInitializers(this, _defaultSceneName_initializers, "Home");
            this.label = (__runInitializers(this, _defaultSceneName_extraInitializers), __runInitializers(this, _label_initializers, null));
            this.percentLabel = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _percentLabel_initializers, null));
            this.bar = (__runInitializers(this, _percentLabel_extraInitializers), __runInitializers(this, _bar_initializers, null));
            __runInitializers(this, _bar_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LoadingSceneBase");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _defaultSceneName_decorators = [property];
        _label_decorators = [property(cc_1.LabelComponent)];
        _percentLabel_decorators = [property(cc_1.LabelComponent)];
        _bar_decorators = [property(cc_1.ProgressBarComponent)];
        __esDecorate(null, null, _defaultSceneName_decorators, { kind: "field", name: "defaultSceneName", static: false, private: false, access: { has: obj => "defaultSceneName" in obj, get: obj => obj.defaultSceneName, set: (obj, value) => { obj.defaultSceneName = value; } }, metadata: _metadata }, _defaultSceneName_initializers, _defaultSceneName_extraInitializers);
        __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
        __esDecorate(null, null, _percentLabel_decorators, { kind: "field", name: "percentLabel", static: false, private: false, access: { has: obj => "percentLabel" in obj, get: obj => obj.percentLabel, set: (obj, value) => { obj.percentLabel = value; } }, metadata: _metadata }, _percentLabel_initializers, _percentLabel_extraInitializers);
        __esDecorate(null, null, _bar_decorators, { kind: "field", name: "bar", static: false, private: false, access: { has: obj => "bar" in obj, get: obj => obj.bar, set: (obj, value) => { obj.bar = value; } }, metadata: _metadata }, _bar_initializers, _bar_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoadingSceneBase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.param = null;
    _classThis.ResPrefab = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoadingSceneBase = _classThis;
})();
exports.default = LoadingSceneBase;
