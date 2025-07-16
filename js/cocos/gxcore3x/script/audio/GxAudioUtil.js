"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const DataStorage_1 = __importDefault(require("../util/DataStorage"));
class AudioUtil {
    static playSound(path, loop = false) {
        if (!DataStorage_1.default.soundPlay)
            return;
        if (typeof path == "undefined" || path == null)
            return null;
        if (cc_1.loader.getRes(path, cc_1.AudioClip) != null)
            path = cc_1.loader.getRes(path, cc_1.AudioClip);
        else if (typeof path === 'string')
            path = ""; //url.raw('resources/' + path);
        let handle = ""; //audioEngine.playEffect(path, loop);
        return handle;
    }
    static stopSound(audioID) {
        if (!isNaN(Number(audioID))) { //Number(audioID)!== NaN 
            // audioEngine.stopEffect(audioID);
        }
    }
    static stopAllSounds() {
        // audioEngine.stopAllEffects();
    }
    static playMusic(path, loop = true) {
        if (!DataStorage_1.default.musicPlay)
            return;
        if (typeof path == "undefined" || path == null)
            return null;
        if (cc_1.loader.getRes(path, cc_1.AudioClip) != null)
            path = cc_1.loader.getRes(path, cc_1.AudioClip);
        else if (typeof path === 'string')
            // path = url.raw('resources/' + path);
            this.stopMusic();
        // this.musicHandle = audioEngine.playMusic(path, loop);
    }
    static stopMusic() {
        this.musicHandle = null;
        // audioEngine.stopMusic();
    }
    static pauseAll() {
        // audioEngine.pauseAll();
    }
    static resumeAll() {
        // audioEngine.resumeAll();
    }
    static isMusicPlaying() {
        // return audioEngine.isMusicPlaying();
    }
    static pauseMusic() {
        if (this.musicHandle) {
            // audioEngine.pauseMusic();
        }
    }
    static resumeMusic() {
        if (this.musicHandle) {
            // audioEngine.resumeMusic();
        }
    }
    static stopAll() {
        // audioEngine.stopAll();
    }
    static setSoundVolume(volume) {
        // audioEngine.setEffectsVolume(volume);
    }
    static setMusicVolume(volume) {
        // audioEngine.setMusicVolume(volume);
    }
}
AudioUtil.musicHandle = null;
AudioUtil.effectHandle = [];
exports.default = AudioUtil;
