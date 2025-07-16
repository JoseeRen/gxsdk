"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEngineAutoTrackBridge = void 0;
const GxEngineUtil_1 = require("./GxEngineUtil");
const GxEnginePlatformAPI_1 = require("./GxEnginePlatformAPI");
class GxEngineAutoTrackBridge {
    constructor(e1, t1, api) {
        // super(e1,t1);
        /*  const e = this.taInstance = e1,
              t = this.config = t1 || {},
              n = api.getLaunchOptionsSync();
  */
        var r = this, e = (this.taInstance = e1, this.config = t1 || {}, api.getLaunchOptionsSync());
        this._onShow(e),
            this.startTracked = true;
        api.onShow((e) => {
            this._onShow(e);
        });
        api.onHide(() => {
            let e;
            this.startTracked = false;
            this.config.appHide && (GxEngineUtil_1.GxEngineUtil.extend(e = {}, this.config.properties),
                GxEngineUtil_1.GxEngineUtil.isFunction(this.config.callback) && GxEngineUtil_1.GxEngineUtil.extend(e, this.config.callback("appHide")));
            this.taInstance._internalTrack("$MPHide", e);
        });
    }
    _onShow(e) {
        if (!this.startTracked) {
            this.config.appHide && this.taInstance.timeEvent("$MPHide");
            this.config.appShow && (GxEngineUtil_1.GxEngineUtil.extend(this.config.properties),
                GxEngineUtil_1.GxEngineUtil.isFunction(this.config.callback) && GxEngineUtil_1.GxEngineUtil.extend(this.config.callback("appShow")));
            this.taInstance._internalTrack("$MPShow", {
                $scene: String(e.scene),
                //@ts-ignore
                $url_query: GxEngineUtil_1.GxEngineUtil.setQuery(GxEnginePlatformAPI_1.GxEnginePlatformAPI.getAppOptions().query)
            });
        }
    }
}
exports.GxEngineAutoTrackBridge = GxEngineAutoTrackBridge;
