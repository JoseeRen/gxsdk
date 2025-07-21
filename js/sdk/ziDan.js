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
const layaMaxUI_1 = require("./ui/layaMaxUI");
class ziDan extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {
        this.xianShiDaoJiShi = 0; //过段时间显示
        this.ziDongXiaoShiTime = 300;
        // console.log(this.owner.zhuRen.name)
        this.sheSu = 0.3;
    }
    onDisable() {
    }
    onUpdate() {
        if (this.xianShiDaoJiShi > 0) {
            this.xianShiDaoJiShi = this.xianShiDaoJiShi - 1;
            if (this.xianShiDaoJiShi <= 0) {
                if (this.owner.jinZhan == true) {
                }
                else {
                    this.owner.getChildAt(0).active = true;
                }
            }
        }
        //自动消失
        if (this.ziDongXiaoShiTime > 0) {
            this.ziDongXiaoShiTime = this.ziDongXiaoShiTime - 1;
            if (this.ziDongXiaoShiTime <= 0) {
                this.owner.destroy();
            }
        }
        if (this.owner == null) {
            return;
        }
        var zhi = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.add(this.owner.transform.position, new Laya.Vector3(this.biaoLiang.x * this.sheSu, this.biaoLiang.y * this.sheSu, this.biaoLiang.z * this.sheSu), zhi);
        this.owner.transform.position = zhi;
    }
    yiChu() {
        this.owner.active = false;
        Laya.timer.frameOnce(30, this, function () {
            this.owner.destroy();
        });
    }
    onCollisionEnter(collision) {
        var oname = collision.other.owner.name;
        var obj = collision.other.owner;
    }
    onTriggerEnter(other) {
        // var oname = other.owner.name;
        // var obj = other.owner;
        /*
        //碰到脚印
        if (oname.indexOf("diMianasdad") != -1) {
            // console.log("456")
            //  this.shouYeRen = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("FX_jizhong"), GameManager.curScene);
            //  this.shouYeRen.transform.position = this.owner.transform.position;

            this.owner.destroy();

        }
        */
    }
}
exports.default = ziDan;
