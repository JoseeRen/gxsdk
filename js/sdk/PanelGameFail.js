"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UIManager_1 = __importDefault(require("./UIManager"));
const PlayerData_1 = __importDefault(require("./PlayerData"));
const AD_1 = __importDefault(require("./AD/AD"));
class PanelGameFail extends Laya.Scene {
    constructor() {
        super();
    }
    onEnable() {
        //失败去商城引导触发过 就隐藏小手
        if (PlayerData_1.default.GetUserData("shiBaiQushangChengYinDao") == true) {
            this.yinDaoShou.visible = false;
            this.yinDaoZheZhao.visible = false;
        }
        this.chongXinKaiShiBut.on(Laya.Event.CLICK, this, function () {
            if (PlayerData_1.default.GetUserData("shiBaiQushangChengYinDao") == false) {
                UIManager_1.default.ShowGameTipUI("请点击提升实力,完成引导!");
            }
            else {
                this.BackMainUI();
            }
        });
        //提升实力按钮点击事件
        this.tiShengShiLiBut.on(Laya.Event.CLICK, this, function () {
            PlayerData_1.default.SetUserData("shiBaiQushangChengYinDao", true); //失败去商城引导触 引导完成
            //自动打开商城标识
            PlayerData_1.default.SetUserData("ziDongDaKaiShangCheng", true);
            PlayerData_1.default.SaveData();
            this.BackMainUI();
        });
        AD_1.default.GameOverCeLue(this.shareBtn);
    }
    onDisable() {
    }
    BackMainUI() {
        this.destroy();
        if (UIManager_1.default.gameUI) {
            UIManager_1.default.gameUI.destroy();
            UIManager_1.default.gameUI = null;
        }
        UIManager_1.default.ShowUIPanel("GameRun");
    }
}
exports.default = PanelGameFail;
