"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameManager_1 = __importDefault(require("./GameManager"));
const PlayerData_1 = __importDefault(require("./PlayerData"));
const UIManager_1 = __importDefault(require("./UIManager"));
const LevelManager_1 = __importDefault(require("./LevelManager"));
const NpcControl_1 = __importDefault(require("./NpcControl"));
const ziDan_1 = __importDefault(require("./ziDan"));
const jiao_1 = __importDefault(require("./jiao"));
const layaMaxUI_1 = require("./ui/layaMaxUI");
class youTong extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {
        this.ziDongXiaoShiTime = 600;
        //存活了
        this.state = "cunHuo";
        //血量
        this.xueLiang = parseInt(GameManager_1.default.jsonShuJv["youTongXueLiang"]);
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
            var bz = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("fx_hongzha"), GameManager_1.default.curScene);
            bz.transform.position = this.owner.transform.position;
            GameManager_1.default.PlaySound("baoZha1");
            //对附近的敌人造成伤害
            for (var p = 0; p < GameManager_1.default.curPlayerControl.diRenJiHe.numChildren; p++) {
                var diRenWeiZhi = GameManager_1.default.curPlayerControl.diRenJiHe.getChildAt(p).transform.position;
                var jvLi = Laya.Vector3.distance(this.owner.transform.position, diRenWeiZhi);
                //距离爆炸位置近就受伤
                if (jvLi < parseInt(GameManager_1.default.jsonShuJv["youTongBaoZhaFanWei"])) {
                    GameManager_1.default.curPlayerControl.diRenJiHe.getChildAt(p).getChildAt(0).getComponent(jiao_1.default).shouJi(parseInt(GameManager_1.default.jsonShuJv["youTongShangHai"]));
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
        });
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
            GameManager_1.default.curScene.addChild(obj);
            obj.active = false;
        }
    }
}
exports.default = youTong;
