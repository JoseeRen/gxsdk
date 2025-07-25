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
        this.AD_TouTiaoVersion = '';
        this.AD_QQVersion = '';
        this.AD_WXVersion = '';
        this.curPb = 1;
    }
    onAwake() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        Laya.timer.frameLoop(1, this, this.onUpdatePb);
        if (GxConstant_1.default.IS_TT_GAME) {
            //@ts-ignore
            let tfs = tt.getFileSystemManager();
            let resflag = false;
            try {
                tfs.accessSync("ttfile://user/resflag.txt");
                resflag = true;
            }
            catch (e) {
            }
            if (Laya.LocalStorage.getItem('versionFirst') != this.AD_TouTiaoVersion || !resflag) {
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
                    console.log('加载分包成功');
                    self.StartGame();
                },
            });
        }
        else if (GxConstant_1.default.IS_QQ_GAME) {
            //@ts-ignore
            let qfs = qq.getFileSystemManager();
            let resflag = false;
            try {
                //@ts-ignore
                qfs.accessSync(`${qq.env.USER_DATA_PATH}/resflag.txt`);
                resflag = true;
            }
            catch (e) {
            }
            if (Laya.LocalStorage.getItem('versionFirst') != this.AD_QQVersion || !resflag) {
                this.qqdownload();
            }
            else {
                this.qqStart();
            }
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            //@ts-ignore
            let wxfs = wx.getFileSystemManager();
            let resflag = false;
            try {
                //@ts-ignore
                wxfs.accessSync(`${wx.env.USER_DATA_PATH}/resflag.txt`);
                resflag = true;
            }
            catch (e) {
            }
            if (Laya.LocalStorage.getItem('versionFirst') != this.AD_WXVersion || !resflag) {
                this.wxdownload();
            }
            else {
                this.wxStart();
            }
        }
        else if (GxConstant_1.default.IS_KS_GAME) {
            this.kwaiStart();
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
        let downloadZipUrl = 'https://res.sjzgxwl.com/gameres/yinghuagaoxiaolangmanwuyu/tt/100/res.zip';
        let fileManager = null;
        let userdatapath = '';
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
                // 下载成功
                if (200 == res.statusCode || 304 == res.statusCode) {
                    let filePath = res.tempFilePath; // 下载路径
                    console.log('download success tmpPath: ' + filePath);
                    // self.loadTips.string = "资源解压中，请稍后~";
                    fileManager.mkdir({
                        dirPath: userdatapath + this.AD_TouTiaoVersion + 'res',
                        recursive: true,
                    });
                    fileManager.unzip({
                        zipFilePath: filePath, // 资源下载后路径
                        targetPath: userdatapath + this.AD_TouTiaoVersion + 'res', // 解压资源存放路径
                        success: () => {
                            // 解压成功
                            console.log('unzip success');
                            try {
                                fileManager.writeFileSync(`ttfile://user/resflag.txt`, this.AD_TouTiaoVersion + "", "utf8");
                                console.log("调用成功");
                                //const data = fileManager.readFileSync(filePath);
                                // console.log("写入的内容为:", data);
                            }
                            catch (err) {
                                console.log("调用失败", err);
                            }
                            Laya.LocalStorage.setItem('versionFirst', this.AD_TouTiaoVersion);
                            this.StartGame();
                        },
                        fail: (res) => {
                            // 解压失败
                        },
                    });
                }
            },
        });
    }
    StartGame() {
        setTimeout(() => {
            // 跳场景
            console.log('在此处自行跳转场景');
            // UIManager.ShowUIPanel("Frist");
            Laya.Scene.open('TestScene.scene', true);
        }, 2500);
    }
    qqdownload() {
        let downloadZipUrl = 'https://res.sjzgxwl.com/gameres/yinghuagaoxiaolangmanwuyu/qq/100/res.zip';
        let self = this;
        let fileManager = null;
        let userdatapath = '';
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
                // 下载成功
                if (200 == res.statusCode || 304 == res.statusCode) {
                    let filePath = res.tempFilePath; // 下载路径
                    console.log('download success tmpPath: ' + filePath);
                    // self.loadTips.string = "资源解压中，请稍后~";
                    fileManager.unzip({
                        zipFilePath: filePath, // 资源下载后路径
                        targetPath: userdatapath + this.AD_QQVersion + 'res', // 解压资源存放路径
                        success: () => {
                            // 解压成功
                            console.log('unzip success');
                            try {
                                fileManager.writeFileSync(`${userdatapath}/resflag.txt`, this.AD_QQVersion + "", "utf8");
                                console.log("调用成功");
                                //const data = fileManager.readFileSync(filePath);
                                // console.log("写入的内容为:", data);
                            }
                            catch (err) {
                                console.log("调用失败", err);
                            }
                            Laya.LocalStorage.setItem('versionFirst', this.AD_QQVersion);
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
    qqStart() {
        var self = this;
        //@ts-ignore
        qq.loadSubpackage({
            name: 'res',
            success: function () {
                console.log('加载res分包成功');
                //@ts-ignore
                qq.loadSubpackage({
                    name: 'yinsiPanel',
                    success: function () {
                        console.log('加载yinsiPanel分包成功');
                        self.StartGame();
                    },
                    fail: function () {
                        console.log('加载yinsiPanel分包失败');
                    },
                });
            },
            fail: function () {
                console.log('加载res分包失败');
            },
        });
    }
    wxdownload() {
        let downloadZipUrl = 'https://res.sjzgxwl.com/gameres/yinghuagaoxiaolangmanwuyu/wx/100/res.zip';
        let self = this;
        let fileManager = null;
        let userdatapath = '';
        let downloadUtil = null;
        //@ts-ignore
        fileManager = wx.getFileSystemManager();
        //@ts-ignore
        userdatapath = wx.env.USER_DATA_PATH;
        downloadUtil = wx;
        let downloadTask = downloadUtil.downloadFile({
            url: downloadZipUrl,
            success: (res) => {
                // 下载成功
                if (200 == res.statusCode || 304 == res.statusCode) {
                    let filePath = res.tempFilePath; // 下载路径
                    console.log('download success tmpPath: ' + filePath);
                    fileManager.mkdir({
                        dirPath: userdatapath + this.AD_WXVersion + 'res',
                        recursive: true,
                    });
                    //@ts-ignore
                    wx.getFileSystemManager().unzip({
                        zipFilePath: filePath, // 资源下载后路径
                        targetPath: userdatapath + this.AD_WXVersion + 'res', // 解压资源存放路径
                        success: () => {
                            // 解压成功
                            console.log('unzip success');
                            try {
                                fileManager.writeFileSync(`${userdatapath}/resflag.txt`, this.AD_WXVersion + "", "utf8");
                                console.log("调用成功");
                                //const data = fileManager.readFileSync(filePath);
                                // console.log("写入的内容为:", data);
                            }
                            catch (err) {
                                console.log("调用失败", err);
                            }
                            Laya.LocalStorage.setItem('versionFirst', this.AD_WXVersion);
                            self.wxStart();
                        },
                        fail: (err) => {
                            console.log('解压失败？？：' + JSON.stringify(err));
                        },
                    });
                }
            },
        });
    }
    wxStart() {
        var self = this;
        //@ts-ignore
        wx.loadSubpackage({
            name: 'res',
            success: function () {
                //@ts-ignore
                wx.loadSubpackage({
                    name: 'yinsiPanel',
                    success: function () {
                        self.StartGame();
                    },
                    fail: function () { },
                });
            },
            fail: function () { },
        });
    }
    kwaiStart() {
        var self = this;
        //@ts-ignore
        ks.loadSubpackage({
            name: 'res',
            success: function (res) {
                console.log('加载res分包成功');
                //@ts-ignore
                ks.loadSubpackage({
                    name: 'UIRes',
                    success: function (res) {
                        console.log('加载UIRes分包成功');
                        self.StartGame();
                    },
                    fail: function (err) {
                        console.log('加载UIRes分包失败' + err);
                    },
                });
            },
            fail: function (err) {
                console.log('加载res分包失败' + err);
            },
        });
    }
}
exports.default = GxDownloadScene;
