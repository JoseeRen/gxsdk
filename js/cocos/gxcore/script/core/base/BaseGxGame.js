"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxConstant_1 = __importDefault(require("../GxConstant"));
const OppoAdapter_1 = __importDefault(require("../../ad/oppo/OppoAdapter"));
const BaseAdapter_1 = __importDefault(require("../../ad/base/BaseAdapter"));
const GxGameUtil_1 = __importDefault(require("../GxGameUtil"));
const GxAdParams_1 = require("../../GxAdParams");
const GxLog_1 = __importDefault(require("../../util/GxLog"));
const ResUtil_1 = __importDefault(require("../../util/ResUtil"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const VivoAdapter_1 = __importDefault(require("../../ad/vivo/VivoAdapter"));
const AndroidAdapter_1 = __importDefault(require("../../ad/android/AndroidAdapter"));
const AndroidH5Adapter_1 = __importDefault(require("../../ad/android/AndroidH5Adapter"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const H54399Adapter_1 = __importDefault(require("../../ad/4399/H54399Adapter"));
const QQAdapter_1 = __importDefault(require("../../ad/qq/QQAdapter"));
const GxEnum_1 = require("../GxEnum");
const HwAdapter_1 = __importDefault(require("../../ad/hw/HwAdapter"));
const MiAdapter_1 = __importDefault(require("../../ad/mi/MiAdapter"));
const WxAdapter_1 = __importDefault(require("../../ad/wx/WxAdapter"));
const GxLog_2 = __importDefault(require("../../util/GxLog"));
const TTAdapter_1 = __importDefault(require("../../ad/tt/TTAdapter"));
const KsAdapter_1 = __importDefault(require("../../ad/ks/KsAdapter"));
const GxImgMgr_1 = __importDefault(require("../../img/GxImgMgr"));
const ZFBAdapter_1 = __importDefault(require("../../ad/zfb/ZFBAdapter"));
const GxChecker_1 = __importDefault(require("../../GxChecker"));
class BaseGxGame {
    static initPlatform(initCallback) {
        if (this.initPlatformEnd) {
            GxLog_1.default.w("已经初始化过渠道");
            initCallback && initCallback();
            return;
        }
        this.initPlatformEnd = true;
        //初始化渠道
        let intLabel = true;
        let callback = () => __awaiter(this, void 0, void 0, function* () {
            if (intLabel) {
                GxGameUtil_1.default.getInstance().initLabel(GxAdParams_1.AdParams.labelName);
            }
            else {
                GxLog_1.default.w("不初始化标签");
            }
            yield GxImgMgr_1.default.getInstance().init(GxAdParams_1.AdParams.heJiConfig);
            // GxImgMgr.getInstance().init("合集配置写这里hejipeizhi")
            initCallback && initCallback();
        });
        if (typeof window["qg"] != "undefined") {
            if (typeof window["qg"]["getBattle"] != "undefined") {
                console.log("进入oppo");
                GxConstant_1.default.IS_OPPO_GAME = true;
                //@ts-ignore
                let fs = qg.getFileSystemManager();
                //代码包文件读取  必须异步
                try {
                    GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.oppo.labelName;
                    GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.oppo.age;
                    GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.oppo.company;
                    GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.oppo.softCode;
                    GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.oppo.ysCompanyName;
                    GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.oppo.ysMail;
                    GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.oppo.ysAddress;
                    GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.oppo["heJiConfig"];
                    fs.readdir({
                        dirPath: "src",
                        success: function (res) {
                            console.log(JSON.stringify(res));
                            let logoName = "";
                            let configName = "";
                            for (let i = 0; i < res.files.length; i++) {
                                let fileListElement = res.files[i];
                                if (fileListElement.indexOf("gamecenter") != -1) {
                                    if (fileListElement.endsWith(".png") ||
                                        fileListElement.endsWith(".jpg")) {
                                        logoName = fileListElement;
                                    }
                                    else if (fileListElement.endsWith(".json")) {
                                        configName = fileListElement;
                                    }
                                }
                            }
                            if (!!logoName) {
                                let img = new Image();
                                let loaded = false;
                                img.onload = function (info) {
                                    loaded = true;
                                    let texture = new cc.Texture2D();
                                    texture.initWithElement(img);
                                    texture.handleLoadedTexture();
                                    GxGame_1.default.LogoSp = new cc.SpriteFrame(texture);
                                };
                                img.onerror = function (err) {
                                    if (!loaded) {
                                        console.warn(err);
                                        GxLog_1.default.w("oppo img err");
                                        GxLog_1.default.w(err);
                                    }
                                };
                                img.src = "src/" + logoName;
                            }
                            else {
                                GxLog_1.default.w("oppo 没获取到图片");
                            }
                            if (!!configName) {
                                GxGame_1.default.appId = configName.replace(".json", "");
                                try {
                                    fs.readFile({
                                        filePath: "src/" + configName,
                                        encoding: "utf8",
                                        success: function (data) {
                                            console.log("text: " + data.data);
                                            let config = JSON.parse(data.data);
                                            GxAdParams_1.AdParams.oppo = JSON.parse(JSON.stringify(config.oppo));
                                            GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.oppo.labelName;
                                            GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.oppo.age;
                                            GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.oppo.company;
                                            GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.oppo.softCode;
                                            GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.oppo.ysCompanyName;
                                            GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.oppo.ysMail;
                                            GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.oppo.ysAddress;
                                            GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.oppo["heJiConfig"];
                                            callback && callback();
                                        },
                                        fail: function (data, code) {
                                            console.log(` oppo  handling fail, code = ${code}`);
                                            callback && callback();
                                        }
                                    });
                                }
                                catch (e) {
                                    GxLog_1.default.w("oppo 没获取到配置 err");
                                    GxLog_1.default.w(e);
                                    callback && callback();
                                }
                            }
                            else {
                                GxLog_1.default.w("oppo 没获取到配置");
                                callback && callback();
                            }
                        },
                        fail: function (err) {
                            console.log(`handling fail, code = ${err}`);
                            callback && callback();
                        },
                        complete: function () {
                        }
                    });
                }
                catch (e) {
                    GxLog_1.default.w(e);
                    GxLog_1.default.w("oppo 读取目录失败");
                    callback && callback();
                }
                return;
            }
            else if (typeof window["qg"]["gameLoginWithReal"] != "undefined") {
                console.log("进入华为");
                GxConstant_1.default.IS_HUAWEI_GAME = true;
                //@ts-ignore
                var fileSystemManager = qg.getFileSystemManager();
                let configPath = "";
                try {
                    var result = fileSystemManager.readFileSync("manifest.json", "utf8");
                    console.log("result = " + JSON.stringify(result));
                    let parse = JSON.parse(result);
                    console.log(parse.package + ".json");
                    try {
                        fileSystemManager.accessSync(parse.package + ".json");
                        configPath = parse.package + ".json";
                    }
                    catch (error) {
                        configPath = "";
                        console.log("error 1= " + error);
                    }
                }
                catch (error) {
                    configPath = "";
                    console.log("error 2= " + error);
                }
                if (configPath.length <= 0) {
                    try {
                        var result = fileSystemManager.readdirSync("src");
                        console.log("result = " + JSON.stringify(result));
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].endsWith(".json") &&
                                result[i].indexOf("huawei") != -1) {
                                configPath = "src/" + result[i];
                            }
                            else {
                            }
                        }
                    }
                    catch (error) {
                        configPath = "";
                        console.log("error 3= " + error);
                    }
                }
                GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.hw.labelName;
                GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.hw.age;
                GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.hw.company;
                GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.hw.softCode;
                GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.hw.ysCompanyName;
                GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.hw.ysMail;
                GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.hw.ysAddress;
                GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.hw["heJiConfig"];
                if (configPath && configPath.length > 0) {
                    try {
                        fileSystemManager.accessSync(configPath);
                        var config = fileSystemManager.readFileSync(configPath, "utf8");
                        let configObj = JSON.parse(config);
                        console.log(JSON.stringify(configObj));
                        GxAdParams_1.AdParams.hw = JSON.parse(JSON.stringify(configObj.hw));
                        GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.hw.labelName;
                        GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.hw.age;
                        GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.hw.company;
                        GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.hw.softCode;
                        GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.hw.ysCompanyName;
                        GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.hw.ysMail;
                        GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.hw.ysAddress;
                        GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.hw["heJiConfig"];
                        console.log(JSON.stringify(GxAdParams_1.AdParams, null, 2));
                        console.log("hw:" + JSON.stringify(GxAdParams_1.AdParams.hw, null, 2));
                        callback && callback();
                    }
                    catch (error) {
                        console.log("error 4= " + error);
                        GxLog_1.default.e("hw 读取配置error");
                        GxLog_1.default.e("hw 读取配置error");
                        GxLog_1.default.e("hw 读取配置error");
                        callback && callback();
                    }
                }
                else {
                    GxLog_1.default.e("hw 读取配置失败");
                    GxLog_1.default.e("hw 读取配置失败");
                    GxLog_1.default.e("hw 读取配置失败");
                    GxLog_1.default.e("hw 读取配置失败");
                    callback && callback();
                }
                if (GxAdParams_1.AdParams.hw.buildType == "debug") {
                    GxAdParams_1.AdParams.hw.inter = GxAdParams_1.AdParams.hw.debug_inter || "testb4znbuh3n2";
                    GxAdParams_1.AdParams.hw.banner = GxAdParams_1.AdParams.hw.debug_banner || "testw6vs28auh3";
                    GxAdParams_1.AdParams.hw.video = GxAdParams_1.AdParams.hw.debug_video || "testx9dtjwj8hp";
                    GxAdParams_1.AdParams.hw.native1 = GxAdParams_1.AdParams.hw.debug_native1 || "testu7m3hc4gvm";
                    GxLog_1.default.e("使用测试参数");
                }
                return;
            }
            else if (typeof window["qg"]["onUserInfoChange"] != "undefined") {
                console.log("进入小米");
                GxConstant_1.default.IS_MI_GAME = true;
                //@ts-ignore
                var miniGame = qg.getSystemInfoSync().miniGame;
                //@ts-ignore
                console.log(JSON.stringify(qg.getSystemInfoSync()));
                // console.log(miniGame.package);
                // let configName=miniGame.package
                let configName = "gameLogo";
                //@ts-ignore
                let fs = qg.getFileSystemManager();
                //代码包文件读取  必须异步
                try {
                    fs.readFile({
                        filePath: "manifest.json",
                        encoding: "utf-8",
                        success(res) {
                            console.log(res.data);
                            console.log("成功了");
                            GxGame_1.default.Ad().setManifestInfo(JSON.parse(res.data));
                        },
                        fail(res) {
                            console.log("失败了");
                            console.log(res);
                        }
                    });
                }
                catch (e) {
                    console.log("读取manifest.json包名失败");
                }
                GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.mi.labelName;
                GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.mi.age;
                GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.mi.company;
                GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.mi.softCode;
                GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.mi.ysCompanyName;
                GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.mi.ysMail;
                GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.mi.ysAddress;
                GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.mi["heJiConfig"];
                try {
                    fs.readdir({
                        dirPath: "src",
                        success: function (res) {
                            console.log(JSON.stringify(res));
                            let logoName = "";
                            let configName = "";
                            for (let i = 0; i < res.files.length; i++) {
                                let fileListElement = res.files[i];
                                if (fileListElement.indexOf("mini") != -1) {
                                    if (fileListElement.endsWith(".png") ||
                                        fileListElement.endsWith(".jpg")) {
                                        logoName = fileListElement;
                                    }
                                    else if (fileListElement.endsWith(".json")) {
                                        configName = fileListElement;
                                    }
                                }
                            }
                            if (!!logoName) {
                                let img = new Image();
                                let loaded = false;
                                img.onload = function (info) {
                                    loaded = true;
                                    let texture = new cc.Texture2D();
                                    texture.initWithElement(img);
                                    texture.handleLoadedTexture();
                                    GxGame_1.default.LogoSp = new cc.SpriteFrame(texture);
                                };
                                img.onerror = function (err) {
                                    if (!loaded) {
                                        console.warn(err);
                                        GxLog_1.default.w("mi img err");
                                        GxLog_1.default.w(err);
                                    }
                                };
                                img.src = "src/" + logoName;
                            }
                            else {
                                GxLog_1.default.w("mi 没获取到图片");
                            }
                            GxLog_1.default.w("mi configName:" + configName);
                            if (!!configName) {
                                try {
                                    fs.readFile({
                                        filePath: configName,
                                        encoding: "utf8",
                                        success: function (data) {
                                            console.log("text: " + data.data);
                                            let config = JSON.parse(data.data);
                                            GxAdParams_1.AdParams.mi = JSON.parse(JSON.stringify(config.mi));
                                            GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.mi.labelName;
                                            GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.mi.age;
                                            GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.mi.company;
                                            GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.mi.softCode;
                                            GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.mi.ysCompanyName;
                                            GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.mi.ysMail;
                                            GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.mi.ysAddress;
                                            GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.mi["heJiConfig"];
                                            callback && callback();
                                        },
                                        fail: function (data, code) {
                                            GxLog_1.default.w(` mi  handling fail, code = ${code}`);
                                            GxLog_1.default.w(` mi  handling fail, data = ${JSON.stringify(data)}`);
                                            callback && callback();
                                        }
                                    });
                                }
                                catch (e) {
                                    GxLog_1.default.w("mi 没获取到配置 err");
                                    GxLog_1.default.w(e);
                                    callback && callback();
                                }
                            }
                            else {
                                GxLog_1.default.w("mi 没获取到配置");
                                callback && callback();
                            }
                        },
                        fail: function (err) {
                            console.log(`handling fail, code = ${err}`);
                            callback && callback();
                        },
                        complete: function () {
                        }
                    });
                }
                catch (e) {
                    GxLog_1.default.w(e);
                    GxLog_1.default.w("mi 读取目录失败");
                    callback && callback();
                }
                return;
            }
            else {
                console.log("进入vivo");
                let buyLabelName = GxAdParams_1.AdParams.vivo.adLabelName;
                //区分买量
                let isBuy = false;
                // @ts-ignore
                if (qg["getLaunchOptionsSync"]) {
                    var e = null, 
                    // @ts-ignore
                    t = qg.getLaunchOptionsSync();
                    console.log(JSON.stringify(t));
                    console.log(t["query"]);
                    if (t["query"]) {
                        console.log(t["query"]["type"]);
                    }
                    if ("ad" === t.query.type) {
                        isBuy = true;
                    }
                    try {
                        var o = t.referrerInfo.extraData;
                        if (o) {
                            e = o.ad_id || o.adid || null;
                        }
                        else {
                            var n = t.query.internal;
                            if ("deeplink" === (n && n.channel ? n.channel : "")) {
                                var i = n.custom_params;
                                console.log(i);
                                var r = JSON.parse(i)
                                    .cus_origin_uri;
                                let match = r.match(/ad_id=([^&]+)/);
                                let match1 = r.match(/adid=([^&]+)/);
                                if (match && match.length >= 2) {
                                    e = match[1];
                                }
                                if (match1 && match1.length >= 2) {
                                    e = match1[1];
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log("----异常了");
                        console.log(e);
                    }
                    if (!!e) {
                        isBuy = true;
                    }
                    console.log("---e" + e);
                }
                else {
                    console.log("---低版本");
                }
                console.log("---isBuy:" + isBuy);
                //@ts-ignore
                var miniGame = qg.getSystemInfoSync().miniGame;
                console.log(miniGame.package);
                //读取logo图片
                let logoUrl = "";
                let urlPng = "/" + miniGame.package + ".png";
                //@ts-ignore
                var res = qg.isFile({
                    uri: urlPng
                });
                if (res == "true") {
                    logoUrl = urlPng;
                }
                else {
                    let urlJPg = "/" + miniGame.package + ".jpg";
                    //@ts-ignore
                    res = qg.isFile({
                        uri: urlJPg
                    });
                    if (res == "true") {
                        logoUrl = urlJPg;
                    }
                    else {
                    }
                }
                if (!!logoUrl) {
                    let img = new Image();
                    let loaded = false;
                    img.onload = function (info) {
                        GxLog_1.default.i("vivo读取到logo");
                        loaded = true;
                        let texture = new cc.Texture2D();
                        texture.initWithElement(img);
                        texture.handleLoadedTexture();
                        GxGame_1.default.LogoSp = new cc.SpriteFrame(texture);
                    };
                    img.onerror = function (err) {
                        if (!loaded) {
                            GxLog_1.default.w("vivo读取logo失败");
                            GxLog_1.default.w(err);
                        }
                    };
                    img.src = logoUrl;
                }
                else {
                    GxLog_1.default.w("vivo没有读取到logo图片 ");
                }
                GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.vivo.labelName;
                GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.vivo.age;
                GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.vivo.company;
                GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.vivo.softCode;
                GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.vivo.ysCompanyName;
                GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.vivo.ysMail;
                GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.vivo.ysAddress;
                GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.vivo["heJiConfig"];
                try {
                    //@ts-ignore
                    //读取参数配置
                    const result = qg.readFileSync({
                        uri: "/" + miniGame.package + ".json",
                        encoding: "utf8"
                    });
                    if (typeof result === "string") {
                        GxLog_1.default.w(`vivo  读取配置失败 = ${result}`);
                    }
                    else {
                        console.log("vivo handling success, text: " + result.text);
                        let config = JSON.parse(result.text);
                        GxAdParams_1.AdParams.vivo = JSON.parse(JSON.stringify(config.vivo));
                        GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.vivo.labelName;
                        GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.vivo.age;
                        GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.vivo.company;
                        GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.vivo.softCode;
                        GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.vivo.ysCompanyName;
                        GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.vivo.ysMail;
                        GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.vivo.ysAddress;
                        GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.vivo["heJiConfig"];
                    }
                }
                catch (e) {
                    GxLog_1.default.w(e);
                    GxLog_1.default.w("vivo没有读取到配置文件 ");
                }
                if (isBuy && !!buyLabelName) {
                    GxAdParams_1.AdParams.vivo.labelName = buyLabelName;
                    GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.vivo.labelName;
                }
                console.log("最终label:" + GxAdParams_1.AdParams.labelName);
                GxConstant_1.default.IS_VIVO_GAME = true;
            }
        }
        else if (typeof window["tt"] != "undefined") {
            GxConstant_1.default.IS_TT_GAME = true;
            GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.tt["company"];
            GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.tt["softCode"];
        }
        else if (typeof window["qq"] != "undefined") {
            GxConstant_1.default.IS_QQ_GAME = true;
            // @ts-ignore
            let qqfs = qq.getFileSystemManager();
            GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.qq["labelName"];
            GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.qq["age"];
            GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.qq["company"];
            GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.qq["softCode"];
            GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.qq["ysCompanyName"];
            GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.qq["ysMail"];
            GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.qq["ysAddress"];
            GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.qq["heJiConfig"];
            try {
                qqfs.accessSync(`params.json`);
                let readFileSync = qqfs.readFileSync(`params.json`, "utf-8");
                let config = JSON.parse(readFileSync);
                console.log(readFileSync);
                GxAdParams_1.AdParams.qq = JSON.parse(JSON.stringify(config.qq));
                GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.qq["labelName"];
                GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.qq["age"];
                GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.qq["company"];
                GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.qq["softCode"];
                GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.qq["ysCompanyName"];
                GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.qq["ysMail"];
                GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.qq["ysAddress"];
                GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.qq["heJiConfig"];
            }
            catch (e) {
                console.warn(e);
                console.warn("qq 获取参数配置文件失败 params.json 使用代码中的配置");
            }
        }
        else if (typeof window["h5api"] != "undefined") {
            GxConstant_1.default.IS_4399_H5_GAME = true;
            intLabel = false;
        }
        else if (typeof window["gamebox"] != "undefined") {
            GxConstant_1.default.IS_4399_BOX_GAME = true;
            intLabel = false;
        }
        else if (typeof window["ks"] != "undefined") {
            GxConstant_1.default.IS_KS_GAME = true;
            GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.ks.labelName;
            GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.ks["labelName"];
            GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.ks["age"];
            GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.ks["company"];
            GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.ks["softCode"];
            GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.ks["ysCompanyName"];
            GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.ks["ysMail"];
            GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.ks["ysAddress"];
            GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.ks["heJiConfig"];
        }
        else if (typeof window["wx"] != "undefined") {
            GxConstant_1.default.IS_WECHAT_GAME = true;
            // @ts-ignore
            let wxfs = wx.getFileSystemManager();
            GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.wx["labelName"];
            GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.wx["age"];
            GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.wx["company"];
            GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.wx["softCode"];
            GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.wx["ysCompanyName"];
            GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.wx["ysMail"];
            GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.wx["ysAddress"];
            GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.wx["heJiConfig"];
            try {
                wxfs.accessSync(`params.json`);
                let readFileSync = wxfs.readFileSync(`params.json`, "utf-8");
                let config = JSON.parse(readFileSync);
                console.log(readFileSync);
                GxAdParams_1.AdParams.wx = JSON.parse(JSON.stringify(config.wx));
                GxAdParams_1.AdParams.labelName = GxAdParams_1.AdParams.wx["labelName"];
                GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.wx["age"];
                GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.wx["company"];
                GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.wx["softCode"];
                GxAdParams_1.AdParams.ysCompanyName = GxAdParams_1.AdParams.wx["ysCompanyName"];
                GxAdParams_1.AdParams.ysMail = GxAdParams_1.AdParams.wx["ysMail"];
                GxAdParams_1.AdParams.ysAddress = GxAdParams_1.AdParams.wx["ysAddress"];
                GxAdParams_1.AdParams.heJiConfig = GxAdParams_1.AdParams.wx["heJiConfig"];
            }
            catch (e) {
                console.warn(e);
                console.warn("wx 获取参数配置文件失败 params.json 使用代码中的配置");
            }
        }
        else if (typeof window["swan"] != "undefined") {
            GxConstant_1.default.IS_BAIDU_GAME = true;
        }
        else if (typeof window["uc"] != "undefined") {
            GxConstant_1.default.IS_UC_GAME = true;
        }
        else if (cc.sys.os == cc.sys.OS_ANDROID && CC_JSB) {
            GxConstant_1.default.IS_ANDROID_NATIVE = true;
            intLabel = false;
        }
        else if (typeof window["H5Bridge"] != "undefined") {
            let platform = window["H5Bridge"].getPlatform();
            if (platform == "ios") {
                console.log("iosh5");
                GxConstant_1.default.IS_IOS_H5 = true;
                intLabel = false;
            }
            else {
                console.log("安卓h5");
                GxConstant_1.default.IS_ANDROID_H5 = true;
                intLabel = false;
            }
        }
        else if (cc.sys.os == cc.sys.OS_IOS && CC_JSB) {
            GxConstant_1.default.IS_IOS_NATIVE = true;
            intLabel = false;
        }
        else if (typeof window["my"] != "undefined") {
            GxConstant_1.default.IS_ZFB_GAME = true;
            intLabel = false;
            // AdParams.labelName = AdParams.zfb["labelName"];
            GxAdParams_1.AdParams.age = GxAdParams_1.AdParams.zfb["age"];
            GxAdParams_1.AdParams.company = GxAdParams_1.AdParams.zfb["company"];
            GxAdParams_1.AdParams.softCode = GxAdParams_1.AdParams.zfb["softCode"];
            // AdParams.ysCompanyName = AdParams.zfb["ysCompanyName"];
            // AdParams.ysMail = AdParams.zfb["ysMail"];
            // AdParams.ysAddress = AdParams.zfb["ysAddress"];
        }
        else {
            intLabel = false;
        }
        callback && callback();
    }
    static initGame(callback) {
        this.initPlatform(() => {
            GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.initSDK, {});
            let sysInfo = null;
            let umAppKey = "";
            let uma = null;
            if (GxConstant_1.default.IS_WECHAT_GAME) {
                // @ts-ignore
                wx.showShareMenu({
                    withShareTicket: true,
                    menus: ["shareAppMessage", "shareTimeline"]
                });
                // @ts-ignore
                wx.onShareAppMessage(() => {
                    return {
                        title: this.shareWord[0],
                        imageUrl: GxAdParams_1.AdParams.wx.shareImgUrl
                    };
                });
                // @ts-ignore
                sysInfo = wx.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_TT_GAME) {
                // @ts-ignore
                // @ts-ignore
                sysInfo = tt.getSystemInfoSync();
                // umAppKey = AdParams.tt["umAppKey"]
                // @ts-ignore
                //  uma = tt.uma;
                // @ts-ignore
                tt.showShareMenu({
                    success(res) {
                        console.log("已成功显示转发按钮");
                    },
                    fail(err) {
                        console.log("showShareMenu 调用失败", err.errMsg);
                    },
                    complete(res) {
                        console.log("showShareMenu 调用完成");
                    }
                });
                // @ts-ignore
                tt.onShareAppMessage((res) => {
                    //当监听到用户点击了分享或者拍抖音等按钮后，会执行该函数
                    console.log(res.channel);
                    // do something
                    return {
                        //执行函数后，这里是需要该函数返回的对象
                        title: this.shareWord[1],
                        imageUrl: this.sharePath,
                        templateId: GxAdParams_1.AdParams.tt.shareTemplateId,
                        success() {
                            console.log("分享成功");
                        },
                        fail(e) {
                            console.log("分享失败", e);
                        }
                    }; //返回的对象会传入tt.shareAppMessage进行最终分享
                });
            }
            else if (GxConstant_1.default.IS_BAIDU_GAME) {
                // @ts-ignore
                sysInfo = swan.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_QQ_GAME) {
                //qq要显示用户协议
                GxGame_1.default.canShowUser = true;
                // @ts-ignore
                qq.showShareMenu({
                    showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"]
                });
                // @ts-ignore
                qq.onShareAppMessage(() => {
                    return {
                        title: this.shareWord[0],
                        imageUrl: GxAdParams_1.AdParams.qq.shareImgUrl
                    };
                });
                // @ts-ignore
                sysInfo = qq.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_OPPO_GAME) {
                umAppKey = GxAdParams_1.AdParams.oppo["umAppKey"];
                // @ts-ignore
                uma = qg.uma;
                // @ts-ignore
                sysInfo = qg.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_MI_GAME) {
                umAppKey = GxAdParams_1.AdParams.mi["umAppKey"];
                // @ts-ignore
                uma = qg.uma;
                // @ts-ignore
                sysInfo = qg.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_VIVO_GAME) {
                umAppKey = GxAdParams_1.AdParams.vivo["umAppKey"];
                // @ts-ignore
                uma = qg.uma;
                // @ts-ignore
                sysInfo = qg.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_UC_GAME) {
                // @ts-ignore
                sysInfo = uc.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_KS_GAME) {
                // @ts-ignore
                sysInfo = ks.getSystemInfoSync();
            }
            else if (GxConstant_1.default.IS_HUAWEI_GAME) {
                // @ts-ignore
                // sysInfo = qg.getSystemInfoSync();
                umAppKey = GxAdParams_1.AdParams.vivo["umAppKey"];
                // @ts-ignore
                uma = qg.uma;
            }
            else if (GxConstant_1.default.IS_ZFB_GAME) {
                // @ts-ignore
                sysInfo = my.getSystemInfoSync();
            }
            if (uma && !!umAppKey) {
                console.log("初始化umeng");
                uma &&
                    uma.init({
                        appKey: umAppKey,
                        useOpenid: false,
                        autoGetOpenid: false,
                        debug: true
                    });
            }
            else {
                console.log("不能初始化umeng");
            }
            if (sysInfo) {
                this.screenWidth = sysInfo.screenWidth;
                this.screenHeight = sysInfo.screenHeight;
                if (window["cc"]) {
                    let canvas = cc.director.getScene().getChildByName("Canvas");
                    if (canvas.width <= canvas.height) {
                        this.scale = this.screenWidth / canvas.width;
                    }
                    else {
                        this.scale = this.screenHeight / canvas.height;
                    }
                }
                else if (window["Laya"]) {
                }
            }
            this.gameEvent("initGame");
            ResUtil_1.default.loadResDir("gx/prefab", cc.Prefab)
                .then(() => {
                console.log("加载prefab成功");
            })
                .catch((e) => {
                console.log("加载prefab失败");
            });
            setTimeout(() => {
                //延迟初始化广告  防止标签没初始化完
                // this.adConfig.useNative = !GxGameUtil.getInstance().gGB("custom")
                // this.Ad().initAd();
            }, 4000);
            callback && callback();
        });
        ResUtil_1.default.loadJsonAsset("gx/cfg/privacy", (err, json) => {
        });
    }
    /**
     * 设置uigroup
     * @param groupName
     */
    static setUIGroup(groupName) {
        this.uiGroup = groupName;
    }
    static initH5Hall() {
        this.isH5Hall = true;
    }
    /**
     * 显示隐私政策按钮
     * @param parentNode
     */
    static showPrivacyBtnWithParent(parentNode) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.showGamePrivacyBtn, {});
        console.log("显示了111");
        if (GxConstant_1.default.IS_ANDROID_H5) {
            if (!this.isH5Hall) {
                //子集不显示了   显示个返回大厅的按钮
                this.showH5GameHallBtnWithParent(parentNode);
                return;
            }
        }
        if (!GxGame_1.default.needShowAuthorizeBtn()) {
            console.log("不需要显示隐私政策按钮");
            return;
        }
        if (parentNode == null) {
            GxLog_1.default.e("showPrivacyBtnWithParent parent is null ");
            this.showPrivacyBtn();
            return;
        }
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnPrivacySp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnPrivacySp;
                node.parent = parentNode;
                node.setContentSize(100, 100);
                node.position = cc.v3(0, 0, 0);
                console.log("显示了");
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    console.log("点击了");
                    self.onClickPrivacyBtn();
                });
                GxLog_1.default.i("showPrivacyBtnWithParent 成功");
            }
            else {
                GxLog_1.default.e("隐私按钮显示失败 sp null");
            }
        };
        if (GxGame_1.default.btnPrivacySp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_yinsixieyi", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("隐私按钮显示失败" + err);
                }
                GxGame_1.default.btnPrivacySp = spriteFrame;
                showCallback();
            });
        }
    }
    /**
     * 显示用户协议按钮
     * @param parentNode
     */
    static showUserPrivacyBtnWithParent(parentNode) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.showUserPrivacyBtn, {});
        if (!GxConstant_1.default.IS_QQ_GAME) {
            GxLog_1.default.e("除qq外 其他渠道不显示 ");
            return;
        }
        if (!GxGame_1.default.needShowAuthorizeBtn()) {
            GxLog_1.default.e("不需要用户协议按钮");
            return;
        }
        if (parentNode == null) {
            GxLog_1.default.e("showUserPrivacyBtnWithParent parent is null ");
            this.showUserPrivacyBtn();
            return;
        }
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnUserSp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnUserSp;
                node.parent = parentNode;
                node.setContentSize(100, 100);
                node.position = cc.v3(0, 0, 0);
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    self.onClickUserPrivacyBtn();
                });
                GxLog_1.default.i("showUserPrivacyBtnWithParent 成功");
            }
            else {
                GxLog_1.default.e("用户协议按钮显示失败 sp null");
            }
        };
        if (GxGame_1.default.btnUserSp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_fuwuxieyi", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("用户协议按钮显示失败" + err);
                }
                GxGame_1.default.btnUserSp = spriteFrame;
                showCallback();
            });
        }
    }
    static showH5GameHallBtnWithParent(parentNode) {
        if (parentNode == null) {
            GxLog_1.default.e("show showH5GameHallBtnWithParent parent is null ");
            this.showH5GameHallBtn();
            return;
        }
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnH5HallSp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnH5HallSp;
                node.parent = parentNode;
                node.setContentSize(100, 100);
                node.position = cc.v3(0, 0, 0);
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    self.onClickBackH5HallBtn();
                });
                GxLog_1.default.i("showH5GameHallBtnWithParent 成功");
            }
            else {
                GxLog_1.default.e("showH5GameHallBtnWithParent失败 sp null");
            }
        };
        if (GxGame_1.default.btnH5HallSp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_backhall", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("showH5GameHallBtnWithParent 显示失败" + err);
                }
                GxGame_1.default.btnH5HallSp = spriteFrame;
                showCallback();
            });
        }
    }
    static showH5GameHallBtn(btnPosition = null) {
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnH5HallSp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnH5HallSp;
                node.parent = cc.find("Canvas");
                let winSize = cc.winSize;
                node.position = btnPosition
                    ? btnPosition
                    : cc.v3(-(winSize.width / 2 - 100), -110, 0);
                node.setContentSize(100, 100);
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    self.onClickBackH5HallBtn();
                });
            }
            else {
                GxLog_1.default.e("showH5GameHallBtn 失败1 sp null");
            }
        };
        if (GxGame_1.default.btnH5HallSp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_backhall", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("showH5GameHallBtn 失败1" + err);
                }
                GxGame_1.default.btnH5HallSp = spriteFrame;
                showCallback();
            });
        }
    }
    static onClickBackH5HallBtn() {
        if (GxConstant_1.default.IS_ANDROID_H5) {
            this.Ad().backGameHall();
        }
        else {
            GxLog_1.default.e("咋会调用这儿！！！");
        }
    }
    static showTTBoxBtnWithParent(parentNode, rewardCallback, rewardNum, iconAndName) {
        if (!GxGame_1.default.needTTBoxBtn()) {
            console.log("不需要显示字节宝箱按钮");
            return;
        }
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnTTBoxSp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnTTBoxSp;
                node.parent = parentNode;
                node.setContentSize(100, 100);
                node.position = cc.v3(0, 0, 0);
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    console.log("点击了");
                    GxGame_1.default.Ad().hideBanner();
                    ResUtil_1.default.loadPrefab("gx/prefab/TTReward", (err, prefab) => {
                        let node = cc.instantiate(prefab);
                        if (!!GxGame_1.default.uiGroup) {
                            node.group = GxGame_1.default.uiGroup;
                        }
                        var canvas = cc.find("Canvas");
                        canvas.addChild(node);
                        var nodets = node.getComponent("Gx_TTReward");
                        // nodets.Reward = rewardCallback;
                        nodets.init(rewardCallback, rewardNum, iconAndName);
                        // nodets.stringlabel.string = string
                    });
                });
            }
            else {
                GxLog_1.default.e("添加桌面按钮 失败 sp null");
            }
        };
        if (GxGame_1.default.btnTTBoxSp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_TTBox", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("添加字节奖励显示失败" + err);
                }
                GxGame_1.default.btnTTBoxSp = spriteFrame;
                showCallback();
            });
        }
    }
    static showAddDesktopBtnWithParent(parentNode) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.showAddDesktopBtn, {});
        if (!GxGame_1.default.needAddDesktopBtn()) {
            console.log("不需要显示添加桌面按钮");
            return;
        }
        if (this.hasDesktop()) {
            return;
        }
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnAddDesktopSp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnAddDesktopSp;
                node.parent = parentNode;
                node.setContentSize(100, 100);
                node.position = cc.v3(0, 0, 0);
                console.log("显示了");
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    console.log("点击了");
                    self.onClickAddDesktopBtn(node);
                });
                GxLog_1.default.i("添加桌面按钮 成功");
            }
            else {
                GxLog_1.default.e("添加桌面按钮 失败 sp null");
            }
        };
        if (GxGame_1.default.btnAddDesktopSp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_zhuomian", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("添加桌面显示失败" + err);
                }
                GxGame_1.default.btnAddDesktopSp = spriteFrame;
                showCallback();
            });
        }
    }
    static showMoreGameBtnWithParent(parentNode) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.showMoreGameBtn, {});
        if (GxUtils_1.default.getNativePlatform() == GxEnum_1.PLATFORM.OPPO) {
            if (parentNode == null) {
                GxLog_1.default.e("showMoreGameBtnWithParent parent is null ");
                this.showMoreGameBtn();
                return;
            }
            let self = this;
            let showCallback = () => {
                if (GxGame_1.default.btnMoreGameSp) {
                    let node = new cc.Node();
                    let addComponent = node.addComponent(cc.Sprite);
                    addComponent.spriteFrame = GxGame_1.default.btnMoreGameSp;
                    node.parent = parentNode;
                    node.setContentSize(100, 100);
                    node.position = cc.v3(0, 0, 0);
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        self.onClickMoreGameBtn();
                    });
                    GxLog_1.default.i("showMoreGameBtnWithParent 成功");
                }
                else {
                    GxLog_1.default.e("更多游戏按钮显示失败 sp null");
                }
            };
            if (GxGame_1.default.btnMoreGameSp) {
                showCallback();
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/gengduo", (err, spriteFrame) => {
                    if (err) {
                        GxLog_1.default.e("更多游戏按钮显示失败" + err);
                    }
                    GxGame_1.default.btnMoreGameSp = spriteFrame;
                    showCallback();
                });
            }
        }
        else {
            GxLog_1.default.e("不是安卓oppo  apk或者qq不显示更多游戏");
        }
    }
    static showQQShareBtnWithParent(parentNode) {
        if (GxConstant_1.default.IS_QQ_GAME) {
            if (parentNode == null) {
                GxLog_1.default.e("showQQShareBtnWithParent parent is null ");
                return;
            }
            let self = this;
            let showCallback = () => {
                if (GxGame_1.default.btnQQShareSp) {
                    let node = new cc.Node();
                    let addComponent = node.addComponent(cc.Sprite);
                    addComponent.spriteFrame = GxGame_1.default.btnQQShareSp;
                    node.parent = parentNode;
                    node.setContentSize(100, 100);
                    node.position = cc.v3(0, 0, 0);
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        // self.onClickMoreGameBtn()
                        GxGame_1.default.showShareFriend((res) => {
                            console.log("分享的回调结果：" + res);
                        });
                    });
                    GxLog_1.default.i("showMoreGameBtnWithParent 成功");
                }
                else {
                    GxLog_1.default.e("qq分享按钮显示失败 sp null");
                }
            };
            if (GxGame_1.default.btnQQShareSp) {
                showCallback();
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/btn_QQShare", (err, spriteFrame) => {
                    if (err) {
                        GxLog_1.default.e("qq分享按钮显示失败" + err);
                    }
                    GxGame_1.default.btnQQShareSp = spriteFrame;
                    showCallback();
                });
            }
        }
        else {
            GxLog_1.default.e("非qq不显示分享按钮");
        }
    }
    static showGameAgeWithParent(parentNode) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.showGameAgeBtn, {});
        if (parentNode == null) {
            GxLog_1.default.e("showGameAgeWithParent parent is null ");
            this.showGameAge();
            return;
        }
        let gameAge = GxGame_1.default.getGameAge();
        if (gameAge > 0) {
            let showCallback = () => {
                if (GxGame_1.default.ageSp) {
                    let node = new cc.Node();
                    let addComponent = node.addComponent(cc.Sprite);
                    addComponent.spriteFrame = GxGame_1.default.ageSp;
                    node.parent = parentNode;
                    node.position = cc.v3(0, 0, 0);
                    GxLog_1.default.i("ageSp显示成功");
                    let self = this;
                    node.setContentSize(100, 130);
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        self.onClickBtn(3);
                    });
                }
                else {
                    GxLog_1.default.e("ageSp 空 显示适龄失败");
                }
            };
            if (GxGame_1.default.ageSp) {
                showCallback();
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/icon" + gameAge, (err, spriteFrame) => {
                    if (err) {
                        GxLog_1.default.e("适龄显示失败" + err);
                    }
                    GxGame_1.default.ageSp = spriteFrame;
                    showCallback();
                });
            }
        }
    }
    static showGameAge() {
        let gameAge = GxGame_1.default.getGameAge();
        if (gameAge > 0) {
            let showCallback = () => {
                if (GxGame_1.default.ageSp) {
                    let node = new cc.Node();
                    let addComponent = node.addComponent(cc.Sprite);
                    addComponent.spriteFrame = GxGame_1.default.ageSp;
                    node.parent = cc.find("Canvas");
                    let winSize = cc.winSize;
                    node.position = cc.v3(-(winSize.width / 2 - 100), 100, 0);
                    let self = this;
                    node.setContentSize(100, 130);
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        self.onClickBtn(3);
                    });
                }
                else {
                    GxLog_1.default.e("ageSp 空 显示适龄失败   ");
                }
            };
            if (GxGame_1.default.ageSp) {
                showCallback();
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/icon" + gameAge, (err, spriteFrame) => {
                    if (err) {
                        GxLog_1.default.e(err);
                    }
                    GxGame_1.default.ageSp = spriteFrame;
                    showCallback();
                });
            }
        }
    }
    static onClickPrivacyBtn() {
        if (GxConstant_1.default.IS_QQ_GAME) {
            GxGame_1.default.Ad().showAuthorize(() => {
                // 同意继续游戏
            }, () => {
                // 拒绝退出游戏，或者隔1秒再弹出强制同意
            });
        }
        else {
            GxGame_1.default.Ad().showPrivacy("privacy");
        }
    }
    static onClickMoreGameBtn() {
        GxGame_1.default.Ad().showGamePortal();
    }
    static onClickAddDesktopBtn(node) {
        if (GxConstant_1.default.IS_VIVO_GAME ||
            GxConstant_1.default.IS_OPPO_GAME ||
            GxConstant_1.default.IS_QQ_GAME) {
            GxGame_1.default.Ad().addDesktop(() => {
                node.destroy();
            });
        }
    }
    static hasDesktop() {
        if (GxConstant_1.default.IS_VIVO_GAME || GxConstant_1.default.IS_OPPO_GAME) {
            // @ts-ignore
            qg.hasShortcutInstalled({
                success: function (res) {
                    // 判断图标存在
                    if (res) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            return false;
        }
        else {
            return true;
        }
    }
    static showPrivacyBtn(btnPosition = null) {
        if (!GxGame_1.default.needShowAuthorizeBtn()) {
            console.log("不需要显示隐私政策按钮");
            return;
        }
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnPrivacySp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnPrivacySp;
                node.parent = cc.find("Canvas");
                let winSize = cc.winSize;
                node.position = btnPosition
                    ? btnPosition
                    : cc.v3(-(winSize.width / 2 - 100), -110, 0);
                node.setContentSize(100, 100);
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    self.onClickPrivacyBtn();
                });
            }
            else {
                GxLog_1.default.e("隐私按钮显示失败 sp null");
            }
        };
        if (GxGame_1.default.btnPrivacySp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_yinsixieyi", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("隐私按钮显示失败" + err);
                }
                GxGame_1.default.btnPrivacySp = spriteFrame;
                showCallback();
            });
        }
    }
    static showUserPrivacyBtn(btnPosition = null) {
        if (!GxConstant_1.default.IS_QQ_GAME) {
            GxLog_1.default.e("除qq外 其他渠道不显示 ");
            return;
        }
        if (!GxGame_1.default.needShowAuthorizeBtn()) {
            console.log("不需要显示服务协议按钮");
            return;
        }
        let self = this;
        let showCallback = () => {
            if (GxGame_1.default.btnPrivacySp) {
                let node = new cc.Node();
                let addComponent = node.addComponent(cc.Sprite);
                addComponent.spriteFrame = GxGame_1.default.btnPrivacySp;
                node.parent = cc.find("Canvas");
                let winSize = cc.winSize;
                node.position = btnPosition
                    ? btnPosition
                    : cc.v3(-(winSize.width / 2 - 100), -110, 0);
                node.setContentSize(100, 100);
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    self.onClickUserPrivacyBtn();
                });
            }
            else {
                GxLog_1.default.e("服务协议按钮显示失败 sp null");
            }
        };
        if (GxGame_1.default.btnPrivacySp) {
            showCallback();
        }
        else {
            ResUtil_1.default.loadSprite("gx/texture/btn_fuwuxieyi", (err, spriteFrame) => {
                if (err) {
                    GxLog_1.default.e("服务协议按钮显示失败" + err);
                }
                GxGame_1.default.btnPrivacySp = spriteFrame;
                showCallback();
            });
        }
    }
    static onClickUserPrivacyBtn() {
        GxGame_1.default.Ad().showPrivacy("user");
    }
    static showMoreGameBtn(btnPosition = null) {
        if (GxUtils_1.default.getNativePlatform() == GxEnum_1.PLATFORM.OPPO || GxConstant_1.default.IS_QQ_GAME) {
            let self = this;
            let showCallback = () => {
                if (GxGame_1.default.btnMoreGameSp) {
                    let node = new cc.Node();
                    let addComponent = node.addComponent(cc.Sprite);
                    addComponent.spriteFrame = GxGame_1.default.btnMoreGameSp;
                    node.parent = cc.find("Canvas");
                    let winSize = cc.winSize;
                    node.position = btnPosition
                        ? btnPosition
                        : cc.v3(-(winSize.width / 2 - 100), 210, 0);
                    node.setContentSize(100, 100);
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        self.onClickMoreGameBtn();
                    });
                }
                else {
                    GxLog_1.default.e("隐私按钮显示失败 sp null");
                }
            };
            if (GxGame_1.default.btnMoreGameSp) {
                showCallback();
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/gengduo", (err, spriteFrame) => {
                    if (err) {
                        GxLog_1.default.e("隐私按钮显示失败" + err);
                    }
                    GxGame_1.default.btnMoreGameSp = spriteFrame;
                    showCallback();
                });
            }
        }
        else {
            GxLog_1.default.e("不是安卓oppo  apk或者qq不显示更多游戏");
        }
    }
    static gGB(key) {
        if (GxConstant_1.default.IS_QQ_GAME) {
            if (GxAdParams_1.AdParams.qq.labelVersion &&
                (GxAdParams_1.AdParams.qq.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.qq.labelVersion;
            }
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            if (GxAdParams_1.AdParams.wx.labelVersion &&
                (GxAdParams_1.AdParams.wx.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.wx.labelVersion;
            }
        }
        else if (GxConstant_1.default.IS_TT_GAME) {
            if (GxAdParams_1.AdParams.tt.labelVersion &&
                (GxAdParams_1.AdParams.tt.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.tt.labelVersion;
            }
        }
        else if (GxConstant_1.default.IS_OPPO_GAME) {
            if (GxAdParams_1.AdParams.oppo.labelVersion &&
                (GxAdParams_1.AdParams.oppo.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.oppo.labelVersion;
            }
            if (window["testDataToServer"] && window["testDataToServer"].isAdUser) {
                key += "ad";
            }
        }
        else if (GxConstant_1.default.IS_MI_GAME) {
            if (GxAdParams_1.AdParams.mi.labelVersion &&
                (GxAdParams_1.AdParams.mi.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.mi.labelVersion;
            }
        }
        else if (GxConstant_1.default.IS_VIVO_GAME) {
            if (GxAdParams_1.AdParams.vivo.labelVersion &&
                (GxAdParams_1.AdParams.vivo.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.vivo.labelVersion;
            }
            if (window["testDataToServer"] && window["testDataToServer"].isAdUser) {
                key += "ad";
            }
        }
        else if (GxConstant_1.default.IS_HUAWEI_GAME) {
            if (GxAdParams_1.AdParams.hw.labelVersion &&
                (GxAdParams_1.AdParams.hw.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.hw.labelVersion;
            }
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            if (GxAdParams_1.AdParams.ks.labelVersion &&
                (GxAdParams_1.AdParams.ks.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.ks.labelVersion;
            }
        }
        else if (GxConstant_1.default.IS_ANDROID_NATIVE || GxConstant_1.default.IS_ANDROID_H5) {
            return GxUtils_1.default.callMethodLabel(key);
        }
        return GxGameUtil_1.default.getInstance().gGB(key);
    }
    static gGN(key, defaultValue = 0) {
        if (GxConstant_1.default.IS_ANDROID_NATIVE || GxConstant_1.default.IS_ANDROID_H5) {
            return GxUtils_1.default.callMethodLabelValue(key, defaultValue);
        }
        else if (GxConstant_1.default.IS_OPPO_GAME) {
            if (GxAdParams_1.AdParams.oppo.labelVersion &&
                (GxAdParams_1.AdParams.oppo.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.oppo.labelVersion;
            }
            return GxGameUtil_1.default.getInstance().gGN(key, defaultValue);
        }
        else if (GxConstant_1.default.IS_MI_GAME) {
            if (GxAdParams_1.AdParams.mi.labelVersion &&
                (GxAdParams_1.AdParams.mi.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.mi.labelVersion;
            }
            return GxGameUtil_1.default.getInstance().gGN(key, defaultValue);
        }
        else if (GxConstant_1.default.IS_VIVO_GAME) {
            if (GxAdParams_1.AdParams.vivo.labelVersion &&
                (GxAdParams_1.AdParams.vivo.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.vivo.labelVersion;
            }
            return GxGameUtil_1.default.getInstance().gGN(key, defaultValue);
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            if (GxAdParams_1.AdParams.qq.labelVersion &&
                (GxAdParams_1.AdParams.qq.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.qq.labelVersion;
            }
            return GxGameUtil_1.default.getInstance().gGN(key, defaultValue);
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            if (GxAdParams_1.AdParams.ks.labelVersion &&
                (GxAdParams_1.AdParams.ks.labelVersion + "").length > 0) {
                key += GxAdParams_1.AdParams.ks.labelVersion;
            }
            return GxGameUtil_1.default.getInstance().gGN(key, defaultValue);
        }
        return GxGameUtil_1.default.getInstance().gGN(key, defaultValue);
    }
    static Ad() {
        if (GxConstant_1.default.IS_WECHAT_GAME) {
            return WxAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            return QQAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_OPPO_GAME) {
            return OppoAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_MI_GAME) {
            return MiAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_VIVO_GAME) {
            return VivoAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_ANDROID_NATIVE) {
            return AndroidAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_ANDROID_H5) {
            return AndroidH5Adapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_4399_H5_GAME) {
            return H54399Adapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_HUAWEI_GAME) {
            return HwAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_TT_GAME) {
            return TTAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            return KsAdapter_1.default.getInstance();
        }
        else if (GxConstant_1.default.IS_ZFB_GAME) {
            return ZFBAdapter_1.default.getInstance();
        }
        else {
            return BaseAdapter_1.default.getInstance();
        }
    }
    /**
     * 微信分享
     * @param complete 完成回调，参数表示是否成功
     */
    static shareGame(complete) {
        if (GxConstant_1.default.IS_WECHAT_GAME) {
            // @ts-ignore
            wx.shareAppMessage({
                title: this.shareWord[0],
                imageUrl: GxAdParams_1.AdParams.wx.shareImgUrl
            });
            let share_time = new Date().getTime();
            let func = (res) => {
                if (new Date().getTime() - share_time >= 3000) {
                    complete && complete(true);
                    // wx.showToast({title: '分享成功',duration: 2000});
                }
                else {
                    // @ts-ignore
                    wx.showModal({
                        title: "提示",
                        content: "该群已分享过,请换个群",
                        showCancel: true,
                        cancelText: "取消",
                        cancelColor: "#000",
                        confirmText: "去分享",
                        confirmColor: "#08f",
                        success: (res) => {
                            if (res.confirm) {
                                this.shareGame(complete);
                            }
                            else if (res.cancel) {
                                complete && complete(false);
                            }
                        }
                    });
                }
                // @ts-ignore
                wx.offShow(func);
            };
            // @ts-ignore
            wx.onShow(func);
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            // @ts-ignore
            qq.shareAppMessage({
                title: this.shareWord[0],
                imageUrl: GxAdParams_1.AdParams.qq.shareImgUrl,
                query: "",
                success: () => {
                    complete && complete(true);
                },
                fail: () => {
                    complete && complete(false);
                }
            });
        }
        else if (GxConstant_1.default.IS_UC_GAME) {
            // @ts-ignore
            uc.shareAppMessage();
        }
        else if (GxConstant_1.default.IS_TT_GAME) {
            // @ts-ignore
            tt.shareAppMessage({
                title: this.shareWord[0],
                desc: this.shareWord[1],
                imageUrl: this.sharePath,
                templateId: GxAdParams_1.AdParams.tt.shareTemplateId,
                query: "",
                success() {
                    console.log("分享成功");
                    complete && complete(true);
                },
                fail(e) {
                    console.log("分享失败");
                    complete && complete(false);
                }
            });
        }
    }
    static canShowShare() {
        if (GxConstant_1.default.IS_KS_GAME) {
            return true;
        }
        return false;
    }
    static startgamebtn() {
        /*    if (GxConstant.IS_OPPO_GAME || GxConstant.IS_VIVO_GAME) {
                    if (this.enterMainCount == 0) {
                        let label = GxGame.gGB("z1");
                        if (label) {
                            this.enterMainCount = 1;
                            var gailv = GxGame.gGN("gailv")
                            if (Math.round(Math.random() * 99 + 1) < gailv) {
                                this.Ad().showVideo((res) => {
                                    this.Ad().showNativeInterstitial();
                                })
                            }
                        }
                    }
                }*/
    }
    static gameEvent(eventName, params = null) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.event, { eventName, params });
        console.log("[gx_game] gameEvent:" + eventName);
        /*   let patt = /^\w{1,100}$/;
           if (!patt.test(eventName)) {
               console.warn("事件名不符合要求：" + eventName);
           }*/
        if (GxConstant_1.default.IS_ANDROID_NATIVE ||
            GxConstant_1.default.IS_IOS_NATIVE ||
            GxConstant_1.default.IS_ANDROID_H5) {
            GxUtils_1.default.callMethod("gameEvent", eventName);
        }
        else if (GxConstant_1.default.IS_OPPO_GAME ||
            GxConstant_1.default.IS_VIVO_GAME ||
            GxConstant_1.default.IS_HUAWEI_GAME ||
            GxConstant_1.default.IS_MI_GAME) {
            //@ts-ignore
            qg.uma && qg.uma.trackEvent(eventName, params);
        }
        else if (GxConstant_1.default.IS_TT_GAME) {
            //@ts-ignore
            tt.uma && tt.uma.trackEvent(eventName, params);
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            //@ts-ignore
            wx.uma && wx.uma.trackEvent(eventName, params);
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            //@ts-ignore
            wx.uma && wx.uma.trackEvent(eventName, params);
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            //@ts-ignore
            qq.uma && qq.uma.trackEvent(eventName, params);
        }
        if (window["TDAPP"]) {
            window["TDAPP"] && window["TDAPP"].onEvent(eventName, "", params);
        }
        if (eventName == GxEnum_1.EventName.modeLvChoice) {
            if (GxConstant_1.default.IS_VIVO_GAME || GxConstant_1.default.IS_OPPO_GAME) {
                /*  2023年8月25日不用了 加了LLVV  let label = GxGame.gGB("vc");
                            if (label) {

                                let value = GxGame.gGN("vc", 0);
                                if (value > 0) {
                                    if (this.vcNum == -1) {
                                        this.vcNum = value;
                                        setInterval(() => {
                                            console.log("重置vcNum")
                                            this.vcNum = value;
                                        }, 90 * 1000)
                                    }
                                    if (this.vcNum > 0) {
                                        this.vcNum--;
                                        GxGame.Ad().showVideo((res) => {

                                        }, "vc")
                                    } else {
                                        console.log("vcNum <0")
                                    }
                                } else {
                                    console.log("vc <0")
                                }


                            } else {
                                console.log("vc false")
                            }
            */
            }
        }
        //qq的策略 进去第一次显示视频
        // if (GxConstant.IS_QQ_GAME && eventName == EventName.main && this.enterMainCount == 0) {
        //   let label = GxGame.gGB("z1");
        //   if (label) {
        //     if (this.Ad().ismailiang) {
        //       this.enterMainCount++;
        //       setTimeout(() => {
        //         this.Ad().showVideo((res) => {
        //         }, "qqFirstEnterGame")
        //       }, 1000)
        //     } else {
        //     }
        //   }
        // }
    }
    static gameEventLevelStart(lvName, params = null) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.lvStart, { stage: lvName, params });
        lvName = lvName ? lvName.toString() : "";
        /*       let patt = /^\w{0,1000000}$/;
               if (!patt.test(lvName)) {
                   console.warn("关卡名不符合要求：" + lvName);
               }*/
        console.log("[gx_game] gameEventLevelStart:" + lvName);
        if (GxConstant_1.default.IS_ANDROID_NATIVE ||
            GxConstant_1.default.IS_IOS_NATIVE ||
            GxConstant_1.default.IS_ANDROID_H5) {
            GxUtils_1.default.callMethod("gameEventLevelStart", lvName);
        }
        else if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_VIVO_GAME) {
            //@ts-ignore
            qg.uma && qg.uma.stage.onStart({
                stageId: String(lvName),
                stageName: `第${lvName}关`
            });
            /*   let label = GxGame.gGB("z1");
                     if (label) {
                         var gailv = GxGame.gGN("gailv")
                         if (Math.round(Math.random() * 99 + 1) < gailv) {
                             this.Ad().showNativeInterstitial();
                         }
                     }*/
        }
        else if (GxConstant_1.default.IS_HUAWEI_GAME || GxConstant_1.default.IS_MI_GAME) {
            //@ts-ignore
            qg.uma && qg.uma.stage.onStart({
                stageId: String(lvName),
                stageName: `第${lvName}关`
            });
        }
        else if (GxConstant_1.default.IS_TT_GAME) {
            //@ts-ignore
            tt.uma && tt.uma.stage.onStart({
                stageId: String(lvName),
                stageName: `第${lvName}关`
            });
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            //@ts-ignore
            wx.uma && wx.uma.stage.onStart({
                stageId: String(lvName),
                stageName: `第${lvName}关`
            });
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            //@ts-ignore
            wx.uma && wx.uma.stage.onStart({
                stageId: String(lvName),
                stageName: `第${lvName}关`
            });
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            //@ts-ignore
            qq.uma && qq.uma.stage.onStart({
                stageId: String(lvName),
                stageName: `第${lvName}关`
            });
        }
        if (window["TDAPP"]) {
            window["TDAPP"] && window["TDAPP"].onEvent("关卡开始_TD", "", { lvName: lvName });
        }
    }
    static gameEventLevelEnd(lvName, isVictory = false) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.lvEnd, { stage: lvName, isVictory });
        lvName = lvName ? lvName.toString() : "";
        /*     let patt = /^\w{0,1000000}$/;
             if (!patt.test(lvName)) {
                 console.warn("关卡名不符合要求：" + lvName);
             }*/
        console.log("[gx_game] 关卡结束:" +
            lvName +
            " isVictory:" +
            (isVictory ? "胜利" : "失败"));
        if (GxConstant_1.default.IS_ANDROID_NATIVE ||
            GxConstant_1.default.IS_IOS_NATIVE ||
            GxConstant_1.default.IS_ANDROID_H5) {
            GxUtils_1.default.callMethod("gameEventLevelEnd", lvName + "_" + isVictory);
        }
        else if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_VIVO_GAME) {
            //@ts-ignore
            qg.uma && qg.uma.stage.onEnd({
                stageId: String(lvName),
                stageName: `第${lvName}关`,
                event: isVictory ? "complete" : "fail"
            });
            /*   let label = GxGame.gGB("z1");
                     if (label) {
                         var gailv = GxGame.gGN("gailv")
                         if (Math.round(Math.random() * 99 + 1) < gailv) {
                             this.Ad().showNativeInterstitial();
                         }
                     }*/
        }
        else if (GxConstant_1.default.IS_HUAWEI_GAME || GxConstant_1.default.IS_MI_GAME) {
            //@ts-ignore
            qg.uma && qg.uma.stage.onEnd({
                stageId: String(lvName),
                stageName: `第${lvName}关`,
                event: isVictory ? "complete" : "fail"
            });
        }
        else if (GxConstant_1.default.IS_TT_GAME) {
            //@ts-ignore
            tt.uma && tt.uma.stage.onEnd({
                stageId: String(lvName),
                stageName: `第${lvName}关`,
                event: isVictory ? "complete" : "fail"
            });
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            //@ts-ignore
            wx.uma && wx.uma.stage.onEnd({
                stageId: String(lvName),
                stageName: `第${lvName}关`,
                event: isVictory ? "complete" : "fail"
            });
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            //@ts-ignore
            wx.uma && wx.uma.stage.onEnd({
                stageId: String(lvName),
                stageName: `第${lvName}关`,
                event: isVictory ? "complete" : "fail"
            });
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            //@ts-ignore
            qq.uma && qq.uma.stage.onEnd({
                stageId: String(lvName),
                stageName: `第${lvName}关`,
                event: isVictory ? "complete" : "fail"
            });
        }
        if (window["TDAPP"]) {
            if (isVictory) {
                window["TDAPP"].onEvent("关卡胜利_TD", "", { lvName: lvName });
            }
            else {
                window["TDAPP"].onEvent("关卡失败_TD", "", { lvName: lvName });
            }
        }
        // //qq的策略
        //
        if (GxConstant_1.default.IS_QQ_GAME) {
            this.Ad().showGameOverAD();
            let label = GxGame_1.default.gGB("z1");
            if (label) {
                // if (this.Ad().ismailiang) {
                //   this.Ad().showVideo((res) => {
                // }, "qqGameEnd")
                // } else {
                // }
                if (GxAdParams_1.AdParams.qq.gameEndShowCrazyPoint) {
                    GxGame_1.default.Ad().showCrazyPoint(() => {
                    }, () => {
                        if (GxAdParams_1.AdParams.qq.gameEndShowGameBox) {
                            GxGame_1.default.Ad().showGameBox(() => {
                            }, () => {
                            }, null); /*   GxGame.Ad().showGameBox(()=>{

                },()=>{

                },(num)=>{


                })*/
                        }
                        else {
                            GxLog_1.default.i("不用显示九宫格2");
                        }
                    }, (res) => {
                    }, false);
                }
                else {
                    GxLog_1.default.i("不用显示砸宝箱");
                    if (GxAdParams_1.AdParams.qq.gameEndShowGameBox) {
                        GxGame_1.default.Ad().showGameBox(() => {
                        }, () => {
                        }, null); /*   GxGame.Ad().showGameBox(()=>{

                    },()=>{

                    },(num)=>{


                    })*/
                    }
                    else {
                        GxLog_1.default.i("不用显示九宫格1");
                    }
                }
            }
        } //ov的策略
        else if (GxConstant_1.default.IS_OPPO_GAME) {
            /*修改1 2023年9月4日11:23:14*/
            let gGB = GxGame_1.default.gGB("aa");
            if (gGB) {
                this.Ad().showGameOverAD();
            }
            //0518去掉
            /* let label = GxGame.gGB("box");
                   if (label) {
                       // if (AdParams.oppo.havebox) {
                       var gailv = GxGame.gGN("gailv")
                       if (Math.round(Math.random() * 99 + 1) < gailv) {
                           this.Ad().showGameOverAD();
                       }
                       // }

                   }*/
            this.ovDesktop();
        }
        else if (GxConstant_1.default.IS_VIVO_GAME) {
            /*修改1 2023年9月4日11:23:14*/
            let gGB = GxGame_1.default.gGB("aa");
            if (gGB) {
                this.Ad().showGameOverAD();
            }
            //0518去掉
            /*  let label = GxGame.gGB("box");
                    if (label) {
                        // if (AdParams.vivo.havebox) {
                        var gailv = GxGame.gGN("gailv")
                        if (Math.round(Math.random() * 99 + 1) < gailv) {
                            this.Ad().showGameOverAD();
                        }
                        // }

                    }*/
            this.ovDesktop();
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            var lab = GxGame_1.default.gGB("qiangtan");
            if (lab) {
                var num = Math.floor(Math.random() * 100) + 1;
                if (num <= 40) {
                    this.Ad().showVideo();
                }
            }
        }
    }
    //0518新加 游戏结束页面弹出添加桌面提示   每两次添加一次  vivo需要间隔一分钟
    static ovDesktop() {
        let label = GxGame_1.default.gGB("addDesk");
        if (label) {
            let number = new Date().valueOf();
            if (number - this.ovDesktopLastTime > 60 * 1000) {
            }
            else {
                //vivo  60秒一次
                return;
            }
            this.ovDesktopCount++;
            if (this.ovDesktopCount == 2) {
                this.ovDesktopCount = 0;
                GxGame_1.default.Ad().hasAddDesktop(() => {
                    console.log("可以添加");
                    if (GxConstant_1.default.IS_VIVO_GAME) {
                        //vivo  60秒一次
                        this.ovDesktopLastTime = number;
                    }
                    GxGame_1.default.Ad().addDesktop(() => {
                    }, () => {
                    }, false);
                }, () => {
                    console.log("已经添加 不用再添加 了");
                }, () => {
                    console.log("检查是否添加失败了");
                });
            }
        }
    }
    static closebox() {
        /*  if (GxConstant.IS_OPPO_GAME || GxConstant.IS_VIVO_GAME) {
                  let label = GxGame.gGB("z1");
                  if (label) {
                      var gailv = GxGame.gGN("gailv")
                      if (Math.round(Math.random() * 99 + 1) < gailv) {
                          this.Ad().showVideo((res) => {
                          })
                      }
                  }
              }*/
    }
    /**
     * 上报OCPX（目前仅支持oppo）
     * @param type 上报类型
     */
    static uploadOcpx(type) {
        console.warn("禁用upload ocpx");
        return;
        /*     if (!GxConstant.IS_OPPO_GAME) {
                     return Log.w('当前功能仅支持 OPPO 平台')
                 }

                 Log.i(`上报类型 :${type}`)
                 let num = 0;
                 let can_report = false;
                 let desc = '';
                 if (type == 'gads') {
                     num = ++UserData.gads;
                     desc = '次数';
                 } else if (type == 'gtime') {
                     num = ++UserData.gtime;
                     desc = '时长';
                 } else if (type == 'glv') {
                     num = ++UserData.glv;
                     desc = '关卡';
                 }

                 if (num > 1 && num < 25) {
                     can_report = true;
                 } else {
                     return Log.w(`类型：${type}，${desc}：${num} 无需上报`)
                 }

                 if (!can_report) return Log.e(`上报失败，上报类型错误【${type}】`);

                 if (UserData.deviceid) {
                     if (this.canReportOcpx) {
                         Log.i(`OCPX [类型: ${type}, 数值: ${num}] 数据上传...`)
                         const url = `https://ocpx.sjzgxwl.com/oppo/upload/ocpx/${Constant.GID}?deviceid=${UserData.deviceid}&pkg=${this.gameInfo.package}&type=${type}&val=${num}`;
                         HttpManager.send(url).then(res => {
                             Log.i('OCPX 数据上传成功')
                         });
                     } else {
                         Log.w('OCPX 数据上报停用')
                     }
                 } else {
                     Log.e(`上报失败，DeviceID 为空！`);
                 }*/
    }
    static countdown(label, istime) {
        if (GxConstant_1.default.IS_QQ_GAME) {
            var qqtime = GxAdParams_1.AdParams.qq.countdowntime;
            label.string = qqtime + "秒后自动";
            var qqfunc = () => {
                if (BaseGxGame.needjump) {
                    label.string = "";
                    clearInterval(timeIndex);
                    BaseGxGame.needjump = false;
                    return;
                }
                qqtime--;
                label.string = qqtime + "秒后自动";
                if (qqtime <= 0) {
                    if (istime)
                        istime();
                    label.string = "";
                    clearInterval(timeIndex);
                }
            };
            let timeIndex = setInterval(qqfunc, 1000);
        }
    }
    static quitcount() {
        if (GxConstant_1.default.IS_QQ_GAME) {
            BaseGxGame.needjump = true;
        }
    }
    static showSubmsgBtnWithParent(parentNode) {
        if (GxConstant_1.default.IS_QQ_GAME || GxConstant_1.default.IS_WECHAT_GAME) {
            if (parentNode == null) {
                GxLog_1.default.e("showSubmsgBtnWithParent parent is null ");
                return;
            }
            let self = this;
            if (GxConstant_1.default.IS_QQ_GAME) {
                if (!GxAdParams_1.AdParams.qq.subIds || GxAdParams_1.AdParams.qq.subIds.length <= 0) {
                    GxLog_1.default.e("订阅消息按钮显示失败  没有模板id ");
                    return;
                }
            }
            if (GxConstant_1.default.IS_WECHAT_GAME) {
                if (!GxAdParams_1.AdParams.wx.subIds || GxAdParams_1.AdParams.wx.subIds.length <= 0) {
                    GxLog_1.default.e("订阅消息按钮显示失败  没有模板id ");
                    return;
                }
            }
            let showCallback = () => {
                if (GxGame_1.default.btnAddSubmsgSp) {
                    let node = new cc.Node();
                    let addComponent = node.addComponent(cc.Sprite);
                    addComponent.spriteFrame = GxGame_1.default.btnAddSubmsgSp;
                    node.parent = parentNode;
                    node.setContentSize(100, 100);
                    node.position = cc.v3(0, 0, 0);
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        if (GxConstant_1.default.IS_QQ_GAME) {
                            let waitSubIds = GxAdParams_1.AdParams.qq.subIds;
                            // @ts-ignore
                            qq.subscribeAppMsg({
                                tmplIds: waitSubIds,
                                subscribe: true,
                                success(res) {
                                    GxLog_2.default.i("调用订阅返回结果");
                                    GxLog_2.default.i(res);
                                    for (let i = 0; i < waitSubIds.length; i++) {
                                        let waitSubId = waitSubIds[i];
                                        if (res[waitSubId] == "accept") {
                                            GxGame_1.default.Ad().submsg(waitSubId, (res) => {
                                            });
                                            GxGame_1.default.Ad().createToast("订阅成功");
                                        }
                                        else {
                                            GxLog_2.default.i(waitSubId + "订阅失败：" + res[waitSubId]);
                                            GxGame_1.default.Ad().createToast("订阅失败");
                                        }
                                    }
                                    setTimeout(() => {
                                        GxGame_1.default.Ad().initSubmsg();
                                    }, 1000);
                                },
                                fail(res) {
                                    console.log("----subscribeAppMsg----fail", res);
                                    GxLog_2.default.e("订阅失败");
                                    GxLog_2.default.e(res);
                                    GxGame_1.default.Ad().createToast("订阅失败");
                                }
                            });
                        }
                        else if (GxConstant_1.default.IS_WECHAT_GAME) {
                            let waitSubIds = GxAdParams_1.AdParams.wx.subIds;
                            // @ts-ignore
                            wx.requestSubscribeMessage({
                                tmplIds: waitSubIds,
                                success(res) {
                                    GxLog_2.default.i("调用订阅返回结果");
                                    GxLog_2.default.i(res);
                                    for (let i = 0; i < waitSubIds.length; i++) {
                                        let waitSubId = waitSubIds[i];
                                        if (res[waitSubId] == "accept") {
                                            GxGame_1.default.Ad().submsg(waitSubId, (res) => {
                                            });
                                            GxGame_1.default.Ad().createToast("订阅成功");
                                        }
                                        else {
                                            GxLog_2.default.i(waitSubId + "订阅失败：" + res[waitSubId]);
                                            GxGame_1.default.Ad().createToast("订阅失败");
                                        }
                                    }
                                    setTimeout(() => {
                                        GxGame_1.default.Ad().initSubmsg();
                                    }, 1000);
                                },
                                fail(res) {
                                    console.log("----subscribeAppMsg----fail", res);
                                    GxLog_2.default.e("订阅失败");
                                    GxLog_2.default.e(res);
                                    GxGame_1.default.Ad().createToast("订阅失败");
                                }
                            });
                        }
                    });
                    GxLog_1.default.i("showSubmsgBtnWithParent 成功");
                }
                else {
                    GxLog_1.default.e("订阅消息按钮显示失败 sp null");
                }
            };
            if (GxGame_1.default.btnAddSubmsgSp) {
                showCallback();
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/btn_addsub", (err, spriteFrame) => {
                    if (err) {
                        GxLog_1.default.e("订阅消息按钮显示失败" + err);
                    }
                    GxGame_1.default.btnAddSubmsgSp = spriteFrame;
                    showCallback();
                });
            }
        }
        else {
            GxLog_1.default.e("不是微信或者qq不显示订阅消息按钮");
        }
    }
    static showCancelAccountWithParent(parentNode) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.showCancelAccountBtn, {});
        if (GxConstant_1.default.IS_HUAWEI_GAME ||
            ((GxConstant_1.default.IS_ANDROID_H5 || GxConstant_1.default.IS_ANDROID_NATIVE) &&
                GxUtils_1.default.getNativePlatform() == GxEnum_1.PLATFORM.HUAWEI)) {
            if (parentNode == null) {
                GxLog_1.default.e("showCancelAccount parent is null ");
                return;
            }
            let self = this;
            let showCallback = () => {
                if (GxGame_1.default.btnCancelAccountSp) {
                    let node = new cc.Node();
                    let addComponent = node.addComponent(cc.Sprite);
                    addComponent.spriteFrame = GxGame_1.default.btnCancelAccountSp;
                    node.parent = parentNode;
                    node.setContentSize(100, 100);
                    node.position = cc.v3(0, 0, 0);
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        if (GxConstant_1.default.IS_HUAWEI_GAME) {
                            // @ts-ignore
                            qg.showModal({
                                title: "注销账号提示",
                                content: "确定注销账号吗？注销后将无法恢复！",
                                confirmText: "确定注销",
                                success(res) {
                                    if (res.confirm) {
                                        console.log("用户点击确定");
                                        cc.sys.localStorage.clear();
                                        // @ts-ignore
                                        qg.exitApplication({
                                            success: function () {
                                                console.log("exitApplication success");
                                            },
                                            fail: function () {
                                                console.log("exitApplication fail");
                                            },
                                            complete: function () {
                                                console.log("exitApplication complete");
                                            }
                                        });
                                    }
                                    else if (res.cancel) {
                                        console.log("用户点击取消");
                                    }
                                }
                            });
                        }
                        else {
                            GxUtils_1.default.callMethod("cancelAccount", null, () => {
                                console.log("确定注销账号了");
                                cc.sys.localStorage.clear();
                            });
                        }
                    });
                    GxLog_1.default.i("showCancelAccountWithParent 成功");
                }
                else {
                    GxLog_1.default.e("注销账号按钮显示失败 sp null");
                }
            };
            if (GxGame_1.default.btnCancelAccountSp) {
                showCallback();
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/btn_zhuxiao", (err, spriteFrame) => {
                    if (err) {
                        GxLog_1.default.e("注销账号按钮显示失败" + err);
                    }
                    GxGame_1.default.btnCancelAccountSp = spriteFrame;
                    showCallback();
                });
            }
        }
        else {
            GxLog_1.default.e("不是华为apk或者rpk不显示注销账号按钮");
        }
    }
    static onClickBtn(type) {
        GxGame_1.default.Ad().onClickBtn(type);
    }
}
/**拒绝是否可以继续游戏 */
BaseGxGame.canPlayWithRefuse = false;
BaseGxGame.scale = 1;
BaseGxGame.ageSp = null;
BaseGxGame.btnPrivacySp = null;
BaseGxGame.btnUserSp = null;
BaseGxGame.btnH5HallSp = null;
BaseGxGame.btnMoreGameSp = null;
BaseGxGame.btnQQShareSp = null;
BaseGxGame.btnAddSubmsgSp = null;
BaseGxGame.btnAddDesktopSp = null;
BaseGxGame.btnCancelAccountSp = null;
BaseGxGame.screenWidth = 0;
BaseGxGame.initPlatformEnd = false;
BaseGxGame.btnTTBoxSp = null;
BaseGxGame.havettreward = false;
BaseGxGame.screenHeight = 0;
/**用户信息 */
BaseGxGame.userInfo = {
    uid: "",
    openid: "",
    avatarUrl: "",
    nickName: ""
};
//是否正在审核
BaseGxGame.isShenHe = false;
BaseGxGame.isH5Hall = false;
/**分享文字 */
BaseGxGame.shareWord = ["", ""];
/**分享图片 */
BaseGxGame.sharePath = "";
//头条更多游戏
BaseGxGame.recommedList = [];
BaseGxGame.uiGroup = "";
BaseGxGame.enterMainCount = 0; //目前只有ov在用
/*游戏的唯一标识 app id或者包名*/
BaseGxGame.appId = "";
/**
 * 广告配置
 * 【注】SDK已接
 */
