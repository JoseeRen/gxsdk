import UIManager from "./UIManager";
import PlayerData from "./PlayerData";
import AD from "./AD/AD";
export default class PanelGameFail extends Laya.Scene {

    constructor() {
        super();
    }

    onEnable() {
        //失败去商城引导触发过 就隐藏小手
        if (PlayerData.GetUserData("shiBaiQushangChengYinDao") == true) {
            this.yinDaoShou.visible = false;
            this.yinDaoZheZhao.visible = false;
        }
        this.chongXinKaiShiBut.on(Laya.Event.CLICK, this, function () {
            if (PlayerData.GetUserData("shiBaiQushangChengYinDao") == false) {
                UIManager.ShowGameTipUI("请点击提升实力,完成引导!");
            } else {
                this.BackMainUI();
            }
        });
        //提升实力按钮点击事件
        this.tiShengShiLiBut.on(Laya.Event.CLICK, this, function () {
            PlayerData.SetUserData("shiBaiQushangChengYinDao", true);//失败去商城引导触 引导完成
            //自动打开商城标识
            PlayerData.SetUserData("ziDongDaKaiShangCheng", true);
            PlayerData.SaveData();
            this.BackMainUI();
        })
        AD.GameOverCeLue(this.shareBtn);
    }
    onDisable() {
    }

    BackMainUI() {
        this.destroy();
        if (UIManager.gameUI) {
            UIManager.gameUI.destroy();
            UIManager.gameUI = null;
        }
        UIManager.ShowUIPanel("GameRun");
    }
}