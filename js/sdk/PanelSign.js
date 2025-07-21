"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerData_1 = __importDefault(require("./PlayerData"));
const GameManager_1 = __importDefault(require("./GameManager"));
const AD_1 = __importDefault(require("./AD/AD"));
class PanelSign extends Laya.Scene {
    constructor() {
        super();
    }
    onEnable() {
        this.Init();
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            //已经签到过
            if (PlayerData_1.default.GetUserData("isSign") == 1) {
                this.destroy();
            }
            else {
                PlayerData_1.default.SetUserData("isSign", 1);
                //存储签到的时间
                var day = new Date().getDate();
                PlayerData_1.default.SetUserData("curDay", day);
                PlayerData_1.default.AddProp(1, this.signGold[this.signNum]);
                PlayerData_1.default.SaveData();
                Laya.stage.event("UpdateGold", "");
                this.destroy();
            }
        });
        this.signBtn.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (PlayerData_1.default.GetUserData("isSign") == 1) {
                this.destroy();
            }
            else {
                AD_1.default.showVideo(function (code) {
                    if (code == 1) {
                        PlayerData_1.default.SetUserData("isSign", 1);
                        //存储签到的时间
                        var day = new Date().getDate();
                        PlayerData_1.default.SetUserData("curDay", day);
                        PlayerData_1.default.AddProp(1, this.signGold[this.signNum] * 2);
                        PlayerData_1.default.SaveData();
                        Laya.stage.event("UpdateGold", "");
                        this.destroy();
                    }
                }.bind(this));
            }
        });
    }
    onDisable() {
    }
    Init() {
        this.signGold = [300, 800, 2000, 3500, 5500, 8000, 20000, 20000];
        this.signNum = PlayerData_1.default.GetUserData("signNum");
        if (PlayerData_1.default.GetUserData("isSign") == 1) {
            this.signNum = this.signNum + 1;
        }
        for (let i = 1; i < 8; i++) {
            //this["Item0" + i].getChildByName("day").skin = "UIRes/day" + i + ".png";
            this["Item0" + i].getChildByName("goldTex").text = this.signGold[i - 1];
            if (i == this.signNum) {
                //修改签到背景              
                this["Item0" + i].skin = "UIRes/qiShui/sign/image_common_01.png";
                if (i == 7) {
                    this["Item0" + i].skin = "UIRes/qiShui/sign/image_sign_06.png";
                }
            }
            else {
                this["Item0" + i].getChildByName("get").visible = false;
            }
        }
    }
}
exports.default = PanelSign;
