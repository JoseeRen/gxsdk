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
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
class GxImgMgr {
    constructor() {
        this.tryCount = 0;
        this.maxTryCount = 5;
        this.loadSuccess = false;
        this.tryTimer = -1;
        this.gameListName = "";
        this.gameConfig = {};
        this.cachePool = {};
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new GxImgMgr();
        }
        return this.instance;
    }
    init(gameListName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (gameListName == undefined || gameListName == "undefined" || !gameListName || gameListName == "合集配置写这里hejipeizhi") {
                console.log("不用初始化");
                return;
            }
            if (gameListName && gameListName.length > 0) {
                let self = this;
                this.gameListName = gameListName;
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            var response = xhr.responseText;
                            console.log(response);
                            self.gameConfig = JSON.parse(response);
                            self.loadSuccess = true;
                            //提前加载下
                            self.getImgByName("bgUrl", () => {
                            });
                            self.getImgByName("lvUrl", () => {
                            });
                        }
                        else {
                            console.error("获取游戏列表失败：" + gameListName + "::status:" + xhr.status);
                            self.tryInit();
                        }
                    }
                };
                xhr.onerror = function (err) {
                    console.log(err);
                    console.error("获取游戏列表error");
                    self.tryInit();
                };
                xhr.ontimeout = function () {
                    console.error("获取游戏列表超时");
                    self.tryInit();
                };
                xhr.timeout = 5 * 1000;
                xhr.open("GET", "https://res.sjzgxwl.com/heji2config/config/" + gameListName + ".json?t=" + Math.floor(new Date().valueOf() / 10000), true);
                xhr.send();
            }
            else {
                console.error("游戏列表名字空");
                console.error("游戏列表名字空");
                console.error("游戏列表名字空");
                console.error("游戏列表名字空");
                return;
            }
            yield this.waitinit();
        });
    }
    waitinit() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(1);
            }, 1000);
        });
    }
    tryInit() {
        if (this.tryCount >= this.maxTryCount) {
            console.log("已经重试最多次数 取消重试");
            return;
        }
        this.tryCount++;
        if (this.loadSuccess) {
            console.log("初始化成功 不用重试了");
            return;
        }
        if (this.tryTimer >= 0) {
            clearTimeout(this.tryTimer);
            this.tryTimer = -1;
        }
        this.tryTimer = setTimeout(() => {
            this.init(this.gameListName);
        }, 1000);
    }
    loadSp(url, callback) {
        if (!url || !url.startsWith("http")) {
            console.warn("地址不是http开头的或者空：" + url);
            return callback && callback(null);
        }
        let replace = url.replace(/\//g, "").replace(/:/g, "").replace(/\./g, "");
        // console.log(replace)
        if (this.cachePool.hasOwnProperty(replace)) {
            console.log("命中缓存的");
            callback && callback(this.cachePool[replace]);
            return;
        }
        cc_1.assetManager.loadRemote(url, cc_1.Texture2D, (err, assets) => {
            if (err) {
                console.warn(err);
                callback && callback(null);
            }
            else {
                if (assets) {
                    let sp = new cc_1.SpriteFrame();
                    sp.texture = assets;
                    this.cachePool[replace] = sp;
                    callback && callback(sp);
                }
                else {
                    callback && callback(null);
                }
            }
        });
    }
    getImgByName(name, callback) {
        if (this.loadSuccess) {
            //@ts-ignore
            let b = this.gameConfig.config.hasOwnProperty(name);
            if (b) {
                let replace = name.replace("Url", "");
                let s = replace.charAt(0).toUpperCase() + replace.slice(1);
                console.log(s);
                //@ts-ignore
                if (this.gameConfig.config["use" + s] != 1) {
                    console.warn("图片" + name + "没开");
                    callback && callback(null);
                    return;
                }
                //@ts-ignore
                let configElement = this.gameConfig.config[name];
                if (!!configElement) {
                    this.loadSp(configElement, callback);
                }
                else {
                    console.log(" 图片名未配置：" + name);
                    callback && callback(null);
                }
            }
            else {
                console.log("不存在图片名：" + name);
                callback && callback(null);
            }
        }
        else {
            console.warn("初始化没成功");
            callback && callback(null);
        }
    }
    getGameList() {
        if (!this.loadSuccess) {
            return [];
        }
        //@ts-ignore
        return this.gameConfig.config.list;
    }
}
GxImgMgr.instance = null;
exports.default = GxImgMgr;
