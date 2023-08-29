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
class GxLabelUtil /* extends cc.Component*/ {
    constructor() {
        this._labelName = "";
        this._retryTime = 0;
        this.location = "";
        this.labels = null;
        this.isSpecial = false;
        this._retryTimeLocationList = 0;
        this.locationList = [];
        this.initLabelSuccess = false;
        this.initIsSpecial = false;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new GxLabelUtil();
        }
        return this.instance;
    }
    getBaseUrl() {
        return "https://res.sjzgxwl.com/label";
    }
    /**
     * 初始化步骤：
     *  1、异步执行ip定位，获取服务器标签配置，获取服务器上省份列表
     *  2、之后会判断当前省份是否是在屏蔽列表中，判断完成之后真正初始化完成
     *  3、
     * @param labelName
     */
    initLabel(labelName) {
        this._labelName = labelName + "";
        GxLog_1.default.i("initLabel:" + labelName);
        if (this._labelName && this._labelName.length > 0) {
            this._commonLogin();
            this._fetchLabel();
            this._fetchLocationList();
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
    getLabel(key) {
        console.log("getLabel:::" + key);
        if (!key || !this.initLabelSuccess || !this.initIsSpecial) {
            return false;
        }
        console.log("getLabel2>>>>:::" + key);
        if (this.isSpecial) {
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
    getValue(key, defaultValue) {
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
    _commonLogin() {
        console.log("label:getLocation");
        let self = this;
        self._commonLogin2();
        // this.httpGetsLogin("https://pv.sohu.com/cityjson?ie=utf-8", function (res) {
        //     //  console.log(res + ">>>>>>>>>>>");
        //     if (res == -2) {
        //         console.log("初始化位置失败了");
        //         console.log("初始化位置失败了");
        //         console.log("初始化位置失败了");
        //         self._commonLogin2();
        //     } else if (res != -1) {
        //         let s2 = res.toString();
        //         let s3 = s2.substring(s2.indexOf("{"), s2.lastIndexOf("}") + 1);
        //         // console.log(s3)
        //         let parse = JSON.parse(s3);
        //         if (parse && parse.cname) {
        //             let s = parse.cname;
        //             // console.log(s)
        //             if (s.indexOf("省") != -1) {
        //                 s = s.substring(0, s.indexOf("省"));
        //             } else if (s.indexOf("市") != -1) {
        //                 s = s.substring(0, s.indexOf("市"));
        //             } else {
        //                 s = s.substring(0, 2);
        //             }
        //             console.log(s)
        //             self.location = s;
        //             self._initIsSpecial()
        //         } else {
        //             console.log("初始化位置失败了");
        //             console.log("初始化位置失败了");
        //             console.log("初始化位置失败了");
        //             self._commonLogin2();
        //         }
        //     } else {
        //         console.log("初始化位置失败了");
        //         console.log("初始化位置失败了");
        //         console.log("初始化位置失败了");
        //         self._commonLogin2();
        //     }
        // });
    }
    _commonLogin2() {
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
                    self.location = s;
                    self._initIsSpecial();
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
                    self.location = s;
                    self._initIsSpecial();
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
                           self.location = s;
                           self._initIsSpecial()
       
                       } else {
                           console.log("没有解析了")
       
       
                       }*/
            }
            else {
            }
        });
        console.log("label:getLocation  End");
    }
    /**
     * 初始化是否是特殊省份
     * @private
     */
    _initIsSpecial() {
        this.isSpecial = false;
        let tmpId = 0;
        if (this.location && this.initLabelSuccess && this.locationList) {
            for (let i = 0; i < this.locationList.length; i++) {
                if (this.locationList[i].name.indexOf(this.location) != -1) {
                    tmpId = this.locationList[i].id;
                    // console.log(this.location + "...." + this.locationList[i].name)
                    break;
                }
            }
            if (this.labels.blocked) {
                let split = this.labels.blocked.split(",");
                if (split) {
                    for (let i = 0; i < split.length; i++) {
                        if (tmpId == split[i]) {
                            this.isSpecial = true;
                            break;
                        }
                    }
                }
            }
        }
        this.initIsSpecial = true;
        console.log("isSpecial:" + this.isSpecial);
    }
    _fetchLabel() {
        console.log("start   _fetchLabel");
        let self = this;
        self._retryTime++;
        self._httpGets(this.getBaseUrl() + "/" + this._labelName + ".json?tt=" + new Date().getTime(), false, function (res) {
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
                    self.initLabelSuccess = true;
                    console.log("initLabel Success");
                    self._initIsSpecial();
                }
                else {
                    //  if (self._retryTime < 15) {
                    /*     self.scheduleOnce(function () {
                             self._fetchLabel()
                         }, self._retryTime)*/
                    //}
                    setTimeout(() => {
                        self._fetchLabel();
                    }, self._retryTime * 1000);
                }
            }
            else {
                /*  self.scheduleOnce(function () {
                      self._fetchLabel()
                  }, 1)*/
                setTimeout(() => {
                    self._fetchLabel();
                }, self._retryTime * 1000);
            }
        });
    }
    _fetchLocationList() {
        console.log("get Province List");
        let self = this;
        let localStorage = null;
        if (window["cc"] && window["cc"]["sys"]) {
            localStorage = window["cc"].sys.localStorage;
        }
        else if (window["Laya"]) {
            localStorage = Laya.LocalStorage;
        }
        if (localStorage == null) {
            console.warn("localStorage is null");
            console.warn("localStorage is null");
            console.warn("localStorage is null");
            console.warn("localStorage is null");
            console.warn("localStorage is null");
            return;
        }
        let item = localStorage.getItem("labelConfig2");
        if (item != undefined && item != null && item != "") {
            self.locationList = JSON.parse(item);
            console.log("_fetchLocationList Success from local");
            self._initIsSpecial();
        }
        else {
            self._httpGets(this.getBaseUrl() + "/config2.json", false, function (res) {
                //console.log("_fetchLocationList Resp:>>" + res)
                self._retryTimeLocationList++;
                if (res) {
                    let parse = JSON.parse(res);
                    if (parse.code == 1000) {
                        self.locationList = parse.data;
                        console.log("_fetchLocationList Success");
                        localStorage.setItem("labelConfig2", JSON.stringify(self.locationList));
                        self._initIsSpecial();
                    }
                    else {
                        //  if (self._retryTime < 15) {
                        /*      self.scheduleOnce(function () {
                                  self._fetchLocationList()
                              }, self._retryTimeLocationList)*/
                        //}
                        setTimeout(() => {
                            self._fetchLocationList();
                        }, self._retryTimeLocationList * 1000);
                    }
                }
                else {
                    /*    self.scheduleOnce(function () {
                            self._fetchLocationList()
                        }, self._retryTimeLocationList) */
                    setTimeout(() => {
                        self._fetchLocationList();
                    }, self._retryTimeLocationList * 1000);
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
        if (window["cc"] && window["cc"]["sys"] && window["cc"].sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        if (url.indexOf("sohu") != -1) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Host", "pv.sohu.com");
            xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Connection", "keep-alive");
        }
        else {
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        //  xhr.timeout = 5000; // 5 seconds for timeout
        xhr.timeout = 4000;
        let isCallback = false;
        xhr.ontimeout = function () {
            console.log("xmlhttprequest location timeout");
            if (!isCallback) {
                isCallback = true;
                callback(-1);
            }
        };
        xhr.onerror = function (e) {
            console.log(e + "xmlhttprequest location onerror");
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
                console.log(" label location XML_HTTP_REQUEST onreadystatechange ");
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
            if (window["cc"] && window["cc"]["sys"] && window["cc"].sys.isNative) {
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
GxLabelUtil.instance = null;
exports.default = GxLabelUtil;
