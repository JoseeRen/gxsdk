"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const { ccclass, property } = cc._decorator;
let Gx_crazypoint = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cc.Component;
    let _progressNode_decorators;
    let _progressNode_initializers = [];
    let _progressNode_extraInitializers = [];
    let _img_xiangPiCa_decorators;
    let _img_xiangPiCa_initializers = [];
    let _img_xiangPiCa_extraInitializers = [];
    let _btnNode_decorators;
    let _btnNode_initializers = [];
    let _btnNode_extraInitializers = [];
    let _boxNode_decorators;
    let _boxNode_initializers = [];
    let _boxNode_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    var Gx_crazypoint = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.progressNode = __runInitializers(this, _progressNode_initializers, null);
            this.img_xiangPiCa = (__runInitializers(this, _progressNode_extraInitializers), __runInitializers(this, _img_xiangPiCa_initializers, null));
            this.btnNode = (__runInitializers(this, _img_xiangPiCa_extraInitializers), __runInitializers(this, _btnNode_initializers, null));
            this.boxNode = (__runInitializers(this, _btnNode_extraInitializers), __runInitializers(this, _boxNode_initializers, null));
            this.title = (__runInitializers(this, _boxNode_extraInitializers), __runInitializers(this, _title_initializers, null));
            this.onShow = __runInitializers(this, _title_extraInitializers);
            this.time = 0;
            this.num = 0;
            this.boo = false;
            this.videoShowed = false;
            this.isBanner = false;
            this.listening = false;
            this.showVideoTime = 0;
            // update (dt) {}
        }
        onLoad() {
            let winSize = cc.winSize;
            if (winSize.width > winSize.height) {
                this.btnNode.setPosition(cc.v2(293, -210));
                this.boxNode.setPosition(cc.v2(-288, -122));
                this.title.setPosition(cc.v2(0, 219));
            }
            this.btnNode.opacity = 255;
            this.boxNode.opacity = 255;
            this.boo = false;
            this.time = 0;
            this.num = 0;
        }
        start() {
            GxGame_1.default.Ad().hideBanner();
            var self = this;
            /*      this.schedule(() => {
                      if (!this.boo) {
                          this.time -= 1;
                          if (this.time < 80) {
                          }
                          if (this.time <= 0) {
                              this.time = 0;
                          }
                      }
                  }, 0.1);*/
        }
        show(on_show, on_close, on_get, is_banner = false) {
            this.onShow = on_show;
            this.onClose = on_close;
            this.onGet = on_get;
            this.isBanner = is_banner;
            this.onShow && this.onShow();
            GxGame_1.default.Ad().hideBanner();
        }
        gameHide() {
            cc.log("游戏进入后台");
        }
        gameShow() {
            cc.log("重新返回游戏");
            cc.director.emit("dest");
        }
        onDest() {
            if (this && this.isValid && this.node && this.node.isValid) {
                this.node.destroy();
            }
        }
        onDestroy() {
            cc.director.off("dest", this.onDest, this);
            cc.game.off(cc.game.EVENT_HIDE, this.gameHide, this);
            cc.game.off(cc.game.EVENT_SHOW, this.gameShow, this);
            this.onClose && this.onClose();
            GxGame_1.default.Ad().hideBanner();
        }
        update(dt) {
            if (!this.boo) {
                this.time -= 0.3;
                if (this.time < 80) {
                }
                if (this.time <= 0) {
                    this.time = 0;
                }
            }
            this.progressNode.progress = this.time / 100;
            // this.img_xiangPiCa.scale = 0.6 + this.time / 100 * 0.6;
            // console.log("这玩意值是多少怎么不触发"+this.time)
        }
        get_time() {
            if (window["cc"]) {
                return window["cc"].sys.now();
            }
            else if (window["Laya"]) {
                return window["Laya"].timer.currTimer;
            }
            else {
                return new Date().getTime();
            }
        }
        touchHandler(e, t) {
            if (this.boo)
                return;
            if (this.time <= 0) {
                this.time += 50;
            }
            else {
                this.time += Math.floor(Math.random() * 2) + 8;
                if (this.time >= 100) {
                    this.time = 100;
                }
            }
            if (this.get_time() - this.showVideoTime < 500) {
                this.num++;
                if (this.num == 4 && !this.videoShowed) {
                    this.num = 0;
                    this.videoShowed = true;
                    if (!this.listening) {
                        this.listening = true;
                        cc.director.on("dest", this.onDest, this);
                        cc.game.on(cc.game.EVENT_HIDE, this.gameHide, this);
                        cc.game.on(cc.game.EVENT_SHOW, this.gameShow, this);
                    }
                    if (this.isBanner) {
                        GxGame_1.default.Ad().showBanner(() => {
                            console.log("wudian banner显示成功");
                        }, () => {
                            console.log("wudian banner显示失败");
                        });
                        setTimeout(() => {
                            GxGame_1.default.Ad().hideBanner();
                            this.videoShowed = false;
                        }, 3 * 1000);
                    }
                    else {
                        console.log("调用 视频了");
                        GxGame_1.default.Ad().showVideo((res) => {
                            this.onGet && this.onGet(res);
                            if (this && this.isValid && this.node && this.node.isValid) {
                                this.node.destroy();
                            }
                        }, "GxCrazyPoint");
                    }
                }
            }
            else {
                this.num = 1;
            }
            console.log(this.num, this.get_time() - this.showVideoTime);
            this.showVideoTime = this.get_time();
            // if (this.time >= 100) {
            //     console.log("time100百下");
            //     this.boo = true;
            //     this.time = 100;
            //     console.log("关闭狂点");
            //     this.node.destroy();
            // } else if (this.time >= 70 && !this.videoShowed) {
            //     this.videoShowed = true;
            //     if (!this.listening) {
            //         this.listening = true;
            //         cc.director.on("dest", this.onDest, this);
            //         cc.game.on(cc.game.EVENT_HIDE, this.gameHide, this);
            //         cc.game.on(cc.game.EVENT_SHOW, this.gameShow, this);
            //     }
            //     if (this.isBanner) {
            //         GxGame.Ad().showBanner(() => {
            //             console.log("wudian banner显示成功");
            //         }, () => {
            //             console.log("wudian banner显示失败");
            //         });
            //         setTimeout(() => {
            //             GxGame.Ad().hideBanner();
            //             this.videoShowed = false;
            //         }, 3 * 1000);
            //     } else {
            //         console.log("调用 视频了");
            //         GxGame.Ad().showVideo((res) => {
            //             this.onGet && this.onGet(res);
            //             this.node.destroy();
            //         }, "GxCrazyPoint");
            //     }
            // }
        }
    };
    __setFunctionName(_classThis, "Gx_crazypoint");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _progressNode_decorators = [property(cc.ProgressBar)];
        _img_xiangPiCa_decorators = [property(cc.Node)];
        _btnNode_decorators = [property(cc.Node)];
        _boxNode_decorators = [property(cc.Node)];
        _title_decorators = [property(cc.Node)];
        __esDecorate(null, null, _progressNode_decorators, { kind: "field", name: "progressNode", static: false, private: false, access: { has: obj => "progressNode" in obj, get: obj => obj.progressNode, set: (obj, value) => { obj.progressNode = value; } }, metadata: _metadata }, _progressNode_initializers, _progressNode_extraInitializers);
        __esDecorate(null, null, _img_xiangPiCa_decorators, { kind: "field", name: "img_xiangPiCa", static: false, private: false, access: { has: obj => "img_xiangPiCa" in obj, get: obj => obj.img_xiangPiCa, set: (obj, value) => { obj.img_xiangPiCa = value; } }, metadata: _metadata }, _img_xiangPiCa_initializers, _img_xiangPiCa_extraInitializers);
        __esDecorate(null, null, _btnNode_decorators, { kind: "field", name: "btnNode", static: false, private: false, access: { has: obj => "btnNode" in obj, get: obj => obj.btnNode, set: (obj, value) => { obj.btnNode = value; } }, metadata: _metadata }, _btnNode_initializers, _btnNode_extraInitializers);
        __esDecorate(null, null, _boxNode_decorators, { kind: "field", name: "boxNode", static: false, private: false, access: { has: obj => "boxNode" in obj, get: obj => obj.boxNode, set: (obj, value) => { obj.boxNode = value; } }, metadata: _metadata }, _boxNode_initializers, _boxNode_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Gx_crazypoint = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Gx_crazypoint = _classThis;
})();
exports.default = Gx_crazypoint;
