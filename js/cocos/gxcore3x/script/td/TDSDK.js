"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
/*Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.default = void 0;
var _system = _interopRequireDefault(require("@system.storage")), _system2 = _interopRequireDefault(require("@system.file")), _system3 = _interopRequireDefault(require("@system.router")), _system4 = _interopRequireDefault(require("@system.app")), _system5 = _interopRequireDefault(require("@system.fetch")), _system6 = _interopRequireDefault(require("@system.device")), _system7 = _interopRequireDefault(require("@system.geolocation")), _system8 = _interopRequireDefault(require("@system.brightness")), _system9 = _interopRequireDefault(require("@system.battery")), _system10 = _interopRequireDefault(require("@system.network")), _TD_quick_config = _interopRequireDefault(require("./TD_quick_config"));
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
    default:
        e
    }
}
function _typeof(e) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    }
          (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    })(e)
}*/
class TDSDK {
    constructor() {
        this.logList = [];
        this.refreshMockDataStatus = 1;
        this.readLastSessionStatus = 1;
        this.refreshSessionStatus = 1;
        this.lastMockData = null;
        this.pageLeaveTimer = null;
        this.heartBeat_timer = null;
        this.fetchList = [];
        this.initTime = (new Date).getTime();
        this.pageEnterTime = (new Date).getTime();
        this.lastPage = null;
        this.from = null;
        this.debug = true;
        this.inited = !1;
        this.needInitEvent = !1;
        this.logPath = "internal://files/tdlog/";
        this.uploadUrl = "https://ap.3edc.cn/q/a/v1";
        this.defaultPageName = "game";
        this.mock_data = {
            action: {},
            device: {
                type: "mobile",
                deviceId: {
                    tid: ""
                },
                hardwareConfig: {
                    brightness: 100,
                    cpu: {
                        coreNum: 4,
                        name: "cpuName"
                    },
                    totalDiskSpace: 100000,
                    manufacture: "manufacture",
                    brand: "brand",
                    model: "model",
                    pixel: "720*1280*1", //pixel
                },
                softwareConfig: {
                    os: "osType",
                    osVersionName: "osVersionName",
                    osVersionCode: "osVersionCode",
                    language: "zh",
                    locale: "CN",
                    platformVersionName: "platformVersionName",
                    platformVersionCode: "platformVersionCode",
                },
                runtimeConfig: {
                    freeDiskSpace: 10000,
                    batteryLevel: 1,
                    batteryState: false
                }
            },
            networks: [{
                    type: "wifi",
                    available: !1,
                    connected: !1
                }, {
                    type: "cellular",
                    available: !1,
                    connected: !1,
                    current: []
                }
            ],
            locations: [{
                    lat: 100,
                    lng: 30
                }],
            appContext: {
                sessionStartTime: 0,
                sessionId: "",
                account: {
                    accountId: "", type: 0
                },
            },
            app: {
                appKey: "",
                channel: "quickapp",
                globalId: "com.package.name",
                displayName: "",
                versionName: "",
                versionCode: "",
                installTime: ""
            },
            sdk: {
                from: 1,
                version: 1,
                minorVersion: 0,
                build: 9,
                platform: "quickapp",
                framework: "quickapp"
            },
            ts: "xxxxx"
        };
    }
    static getInstance() {
        if (this.instance === null || this.instance == undefined) {
            this.instance = new TDSDK();
        }
        return this.instance;
    }
    initApp(packageName, displayName, versionName, versionCode) {
        this.mock_data.app.globalId = packageName;
        this.mock_data.app.displayName = displayName;
        this.mock_data.app.versionName = versionName;
        this.mock_data.app.versionCode = versionCode;
    }
    init(appKey, tdChannel, openId = null) {
        if (!appKey) {
            console.error("td appkey为空   初始化td失败");
            return;
        }
        if (!tdChannel) {
            console.error("td tdChannel为空 初始化td失败");
            return;
        }
        if (!openId) {
            console.warn("td openId为空将默认生成");
        }
        if (this.inited) {
            this.log("init end");
            return;
        }
        this.mock_data.app.appKey = appKey;
        this.mock_data.app.channel = tdChannel;
        this._setInstallTime();
        let isNew = false;
        if (!!openId) {
        }
        else {
            openId = this.getItem("deviceId", "");
            if (!!openId) {
            }
            else {
                openId = this.uuid(32);
                isNew = true;
            }
        }
        this.setItem("deviceId", openId);
        this.defaultPageName = tdChannel;
        this.mock_data.device.deviceId.tid = openId;
        this.log("this.quickInit called ");
        /*1 进游戏初始化 参数 等等
        * 2、读取上次的会话id，如果有上次的会话id   并且有上次的pageEnter的leaveTime  就上报上次玩的时长   leaveTime - sessionStartTime
        * 3、生成并保存本次的会话id  和startTime
        * 4、在上报pageLeave离开时 保存lastPage
        * */
        try {
            this.inited = true;
            this.needInitEvent = true;
            //读取上次保存的数据
            this.readLastSession();
            this._refreshMockData();
            if (this.lastMockData && this.lastMockData.appContext && this.lastMockData.appContext.sessionId && this.lastMockData.appContext.sessionStartTime > 0) {
                let e = this.getItem("lastPage", "");
                if (e) {
                    this.setItem("lastPage", "");
                    e = this._jsonParse(e);
                    this.lastPage = e;
                }
                if (this.lastPage && this.lastPage.leaveTime > 0) {
                    let a = JSON.parse(JSON.stringify(this.lastMockData));
                    let duration = parseInt(((this.lastPage.leaveTime - this.lastMockData.appContext.sessionStartTime) / 1e3) + "");
                    // console.log("上报 上次会话时长：" + duration + "秒")
                    a.action = {
                        domain: "session",
                        name: "end",
                        data: {
                            start: this.lastMockData.appContext.sessionStartTime,
                            duration: duration
                        }
                    };
                    a.ts = (new Date).getTime();
                    let t = [];
                    t.push(a);
                    this.save4Fetch(t);
                }
                else {
                    // console.log("上次lastPage空 或者leaveTime小于等于0")
                }
            }
            else {
                // console.log("没有上次保存的sessionId或者 session开始时间")
            }
            this.startNewSession(true);
            setTimeout(() => {
                this._migrate();
            }, 5e3);
        }
        catch (e) {
            console.log("初始化内容错误~~", e);
        }
        this.updateBasedataInStorage(this.mock_data);
        this.pageEnter(this.defaultPageName);
        /*   if (window["cc"]){
               cc.game.on(cc.game.EVENT_HIDE, () => {
                   console.log("游戏进入后台");
                   this.pageLeave("game")
               }, this);


               cc.game.on(cc.game.EVENT_SHOW, () => {
                   console.log("游戏进入前台");
                   //this.doSomeThing();
                   this.pageEnter("game")

               }, this);
           }else if (window["Laya"]){

           }*/
        /*       let globalEnv = null
               if (window["wx"]) {
                   globalEnv = window["wx"]
               } else if (window["qg"]) {
                   globalEnv = window["qg"]

               }
               if (globalEnv && globalEnv["onShow"] && globalEnv["onHide"]) {

                   globalEnv.onShow(() => {
                       this.pageEnter("game")
                   })
                   globalEnv.onHide(() => {
                       this.pageLeave("game")

                   })
               } else {
                   console.warn("td  环境不支持onShow  onHide")
               }*/
        //保持5秒心跳
        setInterval(() => {
            this.pageLeave(this.defaultPageName);
            setTimeout(() => {
                this.pageEnter(this.defaultPageName);
            }, 10);
        }, 5000);
        setInterval(() => {
            this.reportSession();
        }, 10 * 1000);
    }
    reportSession() {
        if (this.mock_data.appContext.sessionStartTime > 0) {
            let curTime = (new Date).getTime();
            let a = JSON.parse(JSON.stringify(this.mock_data));
            let duration = parseInt(((curTime - this.mock_data.appContext.sessionStartTime) / 1e3) + "");
            // console.log("本次会话时长：" + duration + "秒")
            a.action = {
                domain: "session",
                name: "end",
                data: {
                    start: this.mock_data.appContext.sessionStartTime,
                    duration: duration
                }
            };
            a.ts = curTime;
            let t = [];
            t.push(a);
            this.save4Fetch(t);
            this.startNewSession(false);
        }
    }
    random() {
        for (var e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", t = e.length, a = "", s = 0; s < 12; s++)
            a += e.charAt(Math.floor(Math.random() * t));
        return a;
    }
    uuid(e) {
        for (var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), a = [], s = t.length, n = 0; n < e; n++)
            a[n] = t[0 | Math.random() * s];
        return a.join("");
    }
    setItem(key, value) {
        key = "td_" + key;
        if (window["cc"]) {
            cc_1.sys.localStorage.setItem(key, value);
        }
        else if (window["Laya"]) {
            // @ts-ignore
            Laya.LocalStorage.setItem(key, value);
        }
        else {
            console.warn("td保存失败");
        }
    }
    getItem(key, defaultValue = "") {
        key = "td_" + key;
        let item = "";
        if (window["cc"]) {
            item = cc_1.sys.localStorage.getItem(key);
        }
        else if (window["Laya"]) {
            // @ts-ignore
            item = Laya.LocalStorage.getItem(key);
        }
        else {
            console.warn("td获取失败");
        }
        if (!!item) {
            return item;
        }
        return defaultValue;
    }
    save4Fetch(e) {
        // console.log("saveFile了", e)
        e && "object" == typeof (e) && (Array.isArray(e) || (e = [e]), e = JSON.stringify(e), this.logList.push({
            uri: this.logPath + "event_" + (new Date).getTime() + Math.random(),
            text: e
        }));
    }
    fetch() {
        this.log("tdsdk-fetching");
        let count = this.logList.length;
        while (count > 0) {
            let a = this.logList.shift();
            count--;
            var xhr = new XMLHttpRequest();
            //使用HTTP POST请求与服务器交互数据
            xhr.open("POST", this.uploadUrl, true);
            //设置发送数据的请求格式
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    //根据服务器的响应内容格式处理响应结果
                    if (xhr.getResponseHeader('content-type') === 'application/json') {
                        var result = JSON.parse(xhr.responseText);
                        //根据返回结果判断验证码是否正确
                        /* if (result.code === -1) {
                             alert('验证码错误');
                         }*/
                    }
                    else {
                        console.log(xhr.responseText);
                    }
                }
            };
            // xhr.send(JSON.stringify(a));
            xhr.send(a.text);
        }
    }
    heartBeat() {
        // console.log("开始心跳")
        clearInterval(this.heartBeat_timer);
        this.fetch();
        this.heartBeat_timer = setInterval(() => {
            this.fetch();
        }, 3000);
    }
    _jsonParse(e) {
        var t = null;
        try {
            e && (t = JSON.parse(e));
        }
        catch (e) {
            console.log(e);
        }
        return t;
    }
    readLastSession() {
        this.readLastSessionStatus = 2;
        let e = this.getItem("model_base_data", "");
        if (!!e) {
            if (e = this._jsonParse(e)) {
                this.lastMockData = e;
                var t = JSON.parse(JSON.stringify(e.appContext));
                if (t.account && "string" == typeof t.account.type) {
                    try {
                        for (var a in this.ProfileType)
                            if (this.ProfileType[a] == t.account.type) {
                                t.account.type = a;
                                break;
                            }
                    }
                    catch (e) {
                    }
                }
                this.mock_data.appContext = t;
            }
            else {
                this.log("no last session data");
            }
            this.readLastSessionStatus = 3;
        }
        else {
            this.lastMockData = null;
            this.readLastSessionStatus = 3;
        }
    }
    _migrate() {
        this.log("migrate");
        this.log("migrate:no data");
    }
    quickDestory() {
        clearInterval(this.heartBeat_timer);
    }
    log(e) {
        this.debug && console.log("tdsdk", e);
    }
    _setInstallTime() {
        var t = (new Date).getTime();
        let e = this.getItem("TDSDK_installTime", "");
        e ? e = Number(e) : this.setItem("TDSDK_installTime", t);
        this.mock_data.app.installTime = e;
        /*      _system.default.get({
                  key: "TDSDK_installTime",
                  success(e) {
                      e ? e = Number(e) : _system.default.set({
                          key: "TDSDK_installTime",
                          value: e = t
                      }),
                          this.mock_data.app.installTime = e
                  },
                  fail() {
                      this.mock_data.app.installTime = t
                  }
              })*/
    }
    _refreshMockData() {
        this.refreshMockDataStatus = 3;
        /* this.TDgetDeviceId().then((e) => {
             // @ts-ignore
             e.device && e.device.deviceId && (this.mock_data.device.deviceId = e.device.deviceId),
                 this.mock_data.device.deviceId.tid = this.getTid()
         })*/
    }
    handleAppInit() {
        var e = JSON.parse(JSON.stringify(this.mock_data));
        e.action = {
            domain: "app",
            name: "init",
            data: {
                first: null == this.lastMockData
            }
        };
        e.ts = (new Date).getTime();
        this.save4Fetch(e);
    }
    handleNeWSession() {
        var e = JSON.parse(JSON.stringify(this.mock_data));
        e.action = {
            domain: "session",
            name: "begin",
            data: {
                interval: this.lastPage ? parseInt((((new Date).getTime() - this.lastPage.leaveTime) / 1000) + "") : 0
            }
        };
        e.ts = (new Date).getTime();
        this.save4Fetch(e);
    }
    pageLeave(e) {
        try {
            var t;
            clearInterval(this.heartBeat_timer);
            if (this.inited) {
                this.log("call pageLeave");
                t = {
                    name: e,
                    leaveTime: (new Date).getTime(),
                    startTime: this.pageEnterTime
                };
                this.lastPage = t;
                this.setItem("lastPage", JSON.stringify(t));
                clearTimeout(this.pageLeaveTimer);
                this.pageLeaveTimer = setTimeout(function () {
                    this.refreshSessionStatus = 2;
                }, 100);
            }
            else {
                console.log("没有调用init事件");
            }
        }
        catch (e) {
            console.log("pageLeave-error:", e);
        }
    }
    selfEvent(eventId, label = "", params = {}, value = -100) {
        let e = { eventId: eventId };
        if (!!label) {
            e["label"] = label;
        }
        if (params && "object" == typeof params && Object.keys(params).length > 0) {
            e["params"] = params;
        }
        if (value != -100) {
            e["value"] = value;
        }
        try {
            var t, a;
            this.inited ? e && (e.eventId || /0/.test(e.eventId)) && (t = {
                ts: (new Date).getTime(),
                param: e
            }, 3 === this.refreshMockDataStatus && 3 === this.refreshSessionStatus ? this._doSelfEvent(t) : a = setInterval(() => {
                3 == this.refreshMockDataStatus && 3 === this.refreshSessionStatus && (clearInterval(a), this._doSelfEvent(t));
            }, 50)) : console.log("没有调用init事件");
        }
        catch (e) {
            console.log(e);
        }
    }
    _doSelfEvent(e) {
        var t = e.param, a = JSON.parse(JSON.stringify(this.mock_data));
        if (a.action = {
            domain: "appEvent",
            name: t.eventId || ""
        }, (t.label || /0/.test(t.label)) && (a.action.data = a.action.data || {}, a.action.data.eventLabel = t.label), void 0 !== t.value) {
            if ("number" != typeof t.value || isNaN(t.value))
                return void console.error("param 中value只能为number");
            a.action.data = a.action.data || {},
                a.action.data.value = t.value,
                delete t.value;
        }
        else {
        }
        if (t.params) {
            a.action.data = a.action.data || {},
                a.action.data.eventParam = {};
            var s, n = 0;
            for (s in t.params)
                "" !== t.params[s] && (a.action.data.eventParam[s] = t.params[s], n++);
            0 == n && delete a.action.data.eventParam;
        }
        var d, i = 0;
        for (d in a.action.data)
            i++;
        0 == i && delete a.action.data,
            a.ts = e.ts,
            this.save4Fetch(a);
    }
    pageEnter(e) {
        try {
            var t;
            if (this.inited) {
                clearTimeout(this.pageLeaveTimer);
                this.log("call pageEnter");
                this.pageEnterTime = (new Date).getTime();
                if (3 === this.refreshMockDataStatus && 3 == this.readLastSessionStatus) {
                    this.sendLastPageLeave(e);
                }
                else {
                    t = setInterval(() => {
                        if (3 == this.refreshMockDataStatus && 3 == this.readLastSessionStatus) {
                            clearInterval(t);
                            this.sendLastPageLeave(e);
                        }
                    }, 50);
                }
                this.heartBeat();
            }
            else {
                console.log("没有调用init事件");
            }
            /*    this.inited ? (clearTimeout(this.pageLeaveTimer), this.log("call pageEnter"), this.pageEnterTime = (new Date).getTime(), 3 === this.refreshMockDataStatus && 3 == this.readLastSessionStatus ? this.sendLastPageLeave(e) : t = setInterval(() => {
                    3 == this.refreshMockDataStatus && 3 == this.readLastSessionStatus && (clearInterval(t), this.sendLastPageLeave(e))
                }, 50), this.heartBeat()) : console.log("没有调用init事件")*/
        }
        catch (e) {
            console.log("pageEnter_error:", e);
        }
    }
    handlePageEnter(e) {
        this.log("call handlePageEnter");
        this.refreshSessionStatus = 3;
        this.pageEnterTime = (new Date).getTime();
        var t = JSON.parse(JSON.stringify(this.mock_data));
        t.action = {
            domain: "page",
            name: "enter",
            data: {
                name: e,
                startTime: this.pageEnterTime,
                from: ""
            }
        };
        t.ts = (new Date).getTime();
        this.from && (t.action.data.from = this.from);
        this.from = "fromStateName";
        this.save4Fetch(t);
    }
    sendLastPageLeave(t) {
        //上报上次页面
        if (this.lastPage) {
            this.calculateLastPage(t);
        }
        else {
            let e = this.getItem("lastPage", "");
            if (e) {
                this.setItem("lastPage", "");
                e = this._jsonParse(e);
                this.lastPage = e;
                this.calculateLastPage(t);
            }
            else {
                this.startNewSession(!0);
                this.handlePageEnter(t);
                this.lastMockData = this.mock_data;
            }
        }
    }
    calculateLastPage(e) {
        var t, a, s = this.lastPage, n = (new Date).getTime(), d = n - s.leaveTime, i = (this.log("gap:" + d), 3e4 < d ? this.lastMockData : this.mock_data);
        if (null != i) {
            a = JSON.parse(JSON.stringify(i));
            a.action = {
                domain: "page",
                name: "leave",
                data: {
                    name: s.name,
                    duration: parseInt(((s.leaveTime - s.startTime) / 1000) + ""),
                    startTime: s.startTime,
                    from: ""
                }
            };
            a.ts = (new Date).getTime();
            (t = []).push(a);
            /*         if (3e4 < d && i.appContext.sessionStartTime > 0) {
                         a = JSON.parse(JSON.stringify(i));
                         a.action = {
                             domain: "session",
                             name: "end",
                             data: {
                                 start: n,
                                 duration: parseInt(((s.leaveTime - i.appContext.sessionStartTime) / 1e3) + "")
                             }
                         }
                         a.ts = n;
                         t.push(a)
                     }*/
            this.save4Fetch(t);
        }
        if (3e4 < d) {
            this.startNewSession(!0);
        }
        else {
            this.needInitEvent && (this.needInitEvent = !1, this.handleAppInit());
            this.setItem("model_base_data", JSON.stringify(this.mock_data));
        }
        // 3e4 < d ? this.startNewSession(!0) : (this.needInitEvent && (this.needInitEvent = !1, this.handleAppInit()), this.setItem("model_base_data", JSON.stringify(this.mock_data))),
        this.lastMockData = this.mock_data;
        this.handlePageEnter(e);
        /*   var t,
            a,
            s = this.lastPage,
            n = (new Date).getTime(),
            d = n - s.leaveTime,
            i = (this.log("gap:" + d), 3e4 < d ? this.lastMockData : this.mock_data);
        null != i && ((a = JSON.parse(JSON.stringify(i))).action = {
            domain: "page",
            name: "leave",
            data: {
                name: s.name,
                duration: parseInt(((s.leaveTime - s.startTime) / 1000) + ""),
                startTime: s.startTime,
                from: ""
            }
        }, a.ts = (new Date).getTime(), (t = []).push(a), 3e4 < d && ((a = JSON.parse(JSON.stringify(i))).action = {
            domain: "session",
            name: "end",
            data: {
                start: n,
                duration: parseInt(((s.leaveTime - i.appContext.sessionStartTime) / 1e3) + "")
            }
        }, a.ts = n, t.push(a)), this.save4Fetch(t)),
            3e4 < d ? this.startNewSession(!0) : (this.needInitEvent && (this.needInitEvent = !1, this.handleAppInit()), this.setItem("model_base_data", JSON.stringify(this.mock_data))),
            this.lastMockData = this.mock_data,
            this.handlePageEnter(e)*/
    }
    startNewSession(e) {
        var t = (new Date).getTime();
        this.mock_data.appContext = this.mock_data.appContext || {
            "sessionStartTime": 0,
            "sessionId": "",
            account: {
                accountId: "",
                type: 0
            },
        };
        this.mock_data.appContext.sessionStartTime = t;
        this.mock_data.appContext.sessionId = "quickapp-".concat(t + "", "-").concat(this.random());
        if (e) {
            this.needInitEvent = false;
            this.handleAppInit();
        }
        this.handleNeWSession();
        this.setItem("model_base_data", JSON.stringify(this.mock_data));
        /*   e && (this.needInitEvent = !1, this.handleAppInit()),
               this.handleNeWSession(), this.setItem("model_base_data", JSON.stringify(this.mock_data))
   */
    }
    /*
        setTDChannelId(e) {
            e && (this.mock_data.app.channel = e, this.updateBasedataInStorage(this.mock_data))
        }
    */
    setTDProfile(e, t) {
        if (e && "object" === typeof e)
            if ("update" === t || e.accountId || /0{1}/.test(e.accountId))
                if ("update" !== t && "number" != typeof e.accountType)
                    console.warn("accountType为必填!");
                else {
                    var a, s = { accountId: '', type: 0 }, n = (!this.mock_data.appContext.account || "update" != t && e.accountId != this.mock_data.appContext.account.accountId || (s = JSON.parse(JSON.stringify(this.mock_data.appContext.account))), {
                        _setProfileId(e, t) {
                            if (!t && !/0{1}/.test(t))
                                return "accountId为必填字段！";
                            e.accountId = t;
                        },
                        _setProfileType(e, t) {
                            if ("number" != typeof t || t != t || t < -1 || 6 < t && t < 11 || 20 < t)
                                return "请上传正确的accountType";
                            e.type = t;
                        },
                        _setName(e, t) {
                            if ("string" != typeof t)
                                return "account name 类型错误";
                            e.name = t;
                        },
                        _setAge(e, t) {
                            if ("number" != typeof t || t != t)
                                return "profile age 类型错误";
                            e.age = t;
                        },
                        _setGender(e, t) {
                            if (0 !== t && 1 !== t && 2 !== t)
                                return "profile gender 类型错误";
                            e.gender = t;
                        },
                        _setProperty(e, t, a) {
                            if ("number" == typeof a && a != a || "string" != typeof a && "number" != typeof a)
                                return "profile property 类型错误";
                            e[t] = a;
                        }
                    }), d = {
                        accountId: "_setProfileId",
                        accountType: "_setProfileType",
                        name: "_setName",
                        gender: "_setGender",
                        age: "_setAge"
                    }, i = new RegExp("^property[1-9]$");
                    for (a in e) {
                        var r = e[a], o = d[a];
                        if (!o || "update" === t && "accountId" === a) {
                            if (i.test(a) || "property10" === a) {
                                var c = n._setProperty(s, a, r);
                                if (c)
                                    return void console.log(c);
                            }
                        }
                        else {
                            c = n[o](s, r);
                            if (c)
                                return void console.log(c);
                        }
                    }
                    this.mock_data.appContext.account = s,
                        "login" != t && "register" != t && "update" != t || this._genProfileEvent(e, t),
                        this.updateBasedataInStorage(this.mock_data);
                }
            else
                console.warn("accountId 为必填!");
        else
            console.warn("account信息为必填！");
    }
    login(e) {
        var t;
        3 == this.readLastSessionStatus && 3 == this.refreshMockDataStatus ? this.setTDProfile(e, "login") : t = setInterval(() => {
            3 == this.readLastSessionStatus && 3 == this.refreshMockDataStatus && (clearInterval(t), this.setTDProfile(e, "login"));
        }, 50);
    }
    register(e) {
        var t;
        3 == this.readLastSessionStatus && 3 == this.refreshMockDataStatus ? this.setTDProfile(e, "register") : t = setInterval(() => {
            3 == this.readLastSessionStatus && 3 == this.refreshMockDataStatus && (clearInterval(t), this.setTDProfile(e, "register"));
        }, 50);
    }
    updateProfile(e) {
        var t;
        3 == this.readLastSessionStatus && 3 == this.refreshMockDataStatus ? this.setTDProfile(e, "update") : t = setInterval(() => {
            3 == this.readLastSessionStatus && 3 == this.refreshMockDataStatus && (clearInterval(t), this.setTDProfile(e, "update"));
        }, 50);
    }
    _genProfileEvent(e, t) {
        var a = JSON.parse(JSON.stringify(this.mock_data));
        a.action = {
            domain: "account",
            name: t,
            data: e
        },
            a.ts = (new Date).getTime(),
            this.save4Fetch(a);
    }
    updateBasedataInStorage(t) {
        let e = this.getItem("model_base_data", "");
        e && (e = this._jsonParse(e), t.device = e["device"],
            this.setItem("model_base_data", JSON.stringify(t)));
    }
    _isObject(e) {
        return e && "object" === typeof e;
    }
    _isStrNotEmpty(e) {
        return e || /0{1}/.test(e);
    }
    _isNumber(e) {
        return "number" == typeof e && e == e;
    }
    _isCurrencyTypeAvailabal(e) {
        return e && "string" == typeof e && 3 === e.length;
    }
    _checkIapParam(e) {
        return this._isObject(e) ? this._isStrNotEmpty(e.orderId) ? this._isNumber(e.amount) ? !!this._isCurrencyTypeAvailabal(e.currencyType) || (console.warn("请输入正确的currencyType!"), !1) : (console.warn("请输入正确的amount!"), !1) : (console.warn("请输入正确的orderId!"), !1) : (console.warn("请输入正确的参数!"), !1);
    }
    onPlaceOrder(e) {
        var t;
        this.inited ? this._checkIapParam(e) && (3 === this.refreshMockDataStatus && 3 === this.refreshSessionStatus ? this._genIapEvent(e, "placeOrder") : t = setInterval(() => {
            3 == this.refreshMockDataStatus && 3 === this.refreshSessionStatus && (clearInterval(t), this._genIapEvent(e, "placeOrder"));
        }, 50)) : console.log("没有调用init事件");
    }
    onOrderPaySucc(e) {
        var t, a;
        this.inited ? this._checkIapParam(e) && ((t = JSON.parse(JSON.stringify(e))).paymentType && this._isStrNotEmpty(t.paymentType) && (t.payType = t.paymentType), delete t.paymentType, 3 === this.refreshMockDataStatus && 3 === this.refreshSessionStatus ? this._genIapEvent(e, "pay") : a = setInterval(() => {
            3 == this.refreshMockDataStatus && 3 === this.refreshSessionStatus && (clearInterval(a), this._genIapEvent(e, "pay"));
        }, 50)) : console.log("没有调用init事件");
    }
    onCancelOrder(e) {
        var t;
        this.inited ? this._checkIapParam(e) && (3 === this.refreshMockDataStatus && 3 === this.refreshSessionStatus ? this._genIapEvent(e, "cancelOrder") : t = setInterval(() => {
            3 == this.refreshMockDataStatus && 3 === this.refreshSessionStatus && (clearInterval(t), this._genIapEvent(e, "cancelOrder"));
        }, 50)) : console.log("没有调用init事件");
    }
    _genIapEvent(e, t) {
        var a = JSON.parse(JSON.stringify(this.mock_data));
        a.action = {
            domain: "iap",
            name: t,
            data: e
        },
            a.ts = (new Date).getTime(),
            this.save4Fetch(a);
    }
}
exports.default = TDSDK;
