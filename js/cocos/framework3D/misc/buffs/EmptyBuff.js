"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Buff_1 = __importDefault(require("./Buff"));
class EmptyBuff extends Buff_1.default {
    onEnabled(...a) {
    }
    onDisabled() {
    }
    onTimeLeftChanged() {
    }
    save() {
    }
    load(offlineSec) {
    }
}
exports.default = EmptyBuff;
