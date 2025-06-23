"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const EventManager_1 = require("../core/EventManager");
const SpriteFrameCache_1 = __importDefault(require("../misc/SpriteFrameCache"));
const display_1 = __importDefault(require("../misc/display"));
const PositionAnim_1 = __importDefault(require("../extension/qanim/PositionAnim"));
const EaseType_1 = require("../extension/qanim/EaseType");
class ccUtil {
    static Instantiate(origin, position, rotation) {
        let node = (0, cc_1.instantiate)(origin);
        if (position)
            node.position = position;
        if (rotation)
            node.rotation = rotation;
        return node;
    }
    static playParticles(ps) {
        if (ps) {
            if (ps instanceof cc_1.Node) {
                ps.active = true;
            }
            else {
                ps.node.active = true;
            }
            let subs = ps["_subParticles"];
            if (subs == null) {
                subs = ps.getComponentsInChildren(cc_1.ParticleSystemComponent);
                ps["_subParticles"] = subs;
            }
            subs.forEach(v => {
                v.play();
            });
        }
    }
    static playAnimation(anim, stopAfter = 0) {
        if (anim instanceof cc_1.Node) {
            anim = anim.getComponent(cc_1.AnimationComponent);
        }
        if (anim == null) {
            console.warn("PlayAnimation failed :" + anim.name);
            return Promise.resolve();
        }
        anim.play();
        if (stopAfter) {
            if (stopAfter > 0)
                EventManager_1.evt.sleep(stopAfter).then(v => {
                    anim.stop();
                });
        }
        else {
            return new Promise(resolve => {
                anim.on(cc_1.EventType.FINISHED, (state) => {
                    resolve(state);
                });
            });
        }
    }
    static newButton(target, component, handler, listener, data) {
        listener = listener || target;
        let button = target.getComponent(cc_1.ButtonComponent);
        if (button == null)
            button = target.addComponent(cc_1.ButtonComponent);
        button.transition = cc_1.ButtonComponent.Transition.SCALE;
        if (button.clickEvents.length > 0) {
            button.clickEvents.splice(0);
            // let clickEvent = button.clickEvents[0]
            // clickEvent.target = listener
            // clickEvent.customEventData = data;
            // clickEvent.component = component;
            // clickEvent.handler = handler;
        }
        button.clickEvents.push(ccUtil.handler(listener, component, handler, data));
        return button;
    }
    static handler(target, component, handler, bindstr) {
        let eventHandler = new cc_1.EventHandler();
        eventHandler.component = component;
        eventHandler.target = target;
        eventHandler.handler = handler;
        eventHandler.customEventData = bindstr;
        return eventHandler;
    }
    static get(cls, ...args) {
        //prototype.constructor.name 在js 编译后不可用
        let tt = cls.prototype;
        let idx = this.types.indexOf(tt);
        if (idx == -1) {
            this.types.push(tt);
            idx = this.types.length - 1;
        }
        let models = this.allInfos[idx];
        if (!models) {
            models = {};
            this.allInfos[idx] = models;
        }
        let _id = args.join("-");
        let info = models[_id];
        if (!info) {
            let c = cls;
            // info = new c(args)
            info = Reflect.construct(c, args);
            models[_id] = info;
        }
        return info;
    }
    static isGreaterDays(before, num = 7) {
        let now = new Date();
        var diff = now.getTime() - before;
        if (diff > 86400000 * num) // 24*60*60*1000
         {
            return true;
        }
    }
    static find(path, node, compType) {
        let n = cc.find(path, node);
        if (n) {
            return n.getComponent(compType);
        }
        return n;
    }
    static setDisplay(sp, url, callback) {
        if (typeof (url) == 'string') {
            return SpriteFrameCache_1.default.instance.getSpriteFrame(url).then(sf => {
                sp.spriteFrame = sf;
                callback && callback();
            }).catch(e => console.warn(e));
        }
        else {
            if (url instanceof cc_1.SpriteFrame)
                sp.spriteFrame = url;
        }
    }
    static getOrAddComponent(obj, type) {
        return obj.getOrAddComponent(type);
    }
    static getComponentInParent(obj, type) {
        return obj.getComponentInParent(type);
    }
    static convertCameraWorldPosition(worldpos, cameraFrom, cameraTo) {
        let pos = cameraFrom.worldToScreen(worldpos, cc.Vec2.ZERO);
        let from = cameraTo.screenToWorld(pos, cc.Vec2.ZERO);
        return from;
    }
    //高效率getboundingbox ,不同于node.getBoundingBoxToWorld
    static getWorldBoundingBox(node) {
        let parent = node.parent;
        if (parent == null)
            return;
        let box = node.transform.getBoundingBox();
        let xy = (0, cc_1.v3)(box.xMin, box.yMin, 0);
        let xy2 = (0, cc_1.v3)(box.xMax, box.yMax, 0);
        xy = parent.transform.convertToWorldSpaceAR(xy);
        xy2 = parent.transform.convertToWorldSpaceAR(xy2);
        let wh = xy2.subtract(xy);
        return (0, cc_1.rect)(xy.x, xy.y, wh.x, wh.y);
    }
    static setParent(node, newParent, keepWorldPosition = false) {
        let oldParent = node.parent;
        if (oldParent == null)
            return;
        let worldPos = oldParent.convertToWorldSpaceAR(node.position);
        node.removeFromParent();
        node.parent = newParent;
        if (keepWorldPosition) {
            node.position = newParent.convertToNodeSpaceAR(worldPos);
        }
    }
    static getWorldPos(node) {
        let v3 = node.getWorldPosition();
        return (0, cc_1.v2)(v3.x, v3.y);
    }
    static enableAutoScroll(scrollview, speed = 0.5) {
        let layout = scrollview.content.getComponent(cc_1.LayoutComponent);
        let dir = (0, cc_1.v2)(1, 0);
        if (scrollview.vertical) {
            dir = (0, cc_1.v2)(0, 1);
        }
        let scroll = function () {
            let hafw = (layout.node.width - layout.node.parent.width) / 2;
            let hafh = (layout.node.height - layout.node.parent.height) / 2;
            let pos = layout.node.position.clone();
            pos.x += dir.x * speed;
            pos.y += dir.y * speed;
            layout.node.position = pos;
            if (scrollview.vertical) {
                if (pos.y < -hafh || pos.y > hafh) {
                    dir.multiplyScalar(-1);
                }
            }
            else {
                if (pos.x < -hafw || pos.x > hafw) {
                    dir.multiplyScalar(-1);
                }
            }
        };
        return scroll;
    }
    static getPrefab(path) {
        return new Promise((resolve, reject) => {
            cc_1.resources.load(path, cc_1.Prefab, (err, res) => {
                if (err)
                    return reject(err);
                resolve(res);
            });
        });
    }
    static getMaterial(path) {
        return new Promise((resolve, reject) => {
            cc_1.resources.load(path, cc_1.Material, (err, res) => {
                if (err)
                    return reject(err);
                resolve(res);
            });
        });
    }
    static getRes(path, type) {
        return new Promise((resolve, reject) => {
            cc_1.resources.load(path, type, (err, res) => {
                if (err)
                    return reject(err);
                resolve(res);
            });
        });
    }
    //播放添加金币的动画 
    static playFlyCoin() {
        return __awaiter(this, arguments, void 0, function* (template = null, parent = null, from = display_1.default.center, to = display_1.default.leftTop, config) {
            if (config == null) {
                config = this.default_flycoin_config;
            }
            config.num = config.num || 1;
            for (var i = 0; i < config.num; i++) {
                let node = (0, cc_1.instantiate)(template);
                node.parent = parent;
                let anim = ccUtil.getOrAddComponent(node, PositionAnim_1.default);
                anim.useWorld = true;
                let round = cc_1.Vec2.random(this._tmp_vec2, config.random_length || 0);
                anim.from = from.add3f(round.x, round.y, 0);
                anim.to = to;
                anim.duration = config.dur || 0.5;
                anim.easeType = EaseType_1.EaseType.sineInOut;
                anim.play().then(v => {
                    node.destroy();
                });
                yield EventManager_1.evt.sleep(config.interval || 0.1);
            }
        });
    }
    static setButtonEnabled(btn, v) {
        btn.interactable = v;
        let sp = btn.node.getComponent(cc_1.SpriteComponent);
        if (sp) {
            let color = new cc_1.Color();
            color.set(sp.color);
            color.a = v ? 255 : 120;
            sp.color = color;
        }
    }
}
ccUtil.allInfos = {}; // 所有信息
ccUtil.types = [];
ccUtil._tmp_vec2 = (0, cc_1.v2)();
ccUtil.default_flycoin_config = {
    dur: 0.5,
    num: 5,
    interval: 0.1,
    random_length: 0
};
exports.default = ccUtil;
