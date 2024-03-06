"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxGame_1 = __importDefault(require("../GxGame"));
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
class gx_ui_ttBox extends layaMaxUI_1.ui.gxui.gx_ui_ttBoxUI {
    constructor() {
        super();
        this.Reward = () => { };
        this.callback = () => { };
    }
    show(reward, coin, callback) {
        if (this.parent)
            return;
        Laya.stage.addChild(this);
        this.Reward = reward;
        this.callback = callback;
        this.rewardLab.text = "+" + coin;
        if (GxGame_1.default.Ad().canReward) {
            this.rewardBtn.visible = true;
            this.gotoBtn.visible = false;
            this.closeBtn.visible = true;
        }
        else {
            this.rewardBtn.visible = false;
            this.gotoBtn.visible = true;
            this.closeBtn.visible = true;
        }
    }
    onClickgotoBtn() {
        if (GxConstant_1.default.IS_TT_GAME) {
            // @ts-ignore
            tt.navigateToScene({
                scene: 'sidebar',
                success: (res) => {
                    console.log('navigate to scene success');
                    // 跳转成功回调逻辑
                },
                fail: (res) => {
                    console.log('navigate to scene fail: ', res);
                    // 跳转失败回调逻辑
                },
            });
        }
        else {
            GxGame_1.default.Ad().canReward = true;
            this.close();
        }
    }
    onclickgetReward() {
        if (GxGame_1.default.havettreward) {
            return;
        }
        this.Reward();
        GxGame_1.default.havettreward = true;
        var nowdate = new Date();
        var nowtime = "" + nowdate.getFullYear() + (nowdate.getMonth() + 1) + nowdate.getDate();
        Laya.LocalStorage.setItem('TTRewardTime', nowtime);
        this.callback();
        this.close();
    }
    close() {
        this.destroy();
    }
    onAwake() {
        this.zOrder = 10000;
        this.rewardBtn.on(Laya.Event.CLICK, this, this.onclickgetReward);
        this.gotoBtn.on(Laya.Event.CLICK, this, this.onClickgotoBtn);
        this.closeBtn.on(Laya.Event.CLICK, this, this.close);
        this.bg.on(Laya.Event.CLICK, this, this.meiyong);
        var last = Laya.LocalStorage.getItem('TTRewardTime');
        if (last != null && last != '' && last != undefined) {
            var lasttime = parseInt(last);
            var now = new Date();
            var nowtime = parseInt("" + now.getFullYear() + (now.getMonth() + 1) + now.getDate());
            if (lasttime == nowtime) {
                GxGame_1.default.havettreward = true;
            }
        }
        let width = Laya.stage.width;
        let height = Laya.stage.height;
        if (width > height) {
            this.main.skin = "gx/ttreward/landscapeMain.png";
            this.rewardLab.pos(415, 202); //281,161  415,202
            this.rewardBtn.y = 747; //853  747
            this.gotoBtn.y = 747; //853  747
            this.closeBtn.y = 747; //853  747
        }
    }
    meiyong() {
        console.log("简单的防一下穿透");
    }
    onDisable() {
    }
}
exports.default = gx_ui_ttBox;
