"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const GxAdParams_1 = require("../GxAdParams");
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
var GxFirstSceneUI = layaMaxUI_1.ui.GxFirstSceneUI;
const ResUtil_1 = __importDefault(require("../util/ResUtil"));
const GxChecker_1 = __importDefault(require("../GxChecker"));
class GxFirstScene extends GxFirstSceneUI {
    constructor() {
        super();
        this.gameSceneName = "GxDownloadScene.scene";
        /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
        let intType = 1000;
        /** @prop {name:numType, tips:"数字类型示例", type:Number, default:1000}*/
        let numType = 1000;
        /** @prop {name:strType, tips:"字符串类型示例", type:String, default:"hello laya"}*/
        let strType = "hello laya";
        /** @prop {name:boolType, tips:"布尔类型示例", type:Bool, default:true}*/
        let boolType = true;
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
        this.canJumpToNext = false;
    }
    onAwake() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.jkCompany.text = "";
        this.jkSoftCode.text = "";
    }
    onEnable() {
        GxChecker_1.default.getInstance().init();
        this.canJumpToNext = true;
        this.jkTitle.visible = false;
        this.jkContent.visible = false;
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.jkzg, {});
        GxGame_1.default.initPlatform(() => {
            GxGame_1.default.initGame(() => {
                //隐私政策和和适龄
                let jkShowTime = GxGame_1.default.getJkShowTime();
                if (jkShowTime >= 1) {
                    let gameAge = GxGame_1.default.getGameAge();
                    if (gameAge > 0) {
                        ResUtil_1.default.loadSprite("gx/texture/icon" + gameAge + ".png", (err, spriteFrame) => {
                            if (err) {
                            }
                            else {
                                this.ageSp.texture = spriteFrame;
                                GxGame_1.default.ageSp = spriteFrame;
                            }
                        });
                        ResUtil_1.default.loadSprite("gx/texture/btn_yinsixieyi" + ".png", (err, spriteFrame) => {
                            if (err) {
                            }
                            else {
                                GxGame_1.default.btnPrivacySp = spriteFrame;
                            }
                        });
                        ResUtil_1.default.loadSprite("gx/texture/btn_zhuomian" + ".png", (err, spriteFrame) => {
                            if (err) {
                            }
                            else {
                                GxGame_1.default.btnAddDesktopSp = spriteFrame;
                            }
                        });
                    }
                    this.jkCompany.text = "";
                    this.jkSoftCode.text = "";
                    if (GxAdParams_1.AdParams.company && GxAdParams_1.AdParams.company.length > 0) {
                        this.jkCompany.text = "著作权人：" + GxAdParams_1.AdParams.company;
                    }
                    else {
                        if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_QQ_GAME) {
                            this.canJumpToNext = false;
                            this.jkCompany.text = "需要著作权人：";
                        }
                    }
                    if (GxAdParams_1.AdParams.softCode && GxAdParams_1.AdParams.softCode.length > 0) {
                        this.jkSoftCode.text = "软著登记号：" + GxAdParams_1.AdParams.softCode;
                    }
                    else {
                        if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_QQ_GAME) {
                            this.canJumpToNext = false;
                            this.jkCompany.text = "软著登记号：";
                        }
                    }
                    this.jkTitle.visible = true;
                    this.jkContent.visible = true;
                }
                setTimeout(() => {
                    GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.showGamePrivacy);
                    if (GxGame_1.default.needShowAuthorize()) {
                        GxGame_1.default.Ad().showAuthorize(() => {
                            // 同意继续游戏
                            this.enterGame();
                        }, () => {
                            // 拒绝退出游戏，或者隔1秒再弹出强制同意
                        });
                    }
                    else {
                        this.enterGame();
                    }
                }, jkShowTime * 1000);
            });
        });
    }
    onDisable() {
    }
    enterGame() {
        setTimeout(() => {
            GxGame_1.default.Ad().initAd();
        }, 1000);
        GxGame_1.default.Ad().getDeviceId && GxGame_1.default.Ad().getDeviceId();
        if (this.canJumpToNext) {
            if (GxConstant_1.default.IS_HUAWEI_GAME || GxConstant_1.default.IS_MI_GAME) {
                GxGame_1.default.Ad().login(() => {
                    // cc.director.loadScene(this.gameSceneName);
                    this.jumpScene();
                }, () => {
                });
            }
            else {
                // cc.director.loadScene(this.gameSceneName);
                this.jumpScene();
            }
        }
        else {
            if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_QQ_GAME) {
                console.log("是不是没添加软著 信息");
                console.log("是不是没添加软著 信息");
                console.log("是不是没添加软著 信息");
                console.log("是不是没添加软著 信息");
                console.log("是不是没添加软著 信息");
            }
        }
    }
    jumpScene() {
        if (this.gameSceneName.endsWith(".scene")) {
            Laya.Scene.open(this.gameSceneName);
        }
        else {
            console.warn("scene名字必须得带.scene和路径 ");
            console.warn("scene名字必须得带.scene和路径 ");
            console.warn("scene名字必须得带.scene和路径 ");
        }
    }
}
exports.default = GxFirstScene;
