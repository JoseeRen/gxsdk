"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
/**
 * 游戏结束时策略
 * 按钮要自己加节点 videoIcon  是视频图标
 */
class GxGameEnd extends Laya.Script {
    constructor() {
        super(...arguments);
        // @property({type: cc.Button, tooltip: "要控制的按钮"})
        this.btnArr = [];
        //  @property({type: cc.Node, tooltip: "触摸控制点显示不显示"})
        this.touchNode = null;
        // @property({type: cc.Node, tooltip: "点"})
        this.dotNode = null;
        this.switchOpen = false;
        this.initEnd = false;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    onAwake() {
        console.log(" on  awake");
        // this.touchNode.on(cc.Node.EventType.TOUCH_END, () => {
        //     if (this.switchOpen) {
        //         console.log("可以的");
        //         this.dotNode.alpha = Math.abs(1 - this.dotNode.alpha);
        //         let videoActive = this.dotNode.alpha == 1;
        //         for (let i = 0; i < this.btnArr.length; i++) {
        //             let btnArrElement1 = this.btnArr[i];
        //             if (btnArrElement1) {
        //                 let childByName = btnArrElement1.node.getChildByName("videoIcon");
        //                 if (childByName) {
        //                     childByName.active = videoActive;
        //                 }
        //             }
        //         }
        //     }
        // });
        // for (let i = 0; i < this.btnArr.length; i++) {
        //     let btnArrElement = this.btnArr[i];
        //     if (btnArrElement) {
        //         btnArrElement.enableAutoGrayEffect = false;
        //         btnArrElement.interactable = false;
        //         btnArrElement.node.on(cc.Node.EventType.TOUCH_END, () => {
        //             if (this.dotNode.alpha == 1) {
        //                 GxGame.Ad().showVideo(() => {
        //                     btnArrElement.clickEvents[0].emit([btnArrElement.clickEvents[0].customEventData]);
        //                 });
        //             } else {
        //                 btnArrElement.clickEvents[0].emit([btnArrElement.clickEvents[0].customEventData]);
        //             }
        //         }, this);
        //     }
        // }
    }
    // this.gameEnd.addComponent(GxGameEnd).init([this.btnkuangdian,this.gameoverad],this.touchNode,this.dotNode)
    init(btnArr, touchNode, dotNode) {
        console.log("init");
        this.btnArr = btnArr;
        this.touchNode = touchNode;
        this.dotNode = dotNode;
        touchNode.on(Laya.Event.CLICK, this, () => {
            let videoActive = false;
            if (dotNode.alpha == 1) {
                dotNode.alpha = 0;
                videoActive = false;
            }
            else {
                dotNode.alpha = 1;
                videoActive = true;
            }
            for (let i = 0; i < this.btnArr.length; i++) {
                if (this.btnArr[i]) {
                    let childByName = this.btnArr[i].getChildByName("videoIcon");
                    if (childByName) {
                        childByName.visible = videoActive;
                    }
                }
            }
        });
        for (let index = 0; index < btnArr.length; index++) {
            const element = btnArr[index];
            let t = new Laya.Sprite();
            t.width = element.displayWidth;
            t.height = element.displayHeight;
            //   t.parent=this.btnkuangdian
            element.addChild(t);
            t.on(Laya.Event.CLICK, this, (e) => {
                e.stopPropagation();
                if (dotNode.alpha == 1) {
                    GxGame_1.default.Ad().showVideo(() => {
                        element.event(Laya.Event.CLICK, e);
                    });
                }
                else {
                    element.event(Laya.Event.CLICK, e);
                }
            });
        }
        this.initEnd = true;
        this.changeStatus();
    }
    onEnable() {
        this.changeStatus();
    }
    changeStatus() {
        console.log("enable");
        if (!this.initEnd) {
            return;
        }
        this.switchOpen = GxGame_1.default.gGB("gev");
        if (this.switchOpen) {
            this.touchNode.alpha = 1;
            this.dotNode.alpha = 1;
        }
        else {
            this.dotNode.alpha = 0;
            this.touchNode.alpha = 0;
        }
        for (let i = 0; i < this.btnArr.length; i++) {
            if (this.btnArr[i]) {
                let childByName = this.btnArr[i].getChildByName("videoIcon");
                if (childByName) {
                    childByName.visible = this.switchOpen;
                }
            }
        }
    }
}
exports.default = GxGameEnd;
