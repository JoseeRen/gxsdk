"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
class State {
    constructor(id, name) {
        this.__interval_callbacks = [];
        this.interval_id = 0;
        this.id = id;
        this.name = name;
    }
    onEnter(params) { }
    onExit() { }
    onUpdate(dt) { }
    //messages 
    on() { }
    off() { }
    clearIntervals() {
        this.__interval_callbacks.splice(0, this.__interval_callbacks.length);
    }
    setInterval(interval, callback, target) {
        let id = ++this.interval_id;
        let timer = 0;
        this.__interval_callbacks.push({ id, callback, target, interval, timer });
        return id;
    }
    clearInterval(id) {
        this.__interval_callbacks.splice(this.__interval_callbacks.indexOf(id));
    }
    setTimeout(delay, callback, target) {
        let id = ++this.interval_id;
        let timer = 0;
        this.__interval_callbacks.push({ id, callback, target, delay, timer });
        return id;
    }
    clearTimeout(id) {
        this.clearInterval(id);
    }
    invokeIntervals(dt) {
        for (let i = 0; i < this.__interval_callbacks.length; i++) {
            const element = this.__interval_callbacks[i];
            element.timer = element.timer + dt;
            if (element.interval) {
                if (element.timer >= element.interval) {
                    element.timer = 0;
                    // call
                    element.callback.call(element.target);
                }
            }
            else if (element.delay) {
                if (element.timer >= element.delay) {
                    // call
                    element.callback.call(element.target);
                    this.__interval_callbacks.splice(i);
                    i--;
                }
            }
        }
    }
}
exports.State = State;
class CustomState extends State {
    constructor(target, id, name, pattern) {
        super(id, name);
        let enterName = cc_1.js.formatStr(pattern, "onEnter", this.name);
        let updateName = cc_1.js.formatStr(pattern, "onUpdate", this.name);
        let exitName = cc_1.js.formatStr(pattern, "onExit", this.name);
        this.__target = target;
        this.__enterFunc = this.__target[enterName];
        this.__updateFunc = this.__target[updateName];
        this.__exitFunc = this.__target[exitName];
    }
    onEnter(params) {
        this.clearIntervals();
        if (this.__enterFunc) {
            this.__enterFunc.call(this.__target, this, params);
        }
    }
    onExit() {
        if (this.__exitFunc) {
            this.__exitFunc.call(this.__target, this);
        }
    }
    onUpdate(dt) {
        this.invokeIntervals(dt);
        if (this.__updateFunc) {
            this.__updateFunc.call(this.__target, this, dt);
        }
    }
}
class FSM extends cc_1.Component {
    constructor() {
        super(...arguments);
        this.timeElapsed = 0;
        this._states = {};
        this._isPaused = false;
        this._log = false;
    }
    get target() {
        return this._target;
    }
    init(target, states, params = '%s_%s') {
        this._target = target;
        this.timeElapsed = 0;
        if (states)
            this.addStates(states, params);
    }
    getState(stateId) {
        return this._states[stateId];
    }
    getCurrentState() {
        return this.c;
    }
    getPreviousState() {
        return this.p;
    }
    addStates(states, callbackNamePattern = "%s_%sState") {
        let keys = Object.keys(states);
        let enumLen = (keys.length / 2);
        this.namePattern = callbackNamePattern;
        for (var i = 0; i < enumLen; i++) {
            let key = keys[i];
            let value = states[key];
            this.addState(key, value);
        }
    }
    addState(id, name, enterCallback, exitCallback, updateCallback, target) {
        if (this._log)
            console.log("[FSM]" + this.target.__classname__ + "(" + this.target.name + ")" + " Add State :", id, name);
        let state = new CustomState(this.target, id, name, this.namePattern);
        this._states[id] = state;
        if (enterCallback)
            state.__enterFunc = enterCallback;
        if (exitCallback)
            state.__exitFunc = exitCallback;
        if (updateCallback)
            state.__updateFunc = updateCallback;
        if (target)
            state.__target = target;
    }
    /**
     * first state
     * @param: state index or State
     */
    enterState(stateId, params) {
        this.timeElapsed = 0;
        let state = this._states[stateId];
        this.c = state;
        state.onEnter(params);
        if (this._log)
            console.log("[FSM]" + this.target.__classname__ + " First State:", state.name);
    }
    revertState() {
        this.changeState(this.p.id);
    }
    pause() {
        this._isPaused = true;
    }
    resume() {
        this._isPaused = false;
    }
    resetTime() {
        this.timeElapsed = 0;
    }
    resetCurrentState() {
        this.timeElapsed = 0;
        console.log(cc_1.js.formatStr("[FSM] %s reset currentState", this.target.__classname__));
        this.c.onExit();
        this.c.onEnter();
    }
    changeState(stateId, params) {
        let state = this._states[stateId];
        if (state == null) {
            console.warn("[FSM] invalid state for stateId " + stateId + " of : " + this.target.__classname__);
            return;
        }
        if (this._isPaused) {
            console.warn("[FSM] fsm is paused ! " + this.target.__classname__ + " changeState to <" + state.name + "> failed!");
            return;
        }
        if (this.c) {
            if (stateId == this.c.id) {
                if (this._log)
                    console.log(this.target.__classname__ + " already in state :" + state.name);
                return;
            }
            ;
            this.c.onExit();
            this.p = this.c;
        }
        this.timeElapsed = 0;
        this.c = state;
        if (this._log)
            console.log(cc_1.js.formatStr("[FSM] %s (%s): %s -> %s", this.target.__classname__, this.name, this.p.name, state.name));
        this.c.onEnter(params);
    }
    isInState(stateId) {
        return this.c == this._states[stateId];
    }
    update(dt) {
        if (this._isPaused)
            return;
        if (FSM.debug)
            dt = 0.016; // use real deta
        this.timeElapsed += dt;
        if (this.c)
            this.c.onUpdate(dt);
    }
}
FSM.debug = false;
exports.default = FSM;
