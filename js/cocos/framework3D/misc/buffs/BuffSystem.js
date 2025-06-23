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
exports.buffSystem = void 0;
const cc_1 = require("cc");
const EmptyBuff_1 = __importDefault(require("./EmptyBuff"));
const { ccclass, property } = cc_1._decorator;
/**
 * TODO:
// BuffManager.register(OutputSpeedupBuff, ()=>PlayerInfo.buff_outputSpeed = this.timeLeft);
 */
exports.buffSystem = null;
let BuffSystem = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    var BuffSystem = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.buffs = {};
        }
        onLoad() {
            exports.buffSystem = this;
            this.load();
        }
        onEnable() {
            this.schedule(this.step, 1);
        }
        onDisable() {
            this.unschedule(this.step);
        }
        step() {
            let now = Date.now() / 1000;
            for (var i in this.buffs) {
                let buf = this.buffs[i];
                if (buf.isEnabled) {
                    buf.doStep(now);
                    if (!buf.isEnabled) {
                        buf.disable();
                    }
                }
            }
        }
        static register(name, cls, data) {
            BuffSystem.buff_cls[name] = cls;
            BuffSystem.buff_cls_data[name] = data;
        }
        _create(buffname) {
            let cls = BuffSystem.buff_cls[buffname];
            if (cls == null) {
                if (typeof (buffname) == "string") {
                    console.error("[BuffSystem]:" + buffname + "未注册 ！");
                    return new EmptyBuff_1.default();
                }
                else {
                    return new buffname;
                }
            }
            else {
                let data = BuffSystem.buff_cls_data[buffname];
                let buff = new cls();
                buff.name = buffname;
                buff.data = data;
                return buff;
            }
        }
        getBuff(buffname) {
            let buf = this.buffs[buffname];
            if (!buf) {
                buf = this._create(buffname);
                this.buffs[buffname] = buf;
            }
            return buf;
        }
        /**第一个参数 必然是duration  */
        startBuff(buffname, ...a) {
            let buf = this.getBuff(buffname);
            if (buf.isEnabled) {
                if (buf.canAdd) {
                    buf.addLife(a[0]);
                }
                else {
                    buf.resetLife();
                }
            }
            else {
                buf.enable(...a);
            }
            return buf;
        }
        stop(buffname) {
            let buf = this.getBuff(buffname);
            if (buf.isEnabled)
                buf.disable();
        }
        save() {
            console.log(this.buffs);
            for (var k in this.buffs) {
                let v = this.buffs[k];
                v.save();
            }
            //保存离线时间 
            localStorage.setItem("buffSys.lastTime", Date.now().toString());
        }
        load() {
            let last = localStorage.getItem("buffSys.lastTime");
            let lastTime;
            if (last == null || last == "") {
                lastTime = Date.now();
            }
            else {
                lastTime = parseInt(last);
            }
            let now = Date.now();
            let offset = (now - lastTime) / 1000;
            if (offset < 0)
                return;
            for (var k in BuffSystem.buff_cls) {
                let inst = this.getBuff(k);
                inst.load(offset);
                inst.recovery();
            }
        }
    };
    __setFunctionName(_classThis, "BuffSystem");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BuffSystem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.buff_cls = {};
    _classThis.buff_cls_data = {};
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BuffSystem = _classThis;
})();
exports.default = BuffSystem;
