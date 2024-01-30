import GameConfig from "./GameConfig";
export default class PlayerData {

    static GetData() {
        var s = Laya.LocalStorage.getItem("userData");
        if (s) {
            PlayerData.user = JSON.parse(s);
            var day = new Date().getDate();
            //新的一天
            if (PlayerData.user.curDay != day) {
                PlayerData.user.curDay = day;
                PlayerData.SetUserData("isSign", 0);
                var signNum = PlayerData.GetUserData("signNum");
                signNum += 1;
                if (signNum >= 7) {
                    signNum = 0;
                }
                PlayerData.SetUserData("signNum", signNum);
            }
        }
    }
    static SaveData() {
        var d = JSON.stringify(PlayerData.user);
        // console.log("SaveGameData:"+d) ;
        Laya.LocalStorage.setItem("userData", d);
    }
    static GetUserData(key) {
        if (PlayerData.user[key] != null) {
            return PlayerData.user[key];
        }
        return PlayerData.userDV[key];
    }
    static SetUserData(key, value) {
        PlayerData.user[key] = value;
    }
    /**增加道具 1金币 2钥匙 */
    static AddProp(type, num) {
        if (type == 1) {
            PlayerData.SetUserData("Gold", PlayerData.GetUserData("Gold") + num)
        }
        else if (type == 2) {
            PlayerData.SetUserData("YaoShi", PlayerData.GetUserData("YaoShi") + num)
        }
    }
    static IsCanLessProp(type, num) {
        var maxNum = 0;
        if (type == 1) {
            maxNum = PlayerData.GetUserData("Gold");
            if (maxNum >= num) {
                return true;
            }
        }
        else if (type == 2) {
            maxNum = PlayerData.GetUserData("YaoShi");
            if (maxNum >= num) {
                return true;
            }
        }
        return false;
    }
    static LessProp(type, num) {
        var maxNum = 0;
        if (type == 1) {
            maxNum = PlayerData.GetUserData("Gold");
            if (maxNum >= num) {
                PlayerData.SetUserData("Gold", maxNum - num)
            }
        }
        else if (type == 2) {
            maxNum = PlayerData.GetUserData("YaoShi");
            if (maxNum >= num) {
                PlayerData.SetUserData("YaoShi", maxNum - num)
            }
        }
    }
    static AddGuanQia() {
        var GuanQia = PlayerData.GetUserData("GuanQia");
        GuanQia += 1;
        if (GuanQia >= 100) {
            GuanQia = 100;
        }
        var nextId = PlayerData.GetUserData("wuqiId") + 1;
        var wuqiconfig = GameConfig.WuQiConfig[nextId];
        if (wuqiconfig) {
            if (GuanQia >= wuqiconfig.unlockLevel) {
                PlayerData.SetUserData("wuqiId", nextId);
            }
        }
        PlayerData.SetUserData("GuanQia", GuanQia);
        PlayerData.SaveData();
    }
    static IsUnlockJueSe(id) {
        var unlockJueSe = PlayerData.GetUserData("unlockJueSe");
        if (unlockJueSe[id] == null) {
            return false;
        }
        return true;
    }
    static GetJueSeAdNum(id) {
        var unlockJueSeAd = PlayerData.GetUserData("unlockJueSeAd");
        if (unlockJueSeAd[id] == null) {
            return 0;
        }
        return unlockJueSeAd[id];
    }
    static AddJueSeAdNum(id) {
        var unlockJueSeAd = PlayerData.GetUserData("unlockJueSeAd");
        if (unlockJueSeAd[id] == null) {
            unlockJueSeAd[id] = 1;
        }
        else {
            unlockJueSeAd[id] += 1;
        }
        PlayerData.SetUserData("unlockJueSeAd", unlockJueSeAd);
        PlayerData.SaveData();
    }
    static UnlockJueSe(id) {
        var unlockJueSe = PlayerData.GetUserData("unlockJueSe");
        unlockJueSe[id] = 1;
        PlayerData.SetUserData("unlockJueSe", unlockJueSe);
        PlayerData.SaveData();
    }
}
PlayerData.user = {};
PlayerData.userDV = {};
PlayerData.maxGuanQia = 100;
PlayerData.maxPlayerLevel = 30;
PlayerData.PreEquipGun = null;

PlayerData.userDV.beijing = 1;// 背景声音
PlayerData.userDV.yinxiao = 1;// 游戏音效

PlayerData.userDV.Gold = 1200; //金币

PlayerData.userDV.attLevel = { "1": 1, "2": 1, "3": 1 };

PlayerData.userDV.unlockJueSe = {};
PlayerData.userDV.UnlockHat = { "1": 1 };//已经解锁
PlayerData.userDV.EquipHat = 1;  //当前使用



PlayerData.userDV.equitJueSe = 1;
PlayerData.userDV.unlockJueSeAd = {};

PlayerData.userDV.ZhangJie = 1; //章节
PlayerData.userDV.GuanQia = 1;//关卡


PlayerData.userDV.isSign = 0;
PlayerData.userDV.signNum = 0;
PlayerData.userDV.canSignNum = 0;

PlayerData.userDV.shangDianDengJiZu = [1, 1, 1, 1, 1, 1, 1];//1. 手枪兵等级 2.突击队员等级 3.步兵等级 4.狙击手等级 5./机枪手等级 6.喷火兵等级 7.榴弹兵等级

PlayerData.userDV.ziDongDaKaiShangCheng = false;


//五个模式的当前等级
PlayerData.userDV.haiDaoZhengBaDj = 0;//海盗争霸
PlayerData.userDV.guShouJvDianDj = 0;//固守据点
PlayerData.userDV.jvDianZhanLingDj = 0;//据点占领等级
PlayerData.userDV.xiaoDaoZuiHouDj = 0;//笑到最后等级
PlayerData.userDV.zuoZhanXianFengDj = 0;//作战先锋等级


PlayerData.userDV.fuBanHeShouQiangBingYd = false;//四个浮板 合成一个手枪兵引导
PlayerData.userDV.xiangTongShiBingHeChengYd = false;//三个相同士兵升级引导

PlayerData.userDV.guShouJvDianYinDao = false;//固守据点弹窗引导

PlayerData.userDV.zhanLingJvDianYinDao = false;//占领据点弹窗引导

PlayerData.userDV.xiaoDaoZuiHouYinDao = false;//笑到最后引导
PlayerData.userDV.zuoZhanXianFengYinDao = false;//作战先锋引导


PlayerData.userDV.shiBaiQushangChengYinDao = false;//失败去商城引导



//四个技能广告 免费次数
PlayerData.userDV.huiFuAD = 1;
PlayerData.userDV.gongJiLiAD = 1;
PlayerData.userDV.shanDianAD = 1;
PlayerData.userDV.bingFengAD = 1;