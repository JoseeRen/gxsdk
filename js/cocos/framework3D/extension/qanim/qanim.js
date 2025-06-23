"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QAnimType = void 0;
const cc_1 = require("cc");
const ScaleAnim_1 = __importDefault(require("./ScaleAnim"));
const EaseType_1 = require("./EaseType");
const EventManager_1 = require("../../core/EventManager");
const ccUtil_1 = __importDefault(require("../../utils/ccUtil"));
const PositionAnim_1 = __importDefault(require("./PositionAnim"));
const BreathAnim_1 = __importDefault(require("./BreathAnim"));
const UIBaseAnim_1 = __importDefault(require("./UIBaseAnim"));
var QAnimType;
(function (QAnimType) {
    QAnimType[QAnimType["Position"] = 0] = "Position";
    QAnimType[QAnimType["Fade"] = 1] = "Fade";
    QAnimType[QAnimType["ScaleIn"] = 2] = "ScaleIn";
    QAnimType[QAnimType["ScaleOut"] = 3] = "ScaleOut";
})(QAnimType || (exports.QAnimType = QAnimType = {}));
class qanim {
    static play(node, type, duration, delay) {
        if (type == QAnimType.ScaleIn) {
            node.scale = cc_1.Vec3.ZERO;
            var comp = node.getComponent(ScaleAnim_1.default);
            if (comp == null) {
                comp = node.addComponent(ScaleAnim_1.default);
            }
            comp.pasr.p = delay;
            comp.pasr.a = duration;
            comp.pasr.s = 0;
            comp.from = cc_1.Vec3.ZERO;
            comp.to = cc_1.Vec3.ONE;
            comp.enabled = true;
            return comp;
        }
        else if (type == QAnimType.ScaleOut) {
            node.scale = cc_1.Vec3.ONE;
            var comp = node.getComponent(ScaleAnim_1.default);
            if (comp == null) {
                comp = node.addComponent(ScaleAnim_1.default);
            }
            comp.pasr.p = delay;
            comp.pasr.a = duration;
            comp.pasr.s = 0;
            comp.pasr.r = 0;
            comp.from = cc_1.Vec3.ONE;
            comp.to = cc_1.Vec3.ZERO;
            comp.enabled = true;
            return comp;
        }
    }
    static fadeInUI(node) {
        node.children.forEach((v, i) => {
            qanim.play(v, QAnimType.ScaleIn, 0.2, i * 0.06).easeType = EaseType_1.EaseType.backOut;
        });
    }
    static fadeOutUI(node) {
        let len = node.children.length;
        node.children.forEach((v, i) => {
            qanim.play(v, QAnimType.ScaleOut, 0.1, (len - i) * 0.03).easeType = EaseType_1.EaseType.backIn;
        });
        return EventManager_1.evt.sleep(len * 0.03 + 0.1);
    }
    static moveTo(node, duration, to, easeType = EaseType_1.EaseType.linear) {
        let anim = ccUtil_1.default.getOrAddComponent(node, PositionAnim_1.default);
        anim.from = node.position;
        anim.to = to;
        anim.duration = duration;
        anim.easeType = easeType;
        return anim.play();
    }
    static scaleTo(node, duration, to, easeType = EaseType_1.EaseType.linear) {
        let anim = ccUtil_1.default.getOrAddComponent(node, ScaleAnim_1.default);
        anim.from = node.scale;
        anim.to = (0, cc_1.v3)(to, to, to);
        anim.duration = duration;
        anim.easeType = easeType;
        return anim.play();
    }
    static stopAll(node) {
        let breath = node.getComponent(BreathAnim_1.default);
        if (breath)
            breath.enabled = false;
        let anims = node.getComponents(UIBaseAnim_1.default);
        anims.forEach(v => v.enabled = false);
    }
}
exports.default = qanim;
