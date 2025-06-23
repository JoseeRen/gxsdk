"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const CCObjectUtil_1 = __importDefault(require("./CCObjectUtil"));
class Singleton //: EventDispatcher where T : MonoBehaviour
 {
    static Instance(type) {
        if (this._instance == null) {
            this._instance = CCObjectUtil_1.default.FindObjectOfType(type);
            if (this._instance == null) {
                if (type instanceof cc_1.Component) {
                    let node = new cc_1.Node();
                    //@ts-ignore
                    this._instance = node.addComponent(type);
                    node.name = this._instance.name;
                    // this._instance.gameObject.name = this._instance.GetType().Name;
                }
                else {
                    this._instance = new type();
                }
            }
            return this._instance;
        }
    }
}
Singleton._instance = null;
exports.default = Singleton;
