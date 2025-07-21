"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UIManager_1 = __importDefault(require("./UIManager"));
const PlayerData_1 = __importDefault(require("./PlayerData"));
const GameManager_1 = __importDefault(require("./GameManager"));
const AD_1 = __importDefault(require("./AD/AD"));
class PanelGameWin extends Laya.Scene {
    constructor() {
        super();
    }
    onEnable() {
        //判断当前星级别
        var moShiName = GameManager_1.default.curLevelManager.moShi;
        var xingJi = 0;
        if (moShiName == "haiDaoZhengBa") {
            xingJi = PlayerData_1.default.GetUserData("haiDaoZhengBaDj");
            if (xingJi >= 3) {
            }
            else {
                GameManager_1.default.shengXinDongHua = "haiDaoZhengBaDj"; //升星动画 
            }
        }
        else if (moShiName == "jvDianZhanLing") {
            xingJi = PlayerData_1.default.GetUserData("guShouJvDianDj");
            if (xingJi >= 3) {
            }
            else {
                GameManager_1.default.shengXinDongHua = "guShouJvDianDj"; //升星动画 
            }
        }
        else if (moShiName == "jvDianZhanLing2") {
            xingJi = PlayerData_1.default.GetUserData("jvDianZhanLingDj");
            if (xingJi >= 3) {
            }
            else {
                GameManager_1.default.shengXinDongHua = "jvDianZhanLingDj"; //升星动画 
            }
        }
        else if (moShiName == "xiaoDaoZuiHou") {
            xingJi = PlayerData_1.default.GetUserData("xiaoDaoZuiHouDj");
            if (xingJi >= 3) {
            }
            else {
                GameManager_1.default.shengXinDongHua = "xiaoDaoZuiHouDj"; //升星动画 
            }
        }
        else if (moShiName == "zuoZhanXianFeng") {
            xingJi = PlayerData_1.default.GetUserData("zuoZhanXianFengDj");
            if (xingJi >= 3) {
            }
            else {
                GameManager_1.default.shengXinDongHua = "zuoZhanXianFengDj"; //升星动画 
            }
        }
        //console.log(xingJi);
        xingJi = xingJi + 1;
        //获得的点数
        this.huoDeDeDianShu = parseInt(GameManager_1.default.jsonShuJv["yiKeXingJiangLiDeDianShu"]) * xingJi;
        //获得点数
        PlayerData_1.default.AddProp(1, this.huoDeDeDianShu);
        PlayerData_1.default.SaveData();
        UIManager_1.default.ShowGameTipUI("获得" + this.huoDeDeDianShu + "点数");
        this.shengLiDianShuLable.text = this.huoDeDeDianShu;
        //继续游戏点击事件
        this.fanHuiZhuYeBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            this.BackMainUI();
        });
        //双倍获取点击事件
        this.shuangBeiHuoQuBut.on(Laya.Event.CLICK, this, function () {
            //广告回调
            console.log("胜利双倍获取 广告回调");
            AD_1.default.showVideo(() => {
                GameManager_1.default.PlaySound("but");
                PlayerData_1.default.AddProp(1, this.huoDeDeDianShu * 2);
                PlayerData_1.default.SaveData();
                this.BackMainUI();
            });
        });
        AD_1.default.GameOverCeLue(this.shareBtn);
    }
    onDisable() {
    }
    Init() {
        this.UpdateGold();
        this.rewardGold.text = GameManager_1.default.curGoldNum;
        this.getBtn.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            AD_1.default.showVideo(function (code) {
                if (code == 1) {
                    PlayerData_1.default.AddProp(1, GameManager_1.default.curGoldNum * 3);
                    PlayerData_1.default.SaveData();
                    this.BackMainUI();
                }
            }.bind(this));
        });
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            PlayerData_1.default.AddProp(1, GameManager_1.default.curGoldNum);
            PlayerData_1.default.SaveData();
            this.BackMainUI();
        });
    }
    UpdateGold() {
        this.goldTex.text = PlayerData_1.default.GetUserData("Gold");
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
exports.default = PanelGameWin;
