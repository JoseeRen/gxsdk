"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("./../ui/layaMaxUI");
const GxGame_1 = __importDefault(require("../gxcore/script/GxGame"));
/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
class TestSceneGameUI extends layaMaxUI_1.ui.TestSceneUI {
    constructor() {
        super();
        TestSceneGameUI.instance = this;
        //关闭多点触控，否则就无敌了
        Laya.MouseManager.multiTouchEnabled = false;
        GxGame_1.default.showPrivacyBtnWithParent(this.privacy);
        GxGame_1.default.showGameAgeWithParent(this.gameage);
        GxGame_1.default.showUserPrivacyBtnWithParent(this.user);
        GxGame_1.default.showMoreGameBtnWithParent(this.moregame);
        GxGame_1.default.showSubmsgBtnWithParent(this.sub);
        GxGame_1.default.showQQShareBtnWithParent(this.share);
        GxGame_1.default.showTTBoxBtnWithParent(this.ttBoxBtn, () => {
            console.log("发奖励了");
        }, 1000);
        this.btnkuangdian.on(Laya.Event.CLICK, this, () => {
            GxGame_1.default.Ad().showCrazyPoint(() => {
                //显示成功回调
                console.log("狂点显示成功");
            }, () => {
                console.log("关闭了");
                //关闭回调
            }, (res) => {
                //点击视频成功并且看完视频回调
                console.log("获取到：" + res);
            }, false);
        });
        this.videoBtn.on(Laya.Event.CLICK, this, () => {
            GxGame_1.default.Ad().showVideo((res) => {
                //显示成功回调
                console.log("激励视频：" + res);
            }, "test");
            let label1 = GxGame_1.default.gGB("switch2");
            console.log("labelll switch2:" + label1);
            let switchlabel = GxGame_1.default.gGB("z1");
            console.log("labelll switchlabel:" + switchlabel);
            let value = GxGame_1.default.gGN("z1", 10);
            console.log("labelll switch value:" + value);
        });
        this.gameoverad.on(Laya.Event.CLICK, this, () => {
            GxGame_1.default.Ad().showGameOverAD();
        });
        this.submsg.on(Laya.Event.CLICK, this, () => {
            GxGame_1.default.showSubMsg();
        });
        this.sharefriend.on(Laya.Event.CLICK, this, () => {
            GxGame_1.default.showShareFriend((res) => {
                console.log("这是分享的结果 ：" + res);
            });
        });
        this.chapingBtn.on(Laya.Event.CLICK, this, () => {
            GxGame_1.default.Ad().showNativeInterstitial();
        });
        // GxGameUtil.getInstance().initLabel("yhgxlmwy_yhgxlmwyvivo_1_vivo_xyx_20230314")
        // setTimeout(() => {
        //     let label = GxGameUtil.getInstance().gGB("switch2");
        //     console.log(label)
        //     let switch11 = GxGameUtil.getInstance().gGB("z1");
        //     console.log(switch11)
        // }, 4000)
        /*   GxGame.Ad().showVideo((res) => {
               console.log("视频结果：" + res)
           }, "test")*/
        GxGame_1.default.Ad().showBanner(() => { }, () => { });
    }
    onEnable() {
    }
    onTipClick(e) {
    }
    /**增加分数 */
    addScore(value = 1) {
    }
    /**停止游戏 */
    stopGame() {
    }
}
exports.default = TestSceneGameUI;
