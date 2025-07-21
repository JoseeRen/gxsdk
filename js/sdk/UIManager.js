"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerData_1 = __importDefault(require("./PlayerData"));
const GameManager_1 = __importDefault(require("./GameManager"));
// import { GameTipUI,GoldItemUI,PropTipUI } from "./ui/layaMaxUI";
const layaMaxUI_1 = require("./ui/layaMaxUI");
class UIManager {
    /**显示UI界面 */
    static ShowUIPanel(name, closeOther = true, param = null) {
        Laya.Scene.open("UIPanel/" + name + ".scene", closeOther, param);
    }
    static ShowGoldEffectUI(pos3d) {
        if (UIManager.gameUI) {
            var pos = new Laya.Vector4(0, 0, 0, 0);
            GameManager_1.default.mainCamera.worldToViewportPoint(pos3d, pos);
            let ui1 = UIManager.gameUI.addChild(new layaMaxUI_1.ui.Prefab.GoldItemUI());
            ui1.x = pos.x;
            ui1.y = pos.y;
            Laya.Tween.to(ui1, { "x": 48, "y": 125 }, 1000);
            Laya.timer.frameOnce(60, this, function () {
                UIManager.gameUI.UpdateGold();
                ui1.destroy();
            });
        }
    }
    static ShowPropTip(pos3d, v) {
        if (UIManager.gameUI) {
            var pos = new Laya.Vector4(0, 0, 0, 0);
            GameManager_1.default.mainCamera.worldToViewportPoint(pos3d, pos);
            let ui1 = UIManager.gameUI.addChild(new layaMaxUI_1.ui.Prefab.PropTipUI());
            ui1.x = pos.x;
            ui1.y = pos.y;
            ui1.numTex.text = v;
            Laya.timer.frameOnce(60, this, function () {
                ui1.destroy();
            });
        }
    }
    /**播放增加 金币 钻石 */
    static ShowAddPropEffect(type) {
        var ui1 = null;
        if (type == 1) {
            ui1 = Laya.stage.addChild(new layaMaxUI_1.ui.UIPanel.JinBiAniUI());
            GameManager_1.default.PlaySound("jinbiAni");
        }
        else if (type == 2) {
            ui1 = Laya.stage.addChild(new layaMaxUI_1.ui.UIPanel.ZuanShiAniUI());
            GameManager_1.default.PlaySound("zuanshiAni");
        }
        ui1.x = 0;
        ui1.y = 0;
        Laya.timer.frameOnce(100, this, function () {
            ui1.destroy();
        });
    }
    /**特效 */
    static ShowUIEffect(effectName, value, pos) {
        var ui1 = null;
        if (effectName == "AddHpUI") {
            ui1 = Laya.stage.addChild(new AddHpUI());
        }
        else if (effectName == "NpcApplyDamageUI") {
            ui1 = Laya.stage.addChild(new NpcApplyDamageUI());
        }
        else if (effectName == "PlayerApplyDamage") {
            ui1 = Laya.stage.addChild(new PlayerApplyDamageUI());
        }
        else if (effectName == "BaoJi") {
            ui1 = Laya.stage.addChild(new BaoJiUI());
        }
        var spos = new Laya.Vector4(0, 0, 0, 0);
        GameManager_1.default.mainCamera.worldToViewportPoint(pos, spos);
        ui1.value.text = value;
        ui1.x = spos.x;
        ui1.y = spos.y - 50;
        Laya.timer.frameOnce(100, this, function () {
            ui1.destroy();
        });
    }
    //改变显示的钱格式
    static GoldFormat(gold) {
        if (gold >= 1000) {
            return parseInt(gold / 1000) + "k";
        }
        return gold;
    }
    //游戏提示UI
    static ShowGameTipUI(v) {
        var pos = new Laya.Point(360, 700);
        let ui1 = Laya.stage.addChild(new layaMaxUI_1.ui.Prefab.GameTipUI());
        ui1.value.text = v;
        ui1.x = pos.x;
        ui1.y = pos.y;
        Laya.timer.frameOnce(120, this, function () {
            ui1.destroy();
        });
    }
    static ShowGameOverUI(data) {
        if (GameManager_1.default.gameState == "over") {
            return;
        }
        GameManager_1.default.gameState = "over";
        Laya.timer.frameOnce(120, this, function () {
            UIManager.mainUI.HideShowGameUI(false);
            // UIManager.ShowUIPanel("ContinueGameUI",false,data) ;
            // data.win = true ;
            // data.addGold = 100 ;
            // UIManager.ShowUIPanel("GameOver",false,data) ;
            // return ;
            if (data.win == false) {
                //检测是否可以继续
                if (data.addGold / PlayerData_1.default.GetLevelGold() > 0.3) {
                    UIManager.ShowUIPanel("ContinueGameUI", false, data);
                    return;
                }
            }
            //检测任务是否改变
            for (var i = 0; i < data.task.length; i++) {
                if (data.task[i] > 0) {
                    UIManager.ShowUIPanel("TaskTargetUI", false, data);
                    return;
                }
            }
            UIManager.ShowUIPanel("GameOver", false, data);
        });
    }
}
exports.default = UIManager;
UIManager.gameUI = null;
UIManager.mainUI = null;
UIManager.garageUI = null;
UIManager.curUI = null;
