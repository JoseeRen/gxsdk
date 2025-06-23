"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const DataCenter_1 = __importStar(require("../../core/DataCenter"));
const Platform_1 = __importDefault(require("../Platform"));
const WeakNetGame_1 = __importDefault(require("./WeakNetGame"));
const gameUtil_1 = __importDefault(require("../../utils/gameUtil"));
let firstEnterHome = true;
let UserInfoDC = (() => {
    let _classDecorators = [(0, DataCenter_1.dc)("UserInfo")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = DataCenter_1.default;
    let _lastLoginTime_decorators;
    let _lastLoginTime_initializers = [];
    let _lastLoginTime_extraInitializers = [];
    let _isFirstLoginToday_decorators;
    let _isFirstLoginToday_initializers = [];
    let _isFirstLoginToday_extraInitializers = [];
    let _isFirstEnterGame_decorators;
    let _isFirstEnterGame_initializers = [];
    let _isFirstEnterGame_extraInitializers = [];
    let _nickName_decorators;
    let _nickName_initializers = [];
    let _nickName_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _avatarUrl_decorators;
    let _avatarUrl_initializers = [];
    let _avatarUrl_extraInitializers = [];
    let _firstLoginTime_decorators;
    let _firstLoginTime_initializers = [];
    let _firstLoginTime_extraInitializers = [];
    let _lastExitTime_decorators;
    let _lastExitTime_initializers = [];
    let _lastExitTime_extraInitializers = [];
    let _gender_decorators;
    let _gender_initializers = [];
    let _gender_extraInitializers = [];
    let _auth_decorators;
    let _auth_initializers = [];
    let _auth_extraInitializers = [];
    var UserInfoDC = _classThis = class extends _classSuper {
        get userType() {
            return this.isNew ? "(新玩家)" : "(老玩家)";
        }
        exitGame() {
            this.lastExitTime = Date.now() / 1000;
            this.save("lastExitTime");
        }
        onLoadAll() {
            if (this.firstLoginTime == 0) {
                this.firstLoginTime = Date.now();
            }
            if (gameUtil_1.default.isNextDay(this.firstLoginTime)) {
                this.isNew = false;
            }
            else {
                this.isNew = true;
            }
            if (gameUtil_1.default.isNextDay(this.lastLoginTime)) {
                this.lastLoginTime = Date.now();
                this.isFirstLoginToday = true;
            }
            else {
                this.isFirstLoginToday = false;
            }
            if (isEmpty(this.userId)) {
                this.userId = g.uuid(32, 16);
            }
            this.save();
        }
        /**
         * 上传用户数据
         * @param kvs
         */
        uploadUserInfo(kvs) {
            return __awaiter(this, void 0, void 0, function* () {
                //仅对授权过的用户进行提交数据
                if (isEmpty(exports.UserInfo.userId)) {
                    return -1;
                }
                //开始上传
                try {
                    let d = {
                    // userId: UserInfo.userId,
                    // nickName: UserInfo.nickName,
                    // avatarUrl: UserInfo.avatarUrl,
                    // gender: UserInfo.gender,
                    // channel: channel,
                    };
                    for (var k in kvs) {
                        d[k] = kvs[k];
                    }
                    //上传授权信息
                    yield WeakNetGame_1.default.syncData(JSON.stringify(d));
                }
                catch (e) {
                    console.error("上传数据失败" + e);
                    return -2;
                }
                return 0;
            });
        }
        /**
         *  在 WxgetInfoButton 的按钮回调里执行
         * @param kvs 需要上传的key-value 对 数据
         * @param authInfo 从WxgetInfoButton 按钮回调里获取的参数
         * @returns 0 表示成功上传 ,- 1玩家 未授权， -2  上传过程失败
         */
        openRankAndUpload(kvs, authInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                if (exports.UserInfo.auth == false) {
                    if (!authInfo) {
                        authInfo = yield Platform_1.default.checkAuth();
                    }
                    //update user info 
                    if (authInfo == null) {
                        //玩家未授权
                        return -1;
                    }
                    else {
                        //已授权 
                        exports.UserInfo.nickName = authInfo.nickName;
                        if (isEmpty(exports.UserInfo.userId)) {
                            exports.UserInfo.userId = g.uuid(32, 16);
                        }
                        exports.UserInfo.gender = authInfo.gender;
                        exports.UserInfo.avatarUrl = authInfo.avatarUrl;
                        exports.UserInfo.auth = true;
                        //保存授权信息
                        exports.UserInfo.save();
                        let channel = '';
                        if (CC_WECHAT) {
                            if (window.tt) {
                                channel = 'tt';
                            }
                            else if (window.qq) {
                                channel = 'qq';
                            }
                            else {
                                channel = 'wx';
                            }
                        }
                        else {
                            channel = 'sim';
                        }
                        if (kvs == null) {
                            kvs = {};
                        }
                        kvs["nickName"] = exports.UserInfo.nickName;
                        kvs["avatarUrl"] = exports.UserInfo.avatarUrl;
                        kvs["gender"] = exports.UserInfo.gender;
                        kvs['channel'] = channel;
                        kvs['auth'] = true;
                        //开始上传
                        return this.uploadUserInfo(kvs);
                    }
                }
            });
        }
        /**检查是否有离线收益
         * @returns 离线时间  (s)
        */
        checkOffline() {
            if (firstEnterHome) {
                firstEnterHome = false;
                let offset = Date.now() / 1000 - exports.UserInfo.lastExitTime;
                if (offset > 60) {
                    return offset;
                }
                return 0;
            }
        }
        constructor() {
            super(...arguments);
            // @field()
            // ip_cname: string = ""
            // @field()
            // ip_addr: string = ""
            // @field()
            // ip_s: number = 0;
            this.lastLoginTime = __runInitializers(this, _lastLoginTime_initializers, 0);
            this.isFirstLoginToday = (__runInitializers(this, _lastLoginTime_extraInitializers), __runInitializers(this, _isFirstLoginToday_initializers, false));
            /**需要在进入后置为false */
            this.isFirstEnterGame = (__runInitializers(this, _isFirstLoginToday_extraInitializers), __runInitializers(this, _isFirstEnterGame_initializers, true));
            //================-----------------------
            this.nickName = (__runInitializers(this, _isFirstEnterGame_extraInitializers), __runInitializers(this, _nickName_initializers, ''));
            this.userId = (__runInitializers(this, _nickName_extraInitializers), __runInitializers(this, _userId_initializers, ''));
            this.avatarUrl = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _avatarUrl_initializers, ''));
            //================-----------------------
            this.firstLoginTime = (__runInitializers(this, _avatarUrl_extraInitializers), __runInitializers(this, _firstLoginTime_initializers, 0));
            /**最后一次退出游戏 的时间 ,秒为单位  */
            this.lastExitTime = (__runInitializers(this, _firstLoginTime_extraInitializers), __runInitializers(this, _lastExitTime_initializers, 0));
            this.gender = (__runInitializers(this, _lastExitTime_extraInitializers), __runInitializers(this, _gender_initializers, 0));
            // （新玩家）当天退出游戏再进也算 
            this.isNew = (__runInitializers(this, _gender_extraInitializers), false);
            this.tipIndex = 0;
            this.auth = __runInitializers(this, _auth_initializers, false);
            __runInitializers(this, _auth_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "UserInfoDC");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _lastLoginTime_decorators = [(0, DataCenter_1.field)()];
        _isFirstLoginToday_decorators = [(0, DataCenter_1.field)()];
        _isFirstEnterGame_decorators = [(0, DataCenter_1.field)()];
        _nickName_decorators = [(0, DataCenter_1.field)()];
        _userId_decorators = [(0, DataCenter_1.field)()];
        _avatarUrl_decorators = [(0, DataCenter_1.field)()];
        _firstLoginTime_decorators = [(0, DataCenter_1.field)()];
        _lastExitTime_decorators = [(0, DataCenter_1.field)()];
        _gender_decorators = [(0, DataCenter_1.field)()];
        _auth_decorators = [(0, DataCenter_1.field)()];
        __esDecorate(null, null, _lastLoginTime_decorators, { kind: "field", name: "lastLoginTime", static: false, private: false, access: { has: obj => "lastLoginTime" in obj, get: obj => obj.lastLoginTime, set: (obj, value) => { obj.lastLoginTime = value; } }, metadata: _metadata }, _lastLoginTime_initializers, _lastLoginTime_extraInitializers);
        __esDecorate(null, null, _isFirstLoginToday_decorators, { kind: "field", name: "isFirstLoginToday", static: false, private: false, access: { has: obj => "isFirstLoginToday" in obj, get: obj => obj.isFirstLoginToday, set: (obj, value) => { obj.isFirstLoginToday = value; } }, metadata: _metadata }, _isFirstLoginToday_initializers, _isFirstLoginToday_extraInitializers);
        __esDecorate(null, null, _isFirstEnterGame_decorators, { kind: "field", name: "isFirstEnterGame", static: false, private: false, access: { has: obj => "isFirstEnterGame" in obj, get: obj => obj.isFirstEnterGame, set: (obj, value) => { obj.isFirstEnterGame = value; } }, metadata: _metadata }, _isFirstEnterGame_initializers, _isFirstEnterGame_extraInitializers);
        __esDecorate(null, null, _nickName_decorators, { kind: "field", name: "nickName", static: false, private: false, access: { has: obj => "nickName" in obj, get: obj => obj.nickName, set: (obj, value) => { obj.nickName = value; } }, metadata: _metadata }, _nickName_initializers, _nickName_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _avatarUrl_decorators, { kind: "field", name: "avatarUrl", static: false, private: false, access: { has: obj => "avatarUrl" in obj, get: obj => obj.avatarUrl, set: (obj, value) => { obj.avatarUrl = value; } }, metadata: _metadata }, _avatarUrl_initializers, _avatarUrl_extraInitializers);
        __esDecorate(null, null, _firstLoginTime_decorators, { kind: "field", name: "firstLoginTime", static: false, private: false, access: { has: obj => "firstLoginTime" in obj, get: obj => obj.firstLoginTime, set: (obj, value) => { obj.firstLoginTime = value; } }, metadata: _metadata }, _firstLoginTime_initializers, _firstLoginTime_extraInitializers);
        __esDecorate(null, null, _lastExitTime_decorators, { kind: "field", name: "lastExitTime", static: false, private: false, access: { has: obj => "lastExitTime" in obj, get: obj => obj.lastExitTime, set: (obj, value) => { obj.lastExitTime = value; } }, metadata: _metadata }, _lastExitTime_initializers, _lastExitTime_extraInitializers);
        __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: obj => "gender" in obj, get: obj => obj.gender, set: (obj, value) => { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
        __esDecorate(null, null, _auth_decorators, { kind: "field", name: "auth", static: false, private: false, access: { has: obj => "auth" in obj, get: obj => obj.auth, set: (obj, value) => { obj.auth = value; } }, metadata: _metadata }, _auth_initializers, _auth_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserInfoDC = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserInfoDC = _classThis;
})();
exports.default = UserInfoDC;
exports.UserInfo = DataCenter_1.default.register(UserInfoDC);
