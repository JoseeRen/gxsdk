"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const GxLog_1 = __importDefault(require("../util/GxLog"));
class gx_ui_submsg extends layaMaxUI_1.ui.gxui.gx_ui_submsgUI {
    constructor() {
        super();
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
        this.on(Laya.Event.CLICK, this, (e) => {
        });
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
        setTimeout(() => {
            GxGame_1.default.Ad().hideBanner();
        }, 500);
        if (Laya.stage.width <= Laya.stage.height) {
            //竖屏
            // this.bg.centerX= 0
        }
        else {
            //横屏
            this.width = Laya.stage.width;
            // console.log("如果狂点按钮不合适改这里 ")
            // this.btn.centerX = (Laya.stage.width / 2) - 439 - 30
        }
        if (!GxConstant_1.default.IS_QQ_GAME && !GxConstant_1.default.IS_WECHAT_GAME) {
            this.clickOnClose();
        }
    }
    onAwake() {
        this.zOrder = 9999;
        this.canClose = true;
        /*       this.user.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.user]);
               this.privacy.on(Laya.Event.CLICK, this, this.show_privacy_content, [privacy_type.privacy]);
               this.btnSure.on(Laya.Event.CLICK, this, this.on_agree);
               this.btnCancel.on(Laya.Event.CLICK, this, this.on_refuse);*/
        this.btn.on(Laya.Event.CLICK, this, this.clickOnSub);
        this.btn_close.on(Laya.Event.CLICK, this, this.clickOnClose);
    }
    on_show() {
    }
    clickOnClose() {
        this.destroy();
    }
    onDestroy() {
    }
    clickOnSub() {
        let self = this;
        let waitSubIds = GxGame_1.default.Ad().waitSubIds;
        if (GxConstant_1.default.IS_QQ_GAME) {
            //@ts-ignore
            qq.subscribeAppMsg({
                tmplIds: waitSubIds,
                subscribe: true,
                success(res) {
                    GxLog_1.default.i("调用订阅返回结果");
                    GxLog_1.default.i(res);
                    for (let i = 0; i < waitSubIds.length; i++) {
                        let waitSubId = waitSubIds[i];
                        if (res[waitSubId] == "accept") {
                            GxGame_1.default.Ad().submsg(waitSubId, (res) => {
                            });
                            GxGame_1.default.Ad().createToast("订阅成功");
                            if (self.canClose) {
                                self.canClose = false;
                                self.clickOnClose();
                            }
                        }
                        else {
                            GxLog_1.default.i(waitSubId + "订阅失败：" + res[waitSubId]);
                            GxGame_1.default.Ad().createToast("订阅失败");
                        }
                    }
                    setTimeout(() => {
                        GxGame_1.default.Ad().initSubmsg();
                    }, 1000);
                },
                fail(res) {
                    console.log("----subscribeAppMsg----fail", res);
                    GxLog_1.default.e("订阅失败");
                    GxLog_1.default.e(res);
                    GxGame_1.default.Ad().createToast("订阅失败");
                }
            });
        }
        else if (GxConstant_1.default.IS_WECHAT_GAME) {
            // @ts-ignore
            wx.requestSubscribeMessage({
                tmplIds: waitSubIds,
                success(res) {
                    GxLog_1.default.i("调用订阅返回结果");
                    GxLog_1.default.i(res);
                    for (let i = 0; i < waitSubIds.length; i++) {
                        let waitSubId = waitSubIds[i];
                        if (res[waitSubId] == "accept") {
                            GxGame_1.default.Ad().submsg(waitSubId, (res) => {
                            });
                            GxGame_1.default.Ad().createToast("订阅成功");
                            if (self.canClose) {
                                self.canClose = false;
                                self.clickOnClose();
                            }
                        }
                        else {
                            GxLog_1.default.i(waitSubId + "订阅失败：" + res[waitSubId]);
                            GxGame_1.default.Ad().createToast("订阅失败");
                        }
                    }
                    setTimeout(() => {
                        GxGame_1.default.Ad().initSubmsg();
                    }, 1000);
                },
                fail(res) {
                    console.log("----subscribeAppMsg----fail", res);
                    GxLog_1.default.e("订阅失败");
                    GxLog_1.default.e(res);
                    GxGame_1.default.Ad().createToast("订阅失败");
                }
            });
        }
        else {
            this.clickOnClose();
        }
    }
}
exports.default = gx_ui_submsg;
