if (CC_WECHAT) {
    var ald = function () { };
    ald.app_key = "a584e1901ea2e6c6513f186124f6c53b"; //请在此行填写从阿拉丁后台获取的appkey
    ald.getLocation = false; //默认不获取用户坐标位置
    ald.useOpen = false;
    ald.openKey = "";
    !function () { function e() { this.request = [], this.push = function (e) { this.request.length >= 18 ? (this.request.shift(), this.request.push(e)) : this.request.push(e); }, this.concat = function () { this.request.map(function (e) { wx.Queue.push(e); }), this.request = []; }; } function t() { var e = ""; try {
        e = wx.getStorageSync("aldstat_op");
    }
    catch (t) {
        e = wx.getStorageSync("aldstat_op");
    } if ("" === e) {
        if ("" === y)
            return "";
        try {
            b = e = wx.getStorageSync(y), e && wx.setStorageSync("aldstat_op", e);
        }
        catch (t) {
            b = e = wx.getStorageSync(y), e && wx.setStorageSync("aldstat_op", e);
        }
    } return e; } function n() { function e(e) { return !/^\d+(.\d+)*$/.test(e.stageId) || e.stageId.length > 32 || isNaN(Number(e.stageId)) ? (console.warn("关卡stageId必须符合传参规则,请参考文档。"), !1) : !("string" !== u(e.stageName) || e.stageName.length > 32) || (console.warn("关卡名称为必传字段,且长度小于32个字符,请参考文档"), !1); } var t = "", n = "", r = 0; this.onStart = function (a) { if (e(a)) {
        var s = {};
        r = Date.now(), s.sid = a.stageId, s.snm = a.stageName, ("string" === u(a.userId) && a.userId) < 32 ? s.uid = a.userId : s.uid = "", s.state = "start", n = d(), t = s, this.request();
    } }, this.onRunning = function (n) { if (e(n)) {
        var r = { params: {} };
        if (("string" === u(n.userId) && n.userId) < 32 ? r.uid = n.userId : r.uid = "", "string" !== u(n.event) && Q.join(",").indexOf(n.event + ",") === -1)
            return void console.warn("关卡running状态中仅支持" + Q.join(",") + "事件类型，且为必传字段，详情请参考文档。");
        if (r.event = n.event, "object" !== u(n.params))
            return void console.warn("关卡running状态中params为必传字段，且该字段需为Object类型，详情请参考文档。");
        if ("string" !== u(n.params.itemName) || n.params.itemName.length > 32)
            return void console.warn("道具/商品名称为必传字段，且长度小于32个字符，详情请参考文档");
        r.params.itnm = n.params.itemName, "string" === u(n.params.itemId) && n.params.itemId.length < 32 && (r.params.itid = n.params.itemId), "number" === u(n.params.itemCount) && toString(n.params.itemCount).length < 32 ? r.params.itco = n.params.itemCount : r.params.itco = 1, n.event.indexOf("pay") !== -1 && ("number" === u(n.params.itemMoney) && toString(n.params.itemMoney).length < 32 ? r.params.money = n.params.itemMoney : r.params.money = 0), "string" === u(n.params.desc) && n.params.desc.length < 64 && (r.params.desc = n.params.desc), r.state = "running", r.sid = n.stageId, r.snm = n.stageName, t = r, this.request();
    } }, this.onEnd = function (n) { if (e(n)) {
        var a = {};
        if (a.state = "end", ("string" === u(n.userId) && n.userId) < 32 ? a.uid = n.userId : a.uid = "", !u(n.event) && F.join(",").indexOf(n.event + ",") !== -1)
            return void F.join(",");
        a.sid = n.stageId, a.snm = n.stageName, a.event = n.event, a.sdr = 0 !== r ? Date.now() - r : "", a.params = {}, "object" === u(n.params) && "string" === u(n.params.desc) && n.params.desc.length < 64 && (a.params.desc = n.params.desc), t = a, this.request();
    } }, this.request = function () { var e = g(I); t.ss = n, e.ct = t, f(e, "screen"); }; } function r() { function e(e) { return !/^\d+(.\d+)*$/.test(e.levelId) || e.levelId.length > 32 || isNaN(Number(e.levelId)) ? (console.warn("levelId必须符合传参规则,请参考文档。"), !1) : !("string" !== u(e.levelName) || e.levelName.length > 32) || (console.warn("levelName为必传字段,且长度小于32个字符,请参考文档"), !1); } var t = "", n = "", r = 0; this.onInitLevel = function (r) { if (e(r)) {
        var a = {};
        "" == H ? (n = d(), wx.setStorageSync("ald_level_session", n)) : n = H, a.lid = r.levelId, a.lnm = r.levelName, ("string" === u(r.userId) && r.userId) < 32 ? a.uid = r.userId : a.uid = "", a.un = r.userName, a.state = "init", t = a, this.request();
    } }, this.onSetLevel = function (a) { if (e(a)) {
        var s = {};
        n = d(), wx.setStorageSync("ald_level_session", n), s.lid = a.levelId, s.lnm = a.levelName, ("string" === u(a.userId) && a.userId) < 32 ? s.uid = a.userId : s.uid = "", s.un = a.userName, s.state = "set", s.tmr = 0 !== U ? Date.now() - U : "", r = Date.now(), wx.setStorageSync("ald_level_time", r), t = s, this.request();
    } }, this.onPaySuccess = function (n) { if (e(n)) {
        var r = { params: {} };
        if ("object" !== u(n.params))
            return void console.warn("关卡paySuccess状态中params为必传字段，且该字段需为Object类型，详情请参考文档。");
        "number" === u(n.params.amount) && toString(n.params.amount).length < 32 ? r.params.am = n.params.amount : r.params.am = 0, "string" === u(n.params.desc) && n.params.desc.length < 64 && (r.params.desc = n.params.desc), r.lid = n.levelId, r.lnm = n.levelName, ("string" === u(n.userId) && n.userId) < 32 ? r.uid = n.userId : r.uid = "", r.un = n.userName, r.state = "paySuccess", t = r, this.request();
    } }, this.onPayFail = function (n) { if (e(n)) {
        var r = { params: {} };
        if ("object" !== u(n.params))
            return void console.warn("关卡payFile状态中params为必传字段，且该字段需为Object类型，详情请参考文档。");
        "number" === u(n.params.amount) && toString(n.params.amount).length < 32 ? r.params.am = n.params.amount : r.params.am = 0, "string" === u(n.params.desc) && n.params.desc.length < 64 && (r.params.desc = n.params.desc), r.lid = n.levelId, r.lnm = n.levelName, ("string" === u(n.userId) && n.userId) < 32 ? r.uid = n.userId : r.uid = "", r.un = n.userName, r.state = "payFail", t = r, this.request();
    } }, this.request = function () { var e = g(I); t.ls = n, e.ct = t, f(e, "level"); }; } function a() { return new Promise(function (e, t) { wx.getSetting({ success: function (t) { t.authSetting["scope.userInfo"] ? wx.getUserInfo({ success: function (t) { C = h(t.userInfo.avatarUrl.split("/")), e(t); }, fail: function () { e(""); } }) : e(""); }, fail: function () { e(""); } }); }); } function s() { return new Promise(function (e, t) { wx.getNetworkType({ success: function (t) { e(t); }, fail: function () { e(""); } }); }); } function i() { return new Promise(function (e, t) { "1044" == j.scene ? wx.getShareInfo({ shareTicket: j.shareTicket, success: function (t) { e(t); }, fail: function () { e(""); } }) : e(""); }); } function o() { return new Promise(function (e, t) { w.getLocation ? wx.getLocation({ success: function (t) { e(t); }, fail: function () { e(""); } }) : wx.getSetting({ success: function (t) { t.authSetting["scope.userLocation"] ? (wx.getLocation({ success: function (t) { e(t); }, fail: function () { e(""); } }), e("")) : e(""); }, fail: function () { e(""); } }); }); } function u(e) { function t(e) { return Object.prototype.toString.call(e); } var n = {}; return "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (e, t) { n["[object " + e + "]"] = e.toLowerCase(); }), function () { return null == e ? e : "object" == typeof e || "function" == typeof e ? n[t.call(e)] || "object" : typeof e; }(); } function c(e) { for (var t in e)
        if ("object" == typeof e[t] && null !== e[t])
            return !0; return !1; } function d() { function e() { return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1); } return e() + e() + e() + e() + e() + e() + e() + e(); } function l() { this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0; var e = this; this.push = function (t) { this.tasks.push(new Promise(function (n, r) { var a = function () { e.activeCount++, t().then(function (e) { n(e); }).then(function () { e.next(); }); }; e.activeCount < e.concurrency ? a() : e.queue.push(a); })); }, this.all = function () { return Promise.all(this.tasks); }, this.next = function () { e.activeCount--, e.queue.length > 0 && e.queue.shift()(); }; } function f(e, n) { function r() { return new Promise(function (t, n) { wx.request({ url: "https://" + v + ".aldwx.com/d.html", data: e, header: { se: q || "", op: b || "", img: C || "" }, method: "GET", fail: function () { t(""); }, success: function (e) { t(200 == e.statusCode ? "" : "status error"); } }); }); } w.useOpen && t(), O++, e.as = D, e.at = M, e.rq_c = O, e.ifo = _, e.ak = w.app_key, e.uu = x, e.v = m, e.st = Date.now(), e.ev = n, e.te = S, e.wsr = j, "" !== p(e.ufo) && (e.ufo = e.ufo), e.ec = N, w.useOpen ? "" === b ? K.push(r) : (wx.Queue.push(r), K.concat()) : wx.Queue.push(r); } function p(e) { if (void 0 === e || "" === e)
        return ""; var t = {}; for (var n in e)
        "rawData" != n && "errMsg" != n && (t[n] = e[n]); return t; } function g(e) { var t = {}; for (var n in e)
        t[n] = e[n]; return t; } function h(e) { for (var t = "", n = 0; n < e.length; n++)
        e[n].length > t.length && (t = e[n]); return t; } var m = "3.2.0", v = "glog", w = ald; "" === w.app_key && console.error("请在配置文件中填写您的app_key"), w.useOpen && console.warn("提示：开启了useOpen配置后，如果不上传用户opendId则不会上报数据。"), w.app_key = w.app_key.replace(/\s/g, ""); var y = w.openKey, S = "wg"; !function () { wx.request({ url: "https://" + v + ".aldwx.com/config/app.json", method: "GET", success: function (e) { 200 === e.statusCode && (e.data.version > m && console.warn("您的SDK不是最新版本，请尽快升级！"), e.data.warn && console.warn(e.data.warn), e.data.error && console.error(e.data.error)); } }); }(); var _ = "", x = function () { var e = ""; try {
        e = wx.getStorageSync("aldstat_uuid"), wx.setStorageSync("ald_ifo", !0);
    }
    catch (t) {
        e = "uuid_getstoragesync";
    } if (e)
        _ = !1;
    else {
        e = d(), _ = !0;
        try {
            wx.setStorageSync("aldstat_uuid", e);
        }
        catch (e) {
            wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync");
        }
    } return e; }(), I = {}, q = "", b = t(), N = 0, O = "", j = wx.getLaunchOptionsSync(), k = Date.now(), M = "" + Date.now() + Math.floor(1e7 * Math.random()), D = "" + Date.now() + Math.floor(1e7 * Math.random()), L = 0, P = "", C = "", E = !0, A = !1, T = ["aldSendEvent", "aldOnShareAppMessage", "aldShareAppMessage", "aldSendSession", "aldSendOpenid", "aldLevelEvent"], Q = ["payStart", "paySuccess", "payFail", "die", "revive", "tools", "award"], F = ["complete", "fail"], U = wx.getStorageSync("ald_level_time") || 0, H = wx.getStorageSync("ald_level_session") || ""; void 0 === wx.Queue && (wx.Queue = new l, wx.Queue.all()); var K = new e; (function () { return Promise.all([a(), s(), o()]); })().then(function (e) { "" !== e[2] ? (I.lat = e[2].latitude || "", I.lng = e[2].longitude || "", I.spd = e[2].speed || "") : (I.lat = "", I.lng = "", I.spd = ""), "" !== e[1] ? I.nt = e[1].networkType || "" : I.nt = ""; var t = g(I); "" !== e[0] && (t.ufo = e[0], P = e[0]), f(t, "init"); }), wx.onShow(function (e) { if (j = e, L = Date.now(), !E && !A) {
        M = "" + Date.now() + Math.floor(1e7 * Math.random()), _ = !1;
        try {
            wx.setStorageSync("ald_ifo", !1);
        }
        catch (e) { }
    } E = !1, A = !1; var t = g(I), n = g(I); t.sm = L - k, e.query.ald_share_src && e.shareTicket && "1044" === e.scene ? (n.tp = "ald_share_click", i().then(function (e) { n.ct = e, f(n, "event"); })) : e.query.ald_share_src && (n.tp = "ald_share_click", n.ct = "1", f(n, "event")), f(t, "show"); }), wx.onHide(function () { wx.setStorageSync("ald_level_session", ""); var e = g(I); e.dr = Date.now() - L, "" === P ? wx.getSetting({ success: function (t) { t.authSetting["scope.userInfo"] ? wx.getUserInfo({ success: function (t) { e.ufo = t, P = t, C = h(t.userInfo.avatarUrl.split("/")), f(e, "hide"); } }) : f(e, "hide"); } }) : f(e, "hide"); }), wx.onError(function (e) { var t = g(I); t.tp = "ald_error_message", t.ct = e, N++, f(t, "event"); }); var R = { aldSendEvent: function (e, t) { var n = g(I); if ("" !== e && "string" == typeof e && e.length <= 255)
            if (n.tp = e, "string" == typeof t && t.length <= 255)
                n.ct = String(t), f(n, "event");
            else if ("object" == typeof t) {
                if (JSON.stringify(t).length >= 255)
                    return void console.error("自定义事件参数不能超过255个字符");
                if (c(t))
                    return void console.error("事件参数，参数内部只支持Number,String等类型，请参考接入文档");
                for (var r in t)
                    "number" == typeof t[r] && (t[r] = t[r] + "s##");
                n.ct = JSON.stringify(t), f(n, "event");
            }
            else
                void 0 === t || "" === t ? f(n, "event") : console.error("事件参数必须为String,Object类型,且参数长度不能超过255个字符");
        else
            console.error("事件名称必须为String类型且不能超过255个字符"); }, aldOnShareAppMessage: function (e) { wx.onShareAppMessage(function () { A = !0; var t = e(), n = ""; n = void 0 !== j.query.ald_share_src ? void 0 !== t.query ? (j.query.ald_share_src.indexOf(x), t.query + "&ald_share_src=" + j.query.ald_share_src + "," + x) : (j.query.ald_share_src.indexOf(x), "ald_share_src=" + j.query.ald_share_src + "," + x) : void 0 !== t.query ? t.query + "&ald_share_src=" + x : "ald_share_src=" + x, "undefined" != u(t.ald_desc) && (n += "&ald_desc=" + t.ald_desc), t.query = n; var r = g(I); return r.ct = t, r.ct.sho = 1, r.tp = "ald_share_chain", f(r, "event"), t; }); }, aldShareAppMessage: function (e) { A = !0; var t = e, n = ""; n = void 0 !== j.query.ald_share_src ? void 0 !== t.query ? (j.query.ald_share_src.indexOf(x), t.query + "&ald_share_src=" + j.query.ald_share_src + "," + x) : (j.query.ald_share_src.indexOf(x), "ald_share_src=" + j.query.ald_share_src + "," + x) : void 0 !== t.query ? t.query + "&ald_share_src=" + x : "ald_share_src=" + x; var r = g(I); "undefined" != u(t.ald_desc) && (n += "&ald_desc=" + t.ald_desc), t.query = n, r.ct = t, r.tp = "ald_share_chain", f(r, "event"), wx.shareAppMessage(t); }, aldSendSession: function (e) { if ("" === e || !e)
            return void console.error("请传入从后台获取的session_key"); var t = g(I); t.tp = "session", t.ct = "session", q = e, "" === P ? wx.getSetting({ success: function (e) { e.authSetting["scope.userInfo"] ? wx.getUserInfo({ success: function (e) { t.ufo = e, f(t, "event"); } }) : f(t, "event"); } }) : (t.ufo = P, "" !== P && (t.gid = ""), f(t, "event")); }, aldSendOpenid: function (e) { if ("" === e || !e)
            return void console.error("openID不能为空"); b = e, wx.setStorageSync("aldstat_op", "openid"); var t = g(I); t.tp = "openid", t.ct = "openid", f(t, "event"); } }; wx.aldStage = new n, wx.aldLevel = new r; for (var G = 0; G < T.length; G++)
        !function (e, t) { Object.defineProperty(wx, e, { value: t, writable: !1, enumerable: !0, configurable: !0 }); }(T[G], R[T[G]]); try {
        var J = wx.getSystemInfoSync();
        I.br = J.brand || "", I.md = J.model, I.pr = J.pixelRatio, I.sw = J.screenWidth, I.sh = J.screenHeight, I.ww = J.windowWidth, I.wh = J.windowHeight, I.lang = J.language, I.wv = J.version, I.sv = J.system, I.wvv = J.platform, I.fs = J.fontSizeSetting, I.wsdk = J.SDKVersion, I.bh = J.benchmarkLevel || "", I.bt = J.battery || "", I.wf = J.wifiSignal || "", I.lng = "", I.lat = "", I.nt = "", I.spd = "", I.ufo = "";
    }
    catch (e) { } }();
}
