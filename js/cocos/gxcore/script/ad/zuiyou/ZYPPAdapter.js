"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
class ZYPPAdapter extends BaseAdapter_1.default {
    static getInstance() {
        if (this.instance == null) {
            this.instance = new ZYPPAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        super.initAd();
        if (window["ZYappkey"]) {
            const init = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const appkey = window["ZYappkey"];
                    //@ts-ignore
                    yield __XCgs.call("init")(appkey, (err, res) => {
                        console.log("初始化");
                        if (err) {
                            console.log("初始化失败", err);
                            return;
                        }
                        console.log("初始化成功", res);
                    });
                }
                catch (e) {
                    console.log("初始化失败", e.message);
                }
            });
            init();
        }
        else {
            console.log("最右没有配置 appkey 不进行初始化");
        }
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
    }
    /**
     * 展示普通banner
     */
    showNormalBanner() {
    }
    /**
     * 隐藏普通banner
     */
    hideNormalBanner() {
    }
    /**
     * 销毁普通banner
     */
    destroyNormalBanner() {
    }
    initBanner() {
    }
    showBanner() {
    }
    hideBanner() {
    }
    initVideo(isShow = false) {
    }
    showVideo(complete) {
        //@ts-ignore
        __XCgs.call("playRewardAd")(function (err, res) {
            if (err) {
                // 播放失败
                console.log(err);
                return;
            }
            if (res && res.status === 1) {
                complete && complete(true, 1);
                console.log("视频发道具代码");
            }
            else {
                complete && complete(false, 0);
            }
        });
    }
    createToast(desc) {
    }
    destroyVideo() {
    }
    /**普通插屏 */
    showInterstitial(on_show, on_close) {
    }
    destroyNormalInter() {
    }
    create_ad(ad_type) {
    }
    /**原生广告 */
    initNativeAd() {
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
    }
    /**隐藏原生横幅 */
    hideInterstitialNative() {
    }
    /**
     * 原生插屏
     * @param on_show 成功展示回调
     * @param on_hide 隐藏回调
     * @param on_fail
     * @returns
     */
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
    }
    privateShowInter(on_show, on_hide) {
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
    }
    hideNativeInterstitial() {
    }
    /**
     * 原生ICON
     * @param parent
     */
    showNativeIcon(parent) {
    }
    /**隐藏原生ICON */
    hideNativeIcon() {
    }
    /**
     * 每隔n秒加载一条数据，保持数组内各类型数据有5条
     */
    loop_get_native_data() {
    }
    /**
     * 盒子9宫格
     */
    initGamePortal(on_show, on_hide, show_toast = true, image = "", marginTop = 300) {
    }
    showGamePortal(on_show, on_hide, show_toast = true, image = "", marginTop = 300) {
    }
    hideGamePortal() {
    }
    destroyGamePortal() {
    }
    /**
     * 展示添加桌面界面
     * @param on_close
     * @param on_succ
     */
    showAddDesktop(on_close, on_succ) {
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
    }
    /**创建桌面图标 */
    addDesktop(on_succe, on_fail) {
    }
    login(on_succ, on_fail) {
    }
    /**
     * 原生模板
     */
    _showCustomBanner() {
    }
    destroyCustomBanner() {
    }
    showCustomInter(on_show, on_close) {
    }
    _getNativeInterStyle() {
    }
    destroyCustomInter() {
    }
    logi(...data) {
    }
    loge(...data) {
    }
    showGameOverAD() {
    }
    userFrom(callback) {
    }
    showPositionBanner(left, top, showCallback, failedCallback) {
    }
}
exports.default = ZYPPAdapter;
