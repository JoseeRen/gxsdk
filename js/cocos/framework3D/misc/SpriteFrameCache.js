"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
class SpriteFrameCache {
    constructor() {
        this.frames = {};
    }
    static get instance() {
        if (this._instance == null) {
            this._instance = new SpriteFrameCache();
        }
        return this._instance;
    }
    getSpriteFrame(url) {
        let frame = this.frames[url];
        if (frame == null) {
            return new Promise((resolve, reject) => {
                // console.log("[SpriteFrameCache] request image:" + url)
                if (!url || url == "") {
                    reject("empty-url");
                    return;
                }
                if (url.indexOf("http") == -1) {
                    cc_1.loader.loadResDir(url, (cc_1.SpriteFrame), (error, spriteFrames) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        if (spriteFrames && spriteFrames.length > 0) {
                            let frame = spriteFrames[0];
                            this.addSpriteFrame(url, spriteFrames[0]);
                            resolve(frame);
                            // let frame = new SpriteFrame();
                            // frame.texture = image._texture;
                            // frame._imageSource = image;
                            // this.addSpriteFrame(url, frame)
                            // resolve(frame)
                        }
                        else {
                            reject("path not found: " + url);
                        }
                    });
                }
                else {
                    cc_1.loader.load({ url: url, type: 'png' }, (error, image) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        if (image) {
                            frame = new cc_1.SpriteFrame();
                            frame.texture = image._texture;
                            frame._imageSource = image;
                            this.addSpriteFrame(url, frame);
                            resolve(frame);
                        }
                        else {
                            reject("frameNull");
                        }
                    });
                }
            });
        }
        return new Promise((resolve, reject) => resolve(frame));
    }
    addSpriteFrame(url, frame) {
        this.frames[url] = frame;
        return frame;
    }
    clear() {
        for (var k in this.frames) {
            let frame = this.frames[k];
            cc_1.loader.release(frame);
            delete this.frames[k];
        }
    }
    remove(k) {
        let frame = this.frames[k];
        cc_1.loader.release(frame);
        delete this.frames[k];
    }
}
exports.default = SpriteFrameCache;
