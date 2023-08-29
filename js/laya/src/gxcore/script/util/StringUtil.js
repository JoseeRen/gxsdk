"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringUtil {
    /**
     * 超长字符用’...‘替代
     * @param str
     * @param maxLen
     */
    static subString(str, maxLen = 10) {
        let len = StringUtil.getLength(str);
        let l = 0, i = 0;
        let a = str.split("");
        for (i = 0; i < a.length; i++) {
            if (a[i].charCodeAt(0) < 299) {
                l++;
                if (l > maxLen) {
                    l = l - 1;
                    break;
                }
            }
            else {
                l += 2;
                if (l > maxLen) {
                    l = l - 2;
                    break;
                }
            }
        }
        return str.substr(0, i) + (len > maxLen ? '...' : '');
    }
    static getLength(str) {
        let n_str = new String(str);
        let bytesCount = 0;
        for (let i = 0, n = n_str.length; i < n; i++) {
            let c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                bytesCount += 1;
            }
            else {
                bytesCount += 2;
            }
        }
        return bytesCount;
    }
    /**
     * 分隔符分割字符串
     * @param str
     * @param sep
     * @param len
     */
    static formatString(str, sep = ',', len = 3) {
        str = str.toString();
        let strLen = str.length;
        let newStr = str;
        for (let i = strLen - len; i > 0; i -= len) {
            let left = str.substring(0, i);
            let right = str.substring(i);
            newStr = left + sep + right;
            strLen = str.length;
            str = newStr;
        }
        return newStr;
    }
    /**字符串分割为数组 */
    static toArray(str, sep = ';') {
        let new_list = [];
        let list = str.replace(' ', '').split(sep);
        list.forEach(key => {
            if (key != null && key !== undefined && key != '') {
                if (!isNaN(Number(key))) {
                    key = Number(key);
                }
                new_list.push(key);
            }
        });
        return new_list;
    }
    /**删除字符串左右空格 */
    static trim(str) {
        if (typeof str !== 'string')
            return str;
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
}
exports.default = StringUtil;