BaseGxGame.adConfig = {
    //原生点击后是否自动刷新 还是关闭
    canRefresh: false,
    useNative: false,
    /*  /!**Banner广告位 *!/
          adunit_banner: [],
          /!**原生广告位 *!/
          adunit_native: [],
          /!**插屏广告位 *!/
          adunit_intestital: null,
          /!**激励视频广告位 *!/
          adunit_video: null,
          /!**原生模板banner *!/
          adunit_custom_banner: null,
          /!**原生模板插屏 *!/
          adunit_custom_inter: null,
          adunit_appid: null,
          /!**九宫格广告位 *!/
          adunit_portal: null,
          /!**互推盒子 *!/
          adunit_game_banner: null,
          /!**是否主动展示九宫格 *!/
          showGamePortal: true,*/
    /**banner刷新时间间隔，默认-1s 只有oppo是 5*/
    bannerUpdateTime: -1,
    /**原生广告刷新时间间隔，默认30s */
    customUpdateTime: 30,
    //oppo进游戏60s不展示广告
    adCdTime: 60,
    // nativeInnerInstitialClickWarp: -1,
    /**原生banner误触概率 */
    // nativeBannerClickWarp: -1,
    /**两次插屏之间的间隔时间 */
    interTick: 0,
    /*两次banner之前的间隔时间*/
    bannerTick: 0,
    /**原生插屏"X"号误点概率 */
    // closeClickRto: -1,
    /**自动跳转原生广告时间间隔 */
    // clickNativeTime: 0,
    /**使用广告池 */
    switchPool: true,
    /**    宝箱功能是否开启 0关闭 1开启 */
    // boxSwitch: 0,
    /**原生广告最大拉取数量 */
    nativeAdLimitCount: 5,
    showBanner: 0
};
BaseGxGame.vcNum = -1;
BaseGxGame.ovDesktopCount = 0;
BaseGxGame.ovDesktopLastTime = 0;
// 游戏信息，用于ocpx上报
BaseGxGame.gameInfo = {
    package: "",
    name: "",
    versionName: "",
    versionCode: ""
};
BaseGxGame.canReportOcpx = false;
//需要跳出倒计时，用于结算页面是隐藏不是销毁的游戏
BaseGxGame.needjump = false;
exports.default = BaseGxGame;
