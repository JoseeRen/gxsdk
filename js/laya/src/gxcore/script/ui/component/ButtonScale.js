"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ButtonScale extends Laya.Script {
    constructor() {
        super();
        /** @prop {name:scaleTime, tips:"缩放过度时间，单位s", type:Number, default:0.1}*/
        this.scaleTime = 0.1;
        /** @prop {name:zoomScale, tips:"缩放比率", type:Number, default:0.9}*/
        this.zoomScale = 0.9;
    }
    onEnable() {
        this.button = this.owner;
        this.originScale = new Laya.Vector2(this.button.scaleX, this.button.scaleY);
        this.button.on(Laya.Event.MOUSE_DOWN, this, this.setScale);
        this.button.on(Laya.Event.MOUSE_UP, this, this.resetNormal);
        this.button.on(Laya.Event.MOUSE_OUT, this, this.resetNormal);
    }
    resetNormal() {
        Laya.Tween.clearAll(this.button);
        Laya.Tween.to(this.button, { scaleX: this.originScale.x, scaleY: this.originScale.y }, this.scaleTime * 1000);
    }
    setScale() {
        Laya.Tween.clearAll(this.button);
        Laya.Tween.to(this.button, {
            scaleX: this.originScale.x * this.zoomScale,
            scaleY: this.originScale.y * this.zoomScale
        }, this.scaleTime * 1000);
    }
}
exports.default = ButtonScale;
