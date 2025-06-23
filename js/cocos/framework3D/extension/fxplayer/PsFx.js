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
const Device_1 = __importDefault(require("../../misc/Device"));
const ccUtil_1 = __importDefault(require("../../utils/ccUtil"));
const { ccclass, property, menu } = cc_1._decorator;
let PsFx = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc_1.Component;
    let _sfx_decorators;
    let _sfx_initializers = [];
    let _sfx_extraInitializers = [];
    let _sprite_decorators;
    let _sprite_initializers = [];
    let _sprite_extraInitializers = [];
    let _childAnimation_decorators;
    let _childAnimation_initializers = [];
    let _childAnimation_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _repeatTime_decorators;
    let _repeatTime_initializers = [];
    let _repeatTime_extraInitializers = [];
    let _removeAfterFinish_decorators;
    let _removeAfterFinish_initializers = [];
    let _removeAfterFinish_extraInitializers = [];
    let _hideAfterFinish_decorators;
    let _hideAfterFinish_initializers = [];
    let _hideAfterFinish_extraInitializers = [];
    let _resetOrigin_decorators;
    let _resetOrigin_initializers = [];
    let _resetOrigin_extraInitializers = [];
    var PsFx = _classThis = class extends _classSuper {
        get label() {
            if (this._label == null) {
                this._label = this.getComponentInChildren(cc_1.LabelComponent);
            }
            return this._label;
        }
        onLoad() {
            if (this.sprite == null) {
                this.sprite = this.getComponent(cc_1.SpriteComponent);
                this.sprite = this.sprite || this.node.getComponentInChildren(cc_1.SpriteComponent);
            }
            let anim = this.getComponent(cc_1.AnimationComponent);
            if (anim) {
                this.animations.push(anim);
            }
            let root_ps = this.getComponent(cc_1.ParticleSystemComponent);
            root_ps && this.particles.push(root_ps);
            for (let i = 0; i < this.node.children.length; i++) {
                const child = this.node.children[i];
                let ps = child.getComponent(cc_1.ParticleSystemComponent);
                if (ps)
                    this.particles.push(ps);
                else if (this.childAnimation) {
                    let anim = child.getComponent(cc_1.AnimationComponent);
                    if (anim)
                        this.animations.push(anim);
                }
            }
            // if (typeof (dragonBones) != "undefined") {
            //     this.armature = this.getComponent(dragonBones.ArmatureDisplay);
            //     // if (!this.armature)
            //     // this.armature = this.getComponentInChildren(dragonBones.ArmatureDisplay);
            //     if (this.armature) {
            //         this.defaultAnim = this.armature.animationName
            //     }
            // }
        }
        play(audio = null, spriteFrame = null) {
            this.isPlaying = true;
            let dur = 0;
            if (audio) {
                this.sfx = audio;
            }
            if (spriteFrame) {
                if (typeof (spriteFrame) == "string") {
                    ccUtil_1.default.setDisplay(this.sprite, spriteFrame);
                }
                else {
                    this.sprite.spriteFrame = spriteFrame;
                }
            }
            this.node.active = true;
            for (let i = 0; i < this.particles.length; i++) {
                const element = this.particles[i];
                element.clear();
                element.play();
                // element.resetSystem();
                if (dur < element.duration) {
                    dur = element.duration + element.startLifetime.constantMax;
                }
            }
            for (let i = 0; i < this.animations.length; i++) {
                const element = this.animations[i];
                let clips = element.clips;
                if (clips && clips.length > 0) {
                    let clip = clips[0];
                    let duration = clip.duration / clip.speed;
                    if (duration > dur) {
                        dur = duration;
                    }
                    element.play(clip.name);
                }
            }
            if (this.sfx) {
                Device_1.default.playEffect(this.sfx, false);
            }
            // if (this.armature) {
            //     this.armature.playAnimation(this.defaultAnim, this.repeatTime);
            //     dur = this.duration
            //     if (dur <= 0) {
            //         return new Promise((resolve, reject) => {
            //             // this.armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, _=>{
            //             //     console.log("loop complete");
            //             //     this.fadeOnFinish(resolve)
            //             // })
            //             this.armature.addEventListener(dragonBones.EventObject.COMPLETE, _ => {
            //                 console.log("armature play complete");
            //                 if (this.removeAfterFinish) {
            //                     this.node.removeFromParent();
            //                 } else {
            //                     this.fadeOnFinish(resolve)
            //                 }
            //             })
            //         })
            //     }
            // } else {
            if (this.duration > 0) {
                dur = this.duration;
            }
            else {
                dur = dur + 0.1;
            }
            // }
            // console.log("[psfx] play : " ,  this.name,  dur);
            return new Promise((resolve, reject) => {
                this.scheduleOnce(_ => {
                    if (!this.isValid)
                        return resolve();
                    if (this.removeAfterFinish) {
                        this.node.removeFromParent();
                        resolve();
                    }
                    else {
                        this.fadeOnFinish(resolve);
                    }
                }, dur);
            });
        }
        fadeOnFinish(callback) {
            this.isPlaying = false;
            for (let i = 0; i < this.particles.length; i++) {
                const element = this.particles[i];
                element.stop();
            }
            // if (this.fadeAfterFinish > 0) {
            //     let seq = cc.sequence(cc.fadeOut(this.fadeAfterFinish), cc.callFunc(callback))
            //     this.node.runAction(seq)
            // } else {
            if (this.hideAfterFinish) {
                this.node.active = false;
            }
            callback();
            // }
        }
        reset() {
            if (this.resetOrigin)
                this.node.position = cc_1.Vec3.ZERO;
            // this.node.opacity = 255;
            this.animations.forEach(v => v.stepTo(0));
        }
        start() {
        }
        constructor() {
            super(...arguments);
            // @property([cc.ParticleSystem])
            this.particles = [];
            // @property([cc.Animation])
            this.animations = [];
            // armature:dragonBones.ArmatureDisplay = null
            //armature: dragonBones.ArmatureDisplay = null;
            this.defaultAnim = '';
            // name:string = null;
            // _callback:Function;
            // _target:any;
            this.isPlaying = false;
            this.sfx = __runInitializers(this, _sfx_initializers, null);
            this.sprite = (__runInitializers(this, _sfx_extraInitializers), __runInitializers(this, _sprite_initializers, null));
            this.childAnimation = (__runInitializers(this, _sprite_extraInitializers), __runInitializers(this, _childAnimation_initializers, true));
            this.duration = (__runInitializers(this, _childAnimation_extraInitializers), __runInitializers(this, _duration_initializers, -1));
            this.repeatTime = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _repeatTime_initializers, 1));
            this.removeAfterFinish = (__runInitializers(this, _repeatTime_extraInitializers), __runInitializers(this, _removeAfterFinish_initializers, false));
            this.hideAfterFinish = (__runInitializers(this, _removeAfterFinish_extraInitializers), __runInitializers(this, _hideAfterFinish_initializers, true));
            this._label = (__runInitializers(this, _hideAfterFinish_extraInitializers), null);
            this.resetOrigin = __runInitializers(this, _resetOrigin_initializers, true);
            __runInitializers(this, _resetOrigin_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PsFx");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _sfx_decorators = [property(cc_1.AudioClip)];
        _sprite_decorators = [property(cc_1.SpriteComponent)];
        _childAnimation_decorators = [property];
        _duration_decorators = [property];
        _repeatTime_decorators = [property];
        _removeAfterFinish_decorators = [property];
        _hideAfterFinish_decorators = [property];
        _resetOrigin_decorators = [property];
        __esDecorate(null, null, _sfx_decorators, { kind: "field", name: "sfx", static: false, private: false, access: { has: obj => "sfx" in obj, get: obj => obj.sfx, set: (obj, value) => { obj.sfx = value; } }, metadata: _metadata }, _sfx_initializers, _sfx_extraInitializers);
        __esDecorate(null, null, _sprite_decorators, { kind: "field", name: "sprite", static: false, private: false, access: { has: obj => "sprite" in obj, get: obj => obj.sprite, set: (obj, value) => { obj.sprite = value; } }, metadata: _metadata }, _sprite_initializers, _sprite_extraInitializers);
        __esDecorate(null, null, _childAnimation_decorators, { kind: "field", name: "childAnimation", static: false, private: false, access: { has: obj => "childAnimation" in obj, get: obj => obj.childAnimation, set: (obj, value) => { obj.childAnimation = value; } }, metadata: _metadata }, _childAnimation_initializers, _childAnimation_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _repeatTime_decorators, { kind: "field", name: "repeatTime", static: false, private: false, access: { has: obj => "repeatTime" in obj, get: obj => obj.repeatTime, set: (obj, value) => { obj.repeatTime = value; } }, metadata: _metadata }, _repeatTime_initializers, _repeatTime_extraInitializers);
        __esDecorate(null, null, _removeAfterFinish_decorators, { kind: "field", name: "removeAfterFinish", static: false, private: false, access: { has: obj => "removeAfterFinish" in obj, get: obj => obj.removeAfterFinish, set: (obj, value) => { obj.removeAfterFinish = value; } }, metadata: _metadata }, _removeAfterFinish_initializers, _removeAfterFinish_extraInitializers);
        __esDecorate(null, null, _hideAfterFinish_decorators, { kind: "field", name: "hideAfterFinish", static: false, private: false, access: { has: obj => "hideAfterFinish" in obj, get: obj => obj.hideAfterFinish, set: (obj, value) => { obj.hideAfterFinish = value; } }, metadata: _metadata }, _hideAfterFinish_initializers, _hideAfterFinish_extraInitializers);
        __esDecorate(null, null, _resetOrigin_decorators, { kind: "field", name: "resetOrigin", static: false, private: false, access: { has: obj => "resetOrigin" in obj, get: obj => obj.resetOrigin, set: (obj, value) => { obj.resetOrigin = value; } }, metadata: _metadata }, _resetOrigin_initializers, _resetOrigin_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PsFx = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PsFx = _classThis;
})();
exports.default = PsFx;
