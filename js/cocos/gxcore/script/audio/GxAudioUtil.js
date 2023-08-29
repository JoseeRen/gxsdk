"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataStorage_1 = __importDefault(require("../util/DataStorage"));
class AudioUtil {
    static playSound(path, loop = false) {
        if (!DataStorage_1.default.soundPlay)
            return;
        if (typeof path == "undefined" || path == null)
            return null;
        if (cc.loader.getRes(path, cc.AudioClip) != null)
            path = cc.loader.getRes(path, cc.AudioClip);
        else if (typeof path === 'string')
            path = cc.url.raw('resources/' + path);
        let handle = cc.audioEngine.playEffect(path, loop);
        return handle;
    }
    static stopSound(audioID) {
        if (Number(audioID) !== NaN) {
            cc.audioEngine.stopEffect(audioID);
        }
    }
    static stopAllSounds() {
        cc.audioEngine.stopAllEffects();
    }
    static playMusic(path, loop = true) {
        if (!DataStorage_1.default.musicPlay)
            return;
        if (typeof path == "undefined" || path == null)
            return null;
        if (cc.loader.getRes(path, cc.AudioClip) != null)
            path = cc.loader.getRes(path, cc.AudioClip);
        else if (typeof path === 'string')
            path = cc.url.raw('resources/' + path);
        this.stopMusic();
        this.musicHandle = cc.audioEngine.playMusic(path, loop);
    }
    static stopMusic() {
        this.musicHandle = null;
        cc.audioEngine.stopMusic();
    }
    static pauseAll() {
        cc.audioEngine.pauseAll();
    }
    static resumeAll() {
        cc.audioEngine.resumeAll();
    }
    static isMusicPlaying() {
        return cc.audioEngine.isMusicPlaying();
    }
    static pauseMusic() {
        if (this.musicHandle) {
            cc.audioEngine.pauseMusic();
        }
    }
    static resumeMusic() {
        if (this.musicHandle) {
            cc.audioEngine.resumeMusic();
        }
    }
    static stopAll() {
        cc.audioEngine.stopAll();
    }
    static setSoundVolume(volume) {
        cc.audioEngine.setEffectsVolume(volume);
    }
    static setMusicVolume(volume) {
        cc.audioEngine.setMusicVolume(volume);
    }
}
AudioUtil.musicHandle = null;
AudioUtil.effectHandle = [];
exports.default = AudioUtil;
