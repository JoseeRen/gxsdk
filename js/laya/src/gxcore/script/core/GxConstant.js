"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GxEnum_1 = require("./GxEnum");
const BaseGxConstant_1 = __importDefault(require("./base/BaseGxConstant"));
class GxConstant extends BaseGxConstant_1.default {
}
/**
 * 后台游戏id
 * 用于请求后台配置
 */
GxConstant.GID = 0;
/**
 * 后台游戏名
 * 用于请求后台配置
 */
GxConstant.PROGECT_NAME = '';
/**
 * 后台游戏版本号
 * 用于请求后台配置
 * 微信 1.x.x;头条 2.x.x;百度 3.x.x;QQ 4.x.x;OPPO 5.x.x;vivo 6.x.x;趣头条 7.x.x;梦工厂 8.x.x;UC 9.x.x;魅族 10.x.x
 */
GxConstant.GAME_VERSION_NAME = '';
/**热云AppKey */
GxConstant.APPID = '';
/**友盟AppKey */
GxConstant.YM_APPID = '';
/**SDK */
GxConstant.SDK_TYPE = GxEnum_1.e_sdk_type.HS;
/**总关卡数 */
GxConstant.TOTAL_LEVEL = 35;
GxConstant.SOUND = {};
/**
 * 分包
 * { name: 'res3d', priority: 0 }
 * 优先级表示加载顺序，>= 5 表示无需等待加载完成
 */
GxConstant.subpackage = [];
GxConstant.Code2SessionUrl = "https://wx.sjzgxwl.com/openid/code2Session/v2";
GxConstant.SubmsgBaseUrl = "https://wx.sjzgxwl.com/submsg";
exports.default = GxConstant;
