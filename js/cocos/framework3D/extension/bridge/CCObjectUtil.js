"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
class CCObjectUtil {
    static Destroy(node, delayTime = 0) {
        if (delayTime) {
            //todo:
        }
        node.destroy();
        node.destroyAllChildren();
    }
    static FindObjectOfType(type) {
        return cc_1.director.getScene().getComponentInChildren(type);
    }
}
exports.default = CCObjectUtil;
