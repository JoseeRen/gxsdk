import UIManager from "./UIManager";
import GameManager from "./GameManager";
import PlayerData from "./PlayerData";
export default class PanelFrist extends Laya.Scene {

    constructor() {
        super();

    }

    onEnable() {
        this.loadValue = 0;
        this.curValue = 0;
        this.onUpdate();
        Laya.timer.frameLoop(1, this, this.onUpdate);
        this.LoadConfig();
        /*
        var font = ["ziti_0","ziti_1","ziti_2"] ;
        for(let i=0;i<font.length;i++)
        {
            let mBitmapFont = new Laya.BitmapFont();
            mBitmapFont.loadFont("Font/"+font[i]+".fnt",new Laya.Handler(this,function()
            {
                Laya.Text.registerBitmapFont(font[i],mBitmapFont);
            }));
        }
*/

        //加载json文件
        Laya.loader.load("shuJv.json", Laya.Handler.create(this, function () {

            GameManager.jsonShuJv = Laya.loader.getRes("shuJv.json");
         


        }), null, Laya.Loader.JSON);

    }

    onDisable() {
    }
    onUpdate() {
        this.curValue += 0.01;
        if (this.curValue > this.loadValue) {
            this.curValue = this.loadValue;
        }
        if (this.curValue >= 1) {
            this.curValue = 0;
        }
        this.loadingImg.width = this.curValue * 600;
    }

    LoadConfig() {
        // var config = [
        //     "res/JsonDatas/Timeline01.json",//0
        //     "res/JsonDatas/Timeline02_02.json",//1
        //     "res/JsonDatas/Timeline04_02.json",//2
        //     "res/JsonDatas/Timeline04_04.json",//3
        //     "res/JsonDatas/Timeline02_01.json",//4
        //     "res/JsonDatas/Timeline04_01.json",//5
        //     "res/JsonDatas/Timeline04_03.json",//6
        //     "res/JsonDatas/Timeline03.json",//7
        //     "res/JsonDatas/LevelConfig.json",//8
        // ] ;
        // Laya.loader.load(config,
        // 	Laya.Handler.create(this, function()
        // {
        //     GameManager.Config["Timeline01"] = Laya.loader.getRes(config[0]); //
        //     GameManager.Config["Timeline02_02"] = Laya.loader.getRes(config[1]); //
        //     GameManager.Config["Timeline04_02"] = Laya.loader.getRes(config[2]); //
        //     GameManager.Config["Timeline04_04"] = Laya.loader.getRes(config[3]); //
        //     GameManager.Config["Timeline02_01"] = Laya.loader.getRes(config[4]); //
        //     GameManager.Config["Timeline04_03"] = Laya.loader.getRes(config[6]); //
        //     GameManager.Config["Timeline04_01"] = Laya.loader.getRes(config[5]); //
        //     GameManager.Config["Timeline03"] = Laya.loader.getRes(config[7]); //
        //     GameManager.Config["LevelConfig"] = Laya.loader.getRes(config[8]); //

        //     PlayerData.GetData();
        //     this.LoadModels();
        // }));
        PlayerData.GetData();
        this.LoadModels();
    }

    LoadModels() {
        this.loadValue = 1;
        Laya.loader.create("res/Scene/Conventional/Model.lh",
            Laya.Handler.create(this, function () {
                GameManager.models = Laya.loader.getRes("res/Scene/Conventional/Model.lh");

                if (GameManager.models) {
                    this.StartGame();
                }
                else {
                    this.LoadModels();
                }

            }),
            Laya.Handler.create(this, function (p) {

            }));
    }
    StartGame() {
        Laya.timer.clearAll(this);
        UIManager.ShowUIPanel("GameRun");
    }
}