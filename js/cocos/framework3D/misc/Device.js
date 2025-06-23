"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerInfo_1 = require("../../scripts/Base/PlayerInfo");
const cc_1 = require("cc");
class Device {
    static setSoundsEnable(b) {
        Device.setSFXEnable(b);
        Device.setBGMEnable(b);
    }
    static setSFXEnable(b) {
        Device.isSfxEnabled = b;
    }
    static setVibrateEnable(b) {
        this.isVibrateEnabled = b;
    }
    static setBGMEnable(b) {
        Device.isBgmEnabled = b;
        if (!b) {
            this.bgm_clip && this.bgm_clip.pause();
        }
        else {
            this.bgm_clip && this.bgm_clip.play();
        }
    }
    static playSfx(url, loop = false, volume = 1) {
        this.stopSfx(url);
        if (!Device.isSfxEnabled) {
            return;
        }
        url = url;
        PlayerInfo_1.PlayerInfo.audioBundle.load(url, cc_1.AudioClip, (err, clip) => {
            if (err)
                console.warn(err);
            else {
                this._clips[url] = clip;
                this.playEffect(clip, loop, volume);
            }
        });
    }
    static stopSfx(url) {
        let clip = this._clips[url];
        if (clip) {
            clip.stop();
        }
    }
    static stopAllEffect() {
        for (var k in this._clips) {
            let v = this._clips[k];
            v.stop();
        }
    }
    static playBGM(url, loop = true) {
        if (!Device.isBgmEnabled) {
            return;
        }
        this.stopMusic();
        if (url.indexOf('/') == -1) {
            url = url;
        }
        PlayerInfo_1.PlayerInfo.audioBundle.load(url, cc_1.AudioClip, (err, clip) => {
            if (err)
                console.log(err);
            else {
                this.playMusic(clip, loop);
            }
        });
    }
    static setAudioPath(path) {
        Device.audio_path = path;
    }
    static playEffect(clip, loop = false, volume = 1) {
        if (Device.isSfxEnabled) {
            clip.setLoop(loop);
            clip.setVolume(volume);
            return clip.play();
        }
    }
    static stopMusic() {
        this.bgm_clip && this.bgm_clip.stop();
    }
    static playMusic(clip, loop = true) {
        if (Device.isBgmEnabled) {
            this.bgm_clip = clip;
            clip.setLoop(loop);
            return clip.play();
        }
    }
    static vibrate(long) {
        if (!this.isVibrateEnabled) {
            return;
        }
        if (cc.sys.WECHAT_GAME == cc.sys.platform) {
            if (long)
                wx.vibrateLong();
            else
                wx.vibrateShort();
        }
        else {
            // console.log("not support vibrate on except-wx platfrom ")
        }
    }
}
Device.isSfxEnabled = true;
Device.isBgmEnabled = true;
Device.isVibrateEnabled = true;
Device.audio_path = "Audio/";
Device._clips = {};
Device.bgm_clip = null;
exports.default = Device;
window['Device'] = Device;
