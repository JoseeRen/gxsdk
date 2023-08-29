"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
class GxDownloadScene extends layaMaxUI_1.ui.GxDownloadSceneUI {
    constructor() {
        super();
        this.AD_TouTiaoVersion = "";
        this.AD_QQVersion = "";
        this.AD_WXVersion = "";
        this.curPb = 1;
    }
    onAwake() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        Laya.timer.frameLoop(1, this, this.onUpdatePb);
        if (GxConstant_1.default.IS_TT_GAME) {
            if (Laya.LocalStorage.getItem("versionFirst") != this.AD_TouTiaoVersion) {
                this.ttdownload();
                return;
            }
            else {
                this.StartGame();
            }
        }
        else if (GxConstant_1.default.IS_OPPO_GAME || GxConstant_1.default.IS_VIVO_GAME) {
            var self = this;
            const loadTaskA = qg.loadSubpackage({
                name: 'res',
                success: function (data) {
                    console.log("加载分包成功");
                    self.StartGame();
                },
            });
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            if (Laya.LocalStorage.getItem("versionFirst") != this.AD_QQVersion) {
                this.qqdownload();
            }
            else {
                this.qqStart();
            }
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            if (Laya.LocalStorage.getItem("versionFirst") != this.AD_WXVersion) {
                this.wxdownload();
            }
            else {
                this.wxStart();
            }
        }
        else {
            this.StartGame();
        }
    }
    onUpdatePb() {
        this.curPb += 0.8;
        if (this.curPb >= 512) {
            this.curPb = 1;
        }
        this.pbBar.width = this.curPb;
    }
    onDestroy() {
        Laya.timer.clearAll(this);
    }
    ttdownload() {
        let downloadZipUrl = "https://res.sjzgxwl.com/gameres/yinghuagaoxiaolangmanwuyu/tt/100/res.zip";
        let fileManager = null;
        let userdatapath = "";
        let downloadUtil = null;
        //@ts-ignore
        fileManager = tt.getFileSystemManager();
        //@ts-ignore
        userdatapath = tt.env.USER_DATA_PATH;
        //@ts-ignore
        downloadUtil = tt;
        //@ts-ignore
        tt.clearStorage(); //清除本地所有缓存
        let downloadTask = downloadUtil.downloadFile({
            url: downloadZipUrl,
            //url: window.REMOTE_SERVER_ROOT + "/" + gameIndex + "/res.zip",
            success: (res) => {
                if (200 == res.statusCode || 304 == res.statusCode) {
                    let filePath = res.tempFilePath; // 下载路径
                    console.log("download success tmpPath: " + filePath);
                    // self.loadTips.string = "资源解压中，请稍后~";
                    fileManager.mkdir({
                        dirPath: userdatapath + this.AD_TouTiaoVersion + "res",
                        recursive: true
                    });
                    fileManager.unzip({
                        zipFilePath: filePath,
                        targetPath: userdatapath + this.AD_TouTiaoVersion + "res",
                        success: () => {
                            console.log("unzip success");
                            Laya.LocalStorage.setItem("versionFirst", this.AD_TouTiaoVersion);
                            this.StartGame();
                        },
                        fail: (res) => {
                        }
                    });
                }
            },
        });
    }
    StartGame() {
        setTimeout(() => {
            // 跳场景
            console.log("在此处自行跳转场景");
            // UIManager.ShowUIPanel("Frist");
            Laya.Scene.open("TestScene.scene", true);
        }, 2500);
    }
    qqdownload() {
        let downloadZipUrl = "https://res.sjzgxwl.com/gameres/yinghuagaoxiaolangmanwuyu/qq/100/res.zip";
        let self = this;
        let fileManager = null;
        let userdatapath = "";
        let downloadUtil = null;
        //@ts-ignore
        fileManager = qq.getFileSystemManager();
        //@ts-ignore
        userdatapath = qq.env.USER_DATA_PATH;
        //@ts-ignore
        downloadUtil = qq;
        let downloadTask = downloadUtil.downloadFile({
            url: downloadZipUrl,
            //url: window.REMOTE_SERVER_ROOT + "/" + gameIndex + "/res.zip",
            success: (res) => {
                if (200 == res.statusCode || 304 == res.statusCode) {
                    let filePath = res.tempFilePath; // 下载路径
                    console.log("download success tmpPath: " + filePath);
                    // self.loadTips.string = "资源解压中，请稍后~";
                    fileManager.unzip({
                        zipFilePath: filePath,
                        targetPath: userdatapath + this.AD_QQVersion + "res",
                        success: () => {
                            console.log("unzip success");
                            Laya.LocalStorage.setItem("versionFirst", this.AD_QQVersion);
                            // qq.loadSubpackage({
                            //   name:'atlas',
                            //   success:function(){
                            //     console.log("加载res分包成功")
                            self.qqStart();
                            //   },
                            // })
                        },
                    });
                }
            },
        });
    }
    ;
    qqStart() {
        var self = this;
        //@ts-ignore
        qq.loadSubpackage({
            name: "res",
            success: function () {
                console.log("加载res分包成功");
                //@ts-ignore
                qq.loadSubpackage({
                    name: "yinsiPanel",
                    success: function () {
                        console.log("加载yinsiPanel分包成功");
                        self.StartGame();
                    },
                    fail: function () {
                        console.log("加载yinsiPanel分包失败");
                    }
                });
            },
            fail: function () {
                console.log("加载res分包失败");
            }
        });
    }
    ;
    wxdownload() {
        let downloadZipUrl = "https://res.sjzgxwl.com/gameres/yinghuagaoxiaolangmanwuyu/wx/100/res.zip";
        let self = this;
        let fileManager = null;
        let userdatapath = "";
        let downloadUtil = null;
        //@ts-ignore
        fileManager = wx.getFileSystemManager();
        //@ts-ignore
        userdatapath = wx.env.USER_DATA_PATH;
        downloadUtil = wx;
        let downloadTask = downloadUtil.downloadFile({
            url: downloadZipUrl,
            success: (res) => {
                if (200 == res.statusCode || 304 == res.statusCode) {
                    let filePath = res.tempFilePath; // 下载路径
                    console.log("download success tmpPath: " + filePath);
                    fileManager.mkdir({
                        dirPath: userdatapath + this.AD_WXVersion + "res",
                        recursive: true
                    });
                    //@ts-ignore
                    wx.getFileSystemManager().unzip({
                        zipFilePath: filePath,
                        targetPath: userdatapath + this.AD_WXVersion + "res",
                        success: () => {
                            console.log("unzip success");
                            Laya.LocalStorage.setItem("versionFirst", this.AD_WXVersion);
                            self.wxStart();
                        },
                        fail: (err) => {
                            console.log("解压失败？？：" + JSON.stringify(err));
                        }
                    });
                }
            },
        });
    }
    ;
    wxStart() {
        var self = this;
        //@ts-ignore
        wx.loadSubpackage({
            name: "res",
            success: function () {
                //@ts-ignore
                wx.loadSubpackage({
                    name: "yinsiPanel",
                    success: function () {
                        self.StartGame();
                    },
                    fail: function () {
                    }
                });
            },
            fail: function () {
            }
        });
    }
}
exports.default = GxDownloadScene;
