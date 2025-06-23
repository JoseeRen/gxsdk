"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ViewManager_1 = __importDefault(require("./ViewManager"));
class vm {
    static show(view, ...args) {
        if (ViewManager_1.default.instance)
            return ViewManager_1.default.instance.show(view, ...args);
        else
            console.log("ViewManager has not created yet ");
    }
    static hide(view, b = false) {
        if (ViewManager_1.default.instance)
            return ViewManager_1.default.instance.hide(view, b);
        else
            console.log("ViewManager has not created yet ");
    }
}
exports.default = vm;
