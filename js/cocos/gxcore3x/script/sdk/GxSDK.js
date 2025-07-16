/*
*
* 可以在ts中使用
*
*
*
* (window as any).sd={

    init(){
        return new Promise<void>((resolve, reject)=>{
            resolve()

        })
    }

}

// @ts-ignore
sd.init().then(()=>{

}).catch(e=>{

})

* */
window["GxSDK"] = {
    _BASE_URL: "https://api.sjzgxwl.com",
    _responseConfig: {
        sessionId: "",
        clickid: "",
        ecpmConfig: {
            gameTime: 10.3, //游戏时长  分钟
            targetEcpm: 300, //目标ecpm
            targetVideo: 1 //目标激励视频数
        }
    },
    _initComplete: false,
    _heartInterval: 5 * 1000,
    _checkInterval: 20 * 1000,
    _config: {},
    init(config, callback) {
        this._config = Object.assign({}, config);
        if (window["TDAnalytics"]) {
            window["TDAnalytics"].init({
                appKey: config.appKey, // 项目 APP ID
                serverUrl: "http://127.0.0.1:8091", // 上报地址
                autoTrack: {
                    appShow: true, // 自动采集 ta_mg_show
                    appHide: true // 自动采集 ta_mg_hide
                }
            });
            window["TDAnalytics"].setSuperProperties({
                gxbi_app_name: config.appName, gxbi_app_version: config.version
            }, true);
            window["TDAnalytics"].login(config.openId);
        }
        let data = {
            appKey: this._config.appKey,
            openId: this._config.openId,
            appId: this._config.appId,
            launchOptions: {}
        };
        let url = `${this._config.BASE_URL}/event_center/user/login`;
        this._sendNetwork(url, data, "POST", (resp) => {
            console.log(JSON.stringify(resp));
            if (resp.code !== 1) {
                return callback(resp);
            }
            this.responseConfig = resp.data;
        }, () => {
            return callback(null);
        });
    },
    event(eventName, properties) {
        if (window["TDAnalytics"]) {
            window["TDAnalytics"].track(eventName, properties);
        }
    },
    eventLevelStart(lvName, properties) {
        if (window["TDAnalytics"]) {
            let assign = Object.assign({
                gxbi_level_name: lvName
            }, properties);
            window["TDAnalytics"].track("gxbi_level_start", assign);
        }
    },
    eventLevelFail(lvName, properties) {
        if (window["TDAnalytics"]) {
            let assign = Object.assign({
                gxbi_level_name: lvName
            }, properties);
            window["TDAnalytics"].track("gxbi_level_fail", assign);
        }
    },
    eventLevelSuccess(lvName, properties) {
        if (window["TDAnalytics"]) {
            let assign = Object.assign({
                gxbi_level_name: lvName
            }, properties);
            window["TDAnalytics"].track("gxbi_level_success", assign);
        }
    },
    _sendNetwork(url, data, method = "POST", successCallback, errorCallback) {
        this._request({
            url: url,
            method: method,
            data: typeof data === "string" ? data : JSON.stringify(data),
            header: {
                "content-type": "application/json"
            },
            success: (e) => {
                console.log("successssss");
                e.statusCode === 200 ? successCallback(e.data) : errorCallback(e);
            },
            fail: (e) => {
                console.warn(e);
                errorCallback(e);
            }
        });
    },
    _request(option) {
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
                    option.success(response);
                }
                else {
                    response.statusCode = xmlHttpRequest.status;
                    response.errMsg = "network error";
                    option.fail(response);
                }
            }
        };
        xmlHttpRequest.ontimeout = () => {
            response.errMsg = "timeout";
            option.fail(response);
        };
        xmlHttpRequest.send(option.data);
        return xmlHttpRequest;
    }
};
/*
GxSDK.init({
    appKey: "f002da3d5e91e9dc487a8e59f38f2221",
    appId: "tt9e31e88c0101e7b602",
    openId: "ismyopenid",
    appName: "领地守卫战",
    version: "1.0.1"
}, (res) => {

});
*/
