"use strict";
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
/*if (typeof CustomAdType == "undefined") {
    var CustomAdType = {
        TypeLeftOne: 'TypeLeftOne',
        TypeRightOne: 'TypeRightOne',
        Type5x3: 'Type5x3',
        Type5x2: 'Type5x2',
        TypeMoreBanner: 'TypeMoreBanner'
    };


}*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAdType = void 0;
var CustomAdType;
(function (CustomAdType) {
    CustomAdType["TypeLeftOne"] = "TypeLeftOne";
    CustomAdType["TypeRightOne"] = "TypeRightOne";
    CustomAdType["Type5x3"] = "Type5x3";
    CustomAdType["Type5x2"] = "Type5x2";
    CustomAdType["TypeMoreBanner"] = "TypeMoreBanner";
})(CustomAdType || (exports.CustomAdType = CustomAdType = {}));
class WxCustomAd {
    constructor() {
        this._isLandscape = false;
        this._userClosed = true; //是否是玩家关闭的
        this._adType = "";
        this._adUnitId = "";
        this._adInstance = null;
        this._showing = false;
        this._style = null;
        this._refreshTime = 0;
        this._timer = null;
        this._closeCallback = null;
        this._firstLoad = true;
        this._showed = true;
        this._screenInfo = null;
        this._loadEnd = false;
    }
    init(adUnitId, adType, refreshSecond = 60) {
        //@ts-ignore
        if (window.wx) {
            //@ts-ignore
            this._screenInfo = wx.getSystemInfoSync();
        }
        // let winSize = cc.winSize;
        if (this._screenInfo.screenHeight < this._screenInfo.screenWidth) {
            this._isLandscape = true;
        }
        else {
            this._isLandscape = false;
        }
        /*       if (wxAdapter.compareVersion(wxAdapter.screenInfo.SDKVersion, "2.14.4") >= 0) {
                   Hall.customAdOne = wx.createCustomAd({
                       adUnitId: 'adunit-91776c20a6562a04',
                       adIntervals: 60,
                       style: {
                           left: wxAdapter.screenInfo.screenWidth - wxAdapter.screenInfo.screenWidth * 0.96,
                           top: wxAdapter.screenInfo.screenHeight / 2 - 80,
                           width: 375, // 用于设置组件宽度，只有部分模板才支持，如矩阵格子模板
                           fixed: true // fixed 只适用于小程序环境
                       }
                   });
                   Hall.customAdOne.onLoad(() => console.log('原生模板广告单格子加载成功'))
                   Hall.customAdOne.onError(err => console.log('原生模板广告单格子加载失败' + JSON.stringify(err)))
               }*/
        this._adType = adType;
        this._adUnitId = adUnitId;
        this._refreshTime = refreshSecond;
        if (this._screenInfo && this._screenInfo.platform != "devtoolsD") {
            // if (wxAdapter.compareVersion(wxAdapter.screenInfo.SDKVersion, "2.14.4") >= 0) {
            let style = {};
            switch (adType) {
                //单格子   常规  60*104  卡片68*106
                case CustomAdType.TypeLeftOne:
                    style = {
                        left: 0,
                        top: 50,
                        width: 375, // 用于设置组件宽度，只有部分模板才支持，如矩阵格子模板
                    };
                    break;
                case CustomAdType.TypeRightOne:
                    style = {
                        left: this._screenInfo.screenWidth - 70,
                        top: 50,
                        width: 375
                    };
                    break;
                case CustomAdType.Type5x3:
                    /*
                                            let scale=1;
                                            let adWidth =  360;
                                            //多一行就是 54  +188
                                            let height = 188 + 54;
                                            if (this._isLandscape) {
                                                height = height * scale
                                                adWidth = adWidth * scale
                                            }
                                            style = {
                                                left: (this._screenInfo.screenWidth - adWidth) / 2,
                                                top: this._isLandscape ? 60 : (this._screenInfo.screenHeight - height) / 2,
                                                width: adWidth
                                            };  */
                    /*     0519修改      let scale = 1.1;
                               let adWidth = 360;
                               //多一行就是 54  +188
                               let height = 188 + 54;
                               if (this._isLandscape) {
                                   height = height * scale
                                   adWidth = adWidth * scale
                               }
                               style = {
                                   left: (this._screenInfo.screenWidth - adWidth) / 2,
                                   top: this._isLandscape ? 45 : (this._screenInfo.screenHeight - height) / 2,
                                   width: adWidth
                               };*/
                    if (this._isLandscape) {
                        style = {
                            left: (this._screenInfo.screenWidth / 2) - 180,
                            top: 10,
                            width: (this._screenInfo.screenWidth / 5),
                            // opacity: 0.8
                            fixed: false,
                        };
                    }
                    else {
                        style = {
                            left: 0,
                            top: (this._screenInfo.screenHeight / 2) - 230,
                            /*     width: (this._screenInfo.screenWidth/5),//横屏(AD_WX.sceneW/5) 竖屏 不写*/
                            // opacity: 0.8
                            fixed: false,
                        };
                    }
                    break;
                //2×5 布局默认画布为 360×188 像素
                // 5×5 布局默认画布为 360×352 像素
                case CustomAdType.Type5x2:
                    style = {
                        left: (this._screenInfo.screenWidth - 360) / 2,
                        top: (this._screenInfo.screenHeight - 188) / 2 - 60,
                        width: 360
                    };
                    break;
                //多格子 水平 360x106  垂直  72*410
                case CustomAdType.TypeMoreBanner:
                    style = {
                        left: (this._screenInfo.screenWidth - 360) / 2,
                        top: this._screenInfo.screenHeight - 106,
                        width: 360,
                    };
                    break;
                default:
                    console.error("这是哪个");
                    console.error("这是哪个");
                    console.error("这是哪个");
                    console.error("这是哪个");
                    break;
            }
            this._style = style;
            if (adUnitId && adUnitId.length > 0) {
                this.loadAd();
                // this._adInstance.show();
            }
        }
        else {
            console.log("版本低不初始化");
        }
    }
    setRefreshTime(time) {
        this._refreshTime = time;
    }
    _onLoadCallback() {
        console.log(this._adType + "loadEnd");
    }
    _onErrorCallback(err) {
        console.log(this._adType + "loadError");
    }
    _onHideCallback() {
        if (this._userClosed) {
            this.setShowStatus(false, "_onHideCallback");
        }
        // console.log(this._adType + "hide")
        if (this._adType == CustomAdType.Type5x3) {
            console.log("hide 5x3了");
            /*if (Hall._paused) {

                Hall.customAdmatrix3CloseCallback = true;
                // this._closeCallback && this._closeCallback(true);
                this._closeCallback = null;
            } else {*/
            if (this._closeCallback) {
                console.log("hide  可以 回调关闭");
            }
            this._closeCallback && this._closeCallback(true);
            this._closeCallback = null;
            // }
            if (this._userClosed) {
                //用户手动关闭的需要重新拉取广告
                this._reloadAd();
            }
        }
    }
    _reloadAd() {
        if (this._adInstance) {
            this._adInstance.offLoad(this._onLoadCallback);
            this._adInstance.offError(this._onErrorCallback);
            this._adInstance.offClose(this._onCloseCallback);
            this._adInstance.offHide(this._onHideCallback);
            this._adInstance.destroy();
            this._adInstance = null;
        }
        this._showed = true;
        this.loadAd();
    }
    _onCloseCallback() {
        this.setShowStatus(false, "_onCloseCallback");
        if (this._closeCallback) {
            console.log("close 可以 回调关闭");
        }
        console.log(this._adType + ":close");
        this._closeCallback && this._closeCallback(true);
        this._closeCallback = null;
        this._reloadAd();
    }
    loadAd() {
        if (this._timer != null) {
            clearTimeout(this._timer);
        }
        if (this._showed) {
            // console.log(" 显示过用重新加载" + this._adType)
            //@ts-ignore
            let ad = wx.createCustomAd({
                adUnitId: this._adUnitId,
                // adIntervals: 60,
                style: this._style
            });
            let self = this;
            // console.log("加载完是否需要显示：" + self._showing + ":::::" + self._adType)
            let loadEndCallback = () => {
                // console.log("loadAdSuccess:" + self._adType);
                if (ad) {
                    self._showed = false;
                    self._loadEnd = true;
                    let showAd = self._showing;
                    // let showAd = false;
                    ad.offLoad(loadEndCallback);
                    ad.offError(loadErrorCallback);
                    if (self._adInstance) {
                        // showAd = self._adInstance.isShow();
                        self._adInstance.offLoad(self._onLoadCallback);
                        self._adInstance.offError(self._onErrorCallback);
                        self._adInstance.destroy();
                        self._adInstance = null;
                    }
                    self._adInstance = ad;
                    self._adInstance.onLoad(self._onLoadCallback.bind(self));
                    self._adInstance.onError(self._onErrorCallback.bind(self));
                    self._adInstance.onClose(self._onCloseCallback.bind(self));
                    self._adInstance.onHide(self._onHideCallback.bind(self));
                    if (showAd) {
                        // console.log("加载后重新显示：" + self._adType)
                        self.show();
                    }
                    else {
                        // console.log("加载后不用重新显示")
                    }
                }
                if (self._refreshTime > 0) {
                    self._timer = setTimeout(() => {
                        //   console.log("加载完是否需要显示11：" + self._showing + ":::::" + self._adType)
                        self.loadAd();
                    }, self._firstLoad ? self._refreshTime * 1000 + (Math.floor(Math.random() * (20 - 5 + 1) + 5)) * 1000 : self._refreshTime * 1000);
                    self._firstLoad = false;
                }
            };
            let loadErrorCallback = (err) => {
                console.log(self._adType + this._adUnitId + "loadAdError:" + "::" + JSON.stringify(err));
                if (ad) {
                    ad.offLoad(loadEndCallback);
                    ad.offError(loadErrorCallback);
                    ad.destroy();
                    ad = null;
                }
                if (self._refreshTime > 0) {
                    self._timer = setTimeout(() => {
                        //  console.log("加载完是否需要显示22：" + self._showing + ":::::" + self._adType)
                        self.loadAd();
                    }, (self._refreshTime / 3 + (Math.floor(Math.random() * (20 - 5 + 1) + 5))) * 1000);
                }
            };
            ad.onLoad(loadEndCallback);
            ad.onError(loadErrorCallback);
        }
        else {
            //  console.log("没有显示过  不用重新加载" + this._adTypeStr);
            this._timer = setTimeout(() => {
                this.loadAd();
            }, 15 * 1000);
        }
    }
    show(showCallback = null, closeCallback = null) {
        /*   closeCallback && closeCallback(false);
           return;*/
        this._closeCallback = closeCallback;
        this._userClosed = true;
        this._showed = true;
        if (this._adInstance) {
            /*  if (this._adInstance.isShow()) {

              } else {*/
            this._adInstance.show().then(() => {
                this.setShowStatus(true, "show 1");
                showCallback && showCallback(true);
                // console.log(this._adType + "显示成功");
            }).catch((e) => {
                console.log(this._adType + "显示失败");
                // @ts-ignore
                if (!e["errMsg"] == "the advertisement has shown") {
                    console.log(JSON.stringify(e));
                    this.setShowStatus(false, "show 2");
                }
                else {
                    this._closeCallback && this._closeCallback(false);
                    this._closeCallback = null;
                }
                showCallback && showCallback(false);
            });
            // }
        }
        else {
            console.log(this._adType + "广告实例空 显示失败");
            this.setShowStatus(false, "show 3");
            showCallback && showCallback(false);
            this._closeCallback && this._closeCallback(false);
            this._closeCallback = null;
        }
    }
    showAndCallback(showCallback) {
        /*    showCallback && showCallback(false);
            return;*/
        this._showed = true;
        if (this._adInstance) {
            if (this._adType == CustomAdType.TypeMoreBanner) {
                this._adInstance._style = this._style;
            }
            // if (this._adInstance.isShow()) {
            //     showCallback && showCallback(true);
            //
            //     console.log(this._adType + " 正在显示 显示成功");
            // } else {
            this._adInstance.show().then(() => {
                showCallback && showCallback(true);
                this.setShowStatus(true, "showAndCallback 1");
                // console.log(this._adType + "显示成功");
            }).catch((e) => {
                // @ts-ignore
                if (!e["errMsg"] == "the advertisement has shown") {
                    console.log(this._adType + "显示失败");
                    console.log(JSON.stringify(e));
                    this.setShowStatus(false, "showAndCallback 2");
                    showCallback && showCallback(false);
                }
                else {
                    showCallback && showCallback(true);
                }
            });
            //  }
        }
        else {
            this.setShowStatus(false, "showAndCallback 3");
            showCallback && showCallback(false);
        }
    }
    showDownAndCallback(showCallback) {
        /* showCallback && showCallback(false);
         return;*/
        this._showed = true;
        if (this._adInstance) {
            if (this._adType == CustomAdType.TypeMoreBanner) {
                this._adInstance._style = {
                    left: (this._screenInfo.screenWidth - this._screenInfo.screenWidth * 0.4) / 2,
                    top: this._screenInfo.screenHeight - this._screenInfo.screenWidth * 0.4 * 0.5,
                };
            }
            //   if (this._adInstance.isShow()) {
            //     showCallback && showCallback(true);
            //    console.log(this._adType + "正在显示 显示成功");
            //  } else {
            this._adInstance.show().then(() => {
                this.setShowStatus(true, "showDownAndCallback 1");
                showCallback && showCallback(true);
                // console.log(this._adType + "显示成功");
            }).catch((e) => {
                // @ts-ignore
                if (!e["errMsg"] == "the advertisement has shown") {
                    console.log(this._adType + "显示失败");
                    console.log(JSON.stringify(e));
                    this.setShowStatus(false, "showDownAndCallback 2");
                    showCallback && showCallback(false);
                }
                else {
                    showCallback && showCallback(true);
                }
            });
            //    }
        }
        else {
            this.setShowStatus(false, "showDownAndCallback 3");
            showCallback && showCallback(false);
        }
    }
    setShowStatus(status, flag) {
        this._showing = status;
        if (this._adType == CustomAdType.TypeMoreBanner) {
            // console.log(status + ":::" + flag);
        }
    }
    isShowing() {
        if (this._adInstance && this._adInstance.isShow()) {
            return true;
        }
        return false;
    }
    hide() {
        this.setShowStatus(false, "hide");
        this._userClosed = false;
        console.log("隐藏广告");
        if (this._adInstance) {
            this._adInstance.hide();
        }
    }
    isReady() {
        if (this._adInstance && this._loadEnd) {
            console.log("准备好了");
            return true;
        }
        console.log("没准备好 ");
        return false;
    }
}
exports.default = WxCustomAd;
/*var CustomAd =
    cc.Class({
        extends: cc.Component,


        properties: {
            _isLandscape: false,
            _userClosed: true, //是否是玩家关闭的
            _adType: "",
            _adUnitId: "",
            _adInstance: null,
            _showing: false,
            _style: null,
            _refreshTime: 0,
            _timer: null,
            _closeCallback: null,

            _firstLoad: true,
            _showed: true,
            _screenInfo: null,
            _loadEnd: false

        },

    });
module.exports.CustomAdType = CustomAdType;
module.exports.CustomAd = CustomAd;*/
//let customAd = require("CustomAd");
//
// var CustomAd = customAd.CustomAd
//
//
// var CustomAdType = customAd.CustomAdType
// var BannerAd = require("Banner")
