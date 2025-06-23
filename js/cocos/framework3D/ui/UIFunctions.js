"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
class UIFunctions {
    static getChildrenAnimations(node) {
        let animations = [];
        var anim = node.getComponent(cc_1.AnimationComponent);
        if (anim)
            animations.push(anim);
        for (var i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            var anim = child.getComponent(cc_1.AnimationComponent);
            if (anim)
                animations.push(anim);
        }
        return animations;
    }
    static stopAnimations(animations) {
        animations.forEach((anim) => {
            anim.stop();
        });
    }
    static doShowAnimations(animations, finishCallback, target) {
        let maxDuration = 0;
        let maxDurationAnimation;
        animations.forEach((anim) => {
            let clips = anim.clips;
            if (clips.length > 0) {
                let clip = clips[0];
                anim.play(clip.name);
                let animState = anim.getState(clip.name);
                animState.wrapMode = 1;
                if (clip.duration > maxDuration) {
                    maxDuration = clip.duration;
                    maxDurationAnimation = anim;
                }
            }
        });
        if (finishCallback) {
            let func = function () {
                // console.log("finish animations")
                if (maxDurationAnimation)
                    maxDurationAnimation.off("finished", func);
                finishCallback.call(target);
            };
            if (maxDurationAnimation)
                maxDurationAnimation.on("finished", func);
            else
                finishCallback.call(target);
        }
    }
    // static getLongestAnimation(animations)
    // {
    //     animations.forEach((anim:AnimationComponent)=>{
    //         let clips = anim.getClips()
    //         for (clips)
    //         //以最长的为准
    //     }
    // }
    //TODO:还未实现
    static isAnimationRunning(animations) {
        return false;
    }
    static doHideAnimations(animations, finishCallback, target) {
        let hasHideAnimation = false;
        let maxDuration = 0;
        let maxDurationAnimation;
        animations.forEach((anim) => {
            let clips = anim.clips;
            if (clips.length == 2) {
                let clip = clips[clips.length - 1];
                // anim.on("finished",onHideAnimationFinished)
                hasHideAnimation = true;
                anim.play(clip.name);
                if (clip.duration > maxDuration) {
                    maxDuration = clip.duration;
                    maxDurationAnimation = anim;
                }
            }
            else if (clips.length == 1) {
                let clip = clips[0];
                hasHideAnimation = true;
                anim.play(clip.name);
                let animState = anim.getState(clip.name);
                animState.wrapMode = 36;
                if (clip.duration > maxDuration) {
                    maxDuration = clip.duration;
                    maxDurationAnimation = anim;
                }
            }
        });
        if (maxDurationAnimation && finishCallback) {
            let func = function () {
                // console.log("finish animations")
                maxDurationAnimation.off("finished", func);
                finishCallback.call(target);
            };
            maxDurationAnimation.on("finished", func);
        }
        return hasHideAnimation;
    }
    static getToggleIndex(toggle) {
        let container = toggle.node.getParent();
        for (var i = 0; i < container.children.length; i++) {
            let child = container.children[i];
            if (toggle.node == child) {
                return i;
            }
        }
        return -1;
    }
    static selectToggleIndex(toggleContainer, index) {
        if (toggleContainer == null) {
            console.warn("[UIFunction.selectToggleIndex] : invalid toggleContainer :");
            return;
        }
        let toggleNode = toggleContainer.children[index];
        if (toggleNode) {
            let toggle = toggleNode.getComponent(cc_1.ToggleComponent);
            if (toggle) {
                // console.log("[UIFunction.selectToggleIndex] :" + index)
                toggle.check();
            }
        }
        else {
            console.warn("[UIFunction.selectToggleIndex] :cannot find toggle with index:" + index);
        }
    }
}
exports.default = UIFunctions;
