"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerData_1 = __importDefault(require("./PlayerData"));
const GameManager_1 = __importDefault(require("./GameManager"));
const AD_1 = __importDefault(require("./AD/AD"));
class PanelShop extends Laya.Scene {
    constructor() {
        super();
    }
    onEnable() {
        this.jinBiNumBerArray = ["300", "2000", "5000", "5000", "5000", "5000", "5000"];
        this.Init();
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            PlayerData_1.default.SaveData();
            Laya.stage.event("PlayerChangeHat", "");
            this.destroy();
        });
    }
    onDisable() {
        if (this.showPlayer != null) {
            this.showPlayer.destroy();
        }
    }
    Init() {
        this.goldTex.text = PlayerData_1.default.GetUserData("Gold"); //本页刷新金币展示
        var UnlockHat = PlayerData_1.default.GetUserData("UnlockHat");
        var EquipHat = PlayerData_1.default.GetUserData("EquipHat");
        for (let i = 1; i <= 6; i++) {
            //使用点击事件
            this["Item0" + i].getChildByName("useBtn").on(Laya.Event.CLICK, this, function () {
                GameManager_1.default.PlaySound("but");
                PlayerData_1.default.SetUserData("EquipHat", i); //变换当前使用
                PlayerData_1.default.SaveData();
                this.UpdateItem(); //刷新
                //刷新皮肤
                GameManager_1.default.curLevelManager.qieHuanPlayer(PlayerData_1.default.GetUserData("EquipHat"));
            });
            //购买点击事件
            this["Item0" + i].getChildByName("buyBtn").on(Laya.Event.CLICK, this, function () {
                GameManager_1.default.PlaySound("but");
                //减少金币
                //根据所以确定金币
                if (PlayerData_1.default.IsCanLessProp(1, this.jinBiNumBerArray[i - 1])) {
                    UnlockHat[i] = 1;
                    PlayerData_1.default.SetUserData("UnlockHat", UnlockHat);
                    PlayerData_1.default.LessProp(1, this.jinBiNumBerArray[i - 1]);
                    Laya.stage.event("UpdateGold", ""); //首页刷新金币展示
                    this.goldTex.text = PlayerData_1.default.GetUserData("Gold"); //本页刷新金币展示
                    PlayerData_1.default.SetUserData("EquipHat", i); //变换当前使用
                    PlayerData_1.default.SaveData();
                    this.UpdateItem();
                    //刷新皮肤
                    GameManager_1.default.curLevelManager.qieHuanPlayer(PlayerData_1.default.GetUserData("EquipHat"));
                }
                else {
                    this.tanChuang.visible = true;
                }
            });
        }
        //关闭弹窗按钮
        this.closeBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            this.tanChuang.visible = false;
        });
        //获取金币按钮点击
        this.huoQuZuanShi.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            AD_1.default.showVideo(function (code) {
                if (code == 1) {
                    //增加2000金币
                    PlayerData_1.default.AddProp(1, 2000);
                    Laya.stage.event("UpdateGold", ""); //首页刷新金币展示
                    this.goldTex.text = PlayerData_1.default.GetUserData("Gold"); //本页刷新金币展示
                    PlayerData_1.default.SaveData();
                    //关闭弹窗
                    this.tanChuang.visible = false;
                }
            }.bind(this));
        });
        this.UpdateItem();
    }
    UpdateItem() {
        var UnlockHat = PlayerData_1.default.GetUserData("UnlockHat");
        var EquipHat = PlayerData_1.default.GetUserData("EquipHat");
        for (let i = 1; i <= 6; i++) {
            //展示图
            //this["Item0" + i].getChildByName("icon").skin = "UIRes/image_Hat" + i + ".png";
            if (EquipHat == i) {
                //隐藏使用中
                //this["Item0" + i].getChildByName("shiYongZhong").visible = true;
                this["Item0" + i].getChildByName("yiShiYong").visible = true;
                //使用中
                this["Item0" + i].getChildByName("buyBtn").visible = false;
                this["Item0" + i].getChildByName("useBtn").visible = false;
                //this["Item0" + i].getChildByName("adBtn").visible = false;
                //展示3d
                this.showWuPin(i - 1);
            }
            else if (UnlockHat[i] == 1) {
                //隐藏使用中
                //this["Item0" + i].getChildByName("shiYongZhong").visible = false;
                this["Item0" + i].getChildByName("yiShiYong").visible = false;
                //使用
                this["Item0" + i].getChildByName("buyBtn").visible = false;
                this["Item0" + i].getChildByName("useBtn").visible = true;
                //this["Item0" + i].getChildByName("adBtn").visible = false;
            }
            else {
                //隐藏使用中
                //this["Item0" + i].getChildByName("shiYongZhong").visible = false;
                this["Item0" + i].getChildByName("yiShiYong").visible = false;
                //判断金币是否够
                if (PlayerData_1.default.GetUserData("Gold") >= this.jinBiNumBerArray[i - 1]) {
                    //金币展示
                    this["Item0" + i].getChildByName("buyBtn").visible = true;
                    this["Item0" + i].getChildByName("useBtn").visible = false;
                    // this["Item0" + i].getChildByName("adBtn").visible = false;
                    this["Item0" + i].getChildByName("buyBtn").getChildByName("gold").text = this.jinBiNumBerArray[i - 1];
                }
                else {
                    //不够
                    this["Item0" + i].getChildByName("buyBtn").visible = true;
                    this["Item0" + i].getChildByName("useBtn").visible = false;
                    // this["Item0" + i].getChildByName("adBtn").visible = true;
                    this["Item0" + i].getChildByName("buyBtn").getChildByName("gold").text = this.jinBiNumBerArray[i - 1];
                }
            }
        }
    }
    showWuPin(index) {
        if (this.showPlayer != undefined) {
            //展示对应的人物 其它隐藏
            for (var i = 0; i < this.renwuShowArray.numChildren; i++) {
                this.renwuShowArray.getChildAt(i).active = false;
                //console.log(this.renwuShowArray.getChildAt(i).active + "hehehe")
            }
            this.renwuShowArray.getChildAt(index).active = true;
        }
        else {
            this.showPlayer = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("ShowPlayer"), GameManager_1.default.curScene);
            this.showPlayer.transform.position = new Laya.Vector3(0, -1200, 0);
            var camera = this.showPlayer.getChildByName("Camera");
            camera.renderTarget = new Laya.RenderTexture(700, 700, Laya.RenderTextureFormat.R8G8B8A8);
            camera.clearFlag = 0;
            camera.clearColor = new Laya.Vector4(0, 0, 0, 0);
            var rtex = new Laya.Texture(camera.renderTarget, Laya.Texture.DEF_UV);
            this.roleRender.graphics.drawTexture(rtex);
            this.renwuShowArray = this.showPlayer.getChildByName("Role");
            //展示对应的人物 其它隐藏
            for (var i = 0; i < this.renwuShowArray.numChildren; i++) {
                this.renwuShowArray.getChildAt(i).active = false;
            }
            this.renwuShowArray.getChildAt(index).active = true;
        }
    }
}
exports.default = PanelShop;
