import PlayerData from "./PlayerData";
import GameManager from "./GameManager";
import AD from "./AD/AD";
export default class PanelPush extends Laya.Scene {

    constructor() {
        super();
    }

    onEnable() {

        //随机皮肤
        var pifu1Zs = GameManager.RandomInt(1, 6);
        if (pifu1Zs == PlayerData.GetUserData("EquipHat")) {
            pifu1Zs = pifu1Zs + 1;
            if (pifu1Zs > 6) {
                pifu1Zs = 1;
            }
        }

        this.showWuPin(pifu1Zs - 1);

        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            GameManager.PlaySound("but");
            this.destroy();
            if (GameManager.curPlayerControl) {
                GameManager.curPlayerControl.StartGame();
            }
        });
        this.getBtn.on(Laya.Event.CLICK, this, function () {
            GameManager.PlaySound("but");
            AD.showVideo(function (code) {
                if (code == 1) {
                    this.destroy();
                    if (GameManager.curPlayerControl) {
                        //切换皮肤
                        GameManager.curLevelManager.qieHuanPlayer(pifu1Zs);

                        //开始游戏
                        GameManager.curPlayerControl.StartGame();
                    }
                }
            }.bind(this));
        });
    }
    onDisable() {
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
            this.showPlayer = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("ShowPlayer"), GameManager.curScene);
            this.showPlayer.transform.position = new Laya.Vector3(30000, 30000, 30000);
            this.showPlayer.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
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