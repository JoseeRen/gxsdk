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
    labelName: "hbqygwl_kjqlz2025_1_opporpk", //标签名
    age: 12,
    company: "石家庄多量来信息科技有限公司", //健康忠告的公司名
    softCode: "2025SR0564142", //软著号
    ysCompanyName: "河北奇异果网络科技有限公司", //隐私政策中公司名
    ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
    ysAddress: "河北省石家庄市高新区祁连街95号润江慧谷大厦A座1105室", //隐私政策中公司地址
    gameName: "",
    heJiConfig: "",
    channel: {},
    oppo: {
        "gameName": "抗击侵略者",
        labelName: "hbqygwl_kjqlz2025_1_opporpk", //标签名
        age: 12,
        company: "石家庄多量来信息科技有限公司", //健康忠告的公司名
        softCode: "2025SR0564142", //软著号
        ysCompanyName: "河北奇异果网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区祁连街95号润江慧谷大厦A座1105室", //隐私政策中公司地址
        banner: "2353170",
        video: "2353185_2353184_2353173",
        native_custom1: "2353188", //模板广告参数
        native_custom2: "2353189", //模板广告参数
        umAppKey: "",
        native_custom_banner: "", //模板广告参数
        native1: "", //一般原生大图 自渲染
        native2: "", //一般原生图文 自渲染
        native_banner: "", // 自渲染
        native_icon: "", //原生icon
        //以下是互推的广告位  占位待用
        gameBanner: "",
        gamePortal: "",
        gameDraw: "",
        bannerOnTop: false, //banner显示位置  true 上面  false 下面
        labelVersion: "",
        heJiConfig: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
        tdAppKey: "",
        gravityEngineAccessToken: "",
        packageName: "com.hbqygwl.kjqlz2025.nearme.gamecenter"
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
        "gameName": "疯狂克隆球",
        labelName: "sjzbywl_fkklq2025_1_vivorpk", //标签名
        adLabelName: "", //标签名
        age: 12,
        company: "北京亮颖信息科技有限公司", //健康忠告的公司名
        softCode: "2021SRE033930", //软著号
        ysCompanyName: "石家庄北野网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市裕华区翟营南大街50号和平大厦A座2403", //隐私政策中公司地址
        inter: "",
        banner: "14eb40fc7100480f82376920c7b744b2",
        custom1: "b997f6b347d147d8a887d10772595672", //原生模板插屏
        custom2: "ac637ae6148643e5a52e20a42a388485", //原生模板插屏
        custom_banner: "", //原生模板banner
        native1: "", //原生 自渲染
        native2: "", ////原生 自渲染
        video: "8435601e5ced418cb645636b2524ac5c_0b355d027e12482093cba39faf1eaadb_b3f09c2ac3494444813f464b7da44824",
        native_icon: "", //占位待用
        //以下是盒子广告 占位待用
        boxBanner: "",
        boxPortal: "",
        bannerOnTop: false, //banner显示位置  true 上面  false 下面
        labelVersion: "",
        havebox: false, //结算页是否弹全屏点击广告 true 弹
        heJiConfig: "",
        tdAppKey: "",
        umAppKey: "",
        gravityEngineAccessToken: "",
        accountAppKey: "2e3a76ccbbaceae7d31ccd60c803b773",
        accountAppSecret: "88d81938ed2f23a0335402ce09ff45fa",
        packageName: "com.sjzbywl.fkklq2025.vivominigame"
    },
    wx: {
        "gameName": "战斗吧卡皮巴拉",
        labelName: "zdbkpbl_zdbkpbl_1_wx_xyx_20250409", //标签名
        appId: "wxf58b5456542e341a",
        video: "adunit-3bf0faf32fa2361c",
        banner: "adunit-53fbbc38c500ed2a",
        inter: "adunit-1da332900d370c33",
        inter_custom: "adunit-469cc3d4dd0aa92e",
        custom_left: "adunit-c411ff30f4ffdc58",
        custom_right: "adunit-c411ff30f4ffdc58",
        grid: "adunit-469cc3d4dd0aa92e",
        labelVersion: "",
        subIds: [], //订阅id 数组
        heJiConfig: "",
        shareImgUrl: "", //
        tdAppKey: "",
        gravityEngineAccessToken: "opvfkHOzenNTxYqxGjVCc0acZl6Su2d9", //引力的access_token
        app_key: "", //微信互跳用的 和引力没关系
        app_version: "" //微信互跳用的 和引力没关系
    },
    qq: {
        "gameName": "",
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
        // gameName: "枪神特攻",
        // appId: "ks660621773935057065",
        // labelName: "qstg_qstg_10_ks_xyx_20250212",//标签名
        // age: 12,
        // company: "石家庄多量来信息科技有限公司",//健康忠告的公司名
        // softCode: "2023SA0051553",//软著号
        // ysCompanyName: "石家庄市神名网络科技有限公司",//隐私政策中公司名
        // ysMail: "2361198052@qq.com",//隐私政策中联系邮箱
        // ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009 ",//隐私政策中公司地址
        // inter: "2300019057_02",
        // banner: "2300019057_03",
        // video: "2300019057_01",
        // labelVersion: "",
        // heJiConfig: "",
        // tdAppKey: "",
        // gravityEngineAccessToken: "2UYxc0Jdkvv9sOhXLgZGrWto8fwupyEm"
        gameName: "向着丧尸开炮",
        appId: "ks670473396729425932",
        labelName: "xzsskp_xzsskp_10_ks_xyx_20250213", //标签名
        age: 12,
        company: "石家庄多量来信息科技有限公司", //健康忠告的公司名
        softCode: "2025SA0014320", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009-1009 ", //隐私政策中公司地址
        inter: "2300019158_02",
        banner: "2300019158_01",
        video: "2300019158_03",
        labelVersion: "",
        heJiConfig: "",
        tdAppKey: "",
        gravityEngineAccessToken: "bpgagyGpc8tUwyLebONl7ExAjDu6asnZ"
        // gameName: "我是弓箭手",
        // appId: "ks658369970963020958",
        // labelName: "wsgjs_wsgjs_10_ks_xyx_20250217",//标签名
        // age: 12,
        // company: "石家庄市神名网络科技有限公司",//健康忠告的公司名
        // softCode: "2023SA0027532",//软著号
        // ysCompanyName: "石家庄市高兴网络科技有限公司",//隐私政策中公司名
        // ysMail: "2361198052@qq.com",//隐私政策中联系邮箱
        // ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009 ",//隐私政策中公司地址
        // inter: "2300019377_02",
        // banner: "2300019057_03",
        // video: "2300019377_01",
        // labelVersion: "",
        // heJiConfig: "",
        // tdAppKey: "",
        // gravityEngineAccessToken: "QmeelpoDzZVOjHAJIfr5Ydqaa4jiucuR"
    },
    tt: {
        // "gameName": "偷偷刺杀国王",
        // appId: "tt0e347889913ef43c02",
        // ecpmConfigName: "",
        // labelName: "ttcsgwdy_ttcsgwdy_1_tt_xyx_20241230",//标签名
        // age: 12,
        // company: "",//健康忠告的公司名
        // softCode: "",//软著号
        // ysCompanyName: "石家庄市高兴网络科技有限公司",//隐私政策中公司名
        // ysMail: "2361198052@qq.com",//隐私政策中联系邮箱
        // ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009",//隐私政策中公司地址
        // inter: "2lgmi2b3fjh213777g",
        // banner: "i26f6h3gg96dolclmi",
        // video: "3pmmatpawjs2lstom4",
        // labelVersion: "",
        // umAppKey: "",
        // shareTemplateId: "",
        // heJiConfig: "",
        // tdAppKey: "",
        // gravityEngineAccessToken: ""//引力的access_token
        "gameName": "神奇解压神器",
        appId: "ttbefbc84621c474e702",
        ecpmConfigName: "",
        labelName: "sqjysqdy_sqjysqdy_1_tt_xyx_20250106", //标签名
        age: 12,
        company: "", //健康忠告的公司名
        softCode: "", //软著号
        ysCompanyName: "石家庄市高兴网络科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区天山世界之门大厦H-1009", //隐私政策中公司地址
        inter: "b7f2j70dkih85598m2",
        banner: "ii9hf1m70l7127e3eh",
        video: "73huqsu9uo64ka864h",
        labelVersion: "",
        umAppKey: "",
        shareTemplateId: "",
        heJiConfig: "",
        tdAppKey: "",
        gravityEngineAccessToken: "" //引力的access_token
    },
    hw: {
        "gameName": "",
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
        tdAppKey: ""
    },
    uc: {
        "gameName": "",
        labelName: "nljfyj_nljfyjuc_1_xm_xyx_20241206", //标签名
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
        "gameName": "",
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
    rongyao: {
        "gameName": "com.sjzdll.tczkj.minigame",
        labelName: "tczkj_tczkjry_1_hw_xyx_20241217", //标签名
        age: 12,
        company: "石家庄多量来信息科技有限公司", //健康忠告的公司名
        softCode: "2024SA0092894", //软著号
        ysCompanyName: "石家庄多量来信息科技有限公司", //隐私政策中公司名
        ysMail: "2361198052@qq.com", //隐私政策中联系邮箱
        ysAddress: "河北省石家庄市高新区中山东路95号润江慧谷大厦A座16层1603室", //隐私政策中公司地址
        inter: "1866718020076044288",
        banner: "1866685538074361856",
        video: "1866718959759523840",
    }
};
