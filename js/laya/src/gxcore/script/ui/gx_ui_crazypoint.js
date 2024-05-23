"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
class gx_ui_crazypoint extends layaMaxUI_1.ui.gxui.gx_ui_crazypointUI {
    constructor() {
        super();
        this.boo = false;
        this.onHide = false;
        this.time11 = 0;
        this.videoShowed = false;
        this.onGet = null;
        this.onClose = null;
        this.num = 0;
        this.showVideoTime = 0;
    }
    // show(on_agree?: () => void, on_refuse?: () => void) {
    /*
    * @param on_show 展示回调
    * @param on_close 关闭时
    * @param on_get 点击获取按钮并且看完视频时
    * @param is_banner 误触使用视频还是banner  true banner  默认视频
    */
    show(on_show, on_close, on_get, is_banner = false) {
        if (this.parent)
            return;
        Laya.stage.addChild(this);
        on_show && on_show();
        this.onGet = on_get;
        console.log("dddd执行了 ");
        /* this.onAgree = on_agree;
         this.onRefuse = on_refuse;

         if (this.is_agree || !GxGame.isShowAuthorize && !GxGame.isShenHe && !GxGame.isShieldArea) {
             this.onAgree && this.onAgree();

             this.destroy();
         } else {
             Laya.stage.addChild(this);
             this.on_show();
         }*/
        Laya.timer.frameLoop(0.001, this, this.onUpdate);
        setTimeout(() => {
            GxGame_1.default.Ad().hideBanner();
        }, 500);
        // AD_QQ.preLoadBanner();
        /*      Laya.timer.loop(800, this, () => {
                  if (!this.boo) {
                      this.time11 -= 10;
                      if (this.time11 < 80) {
                      }
                      if (this.time11 <= 0) {
                          this.time11 = 0;
                      }
                  }
              });*/
        this.onHide = false;
        this.videoShowed = false;
        if (Laya.stage.width <= Laya.stage.height) {
            //竖屏
            // this.bg.centerX= 0
        }
        else {
            //横屏
            this.width = Laya.stage.width;
            console.log("如果狂点按钮不合适改这里 ");
            this.btn.centerX = (Laya.stage.width / 2) - 439 - 30;
        }
        this.barUpdate();
    }
    onDestroy() {
        if (this.onClose) {
            this.onClose();
        }
        Laya.timer.clearAll(this);
    }
    onAwake() {
        this.zOrder = 9999;
        /*       this.user.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.user]);
               this.privacy.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.privacy]);
               this.btnSure.on(Laya.Event.CLICK, this, this.on_agree);
               this.btnCancel.on(Laya.Event.CLICK, this, this.on_refuse);*/
        this.boo = false;
        this.time11 = 0;
        console.log("初始多长：" + this.progress.width);
        this.btn.on(Laya.Event.MOUSE_DOWN, this, this.touchHanler);
    }
    onUpdate(dt) {
        // if (!this.boo) {
        //     if (this.time11 < 10) {
        //         return
        //     }
        //     this.time11 -= 1;
        //     if (this.time11 <= 0) {
        //         this.time11 = 0;
        //     }
        // }
        // console.log(" this.time11 onUpdate", this.time11)
        var self = this;
        // this.progress.width = (this.time11 / 100) * 537 + 0.0001;
        // console.log("多长：" + (this.time11 / 100) * 537, "progress:" + this.progress.width)
        // @ts-ignore
        // this.img_xiangPiCa.scale = 0.6 + this.time11 / 100 * 0.6;
        if (!self.onHide) {
            if (GxConstant_1.default.IS_QQ_GAME) {
                // @ts-ignore
                qq.onHide(() => {
                    self.onHide = true;
                    console.log("游戏点击广告切换后台");
                    // AD_QQ.hidebanner2();
                    self.destroy();
                    // @ts-ignore
                    qq.offHide();
                });
            }
        }
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
    barUpdate() {
        Laya.timer.loop(100, this, () => {
            this.time11 -= 1;
            if (this.time11 <= 0) {
                this.time11 = 0;
            }
            this.progress.width = (this.time11 / 100) * 537 + 0.0001;
        });
    }
    touchHanler(e, t) {
        console.log("crazypoint boo ", this.boo);
        if (this.boo)
            return;
        if (this.time11 <= 0) {
            this.time11 += 50;
        }
        else {
            this.time11 += Math.floor(Math.random() * 2) + 8;
            if (this.time11 >= 100) {
                this.time11 = 100;
            }
        }
        console.log("this.time11", this.time11);
        if (this.get_time() - this.showVideoTime < 5000) {
            this.num++;
            if (this.num == 4 && !this.videoShowed) {
                this.num = 0;
                this.videoShowed = true;
                GxGame_1.default.Ad().showVideo((res) => {
                    if (this.onGet) {
                        this.onGet(res);
                    }
                    this.destroy();
                    window["ovad"]._boxShowing = false;
                }, "GxCrazyPoint");
            }
        }
        else {
            this.num = 1;
        }
        this.showVideoTime = this.get_time();
        // if (this.time11 >= 100) {
        //     console.log("time一百下");
        //     this.boo = true;
        //     this.time11 = 100;
        //     console.log("关闭狂点");
        //     this.destroy();
        // } else if (this.time11 >= 70 && !this.videoShowed) {
        //     this.videoShowed = true;
        //     GxGame.Ad().showVideo((res) => {
        //         if (this.onGet) {
        //             this.onGet(res);
        //         }
        //         this.destroy();
        //     }, "GxCrazyPoint");
        //     // this.showbanner();
        // }
    }
    on_show() {
    }
}
exports.default = gx_ui_crazypoint;
