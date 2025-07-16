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
const cc_1 = require("cc");
class WxJump {
    static get Instance() {
        if (this.instance == null) {
            this.instance = new WxJump();
        }
        return this.instance;
    }
    constructor() {
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
        /**
         * 显示单个游戏
         * @param nodeArr
         */
        this._nodeArr = [];
        this._nodeWidht = 100;
        this._nodeHeight = 100;
    }
    init(app_key, app_version, initCallback) {
        this.app_key = app_key;
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
            let node = new cc_1.Node();
            node.width = width;
            node.height = width;
            let sprite = node.addComponent(cc_1.Sprite);
            parentNode.addChild(node);
            sprite.sizeMode = cc_1.Sprite.SizeMode.CUSTOM;
            sprite.node.width = width;
            sprite.node.height = height;
            if (this._config["playBtnUrlStatus"] == 1 && !!this._config["playBtnUrl"] && !!this._config["playBtnUrl"].startsWith("https")) {
                cc_1.assetManager.loadRemote(this._config["playBtnUrl"], cc_1.Texture2D, (err, sp) => {
                    try {
                        if (err) {
                            console.warn(err);
                        }
                        if (sp && sprite.isValid) {
                            sprite.spriteFrame = new cc_1.SpriteFrame(sp);
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                });
            }
            else {
                cc_1.resources.load("gx/texture/btn_playjump", cc_1.SpriteFrame, (err, sp) => {
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
            node.on(cc_1.Node.EventType.TOUCH_END, () => {
                this.showPlayGameList();
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
    _showPrefab(groupName) {
        if (this._listPrefab) {
            let node = (0, cc_1.instantiate)(this._listPrefab);
            let parent = (0, cc_1.find)("Canvas");
            if (!parent) {
                parent = cc_1.director.getScene();
            }
            if (parent) {
                node.parent = parent;
            }
            if (!!groupName) {
                node.group = groupName;
            }
            else {
                if (this._playBtnRoot && this._playBtnRoot.isValid) {
                    node.group = this._playBtnRoot.group;
                }
            }
            node.getComponent(WxJumpList_1.default).initData(this._config.list, (ele) => {
                this._wxJump(ele);
            });
        }
        else {
            console.warn("wx jump none prefab");
        }
    }
    _loadPrefab(callback) {
        cc_1.resources.load("gx/prefab/jumpList", cc_1.Prefab, (err, prefab) => {
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
                            let node = new cc_1.Node();
                            node.width = width;
                            node.height = width;
                            let sprite = node.addComponent(cc_1.Sprite);
                            parentNode.addChild(node);
                            sprite.sizeMode = cc_1.Sprite.SizeMode.CUSTOM;
                            sprite.node.width = width;
                            sprite.node.height = height;
                            if (!!listElement["icon"] && listElement["icon"].startsWith("https")) {
                                cc_1.assetManager.loadRemote(listElement["icon"], cc_1.Texture2D, (err, sp) => {
                                    try {
                                        if (err) {
                                            console.warn(err);
                                        }
                                        if (sp && sprite.isValid) {
                                            sprite.spriteFrame = new cc_1.SpriteFrame(sp);
                                        }
                                    }
                                    catch (e) {
                                        console.warn(e);
                                    }
                                });
                            }
                            node.on(cc_1.Node.EventType.TOUCH_END, () => {
                                this._wxJump(listElement);
                            }, this);
                            if (this._config["outShowName"] == 1) {
                                let node2 = this._newSpriteNode("aaa", width, 22);
                                parentNode.addChild(node2);
                                node2.y = -height / 2;
                                node2.anchorY = 0;
                                let node1 = new cc_1.Node();
                                let label = node1.addComponent(cc_1.Label);
                                parentNode.addChild(node1);
                                label.string = listElement.name.substring(0, 5);
                                label.enabled = true;
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
        const texture = new cc_1.Texture2D();
        texture.initWithData(buffer, cc_1.Texture2D.PixelFormat.RGBA8888, 1, 1);
        const spriteFrame = new cc_1.SpriteFrame();
        spriteFrame.setTexture(texture);
        const node = new cc_1.Node(name);
        const sprite = node.addComponent(cc_1.Sprite);
        sprite.sizeMode = cc_1.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = spriteFrame;
        node.width = width;
        node.height = width;
        return node;
    }
    _wxJump(element) {
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
    canShowPlayBtn() {
        if (this._config && this._config["status"] == 1 && this._config["playBtn"] == 1) {
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
}
WxJump.instance = null;
exports.default = WxJump;
