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
const cc_1 = require("cc");
const GxLog_1 = __importDefault(require("./GxLog"));
class ResUtil {
    static loadPrefab(url, callback) {
        if (cc_1.resources) {
            cc_1.resources.load(url, cc_1.Prefab, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadPrefab Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (cc_1.loader) {
            cc_1.loader.loadRes(url, cc_1.Prefab, (err, prefab) => {
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
        if (cc_1.resources) {
            cc_1.resources.load(url, cc_1.JsonAsset, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadJsonAsset Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (cc_1.loader) {
            cc_1.loader.loadRes(url, cc_1.JsonAsset, (err, prefab) => {
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
        if (cc_1.resources) {
            cc_1.resources.load(url, cc_1.SpriteFrame, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadSprite Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (cc_1.loader) {
            cc_1.loader.loadRes(url, cc_1.SpriteFrame, (err, prefab) => {
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
            if (cc_1.resources) {
                cc_1.resources.loadDir(path, type, (err, assets) => {
                    if (err) {
                        GxLog_1.default.e('加载失败', path);
                        return reject(err);
                    }
                    resolve(assets);
                });
            }
            else {
                cc_1.loader.loadResDir(path, type, (err, assets) => {
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
            if (cc_1.assetManager) {
                cc_1.assetManager.loadRemote(url, (err, texture) => {
                    const spf = new cc_1.SpriteFrame();
                    if (texture) {
                        spf.texture = texture;
                    }
                    callback(err, texture ? spf : null);
                    /*  if (err) {
                          console.log(err)
                      } else if (texture && spNode.isValid) {

                          this.imgCache[url] = texture;
                          console.log("请求后缓存 了：" + url)
                          spNode.spriteFrame = new SpriteFrame(texture)


                      }*/
                });
            }
            else {
                cc_1.loader.load(url, (err, texture) => {
                    if (err) {
                        console.log(err);
                    }
                    const spf = new cc_1.SpriteFrame();
                    if (texture) {
                        spf.texture = texture;
                    }
                    callback && callback(err, texture ? spf : null);
                });
            }
        }
        else {
            if (cc_1.assetManager) {
                cc_1.assetManager.loadRemote(url, { ext: '.png' }, (err, texture) => {
                    const spf = new cc_1.SpriteFrame();
                    if (texture) {
                        spf.texture = texture;
                    }
                    callback(err, texture ? spf : null);
                });
            }
            else {
                cc_1.loader.load({ url: url, type: 'png' }, (err, texture) => {
                    if (err) {
                        console.log(err);
                    }
                    const spf = new cc_1.SpriteFrame();
                    if (texture) {
                        spf.texture = texture;
                    }
                    callback && callback(err, texture ? spf : null);
                });
            }
        }
    }
}
exports.default = ResUtil;
