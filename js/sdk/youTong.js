
import GameManager from "./GameManager";
import PlayerData from "./PlayerData";
import UIManager from "./UIManager";
import LevelManager from "./LevelManager";
import NpcControl from "./NpcControl";
import ziDan from "./ziDan";
import jiao from "./jiao";




import { GameTipUI, GoldItemUI, PropTipUI } from "./ui/layaMaxUI";
export default class youTong extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {

        this.ziDongXiaoShiTime = 600;

        //存活了
        this.state = "cunHuo";

        //血量
        this.xueLiang = parseInt(GameManager.jsonShuJv["youTongXueLiang"]);

    }

    onDisable() {



    }


    onUpdate() {

        if (this.owner.meshRenderer.material.albedoIntensity > 1) {
            this.owner.meshRenderer.material.albedoIntensity = this.owner.meshRenderer.material.albedoIntensity - 0.1;
        }

        //自动消失
        if (this.ziDongXiaoShiTime > 0) {
            this.ziDongXiaoShiTime = this.ziDongXiaoShiTime - 1;
            if (this.ziDongXiaoShiTime <= 0) {
                // this.owner.destroy();

            }
        }



    }

    //受击
    shouJi(num) {

        //受击高亮
        this.owner.meshRenderer.material.albedoIntensity = 3;

        this.xueLiang = this.xueLiang - num;
        //  console.log(this.xueLiang);
        if (this.xueLiang <= 0) {

            //创建爆炸
            var bz = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("fx_hongzha"), GameManager.curScene);
            bz.transform.position = this.owner.transform.position;
            GameManager.PlaySound("baoZha1");

            //对附近的敌人造成伤害
            for (var p = 0; p < GameManager.curPlayerControl.diRenJiHe.numChildren; p++) {
                var diRenWeiZhi = GameManager.curPlayerControl.diRenJiHe.getChildAt(p).transform.position;
                var jvLi = Laya.Vector3.distance(this.owner.transform.position, diRenWeiZhi)

                //距离爆炸位置近就受伤
                if (jvLi < parseInt(GameManager.jsonShuJv["youTongBaoZhaFanWei"])) {
                    GameManager.curPlayerControl.diRenJiHe.getChildAt(p).getChildAt(0).getComponent(jiao).shouJi(parseInt(GameManager.jsonShuJv["youTongShangHai"]));
                }
            }

            this.state = "gouDai";
            this.owner.destroy();
        }

    }

    yiChu() {

        this.owner.active = false;
        Laya.timer.frameOnce(30, this, function () {
            this.owner.destroy();
        })

    }





    onTriggerEnter(other) {

        var oname = other.owner.name;
        var obj = other.owner;

        //子弹
        /*
        if (oname.indexOf("ziDan") != -1) {

            obj.name = "xxx";
            obj.active = false;

            GameManager.PlaySound("jiTong");

            this.shouJi(obj.getComponent(ziDan).zhuRen.gongJiLi);

        }
        */

        //底部新油桶撞到,就隐藏底部油桶
        if (oname.indexOf("barrel01_A") != -1) {
            GameManager.curScene.addChild(obj);

            obj.active = false;
        }


    }


}