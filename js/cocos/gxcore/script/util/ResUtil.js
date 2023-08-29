"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxLog_1 = __importDefault(require("./GxLog"));
class ResUtil {
    static loadPrefab(url, callback) {
        if (cc.resources) {
            cc.resources.load(url, cc.Prefab, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadPrefab Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (cc.loader) {
            cc.loader.loadRes(url, cc.Prefab, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadPrefab Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else {
            callback && callback("no loader", null);
        }
    }
    static loadJsonAsset(url, callback) {
        if (cc.resources) {
            cc.resources.load(url, cc.JsonAsset, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadJsonAsset Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (cc.loader) {
            cc.loader.loadRes(url, cc.JsonAsset, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadJsonAsset Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else {
            callback && callback("no loader", null);
        }
    }
    static loadSprite(url, callback) {
        if (cc.resources) {
            cc.resources.load(url, cc.SpriteFrame, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadSprite Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (cc.loader) {
            cc.loader.loadRes(url, cc.SpriteFrame, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadSprite Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (window["Laya"]) {
            let laya = window["Laya"];
            laya.loader.load("gameass/background.png", laya.Handler.create(this, function (prefab) {
                console.log("ok");
                if (prefab == null) {
                }
                else {
                }
                callback && callback('', prefab);
            }));
        }
        else {
            callback && callback("no loader", null);
        }
    }
    static loadResDir(path, type) {
        return new Promise((resolve, reject) => {
            if (cc.resources) {
                cc.resources.loadDir(path, type, (err, assets) => {
                    if (err) {
                        GxLog_1.default.e('加载失败', path);
                        return reject(err);
                    }
                    resolve(assets);
                });
            }
            else {
                cc.loader.loadResDir(path, type, (err, assets) => {
                    if (err) {
                        GxLog_1.default.e('加载失败', path);
                        return reject(err);
                    }
                    resolve(assets);
                });
            }
        });
    }
    static loadRemoteSpiteFrame(url, callback) {
        if (!url.startsWith("http")) {
            GxLog_1.default.w("加载图片地址不对：" + url);
            callback("加载图片地址不对", null);
            return;
        }
        let url1 = url.toLowerCase();
        if (url1.endsWith(".jpg") || url1.endsWith(".png") || url1.endsWith(".gif")) {
            if (cc.assetManager) {
                cc.assetManager.loadRemote(url, (err, texture) => {
                    callback(err, texture ? new cc.SpriteFrame(texture) : null);
                    /*  if (err) {
                          console.log(err)
                      } else if (texture && spNode.isValid) {

                          this.imgCache[url] = texture;
                          console.log("请求后缓存 了：" + url)
                          spNode.spriteFrame = new cc.SpriteFrame(texture)


                      }*/
                });
            }
            else {
                cc.loader.load(url, (err, texture) => {
                    if (err) {
                        console.log(err);
                    }
                    callback && callback(err, texture ? new cc.SpriteFrame(texture) : null);
                });
            }
        }
        else {
            if (cc.assetManager) {
                cc.assetManager.loadRemote(url, { ext: '.png' }, (err, texture) => {
                    callback(err, texture ? new cc.SpriteFrame(texture) : null);
                });
            }
            else {
                cc.loader.load({ url: url, type: 'png' }, (err, texture) => {
                    if (err) {
                        console.log(err);
                    }
                    callback && callback(err, texture ? new cc.SpriteFrame(texture) : null);
                });
            }
        }
    }
}
exports.default = ResUtil;
