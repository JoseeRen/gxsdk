"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataStorage_1 = __importDefault(require("../util/DataStorage"));
class GxAudioUtil {
    static init() {
        this._isInit = true;
        // 失去焦点后是否自动停止背景音乐。
        GxAudioUtil.autoStopMusic = true;
        Laya.SoundManager.useAudioMusic = false;
    }
    /**
     * 播放音效。音效可以同时播放多个。
     * @param url 声音文件地址。
     * @param loops 循环次数,0表示无限循环。
     * @param complete 声音播放完成回调  Handler对象。
     * @param soundClass 使用哪个声音类进行播放，null表示自动选择。
     * @param startTime 声音播放起始时间。
     * @return SoundChannel对象，通过此对象可以对声音进行控制，以及获取声音信息。
     */
    static playSound(url, loops = 1, complete, soundClass, startTime) {
        !this._isInit && GxAudioUtil.init();
        if (!DataStorage_1.default.soundPlay)
            return;
        if (typeof url == "undefined" || url == null || url == '')
            return null;
        return Laya.SoundManager.playSound(url, loops, complete, soundClass, startTime);
    }
    static stopSound(url) {
        Laya.SoundManager.stopSound(url);
    }
    static stopAllSounds() {
        Laya.SoundManager.stopAllSound();
    }
    static get musicChannel() {
        return this._musicChannel;
    }
    static playMusic(url, loops = 0, complete, startTime) {
        !this._isInit && GxAudioUtil.init();
        if (!DataStorage_1.default.musicPlay)
            return;
        if (typeof url == "undefined" || url == null || url == '')
            return null;
        this._musicChannel = Laya.SoundManager.playMusic(url, loops, complete, startTime);
    }
    static pauseMusic() {
        if (this._musicChannel) {
            this._musicChannel.pause();
        }
    }
    static resumeMusic() {
        if (this._musicChannel) {
            this._musicChannel.resume();
        }
    }
    static stopMusic() {
        Laya.SoundManager.stopMusic();
        this._musicChannel = null;
    }
    /**
     * 停止播放所有声音（包括背景音乐和音效）
     */
    static stopAll() {
        Laya.SoundManager.stopAll();
        this._musicChannel = null;
    }
    /**
     * 设置音乐或音效音量。
     * @param volume 音量。初始值为1。音量范围从 0（静音）至 1（最大音量）。
     * @param url (default = null)声音播放地址。默认为null。为空表示设置所有音效（不包括背景音乐）的音量，不为空表示设置指定声音（背景音乐或音效）的音量。
     */
    static setSoundVolume(volume, url) {
        Laya.SoundManager.setSoundVolume(volume, url);
    }
    /**
     * 设置音乐音量。
     * @param volume 音量。初始值为1。音量范围从 0（静音）至 1（最大音量）。
     */
    static setMusicVolume(volume) {
        Laya.SoundManager.setMusicVolume(volume);
    }
    /**
     * 背景音乐和所有音效是否静音。
     */
    static set muted(value) {
        Laya.SoundManager.muted = value;
    }
    static get muted() {
        return Laya.SoundManager.muted;
    }
    /**
     * 所有音效（不包括背景音乐）是否静音。
     */
    static set soundMuted(value) {
        Laya.SoundManager.soundMuted = value;
    }
    static get soundMuted() {
        return Laya.SoundManager.soundMuted;
    }
    /**
     * 背景音乐（不包括音效）是否静音。
     */
    static set musicMuted(value) {
        Laya.SoundManager.musicMuted = value;
    }
    static get musicMuted() {
        return Laya.SoundManager.musicMuted;
    }
    /**
     * 失去焦点后是否自动停止背景音乐。
     * @param v Boolean 失去焦点后是否自动停止背景音乐。
     */
    static set autoStopMusic(v) {
        Laya.SoundManager.autoStopMusic = v;
    }
    static get autoStopMusic() {
        return Laya.SoundManager.autoStopMusic;
    }
}
GxAudioUtil._musicChannel = null;
GxAudioUtil._isInit = false;
exports.default = GxAudioUtil;
