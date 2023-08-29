"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
class gx_ui_toast extends layaMaxUI_1.ui.gxui.gx_ui_toastUI {
    constructor() {
        super();
    }
    show(desc) {
        if (!this.parent) {
            let order = 10000;
            Laya.stage.addChild(this);
            this.zOrder = order;
        }
        this.on_show(desc);
    }
    /**
     * 应用默认的位置
     */
    set_default_pos() {
        this.centerX = 0;
    }
    set_style_pos(x, y) {
    }
    on_hide() {
    }
    on_show(desc) {
        this.show_tips(desc);
    }
    show_tips(desc) {
        let self = this;
        this.centerY = 0;
        this.lb_tips.text = desc;
        Laya.Tween.clearAll(this);
        this.tips_box.centerY = 0;
        Laya.Tween.to(this, { centerY: -150 }, 1500, null, Laya.Handler.create(this, () => {
            self.hide();
        }));
    }
    /**
     * 移除，并回收
     */
    hide() {
        if (this.parent) {
            this.removeSelf();
            this.on_hide();
        }
    }
}
exports.default = gx_ui_toast;
