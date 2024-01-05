import UIManager from "./UIManager";
import PlayerData from "./PlayerData";
import GameManager from "./GameManager";
import AD from "./AD/AD";
export default class PanelGameWin extends Laya.Scene {

    constructor() {
        super();
    }

    onEnable() {
        //判断当前星级别
        var moShiName = GameManager.curLevelManager.moShi;
        var xingJi = 0;
        if (moShiName == "haiDaoZhengBa") {
            xingJi = PlayerData.GetUserData("haiDaoZhengBaDj");
            if (xingJi >= 3) {
            } else {
                GameManager.shengXinDongHua = "haiDaoZhengBaDj";//升星动画 
            }
        } else if (moShiName == "jvDianZhanLing") {
            xingJi = PlayerData.GetUserData("guShouJvDianDj");
            if (xingJi >= 3) {
            } else {
                GameManager.shengXinDongHua = "guShouJvDianDj";//升星动画 
            }
        } else if (moShiName == "jvDianZhanLing2") {
            xingJi = PlayerData.GetUserData("jvDianZhanLingDj");
            if (xingJi >= 3) {
            } else {
                GameManager.shengXinDongHua = "jvDianZhanLingDj";//升星动画 
            }
        } else if (moShiName == "xiaoDaoZuiHou") {
            xingJi = PlayerData.GetUserData("xiaoDaoZuiHouDj");
            if (xingJi >= 3) {
            } else {
                GameManager.shengXinDongHua = "xiaoDaoZuiHouDj";//升星动画 
            }
        } else if (moShiName == "zuoZhanXianFeng") {
            xingJi = PlayerData.GetUserData("zuoZhanXianFengDj");
            if (xingJi >= 3) {
            } else {
                GameManager.shengXinDongHua = "zuoZhanXianFengDj";//升星动画 
            }
        }
        //console.log(xingJi);
        xingJi = xingJi + 1;
        //获得的点数
        this.huoDeDeDianShu = parseInt(GameManager.jsonShuJv["yiKeXingJiangLiDeDianShu"]) * xingJi;
        //获得点数
        PlayerData.AddProp(1, this.huoDeDeDianShu);
        PlayerData.SaveData();
        UIManager.ShowGameTipUI("获得" + this.huoDeDeDianShu + "点数");
        this.shengLiDianShuLable.text = this.huoDeDeDianShu;
        //继续游戏点击事件
        this.fanHuiZhuYeBut.on(Laya.Event.CLICK, this, function () {
            GameManager.PlaySound("but");
            this.BackMainUI();
        })
        //双倍获取点击事件
        this.shuangBeiHuoQuBut.on(Laya.Event.CLICK, this, function () {
            //广告回调
            console.log("胜利双倍获取 广告回调");
            AD.showVideo(()=>{
                GameManager.PlaySound("but");
                PlayerData.AddProp(1, this.huoDeDeDianShu * 2);
                PlayerData.SaveData();
                this.BackMainUI();
            })
        })
        AD.GameOverCeLue(this.shareBtn);
    }
    onDisable() {
    }
    Init() {
        this.UpdateGold();
        this.rewardGold.text = GameManager.curGoldNum;
        this.getBtn.on(Laya.Event.CLICK, this, function () {
            GameManager.PlaySound("but");
            AD.showVideo(function (code) {
                if (code == 1) {
                    PlayerData.AddProp(1, GameManager.curGoldNum * 3);
                    PlayerData.SaveData();
                    this.BackMainUI();
                }
            }.bind(this));
        });
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            GameManager.PlaySound("but");
            PlayerData.AddProp(1, GameManager.curGoldNum);
            PlayerData.SaveData();
            this.BackMainUI();
        });
    }
    UpdateGold() {
        this.goldTex.text = PlayerData.GetUserData("Gold");
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