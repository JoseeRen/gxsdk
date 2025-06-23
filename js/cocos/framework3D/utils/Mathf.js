"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mathf {
    static Clamp(value, min, max) {
        if (value < min)
            value = min;
        else if (value > max)
            value = max;
        return value;
    }
    // Loops the value t, so that it is never larger than length and never smaller than 0.
    static Repeat(t, length) {
        return Mathf.Clamp(t - Math.floor(t / length) * length, 0.0, length);
    }
    /**
     PingPongs the value t, so that it is never larger than length and never smaller than 0.
    */
    static PingPong(t, length) {
        t = Mathf.Repeat(t, length * 2);
        return length - Math.abs(t - length);
    }
    // Calculates the ::ref::Lerp parameter between of two values.
    static InverseLerp(a, b, value) {
        if (a != b)
            return Mathf.Clamp01((value - a) / (b - a));
        else
            return 0.0;
    }
    // Calculates the shortest difference between two given angles.
    static DeltaAngle(current, target) {
        let delta = Mathf.Repeat((target - current), 360.0);
        if (delta > 180)
            delta -= 360;
        return delta;
    }
    static Clamp01(value) {
        if (value < 0)
            return 0;
        else if (value > 1)
            return 1;
        else
            return value;
    }
    // Interpolates between /a/ and /b/ by /t/. /t/ is clamped between 0 and 1.
    static Lerp(a, b, t) {
        return a + (b - a) * Mathf.Clamp01(t);
    }
    static LerpAngle(a, b, t) {
        let delta = Mathf.Repeat((b - a), 360);
        if (delta > 180)
            delta -= 360;
        return a + delta * Mathf.Clamp01(t);
    }
}
exports.default = Mathf;
