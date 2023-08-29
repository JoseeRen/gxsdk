"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../GxGame"));
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const GxConstant_1 = __importDefault(require("../core/GxConstant"));
const OpenDataUtil_1 = __importDefault(require("../util/OpenDataUtil"));
class gx_ui_shareFriend extends layaMaxUI_1.ui.gxui.gx_ui_shareFriendUI {
    constructor() {
        super();
        // @ts-ignore
        this.textureSub = new Laya.Texture();
        this.shareCallback = null;
        this.shareSuccess = false;
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
        }
        if (!GxConstant_1.default.IS_QQ_GAME && !GxConstant_1.default.IS_WECHAT_GAME) {
            this.clickOnClose();
        }
        const shareCanvas = this.getShareCanvas();
        shareCanvas.width = this.sprite.width;
        shareCanvas.height = this.sprite.height;
        let bound = {};
        bound.width = this.sprite.width;
        bound.height = this.sprite.height;
        let phoneInfo = wx.getSystemInfoSync();
        console.log("phoneInfo:", phoneInfo);
        let winSize = { width: Laya.stage.width, height: Laya.stage.height };
        let scaleX = phoneInfo.screenWidth / winSize.width;
        let scaleY = phoneInfo.screenHeight / winSize.height;
        //微信像素  不用减去x  y  也不知道为啥
        let dX = winSize.width / 2 - this.sprite.width / 2; //- this.sprite.x;
        let xStart = dX * scaleX;
        let dY = winSize.height / 2 - this.sprite.height / 2; // - this.sprite.y;
        let yStart = dY * scaleY;
        let startPos = {
            x: xStart,
            y: yStart
        };
        OpenDataUtil_1.default._postMessage("InitContext", {
            bound: bound,
            spacingY: 5,
            scaleX: scaleX,
            scaleY: scaleY,
            startPos: startPos
        });
        OpenDataUtil_1.default.showShareFriend();
        GxGame_1.default.Ad().setOpenDataShareCallback((res) => {
            if (!this.shareSuccess) {
                this.shareSuccess = res;
            }
            else {
                console.log("已经分享成功过了");
            }
            if (res) {
                this.clickOnClose();
            }
            /*if (this && this.node.isValid) {
                this.shareCallback && this.shareCallback(res)
            }*/
        });
        Laya.timer.frameLoop(1, this, this.update);
    }
    onAwake() {
        this.zOrder = 9999;
        this.textureSub.bitmap = new Laya.Texture2D;
        this.btn_close.x = Laya.Browser.clientWidth / 2 - 70;
        this.btn_close.on(Laya.Event.MOUSE_DOWN, this, this.clickOnClose);
        this.blockInput.on(Laya.Event.CLICK, this, () => {
        });
    }
    on_show() {
    }
    setShareCallback(shareCallback) {
        this.shareCallback = shareCallback;
    }
    clickOnRefresh() {
        //点击换一个好友
        OpenDataUtil_1.default.refreshShareFriend();
    }
    clickOnClose() {
        OpenDataUtil_1.default.closeShareFriend();
        this.destroy();
    }
    onDestroy() {
        console.log("销毁 分享结果：" + this.shareSuccess);
        this.shareCallback && this.shareCallback(this.shareSuccess);
        Laya.timer.clear(this, this.update);
    }
    clickOnShare() {
        /*   GxGame.Ad().shareMessageToFriend((res) => {
               console.log("定向分享结果：" + res)
               this.shareCallback && this.shareCallback(res)
           })*/
    }
    update() {
        this.renderSub();
    }
    renderSub() {
        const shareCanvas = this.getShareCanvas();
        // this.textureSub.loadImageSource(shareCanvas.source);
        this.textureSub.sourceWidth = shareCanvas.width;
        this.textureSub.sourceHeight = shareCanvas.height;
        this.textureSub.bitmap.loadImageSource(shareCanvas);
        // if (!this.sprite.spriteFrame) {
        this.sprite.graphics.drawTexture(this.textureSub);
        /* } else {
             this.sprite.spriteFrame.setTexture(this.texture);
         }*/
    }
    getShareCanvas() {
        // @ts-ignore
        let openDataContext = wx.getOpenDataContext();
        if (openDataContext) {
            return openDataContext.canvas;
        }
    }
}
exports.default = gx_ui_shareFriend;
