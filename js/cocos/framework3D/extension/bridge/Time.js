"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const MoveEngine_1 = __importDefault(require("../../misc/MoveEngine"));
let beginTime = Date.now();
class Time {
    static get DeltaTime() {
        return cc_1.director.getDeltaTime();
    }
    static get time() {
        return (Date.now() - beginTime) / 1000;
    }
    static set timeScale(v) {
        MoveEngine_1.default.timeScale = v;
        cc_1.director.getScheduler().setTimeScale(v);
    }
}
exports.default = Time;
