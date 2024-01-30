import UIManager from "./UIManager";
import PlayerData from "./PlayerData";
import GameManager from "./GameManager";
import AD from "./AD/AD";
export default class PanelBaoXiang extends Laya.Scene {

    constructor() {
        super();
        this.zuijiaGL = { "1": 0, "2": 0, "3": 10, "4": 30, "5": 40, "6": 50, "7": 80, "8": 90, "9": 100 };
        this.dianjiNum = 0;
        this.isGetZuiJia = false;
        this.KeyNum = 2;
    }
    onEnable() {
        this.KeyNum = GameManager.RandomInt(1, 3);
        this.Init();
        this.btn_AD.on(Laya.Event.CLICK, this, function () {
            GameManager.PlaySound("but");
            AD.showVideo(function (code) {
                if (code == 1) {
                    this.KeyNum = 3;
                    this.UpdateYaoShi();
                }
            }.bind(this));
        })
        this.btn_close.on(Laya.Event.CLICK, this, function () {
            GameManager.PlaySound("but");
            this.destroy();
            UIManager.ShowUIPanel("Win");
        })

        for (let i = 1; i <= 9; i++) {
            this["BoxBtn" + i].on(Laya.Event.CLICK, this, function () {
                if (this.isOpen[i] == null) {
                    if (this.KeyNum > 0) {
                        this.KeyNum -= 1;
                        this.GetReward(i)
                    }
                    else {
                        AD.showVideo(function (code) {
                            if (code == 1) {
                                this.GetReward(i)
                            }
                        }.bind(this));
                    }
                }
            })
        }
    }
    GetReward(i) {
        this.isOpen[i] = 1;
        this.dianjiNum += 1;
        if (this.isGetZuiJia == false && GameManager.RandomInt(1, 100) <= this.zuijiaGL[this.dianjiNum]) {
            this.isGetZuiJia = true;
            if (this.zuijiaProp == "coin") {
                PlayerData.AddProp(1, this.zuijiaPropNum);
                PlayerData.SaveData();
                this["BoxBtn" + i].getChildByName("open").getChildByName("num").text = this.zuijiaPropNum;
            }
        }
        else {
            PlayerData.AddProp(1, this.allGift[i].num);
            PlayerData.SaveData();
        }
        this.UpdateYaoShi();
        GameManager.PlaySound("but");
    }
    Init() {
        this.isOpen = {};
        this.allGift = {};
        this.UpdateYaoShi();
        for (let i = 1; i <= 9; i++) {
            this.allGift[i] = { "type": "coin", "num": GameManager.RandomInt(30, 100) };
        }
        this.zuijiaProp = "coin";
        this.zuijiaPropNum = GameManager.RandomInt(100, 200);

        for (let i = 1; i <= 9; i++) {
            if (this.allGift[i].type == "coin") {
                this["BoxBtn" + i].getChildByName("open").visible = false;
                this["BoxBtn" + i].getChildByName("open").getChildByName("num").text = this.allGift[i].num;
                this["BoxBtn" + i].getChildByName("close").visible = true;
                this["BoxBtn" + i].getChildByName("close").getChildByName("ad").getChildAt(0).visible = false;
            }
        }
    }
    UpdateYaoShi() {
        var openNum = 0;
        var YaoShi = this.KeyNum;
        for (let i = 1; i <= 9; i++) {
            if (this.isOpen[i] == null) {
                this["BoxBtn" + i].getChildByName("open").visible = false;
                this["BoxBtn" + i].getChildByName("close").visible = true;
                if (YaoShi > 0) {
                    this["BoxBtn" + i].getChildByName("close").getChildByName("ad").getChildAt(0).visible = false;
                }
                else {
                    this["BoxBtn" + i].getChildByName("close").getChildByName("ad").getChildAt(0).visible = true;
                }
            }
            else {
                this["BoxBtn" + i].getChildByName("open").visible = true;
                this["BoxBtn" + i].getChildByName("close").visible = false;
                openNum += 1;
            }
        }
        if (YaoShi > 0) {
            this.btn_AD.visible = false;
            this.btn_close.visible = false;
            this.ani_close.play(0, true);
        }
        else {
            this.btn_close.visible = true;
            this.btn_AD.visible = true;
            this.ani_close.stop();
        }
        if (openNum >= 9) {
            this.btn_AD.visible = false;
            this.btn_close.visible = true;
        }
    }
}