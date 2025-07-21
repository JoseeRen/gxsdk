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
const GxLog_1 = __importDefault(require("./GxLog"));
const OpenDataConstant = {
    DomainAction: {
        Check: "Check",
        InitChannel: "InitChannel",
        FetchFriend: "FetchFriend",
        FetchGroup: "FetchGroup",
        FetchFriendLevel: "FetchFriendLevel", //好友关卡进度排行
        FetchFriendScore: "FetchFriendScore", //好友关卡得分排行
        HorConmpar: "HorConmpar", //横向比较 horizontal comparison
        Paging: "Paging",
        Scrolling: "Scrolling",
        AddScore: "AddScore",
        ShareToFriend: "ShareToFriend",
        CheckOptions: "CheckOptions",
        ReliveShare: "ReliveShare",
        ShowShareFriend: "ShowShareFriend",
        RefreshShareFriend: "RefreshShareFriend",
        CloseShareFriend: "CloseShareFriend",
        CloseFriendRank: "CloseFriendRank",
        InitContext: "InitContext"
    },
    Scene: {
        ShareToFriend: 1
    }
};
class OpenDataUtil {
    /**
     * 检查是否有开放域
     */
    static checkHasOpenData() {
        try {
            //@ts-ignore
            /*         let fs = wx.getFileSystemManager();
                     let readFileSync = fs.accessSync("subopen/flag.json");
                     // "openDataContext":"subopen",
                     //微信不能读取 game.json
                     let projectContent = fs.readFileSync("game.json", "utf8");

                     let parse = JSON.parse(projectContent);

                     if (parse["openDataContext"] == "subopen") {
                         GxLog.w("有开放数据域")

                         return true
                     }
                     GxLog.e("有开放域文件夹subopen 但 game.json中没有配置openDataContext为subopen")
         */
            return this._postMessage(OpenDataConstant.DomainAction.Check);
            //  return true
        }
        catch (e) {
            console.warn(e);
            GxLog_1.default.w("没有开放域 请放入subopen文件夹 并在 game.json中没有配置openDataContext为subopen ");
            return false;
        }
    }
    static shareMessageToFriend() {
        //@ts-ignore
        wx.setMessageToFriendQuery({
            shareMessageToFriendScene: OpenDataConstant.Scene.ShareToFriend
        });
        this._postMessage(OpenDataConstant.DomainAction.ShareToFriend);
    }
    static initChannel(channel) {
        //@ts-ignore
        this._postMessage(OpenDataConstant.DomainAction.InitChannel, { channel: channel });
    }
    static _postMessage(action, data = null, dataEx = null) {
        try {
            if (!window["wx"])
                return;
            let openDataContext = window["wx"].getOpenDataContext();
            openDataContext.postMessage({
                action: action,
                data: data,
                dataEx: dataEx
            });
            return true;
        }
        catch (e) {
        }
        return false;
    }
    static showShareFriend() {
        this._postMessage(OpenDataConstant.DomainAction.ShowShareFriend, {});
    }
    static closeShareFriend() {
        this._postMessage(OpenDataConstant.DomainAction.CloseShareFriend, {});
    }
    static refreshShareFriend() {
        this._postMessage(OpenDataConstant.DomainAction.RefreshShareFriend, {});
    }
    /**
     *
     * @param rankId  后台的排行榜唯一标识id
     * @param suffix 后缀  比如 关  分  不传就不显示
     */
    static showRankFriend(rankId = "", suffix = "") {
        this._postMessage(OpenDataConstant.DomainAction.FetchFriendLevel, { rankId: rankId, suffix: suffix });
    }
    static closeRankFriend() {
        this._postMessage(OpenDataConstant.DomainAction.CloseFriendRank, {});
    }
}
exports.default = OpenDataUtil;
