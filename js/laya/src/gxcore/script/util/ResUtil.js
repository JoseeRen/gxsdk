"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResUtil {
    static loadSprite(url, callback) {
        if (window["cc"] && window["cc"].resources) {
            window["cc"].resources.load(url, window["cc"].SpriteFrame, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadSprite Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (window["cc"] && window["cc"].loader) {
            window["cc"].loader.loadRes(url, window["cc"].SpriteFrame, (err, prefab) => {
                if (err) {
                    console.error("[gx_game] " + url + " loadSprite Failed" + err);
                }
                callback && callback(err, prefab);
            });
        }
        else if (window["Laya"]) {
            let laya = window["Laya"];
            laya.loader.load(url, laya.Handler.create(this, function (prefab) {
                console.log("ok");
                if (prefab == null || prefab == undefined || !prefab) {
                    callback && callback("load failed", null);
                }
                else {
                    callback && callback(null, prefab);
                }
            }));
        }
        else {
            callback && callback("no loader", null);
        }
    }
    static loadJsonAsset(url, callback) {
        /*       if (cc.resources) {
                   cc.resources.load(url, cc.JsonAsset, (err, prefab) => {
                       if (err) {
                           console.error("[gx_game] " + url + " loadJsonAsset Failed" + err)
                       }
                       callback && callback(err, prefab)
       
                   })
               } else if (cc.loader) {
                   cc.loader.loadRes(url, cc.JsonAsset, (err, prefab) => {
                       if (err) {
                           console.error("[gx_game] " + url + " loadJsonAsset Failed" + err)
                       }
                       callback && callback(err, prefab)
       
                   })
               } else {
                   callback && callback("no loader", null)
               }*/
    }
    static loadResDir(path, type) {
        return new Promise((resolve, reject) => {
            return resolve("");
            /*   if (cc.resources) {
                   cc.resources.loadDir(path, type, (err, assets: any[]) => {
                       if (err) {
                           Log.e('加载失败', path)
                           return reject(err);
                       }
                       resolve(assets);
                   })
               } else {
                   cc.loader.loadResDir(path, type, (err, assets: any[]) => {
                       if (err) {
                           Log.e('加载失败', path)
                           return reject(err);
                       }
                       resolve(assets);
                   });
               }*/
        });
    }
    static loadPrefab(url, callback) {
        /*
                if (cc.resources) {
                    cc.resources.load(url, cc.Prefab, (err, prefab) => {
                        if (err) {
                            console.error("[gx_game] " + url + " loadPrefab Failed" + err)
                        }
                        callback && callback(err, prefab)
        
                    })
                } else if (cc.loader) {
                    cc.loader.loadRes(url, cc.Prefab, (err, prefab) => {
                        if (err) {
                            console.error("[gx_game] " + url + " loadPrefab Failed" + err)
                        }
                        callback && callback(err, prefab)
        
                    })
                } else {
                    callback && callback("no loader", null)
                }
        */
    }
}
exports.default = ResUtil;
