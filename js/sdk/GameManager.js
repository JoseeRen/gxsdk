"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerData_1 = __importDefault(require("./PlayerData"));
const LevelManager_1 = __importDefault(require("./LevelManager"));
class GameManager {
    //音效
    static PlaySound(name, loop = 1) {
        if (PlayerData_1.default.GetUserData("yinxiao") == 0) {
            return;
        }
        var sn = "res/Sounds/" + name;
        var sc = null;
        sc = Laya.SoundManager.playSound(sn + ".ogg", loop, null);
        return sc;
    }
    //背景音
    static PlayMusic(name, loop = 0) {
        if (GameManager.preMusicName == name) {
            return;
        }
        //  if (PlayerData.GetUserData("beijing") == 0) {
        //       return;
        // }
        GameManager.preMusicName = name;
        if (GameManager.bjMusic) {
            GameManager.bjMusic.stop();
            GameManager.bjMusic = null;
        }
        var sn = "res/Sounds/" + name;
        var sc = null;
        sc = Laya.SoundManager.playMusic(sn + ".ogg", loop);
        GameManager.bjMusic = sc;
        return sc;
    }
    static StopMusic() {
        if (GameManager.bjMusic) {
            GameManager.bjMusic.stop();
            GameManager.bjMusic = null;
        }
        GameManager.preMusicName = "";
    }
    static SetMusicVolume(v) {
        if (GameManager.bjMusic) {
            GameManager.bjMusic.volume = v;
        }
    }
    //震动
    static PlayVibrate() {
        if (window["qg"] && qg.vibrateShort) {
            qg.vibrateShort({
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { }
            });
        }
        else if (window["wx"]) {
            wx.vibrateShort();
        }
        else if (window["swan"]) {
            swan.vibrateShort();
        }
        else if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(20);
        }
    }
    static RandomInt(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    static RandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    /**
     * int数值 转时间格式
     * @param {*} time
     */
    static TotIimeFormat(time) {
        var h = Math.floor(time / 3600);
        var m = Math.floor(time % 3600 / 60);
        var s = Math.floor(time % 3600 % 60);
        if (h < 10)
            h = "0" + h;
        if (m < 10)
            m = "0" + m;
        if (s < 10)
            s = "0" + s;
        return h + ":" + m + ":" + s;
    }
    ;
    /**获取一年中的第几周 */
    static getWeekOfYear() {
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 1);
        var dayOfWeek = firstDay.getDay();
        var spendDay = 1;
        if (dayOfWeek != 0) {
            spendDay = 7 - dayOfWeek + 1;
        }
        firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
        var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
        var result = Math.ceil(d / 7);
        return result + 1;
    }
    ;
    static CreateGoldEffect(num) {
        var sw = Laya.stage.width;
        var sh = Laya.stage.height;
        var ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        GameManager.mainCamera.viewportPointToRay(new Laya.Vector2(sw * 0.5, sh * 0.5), ray);
        var target = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.scale(ray.direction, 5, target);
        Laya.Vector3.add(GameManager.mainCamera.transform.position, target, target);
        Laya.Vector3.subtract(target, GameManager.cameraTrans.position, target);
        ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        GameManager.mainCamera.viewportPointToRay(new Laya.Vector2(33, 143), ray);
        var target1 = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.scale(ray.direction, 5, target1);
        Laya.Vector3.add(GameManager.mainCamera.transform.position, target1, target1);
        Laya.Vector3.subtract(target1, GameManager.cameraTrans.position, target1);
        for (var i = 0; i < num; i++) {
            var obj = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("coin"), GameManager.cameraTrans.owner);
            obj.transform.localPosition = target;
            obj.addComponent(GoldEffect).Init({ "delay": i * (50 / num), "target": { "x": target1.x, "y": target1.y, "z": target1.z } });
        }
    }
    static CreateGoldEffectUI(num) {
        for (var i = 0; i < num; i++) {
            var img = new Laya.Image("UIRes/zuanshi.png");
            Laya.stage.addChild(img);
            img.x = Laya.stage.width * 0.5;
            img.y = Laya.stage.height * 0.5;
            img.addComponent(GoldEffectUI).Init({ "delay": i * (300 / num), "target": { "x": 670, "y": 144 } });
        }
    }
    //_children
    static FindChild(spArr, name) {
        var arr = [];
        for (var i = 0; i < spArr.length; i++) {
            var child = spArr[i];
            if (child.name == name) {
                return child;
            }
            else if (child.numChildren) {
                arr = arr.concat(child._children);
            }
        }
        if (!arr.length)
            return null;
        return GameManager.FindChild(arr, name);
    }
    static loadScene(callback, str) {
        if (GameManager.curScene != null) {
            GameManager.curScene.destroy(); //销毁场景
            GameManager.curScene = null;
        }
        var ln = "res/Scene/Conventional/" + str + ".ls";
        Laya.loader.create(ln, Laya.Handler.create(this, function () {
            GameManager.curScene = Laya.loader.getRes(ln);
            if (GameManager.curScene) {
                Laya.stage.addChildAt(GameManager.curScene, 0);
                GameManager.curLevelManager = GameManager.curScene.getChildByName("Camera").addComponent(LevelManager_1.default);
                if (callback) {
                    callback();
                    callback = null;
                }
            }
            else {
                GameManager.loadScene();
            }
        }));
    }
}
exports.default = GameManager;
GameManager.curScene = null;
GameManager.curLevelManager = null;
GameManager.curPlayerTrans = null;
GameManager.curPlayerControl = null;
GameManager.models = null;
GameManager.gameState = "";
GameManager.mainCamera = null;
GameManager.cameraControl = null;
GameManager.cameraTrans = null;
GameManager.cameraAnima = null;
GameManager.Config = {};
/**选择的关卡 */
GameManager.curSelectLevel = 1;
GameManager.curSelectMap = 1;
GameManager.BlobColor = {};
GameManager.curGoldNum = 0;
GameManager.curGoldBeiShu = 1;
GameManager.BlobColorIndex = 1;
GameManager.PushHat = 0;
GameManager.jsonShuJv = null;
GameManager.shengXinDongHua = null; //升星动画
