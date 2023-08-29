"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
//ov更新策略
//开始按钮激励:GxGame.startgamebtn() 必接点击开始游戏按钮调用
//            GxGame.gameEventLevelEnd()为必接 内涵全屏点击 游戏结算页
//            GxGame.gameEventLevelStart()=>每关开始游戏的概率插屏 为必接
//            GxGame.closebox(); 关闭九宫格调用
//            GxGame.showAddDesktopBtnWithParent(node)  添加桌面按钮  用法和隐私按钮一样
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdParams = void 0;
// qq的狂点  GxGame.Ad().showCrazyPoint(() => {}, () => {},(res) => {}, false) 里面的标签需要单独控制写成crazy了
// qq的倒计时  GxGame.countdown(label,成功方法); qq.countdowntime是倒计时长度   结束后执行成功方法
// 取消qq本次倒计时 GxGame.quitcount(); 某些游戏结算页 不看广告时隐藏结算页面，需要取消倒计时
//qq更新策略，在结算页调用   GxGame.gameEventLevelEnd()  必接，对应策略第一条
//qq单独用分享按钮 GxGame.showQQShareBtnWithParent(parentNode) parentNode为需要放置按钮的空节点 用法和隐私一样
exports.AdParams = {
    labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
    age: 12,
    company: "",
    softCode: "",
    ysCompanyName: "石家庄市高兴网络科技有限公司",
    ysMail: "2361198052@qq.com",
    ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
    gameName: "",
    oppo: {
        "gameName": "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        banner: "",
        native1: "",
        native2: "",
        native_banner: "",
        native_icon: "",
        video: "",
        native_custom1: "",
        native_custom2: "",
        native_custom_banner: "",
        //以下是互推的广告位  占位待用
        gameBanner: "",
        gamePortal: "",
        gameDraw: "",
        bannerOnTop: false,
        labelVersion: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
    },
    mi: {
        gameName: "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        inter: "b672387b924750e1052b55925495f80d",
        banner: "f0684d0e4b45a22aa3d14da2d5e25e9f",
        native1: "f7ce1b63755d33d1477551be3a24bd91",
        native2: "",
        native_banner: "",
        native_icon: "",
        video: "c930fe3dacd17ce9617a4aa7d687f92e",
        native_custom1: "",
        native_custom2: "",
        native_custom_banner: "",
        //以下是互推的广告位  占位待用
        gameBanner: "",
        gamePortal: "",
        gameDraw: "",
        bannerOnTop: false,
        labelVersion: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
    },
    vivo: {
        "gameName": "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        inter: "",
        banner: "",
        custom1: "",
        custom2: "",
        custom_banner: "",
        native1: "",
        native2: "",
        video: "",
        native_icon: "",
        //以下是盒子广告 占位待用
        boxBanner: "",
        boxPortal: "",
        bannerOnTop: true,
        labelVersion: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
    },
    wx: {
        "gameName": "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        appId: "wxe2ca0cc427b7e86b",
        //其他参数待定吧  有点复杂~~
        video: "adunit-",
        banner: "adunit-",
        inter: "adunit-",
        inter_custom: "adunit-",
        custom_left: "adunit-",
        custom_right: "adunit-",
        labelVersion: "",
        subIds: [] //订阅id 数组
    },
    qq: {
        "gameName": "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        appId: "1112204543",
        video: "e757e4aafb16730b8b7c290757c12645",
        box: "ebb2bb84f05dee2c51272897eefb38e6",
        inter: "0f7f1035be90a7f6c93580987da065e7",
        block: "a6bc0b050d01b740e4cd93ba95aefbcc",
        // banner: "cd788d253e5c0fa605589489348cf14a",
        banner: "47f3f7988e5d5f10ec7e1a557749c385",
        bannerOnTop: false,
        gameEndShowCrazyPoint: true,
        gameEndShowGameBox: true,
        shareImgUrl: "",
        labelVersion: "2",
        countdowntime: 5,
        //没用
        sceneidtest: false,
        subIds: [], //订阅id 数组
    },
    ks: {
        "gameName": "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        inter: "",
        banner: "",
        video: "",
        labelVersion: ""
    },
    tt: {
        "gameName": "",
        appId: "",
        ecpmConfigName: "tt7c3e0a83e3026c4a02_hcr",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        inter: "",
        banner: "",
        video: "",
        labelVersion: ""
    },
    hw: {
        "gameName": "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        appId: "108209745",
        inter: "a1en1p9sb7",
        banner: "v5j7fxt80k",
        custom_banner: "",
        video: "k2x30ircfl",
        native_icon: "",
        native_banner: "",
        native1: "e32q21trec",
        native2: "",
        bannerOnTop: false,
        buildType: "debug",
        debug_inter: "testb4znbuh3n2",
        debug_banner: "testw6vs28auh3",
        debug_custom_banner: "",
        debug_video: "testx9dtjwj8hp",
        debug_native_icon: "",
        debug_native_banner: "",
        debug_native1: "testu7m3hc4gvm",
        debug_native2: "",
        labelVersion: ""
    },
    uc: {
        "gameName": "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111",
        age: 12,
        company: "",
        softCode: "",
        ysCompanyName: "石家庄市高兴网络科技有限公司",
        ysMail: "2361198052@qq.com",
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",
        inter: "",
        banner: "",
        video: "",
        labelVersion: ""
    }
};
