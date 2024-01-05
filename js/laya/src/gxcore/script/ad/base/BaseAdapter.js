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
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const GxEnum_1 = require("../../core/GxEnum");
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxLog_1 = __importDefault(require("../../util/GxLog"));
const gx_ui_authorize_1 = __importDefault(require("../../ui/gx_ui_authorize"));
const gx_ui_privacy_1 = __importDefault(require("../../ui/gx_ui_privacy"));
const gx_ui_gameover_ad_1 = __importDefault(require("../../ui/gx_ui_gameover_ad"));
const gx_ui_toast_1 = __importDefault(require("../../ui/gx_ui_toast"));
const gx_ui_gamebox_1 = __importDefault(require("../../ui/gx_ui_gamebox"));
const gx_ui_crazypoint_1 = __importDefault(require("../../ui/gx_ui_crazypoint"));
const TDSDK_1 = __importDefault(require("../../td/TDSDK"));
const GxChecker_1 = __importDefault(require("../../GxChecker"));
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
        this.gameOverAdView = null;
        this.gameBoxView = null;
        this.crazyPointView = null;
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
        TDSDK_1.default.getInstance().initApp(info.package, info.name, info.versionName, info.versionCode);
    }
    showAuthorize(on_agree, on_refuse) {
        if (!this.authorizeView || this.authorizeView.parent == null) {
            this.authorizeView = new gx_ui_authorize_1.default();
            this.authorizeView.show(on_agree, on_refuse);
        }
        else {
            on_refuse && on_refuse();
        }
        /*
                ResUtil.loadPrefab("gx/prefab/authorize", (err, prefab) => {
                    if (err) {
                        on_refuse()
                        return;
                    }
                    if (this.authorizeView == null || !cc.isValid(this.authorizeView.node, true)) {
                        let node = cc.instantiate(prefab);
                        this.authorizeView = node.getComponent('Gx_authorize');
                        this.authorizeView.show(on_agree, on_refuse);
                    }

                })
        */
    }
    /*    type {
        user = 'user',
        privacy = 'privacy'
    }*/
    showPrivacy(type = "privacy") {
        if (!this.privacyView || this.privacyView.parent == null) {
            this.privacyView = new gx_ui_privacy_1.default();
            this.privacyView.show(type);
        }
        /*        ResUtil.loadPrefab("gx/prefab/privacy", (err, prefab) => {
                    if (this.privacyView == null || !cc.isValid(this.privacyView.node, true)) {
                        let node = cc.instantiate(prefab);
                        this.privacyView = node.getComponent('Gx_privacy');
                        this.privacyView.show(type);
                    }

                })*/
    }
    /**qq常量策略 结束游戏  ov结束游戏的全屏点击*/
    showGameOverAD() {
        if ( /*GxConstant.IS_OPPO_GAME || GxConstant.IS_VIVO_GAME ||*/GxConstant_1.default.IS_WEB_DEBUG) {
            if (!this.gameOverAdView || this.gameOverAdView.parent == null) {
                this.gameOverAdView = new gx_ui_gameover_ad_1.default();
                this.gameOverAdView.show();
            }
            /*  ResUtil.loadPrefab("gx/prefab/GameOverAD", (err, prefab) => {
                  if (this.privacyView == null || !cc.isValid(this.privacyView.node, true)) {
                      let node = cc.instantiate(prefab);
                      this.privacyView = node.getComponent('Gx_GameOverAD');
                      this.privacyView.show();
                  }
              })*/
        }
    }
    /////////////////////////public/////////////////////////
    canIn() {
        /*
                if (GxConstant.IS_OPPO_GAME) {

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
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.ad_banner_show);
    }
    /**隐藏Banner */
    hideBanner() {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.ad_banner_hide);
        if (this.bannerTimer)
            this.bannerTimer.clear();
        if (this.bannerDelayTimer)
            this.bannerDelayTimer.clear();
        if (this.bannerNode && this.bannerNode !== undefined && !this.bannerNode.destroyed) {
            this.bannerNode.destroy();
        }
        this.bannerNode = null;
    }
    /**
     * 激励视频
     * @param complete 参数表示是否完成
     */
    showVideo(complete, flag = "") {
        this.curVideoFlag = flag;
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.ad_video, { flag });
        if (!!flag) {
            GxGame_1.default.gameEvent("reward_" + flag);
        }
        else {
            console.warn("视频点没有加flag");
        }
        complete && complete(true);
    }
    _videoCompleteEvent() {
        GxGame_1.default.gameEvent("reward_complete_" + this.curVideoFlag);
    }
    _videoErrorEvent() {
        GxGame_1.default.gameEvent("reward_error_" + this.curVideoFlag);
    }
    _videoCloseEvent() {
        GxGame_1.default.gameEvent("reward_close_" + this.curVideoFlag);
    }
    /**
     * 上报原生广告曝光
     * @param native_data
     */
    reportAdShow(native_data) {
        if (!native_data || native_data === undefined)
            return;
        native_data.ad && native_data.ad.reportAdShow({
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
        native_data.ad && native_data.ad.reportAdClick({
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
                    return cur_data_cache.length > 0 ? cur_data_cache[GxUtils_1.default.randomInt(0, cur_data_cache.length - 1)] : null;
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
                if (this._native_custom_banner_cache && this._native_custom_banner_cache.length > 0) {
                    return this._native_custom_banner_cache.shift();
                }
                return null;
            }
            else {
                if (this._native_custom_inter_cache && this._native_custom_inter_cache.length > 0) {
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
        if (this.innerInter && this.innerInter !== undefined && !this.innerInter.destroyed) {
            this.innerInter.destroy();
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
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.ad_inter, {});
    }
    /**
     * 原生插屏  vivo专用的  有switch控制
     * @param on_show 成功展示回调
     * @param on_hide 隐藏回调
     * @param on_fail deprecated
     * @returns
     */
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        GxChecker_1.default.getInstance().check(GxChecker_1.default.MsgType.ad_otherInter, {});
    }
    /**隐藏原生插屏 */
    hideNativeInterstitial() {
        if (this.nativeInter && this.nativeInter !== undefined && !this.nativeInter.destroyed) {
            this.nativeInter.destroy();
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
        if (this.nativeIcon && this.nativeIcon !== undefined && !this.nativeIcon.destroyed) {
            this.nativeIcon.destroy();
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
     * 提示框
     * @param desc
     */
    createToast(desc) {
        if (this.toastView == null || this.toastView.destroyed) {
            this.toastView = new gx_ui_toast_1.default();
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
        if (this.innerInter && this.innerInter.parent) {
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
    ;
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
        if (GxGame_1.default.gGB("crazy") || GxConstant_1.default.IS_WEB_DEBUG) {
            /*   let node = cc.instantiate(GxUtils.getRes('gx/prefab/crazypoint', cc.Prefab));
               let crazyPoint = node.getComponent('Gx_crazypoint');
               node.parent = cc.director.getScene();
               node.zIndex = cc.macro.MAX_ZINDEX - 1;*/
            if (!this.gameBoxView || this.gameBoxView.parent == null) {
                this.crazyPointView = new gx_ui_crazypoint_1.default();
                this.crazyPointView.show(on_show, on_close, on_get, is_banner);
            }
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
            if (!this.gameBoxView || this.gameBoxView.parent == null) {
                this.gameBoxView = new gx_ui_gamebox_1.default();
                this.gameBoxView.show(on_show, on_close, (num) => {
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
            return (new Date()).getTime();
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
            if (this._native_data_cache[i].type == ad_type && this._native_data_cache[i].state != GxEnum_1.ad_native_state.click) {
                ++count;
            }
        }
        return count >= GxGame_1.default.adConfig.nativeAdLimitCount;
    }
    /////////////////////////private/////////////////////////
    _setClickNative(type, cbk, rto = null) {
        /*    if (this.isGameCd ) {
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
}
BaseAd.instance = null;
exports.default = BaseAd;
