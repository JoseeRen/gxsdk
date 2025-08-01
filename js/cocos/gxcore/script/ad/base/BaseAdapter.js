"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECORDER_STATE = void 0;
const ResUtil_1 = __importDefault(require("../../util/ResUtil"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const GxEnum_1 = require("../../core/GxEnum");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxLog_1 = __importDefault(require("../../util/GxLog"));
// import TDSDK from "../../td/TDSDK";
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const GxAdParams_1 = require("../../GxAdParams");
var RECORDER_STATE;
(function (RECORDER_STATE) {
    RECORDER_STATE[RECORDER_STATE["NO"] = 0] = "NO";
    RECORDER_STATE[RECORDER_STATE["START"] = 1] = "START";
    RECORDER_STATE[RECORDER_STATE["STOP"] = 2] = "STOP";
    RECORDER_STATE[RECORDER_STATE["PAUSE"] = 3] = "PAUSE";
    RECORDER_STATE[RECORDER_STATE["RESUME"] = 4] = "RESUME";
})(RECORDER_STATE || (exports.RECORDER_STATE = RECORDER_STATE = {}));
class BaseAd {
    constructor() {
        this.authorizeView = null;
        this.privacyView = null;
        this.isInitAd = false;
        this.bannerAd = null;
        this.videoAd = null;
        this.interAd = null;
        this.bannerNode = null;
        this.innerInter = null;
        this.nativeInter = null;
        this.nativeIcon = null;
        this.portalAd = null;
        this.blockAd = null;
        this.appBox = null;
        this._native_data_cache = [];
        this._native_custom_inter_cache = [];
        this._native_custom_banner_cache = [];
        this.isNeedShowBanner = false;
        this.isGameCd = false;
        this.addIconNode = null;
        this.interShowTime = 0;
        this.bannerShowTime = 0;
        this.gameRecorder = null;
        this.videoPath = null;
        this.gameRecorderState = RECORDER_STATE.NO;
        this.bannerTimer = null;
        this.nativeInterTimer = null;
        this.bannerDelayTimer = null;
        this.interIdx = 1;
        this.cur_show_ad_index = 0;
        this.companyView = null;
        this.icNum = -1;
        this.gameBoxNumListener = null;
        this.ismailiang = false; //是买量用户吗
        this.waitSubIds = [];
        this.manifestInfo = null;
        this.canReward = false; //头条侧边框奖励用
        this.curVideoFlag = "";
        //判断用户是不是来自买量
        this.userFromAd = false;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new BaseAd();
        }
        return this.instance;
    }
    /**广告初始化 */
    initAd() {
        console.log("[gx_game]广告初始化");
    }
    setManifestInfo(info) {
        this.manifestInfo = info;
        /*  TDSDK.getInstance().initApp(
              info.package,
              info.name,
              info.versionName,
              info.versionCode
          );*/
        console.log("[gx_game]设置info");
    }
    showAuthorize(on_agree, on_refuse) {
        ResUtil_1.default.loadPrefab("gx/prefab/authorize", (err, prefab) => {
            if (err) {
                on_refuse();
                return;
            }
            if (this.authorizeView == null ||
                !cc.isValid(this.authorizeView.node, true)) {
                let node = cc.instantiate(prefab);
                if (!!GxGame_1.default.uiGroup) {
                    node.group = GxGame_1.default.uiGroup;
                }
                this.authorizeView = node.getComponent("Gx_authorize");
                this.authorizeView.show(on_agree, on_refuse);
            }
        });
    }
    /*    type {
          user = 'user',
          privacy = 'privacy'
      }*/
    showPrivacy(type = "privacy") {
        if (GxConstant_1.default.IS_HUAWEI_GAME) {
            if (type == "privacy") {
                //@ts-ignore
                qg.openDeeplink({
                    uri: GxAdParams_1.AdParams.hw.privacy_url,
                    params: {
                        ___PARAM_LAUNCH_NATIVE_FLAG___: "newTask"
                    }
                });
            }
        }
        else {
            ResUtil_1.default.loadPrefab("gx/prefab/privacy", (err, prefab) => {
                if (this.privacyView == null ||
                    !cc.isValid(this.privacyView.node, true)) {
                    let node = cc.instantiate(prefab);
                    if (!!GxGame_1.default.uiGroup) {
                        node.group = GxGame_1.default.uiGroup;
                    }
                    this.privacyView = node.getComponent("Gx_privacy");
                    this.privacyView.show(type);
                }
            });
        }
    }
    /**qq常量策略 结束游戏  ov结束游戏的全屏点击*/
    showGameOverAD() {
        /*  if (GxConstant.IS_OPPO_GAME || GxConstant.IS_VIVO_GAME) {

                  ResUtil.loadPrefab("gx/prefab/GameOverAD", (err, prefab) => {
                      if (this.privacyView == null || !cc.isValid(this.privacyView.node, true)) {
                          let node = cc.instantiate(prefab);
                          if (!!GxGame.uiGroup) {
                              node.group = GxGame.uiGroup;
                          }
                          this.privacyView = node.getComponent('Gx_GameOverAD');
                          this.privacyView.show();
                      }
                  })
              }*/
    }
    /////////////////////////public/////////////////////////
    canIn() {
        /*   if (GxConstant.IS_OPPO_GAME) {

                   let value = GxGame.gGN("ysgl", 0);

                   let number = Math.random() * 100;
                   if (number < value) {

                       return true;
                   }


               }*/
        return false;
    }
    /**
     * 展示banner
     * 优先展示原生Banner，若广告ID不存在/无广告数据，自动切换普通Banner
     */
    showBanner(showCallback, failedCallback) {
    }
    /**隐藏Banner */
    hideBanner() {
        if (this.bannerTimer)
            this.bannerTimer.clear();
        if (this.bannerDelayTimer)
            this.bannerDelayTimer.clear();
        if (this.bannerNode &&
            this.bannerNode !== undefined &&
            cc.isValid(this.bannerNode.node, true)) {
            this.bannerNode.node.destroy();
        }
        this.bannerNode = null;
    }
    /**
     * 激励视频
     * @param complete 参数表示是否完成
     * @param flag
     * @param multitonRewardMsgArr 快手抖音激励再得
     * @param multitonRewardTimes 快手抖音激励再得
     */
    showVideo(complete, flag = "", multitonRewardMsgArr = [], multitonRewardTimes = 0) {
        // GxGame.gameEvent("reward", {flag: this.curVideoFlag});
        complete && complete(true, 1);
    }
    _videoCallEvent(flag = "", adUnitId = "") {
        this.curVideoFlag = flag;
        let flag1 = this.curVideoFlag;
        if (typeof this.curVideoFlag === "string") {
        }
        else {
            flag1 = this.curVideoFlag.flag;
        }
        if (!!flag1) {
        }
        else {
            console.warn("视频点没有加flag");
        }
        GxGame_1.default.gameEvent("reward", { flag: flag1, adUnitId: adUnitId });
    }
    _videoCompleteEvent(adUnitId = "") {
        let flag1 = this.curVideoFlag;
        if (typeof this.curVideoFlag === "string") {
        }
        else {
            flag1 = this.curVideoFlag.flag;
        }
        GxGame_1.default.gameEvent("reward_complete", { flag: flag1, adUnitId: adUnitId + "" });
    }
    _videoErrorEvent(reason = "", errCode = "", errMsg = "", adUnitId = "") {
        let flag1 = this.curVideoFlag;
        if (typeof this.curVideoFlag === "string") {
        }
        else {
            flag1 = this.curVideoFlag.flag;
        }
        GxGame_1.default.gameEvent("reward_error", {
            flag: flag1,
            reason: reason + "",
            errCode: errCode + "",
            errMsg: errMsg + "",
            adUnitId: adUnitId + ""
        });
    }
    _videoErrorUploadEvent(reason = "", errCode = "", errMsg = "", adUnitId = "") {
        let flag1 = this.curVideoFlag;
        if (typeof this.curVideoFlag === "string") {
        }
        else {
            flag1 = this.curVideoFlag.flag;
        }
        GxGame_1.default.gameEvent("reward_error_upload", {
            flag: flag1, reason: reason + "",
            errCode: errCode + "",
            errMsg: errMsg + "",
            adUnitId: adUnitId + ""
        });
    }
    _videoCloseEvent(adUnitId = "") {
        let flag1 = this.curVideoFlag;
        if (typeof this.curVideoFlag === "string") {
        }
        else {
            flag1 = this.curVideoFlag.flag;
        }
        GxGame_1.default.gameEvent("reward_close", { flag: flag1, adUnitId: adUnitId + "" });
    }
    _videoShowEvent(adUnitId = "") {
        let flag1 = this.curVideoFlag;
        if (typeof this.curVideoFlag === "string") {
        }
        else {
            flag1 = this.curVideoFlag.flag;
        }
        GxGame_1.default.gameEvent("reward_show", { flag: flag1, adUnitId: adUnitId + "" });
    }
    /**
     * 上报原生广告曝光
     * @param native_data
     */
    reportAdShow(native_data) {
        if (!native_data || native_data === undefined)
            return;
        native_data.ad &&
            native_data.ad.reportAdShow({
                adId: native_data.adId
            });
        for (let i in this._native_data_cache) {
            if (this._native_data_cache[i].adId == native_data.adId) {
                this._native_data_cache[i].state = GxEnum_1.ad_native_state.show;
                break;
            }
        }
    }
    /**
     * 上报原生广告点击
     * @param native_data
     */
    reportAdClick(native_data) {
        if (!native_data || native_data === undefined)
            return;
        native_data.ad &&
            native_data.ad.reportAdClick({
                adId: native_data.adId
            });
        this.remove_native_data(native_data);
    }
    /**
     * 获取原生广告数据
     * @param ad_type 广告类型ad_native_type
     * @returns native_data
     */
    getLocalNativeData(ad_type) {
        if (GxGame_1.default.adConfig.useNative) {
            if (GxGame_1.default.adConfig.switchPool) {
                let cur_data_cache = [];
                for (let data of this._native_data_cache) {
                    if (data.type == ad_type) {
                        cur_data_cache.push(data);
                    }
                }
                if (this.check_native_data_list_is_reprot(cur_data_cache)) {
                    return cur_data_cache.length > 0
                        ? cur_data_cache[GxUtils_1.default.randomInt(0, cur_data_cache.length - 1)]
                        : null;
                }
                else {
                    //有数据没有上报过曝光  用最新数据
                    return this.get_latest_native_data(cur_data_cache);
                }
            }
            else {
                if (this.cur_show_ad_index >= this._native_data_cache.length) {
                    this.cur_show_ad_index = 0;
                }
                return this._native_data_cache[this.cur_show_ad_index++];
            }
        }
        else {
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                if (this._native_custom_banner_cache &&
                    this._native_custom_banner_cache.length > 0) {
                    return this._native_custom_banner_cache.shift();
                }
                return null;
            }
            else {
                if (this._native_custom_inter_cache &&
                    this._native_custom_inter_cache.length > 0) {
                    return this._native_custom_inter_cache.shift();
                }
                return null;
            }
        }
    }
    /**
     * 原生大图
     * @param parent
     * @param on_click
     * @param on_show
     * @param on_hide
     */
    showInterstitialNative(parent, on_click, on_show, on_hide) {
    }
    /**
     * 普通插屏  安卓上用的
     * @param on_show
     * @param on_close
     */
    showInterstitial(on_show, on_close) {
    }
    /**隐藏原生大图 */
    hideInterstitialNative() {
        if (this.innerInter &&
            this.innerInter !== undefined &&
            cc.isValid(this.innerInter.node, true)) {
            this.innerInter.node.destroy();
        }
        this.innerInter = null;
    }
    /**
     * 原生插屏
     * @param on_show 成功展示回调
     * @param on_hide 隐藏回调
     * @param on_fail deprecated
     * @returns
     */
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
    }
    /**
     * 原生插屏  vivo专用的  有switch控制
     * @param on_show 成功展示回调
     * @param on_hide 隐藏回调
     * @param on_fail deprecated
     * @returns
     */
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
    }
    /**隐藏原生插屏 */
    hideNativeInterstitial() {
        if (this.nativeInter &&
            this.nativeInter !== undefined &&
            cc.isValid(this.nativeInter.node, true)) {
            this.nativeInter.node.destroy();
        }
        this.nativeInter = null;
        this.nativeInterTimer && this.nativeInterTimer.clear();
        this.nativeInterTimer = null;
    }
    showVivoIcon() {
    }
    hideVivoIcon() {
    }
    /**
     * 原生ICON
     * @param parent
     */
    showNativeIcon(parent) {
    }
    /**隐藏原生ICON */
    hideNativeIcon() {
        if (this.nativeIcon &&
            this.nativeIcon !== undefined &&
            cc.isValid(this.nativeIcon.node, true)) {
            this.nativeIcon.node.destroy();
        }
        this.nativeIcon = null;
    }
    /**获取平台版本 */
    platformVersion() {
        if (GxConstant_1.default.IS_OPPO_GAME) {
            return window["qg"].getSystemInfoSync()["platformVersion"];
        }
        else if (GxConstant_1.default.IS_VIVO_GAME) {
            return window["qg"].getSystemInfoSync()["platformVersionCode"];
        }
        return 0;
    }
    /**
     * 展示添加桌面界面，界面已接入添加桌面功能（addDesktop）
     * @param on_close
     * @param on_succ 添加成功回调
     */
    showAddDesktop(on_close, on_succ) {
    }
    /**
     * 判断是否支持添加桌面
     * @param can_add 可以添加回调
     * @param has_add 已经添加回调
     * @param on_fail 失败回调
     */
    hasAddDesktop(can_add, has_add, on_fail) {
    }
    /**
     * 创建桌面图标
     * @param on_succe 添加成功回调
     * @param on_fail 添加失败回调
     */
    addDesktop(on_succe, on_fail, showToast = true) {
    }
    /**
     * 创建常用图标
     * @param on_succe 添加成功回调
     * @param on_fail 添加失败回调
     */
    addCommonUse(on_succe, on_fail, showToast = true) {
    }
    /**
     * 提示框
     * @param desc
     */
    createToast(desc) {
        if (this.toastView == null || !cc.isValid(this.toastView.node, true)) {
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/toast", cc.Prefab));
            if (!!GxGame_1.default.uiGroup) {
                node.group = GxGame_1.default.uiGroup;
            }
            this.toastView = node.getComponent("Gx_toast");
        }
        this.toastView && this.toastView.show && this.toastView.show(desc);
    }
    /**是否支持九宫格 */
    supportGameBox() {
        if (GxConstant_1.default.IS_OPPO_GAME) {
            return this.platformVersion() >= 1076;
        }
        return false;
    }
    /**
     * 展示九宫格
     * @param on_show 展示回调
     * @param on_hide 隐藏回调
     * @param show_toast 是否展示提示
     * @param image 按钮图片（vivo）
     * @param marginTop 距顶部距离（vivo）
     */
    showGamePortal(on_show, on_hide, show_toast = true, image = "", marginTop = 300) {
    }
    /**隐藏九宫格 */
    hideGamePortal() {
    }
    /**点击按钮触发原生横幅 */
    setClickInnerInterstitialBtn(cbk, rto) {
        this._setClickNative(GxEnum_1.ad_native_type.inter2, cbk, rto);
    }
    /**点击按钮触发原生Banner */
    setClickNativeBanner(cbk, rto) {
        this._setClickNative(GxEnum_1.ad_native_type.banner, cbk, rto);
    }
    /**原生大图点击查看详情 */
    clickNativeInnerInterstitial() {
        if (this.isGameCd) {
            return console.log("[gx_game]广告CD中");
        }
        if (this.innerInter && cc.isValid(this.innerInter.node, true)) {
            this.innerInter.report_click();
        }
    }
    /**
     * 主动点击跳转广告
     */
    clickNative() {
        if (this.isGameCd) {
            return console.log("[gx_game]广告CD中");
        }
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
        if (native_data == null) {
            native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.banner);
        }
        if (native_data == null) {
            native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
        }
        if (native_data == null) {
            native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.native_icon);
        }
        if (native_data) {
            this.reportAdShow(native_data);
            this.reportAdClick(native_data);
        }
    }
    /**
     * 开始录屏(快手、头条)
     */
    recorderStart() {
    }
    /**
     * 结束录屏(快手、头条)
     */
    recorderStop(on_stop) {
        on_stop && on_stop(false);
    }
    /**
     * 判断录屏是否存在(快手、头条)
     */
    hasRecorderPath() {
        return this.videoPath != null;
    }
    /**
     * 录屏分享(快手、头条)
     * @param on_succ
     * @param on_fail
     */
    shareRecorder(on_succ, on_fail) {
        on_fail && on_fail();
    }
    showRecorderLayer(on_succ, on_fail) {
    }
    /**
     * 平台登入
     * @param on_succ
     * @param on_fail
     */
    login(on_succ, on_fail) {
        on_succ && on_succ(true);
    }
    showQQAppBox(on_show, on_close) {
    }
    hideQQAppBox() {
    }
    showQQBlockAd(on_show, on_close) {
    }
    hideQQBlockAd() {
    }
    // showCustomInter(){}
    showCustomLeft() {
    }
    showCustomRight() {
    }
    // hideCustomInter(){}
    hideCustomLeft() {
    }
    hideCustomRight() {
    }
    /**
     * 砸宝箱
     * @param on_show 展示回调
     * @param on_close 关闭时
     * @param on_get 点击获取按钮并且看完视频时
     * @param is_banner 误触使用视频还是banner  true banner  默认视频
     */
    showCrazyPoint(on_show, on_close, on_get, is_banner = false) {
        if (GxGame_1.default.gGB("crazy")) {
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/crazypoint", cc.Prefab));
            let crazyPoint = node.getComponent("Gx_crazypoint");
            node.parent = cc.director.getScene();
            node.zIndex = cc.macro.MAX_ZINDEX - 1;
            crazyPoint.show(on_show, on_close, on_get, is_banner);
        }
        else {
            on_close && on_close();
        }
    }
    /**
     * 九宫格
     * @param on_show 展示回调
     * @param on_close 关闭时
     * @param on_get 回传获取的金币数
     */
    showGameBox(on_show, on_close, on_get) {
        if (GxGame_1.default.gGB("z1")) {
            let res = GxUtils_1.default.getRes("gx/prefab/gameBox", cc.Prefab);
            let node = cc.instantiate(res);
            let crazyPoint = node.getComponent("Gx_gameBox");
            node.parent = cc.director.getScene();
            node.zIndex = cc.macro.MAX_ZINDEX - 1;
            crazyPoint.show(on_show, on_close, (num) => {
                if (on_get) {
                    on_get(num);
                }
                else {
                    if (this.gameBoxNumListener) {
                        this.gameBoxNumListener(num);
                    }
                    else {
                        if (!this.gameBoxNumListener) {
                            GxLog_1.default.e("没有设置金币回调 gameBoxNumListener");
                        }
                        on_get && on_get(num);
                    }
                }
            });
        }
        else {
            on_close && on_close();
        }
    }
    setGameBoxNumCallback(callback) {
        this.gameBoxNumListener = callback;
    }
    /*    /!**
           * 展示软著信息
           * @param company 著作权人
           * @param copyright 软著登记号
           *!/
          showCompany(company = null, copyright = null) {
              cc.loader.loadRes('gx/prefab/company', cc.Prefab, (err, prefab: cc.Prefab) => {
                  if (err) {
                      return console.error('[gx_game] company load error: ' + JSON.stringify(err));
                  }
                  if (this.companyView == null || !cc.isValid(this.companyView.node, true)) {
                      let node = cc.instantiate(prefab, cc.Prefab));
                      this.companyView = node.getComponent('company');
                      this.companyView.show(company, copyright);
                  }
              })
          }

          /!**
           * 隐藏软著信息
           *!/
          hideCompany() {
              if (this.companyView && this.companyView !== undefined && cc.isValid(this.companyView.node, true)) {
                  this.companyView.node.destroy();
              }
              this.companyView = null;
          }*/
    ////////////////////////////// 原生接口 //////////////////////////////
    /**展示插屏视频（小米原生） */
    showInterVideo(on_show, on_close) {
        on_close && on_close();
    }
    /**销毁插屏视频（小米原生） */
    destroyInterVideo() {
    }
    showFeedAd(on_show, on_close) {
        on_close && on_close();
    }
    destroyFeedAd() {
    }
    getGameAge() {
        return "12";
    }
    openUrl(url) {
    }
    //oppo小游戏专属
    getDeviceId(callback) {
    }
    //h5链接专属 返回大厅
    backGameHall() {
    }
    getConfigUrl() {
        return "http://127.0.0.1:8080/config.json";
    }
    jumpGame(url) {
        window.location.href = url;
    }
    /////////////////////////protected///////////////////////////
    initBanner() {
        this.bannerTimer = new GxTimer_1.default();
    }
    initNativeAd() {
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
    /**
     * 检查全部原生数据是否都为已曝光过的
     */
    check_native_data_list_is_reprot(native_data_list) {
        if (native_data_list.length > 0) {
            for (let i in native_data_list) {
                if (native_data_list[i].state == GxEnum_1.ad_native_state.need_show) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * 最近拉取到的原生数据  或者 没有上报过的数据
     */
    get_latest_native_data(native_data_list) {
        // 需要曝光列表
        let need_show_list = [];
        for (let i in native_data_list) {
            if (native_data_list[i].state == GxEnum_1.ad_native_state.need_show) {
                return native_data_list[i];
            }
        }
        if (need_show_list.length > 0) {
            return need_show_list[GxUtils_1.default.randomInt(0, need_show_list.length - 1)];
        }
        else if (native_data_list.length > 0) {
            return native_data_list[GxUtils_1.default.randomInt(0, native_data_list.length - 1)];
        }
        return null;
    }
    /**
     * 储存原生数据
     * @param native_data 原生数据
     */
    add_native_data(native_data) {
        for (let i in this._native_data_cache) {
            if (this._native_data_cache[i].adId == native_data.adId) {
                return;
            }
        }
        native_data.state = GxEnum_1.ad_native_state.need_show;
        this._native_data_cache.push(native_data);
    }
    /**
     * 点击上报了—-->移除原生数据
     */
    remove_native_data(native_data) {
        for (let i in this._native_data_cache) {
            if (this._native_data_cache[i].adId == native_data.adId) {
                console.log("remove native_data:", native_data);
                this._native_data_cache.splice(parseInt(i), 1);
                return;
            }
        }
    }
    is_limit_native_length(ad_type) {
        let count = 0;
        for (let i in this._native_data_cache) {
            if (this._native_data_cache[i].type == ad_type &&
                this._native_data_cache[i].state != GxEnum_1.ad_native_state.click) {
                ++count;
            }
        }
        return count >= GxGame_1.default.adConfig.nativeAdLimitCount;
    }
    /////////////////////////private/////////////////////////
    _setClickNative(type, cbk, rto = null) {
        /*    if (this.isGameCd || GxGame.inBlockArea) {
                    cbk && cbk();
                    return console.log("[gx_game]广告CD中");
                }
                let time = 0;

                if (type == ad_native_type.inter2 && this.innerInter && !this.innerInter.destroyed) {

                    rto = rto || GxGame.adConfig.nativeInnerInstitialClickWarp;

                    if (GxUtils.randomInt(1, 100) <= rto && !this.innerInter.has_click_warp) {
                        this.innerInter.click_adv_warp();
                        time = 500;
                    }
                } else if (type == ad_native_type.banner && this.bannerNode && !this.bannerNode.destroyed) {

                    rto = rto || GxGame.adConfig.nativeBannerClickWarp;

                    if (GxUtils.randomInt(1, 100) <= rto && !this.bannerNode.has_click_warp) {
                        this.bannerNode.click_adv_warp();
                        time = 500;
                    }
                }
                setTimeout(() => {
                    cbk && cbk();
                }, time);*/
    }
    LOG(...data) {
        GxLog_1.default.i(...data);
    }
    LOGE(...data) {
        GxLog_1.default.e(...data);
    }
    LOGW(...data) {
        GxLog_1.default.w(...data);
    }
    shareMessageToFriend(callback) {
        callback && callback(true);
    }
    setOpenDataShareCallback(callback) {
    }
    getSubIds() {
        return [];
    }
    submsg(tmplId, callback) {
        callback && callback(false);
    }
    initSubmsg() {
    }
    rewardAdEnd() {
    }
    ttReport() {
    }
    onClickBtn(type) {
    }
    /*判断用户是不是买量进来的*/
    userFrom(callback) {
        callback && callback(false);
    }
    preShowVideo(callback) {
        callback && callback(false);
    }
    showPositionBanner(left, top, showCallback, failedCallback) {
    }
    initJump(app_key, app_version, initCallback) {
        initCallback && initCallback();
    }
    showPlayBtn(parentNode, width = 100, height = 100) {
    }
    showPlayGames(nodeArr, width = 100, height = 100) {
    }
    /**
     * 保存数据
     * @param key
     * @param data
     * @param callback
     */
    saveData(key, data, callback) {
        DataStorage_1.default.setItem("_save_" + key, JSON.stringify({ data: data }));
        callback && callback(null);
        /*       let encryptData = this.encrypt("sadfasdf", "safsfdassasdfsdf", key, data);
               this.requestNet({
                   url: "https://api.sjzgxwl.com/commonData/data/saveData/v2",
                   method: "POST",
                   data: JSON.stringify(encryptData)
                   , successCallback: (res) => {

                       if (res["data"] && res["data"]["code"] == 1) {
                           callback && callback(null);
                       } else {
                           callback && callback(res);

                       }
                   }, failedCallback: (err) => {
                       callback && callback(err);
                   }
               });*/
    }
    /**
     *
     * @param key
     * @param callback  callback返回两个参数  第一个error  第二个是数据
     */
    getData(key, callback) {
        let item = DataStorage_1.default.getItem("_save_" + key, null);
        if (item == null) {
            return callback && callback(null, null);
        }
        try {
            let parse = JSON.parse(item);
            callback && callback(null, parse["data"]);
        }
        catch (e) {
            console.error(e);
            callback && callback(e, null);
        }
    }
    encrypt(appId, openId, dataKey, data) {
        if (appId.length < 5 || openId.length < 5) {
            console.error("appid或者openid太短了");
            return null;
        }
        //获取用来加密的key
        /*
        * key的组成  openId的后5位+appId的后5位+时间戳的后五位
        *
        * */
        let timestamp = new Date().valueOf();
        let timestampStr = timestamp + "";
        let subOpenId = openId.substring(openId.length - 5);
        let subAppId = appId.substring(appId.length - 5);
        let subTimestamp = timestampStr.substring(timestampStr.length - 5);
        let key = subOpenId + subAppId + subTimestamp;
        let input = JSON.stringify({
            data: data, key: dataKey
        });
        let dataEncrypt = "";
        //用key来异或数据
        let length1 = key.length;
        /*    for (let i = 0; i < input.length; i++) {
                const xorResult = input.charCodeAt(i) ^ key.charCodeAt(i % length1);
                dataEncrypt += String.fromCharCode(xorResult);
            }*/
        dataEncrypt = input;
        var s = [];
        var hexDigits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let length = hexDigits.length;
        // sign生成    随机32个字符串
        for (var i = 0; i < 32; i++) {
            let start = Math.floor(Math.random() * length);
            s[i] = hexDigits.substring(start, start + 1);
        }
        var uuid = s.join("");
        //计算时间戳后6位 转成16进制 后替换掉32位字符串的前缀
        let number1 = Number(timestamp % 1000000).toString(16);
        uuid = number1 + uuid.substring((number1 + "").length);
        //校验指定位置的ascii码和
        let signAt = [1, 3, 7, 9, 16, 22];
        let result = 0;
        for (let i = 0; i < signAt.length; i++) {
            result += uuid.charCodeAt(signAt[i]);
        }
        //对100取余后替换掉32位字符串的后缀
        let number = (result % 100) + "";
        // console.log(uuid);
        //最终的sign
        let s1 = uuid.substring(0, uuid.length - number.length) + number;
        // console.log("签名：" + s1);
        // console.log("签名：" + s1.length);
        // console.log((new Date().valueOf() - t) / 1000);
        // let checkSignGetData1 = checkSignGetData(timestamp,s1,openId,dataEncrypt,appId);
        // console.log(checkSignGetData1)
        // console.log(dataEncrypt);
        return {
            appId: appId,
            openId: openId,
            timestamp: timestamp,
            sign: s1,
            data: dataEncrypt
        }; /*      if (appId.length < 5 || openId.length < 5) {
            console.error("appid或者openid太短了");
            return null
        }
        //获取用来加密的key
        /!*
        * key的组成  openId的后5位+appId的后5位+时间戳的后五位
        *
        * *!/
        let timestamp = new Date().valueOf();
        let timestampStr = timestamp + "";

        let subOpenId = openId.substring(openId.length - 5);
        let subAppId = appId.substring(appId.length - 5);
        let subTimestamp = timestampStr.substring(timestampStr.length - 5);
        let key = subOpenId + subAppId + subTimestamp;

        let input = JSON.stringify({
            data: data, key: dataKey
        });
        let dataEncrypt = "";
        //用key来异或数据
        let length1 = key.length;
        for (let i = 0; i < input.length; i++) {
            const xorResult = input.charCodeAt(i) ^ key.charCodeAt(i % length1);
            dataEncrypt += String.fromCharCode(xorResult);
        }


        var s = [];
        var hexDigits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let length = hexDigits.length;

        // sign生成    随机32个字符串
        for (var i = 0; i < 32; i++) {
            let start = Math.floor(Math.random() * length);
            s[i] = hexDigits.substring(start, start + 1);
        }
        var uuid = s.join("");
        //计算时间戳后6位 转成16进制 后替换掉32位字符串的前缀
        let number1 = Number(timestamp % 1000000).toString(16);
        uuid = number1 + uuid.substring((number1 + "").length);
        //校验指定位置的ascii码和
        let signAt = [1, 3, 7, 9, 16, 22];

        let result = 0;

        for (let i = 0; i < signAt.length; i++) {

            result += uuid.charCodeAt(signAt[i]);


        }
        //对100取余后替换掉32位字符串的后缀
        let number = (result % 100) + "";

        // console.log(uuid);
        //最终的sign
        let s1 = uuid.substring(0, uuid.length - number.length) + number;

        // console.log("签名：" + s1);
        // console.log("签名：" + s1.length);
        // console.log((new Date().valueOf() - t) / 1000);

        // let checkSignGetData1 = checkSignGetData(timestamp,s1,openId,dataEncrypt,appId);
        // console.log(checkSignGetData1)


        return {

            appId: appId,
            openId: openId,
            timestamp: timestamp,
            sign: s1,
            data: dataEncrypt
        };*/
    }
    requestNet(option) {
        if (!option.method) {
            option.method = "GET";
        }
        if (!option.timeout) {
            option.timeout = 5000;
        }
        option.method = option.method.toUpperCase();
        let response = {
            statusCode: 200,
            data: {},
            errMsg: ""
        };
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open(option.method, option.url);
        if (option.header) {
            for (const header in option.header) {
                xmlHttpRequest.setRequestHeader(header, option.header[header]);
            }
        }
        xmlHttpRequest.onreadystatechange = () => {
            if (4 === xmlHttpRequest.readyState) {
                if (200 === xmlHttpRequest.status) {
                    response.statusCode = 200;
                    try {
                        let parse = JSON.parse(xmlHttpRequest.responseText);
                        response.data = parse;
                    }
                    catch (e) {
                        response.data = xmlHttpRequest.responseText;
                    }
                    option.successCallback(response);
                }
                else {
                    response.statusCode = xmlHttpRequest.status;
                    response.errMsg = "network error";
                    option.failedCallback(response);
                }
            }
        };
        console.log(option.timeout);
        xmlHttpRequest.timeout = option.timeout;
        xmlHttpRequest.ontimeout = () => {
            response.errMsg = "timeout";
            option.failedCallback(response);
        };
        xmlHttpRequest.send(option.data);
        return xmlHttpRequest;
    }
    /**
     * 是否可以用侧边栏
     * @param callback
     */
    canUseSideBar(callback) {
        callback && callback(false);
    }
    /**
     * 是否可以使用消息订阅
     * @param callback
     */
    canUseSubscribeMessage(callback) {
        callback && callback(false);
    }
    /**
     * 是否可以使用添加桌面
     * @param callback
     */
    canUseAddDesktop(callback) {
        callback && callback(false);
    }
    /**
     * 是否可以使用游戏圈
     * @param callback
     */
    canUseGameClub(callback) {
        callback && callback(false);
    }
    /**
     * 是否可以使用客服消息
     * @param callback
     */
    canUseCustomerMessage(callback) {
        callback && callback(false);
    }
    /**
     * 是否可以使用激励再得
     * @param callback   true可以  false不可以  第二个参数是最多 几次
     */
    canUseRewardMultiton(callback) {
        callback && callback(false, 0);
    }
    /**
     * 是否可以使用添加常用
     * @param callback
     */
    canUseAddCommonUse(callback) {
        callback && callback(false);
    }
    /**
     * 是从侧边栏进入的吗
     * @param callback
     */
    isFromSideBar(callback) {
        callback && callback(false);
    }
    /**
     * 是从添加桌面进来的吗
     * @param callback
     */
    isFromDesktop(callback) {
        callback && callback(false);
    }
    /**
     *
     * @param scene  1离线收益提醒  2体力满   3重大事件掉落  必须和content_id对应
     * @param content_id 运营提供
     * @param push_time 可以推送的时间 毫秒级时间戳
     * @param successCallback
     * @param failedCallback
     */
    reportFeedPush(scene, content_id, push_time, successCallback, failedCallback) {
        console.log("非抖音渠道不用上报feedpush");
        successCallback && successCallback();
    }
    /**
     * 是否需要直接显示出兑换cdkey界面
     * @param callback
     */
    needShowCdkey(callback) {
        callback && callback(false);
    }
    /**
     * 是否可以显示直播礼包兑换码入口
     * @param callback
     */
    canShowCdkeyEntrance(callback) {
        callback && callback(false);
    }
    /**
     * 进入主界面用户可以交互时使用
     */
    enterMainScene() {
    }
    checkCdkey(cdkey, successCallback, failedCallback) {
        failedCallback && failedCallback("非抖音不能用");
    }
    /**
     * 是否可以使用关注抖音号功能
     * @param callback
     */
    canUseFollowAweme(callback) {
        callback && callback(false);
    }
    /**
     * 是否已经关注
     * @param callback
     */
    checkFollowAwemeState(callback) {
        callback && callback(true);
    }
    /**
     * 抖音关注抖音号
     *
     */
    openAwemeUserProfile(success, fail) {
        success && success({ hasFollowed: true });
    }
    /**
     * 新的订阅消息
     * @param tmplIds
     * @param successCallback
     * @param failedCallback
     */
    submsgGameApi(tmplIds, successCallback, failedCallback) {
        successCallback && successCallback(false);
    }
    /**
     * 按场景订阅  自动 到时间发送消息
     * 1离线收益  2是体力满了  3重大事件     4是签到提醒
     * @param scene
     * @param push_time_millisecond
     * @param successCallback
     * @param failedCallback
     */
    subsceneGameApi(scene, push_time_millisecond, successCallback, failedCallback) {
        successCallback && successCallback(true);
    }
    /**
     * 订阅消息 抖音的一次性多个必须得类型一样  要不都是长期订阅  要不都是一次性订阅
     * @param tmplIds
     * @param successCallback
     * @param failedCallback
     */
    requestSubscribeMessage(tmplIds, successCallback, failedCallback, showToast = true) {
        successCallback && successCallback({});
    }
    /**
     * 是否可以用抖音推流直出
     */
    canUseFeedSubscribe() {
        return false;
    }
    /**
     * 抖音推流直出订阅
     * 具体规则看文档  https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/open-capacity/feed-subscribe/request-feed-subscribe
     * @param scene
     * @param contentIDs
     * @param allScene
     * @param successCallback
     * @param failedCallback
     */
    requestFeedSubscribe(scene, contentIDs, allScene, successCallback, failedCallback) {
        successCallback && successCallback();
    }
    /**
     * 查询用户直玩订阅的授权情况
     * 具体规则看文档  https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/open-capacity/feed-subscribe/request-feed-subscribe
     * @param scene
     * @param allScene
     * @param successCallback
     * @param failedCallback
     */
    checkFeedSubscribeStatus(scene, allScene, successCallback, failedCallback) {
        successCallback && successCallback({ status: true });
    }
    /**
     * 进入 侧边栏
     * @param scene
     * @param successCallback
     * @param failedCallback
     */
    navigateToScene(scene, successCallback, failedCallback) {
        successCallback && successCallback({});
    }
    /**
     * 今日是否可以获取侧边栏奖励
     */
    canShowSideBarReward() {
        return false;
    }
    /**
     * 设置今天已经获取过侧边栏奖励了
     */
    setSideBarRewarded() {
    }
    /**
     * 检查是否来自侧边栏
     * @param callback
     */
    checkIsFromSideBar(callback) {
        callback && callback(true);
    }
    isDouyinOrLite() {
        return false;
    }
    /**
     * 支付
     * @param productId
     * @param successCallback
     * @param failedCallback
     * @param orderDataCallback
     */
    payOrder(productId, successCallback, failedCallback, orderDataCallback = null) {
        let item = DataStorage_1.default.getItem("localbuy_" + productId, 0);
        let number = Number(item) + 1;
        DataStorage_1.default.setItem("localbuy_" + productId, number);
        orderDataCallback && orderDataCallback({
            third_party_trade_no: "2323lllla"
        });
        successCallback && successCallback(true, {
            orderData: {
                third_party_trade_no: "2323lllla",
                productId: productId
            }
        });
    }
    /**
     * 获取已经购买过的道具列表
     * @param successCallback  返回list    [{productId:132,num:0}] //num大于0就是买过了
     * @param failedCallback
     */
    getBuyPropList(successCallback, failedCallback) {
        successCallback && successCallback([]);
    }
    /**
     *检查某个是否购买过
     * @param productId
     * @param successCallback
     * @param failedCallback
     */
    checkIsBuy(productId, successCallback, failedCallback) {
        //没购买过  0没买过    返回的是购买过的数量
        let item = DataStorage_1.default.getItem("localbuy_" + productId, 0);
        successCallback && successCallback(Number(item));
    }
    /**
     * 获取用户是否有折扣
     * @param price
     * @param successCallback
     * @param failedCallback
     */
    getSubsidy(price, successCallback, failedCallback) {
        successCallback && successCallback(true, price * 0.5);
    }
    /**
     * 上报排行得分
     * @param key
     * @param score
     * @param successCallback
     * @param failedCallback
     */
    uploadRankScore(key, score, successCallback, failedCallback) {
        successCallback && successCallback();
    }
    /**
     * 邀请好友分享
     * @param shareObj https://developers.weixin.qq.com/minigame/dev/api/share/wx.shareAppMessage.html
     * @param shareType  比如可以传 tili   pifu  等等 不超过10个字符 分享的场景

     */
    inviteShare(shareObj, shareType) {
        // successCallback && successCallback();
        if (shareObj["success"]) {
            shareObj["success"]();
        }
    }
    /**
     * 获取邀请到的好友数量
     * @param shareType
     * @param successCallback  第一个返回的是去重好友数量   第二个返回的是好友点击次数（可能会有单个好友点击多次）
     * @param failedCallback
     */
    getInviteNum(shareType, successCallback, failedCallback) {
        successCallback && successCallback(0, 0);
    }
    canUseSubmsg(callback) {
        callback && callback(false);
    }
    shareAppMessage(shareObj = {}) {
        if (shareObj && shareObj["success"]) {
            shareObj["success"]();
        }
    }
    getSubsidyList(successCallback, failedCallback) {
        successCallback && successCallback({
            "hasSubsidy": false,
            "subsidyLevels": {}
        });
    }
    /**
     * 检查文本是否违规
     * @param content  文字内容
     * @param scene   默认1
     * @param callback   返回 true false   true不违规  false违规
     */
    checkMsgText(content, scene = 1, callback) {
        for (let i = 0; i < 10; i++) {
            console.warn("模拟的  请切换到正式接口");
        }
        let number = Math.random();
        if (number < 0.5) {
            callback && callback(false);
        }
        else {
            callback && callback(true);
        }
    }
    /**
     * 获取是否来自抖音推荐页游戏卡
     * @param callback  true是  false不是
     */
    getIsFromFeedCard(callback) {
        callback && callback(false, {});
    }
    reportFeedCard(card_id, reward_id, canPushTimestamp, successCallback, failedCallback) {
        successCallback && successCallback();
    }
    showPlayBtnWithUnlock(parentNode, inGamePlayCallback, width = 100, height = 100) {
    }
    showUnlockPlayGameList(groupName, inGamePlayCallback) {
    }
    addVictory(lvName) {
    }
    showBackMainPlay(closeCallback) {
    }
    cancelAccount() {
    }
    noGameOverClickStartGame() {
    }
    canUseAdScene() {
        return false;
    }
    showWxLoopInter(on_show, on_hide) {
    }
    getNodeToScreenRect(ccNode) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    showCustomV(customAdOptions) {
    }
    hideCustomV() {
    }
    showCustomH(customAdOptions) {
    }
    hideCustomH() {
    }
    showCustomBanner(customAdOptions) {
    }
    hideCustomBanner() {
    }
    showCustomSingle(customAdOptions) {
    }
    hideCustomSingle() {
    }
}
BaseAd.instance = null;
exports.default = BaseAd;
