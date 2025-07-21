"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../gxcore/script/GxGame"));
const PlayerData_1 = __importDefault(require("../PlayerData"));
class AD {
    // 
    static initCeLue() {
        console.warn("初始化策略");
        if (AD.chanelName == "oppo") {
            AD.unlockModels = true;
        }
    }
    static showVideo(success) {
        AD.success = success;
        switch (AD.chanelName) {
            case "web":
            case "android":
            case "233":
            case "qq":
            case "xiaomi":
            case "wx":
            case "huawei":
            case "4399":
            case "tt":
            case "vivo":
            case "oppo":
            case "momoyu":
            case "kwai":
            case "zfb":
                console.warn("展示视频");
                GxGame_1.default.Ad().showVideo((res) => {
                    if (res) {
                        //发道具
                        AD.reward();
                    }
                });
                break;
            case "baibao":
                AD.reward();
                break;
        }
    }
    static reward() {
        if (AD.success) {
            AD.success();
            AD.success = null;
        }
    }
    static showChaPing(obj) {
        switch (AD.chanelName) {
            case "web":
                console.warn("web展示插屏");
                break;
            case "android":
            case "huawei":
                if (obj == 2) {
                    console.warn("android暂停或结算界面展示插屏");
                    GxGame_1.default.Ad().showNativeInterstitial(() => { }, () => { }, 0);
                }
                break;
            case "233":
                if (obj == 2) {
                    console.warn("233暂停或结算界面展示插屏");
                    GxGame_1.default.Ad().showInterstitial(() => { }, () => { });
                }
                else {
                    console.warn("233其他界面展示插屏");
                    GxGame_1.default.Ad().showNativeInterstitial(() => { }, () => { }, 0);
                }
                break;
            case "vivo":
            case "oppo":
                if (obj == 2) {
                    console.warn("小游戏暂停或结算界面展示插屏");
                    GxGame_1.default.Ad().showNativeInterstitial(() => { }, () => { }, 0);
                }
                else {
                    console.warn("小游戏其他界面展示插屏");
                    GxGame_1.default.Ad().showOtherNativeInterstitial(() => { }, () => { }, 0);
                }
                break;
            case "qq":
            case "wx":
            case "xiaomi":
            case "momoyu":
            case "zfb":
                console.warn("展示插屏");
                GxGame_1.default.Ad().showNativeInterstitial(() => { }, () => { }, 0);
                break;
            case "tt":
                if (obj == 1) {
                    return;
                }
                console.warn("头条展示插屏");
                GxGame_1.default.Ad().showNativeInterstitial(() => { }, () => { }, 0);
                break;
            case "kwai":
                console.warn("小游戏其他界面展示插屏");
                GxGame_1.default.Ad().showOtherNativeInterstitial(() => { }, () => { }, 0);
                break;
        }
    }
    static hideChaPing() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web隐藏插屏");
                break;
            case "android":
            case "vivo":
            case "oppo":
            case "qq":
            case "xiaomi":
            case "wx":
            case "momoyu":
                console.warn("隐藏插屏");
                GxGame_1.default.Ad().hideNativeInterstitial();
                break;
        }
    }
    static showBanner() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web展示banner");
                break;
            case "android":
            case "vivo":
            case "oppo":
            case "qq":
            case "xiaomi":
            case "wx":
            case "huawei":
            case "tt":
            case "momoyu":
            case "zfb":
                console.warn("展示banner");
                GxGame_1.default.Ad().showBanner(() => { }, () => { });
                break;
        }
    }
    static hideBanner() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web隐藏banner");
                break;
            case "android":
            case "vivo":
            case "oppo":
            case "qq":
            case "xiaomi":
            case "wx":
            case "huawei":
            case "tt":
            case "momoyu":
            case "zfb":
                console.warn("隐藏banner");
                GxGame_1.default.Ad().hideBanner();
                break;
        }
    }
    static showVivoIcon() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web展示vivoapk的icon");
                break;
            case "android":
                console.warn("android展示vivoapk的icon");
                GxGame_1.default.Ad().showVivoIcon();
                break;
        }
    }
    static hideVivoIcon() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web隐藏vivoapk的icon");
                break;
            case "android":
                console.warn("android隐藏vivoapk的icon");
                GxGame_1.default.Ad().hideVivoIcon();
                break;
        }
    }
    static luPingBegin() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web开始录屏");
                break;
            case "tt":
                console.warn("头条开始录屏");
                GxGame_1.default.Ad().recorderStart();
                break;
        }
    }
    static luPingOver() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web结束录屏");
                break;
            case "tt":
                console.warn("头条结束录屏");
                GxGame_1.default.Ad().recorderStop();
                break;
        }
    }
    static share(success) {
        switch (AD.chanelName) {
            case "web":
                console.warn("web分享");
                break;
            case "qq":
                console.warn("QQ分享"); //并没有放分享按钮，右上角胶囊也可分享
                GxGame_1.default.shareGame();
                break;
            case "tt":
                console.warn("头条分享");
                GxGame_1.default.Ad().shareRecorder(success);
                break;
            case "ks":
                console.warn("快手分享");
                AD_KS.ksShare(success);
                break;
        }
    }
    static showBox() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web展示盒子");
                break;
            case "qq":
                console.warn("QQ展示盒子");
                GxGame_1.default.Ad().showQQAppBox(() => { }, () => { });
                break;
        }
    }
    static showJiMu() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web展示积木");
                break;
            case "qq":
                console.warn("QQ展示积木");
                GxGame_1.default.Ad().showQQBlockAd();
                break;
        }
    }
    static hideJiMu() {
        switch (AD.chanelName) {
            case "web":
                console.warn("web隐藏积木");
                break;
            case "qq":
                console.warn("QQ隐藏积木");
                GxGame_1.default.Ad().hideQQBlockAd();
                break;
        }
    }
    static haveDesktop() {
        if (AD.chanelName == "web") {
            console.warn("web不显示桌面");
            return false;
        }
        else if (AD.chanelName == "vivo" || AD.chanelName == "oppo" || AD.chanelName == "qq" || AD.chanelName == "tt") {
            console.warn("显示桌面");
            return true;
        }
        else {
            console.warn("其他渠道不显示桌面");
            return false;
        }
    }
    static addDesktop(node) {
        switch (AD.chanelName) {
            case "web":
                console.warn("web点击桌面没什么用");
                break;
            case "tt":
            case "vivo":
            case "oppo":
            case "qq":
                console.warn("点击桌面");
                GxGame_1.default.Ad().addDesktop(node);
                break;
            default:
                console.warn("其他渠道点击桌面没什么用");
                break;
        }
    }
    static checkDesktop(node) {
        switch (AD.chanelName) {
            case "web":
                console.warn("web不检测是否添加了桌面");
                break;
            case "tt":
            case "vivo":
            case "oppo":
            case "qq":
                GxGame_1.default.Ad().hasAddDesktop(() => { }, node);
                break;
            default:
                console.warn("其他渠道不检测是否添加了桌面");
                break;
        }
    }
    static haveShareBtn() {
        if (AD.chanelName == "web") {
            console.warn("web不显示分享按钮");
            return false;
        }
        else if (AD.chanelName == "tt") {
            console.warn("显示分享按钮");
            return true;
        }
        else {
            console.warn("其他渠道不显示分享按钮");
            return false;
        }
    }
    static showShuGeZiL() {
        switch (AD.chanelName) {
            case "wx":
                console.log("显示微信左格子");
                GxGame_1.default.Ad().showCustomLeft();
                break;
        }
    }
    static hideShuGeZiL() {
        switch (AD.chanelName) {
            case "wx":
                console.log("隐藏微信左格子");
                GxGame_1.default.Ad().hideCustomLeft();
                break;
        }
    }
    static showShuGeZiR() {
        switch (AD.chanelName) {
            case "wx":
                console.log("显示微信右格子");
                GxGame_1.default.Ad().showCustomRight();
                break;
        }
    }
    static hideShuGeZiR() {
        switch (AD.chanelName) {
            case "wx":
                console.log("隐藏微信右格子");
                GxGame_1.default.Ad().hideCustomRight();
                break;
        }
    }
    static GameStartCeLue(obj) {
        switch (AD.chanelName) {
            case "web":
                console.warn("web开始游戏没有策略");
                AD.showChaPing(obj);
                AD.hideBanner();
                break;
            case "vivo":
            case "oppo":
                console.warn("ov开始游戏策略");
                AD.showChaPing(obj);
                AD.hideBanner();
                break;
            case "tt":
                AD.luPingBegin();
                AD.showChaPing(obj);
                AD.hideBanner();
                break;
            case "qq":
                console.warn("QQ开始游戏");
                AD.showChaPing(obj);
                AD.hideBanner();
                AD.hideJiMu();
                break;
            default:
                console.log("其他游戏在开始游戏的时候没有策略");
                AD.showChaPing(obj);
                AD.hideBanner();
                break;
        }
    }
    static GameOverCeLue(shareBtn) {
        AD.showChaPing(2);
        AD.showBanner();
        if (shareBtn) {
            shareBtn.visible = AD.haveShareBtn();
        }
        switch (AD.chanelName) {
            case "web":
                console.warn("web结算没有策略");
                break;
            case "qq":
            case "vivo":
            case "oppo":
            case "tt":
                console.warn("结算策略");
                GxGame_1.default.gameEventLevelEnd();
                break;
        }
    }
    static saveData() {
        // PlayerData.SetUserData(AD.saveName, JSON.stringify(AD.data));
    }
    static getData() {
        let item = PlayerData_1.default.GetUserData(AD.saveName);
        if (item == undefined || item == null || item.length == 0) {
            AD.saveData();
            console.log("新用户");
        }
        else {
            AD.data = JSON.parse(item);
            console.log("老用户", AD.data);
        }
    }
    static clearData() {
        console.log("清理数据");
    }
    static gamePause() {
        console.log("游戏暂停");
        Laya.stage.renderingEnabled = false;
        Laya.timer.scale = 0;
    }
    static gameResume() {
        console.log("游戏继续");
        Laya.stage.renderingEnabled = true;
        Laya.timer.scale = 1;
    }
}
exports.default = AD;
//在添加4399HTML5 API前，请先在页面<body>标签下加入以下代码
// <script src="https://h.api.4399.com/h5mini-2.0/h5api-interface.php"></script>
//WX  全面帝国战争模拟 wxb025e818b2122910   海岛守卫奇兵 wx4f2f449057362827   拉罐人特工wxcbaf8fc78c2886a0
AD.chanelName = "wx"; // web,vivo,oppo,android,wx,baibao
AD.success = null;
AD.enterGame = true; //进入游戏
AD.unlockModels = false; //oppo小游戏不能视频解锁关卡
//储存
AD.saveName = "";
AD.OPPOSaveName = "_OPPO_unlockModels";
AD.data = {};
AD.oppoData = {
    level: [] //对应的游戏关卡储存
};
AD.XMVersion = "/1.0.0/";
AD.VIVOVersion = "/1.0.0/";
AD.OPPOVersion = "/1.0.0/";
AD.QQVersion = "/1.0.0/";
AD.TTVersion = "/1.0.0/";
AD.WXVersion = "/1.0.0/";
