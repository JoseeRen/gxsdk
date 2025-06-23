"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GxChecker {
    constructor() {
        this.canSend = false;
        this.addListener = false;
        this.msgList = [];
        this.parentDomain = "";
    }
    static getInstance() {
        if (this._instance == null) {
            this._instance = new GxChecker();
        }
        return this._instance;
    }
    init() {
        if (window.parent && window.parent.postMessage && window["addEventListener"]) {
            this.addListener = true;
            console.log("开始监听");
            window.addEventListener("message", (msg) => {
                let data = msg.data;
                if (data.msg == "check") {
                    this.parentDomain = data.data.url;
                    if (!this.canSend) {
                        this.canSend = true;
                        for (let i = 0; i < this.msgList.length; i++) {
                            console.log("发过去了");
                            this.postMessageToParent(this.msgList[i]);
                        }
                    }
                    this.postMessageToParent({ msg: "check", type: "started", data: {} });
                    window.onerror = (message, source, lineno, colno, error) => {
                        this.postMessageToParent({
                            msg: "check",
                            type: GxChecker.MsgType.codeError,
                            data: { message, source, lineno, colno, error }
                        });
                    };
                }
                // console.log("iframe:" + data)
            });
        }
        else {
            console.log("不能监听");
        }
    }
    postMessageToParent(msg) {
        if (this.addListener) {
            if (this.canSend) {
                window.parent.postMessage(msg /*JSON.stringify(msg)*/, this.parentDomain /*"*"*/);
            }
            else {
                console.log("push了一个");
                console.log(msg);
                this.msgList.push(msg);
            }
            if (this.msgList.length >= 15) {
                console.error("消息太多清除了");
                this.addListener = false;
                this.msgList = [];
            }
        }
        else {
            // console.log("不能添加")
        }
    }
    check(MsgType, data = {}) {
        this.postMessageToParent({ msg: "check", type: MsgType, data });
    }
}
GxChecker.MsgType = {
    jkzg: "jkzg", /*健康忠告*/
    initSDK: "initSDK",
    lvStart: "lvStart",
    lvEnd: "lvEnd",
    ad_video: "ad_video",
    ad_inter: "ad_inter",
    ad_otherInter: "ad_otherInter",
    ad_banner_show: "ad_banner_show",
    ad_banner_hide: "ad_banner_hide",
    event: "event", /*自定义事件*/
    btn_event: "btn_event", /*按钮点击事件*/
    showGameAgeBtn: "showGameAgeBtn",
    showGamePrivacy: "showGamePrivacy",
    showGamePrivacyBtn: "showGamePrivacyBtn", /*隐私政策按钮*/
    showUserPrivacyBtn: "showUserPrivacyBtn", /*用户协议 按钮  qq*/
    showAddDesktopBtn: "showAddDesktopBtn",
    showMoreGameBtn: "showMoreGameBtn",
    showCancelAccountBtn: "showCancelAccountBtn", /*华为注销账户*/
    codeError: "codeError", /*代码异常*/
};
exports.default = GxChecker;
