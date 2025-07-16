"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxAdParams_1 = require("../../GxAdParams");
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const TTAdapter_1 = __importDefault(require("./TTAdapter"));
class TTAdMonitor {
    constructor() {
        this.checkInterval = 30; //10秒检查一次
        this.tryGetCount = 0;
        this.clickId = "";
        this.gameTime = 0;
        this.videoReward = 0;
        this.reported = false;
        this.checkAdTargetTimeout = -1;
        this.gameTimeEnd = false;
        this._openId = "";
        this.ecpmObj = {
            targetEcpm: 300, //目标ecpm
            gameTime: 10, //目标游戏时长  分钟
            targetVideo: 2 //目标激励视频次数
        };
    }
    static getInstance() {
        if (this._instance == null) {
            this._instance = new TTAdMonitor();
        }
        return this._instance;
    }
    /**
     * 初始化
     * @param openId
     */
    initAdMonitor(openId) {
        this._openId = openId;
        console.log("获取到的clickId:" + this.getClickId());
        this.getAdConfig();
        let interval = setInterval(() => {
            this.gameTime += this.checkInterval;
            if (this.gameTime >= this.ecpmObj.gameTime * 60 && !this.gameTimeEnd) {
                this.gameTimeEnd = true;
                this.checkAdTarget();
                clearInterval(interval);
            }
        }, 5000);
        //10秒检查 一次
        setTimeout(() => {
            this.checkAdTarget();
        }, this.checkInterval * 1000);
    }
    /**
     * 增加看视频次数 如果是通过TTAdapter调用的视频则不用调用，如果是自己写的激励视频则一定要调用
     */
    rewardAdEnd() {
        this.videoReward++;
        this.checkAdTarget();
    }
    getAdConfig() {
        this.tryGetCount++;
        //重试限制
        if (this.tryGetCount >= 11) {
            return;
        }
        let self = this;
        TTAdapter_1.default.getInstance().requestPost(
        /*
                    `https://api.sjzgxwl.com/tt/getConfig?appId=${AdParams.tt.appId}&openId=${self.openId}&name=${AdParams.tt.ecpmConfigName}`,
        */
        `https://api.sjzgxwl.com/tt/getConfigNew?appId=${GxAdParams_1.AdParams.tt.appId}&openId=${self._openId}`, {
            launchOptions: window["tt"].getLaunchOptionsSync()
        }, (res) => {
            self.logi(res.data);
            if (res.data.code == 1) {
                self.logi("获取ecpm配置成功：");
                // self.ecpmObj = JSON.parse(res.data.data.content)
                self.ecpmObj = res.data.data.content;
                if (!!res.data.data["clickid"]) {
                    self.clickId = res.data.data["clickid"];
                }
                self.ttReport();
            }
            else {
                self.logw("获取ecpm配置失败！" + res.data["msg"]);
                setTimeout(() => {
                    self.getAdConfig();
                }, 2000);
            }
        }, (res) => {
            self.logw("获取ecpm配置失败！" + res["errMsg"]);
            setTimeout(() => {
                self.getAdConfig();
            }, 2000);
        });
    }
    ttReport() {
        let item = DataStorage_1.default.getItem("tt_event_active");
        item = "nosuccess";
        //每次激活都上报   服务器控制多次上报
        if (item != "success") {
            //保存激活状态
            this.sendToTAQ("active", (res) => {
                if (res) {
                    console.log("上报激活成功");
                    DataStorage_1.default.setItem("__clickid__", this.getClickId());
                    DataStorage_1.default.setItem("tt_event_active", "success");
                    let item1 = DataStorage_1.default.getItem("tt_install_time");
                    if (!item1) {
                        DataStorage_1.default.setItem("tt_install_time", new Date().valueOf() + "");
                    }
                }
                else {
                    console.log("上报激活失败");
                }
            });
            /*  tt.sendtoTAQ({
                              event_type: 'active', //event_type 需替换为真实投放的事件英文名称，参考上面链接
                              extra: {
                                  //extra 中的属性需替换为当前事件真实可回传的附加属性字段
                                  product_name: '激活游戏',
                                  product_price: 1,
                              },
                          })*/
        }
        let installTime = DataStorage_1.default.getItem("tt_install_time");
        if (!!installTime) {
            // @ts-ignore
            installTime = parseInt(installTime);
        }
        else {
            // @ts-ignore
            installTime = new Date().valueOf();
        }
        let installDate = new Date(new Date(installTime).toLocaleDateString()).valueOf();
        let curDate = new Date().valueOf();
        let number = curDate - installDate;
        let number1 = Math.floor(number / 24 / 60 / 60 / 1000);
        if (number1 >= 1 && number1 <= 6) {
            let arr = [
                "next_day_open",
                "retention_3d",
                "retention_4d",
                "retention_5d",
                "retention_6d",
                "retention_7d"
            ];
            let eventName = arr[number1 - 1];
            let item = DataStorage_1.default.getItem("tt_event_" + eventName);
            item = "nosuccess";
            //每次达成都上报    服务器控制多次上报
            if (item != "success") {
                //保存激活状态
                console.log("上报事件：" + eventName);
                /* tt.sendtoTAQ({
                                     event_type: eventName, //event_type 需替换为真实投放的事件英文名称，参考上面链接
                                     extra: {
                                         //extra 中的属性需替换为当前事件真实可回传的附加属性字段
                                         product_name: '',
                                         product_price: 1,
                                     },
                                 })*/
                this.sendToTAQ(eventName, (res) => {
                    if (res) {
                        console.log("上报事件：" + eventName + ":成功");
                        DataStorage_1.default.setItem("tt_event_" + eventName, "success");
                    }
                    else {
                        console.log("上报事件：" + eventName + ":失败");
                    }
                });
            }
            else {
                console.log(eventName + "已经上报过了");
            }
        }
        else {
            console.log("传的number不能用：" + number1);
        }
    }
    logi(...data) {
        console.log("[TTAdMonitor]", ...data);
    }
    loge(...data) {
        console.error("[TTAdMonitor]", ...data);
    }
    logw(...data) {
        console.warn("[TTAdMonitor]", ...data);
    }
    checkAdTarget() {
        clearTimeout(this.checkAdTargetTimeout);
        this._checkAdTarget();
        this.checkAdTargetTimeout = setTimeout(() => {
            this.checkAdTarget();
        }, this.checkInterval * 1000);
    }
    sendToTAQ(event, callback) {
        let clickId = this.getClickId();
        if (!clickId) {
            console.warn("clickId空  不上报 了");
            callback(false);
            return;
        }
        let self = this;
        // self.getOpenId((openId) => {
        TTAdapter_1.default.getInstance().requestPost(`https://api.sjzgxwl.com/tt/report?appId=${GxAdParams_1.AdParams.tt.appId}&eventType=${event}&openId=${self._openId}&clickId=${this.getClickId()}`, {
            launchOptions: window["tt"].getLaunchOptionsSync()
        }, (res) => {
            self.logi(res.data);
            if (res.data.code == 1) {
                callback(true);
            }
            else {
                callback(false);
            }
        }, (res) => {
            callback(false);
        });
        // })
    }
    getClickId() {
        if (!!this.clickId) {
            return this.clickId;
        }
        // @ts-ignore
        let launchOptionsSync = tt.getLaunchOptionsSync();
        /*  try {
              let task = tt.request({
                  url: "https://api.sjzgxwl.com/tt/reportTest?openId="+this._openId,
                  data: launchOptionsSync,
                  header: {
                      "content-type": "application/json"
                  },
                  method: "POST",
                  dataType: "JSON", // 指定返回数据的类型为 json
                  responseType: "text",
                  success(res) {
                      console.log("调用成功", res.data);
                  },
                  fail(res) {
                      console.log("调用失败", res.errMsg);
                  }
              });
          } catch (e) {

          }*/
        let query = launchOptionsSync.query;
        let clickId = query.clickid;
        if (!!clickId) {
        }
        else {
            let queryElement = query["ad_params"];
            if (queryElement) {
                clickId = queryElement["clickid"];
            }
            if (!!clickId) {
            }
            else {
                // clickId = "";
                let launchOptionsSyncElement = launchOptionsSync["ad_params"];
                if (launchOptionsSyncElement) {
                    clickId = launchOptionsSyncElement["clickid"];
                }
                else {
                    // adid = "";
                    clickId = DataStorage_1.default.getItem("__clickid__");
                }
            }
        }
        return clickId;
    }
    /*    private getAdid() {
            // @ts-ignore
            let launchOptionsSync = tt.getLaunchOptionsSync();
            try {
                let task = tt.request({
                    url: "https://api.sjzgxwl.com/tt/reportTest?openId="+this._openId,
                    data: launchOptionsSync,
                    header: {
                        "content-type": "application/json"
                    },
                    method: "POST",
                    dataType: "JSON", // 指定返回数据的类型为 json
                    responseType: "text",
                    success(res) {
                        console.log("调用成功", res.data);
                    },
                    fail(res) {
                        console.log("调用失败", res.errMsg);
                    }
                });
            } catch (e) {

            }
            let query = launchOptionsSync.query;
            let adid = query["promotionid"];
            if (!!adid) {
            } else {
                let queryElement = query["ad_params"];
                if (queryElement) {
                    adid = queryElement["adid"];
                }
                if (!!adid) {

                } else {
                    // adid = "";

                    let launchOptionsSyncElement = launchOptionsSync["ad_params"];
                    if (launchOptionsSyncElement) {
                        adid = launchOptionsSyncElement["adid"];


                    } else {
                        adid = "";
                    }
                }

            }
            return adid;
        }*/
    /*   private getCreativeid() {
           // @ts-ignore
           let launchOptionsSync = tt.getLaunchOptionsSync();

           let query = launchOptionsSync.query;
           let creativeid = query.creativeid;
           if (!!creativeid) {
           } else {
               let queryElement = query["ad_params"];
               if (queryElement) {
                   creativeid = queryElement["creativeid"];
               }
               if (!!creativeid) {

               } else {
                   // creativeid = "";
                   let launchOptionsSyncElement = launchOptionsSync["ad_params"];
                   if (launchOptionsSyncElement) {
                       creativeid = launchOptionsSyncElement["creativeid"];


                   } else {
                       creativeid = "";
                   }


               }
           }
           return creativeid;
       }*/
    _checkAdTarget() {
        //玩游戏大于等于10分钟
        if ((this.gameTime >= this.ecpmObj.gameTime * 60 &&
            this.videoReward >= this.ecpmObj.targetVideo) ||
            window["rywDEBUG"]) {
            if (DataStorage_1.default.getItem("__ttTaq__") == "true") {
                console.log("本地已经有上报记录了");
                return;
            }
            if (this.reported) {
                console.log("正在上报");
                return;
            }
            this.reported = true;
            let da = new Date();
            var year = da.getFullYear() + "年";
            var month = da.getMonth() + 1 + "月";
            var date = da.getDate() + "日";
            let data = [year, month, date].join("-");
            /*     let item = DataStorage.getItem("__tt_lastTime__");
                                   if (!item || item == "" || item == null) {
                                       DataStorage.setItem("__tt_lastTime__", data)
                                       item = data;
                                   }
                                   if (item != data) {
                                       console.log("不是当天的用户 不激活了")
                                       return;
                                   }*/
            let self = this;
            if (self.ecpmObj.targetEcpm == 0) {
                /*0直接 上报*/
                self.sendToTAQ("game_addiction", (res) => {
                    //服务端控制 每次上报
                    // DataStorage.setItem('__ttTaq__', 'true')
                    if (res) {
                    }
                    else {
                        self.reported = false;
                    }
                });
                return;
            }
            // self.getOpenId((openId) => {
            TTAdapter_1.default.getInstance().requestPost(`https://api.sjzgxwl.com/tt/getEcpm?appId=${GxAdParams_1.AdParams.tt.appId}&openId=${self._openId}`, {
                launchOptions: window["tt"].getLaunchOptionsSync()
            }, (res) => {
                self.logi(res.data);
                if (res.data.code == 1) {
                    self.logi("获取ecpm成功：");
                    let records = res.data.data.records;
                    let length = records.length;
                    let allConst = 0;
                    for (let i = 0; i < length; i++) {
                        let record = records[i];
                        allConst += record.cost;
                    }
                    console.log("总共的const:" + allConst);
                    let ecpm = ((allConst / 100000) * 1000) / length;
                    if (allConst <= 0 || length <= 0) {
                        // self.reported = false;
                        // console.log("ecpm没达到" + self.ecpmObj.targetEcpm + "  现在是0")
                        // return
                        ecpm = 0;
                    }
                    console.log("当前计算的ecmp:" + ecpm);
                    if (ecpm >= self.ecpmObj.targetEcpm) {
                        console.log("ecpm达到" + self.ecpmObj.targetEcpm + " 上报");
                        //@ts-ignore
                        /* tt.sendtoTAQ({
                                                             event_type: 'game_addiction', //event_type 需替换为真实投放的事件英文名称，参考上面链接
                                                             extra: {
                                                                 //extra 中的属性需替换为当前事件真实可回传的附加属性字段
                                                                 product_name: 'ecpm',
                                                                 product_price: ecpm,
                                                             },
                                                         })*/
                        self.sendToTAQ("game_addiction", (res) => {
                            //服务端控制 每次上报
                            // DataStorage.setItem('__ttTaq__', 'true')
                            if (res) {
                            }
                            else {
                                self.reported = false;
                            }
                        });
                    }
                    else {
                        self.reported = false;
                        console.log("ecpm没达到" + self.ecpmObj.targetEcpm);
                    }
                }
                else {
                    self.logw("获取ecpm失败！" + res.data["msg"]);
                    self.reported = false;
                }
            }, (res) => {
                self.logw("获取ecpm失败！" + res["errMsg"]);
                self.logw(res);
                self.reported = false;
            });
            // })
        }
        else {
            console.log("时间：" +
                (this.gameTime >= this.ecpmObj.gameTime * 60) +
                "激励次数：" +
                (this.videoReward >= this.ecpmObj.targetVideo));
        }
    }
}
exports.default = TTAdMonitor;
