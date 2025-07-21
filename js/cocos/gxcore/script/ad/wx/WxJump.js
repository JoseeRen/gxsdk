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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WxJumpList_1 = __importDefault(require("./WxJumpList"));
const DataStorage_1 = __importDefault(require("../../util/DataStorage"));
const ResUtil_1 = __importDefault(require("../../util/ResUtil"));
class WxJump {
    static get Instance() {
        if (this.instance == null) {
            this.instance = new WxJump();
        }
        return this.instance;
    }
    constructor() {
        this.inGamePlayCallback = null;
        this.app_key = "";
        this.app_version = "";
        this.initCallback = null;
        this._config = null;
        this._listPrefab = null;
        this._playBtnRoot = null;
        this._needShowPlayBtn = false;
        this._needShowPlayGames = false;
        /**
         * 显示玩一玩按钮
         * @param parentNode
         */
        this._playBtnParent = null;
        this._playBtnHeight = 100;
        this._playBtnWidth = 100;
        this._playUnlockBtnRoot = null;
        /**
         * 显示单个游戏
         * @param nodeArr
         */
        this._nodeArr = [];
        this._nodeWidht = 100;
        this._nodeHeight = 100;
        this.backMainCloseCallback = null;
        //0普通分享 1海报分享
        this._curShareIndex = -1;
        this.showCount = 0;
        this.isShare = false;
    }
    init(appIdOrApp_key, app_version, initCallback) {
        this.app_key = appIdOrApp_key;
        this.app_version = app_version;
        this.initCallback = initCallback;
        if (!!this.app_key && !!this.app_version) {
            console.log("wx jump init：" + this.app_key + "::" + this.app_version);
            this.requestConfig();
        }
        else {
            this.initCallback(false);
            console.log("wx jump init error param is null");
        }
    }
    requestConfig(tryCount = 0) {
        let url = `${Math.floor(new Date().valueOf() / 10000)}`;
        // url = new Date().valueOf() + "";
        this.requestGet(`https://res.sjzgxwl.com/upload/jump/${this.app_key}_${this.app_version}.json?t=${url}`, (res) => {
            console.log(res);
            let newVar = typeof res;
            if (newVar == "string") {
                try {
                    res = JSON.parse(res);
                }
                catch (e) {
                }
            }
            this._config = res;
            if (this._needShowPlayBtn) {
                this.showPlayBtn(this._playBtnParent, this._playBtnWidth, this._playBtnHeight);
            }
            if (this._needShowPlayGames) {
                this.showPlayGames(this._nodeArr, this._nodeWidht, this._nodeHeight);
            }
            if (this._config && this._config["share"] && this._config["share"]["useOrder"] == 2) {
                try {
                    this._config.share.list.sort(() => {
                        return Math.random() - 0.5;
                    });
                }
                catch (e) {
                }
            }
            this.initCallback(true);
            console.log("wx jump init success");
        }, (res) => {
            if (tryCount < 3) {
                tryCount++;
                this.requestConfig(tryCount);
            }
            else {
                console.warn(res);
                this.initCallback(false);
                console.log("wx jum init error");
            }
        });
        this._loadPrefab(() => {
        });
    }
    showPlayBtn(parentNode, width = 100, height = 100) {
        if (!this._config) {
            console.log("wx jump not init end 1");
            this._playBtnParent = parentNode;
            this._playBtnHeight = height;
            this._playBtnWidth = width;
            this._needShowPlayBtn = true;
            return;
        }
        if (this.canShowPlayBtn() && parentNode && parentNode.isValid) {
            this._playBtnRoot = parentNode;
            parentNode.setContentSize(width, height);
            let node = new cc.Node();
            node.setContentSize(width, height);
            let sprite = node.addComponent(cc.Sprite);
            parentNode.addChild(node);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.node.width = width;
            sprite.node.height = height;
            if (this._config["playBtnUrlStatus"] == 1 && !!this._config["playBtnUrl"] && !!this._config["playBtnUrl"].startsWith("https")) {
                cc.assetManager.loadRemote(this._config["playBtnUrl"], cc.Texture2D, (err, sp) => {
                    try {
                        if (err) {
                            console.warn(err);
                        }
                        if (sp && sprite.isValid) {
                            sprite.spriteFrame = new cc.SpriteFrame(sp);
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                });
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/btn_playjump", (err, sp) => {
                    try {
                        if (err) {
                            console.warn(err);
                        }
                        if (sp && sprite.isValid) {
                            sprite.spriteFrame = sp;
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                });
            }
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this.showPlayGameList();
            }, this);
        }
        else {
            console.warn("不用显示playBtn");
        }
    }
    showPlayBtnWithUnlock(parentNode, inGamePlayCallback, width = 100, height = 100) {
        if (!this._config) {
            console.log("wx jump not init end 1");
            /*         this._playBtnParent = parentNode;
                     this._playBtnHeight = height;
                     this._playBtnWidth = width;
                     this._needShowPlayBtn = true;*/
            return;
        }
        // if (this.canShowPlayBtn() && parentNode && parentNode.isValid) {
        if (this.canShowUnlockPlayBtn() && parentNode && parentNode.isValid) {
            this._playUnlockBtnRoot = parentNode;
            parentNode.setContentSize(width, height);
            let node = new cc.Node();
            node.setContentSize(width, height);
            let sprite = node.addComponent(cc.Sprite);
            parentNode.addChild(node);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.node.width = width;
            sprite.node.height = height;
            if (this._config["playUnlock"]["playBtnUrlStatus"] == 1 && !!this._config["playUnlock"]["playBtnUrl"] && !!this._config["playUnlock"]["playBtnUrl"].startsWith("https")) {
                cc.assetManager.loadRemote(this._config["playUnlock"]["playBtnUrl"], cc.Texture2D, (err, sp) => {
                    try {
                        if (err) {
                            console.warn(err);
                        }
                        if (sp && sprite.isValid) {
                            sprite.spriteFrame = new cc.SpriteFrame(sp);
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                });
            }
            else {
                ResUtil_1.default.loadSprite("gx/texture/btn_playjump", (err, sp) => {
                    try {
                        if (err) {
                            console.warn(err);
                        }
                        if (sp && sprite.isValid) {
                            sprite.spriteFrame = sp;
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                });
            }
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this.showUnlockPlayGameList("", inGamePlayCallback);
            }, this);
        }
        else {
            console.warn("不用显示playBtn");
        }
    }
    showPlayGameList(groupName = "") {
        if (!this._config) {
            console.log("wx jump none config");
            return;
        }
        if (this._listPrefab) {
            this._showPrefab(groupName);
        }
        else {
            this._loadPrefab(() => {
                this._showPrefab(groupName);
            });
        }
    }
    /**
     * 显示可以解锁的列表
     * @param groupName
     */
    showUnlockPlayGameList(groupName = "", inGamePlayCallback) {
        if (!this._config) {
            console.log("wx jump none config");
            return;
        }
        this.inGamePlayCallback = inGamePlayCallback;
        if (this._listPrefab) {
            this._showPrefab(groupName, 1);
        }
        else {
            this._loadPrefab(() => {
                this._showPrefab(groupName, 1);
            });
        }
    }
    //type0正常的 1是可解锁的
    _showPrefab(groupName, type = 0) {
        if (this._listPrefab) {
            let node = cc.instantiate(this._listPrefab);
            let parent = cc.find("Canvas");
            if (!parent) {
                parent = cc.director.getScene();
            }
            if (parent) {
                node.parent = parent;
            }
            if (!!groupName) {
                node.group = groupName;
            }
            else {
                if (type == 1) {
                    if (this._playUnlockBtnRoot && this._playUnlockBtnRoot.isValid) {
                        node.group = this._playUnlockBtnRoot.group;
                    }
                }
                else {
                    if (this._playBtnRoot && this._playBtnRoot.isValid) {
                        node.group = this._playBtnRoot.group;
                    }
                }
            }
            let dataList = this._config.list;
            if (type == 1) {
                dataList = this._config.playUnlock.list;
            }
            node.getComponent(WxJumpList_1.default).initData(dataList, type, (ele) => {
                this.wxJump(ele);
            });
        }
        else {
            console.warn("wx jump none prefab");
        }
    }
    _loadPrefab(callback) {
        ResUtil_1.default.loadPrefab("gx/prefab/jumpList", (err, prefab) => {
            try {
                if (err) {
                    console.log(err);
                }
                this._listPrefab = prefab;
                callback && callback();
            }
            catch (e) {
                console.warn(e);
            }
        });
    }
    showPlayGames(nodeArr, width = 100, height = 100) {
        if (!this._config) {
            this._nodeArr = nodeArr;
            this._nodeWidht = width;
            this._nodeHeight = height;
            this._needShowPlayGames = true;
            console.log("wx jump not init end 2");
            return;
        }
        if (this.canShowPlayGames() && nodeArr.length > 0) {
            let arridx = 0;
            for (let i = 0; i < this._config.list.length; i++) {
                let listElement = this._config.list[i];
                if (listElement.outShow == 1) {
                    if (arridx < nodeArr.length) {
                        let parentNode = nodeArr[arridx];
                        if (parentNode && parentNode.isValid) {
                            parentNode.setContentSize(width, height);
                            let node = new cc.Node();
                            node.setContentSize(width, height);
                            let sprite = node.addComponent(cc.Sprite);
                            parentNode.addChild(node);
                            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                            sprite.node.width = width;
                            sprite.node.height = height;
                            if (!!listElement["icon"] && listElement["icon"].startsWith("https")) {
                                cc.assetManager.loadRemote(listElement["icon"], cc.Texture2D, (err, sp) => {
                                    try {
                                        if (err) {
                                            console.warn(err);
                                        }
                                        if (sp && sprite.isValid) {
                                            sprite.spriteFrame = new cc.SpriteFrame(sp);
                                        }
                                    }
                                    catch (e) {
                                        console.warn(e);
                                    }
                                });
                            }
                            node.on(cc.Node.EventType.TOUCH_END, () => {
                                this.wxJump(listElement);
                            }, this);
                            if (this._config["outShowName"] == 1) {
                                let node2 = this._newSpriteNode("aaa", width, 22);
                                parentNode.addChild(node2);
                                node2.y = -height / 2;
                                node2.anchorY = 0;
                                let node1 = new cc.Node();
                                let label = node1.addComponent(cc.Label);
                                parentNode.addChild(node1);
                                label.string = listElement.name.substring(0, 5);
                                label.enableBold = true;
                                label.lineHeight = 18;
                                label.fontSize = 18;
                                node1.anchorY = 0;
                                node1.y = -height / 2 - 1;
                            }
                        }
                        arridx++;
                    }
                }
            }
        }
        else {
            console.warn("不用显示playGames");
        }
    }
    _newSpriteNode(name = "newSpriteNode", width = 100, height = 20) {
        const buffer = Uint8Array.from([0, 0, 0, 135]);
        const texture = new cc.Texture2D();
        texture.initWithData(buffer, cc.Texture2D.PixelFormat.RGBA8888, 1, 1);
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        const node = new cc.Node(name);
        const sprite = node.addComponent(cc.Sprite);
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = spriteFrame;
        node.setContentSize(width, height);
        return node;
    }
    wxJump(element) {
        if (element["inGame"] == 1) {
            this.inGamePlayCallback && this.inGamePlayCallback(element.appId);
        }
        else {
            if (window["wx"]) {
                //@ts-ignore
                wx.navigateToMiniProgram({
                    appId: element.appId,
                    path: element.path,
                    extraData: element.extraData,
                    envVersion: element.envVersion,
                    shortLink: element.shortLink,
                    success(res) {
                        // 打开成功
                        console.log("wx jump success");
                    },
                    fail(res) {
                        console.log(res);
                        console.log("wx jump fail");
                    }
                });
            }
            else {
                try {
                    console.log("跳转：" + JSON.stringify(element));
                }
                catch (e) {
                }
            }
        }
    }
    canShowPlayBtn() {
        if (this._config && this._config["status"] == 1 && this._config["playBtn"] == 1) {
            return true;
        }
        return false;
    }
    canShowUnlockPlayBtn() {
        if (this._config && this._config["playUnlock"] && this._config["playUnlock"]["status"] == 1) {
            return true;
        }
        return false;
    }
    canShowPlayGames() {
        if (this._config && this._config["status"] == 1 && this._config["outGameBtn"] == 1) {
            return true;
        }
        return false;
    }
    requestGet(url, successCallback, failCallback) {
        if (window["wx"]) {
            // @ts-ignore
            wx.request({
                url: url,
                success(res) {
                    if (res.statusCode == 200 || res.statusCode == 304 || res.data) {
                        successCallback && successCallback(res.data);
                    }
                    else {
                        failCallback && failCallback(res);
                    }
                },
                fail(res) {
                    failCallback && failCallback(res);
                }
            });
        }
        else {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // debugger
                    // console.log(xhr.status + ".......");
                    if (xhr.status >= 200 && xhr.status <= 304) {
                        var respone = xhr.responseText;
                        successCallback(respone);
                    }
                    else {
                        failCallback(-2);
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            // note: In Internet Explorer, the timeout property may be set only after calling the open()
            // method and before calling the send() method.
            //  xhr.timeout = 5000; // 5 seconds for timeout
            xhr.timeout = 5000;
            let isCallback = false;
            xhr.ontimeout = function () {
                console.log("xmlhttprequest lw_z timeout");
                if (!isCallback) {
                    isCallback = true;
                    failCallback(-1);
                }
            };
            xhr.onerror = function (e) {
                console.log(e + "xmlhttprequest lw_z onerror");
                if (!isCallback) {
                    isCallback = true;
                    failCallback(-1);
                }
            };
            xhr.send();
        }
    }
    showBackMainPlay(closeCallback) {
        if (this._config && this._config["exitGameBox"] == 1) {
            ResUtil_1.default.loadPrefab("gx/prefab/wxplayList", (er, prefab) => {
                if (er) {
                    console.log(er);
                    closeCallback && closeCallback();
                }
                else {
                    try {
                        this.backMainCloseCallback = closeCallback;
                        let asset = cc.instantiate(prefab);
                        asset.parent = cc.find("Canvas");
                        asset.zIndex = cc.macro.MAX_ZINDEX;
                    }
                    catch (e) {
                        console.warn(e);
                        closeCallback && closeCallback();
                    }
                }
            });
        }
        else {
            console.log("没开或者没获取到配置呢");
            closeCallback && closeCallback();
        }
    }
    getConfig(callback) {
        callback && callback(this._config);
    }
    getVictoryList() {
        let item = DataStorage_1.default.getItem("gx_victoryList", "");
        try {
            if (!!item) {
                return JSON.parse(item);
            }
        }
        catch (e) {
        }
        return [];
    }
    //通关后调用
    addVictory(lv) {
        if (!lv) {
            return;
        }
        let victoryList = this.getVictoryList();
        if (victoryList.indexOf(lv + "") == -1) {
            victoryList.push(lv + "");
            DataStorage_1.default.setItem("gx_victoryList", JSON.stringify(victoryList));
        }
    }
    //提前解锁某个玩一玩
    preUnlockPlay(appId) {
        DataStorage_1.default.setItem("gx_preunlock_" + appId, "1");
    }
    checkIsUnlockPlay(appId) {
        let item = DataStorage_1.default.getItem("gx_preunlock_" + appId, "");
        if (!!item) {
            return true;
        }
        return false;
    }
    getShareContent(type = 0, callback) {
        let result = null;
        try {
            if (this._config && this._config.share && this._config.share.list && this._config.share.list.length > 0) {
                let list = this._config.share.list;
                if (type == 0) {
                    //普通分享必须是5x4的
                    list = [];
                    for (let i = 0; i < this._config.share.list.length; i++) {
                        if (this._config.share.list[i].status == 1 && this._config.share.list[i].is5x4 == 1 && this._config.share.list[i].normalShare == 1) {
                            list.push(this._config.share.list[i]);
                        }
                    }
                }
                else if (type == 1) {
                    list = [];
                    for (let i = 0; i < this._config.share.list.length; i++) {
                        if (this._config.share.list[i].status == 1 && this._config.share.list[i].posterShare == 1) {
                            list.push(this._config.share.list[i]);
                        }
                    }
                }
                if (list.length > 0) {
                    if (this._config.share.useOrder == 2 || this._config.share.useOrder == 0) {
                        this._curShareIndex++;
                        if (this._curShareIndex >= list.length) {
                            this._curShareIndex = 0;
                        }
                        result = list[this._curShareIndex];
                    }
                    else {
                        result = list[Math.floor(Math.random() * list.length)];
                    }
                }
            }
        }
        catch (e) {
            console.warn(e);
        }
        callback && callback(result);
    }
    showPosterShare() {
        if (this._config && this._config["share"] && this._config["share"]["status"] == 1) {
            ResUtil_1.default.loadPrefab("gx/prefab/wxShare", (er, prefab) => {
                if (er) {
                    console.log(er);
                }
                else {
                    try {
                        let asset = cc.instantiate(prefab);
                        asset.parent = cc.find("Canvas");
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
            });
        }
        else {
            console.log("没开或者没获取到配置呢");
        }
    }
    showVictoryPosterShare() {
        if (this._config && this._config["share"] && this._config["share"]["victoryPoster"] == 1) {
            if (this.isShare || this.showCount < 3) {
                this.showPosterShare();
            }
        }
        else {
            console.log("可能没开或者没获取到配置");
        }
    }
}
WxJump.instance = null;
exports.default = WxJump;
