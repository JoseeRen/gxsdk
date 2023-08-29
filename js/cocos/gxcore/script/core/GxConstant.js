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
const BaseGxConstant_1 = __importDefault(require("./base/BaseGxConstant"));
class GxConstant extends BaseGxConstant_1.default {
}
/*可以自己定义常量*/
GxConstant.Code2SessionUrl = "https://wx.sjzgxwl.com/openid/code2Session/v2";
GxConstant.SubmsgBaseUrl = "https://wx.sjzgxwl.com/submsg";
exports.default = GxConstant;
