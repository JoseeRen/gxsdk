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
    channel: {},
    labelName: "", //标签名
    age: 12,
    company: "", //健康忠告的公司名
    softCode: "", //软著号
    ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
    ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
    ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
    gameName: "",
    heJiConfig: "",
    oppo: {
        gameName: "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        banner: "",
        native1: "", //一般原生大图 自渲染
        native2: "", //一般原生图文 自渲染
        native_banner: "", // 自渲染
        native_icon: "", //原生icon
        video: "",
        native_custom1: "", //模板广告参数
        native_custom2: "", //模板广告参数
        native_custom_banner: "", //模板广告参数
        //以下是互推的广告位  占位待用
        gameBanner: "",
        gamePortal: "",
        gameDraw: "",
        bannerOnTop: false, //banner显示位置  true 上面  false 下面
        labelVersion: "",
        heJiConfig: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
        umAppKey: "",
        tdAppKey: "",
        gravityEngineAccessToken: "",
        packageName: ""
    },
    mi: {
        gameName: "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "b672387b924750e1052b55925495f80d",
        banner: "f0684d0e4b45a22aa3d14da2d5e25e9f",
        native1: "f7ce1b63755d33d1477551be3a24bd91", //用这个native1 原生广告参数写这
        native2: "", // 备用
        native_banner: "", // 自渲染
        native_icon: "", //原生icon
        video: "c930fe3dacd17ce9617a4aa7d687f92e",
        native_custom1: "", //模板广告参数
        native_custom2: "", //模板广告参数
        native_custom_banner: "", //模板广告参数
        //以下是互推的广告位  占位待用
        gameBanner: "",
        gamePortal: "",
        gameDraw: "",
        bannerOnTop: false, //banner显示位置  true 上面  false 下面
        labelVersion: "",
        heJiConfig: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
        umAppKey: "",
        tdAppKey: ""
    },
    vivo: {
        gameName: "",
        labelName: "csyx_csyxvivorpk0424_1_vivo_xyx_20240424", //标签名
        adLabelName: "", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "",
        banner: "",
        custom1: "", //原生模板插屏
        custom2: "", //原生模板插屏
        custom_banner: "", //原生模板banner
        native1: "", //原生 自渲染
        native2: "", ////原生 自渲染
        video: "",
        native_icon: "", //占位待用
        //以下是盒子广告 占位待用
        boxBanner: "",
        boxPortal: "",
        bannerOnTop: true, //banner显示位置  true 上面  false 下面
        labelVersion: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
        heJiConfig: "",
        tdAppKey: "",
        gravityEngineAccessToken: "",
        accountAppKey: "",
        accountAppSecret: "",
        packageName: "",
        needPrivacy: true //是否需要隐私政策
    },
    wx: {
        gameName: "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        appId: "wx7c5a6814f923cfc7",
        //其他参数待定吧  有点复杂~~
        video: "adunit-f4728ad2a406f493",
        banner: "",
        inter: "",
        inter_custom: "",
        custom_left: "",
        custom_right: "",
        custom_v: [], //竖格子
        custom_h: [], //横格子
        labelVersion: "",
        subIds: [], //订阅id 数组
        heJiConfig: "",
        shareImgUrl: "", //https://res.sjzgxwl.com/shareimage/.jpg
        tdAppKey: "",
        gravityEngineAccessToken: "", //引力的access_token
        app_key: "", //微信互跳用的 和引力没关系
        app_version: "" //微信互跳用的 和引力没关系
        /*
                gravityEngineAccessToken:"qyNWxktvh43Qi1oJqdakFLpsMvae6fhg"
        */
    },
    qq: {
        gameName: "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        appId: "1112204543",
        video: "e757e4aafb16730b8b7c290757c12645",
        box: "ebb2bb84f05dee2c51272897eefb38e6",
        inter: "0f7f1035be90a7f6c93580987da065e7",
        block: "a6bc0b050d01b740e4cd93ba95aefbcc",
        block2: "a6bc0b050d01b740e4cd93ba95aefbcc",
        // banner: "cd788d253e5c0fa605589489348cf14a",
        banner: "47f3f7988e5d5f10ec7e1a557749c385",
        bannerOnTop: false,
        gameEndShowCrazyPoint: true, //游戏结束时是否显示砸宝箱
        gameEndShowGameBox: true, //游戏结束时是否显示九宫格
        shareImgUrl: "",
        labelVersion: "2",
        countdowntime: 5, //倒计时的时间  不用倒计时不用管
        //没用
        sceneidtest: false, //测试哪种策略 true：买量 false：常量（仅测试用不影响上线）    GxGame.Ad().ismailiang可以确定是不是买量用户 true:是 false:不是
        subIds: [], //订阅id 数组
        heJiConfig: "",
        tdAppKey: ""
    },
    ks: {
        gameName: "",
        appId: "ks684265670100075193",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "2300005890_02",
        banner: "",
        video: "2300018042_01",
        labelVersion: "",
        heJiConfig: "",
        tdAppKey: "",
        gravityEngineAccessToken: ""
    },
    tt: {
        gameName: "",
        appId: "ttd6d5a06849e2289502",
        ecpmConfigName: "",
        labelName: "", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "eh4e9q79cr7f9t4ppx",
        banner: "1tmimtidccod28k8hd",
        video: "3962abfj2d96deq4if",
        labelVersion: "",
        umAppKey: "",
        shareTemplateId: "",
        heJiConfig: "",
        tdAppKey: "",
        gravityEngineAccessToken: "", //引力的access_token
        subIds: [], //一次性订阅
        //版本更新  体力恢复
        subIdsLong: [] //长期订阅
    },
    hw: {
        gameName: "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        appId: "108209745",
        inter: "a1en1p9sb7",
        banner: "v5j7fxt80k",
        custom_banner: "",
        video: "k2x30ircfl",
        native_icon: "",
        native_banner: "",
        native1: "e32q21trec",
        native2: "",
        bannerOnTop: false, //banner显示位置  true 上面  false 下面
        buildType: "debug",
        debug_inter: "testb4znbuh3n2",
        debug_banner: "testw6vs28auh3",
        debug_custom_banner: "",
        debug_video: "testx9dtjwj8hp",
        debug_native_icon: "",
        debug_native_banner: "",
        debug_native1: "testu7m3hc4gvm",
        debug_native2: "",
        labelVersion: "",
        umAppKey: "",
        heJiConfig: "",
        tdAppKey: "",
        privacy_url: ""
    },
    uc: {
        gameName: "",
        labelName: "srxsmg_srxsmgqq_100_qq_xyx_20221111", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "",
        banner: "",
        video: "",
        labelVersion: "",
        tdAppKey: ""
    },
    zfb: {
        gameName: "",
        labelName: "", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "ad_tiny_2021004124680383_202311102200070139",
        banner: "ad_tiny_2021004124680383_202311102200070028",
        video: "ad_tiny_2021004124680383_202311102200070140",
        labelVersion: "",
        tdAppKey: ""
    },
    bilibili: {
        gameName: "",
        appId: "biligame87d45e31eed3fd24",
        labelName: "", //标签名
        age: 12,
        shareTemplateId: "",
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "",
        banner: "",
        video: "bili-211729751454346283",
        labelVersion: "",
        tdAppKey: "",
        gravityEngineAccessToken: ""
    },
    rongyao: {
        gameName: "",
        labelName: "csyx_csyxvivorpk0424_1_vivo_xyx_20240424", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "",
        banner: "",
        video: ""
    }
};
