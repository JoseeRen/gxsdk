"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEngineSystemInformation = void 0;
const GxEnginePlatformAPI_1 = require("./GxEnginePlatformAPI");
const GxEngineLogger_1 = require("./GxEngineLogger");
const GxEngineUtil_1 = require("./GxEngineUtil");
class GxEngineSystemInformation {
    constructor() {
        this.properties = {
            "$lib_version": "",
            "$lib": "",
            "$scene": "",
            "$today_first_scene": "",
            "$network_type": "",
            "$manufacturer": "",
            "$brand": "",
            "$model": "",
            "$screen_width": "",
            "$screen_height": "",
            "$system_language": "",
            "$os": "",
            "$os_version": ""
        };
    }
    getSystemInfo(callback) {
        const updateNetworkType = (e) => {
            this.properties.$network_type = e.networkType;
        };
        GxEnginePlatformAPI_1.GxEnginePlatformAPI.onNetworkStatusChange(updateNetworkType);
        GxEnginePlatformAPI_1.GxEnginePlatformAPI.getNetworkType({
            success: updateNetworkType,
            complete: () => {
                GxEnginePlatformAPI_1.GxEnginePlatformAPI.getSystemInfo({
                    success: (e) => {
                        GxEngineLogger_1.GxEngineLogger.info(JSON.stringify(e, null, 4));
                        const t = {
                            $manufacturer: e.brand,
                            $brand: e.brand,
                            $model: e.model,
                            $screen_width: Number(e.screenWidth),
                            $screen_height: Number(e.screenHeight),
                            $system_language: e.language,
                            $os: e.platform,
                            $os_version: e.system
                        };
                        Object.assign(this.properties, t);
                        GxEngineUtil_1.GxEngineUtil.setMpPlatform(e.mp_platform);
                    },
                    complete: callback
                });
            }
        });
    }
}
exports.GxEngineSystemInformation = GxEngineSystemInformation;
