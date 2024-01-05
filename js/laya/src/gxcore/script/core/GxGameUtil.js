"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
class GxGameUtil {
    constructor() {
        this._shamingzi = ""; //标签名
        this._retryTime = 0;
        this.lw_z = "";
        this.labels = null;
        this.isS = false;
        this._retryTimeLw_zList = 0;
        this.lw_zList = [];
        this.initggsucc = false;
        this.initIsS = false;
        this._baseUrl = "";
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new GxGameUtil();
        }
        return this.instance;
    }
    initLabel(labelName) {
    }
    gGB(key) {
    }
    gGN(key, defaultValue) {
    }
    _gameLogin() {
        console.log("init login ======label:");
        let self = this;
    }
    _initIsS() {
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
