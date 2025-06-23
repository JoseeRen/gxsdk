"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasrTimer = void 0;
// PasrTimer
class PasrTimer {
    constructor(pause = 0, attack = 0, sustain = 0, release = 0) {
        this.stage = 0;
        this.stageTime = [];
        this.timer = 0;
        this.value = 0;
        this.queriedSustain = false;
        this.queriedRelease = false;
        this.queriedFinished = false;
        this.stageTime = new Array;
        this.stageTime[0] = pause;
        this.stageTime[1] = attack;
        this.stageTime[2] = sustain;
        this.stageTime[3] = release;
        this.stage = 4;
        this.queriedFinished = true;
    }
    set p(v) {
        this.stageTime[0] = v;
    }
    get p() {
        return this.stageTime[0];
    }
    set a(v) {
        this.stageTime[1] = v;
    }
    get a() {
        return this.stageTime[1];
    }
    set s(v) {
        this.stageTime[2] = v;
    }
    get s() {
        return this.stageTime[2];
    }
    set r(v) {
        this.stageTime[3] = v;
    }
    get r() {
        return this.stageTime[3];
    }
    setStateTime(timeIndex, time) {
        this.stageTime[timeIndex] = time;
    }
    Tick(deltaTime) {
        if (this.stage == 4) {
            this.value = 0;
            return 0;
        }
        while (this.stage < 4 && (this.timer >= 1 || this.stageTime[this.stage] == 0)) {
            this.timer = 0;
            this.stage++;
        }
        if (this.stage < 4) {
            this.timer += deltaTime / this.stageTime[this.stage];
            if (this.timer > 1) {
                this.timer = 1;
            }
        }
        if (this.stage == 0) {
            this.value = 0;
        }
        else if (this.stage == 1) {
            this.value = this.timer;
        }
        else if (this.stage == 2) {
            this.value = 1;
        }
        else if (this.stage == 3) {
            this.value = 1 - this.timer;
        }
        else {
            this.value = 0;
        }
        return this.value;
    }
    GetValue() {
        return this.value;
    }
    reachedSustain() {
        if (this.queriedSustain) {
            return false;
        }
        if (this.stage >= 2) {
            this.queriedSustain = true;
            return true;
        }
        return false;
    }
    reachedRelease() {
        if (this.queriedRelease) {
            return false;
        }
        if (this.stage >= 3) {
            this.queriedRelease = true;
            return true;
        }
        return false;
    }
    isFinished() {
        return this.stage == 4;
    }
    reachedFinished() {
        if (this.stage == 4 && !this.queriedFinished) {
            this.queriedFinished = true;
            return true;
        }
        return false;
    }
    reset() {
        this.stage = 0;
        this.timer = 0;
        this.value = 0;
        this.queriedSustain = false;
        this.queriedFinished = false;
    }
    Stop() {
        this.stage = 4;
    }
    GetStage() {
        return this.stage;
    }
    SetStage(stage) {
        this.stage = stage;
        this.timer = 0;
    }
    TotalTime() {
        return this.stageTime[0] + this.stageTime[1] + this.stageTime[2] + this.stageTime[3];
    }
}
exports.PasrTimer = PasrTimer;
