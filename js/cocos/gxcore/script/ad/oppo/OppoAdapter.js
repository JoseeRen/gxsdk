"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxGame_1 = __importDefault(require("../../GxGame"));
const GxTimer_1 = __importDefault(require("../../util/GxTimer"));
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const GxUtils_1 = __importDefault(require("../../util/GxUtils"));
const BaseAdapter_1 = __importDefault(require("../base/BaseAdapter"));
const GxEnum_1 = require("../../core/GxEnum");
const GxAdParams_1 = require("../../GxAdParams");
const GxGameUtil_1 = __importDefault(require("../../core/GxGameUtil"));
const DataStorage_2 = __importDefault(require("../../util/DataStorage"));
const GxConstant_1 = __importDefault(require("../../core/GxConstant"));
// import TDSDK from "../../td/TDSDK";
let GravityAnalyticsAPI = require("../../sdk/gravityengine.mg.cocoscreator.min");
class OppoAdapter extends BaseAdapter_1.default {
    constructor() {
        super(...arguments);
        // interIdx: number = 1;
        this.bannerIdx = 1;
        this.videoArr = [];
        this.videoNum = 0;
        this.ecpmObj = {
            targetEcpm: 0, //目标ecpm
            gameTime: 10, //目标游戏时长  分钟
            targetVideo: 3 //目标激励视频次数
        };
        this.checkInterval = 10; //10秒检查一次
        this.gameTime = 0;
        this.videoReward = 0;
        this.reported = false;
        this.canUpload = true;
        this.pkgName = "";
        this.videoShowing = false;
        this.showVideoTime = 0;
        this.openId = "";
        this.getOpenidTry = 0;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new OppoAdapter();
        }
        return this.instance;
    }
    initAd() {
        if (this.isInitAd)
            return;
        this.isInitAd = true;
        // this.getDeviceId();
        GxGame_1.default.adConfig.bannerUpdateTime = 5;
        this.getGameInfo();
        GxGame_1.default.adConfig.adCdTime = GxGame_1.default.gGN("delay", 60);
        let label = GxGame_1.default.gGB("z1");
        if (label) {
            GxGame_1.default.adConfig.adCdTime = 0;
        }
        this.isGameCd = false; //GxGame.adConfig.adCdTime > 0;
        this.logi("广告冷却：" + this.isGameCd);
        super.initAd();
        // @ts-ignore
        if (qg.getManifestInfo) {
            // @ts-ignore
            qg.getManifestInfo({
                success: (res) => {
                    // console.log(JSON.stringify(res.manifest));
                    let info = JSON.parse(res.manifest);
                    this.setManifestInfo(info);
                    // TDSDK.getInstance().init("DEBB78D26E894F4FB174FAA2A8F4DE24", info.package.replace(/\./g, "_"))
                },
                fail: function (err) {
                },
                complete: function (res) {
                }
            });
        }
        this.getOpenId((openId) => {
            if (!!openId) {
                this.initGravityEngine();
            }
            else {
                this.loge("获取不到openid无法初始化引力");
            }
        });
        this._gameCd();
        this.initBanner();
        this.initNormalBanner();
        //lsn  2024年5月10修改 视频参数可能多个
        this.videoArr = [];
        if (GxAdParams_1.AdParams.oppo.video.includes("_")) {
            this.videoArr = GxAdParams_1.AdParams.oppo.video.split("_");
        }
        this.initVideo();
        this.initNativeAd();
        this.initGamePortal();
        // ocpx 上传
        GxTimer_1.default.loop(() => {
            GxGame_1.default.uploadOcpx("gtime");
        }, 6e4);
        /*时候4 2023年9月4日11:30:59*/
        GxGame_1.default.adConfig.interTick = GxGame_1.default.gGN("ae", 10);
        /*修改3 2023年9月4日11:26:36*/
        this.ac();
        /* 修改2 2023年9月4日11:22:57 */
        this.ab();
        this.initAdMonitor();
    }
    ac() {
        let value = GxGame_1.default.gGN("ac", 20);
        setTimeout(() => {
            if (GxGame_1.default.gGB("ac")) {
                if (window["ovad"]._boxShowing) {
                    this.ac();
                    return;
                }
                this.privateShowInter(() => {
                    window["ovad"]._boxShowing = true;
                }, () => {
                    window["ovad"]._boxShowing = false;
                    this.ac();
                });
            }
        }, value * 1000);
    }
    ab() {
        let value = GxGame_1.default.gGN("ab", 35);
        setTimeout(() => {
            if (GxGame_1.default.gGB("ab")) {
                this._vv();
            }
        }, value * 1000);
    }
    _vv() {
        this.showVideo((res) => {
            let value = GxGame_1.default.gGN("ab", 35);
            setTimeout(() => {
                this._vv();
            }, value * 1000);
        }, "GxVV");
    }
    initAdMonitor() {
        this.getAdConfig();
        //@ts-ignore
        //10秒检查 一次
        setInterval(() => {
            if (this.canUpload) {
                this.checkAdTarget();
            }
            else {
                console.log("不用上报 可能没有配置");
            }
        }, this.checkInterval * 1000);
    }
    checkAdTarget() {
        this.gameTime += this.checkInterval;
        //玩游戏大于等于10分钟
        if (this.gameTime >= this.ecpmObj.gameTime * 60 && this.videoReward >= this.ecpmObj.targetVideo || window["rywDEBUG"]) {
            if (DataStorage_2.default.getItem("__oppoTaq__") == "true") {
                console.log("本地已经有上报记录了");
                return;
            }
            if (this.reported) {
                console.log("已经上报过了");
                return;
            }
            this.reported = true;
            let da = new Date();
            var year = da.getFullYear() + "年";
            var month = da.getMonth() + 1 + "月";
            var date = da.getDate() + "日";
            let data = [year, month, date].join("-");
            /*     let item = DataStorage.getItem("__oppo_lastTime__");
                 if (!item || item == "" || item == null) {
                     DataStorage.setItem("__oppo_lastTime__", data)
                     item = data;
                 }
                 if (item != data) {
                     console.log("不是当天的用户 不激活了")
                     return;
                 }*/
            let self = this;
            self.getDeviceId((deviceId) => {
                if (!!deviceId) {
                    self.uploadAction("rpkAction", (res) => {
                        if (res) {
                            DataStorage_2.default.setItem("__oppoTaq__", "true");
                        }
                    });
                }
                else {
                    self.reported = false;
                    console.log("deviceId为空");
                }
            });
        }
    }
    /* let actionDataType = {
         "active": 1,
         "register": 2,
         "day2": 4,
         "day3": 9,
         "day4": 10,
         "day5": 11,
         "day6": 12,
         "day7": 13,
         "day8": 14,
         "rpkAction": 19,//rpk用
         "gameAction": 20//apk用
     }*/
    uploadAction(actionName, callback) {
        if (!this.canUpload) {
            this.logi("没有配置 不用上报");
            callback && callback(false);
            return;
        }
        let self = this;
        this.getDeviceId((deviceId) => {
            if (!!deviceId) {
                let url = "";
                if (deviceId.length > 24) {
                    url = `https://ocpx.sjzgxwl.com/ocpx/oppo/rpk/action?pkg=${self.pkgName}&action=${actionName}&OAID=${deviceId}`;
                }
                else {
                    //不用加密  服务器加密后去查找
                    url = `https://ocpx.sjzgxwl.com/ocpx/oppo/rpk/action?pkg=${self.pkgName}&action=${actionName}&imeiMD5=${deviceId}`;
                }
                GxGameUtil_1.default.getInstance()._httpGets(url, {}, (res) => {
                    if (res != -1 && res != -2) {
                        self.logi(res);
                        let parse = JSON.parse(res);
                        if (!!parse && parse.code == 1) {
                            self.logi("上报成功：");
                            callback && callback(true);
                        }
                        else {
                            if (parse.code == -2) {
                                // 、、self.canUpload = false;
                                // self.logw('配置不存在 ！')
                                callback && callback(false);
                            }
                            else {
                                self.logw("上报失败2！" + res["msg"]);
                                callback && callback(false);
                                /*
                                                                setInterval(() => {
                                                                    self.getAdConfig()
                                                                }, 5000)*/
                            }
                        }
                    }
                    else {
                        self.logw("上报失败！" + res["msg"]);
                        callback && callback(false);
                    }
                });
            }
            else {
                console.log("deviceId空 不能上传 ");
                callback && callback(false);
            }
        });
    }
    getAdConfig() {
        let self = this;
        let saveKey = "oppo_install_time";
        if (window["qg"] && window["qg"]["getManifestInfo"]) {
            window["qg"].getManifestInfo({
                success: function (res) {
                    let data = JSON.parse(res.manifest);
                    self.logi(data);
                    self.pkgName = data["package"];
                    //获取配置的   激励次数和时长
                    GxGameUtil_1.default.getInstance()._httpGets("https://ocpx.sjzgxwl.com/ocpx/oppo/rpk/getconfig?pkg=" + data["package"], {}, (res) => {
                        if (res != -1 && res != -2) {
                            self.logi(res);
                            let parse = JSON.parse(res);
                            if (!!parse && parse.code == 1) {
                                self.logi("获取ecpm配置成功：");
                                self.ecpmObj = parse.data;
                                self.uploadAction("active", (res) => {
                                    if (res) {
                                        let item1 = DataStorage_2.default.getItem(saveKey);
                                        if (!item1) {
                                            DataStorage_2.default.setItem(saveKey, new Date().valueOf() + "");
                                        }
                                    }
                                    else {
                                        self.logi("上报激活失败");
                                    }
                                });
                                let installTime = DataStorage_2.default.getItem(saveKey);
                                if (!!installTime) {
                                    installTime = parseInt(installTime);
                                }
                                else {
                                    installTime = new Date().valueOf();
                                }
                                let installDate = new Date(new Date(installTime).toLocaleDateString()).valueOf();
                                let curDate = new Date().valueOf();
                                let number = curDate - installDate;
                                let number1 = Math.floor(number / 24 / 60 / 60 / 1000);
                                if (number1 >= 1 && number1 <= 7) {
                                    let arr = [
                                        "day2",
                                        "day3",
                                        "day4",
                                        "day5",
                                        "day6",
                                        "day7",
                                        "day8"
                                    ];
                                    let eventName = arr[number1 - 1];
                                    let item = DataStorage_2.default.getItem("tt_event_" + eventName);
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
                                        self.uploadAction(eventName, (res) => {
                                            if (res) {
                                                console.log("上报事件：" + eventName + ":成功");
                                                DataStorage_2.default.setItem("oppo_event_" + eventName, "success");
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
                            else {
                                if (parse.code == -2) {
                                    //配置不存在
                                    self.canUpload = false;
                                    self.logw("配置不存在 ！");
                                }
                                else {
                                    self.logw("获取ecpm配置失败2！" + res["msg"]);
                                    setTimeout(() => {
                                        self.getAdConfig();
                                    }, 5000);
                                }
                            }
                        }
                        else {
                            self.logw("获取ecpm配置失败！" + res["msg"]);
                            setTimeout(() => {
                                self.getAdConfig();
                            }, 5000);
                        }
                    });
                },
                fail: function (err) {
                    setTimeout(() => {
                        self.getAdConfig();
                    }, 5000);
                },
                complete: function (res) {
                }
            });
        }
        else {
            this.logi("版本低 不能获取 包名了");
        }
    }
    /*  md5Str(string) {
          if ((string + "").length <= 0) {
              return ""
          }

          function md5_RotateLeft(lValue, iShiftBits) {
              return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
          }

          function md5_AddUnsigned(lX, lY) {
              var lX4, lY4, lX8, lY8, lResult;
              lX8 = (lX & 0x80000000);
              lY8 = (lY & 0x80000000);
              lX4 = (lX & 0x40000000);
              lY4 = (lY & 0x40000000);
              lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
              if (lX4 & lY4) {
                  return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
              }
              if (lX4 | lY4) {
                  if (lResult & 0x40000000) {
                      return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                  } else {
                      return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                  }
              } else {
                  return (lResult ^ lX8 ^ lY8);
              }
          }

          function md5_F(x, y, z) {
              return (x & y) | ((~x) & z);
          }

          function md5_G(x, y, z) {
              return (x & z) | (y & (~z));
          }

          function md5_H(x, y, z) {
              return (x ^ y ^ z);
          }

          function md5_I(x, y, z) {
              return (y ^ (x | (~z)));
          }

          function md5_FF(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
          };

          function md5_GG(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
          };

          function md5_HH(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
          };

          function md5_II(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
          };

          function md5_ConvertToWordArray(string) {
              var lWordCount;
              var lMessageLength = string.length;
              var lNumberOfWords_temp1 = lMessageLength + 8;
              var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
              var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
              var lWordArray = Array(lNumberOfWords - 1);
              var lBytePosition = 0;
              var lByteCount = 0;
              while (lByteCount < lMessageLength) {
                  lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                  lBytePosition = (lByteCount % 4) * 8;
                  lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                  lByteCount++;
              }
              lWordCount = (lByteCount - (lByteCount % 4)) / 4;
              lBytePosition = (lByteCount % 4) * 8;
              lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
              lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
              lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
              return lWordArray;
          };

          function md5_WordToHex(lValue) {
              var WordToHexValue = "",
                  WordToHexValue_temp = "",
                  lByte, lCount;
              for (lCount = 0; lCount <= 3; lCount++) {
                  lByte = (lValue >>> (lCount * 8)) & 255;
                  WordToHexValue_temp = "0" + lByte.toString(16);
                  WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
              }
              return WordToHexValue;
          };

          function md5_Utf8Encode(string) {
              string = string.toString().replace(/\r\n/g, "\n");
              var utftext = "";
              for (var n = 0; n < string.length; n++) {
                  var c = string.charCodeAt(n);
                  if (c < 128) {
                      utftext += String.fromCharCode(c);
                  } else if ((c > 127) && (c < 2048)) {
                      utftext += String.fromCharCode((c >> 6) | 192);
                      utftext += String.fromCharCode((c & 63) | 128);
                  } else {
                      utftext += String.fromCharCode((c >> 12) | 224);
                      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                      utftext += String.fromCharCode((c & 63) | 128);
                  }
              }
              return utftext;
          };
          var x = Array();
          var k, AA, BB, CC, DD, a, b, c, d;
          var S11 = 7,
              S12 = 12,
              S13 = 17,
              S14 = 22;
          var S21 = 5,
              S22 = 9,
              S23 = 14,
              S24 = 20;
          var S31 = 4,
              S32 = 11,
              S33 = 16,
              S34 = 23;
          var S41 = 6,
              S42 = 10,
              S43 = 15,
              S44 = 21;
          string = md5_Utf8Encode(string);
          x = md5_ConvertToWordArray(string);
          a = 0x67452301;
          b = 0xEFCDAB89;
          c = 0x98BADCFE;
          d = 0x10325476;
          for (k = 0; k < x.length; k += 16) {
              AA = a;
              BB = b;
              CC = c;
              DD = d;
              a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
              d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
              c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
              b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
              a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
              d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
              c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
              b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
              a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
              d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
              c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
              b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
              a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
              d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
              c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
              b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
              a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
              d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
              c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
              b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
              a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
              d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
              c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
              b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
              a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
              d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
              c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
              b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
              a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
              d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
              c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
              b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
              a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
              d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
              c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
              b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
              a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
              d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
              c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
              b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
              a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
              d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
              c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
              b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
              a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
              d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
              c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
              b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
              a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
              d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
              c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
              b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
              a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
              d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
              c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
              b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
              a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
              d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
              c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
              b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
              a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
              d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
              c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
              b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
              a = md5_AddUnsigned(a, AA);
              b = md5_AddUnsigned(b, BB);
              c = md5_AddUnsigned(c, CC);
              d = md5_AddUnsigned(d, DD);
          }
          return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
      }

   */
    // @ts-ignore
    getDeviceId(callback) {
        //最低1096
        if (window["qg"].getDeviceId) {
            window["qg"].getDeviceId({
                success: data => {
                    this.logi(`deviceId get success: ${JSON.stringify(data)}`);
                    if (data && data.deviceId && DataStorage_1.default.deviceid != data.deviceId) {
                        DataStorage_1.default.deviceid = data.deviceId;
                    }
                    callback && callback(data.deviceId);
                    this.logi(DataStorage_1.default.deviceid);
                },
                fail: (data, code) => {
                    this.loge(`deviceId  get fail, code = ${code}`);
                    callback && callback(null);
                }
            });
        }
        else {
            console.log("不支持获取");
            callback && callback(null);
        }
    }
    getGameInfo() {
        if (window["qg"].getManifestInfo) {
            window["qg"].getManifestInfo({
                success: res => {
                    const ret = JSON.parse(res.manifest);
                    GxGame_1.default.gameInfo = {
                        package: ret.package,
                        name: ret.name,
                        versionName: ret.versionName,
                        versionCode: ret.versionCode
                    };
                    this.logi(JSON.stringify(GxGame_1.default.gameInfo));
                }
            });
        }
    }
    _gameCd() {
        let timer = new GxTimer_1.default();
        timer.once(() => {
            this.isGameCd = false;
            if (this.isNeedShowBanner) {
                this.showBanner(null, null);
            }
        }, GxGame_1.default.adConfig.adCdTime * 1000);
    }
    /**
     * 初始化普通banner
     */
    initNormalBanner() {
        if (this.platformVersion() < 1051 || GxAdParams_1.AdParams.oppo.banner.length <= 0) {
            this.logi("环境不支持banner  或者banner广告参数空");
            return;
        }
        this.destroyNormalBanner();
        let screenWidth = GxGame_1.default.screenWidth;
        let screenHeight = GxGame_1.default.screenHeight;
        let width = 500;
        let height = 200;
        let bannerShowTop = GxAdParams_1.AdParams.oppo.bannerOnTop;
        if (screenWidth > screenHeight) {
            width = 900;
            height = 200;
        }
        else {
            width = 900;
            height = 200;
        }
        let style = {
        /*left: (screenWidth - width) / 2,
        width: width,
        height: height*/
        };
        if (bannerShowTop) {
            style["top"] = 0;
        }
        this.bannerAd = window["qg"].createBannerAd({
            adUnitId: GxAdParams_1.AdParams.oppo.banner,
            style: style
        });
        this.bannerAd.onError(err => {
            this.loge("normal banner error: ", JSON.stringify(err));
        });
    }
    /**
     * 展示普通banner
     */
    showNormalBanner(showCallback, failedCallback) {
        if (this.bannerAd == null) {
            this.initNormalBanner();
        }
        if (this.bannerAd == null) {
            this.logi("banner空");
            failedCallback && failedCallback();
            return;
        }
        this.bannerAd.show().then(() => {
            showCallback && showCallback();
            this.logi("normal banner show success");
            if (GxGame_1.default.adConfig.bannerUpdateTime <= 0) {
                if (this.bannerTimer)
                    this.bannerTimer.stop();
            }
        }).catch(e => {
            failedCallback && failedCallback();
            this.loge("banner error", e);
        });
    }
    /**
     * 隐藏普通banner
     */
    hideNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }
    /**
     * 销毁普通banner
     */
    destroyNormalBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
        }
    }
    initBanner() {
        super.initBanner();
    }
    showBanner(showCallback, failedCallback) {
        if (this.isGameCd) {
            this.isNeedShowBanner = true;
            failedCallback && failedCallback();
            this.logi("showBanner 广告CD中");
            return;
        }
        this.hideBanner();
        //  this.bannerDelayTimer = mTimer.once(() => {
        // this.logi("GxGame.adConfig.bannerUpdateTime" + GxGame.adConfig.bannerUpdateTime)
        // if (GxGame.adConfig.bannerUpdateTime > 0) {
        //   if (this.bannerTimer == null) {
        //     this.bannerTimer = new mTimer();
        //   }
        //   this.bannerTimer && this.bannerTimer.once(() => {
        //     this.showBanner(showCallback, failedCallback);
        //   }, GxGame.adConfig.bannerUpdateTime * 1000);
        // }
        // this.logi("bannerIdx:" + this.bannerIdx)
        // if (this.bannerIdx % 2 == 1) {
        //   let native_data = null;
        //   if (GxGame.adConfig.useNative) {
        //     native_data = this.getLocalNativeData(ad_native_type.banner);
        //   } else {
        //     native_data = this.create_custom_ad(ad_native_type.banner)
        //   }
        //   if (native_data == null || native_data === undefined) {
        //     this.logi("原生banner数据空:")
        //     failedCallback && failedCallback()
        //     /*this.bannerIdx++;
        //     this.showNormalBanner(showCallback, failedCallback);*/
        //   } else {
        //     if (GxGame.adConfig.useNative) {
        //       let node = cc.instantiate(Utils.getRes('gx/prefab/ad/native_banner', cc.Prefab));
        //       this.bannerNode = node.getComponent('gx_native_banner');
        //       this.bannerNode.show(native_data, () => {
        //       }, () => {
        //         if (GxGame.adConfig.bannerUpdateTime <= 0) {
        //           this.bannerTimer && this.bannerTimer.clear();
        //         }
        //       });
        //       showCallback && showCallback();
        //     } else {
        //       native_data
        //         .show()
        //         .then(() => {
        //           this.logi("custom banner成功")
        //           this.customBanner = native_data;
        //           showCallback && showCallback();
        //         })
        //         .catch((error) => {
        //           this.logi("custom show fail with:" + error.errCode + "," + error.errMsg);
        //           failedCallback && failedCallback()
        //         });
        //     }
        //     this.hideNormalBanner();
        //   }
        // } else {
        this.showNormalBanner(showCallback, failedCallback);
        // }
        // this.bannerIdx++;
        // }, 1000);
    }
    hideBanner() {
        super.hideBanner();
        this.isNeedShowBanner = false;
        if (this.customBanner) {
            this.customBanner.hide();
            this.customBanner.destroy();
            this.customBanner = null;
        }
        this.hideNormalBanner();
    }
    initVideo() {
        if (!GxAdParams_1.AdParams.oppo.video) {
            this.logi("video广告位参数空");
            return;
        }
        this.destroyVideo();
        this.videoAd = window["qg"].createRewardedVideoAd({
            adUnitId: this.videoArr.length > 0 ? this.videoArr[this.videoNum] : GxAdParams_1.AdParams.oppo.video
        });
        this.videoAd.onLoad(() => {
            this.logi("video load succ");
        });
        this.videoAd.onError((err) => {
            if (this.videoArr.length > 0) {
                this.videoNum++;
                if (this.videoNum < this.videoArr.length) {
                    this.initVideo();
                }
                else {
                    this.logi("video error: " + JSON.stringify(err), "color: red");
                    this._videoErrorEvent();
                }
            }
            else {
                this.logi("video error: " + JSON.stringify(err), "color: red");
                this._videoErrorEvent();
            }
        });
        this.videoAd.onClose(res => {
            if (res && res.isEnded) {
                this.videoReward++;
                this.checkAdTarget();
                this.videocallback && this.videocallback(true, 1);
                this._videoCompleteEvent();
            }
            else {
                this._videoCloseEvent();
                this.videocallback && this.videocallback(false, 0);
                /*   let node = cc.instantiate(Utils.getRes('hs_ui/ui_watch_video', cc.Prefab));
                   let ui_watch_video = node.getComponent('hs_ui_watch_video');
                   ui_watch_video && ui_watch_video.show(() => {
                       this.showVideo(this.videocallback);
                   });*/
            }
            this.videoShowing = false;
            this.videoAd.load();
        });
        this.videoAd.load();
    }
    showVideo(complete, flag = "") {
        // 过滤多次触发
        if (this.get_time() - this.showVideoTime < 5000) {
            complete && complete(false, 0);
            return;
        }
        this.showVideoTime = this.get_time();
        if (this.videoShowing) {
            complete && complete(false, 0);
            return;
        }
        super.showVideo(null, flag);
        this._videoCallEvent(flag);
        this.videoShowing = true;
        if (this.videoAd == null) {
            this.initVideo();
        }
        if (this.videoAd == null) {
            this.createToast("暂无视频，请稍后再试");
            this.videoShowing = false;
            this._videoErrorEvent();
            complete && complete(false, 0);
            return;
        }
        this.videocallback = complete;
        this.videoAd.show().then(() => {
        }).catch(() => {
            this._videoErrorEvent();
            this.createToast("暂无视频，请稍后再试");
            complete && complete(false, 0);
            this.videoShowing = false;
        });
    }
    destroyVideo() {
        if (this.videoAd) {
            this.videoAd.offLoad();
            this.videoAd.offError();
            this.videoAd.offClose();
        }
        this.videoAd = null;
    }
    create_ad(ad_type) {
        return new Promise((resolve, reject) => {
            let posId = "";
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                posId = GxAdParams_1.AdParams.oppo.native_banner;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.oppo.native1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.oppo.native2;
            }
            // this.logi(ad_type, "posId = ", posId);
            if (posId == "" || posId === undefined || posId == null || this.is_limit_native_length(ad_type) || this.platformVersion() < 1051)
                return resolve(null);
            let nativeAd = window["qg"].createNativeAd({
                adUnitId: posId
            });
            let on_load = (res) => {
                this.logi("native data load:");
                if (res && res.adList) {
                    let data = res.adList.pop();
                    data.ad = nativeAd;
                    data.type = ad_type;
                    this.add_native_data(data);
                    this.logi("native data load succ:" + JSON.stringify(data));
                    nativeAd.offLoad(on_load);
                }
            };
            nativeAd.onLoad(on_load);
            let on_error = (err) => {
                this.logi("native data error: " + JSON.stringify(err), "color: red");
                nativeAd.offError(on_error);
            };
            nativeAd.onError(on_error);
            nativeAd.load();
            setTimeout(resolve, 500);
        });
    }
    create_custom_ad(ad_type) {
        let posId = "";
        let style = {};
        // 定义 CustomAd 左上角距离屏幕左边的距离，不传默认为底部居中，宽度为屏幕短边
        if (ad_type == GxEnum_1.ad_native_type.banner) {
            posId = GxAdParams_1.AdParams.oppo.native_banner || GxAdParams_1.AdParams.oppo.native_custom_banner;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.oppo.native_custom_banner;
            }
        }
        else if (ad_type == GxEnum_1.ad_native_type.inter1) {
            posId = GxAdParams_1.AdParams.oppo.native1 || GxAdParams_1.AdParams.oppo.native_custom1;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.oppo.native_custom1;
            }
        }
        else if (ad_type == GxEnum_1.ad_native_type.inter2) {
            posId = GxAdParams_1.AdParams.oppo.native2 || GxAdParams_1.AdParams.oppo.native_custom2;
            if (!GxGame_1.default.adConfig.useNative) {
                posId = GxAdParams_1.AdParams.oppo.native_custom2;
            }
        }
        if (ad_type == GxEnum_1.ad_native_type.banner) {
            if (GxAdParams_1.AdParams.oppo.bannerOnTop) {
                style["top"] = 0;
            }
            else {
            }
        }
        else {
            let shortWidth = Math.min(GxGame_1.default.screenWidth, GxGame_1.default.screenHeight);
            let width = shortWidth * 0.85;
            let height = width / 16 * 15.125; //16	15.125
            //插屏 宽都是256  高  218   242   188 212 四种
            let left = (GxGame_1.default.screenWidth - width) / 2;
            let top = (GxGame_1.default.screenHeight - height) / 2 + 150; //0518策略往下挪点
            style["width"] = width;
            style["left"] = left;
            style["top"] = top;
            // console.log(JSON.stringify(style))
        }
        // this.logi(ad_type, "posId = ", posId);
        if (posId == "" || posId === undefined || posId == null || this.platformVersion() < 1094)
            return null;
        let nativeAd = window["qg"].createCustomAd({
            adUnitId: posId,
            style: style
        });
        return nativeAd;
        return new Promise((resolve, reject) => {
            let posId = "";
            let style = {};
            // 定义 CustomAd 左上角距离屏幕左边的距离，不传默认为底部居中，宽度为屏幕短边
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                posId = GxAdParams_1.AdParams.oppo.native_banner || GxAdParams_1.AdParams.oppo.native_custom_banner;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter1) {
                posId = GxAdParams_1.AdParams.oppo.native1 || GxAdParams_1.AdParams.oppo.native_custom1;
            }
            else if (ad_type == GxEnum_1.ad_native_type.inter2) {
                posId = GxAdParams_1.AdParams.oppo.native2 || GxAdParams_1.AdParams.oppo.native_custom2;
            }
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                if (GxAdParams_1.AdParams.oppo.bannerOnTop) {
                    style["top"] = 0;
                }
                else {
                }
            }
            else {
                let shortWidth = Math.min(GxGame_1.default.screenWidth, GxGame_1.default.screenHeight);
                let width = shortWidth * 0.85;
                let height = width / 16 * 15.125; //16	15.125
                //插屏 宽都是256  高  218   242   188 212 四种
                let left = (GxGame_1.default.screenWidth - width) / 2;
                let top = (GxGame_1.default.screenHeight - height) / 2;
                style["width"] = width;
                style["left"] = left;
                style["top"] = top;
                // console.log(JSON.stringify(style))
            }
            // this.logi(ad_type, "posId = ", posId);
            if (posId == "" || posId === undefined || posId == null || this.platformVersion() < 1094)
                return resolve(null);
            let nativeAd = window["qg"].createCustomAd({
                adUnitId: posId,
                style: style
            });
            /* let on_load = (res) => {
                 this.logi("custom data load succ:");


                 nativeAd.offLoad(on_load);
                 if (ad_type == ad_native_type.banner) {
                     this._native_custom_banner_cache.push(nativeAd)

                 } else {
                     this._native_custom_inter_cache.push(nativeAd)

                 }

             }
             nativeAd.onLoad(on_load);

             let on_error = (err) => {
                 this.logi("custom data error: " + JSON.stringify(err));
                 nativeAd.offError(on_error);
             }
             nativeAd.onError(on_error);

             nativeAd.load();*/
            if (ad_type == GxEnum_1.ad_native_type.banner) {
                this._native_custom_banner_cache.push(nativeAd);
            }
            else {
                this._native_custom_inter_cache.push(nativeAd);
            }
            setTimeout(resolve, 500);
        });
    }
    /**原生广告 */
    initNativeAd() {
        // 拉取间隔1s
        if (GxGame_1.default.adConfig.useNative) {
            this.logi("使用原生自渲染广告");
            this.create_ad(GxEnum_1.ad_native_type.banner).then(() => {
                return this.create_ad(GxEnum_1.ad_native_type.inter1);
            }).then(() => {
                return this.create_ad(GxEnum_1.ad_native_type.inter2);
            }).then(() => {
                this.loop_get_native_data();
            }); /* this.create_ad(ad_native_type.banner).then(() => {
            return this.create_ad(ad_native_type.native_icon);
        }).then(() => {
            return this.create_ad(ad_native_type.inter1);
        }).then(() => {
            return this.create_ad(ad_native_type.inter2);
        }).then(() => {
            this.loop_get_native_data();
        })*/
        }
        else {
            this.logi("使用原生模板广告");
            /* this.create_custom_ad(ad_native_type.banner).then(() => {
                 return this.create_custom_ad(ad_native_type.inter1);
             }).then(() => {
                 return this.create_custom_ad(ad_native_type.inter2);
             }).then(() => {
                 this.loop_get_custom_data();
             })*/
        }
    }
    showInterstitialNative(parent, on_click, on_show, on_hide) {
        on_hide && on_hide();
        this.logi("不使用这个广告");
        return;
        if (this.isGameCd) {
            on_hide && on_hide();
            return this.logi("广告CD中");
        }
        this.hideInterstitialNative();
        let native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
        if (native_data == null || native_data === undefined) {
            on_hide && on_hide();
        }
        else {
            this.isNeedShowBanner = false;
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_inner_interstitial", cc.Prefab));
            this.innerInter = node.getComponent("gx_native_inner_interstitial");
            this.innerInter && this.innerInter.show(parent, native_data, on_click, () => {
                // this.hideBanner();
                on_show && on_show();
            }, on_hide);
        }
    }
    /**隐藏原生横幅 */
    hideInterstitialNative() {
        super.hideInterstitialNative();
    }
    /**
     * 原生插屏
     * @param on_show 成功展示回调
     * @param on_hide 隐藏回调
     * @param on_fail
     * @returns
     */
    showNativeInterstitial(on_show, on_hide, delay_time = 0) {
        if (window["ovad"]._boxShowing)
            return;
        window["ovad"]._boxShowing = true;
        if (this.isGameCd) {
            on_hide && on_hide();
            this.logi("showNativeInterstitial 广告CD中");
            return;
        }
        window["ovad"]._boxShowing = true;
        setTimeout(() => {
            this.privateShowInter(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    privateShowInter(on_show, on_hide) {
        if (this.get_time() - this.interShowTime <= GxGame_1.default.adConfig.interTick * 1000 || GxGame_1.default.isShenHe) {
            this.logi("限制了2");
            window["ovad"]._boxShowing = false;
            return on_hide && on_hide();
        }
        this.hideNativeInterstitial();
        // this.hideBanner();
        let native_data = null;
        let tmpInter = 0;
        //循环加兜底
        if (GxGame_1.default.adConfig.useNative) {
            if (this.interIdx % 2 == 1) {
                native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
                tmpInter = GxEnum_1.ad_native_type.inter1;
                if (native_data == null || native_data === undefined) {
                    native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
                    tmpInter = GxEnum_1.ad_native_type.inter2;
                }
            }
            else {
                native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter2);
                tmpInter = GxEnum_1.ad_native_type.inter2;
                if (native_data == null || native_data === undefined) {
                    native_data = this.getLocalNativeData(GxEnum_1.ad_native_type.inter1);
                    tmpInter = GxEnum_1.ad_native_type.inter1;
                }
            }
        }
        else {
            if (this.interIdx % 2 == 1) {
                native_data = this.create_custom_ad(GxEnum_1.ad_native_type.inter1);
                tmpInter = GxEnum_1.ad_native_type.inter1;
            }
            else {
                native_data = this.create_custom_ad(GxEnum_1.ad_native_type.inter2);
                tmpInter = GxEnum_1.ad_native_type.inter2;
            }
        }
        this.interIdx++;
        this.logi("显示:" + tmpInter);
        if (native_data == null || native_data === undefined) {
            this.logi("native_data null");
            window["ovad"]._boxShowing = false;
            on_hide && on_hide();
        }
        else {
            if (GxGame_1.default.adConfig.useNative) {
                this.logi("native inter ");
                /*if (Utils.randomInt(1, 100) > GxGame.adConfig.showInterRto) {
              this.logi("限制了3")

              return on_hide && on_hide()
          }*/
                let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_interstitial", cc.Prefab));
                this.nativeInter = node.getComponent("gx_native_interstitial");
                this.nativeInter && this.nativeInter.show(native_data, () => {
                    this.interShowTime = this.get_time();
                    // this.hideBanner();
                    window["ovad"]._boxShowing = true;
                    on_show && on_show();
                }, () => {
                    window["ovad"]._boxShowing = false;
                    on_hide && on_hide();
                });
            }
            else {
                if (this.customInter) {
                    this.customInter.destroy();
                    this.customInter = null;
                }
                this.logi("custom inter ");
                native_data.onHide(() => {
                    // console.log("隐藏block")
                    if (window["cc"]) {
                        let childByName = cc.director.getScene().getChildByName("BLOCK");
                        if (childByName) {
                            childByName.destroy();
                        }
                    }
                    native_data && native_data.offHide();
                    window["ovad"]._boxShowing = false;
                    on_hide && on_hide();
                });
                try {
                    native_data
                        .show()
                        .then(() => {
                        this.interShowTime = this.get_time();
                        // console.log("显示block")
                        if (window["cc"]) {
                            let childByName = cc.director.getScene().getChildByName("BLOCK");
                            if (!childByName) {
                                let node = new cc.Node();
                                node.width = 2000;
                                node.height = 2000;
                                node.name = "BLOCK";
                                cc.director.getScene().addChild(node);
                                node.zIndex = cc.macro.MAX_ZINDEX;
                                node.addComponent(cc.BlockInputEvents);
                                let winSize = cc.winSize;
                                node.x = winSize.width / 2;
                                node.y = winSize.height / 2;
                                let t = 0;
                                node.on(cc.Node.EventType.TOUCH_START, () => {
                                    t++;
                                    console.log("触摸了");
                                    if (t == 4) {
                                        node.destroy();
                                    }
                                });
                            }
                        }
                        this.customInter = native_data;
                        this.logi("show custom inter  success");
                        on_show && on_show();
                    })
                        .catch((error) => {
                        this.logi("show custom inter fail with:" + error.errCode + "," + error.errMsg);
                        window["ovad"]._boxShowing = false;
                        on_hide && on_hide();
                        if (window["cc"]) {
                            let childByName = cc.director.getScene().getChildByName("BLOCK");
                            if (childByName) {
                                childByName.destroy();
                            }
                        }
                    });
                }
                catch (e) {
                    this.logi("catch error");
                    this.logi(e);
                    window["ovad"]._boxShowing = false;
                    on_hide && on_hide();
                    if (window["cc"]) {
                        let childByName = cc.director.getScene().getChildByName("BLOCK");
                        if (childByName) {
                            childByName.destroy();
                        }
                    }
                }
            }
        }
    }
    showOtherNativeInterstitial(on_show, on_hide, delay_time = 0) {
        /*修改5 2023年9月4日11:44:48*/
        let label = GxGame_1.default.gGB("af");
        if (!label) {
            this.logi("限制了1");
            on_hide && on_hide();
            return;
        }
        if (this.isGameCd) {
            on_hide && on_hide();
            this.logi("showNativeInterstitial 广告CD中");
            return;
        }
        let canShow = false;
        /*  let icLabel = GxGame.gGB("ic");
          if (icLabel) {
  */
        /*去掉了  let value = GxGame.gGN("ic", 0);
        if (value > 0) {
            if (this.icNum == -1) {
                this.icNum = value;
                setInterval(() => {
                    console.log("重置icNum")
                    this.icNum = value;
                }, 90 * 1000)
            }
            if (this.icNum > 0) {
                this.icNum--;
                canShow = true
            } else {
                console.log("icNum <0")
            }
        } else {
            console.log("ic <0")
        }*/
        /*
                } else {
                    console.log("ic false")
                }*/
        canShow = true;
        if (!canShow) {
            on_hide && on_hide();
            this.logi("canShow ==false");
            return;
        }
        GxTimer_1.default.once(() => {
            this.privateShowInter(on_show, on_hide);
        }, (GxGame_1.default.isShenHe) ? 0 : delay_time * 1000);
    }
    /**
     * 原生ICON
     * @param parent
     */
    showNativeIcon(parent) {
        if (this.isGameCd) {
            return this.logi("showNativeIcon 广告CD中");
        }
        if (!GxGame_1.default.adConfig.useNative) {
            return this.logi("native无法显示 现在是custom ");
            return;
        }
        // 特殊处理
        let type = GxEnum_1.ad_native_type.native_icon;
        let posId = GxAdParams_1.AdParams.oppo.native_icon;
        if (posId == GxAdParams_1.AdParams.oppo.native1) {
            type = GxEnum_1.ad_native_type.inter1;
        }
        else if (posId == GxAdParams_1.AdParams.oppo.native_banner) {
            type = GxEnum_1.ad_native_type.banner;
        }
        let native_data = this.getLocalNativeData(type);
        if (native_data == null || native_data === undefined) {
            return this.logi("showNativeIcon 暂无广告数据");
        }
        else {
            let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/ad/native_icon", cc.Prefab));
            this.nativeIcon = node.getComponent("gx_native_icon");
            this.nativeIcon && this.nativeIcon.show(parent, native_data);
        }
    }
    /**隐藏原生ICON */
    hideNativeIcon() {
        super.hideNativeIcon();
    }
    /**
     * 每隔n秒加载一条数据，保持数组内各类型数据有5条
     */
    loop_get_native_data() {
        let nextTimeLeft = this._native_data_cache.length < 5 ? GxUtils_1.default.randomInt(15, 20) * 1000 : 30000;
        setTimeout(this.initNativeAd.bind(this), nextTimeLeft);
    }
    loop_get_custom_data() {
        let nextTimeLeft = (this._native_custom_inter_cache.length < 5 || this._native_custom_banner_cache.length < 5) ? GxUtils_1.default.randomInt(15, 20) * 1000 : 30000;
        setTimeout(this.initNativeAd.bind(this), nextTimeLeft);
    }
    /**
     * 盒子9宫格
     */
    initGamePortal() {
        let self = this;
        if (this.supportGameBox() && GxAdParams_1.AdParams.oppo.gamePortal && window["qg"].createGamePortalAd) {
            this.destroyGamePortal();
            this.portalAd = window["qg"].createGamePortalAd({
                adUnitId: GxAdParams_1.AdParams.oppo.gamePortal
            });
            this.portalAd.onLoad(function () {
                self.logi("game portal ad load succ");
            });
            this.portalAd.onClose(() => {
                self._game_portal_hide && this._game_portal_hide();
            });
            this.portalAd.onError(function (err) {
                self.logi("game portal ad error: " + JSON.stringify(err), "color: red");
            });
        }
    }
    showGamePortal(on_show, on_hide, show_toast = true) {
        if (!this.supportGameBox())
            return on_hide && on_hide();
        if (!this.portalAd) {
            this.initGamePortal();
        }
        if (!this.portalAd) {
            on_hide && on_hide();
            show_toast && this.createToast("努力加载中,请稍后再试~");
            return;
        }
        this._game_portal_hide = on_hide;
        this.portalAd.load().then(() => {
            this.portalAd.show().then(() => {
                this.logi("show success");
                this.hideBanner();
                on_show && on_show();
            }).catch(error => {
                this.loge("showGamePortal show error:", error);
                on_hide && on_hide();
                show_toast && this.createToast("努力加载中,请稍后再试~");
            });
        }).catch(error => {
            this.loge("showGamePortal load error:", error);
            on_hide && on_hide();
            show_toast && this.createToast("努力加载中,请稍后再试~");
        });
    }
    destroyGamePortal() {
        if (!this.portalAd)
            return;
        this.portalAd.destroy();
        this.portalAd = null;
    }
    /**
     * 盒子横幅
     */
    initGameBanner() {
        let self = this;
        if (window["qg"].getSystemInfoSync()["platformVersion"] >= 1076 && GxAdParams_1.AdParams.oppo.gameBanner && window["qg"].createGameBannerAd) {
            this.destroyGameBanner();
            this.gameBannerAd = window["qg"].createGameBannerAd({
                adUnitId: GxAdParams_1.AdParams.oppo.gameBanner
            });
            this.gameBannerAd.onLoad(function () {
                self.logi("盒子横幅广告加载成功");
            });
            this.gameBannerAd.onError(function (err) {
                self.logi(err);
            });
        }
        else {
        }
    }
    showGameBanner() {
        let self = this;
        if (!this.gameBannerAd) {
            this.initGameBanner();
        }
        if (!this.gameBannerAd)
            return;
        this.gameBannerAd.show().then(function () {
            self.logi("show success");
        }).catch(function (error) {
            self.logi("show fail with:" + error.errCode + "," + error.errMsg);
        });
    }
    hideGameBanner() {
        if (!this.gameBannerAd)
            return;
        this.gameBannerAd.hide();
    }
    destroyGameBanner() {
        if (!this.gameBannerAd)
            return;
        this.gameBannerAd.destroy();
        this.gameBannerAd = null;
    }
    /**
     * 展示添加桌面界面
     * @param on_close
     * @param on_succ
     */
    showAddDesktop(on_close, on_succ) {
        if (this.addIconNode && this.addIconNode !== undefined && cc.isValid(this.addIconNode.node))
            return;
        let node = cc.instantiate(GxUtils_1.default.getRes("gx/prefab/add_icon", cc.Prefab));
        this.addIconNode = node.getComponent("Gx_add_icon");
        this.addIconNode && this.addIconNode.show(on_close, on_succ);
    }
    /**判断是否支持添加桌面 */
    hasAddDesktop(can_add, has_add, on_fail) {
        if (this.platformVersion() >= 1044 && window["qg"].hasShortcutInstalled) {
            window["qg"].hasShortcutInstalled({
                success: res => {
                    // 判断图标未存在时，创建图标
                    this.logi(" hasShortcutInstalled " + (res ? "has add" : "can add"));
                    if (res == false) {
                        can_add && can_add();
                    }
                    else {
                        has_add && has_add();
                    }
                },
                fail: err => {
                    this.loge(` hasShortcutInstalled error: ${JSON.stringify(err)}`);
                    on_fail && on_fail();
                },
                complete: function () {
                }
            });
        }
        else {
            on_fail && on_fail();
        }
    }
    /**创建桌面图标 */
    addDesktop(on_succ, on_fail, showToast = true) {
        if (this.platformVersion() >= 1040 && window["qg"].installShortcut) {
            window["qg"].installShortcut({
                success: () => {
                    setTimeout(() => {
                        this.hasAddDesktop(() => {
                            on_fail && on_fail();
                        }, () => {
                            on_succ && on_succ();
                        });
                    }, 1000);
                },
                fail: err => {
                    this.loge(` installShortcut error: ${JSON.stringify(err)}`);
                    on_fail && on_fail();
                    if (showToast) {
                        //@ts-ignore
                        window["qg"].showToast({
                            title: "请稍后再试",
                            icon: "none"
                        });
                    }
                }
            });
        }
        else {
            on_fail && on_fail();
        }
    }
    login(on_succ, on_fail) {
        if (this.platformVersion() >= 1040 && window["qg"].login) {
            window["qg"].login({
                success: res => {
                    on_succ && on_succ(res);
                },
                //@ts-ignore
                fail: (err) => {
                    on_fail && on_fail(err);
                }
            });
        }
    }
    reportAdClick(native_data) {
        super.reportAdClick(native_data);
        // ocpx 上传
        GxGame_1.default.uploadOcpx("gads");
    }
    /**
     * 开局自动跳转原生
     * @returns
     */
    openGameAd() {
        if (!GxGame_1.default.isShenHe && GxGame_1.default.adConfig.showBanner > 0) {
            GxTimer_1.default.once(() => {
                this.clickNative();
            }, GxGame_1.default.adConfig.showBanner * 1000);
        }
    }
    logi(...data) {
        super.LOG("[OppoAdapter]", ...data);
    }
    loge(...data) {
        super.LOGE("[OppoAdapter]", ...data);
    }
    logw(...data) {
        super.LOGW("[OppoAdapter]", ...data);
    }
    showGameOverAD() {
        this.showVideo((res) => {
        }, "GxGameOverAd");
    }
    userFrom(callback) {
        //现在还没找到他用什么方法
        //@ts-ignore
        if (window["testDataToServer"] && testDataToServer.isAdUser) {
            return callback && callback(true);
        }
        callback && callback(false);
        /*    try {
                let clickId = DataStorage.getItem("__clickid__");

                if (!!clickId) {
                    return callback && callback(true);

                }

                let launchOptionsSync = wx.getLaunchOptionsSync();
                let query = launchOptionsSync.query;
                clickId = query["gdt_vid"];

                if (!!clickId) {
                    DataStorage.setItem("__clickid__", clickId);
                    return callback && callback(true);
                }
                let queryElement = query["weixinadinfo"];
                if (queryElement) {
                    // aid.traceid.scene_type.0
                    let aid = queryElement.weixinadinfo.split(".")[0];

                    if (!!aid) {
                        return callback && callback(true);


                    }


                }


                /!*    if (this.gxEngine == null) {
                        return callback && callback(false);

                    }

                    let clickId1 = this.gxEngine.getClickId();
                    if (!!clickId1) {
                        return callback && callback(true);

                    }*!/
                return callback && callback(false);


            } catch (e) {
                callback && callback(false);

            }*/
    }
    showPositionBanner(left, top, showCallback, failedCallback) {
        this.hideBanner();
        if (!!GxAdParams_1.AdParams.oppo.banner) {
            this.bannerAd = window["qg"].createBannerAd({
                adUnitId: GxAdParams_1.AdParams.oppo.banner,
                style: { left: left, top: top }
            });
            this.bannerAd.onError(err => {
                this.loge(" position normal banner error: ", JSON.stringify(err));
            });
            if (this.bannerAd == null) {
                this.logi("position banner空");
                failedCallback && failedCallback();
                return;
            }
            this.bannerAd.show().then(() => {
                showCallback && showCallback();
                this.logi("position normal banner show success");
            }).catch(e => {
                failedCallback && failedCallback();
                this.loge("position banner error", e);
            });
        }
        else {
            failedCallback && failedCallback();
        }
    }
    getOpenId(callback) {
        let self = this;
        if (self.getOpenidTry >= 5) {
            self.getOpenidTry = 0;
            console.warn("获取openId重试最大次数了");
            callback && callback(null);
            return;
        }
        let item = DataStorage_2.default.getItem("__gx_openId__", null);
        if (!!item) {
            console.log("获取到缓存的openid：" + item);
            self.openId = item;
            callback && callback(item);
            return;
        }
        // @ts-ignore
        qg.login({
            success: function (res) {
                //@ts-ignore
                if (res.data.token) {
                    // 使用token进行服务端对接
                    let request = () => {
                        self.requestNet({
                            //@ts-ignore
                            url: `${GxConstant_1.default.Code2SessionUrl}/ov?packageName=${GxAdParams_1.AdParams.oppo.packageName}&token=${res.data.token}&platform=oppo`,
                            successCallback: (res) => {
                                try {
                                    self.logi(JSON.stringify(res.data));
                                }
                                catch (e) {
                                }
                                if (res.data.code == 1) {
                                    self.openId = res.data.data.openid;
                                    self.logi("获取openid成功：" + self.openId);
                                    DataStorage_2.default.setItem("__gx_openId__", self.openId);
                                    callback && callback(self.openId);
                                }
                                else {
                                    self.logw("登录失败！" + res.data["msg"]);
                                    // self.reported = false
                                    setTimeout(() => {
                                        self.getOpenidTry++;
                                        self.getOpenId(callback);
                                    }, 3000);
                                }
                            },
                            failedCallback: (res) => {
                                self.logw("登录失败！" + res["errMsg"]);
                                try {
                                    self.logw(JSON.stringify(res));
                                }
                                catch (e) {
                                }
                                // self.reported = false
                                setTimeout(() => {
                                    self.getOpenidTry++;
                                    self.getOpenId(callback);
                                }, 3000);
                            }
                        });
                    };
                    if (!!GxAdParams_1.AdParams.oppo.packageName) {
                        request();
                    }
                    else {
                        // @ts-ignore
                        qg.getManifestInfo({
                            success: function (res) {
                                console.log(JSON.parse(res.manifest));
                                let info = JSON.parse(res.manifest);
                                self.setManifestInfo(info);
                                request();
                            },
                            fail: function (err) {
                                self.getOpenidTry = 5;
                                self.getOpenId(callback);
                            },
                            complete: function (res) {
                            }
                        });
                    }
                }
                else {
                    setTimeout(() => {
                        self.getOpenidTry++;
                        self.getOpenId(callback);
                    }, 3000);
                }
            },
            //@ts-ignore
            fail: function (err) {
                console.log("登录失败" + JSON.stringify(err));
                setTimeout(() => {
                    self.getOpenidTry++;
                    self.getOpenId(callback);
                }, 3000);
            }
        });
    }
    initGravityEngine() {
        if (!!GxAdParams_1.AdParams.oppo.gravityEngineAccessToken) {
            console.log("初始化ge");
            let debug = "none";
            if (window["geDebug"]) {
                debug = "debug";
            }
            const config = {
                accessToken: GxAdParams_1.AdParams.oppo.gravityEngineAccessToken, // 项目通行证，在：网站后台-->设置-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
                clientId: this.openId, // 用户唯一标识，如产品为小游戏，则必须填用户openid（注意，不是小游戏的APPID！！！）
                autoTrack: {
                    appLaunch: true, // 自动采集 $MPLaunch
                    appShow: true, // 自动采集 $MPShow
                    appHide: true // 自动采集 $MPHide
                },
                name: "ge", // 全局变量名称, 默认为 gravityengine
                debugMode: debug // 是否开启测试模式，开启测试模式后，可以在 网站后台--设置--元数据--事件流中查看实时数据上报结果。（测试时使用，上线之后一定要关掉，改成none或者删除）
            };
            const ge = new GravityAnalyticsAPI(config);
            ge.setupAndStart();
            let item = DataStorage_2.default.getItem("geInit");
            if (!!item) {
                console.log("ge inited");
            }
            else {
                let versionNumber = 100;
                try {
                    if (this.manifestInfo) {
                        let mpVersion = this.manifestInfo.versionCode;
                        if (!!mpVersion) {
                            let re = parseInt(mpVersion);
                            if (!isNaN(re)) {
                                versionNumber = re;
                            }
                        }
                    }
                }
                catch (e) {
                }
                this.logi("init versionNumber:" + versionNumber);
                ge.initialize({
                    name: this.openId,
                    version: versionNumber,
                    openid: this.openId,
                    enable_sync_attribution: false
                })
                    .then((res) => {
                    console.log("ge initialize success " + res);
                    DataStorage_2.default.setItem("geInit", "1");
                })
                    .catch((err) => {
                    console.log("ge initialize failed, error is " + err);
                });
            }
        }
        else {
            console.warn("没有参数 不初始化引力引擎");
        }
    }
    setManifestInfo(info) {
        GxAdParams_1.AdParams.oppo.packageName = info.package;
        this.manifestInfo = info;
        /*  TDSDK.getInstance().initApp(
              info.package,
              info.name,
              info.versionName,
              info.versionCode
          );*/
        console.log("[gx_game]设置info");
    }
}
exports.default = OppoAdapter;
