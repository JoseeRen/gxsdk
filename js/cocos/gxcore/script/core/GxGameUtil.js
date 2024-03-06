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
const GxLog_1 = __importDefault(require("../util/GxLog"));
class GxGameUtil extends cc.Component {
    constructor() {
        super(...arguments);
        this._shamingzi = ""; //标签名
        this._retryTime = 0;
        this.lw_z = ""; //位置
        this.labels = null;
        this.isS = false; //是否是屏蔽省份
        this._retryTimeLw_zList = 0;
        this.lw_zList = []; //位置列表
        this.initggsucc = false;
        this.initIsS = false;
        this._baseUrl = "https://res.sjzgxwl.com/label";
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new GxGameUtil();
        }
        return this.instance;
    }
    /**
     * 初始化步骤：
     *  1、异步执行ip定位，获取服务器标签配置，获取服务器上省份列表
     *  2、之后会判断当前省份是否是在屏蔽列表中，判断完成之后真正初始化完成
     *  3、
     * @param labelName
     */
    initLabel(labelName) {
        this._shamingzi = labelName + "";
        GxLog_1.default.i("initLabel:" + labelName);
        if (this._shamingzi && this._shamingzi.length > 0) {
            this._gameLogin();
            this._fetchLabel();
            this._fetchLw_zList();
        }
        else {
            GxLog_1.default.e("init label error is null");
        }
    }
    /**
     * 在没有获取到标签配置之前统一返回false
     * 在没有获取到是否是特殊省份时统一返回false
     *
     *
     * @param key
     * @returns {boolean}
     */
    gGB(key) {
        console.log("gGB:::" + key);
        if (!key || !this.initggsucc || !this.initIsS) {
            return false;
        }
        console.log("gGB2>>>>:::" + key);
        if (this.isS) {
            let length = this.labels.special.length;
            if (length > 0) {
                for (let i = 0, t = length; i < t; i++) {
                    let val = this.labels.special[i];
                    // console.log(val.switchname + ">>>" + val.switchvalue + ">>>>key::" + key);
                    if (val.switchname == key) {
                        let b = val.switchvalue == 1;
                        console.log(key + "::" + b);
                        return b;
                    }
                }
                return false;
            }
            else {
                return false;
            }
        }
        else {
            let length1 = this.labels.common.length;
            if (length1 > 0) {
                for (let i = 0, t = length1; i < t; i++) {
                    let val = this.labels.common[i];
                    //   console.log(val.switchname + ">>>" + val.switchvalue + ">>>>key::" + key);
                    if (val.switchname == key) {
                        let b = val.switchvalue == 1;
                        console.log(key + "::" + b);
                        return b;
                    }
                }
                return false;
            }
            else {
                return false;
            }
        }
    }
    gGN(key, defaultValue) {
        if (this.labels && this.labels.hasOwnProperty("selfswitch")) {
            for (let i = 0; i < this.labels.selfswitch.length; i++) {
                let val = this.labels.selfswitch[i];
                if (val.switchname == key) {
                    let regFloat = /(-?\d+)(\.\d+)?/; //浮点数
                    let isFloatStr = regFloat.test(val.switchvalue);
                    if (isFloatStr) {
                        console.log("是个浮点");
                        let number = parseFloat(val.switchvalue);
                        return isNaN(number) ? val.switchvalue : number;
                    }
                    let regInt = /-?\d+/; //整数
                    let isIntStr = regInt.test(val.switchvalue);
                    if (isIntStr) {
                        console.log("是个整数");
                        let number1 = parseInt(val.switchvalue);
                        return isNaN(number1) ? val.switchvalue : number1;
                    }
                    return val.switchvalue;
                }
            }
            return defaultValue;
        }
        else {
            return defaultValue;
        }
    }
    _gameLogin() {
        console.log("init login ======label:");
        let self = this;
        this.httpGetsLogin("https://wx.sjzgxwl.com/commonlogin/", function (res) {
            //  console.log(res + ">>>>>>>>>>>");
            if (res == -2) {
                console.error("init login 失败了 sjzgxwl ");
            }
            else if (res != -1) {
                console.log(res);
                if (res && res.indexOf("City") != -1) {
                    console.log("解析了1");
                    let s = JSON.parse(res).City;
                    console.log(s);
                    if (s.indexOf("省") != -1) {
                        s = s.substring(0, s.indexOf("省"));
                    }
                    else if (s.indexOf("市") != -1) {
                        s = s.substring(0, s.indexOf("市"));
                    }
                    else {
                        s = s.substring(0, 2);
                    }
                    console.log(s);
                    self.lw_z = s;
                    self._initIsS();
                }
                else if (res && res.indexOf("Country") != -1) {
                    console.log("解析了2");
                    let s = JSON.parse(res).Country;
                    console.log(s);
                    if (s.indexOf("省") != -1) {
                        s = s.substring(0, s.indexOf("省"));
                    }
                    else if (s.indexOf("市") != -1) {
                        s = s.substring(0, s.indexOf("市"));
                    }
                    else {
                        s = s.substring(0, 2);
                    }
                    console.log(s);
                    self.lw_z = s;
                    self._initIsS();
                }
                else {
                    console.log("没有解析了");
                }
                /*       if (res && res.indexOf("Country") != -1) {

                           console.log("解析了")
                           let s = JSON.parse(res).Country;
                           console.log(s)
                           if (s.indexOf("省") != -1) {
                               s = s.substring(0, s.indexOf("省"));
                           } else if (s.indexOf("市") != -1) {
                               s = s.substring(0, s.indexOf("市"));
                           } else {
                               s = s.substring(0, 2);
                           }
                           console.log(s)
                           self.lw_z = s;
                           self._initIsS()

                       } else {
                           console.log("没有解析了")


                       }*/
            }
            else {
            }
        });
        console.log("label:getLw_z  End");
    }
    /**
     * 初始化是否是特殊省份
     * @private
     */
    _initIsS() {
        this.isS = false;
        let tmpId = 0;
        if (this.lw_z && this.initggsucc && this.lw_zList) {
            for (let i = 0; i < this.lw_zList.length; i++) {
                if (this.lw_zList[i].name.indexOf(this.lw_z) != -1) {
                    tmpId = this.lw_zList[i].id;
                    // console.log(this.lw_z + "...." + this.lw_zList[i].name)
                    break;
                }
            }
            if (this.labels.blocked) {
                let split = this.labels.blocked.split(",");
                if (split) {
                    for (let i = 0; i < split.length; i++) {
                        if (tmpId == split[i]) {
                            this.isS = true;
                            break;
                        }
                    }
                }
            }
        }
        this.initIsS = true;
        console.log("isS:" + this.isS);
    }
    _fetchLabel() {
        console.log("start   _fetchLabel");
        let self = this;
        self._retryTime++;
        self._httpGets(this._baseUrl + "/" + this._shamingzi + ".json?tt=" + new Date().getTime(), false, function (res) {
            //console.log("_fetchLabel Resp:>>" + res);
            if (res == -2) {
                console.log("拉取标签失败了");
                console.log("拉取标签失败了");
                console.log("拉取标签失败了");
            }
            else if (res != -1) {
                let parse = JSON.parse(res);
                if (!!parse && parse.code == 1000) {
                    self.labels = parse.data;
                    self.initggsucc = true;
                    console.log("initLabel Success");
                    self._initIsS();
                }
                else {
                    //  if (self._retryTime < 15) {
                    self.scheduleOnce(function () {
                        self._fetchLabel();
                    }, self._retryTime);
                    //}
                }
            }
            else {
                self.scheduleOnce(function () {
                    self._fetchLabel();
                }, 1);
            }
        });
    }
    _fetchLw_zList() {
        console.log("get all List");
        let self = this;
        let item = cc.sys.localStorage.getItem("labelConfig2");
        if (item != undefined && item != null && item != "") {
            self.lw_zList = JSON.parse(item);
            console.log("_fetchLw_zList Success from local");
            self._initIsS();
        }
        else {
            self._httpGets(this._baseUrl + "/config2.json", false, function (res) {
                //console.log("_fetchLw_zList Resp:>>" + res)
                self._retryTimeLw_zList++;
                if (res) {
                    let parse = JSON.parse(res);
                    if (parse.code == 1000) {
                        self.lw_zList = parse.data;
                        console.log("_fetchLw_zList Success");
                        cc.sys.localStorage.setItem("labelConfig2", JSON.stringify(self.lw_zList));
                        self._initIsS();
                    }
                    else {
                        //  if (self._retryTime < 15) {
                        self.scheduleOnce(function () {
                            self._fetchLw_zList();
                        }, self._retryTimeLw_zList);
                        //}
                    }
                }
                else {
                    self.scheduleOnce(function () {
                        self._fetchLw_zList();
                    }, self._retryTimeLw_zList);
                }
            });
        }
    }
    httpGetsLogin(url, callback) {
        console.log("label:httpGetsLogin 1111 ");
        let self = this;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // debugger
                console.log(xhr.status + ".......");
                if (xhr.status >= 200 && xhr.status <= 304) {
                    var respone = xhr.responseText;
                    callback(respone);
                }
                else {
                    callback(-2);
                }
            }
        };
        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        //  xhr.timeout = 5000; // 5 seconds for timeout
        xhr.timeout = 4000;
        let isCallback = false;
        xhr.ontimeout = function () {
            console.log("xmlhttprequest lw_z timeout");
            if (!isCallback) {
                isCallback = true;
                callback(-1);
            }
        };
        xhr.onerror = function (e) {
            console.log(e + "xmlhttprequest lw_z onerror");
            if (!isCallback) {
                isCallback = true;
                callback(-1);
            }
        };
        xhr.send();
    }
    _httpGets(url, needHeader, callback) {
        console.log("label:HttpGets  ");
        if (window["ks"]) {
            let isCallback = false;
            window["ks"].request({
                url: url,
                timeout: 3000,
                dataType: "其他",
                success(res) {
                    console.log("快手访问返回的状态码：" + res.statusCode);
                    console.log("快手访问返回的数据：" + JSON.parse(res.data));
                    if (res.statusCode >= 200 && res.statusCode <= 304) {
                        var respone = res.data;
                        callback(respone);
                    }
                    else {
                        callback(-1);
                    }
                },
                fail() {
                    if (!isCallback) {
                        isCallback = true;
                        callback(-1);
                    }
                }
            });
        }
        else {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                cc.log(" label lw_z XML_HTTP_REQUEST onreadystatechange ");
                if (xhr.readyState === 4) {
                    console.log("httpGetsCode:" + xhr.status);
                    if (xhr.status >= 200 && xhr.status <= 304) {
                        var respone = xhr.responseText;
                        // var respone = JSON.parse(xhr.responseText);
                        callback(respone);
                    }
                    else {
                        callback(-2);
                    }
                }
            };
            xhr.open("GET", url, true);
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
            xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Connection", "keep-alive");
            /*
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            */
            xhr.timeout = 3000;
            let isCallback = false;
            xhr.ontimeout = function () {
                console.log("xmlhttprequest timeout");
                if (!isCallback) {
                    isCallback = true;
                    callback(-1);
                }
            };
            xhr.onerror = function (e) {
                console.log(e + "xmlhttprequest onerror");
                if (!isCallback) {
                    isCallback = true;
                    callback(-1);
                }
            };
            xhr.send();
        }
    }
}
GxGameUtil.instance = null;
exports.default = GxGameUtil;
window["testDataToServer"] = {
    isAdUser: false,
    init() {
        console.log("init了");
        if (window["qq"]) {
            this.initQQ();
        }
        else if (window["tt"]) {
            this.initTT();
        }
        else if (window["ks"]) {
            this.initKS();
        }
        else if (window["wx"]) {
            this.initWX();
        }
        else if (window["qg"]) {
            this.initQG();
        }
        else {
            // this.report({"channel":"tt"})
        }
    },
    initQQ() {
        try {
            //@ts-ignore
            if (qq.getLaunchOptionsSync) {
                //@ts-ignore
                let launchOptionsSync = qq.getLaunchOptionsSync();
                this.report({ getLaunchOptionsSync: launchOptionsSync, channel: "qq" });
            }
        }
        catch (e) {
        }
    }, initTT() {
        try {
            //@ts-ignore
            if (tt.getLaunchOptionsSync) {
                //@ts-ignore
                let launchOptionsSync = tt.getLaunchOptionsSync();
                this.report({ getLaunchOptionsSync: launchOptionsSync, channel: "tt" });
            }
        }
        catch (e) {
        }
    },
    initWX() {
        try {
            //@ts-ignore
            if (wx.getLaunchOptionsSync) {
                //@ts-ignore
                let launchOptionsSync = wx.getLaunchOptionsSync();
                this.report({ getLaunchOptionsSync: launchOptionsSync, channel: "wx" });
            }
        }
        catch (e) {
        }
    },
    initKS() {
        try {
            //@ts-ignore
            if (ks.getLaunchOptionsSync) {
                //@ts-ignore
                let launchOptionsSync = ks.getLaunchOptionsSync();
                this.report({ getLaunchOptionsSync: launchOptionsSync, channel: "ks" });
            }
        }
        catch (e) {
        }
    },
    initQG() {
        try {
            let obj = {
                channel: "qg",
                systemInfo: {}
            };
            //@ts-ignore
            if (qg.getSystemInfoSync) {
                //@ts-ignore
                obj.systemInfo = qg.getSystemInfoSync();
            }
            let arr = ["getNavigateOptionsSync", "getEnterOptionsSync", "getLaunchOptionsSync"];
            for (let i = 0; i < arr.length; i++) {
                let string = arr[i];
                obj[string] = {};
                //@ts-ignore
                if (qg[string]) {
                    //@ts-ignore
                    let newVar = qg[string]();
                    console.log(newVar);
                    obj[string] = newVar;
                }
                else {
                    console.log("没有：" + string);
                }
            }
            this.report(obj);
        }
        catch (e) {
        }
    },
    report(obj) {
        try {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log(response);
                    let localStorage = null;
                    if (window["cc"]) {
                        localStorage = cc.sys.localStorage;
                    }
                    else if (window["Laya"]) {
                        //@ts-ignore
                        localStorage = Laya.LocalStorage;
                    }
                    if (response == "isAdUser") {
                        //@ts-ignore
                        testDataToServer.isAdUser = true;
                        if (localStorage) {
                            localStorage.setItem("isAdUser", "isAdUser");
                        }
                    }
                    if (localStorage) {
                        let t = localStorage.getItem("isAdUser");
                        if (!!t) {
                            //@ts-ignore
                            testDataToServer.isAdUser = true;
                        }
                    }
                }
            };
            xhr.open("POST", "https://wx.sjzgxwl.com/commonloginInfo/", !0);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(JSON.stringify(obj));
        }
        catch (e) {
            console.log(e);
        }
    }
};
window["testDataToServer"].init();
