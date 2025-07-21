"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UIManager_1 = __importDefault(require("./UIManager"));
const PlayerData_1 = __importDefault(require("./PlayerData"));
const GameManager_1 = __importDefault(require("./GameManager"));
const GxGame_1 = __importDefault(require("./gxcore/script/GxGame"));
const AD_1 = __importDefault(require("./AD/AD"));
class PanelGameRun extends Laya.Scene {
    constructor() {
        super();
    }
    onEnable() {
        //销毁场景
        if (GameManager_1.default.curScene != null) {
            GameManager_1.default.curScene.destroy(); //销毁场景
            GameManager_1.default.curScene = null;
        }
        UIManager_1.default.gameUI = this;
        this.beiJingLianDianXz = true;
        this.Init();
        this.bj.on(Laya.Event.MOUSE_DOWN, this, function () {
        });
        Laya.stage.on("UpdateGold", this, this.UpdateGold);
        GameManager_1.default.PlayMusic("bgm");
        //摇杆按钮按下
        this.yaoGanQuYu.on(Laya.Event.MOUSE_DOWN, this, this.anNiuAnXia);
        this.yaoGanQuYu.on(Laya.Event.MOUSE_UP, this, this.anNiuTaiQi);
        //摇杆按钮移动
        this.yaoGanQuYu.on(Laya.Event.MOUSE_MOVE, this, this.anNiuYiDong);
        if (PlayerData_1.default.GetUserData("beijing") == 1) {
            this.laBaBut.getChildAt(0).visible = false;
            Laya.SoundManager.setMusicVolume(1);
        }
        else {
            this.laBaBut.getChildAt(0).visible = true;
            Laya.SoundManager.setMusicVolume(0);
        }
        //喇叭点击
        this.laBaBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
                return;
            }
            if (PlayerData_1.default.GetUserData("beijing") == 1) {
                PlayerData_1.default.SetUserData("beijing", 0);
                this.laBaBut.getChildAt(0).visible = true;
                Laya.SoundManager.setMusicVolume(0);
                PlayerData_1.default.SaveData();
            }
            else {
                PlayerData_1.default.SetUserData("beijing", 1);
                this.laBaBut.getChildAt(0).visible = false;
                Laya.SoundManager.setMusicVolume(1);
                PlayerData_1.default.SaveData();
            }
        });
        //游戏退出按钮
        this.GameFanHuiBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            //隐藏游戏UI
            this.yoUXiUI.visible = false;
            this.queRenTuiChuUI.visible = true;
            this.jiNnegZuUIFa.visible = false; //隐藏技能页面
        });
        //退出确认UI 关闭点击事件
        this.youXiTuiChuGuanBiBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            //隐藏游戏UI
            this.yoUXiUI.visible = true;
            this.queRenTuiChuUI.visible = false; //隐藏退出确认UI
            this.jiNnegZuUIFa.visible = true; //显示技能页面
        });
        //退出确认UI 退出点击事件
        this.youXiTuiChuQueRenBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (UIManager_1.default.gameUI) {
                UIManager_1.default.gameUI.destroy();
                UIManager_1.default.gameUI = null;
            }
            UIManager_1.default.ShowUIPanel("GameRun");
        });
        //开始游戏点击事件
        this.kaiShiBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            Laya.Tween.to(this.kaiShiBut, { scaleX: 0.8, scaleY: 0.8 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.kaiShiBut, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    this.zhunBeiYeUI.visible = false;
                    this.xuanGuanUI.visible = true;
                    //显示选关返回按钮
                    this.xuanGuanFanHuiBut.visible = true;
                    //还没引导过 就弹窗 强制进入到海岛争霸模式
                    if (PlayerData_1.default.GetUserData("xiangTongShiBingHeChengYd") == false) {
                        this.jiaoXueTiShi.visible = true;
                    }
                    AD_1.default.showChaPing(3);
                    AD_1.default.hideBanner();
                }));
            }));
        });
        //选关页面返回点击事件
        this.xuanGuanFanHuiBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
                return;
            }
            this.zhunBeiYeUI.visible = true;
            this.xuanGuanUI.visible = false;
            //关闭选关返回按钮
            this.xuanGuanFanHuiBut.visible = false;
        });
        //根据难度数据 更新上面的星星
        var shu = parseInt(PlayerData_1.default.GetUserData("haiDaoZhengBaDj"));
        //星星显示
        for (var i = 0; i < shu; i++) {
            this.haiDaoZhengBaBut.getChildAt(1).getChildAt(i).skin = "UIRes/xuanGuan/xingxing.png";
        }
        //难度描述
        this.haiDaoZhengBaBut.getChildAt(0).skin = "UIRes/xuanGuan/xiShu" + shu + ".png";
        //海岛模式点击事件
        this.haiDaoZhengBaBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (this.jaiZaiUI.visible == true) {
                return;
            }
            Laya.Tween.to(this.haiDaoZhengBaBut, { scaleX: 0.8, scaleY: 0.8 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.haiDaoZhengBaBut, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    if (this.haiDaoZhengBaBut.getChildByName("suoZi").visible == true) {
                    }
                    this.jinRuDaoYouXiMoShi();
                }));
            }));
        });
        //根据难度数据 更新上面的星星
        var shu = parseInt(PlayerData_1.default.GetUserData("guShouJvDianDj"));
        //星星显示
        for (var i = 0; i < shu; i++) {
            this.jvDianZhanLingBut.getChildAt(1).getChildAt(i).skin = "UIRes/xuanGuan/xingxing.png";
        }
        //难度描述
        this.jvDianZhanLingBut.getChildAt(0).skin = "UIRes/xuanGuan/xiShu" + shu + ".png";
        //据点占领点击事件
        this.jvDianZhanLingBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (this.jaiZaiUI.visible == true) {
                return;
            }
            Laya.Tween.to(this.jvDianZhanLingBut, { scaleX: 0.8, scaleY: 0.8 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.jvDianZhanLingBut, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    if (this.jvDianZhanLingBut.getChildByName("suoZi").visible == true) {
                        UIManager_1.default.ShowGameTipUI("该关卡未解锁");
                        return;
                    }
                    if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
                        return;
                    }
                    this.haiDaoZhengBaBut.visible = false; //隐藏按钮
                    //加载动画
                    this.jaiZaiUI.visible = true;
                    this.xuanGuanFanHuiBut.visible = false; //隐藏选关返回按钮
                    //加载游戏场景
                    GameManager_1.default.loadScene(function () {
                        UIManager_1.default.gameUI.jiNnegZuUIFa.visible = true; //显示底部技能
                        UIManager_1.default.gameUI.beiJing.visible = false;
                        UIManager_1.default.gameUI.xuanGuanUI.visible = false;
                        UIManager_1.default.gameUI.yoUXiUI.visible = true;
                        UIManager_1.default.gameUI.jinBiUI.visible = false;
                        UIManager_1.default.gameUI.laBaBut.visible = false;
                        GameManager_1.default.PlayMusic("bgm2");
                        if (PlayerData_1.default.GetUserData("guShouJvDianYinDao") == false) {
                            UIManager_1.default.gameUI.yindaoTanChuang(UIManager_1.default.gameUI.jvDianZhanLingYd);
                        }
                        //获取模式
                        GameManager_1.default.curLevelManager.moShi = "jvDianZhanLing";
                        GameManager_1.default.curLevelManager.moShiChuLi();
                        GameManager_1.default.curLevelManager.nanDuDengJi = parseInt(PlayerData_1.default.GetUserData("guShouJvDianDj")); //难度等级
                        UIManager_1.default.gameUI.jaiZaiUI.visible = false; //隐藏加载页
                    }, "Scene2");
                }));
            }));
            AD_1.default.GameStartCeLue(1);
        });
        //根据难度数据 更新上面的星星
        var shu = parseInt(PlayerData_1.default.GetUserData("jvDianZhanLingDj"));
        //星星显示
        for (var i = 0; i < shu; i++) {
            this.jvDianZhanYing2But.getChildAt(1).getChildAt(i).skin = "UIRes/xuanGuan/xingxing.png";
        }
        //难度描述
        this.jvDianZhanYing2But.getChildAt(0).skin = "UIRes/xuanGuan/xiShu" + shu + ".png";
        //据点占领2 模式点击事件
        this.jvDianZhanYing2But.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (this.jaiZaiUI.visible == true) {
                return;
            }
            Laya.Tween.to(this.jvDianZhanYing2But, { scaleX: 0.8, scaleY: 0.8 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.jvDianZhanYing2But, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    if (this.jvDianZhanYing2But.getChildByName("suoZi").visible == true) {
                        UIManager_1.default.ShowGameTipUI("该关卡未解锁");
                        return;
                    }
                    if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
                        return;
                    }
                    this.jvDianZhanYing2But.visible = false; //隐藏按钮
                    //加载动画
                    this.jaiZaiUI.visible = true;
                    this.xuanGuanFanHuiBut.visible = false; //隐藏选关返回按钮
                    //加载游戏场景
                    GameManager_1.default.loadScene(function () {
                        UIManager_1.default.gameUI.jiNnegZuUIFa.visible = true; //显示底部技能
                        UIManager_1.default.gameUI.beiJing.visible = false;
                        UIManager_1.default.gameUI.xuanGuanUI.visible = false;
                        UIManager_1.default.gameUI.yoUXiUI.visible = true;
                        UIManager_1.default.gameUI.jinBiUI.visible = false;
                        UIManager_1.default.gameUI.laBaBut.visible = false;
                        GameManager_1.default.PlayMusic("bgm2");
                        if (PlayerData_1.default.GetUserData("zhanLingJvDianYinDao") == false) {
                            UIManager_1.default.gameUI.yindaoTanChuang(UIManager_1.default.gameUI.jvDianZhanLing2Yd);
                        }
                        //获取模式
                        GameManager_1.default.curLevelManager.moShi = "jvDianZhanLing2";
                        GameManager_1.default.curLevelManager.moShiChuLi();
                        GameManager_1.default.curLevelManager.nanDuDengJi = parseInt(PlayerData_1.default.GetUserData("jvDianZhanLingDj")); //难度等级
                        UIManager_1.default.gameUI.jaiZaiUI.visible = false; //隐藏加载页
                    }, "Scene3");
                }));
            }));
            AD_1.default.GameStartCeLue(1);
        });
        //根据难度数据 更新上面的星星
        var shu = parseInt(PlayerData_1.default.GetUserData("xiaoDaoZuiHouDj"));
        //星星显示
        for (var i = 0; i < shu; i++) {
            this.sheiNengXiaoDaoZhBut.getChildAt(1).getChildAt(i).skin = "UIRes/xuanGuan/xingxing.png";
        }
        //难度描述
        this.sheiNengXiaoDaoZhBut.getChildAt(0).skin = "UIRes/xuanGuan/xiShu" + shu + ".png";
        //谁能笑道最后点击事件
        this.sheiNengXiaoDaoZhBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (this.jaiZaiUI.visible == true) {
                return;
            }
            Laya.Tween.to(this.sheiNengXiaoDaoZhBut, { scaleX: 0.8, scaleY: 0.8 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.sheiNengXiaoDaoZhBut, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    if (this.sheiNengXiaoDaoZhBut.getChildByName("suoZi").visible == true) {
                        UIManager_1.default.ShowGameTipUI("该关卡未解锁");
                        return;
                    }
                    if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
                        return;
                    }
                    this.sheiNengXiaoDaoZhBut.visible = false; //隐藏按钮
                    //加载动画
                    this.jaiZaiUI.visible = true;
                    this.xuanGuanFanHuiBut.visible = false; //隐藏选关返回按钮
                    //加载游戏场景
                    GameManager_1.default.loadScene(function () {
                        UIManager_1.default.gameUI.jiNnegZuUIFa.visible = true; //显示底部技能
                        UIManager_1.default.gameUI.beiJing.visible = false;
                        UIManager_1.default.gameUI.xuanGuanUI.visible = false;
                        UIManager_1.default.gameUI.yoUXiUI.visible = true;
                        UIManager_1.default.gameUI.jinBiUI.visible = false;
                        UIManager_1.default.gameUI.laBaBut.visible = false;
                        GameManager_1.default.PlayMusic("bgm2");
                        if (PlayerData_1.default.GetUserData("xiaoDaoZuiHouYinDao") == false) {
                            UIManager_1.default.gameUI.yindaoTanChuang(UIManager_1.default.gameUI.xiaoDaoZuiHouYd);
                        }
                        //获取模式
                        GameManager_1.default.curLevelManager.moShi = "xiaoDaoZuiHou";
                        GameManager_1.default.curLevelManager.moShiChuLi();
                        GameManager_1.default.curLevelManager.nanDuDengJi = parseInt(PlayerData_1.default.GetUserData("xiaoDaoZuiHouDj")); //难度等级
                        UIManager_1.default.gameUI.jaiZaiUI.visible = false; //隐藏加载页
                    }, "Scene4");
                }));
            }));
            AD_1.default.GameStartCeLue(1);
        });
        //根据难度数据 更新上面的星星
        var shu = parseInt(PlayerData_1.default.GetUserData("zuoZhanXianFengDj"));
        //星星显示
        for (var i = 0; i < shu; i++) {
            this.zuoZhanXianFengBut.getChildAt(1).getChildAt(i).skin = "UIRes/xuanGuan/xingxing.png";
        }
        //难度描述
        this.zuoZhanXianFengBut.getChildAt(0).skin = "UIRes/xuanGuan/xiShu" + shu + ".png";
        //作战先锋点击事件
        this.zuoZhanXianFengBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (this.jaiZaiUI.visible == true) {
                return;
            }
            Laya.Tween.to(this.zuoZhanXianFengBut, { scaleX: 0.8, scaleY: 0.8 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.zuoZhanXianFengBut, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    if (this.zuoZhanXianFengBut.getChildByName("suoZi").visible == true) {
                        UIManager_1.default.ShowGameTipUI("该关卡未解锁");
                        return;
                    }
                    if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
                        return;
                    }
                    this.sheiNengXiaoDaoZhBut.visible = false; //隐藏按钮
                    //加载动画
                    this.jaiZaiUI.visible = true;
                    this.xuanGuanFanHuiBut.visible = false; //隐藏选关返回按钮
                    //加载游戏场景
                    GameManager_1.default.loadScene(function () {
                        UIManager_1.default.gameUI.jiNnegZuUIFa.visible = true; //显示底部技能
                        UIManager_1.default.gameUI.beiJing.visible = false;
                        UIManager_1.default.gameUI.xuanGuanUI.visible = false;
                        UIManager_1.default.gameUI.yoUXiUI.visible = true;
                        UIManager_1.default.gameUI.jinBiUI.visible = false;
                        UIManager_1.default.gameUI.laBaBut.visible = false;
                        GameManager_1.default.PlayMusic("zzxfBgm");
                        Laya.SoundManager.setMusicVolume(0.3); //背景音乐变小
                        if (PlayerData_1.default.GetUserData("zuoZhanXianFengYinDao") == false) {
                            UIManager_1.default.gameUI.yindaoTanChuang(UIManager_1.default.gameUI.zuoZHanXianFengYd);
                        }
                        //获取模式
                        GameManager_1.default.curLevelManager.moShi = "zuoZhanXianFeng";
                        GameManager_1.default.curLevelManager.moShiChuLi();
                        GameManager_1.default.curLevelManager.nanDuDengJi = parseInt(PlayerData_1.default.GetUserData("zuoZhanXianFengDj")); //难度等级
                        UIManager_1.default.gameUI.jaiZaiUI.visible = false; //隐藏加载页
                    }, "Scene5");
                }));
            }));
            AD_1.default.GameStartCeLue(1);
        });
        //冲锋枪合成点击事件
        this.cfqXzBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            GameManager_1.default.curPlayerControl.chongFengQiangHc();
            this.shouQIangdShengJiUI.visible = false;
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //步枪兵合成点击事件
        this.buQiangXzBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            GameManager_1.default.curPlayerControl.buQiangHc();
            this.shouQIangdShengJiUI.visible = false;
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //机枪兵升级点击事件
        this.jiQiangBingXzBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            GameManager_1.default.curPlayerControl.jiQiangHc();
            this.chongFengQiangShengJiUI.visible = false;
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //火枪兵升级点击事件
        this.huoYanBingXzBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            GameManager_1.default.curPlayerControl.huoQiangHc();
            this.chongFengQiangShengJiUI.visible = false;
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //狙击手升级点击事件
        this.jvJiBingXzBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            GameManager_1.default.curPlayerControl.jvJiShouHc();
            this.buQiangShengJiUI.visible = false;
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //榴弹兵升级点击事件
        this.liuDanBingXzBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            GameManager_1.default.curPlayerControl.liuDanBingHc();
            this.buQiangShengJiUI.visible = false;
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //补给冲锋兵
        this.buJiChongFengBingBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            UIManager_1.default.gameUI.buJiUI.visible = false; //隐藏补给UI
            UIManager_1.default.gameUI.jiNnegZuUIFa.visible = true; //显示广告技能UI
            GameManager_1.default.curPlayerControl.addbanZiFun(2); //激活一个板子
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //补给步兵
        this.buJiBuBingBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            UIManager_1.default.gameUI.buJiUI.visible = false; //隐藏补给UI
            UIManager_1.default.gameUI.jiNnegZuUIFa.visible = false; //隐藏补给UI
            GameManager_1.default.curPlayerControl.addbanZiFun(3); //激活一个板子
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //补给 治疗
        this.buJiZhiLiaoBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            UIManager_1.default.gameUI.buJiUI.visible = false; //隐藏补给UI
            UIManager_1.default.gameUI.jiNnegZuUIFa.visible = false; //隐藏补给UI
            GameManager_1.default.curPlayerControl.quanTizhiLiao(parseInt(GameManager_1.default.jsonShuJv["xiaoDaoZuiHouBuJiShuJv"]["zhiLiaoSuoYouShiBing"])); //恢复血量
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //补给 提升攻击力
        this.buJiTiShengGjlBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            UIManager_1.default.gameUI.buJiUI.visible = false; //隐藏补给UI
            UIManager_1.default.gameUI.jiNnegZuUIFa.visible = false; //隐藏补给UI
            var tiSheng = parseInt(GameManager_1.default.jsonShuJv["xiaoDaoZuiHouBuJiShuJv"]["zengJiaGongJiLiShuZhi"]);
            GameManager_1.default.curLevelManager.buJiGongJiLi = GameManager_1.default.curLevelManager.buJiGongJiLi + tiSheng; //提升补给攻击力
            UIManager_1.default.ShowGameTipUI("全体单位提升" + tiSheng + "点攻击力");
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //视角切换按钮
        this.shiJiaoQieHuanBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            if (GameManager_1.default.curPlayerControl.dingWeiZhuangTai == true) {
                GameManager_1.default.curPlayerControl.dingWeiZhuangTai = false;
            }
            else {
                GameManager_1.default.curPlayerControl.dingWeiZhuangTai = true;
            }
        });
        //暂停按钮点击事件
        this.zanTingBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            this.zanTingUI.visible = true;
            this.jiNnegZuUIFa.visible = false; //隐藏广告技能组
            this.jiaoChengBut.visible = false; //隐藏教程按钮
            Laya.timer.frameOnce(8, this, function () {
                //暂停
                Laya.stage.renderingEnabled = false;
                Laya.timer.scale = 0;
            });
            AD_1.default.showChaPing(2);
            AD_1.default.showBanner();
        });
        //暂停UI点击事件
        this.zanTingUI.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            this.zanTingUI.visible = false;
            this.jiNnegZuUIFa.visible = true; //显示广告技能组
            this.jiaoChengBut.visible = true; //显示教程按钮
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
            AD_1.default.hideBanner();
        });
        //升级按钮点击事件
        for (var i = 0; i < this.shangChengUI.numChildren; i++) {
            this.shangChengUI.getChildAt(i).getChildAt(2).on(Laya.Event.CLICK, this, function (e) {
                GameManager_1.default.PlaySound("but");
                //判断能量点够不够
                if (PlayerData_1.default.IsCanLessProp(1, parseInt(e.target.parent.getChildAt(2).getChildAt(0).text))) {
                    var shuZu = PlayerData_1.default.GetUserData("shangDianDengJiZu");
                    // console.log(e.target.name);
                    shuZu[e.target.parent.name] = shuZu[e.target.parent.name] + 1;
                    PlayerData_1.default.SetUserData("shangDianDengJiZu", shuZu);
                    PlayerData_1.default.LessProp(1, parseInt(e.target.parent.getChildAt(2).getChildAt(0).text));
                    PlayerData_1.default.SaveData();
                    this.UpdateGold(); //刷新金币显示
                    this.shangChengDongTaiZhanShiShuJv(); //刷新显示
                    UIManager_1.default.ShowGameTipUI("升级成功!");
                }
                else {
                    // UIManager.ShowGameTipUI("科技点数不足!");
                    this.dianShuBuZuUI.visible = true; //显示点数不足弹窗
                    //动态获取的点数
                    this.guangGaoHuoDeDianShuXS.text = GameManager_1.default.jsonShuJv["guangGaoHuoDeDianShu"];
                }
            });
        }
        //科技商店点击事件
        this.shangDianBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            Laya.Tween.to(this.shangDianBut, { scaleX: 0.8, scaleY: 0.8 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.shangDianBut, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    this.zhunBeiYeUI.visible = false;
                    this.shangChengUI.visible = true;
                    //显示商城返回按钮
                    this.shangChengFanHuiUI.visible = true;
                    //商城动态展示数据
                    this.shangChengDongTaiZhanShiShuJv();
                    AD_1.default.showChaPing(3);
                    AD_1.default.hideBanner();
                }));
            }));
        });
        //商店返回点击事件
        this.shangChengFanHuiUI.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            this.zhunBeiYeUI.visible = true;
            this.shangChengUI.visible = false;
            this.shangChengFanHuiUI.visible = false; //隐藏商城返回按钮
        });
        //点数不足获取点数点击事件
        this.huoQuaDianShuBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            console.log("商店获取点数 广告回调");
            AD_1.default.showVideo(() => {
                //获得点数
                PlayerData_1.default.AddProp(1, parseInt(GameManager_1.default.jsonShuJv["guangGaoHuoDeDianShu"]));
                PlayerData_1.default.SaveData();
                UIManager_1.default.ShowGameTipUI("获得" + parseInt(GameManager_1.default.jsonShuJv["guangGaoHuoDeDianShu"]) + "点数");
                this.dianShuBuZuUI.visible = false; //隐藏点数不足弹窗
                this.UpdateGold();
                AD_1.default.hideBanner();
            });
        });
        //点数不足关闭点击事件
        this.dianShuBuZuGuanBiBut.on(Laya.Event.CLICK, this, function () {
            GameManager_1.default.PlaySound("but");
            this.dianShuBuZuUI.visible = false; //隐藏点数不足弹窗
            AD_1.default.hideBanner();
        });
        //判断是否自动开启商城  呼应失败后的提升实力
        if (PlayerData_1.default.GetUserData("ziDongDaKaiShangCheng") == true) {
            this.zhunBeiYeUI.visible = false;
            this.shangChengUI.visible = true;
            this.shangChengDongTaiZhanShiShuJv();
            //显示商城返回按钮
            this.shangChengFanHuiUI.visible = true;
            PlayerData_1.default.SetUserData("ziDongDaKaiShangCheng", false);
            PlayerData_1.default.SaveData();
        }
        //作战先锋 增益选择点击事件
        for (var i = 0; i < this.zengYiFuJi.numChildren; i++) {
            this.zengYiFuJi.getChildAt(i).getChildAt(1).on(Laya.Event.CLICK, this, function (e) {
                GameManager_1.default.PlaySound("but");
                //还没暂停就不能点击 不然点击后 播放动画时会定住
                if (Laya.stage.renderingEnabled == true) {
                    return;
                }
                if (e.target.parent.getChildAt(2).text == "医疗兵") {
                    //治疗光塔等级+1
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[1] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[1] + 1;
                    GameManager_1.default.curPlayerControl.addbanZiFun(8); //增加医疗兵
                }
                if (e.target.parent.getChildAt(2).text == "保卫者") {
                    //治疗光塔等级+1
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[5] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[5] + 1;
                    GameManager_1.default.curPlayerControl.addbanZiFun(9); //增加保卫者
                }
                if (e.target.parent.getChildAt(2).text == "神经突击队") {
                    //治疗光塔等级+1
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[2] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[2] + 1;
                    GameManager_1.default.curPlayerControl.addbanZiFun(10); //增加神经突击队
                }
                if (e.target.parent.getChildAt(2).text == "机枪炮台") {
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[10] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[10] + 1;
                    GameManager_1.default.curPlayerControl.addbanZiFun(16); //增加机枪炮台
                }
                if (e.target.parent.getChildAt(2).text == "榴弹炮台") {
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[11] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[11] + 1;
                    GameManager_1.default.curPlayerControl.addbanZiFun(17); //增加榴弹炮台
                }
                if (e.target.parent.getChildAt(2).text == "特殊加固") {
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[8] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[8] + 1;
                    GameManager_1.default.curPlayerControl.teShuJiaGu();
                }
                if (e.target.parent.getChildAt(2).text == "通讯兵") {
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[3] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[3] + 1;
                    GameManager_1.default.curPlayerControl.addbanZiFun(11); //增加通讯兵
                }
                if (e.target.parent.getChildAt(2).text == "时间风暴") {
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[6] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[6] + 1;
                }
                if (e.target.parent.getChildAt(2).text == "圣神祝福") {
                    GameManager_1.default.curPlayerControl.shengShenZhuFu();
                }
                if (e.target.parent.getChildAt(2).text.indexOf("武器") != -1) {
                    GameManager_1.default.curPlayerControl.duiZhangShengWuQi();
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[12] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[12] + 1;
                }
                if (e.target.parent.getChildAt(2).text == "旋涡") {
                    GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[4] = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[4] + 1;
                    GameManager_1.default.curPlayerControl.shuaXinXuanWo();
                }
                //三个按钮都变灰 不可再点击
                for (var i = 0; i < this.zengYiFuJi.numChildren; i++) {
                    this.zengYiFuJi.getChildAt(i).getChildAt(1).disabled = true;
                }
                //恢复静止
                Laya.stage.renderingEnabled = true;
                Laya.timer.scale = 1;
                Laya.Tween.to(e.target.parent, { scaleX: 0.1, scaleY: 0.1, x: 46.5, y: 84 }, 500, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    //UI归位
                    for (var i = 0; i < this.zengYiFuJi.numChildren; i++) {
                        this.zengYiFuJi.getChildAt(i).x = 22 + i * 233;
                        this.zengYiFuJi.getChildAt(i).y = 262;
                        this.zengYiFuJi.getChildAt(i).scaleX = 1;
                        this.zengYiFuJi.getChildAt(i).scaleY = 1;
                        this.zengYiFuJi.getChildAt(i).getChildAt(1).disabled = false; //恢复按钮点击
                    }
                    UIManager_1.default.gameUI.buJiUITwo.visible = false; //隐藏增益UI
                    UIManager_1.default.gameUI.jiNnegZuUIFa.visible = true; //显示广告技能UI
                }));
            });
        }
        //油桶引爆点击事件
        this.yinBaoYouTongBut.on(Laya.Event.CLICK, this, function (e) {
            this.yinBaoYouTongBut.visible = false;
            GameManager_1.default.curPlayerControl.yinBaoFuJinYouTong();
        });
        this.xuanGuanUI.height = Laya.stage.height * 0.59;
        //技能收起点击事件
        this.shouQIJiNengBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (this.shangJianTou.visible == true) {
                UIManager_1.default.gameUI.ani9_0.play(1, false); //播放一次
            }
            else {
                UIManager_1.default.gameUI.ani9.play(1, false); //播放一次
            }
        });
        // this.yaoGanFa.y = Laya.stage.height - 500;
        //恢复技能点击事件
        this.huiFuJiNengBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (this.huiFuJiNengBut.getChildAt(0).visible == true) {
                console.log(" 恢复技能 广告回调");
                AD_1.default.showVideo(() => {
                    GameManager_1.default.curPlayerControl.quanTizhiLiao(parseInt(GameManager_1.default.jsonShuJv["guangGaoZhiLiaoLiang"]));
                });
            }
            else {
                PlayerData_1.default.SetUserData("huiFuAD", PlayerData_1.default.GetUserData("huiFuAD") - 1);
                PlayerData_1.default.SaveData();
                this.shuaXinGuangGaoJiNengShou();
                GameManager_1.default.curPlayerControl.quanTizhiLiao(parseInt(GameManager_1.default.jsonShuJv["guangGaoZhiLiaoLiang"]));
            }
        });
        this.tiShengGongJiLiJiNengBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (this.tiShengGongJiLiJiNengBut.getChildAt(0).visible == true) {
                console.log("提升攻击力 广告回调");
                AD_1.default.showVideo(() => {
                    UIManager_1.default.ShowGameTipUI("所有单位攻击力提升10");
                    GameManager_1.default.curLevelManager.buJiGongJiLi = GameManager_1.default.curLevelManager.buJiGongJiLi + parseInt(GameManager_1.default.jsonShuJv["guangGaoTiShengGongjiLi"]);
                });
            }
            else {
                PlayerData_1.default.SetUserData("gongJiLiAD", PlayerData_1.default.GetUserData("gongJiLiAD") - 1);
                PlayerData_1.default.SaveData();
                this.shuaXinGuangGaoJiNengShou();
                UIManager_1.default.ShowGameTipUI("所有单位攻击力提升10");
                GameManager_1.default.curLevelManager.buJiGongJiLi = GameManager_1.default.curLevelManager.buJiGongJiLi + parseInt(GameManager_1.default.jsonShuJv["guangGaoTiShengGongjiLi"]);
            }
        });
        this.guangGaoShanDian.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (this.guangGaoShanDian.getChildAt(0).visible == true) {
                console.log("闪电技能 广告回调");
                AD_1.default.showVideo(() => {
                    GameManager_1.default.curPlayerControl.shanDianFengBao();
                });
            }
            else {
                PlayerData_1.default.SetUserData("shanDianAD", PlayerData_1.default.GetUserData("shanDianAD") - 1);
                PlayerData_1.default.SaveData();
                this.shuaXinGuangGaoJiNengShou();
                GameManager_1.default.curPlayerControl.shanDianFengBao();
            }
        });
        //广告冰冻点击事件
        this.guangGaoBingDongBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (this.guangGaoBingDongBut.getChildAt(0).visible == true) {
                console.log("暴风雪 广告回调");
                AD_1.default.showVideo(() => {
                    GameManager_1.default.curPlayerControl.guangGaoBingDongChuFa();
                });
            }
            else {
                PlayerData_1.default.SetUserData("bingFengAD", PlayerData_1.default.GetUserData("bingFengAD") - 1);
                PlayerData_1.default.SaveData();
                this.shuaXinGuangGaoJiNengShou();
                GameManager_1.default.curPlayerControl.guangGaoBingDongChuFa();
            }
        });
        //首页获得点数点击事件
        this.huoDeJinBiShouYe.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
                return;
            }
            UIManager_1.default.gameUI.ani10.play(1, false); //播放一次  shouYeHuoDianShuUi
            //首页获得点数
            this.shouYeHuoDianShuZhi.text = GameManager_1.default.jsonShuJv["guangGaoHuoDeDianShu"];
            AD_1.default.showChaPing(3);
            AD_1.default.showBanner();
        });
        //获得点数按钮
        this.huoDeDianShuBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            console.log("首页获取点数 广告回调");
            AD_1.default.showVideo(() => {
                PlayerData_1.default.AddProp(1, parseInt(GameManager_1.default.jsonShuJv["guangGaoHuoDeDianShu"]));
                PlayerData_1.default.SaveData();
                this.UpdateGold();
                this.shouYeHuoDianShuUi.visible = false;
                AD_1.default.hideBanner();
            });
        });
        this.huoDeDianShuFanHuiBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            this.shouYeHuoDianShuUi.visible = false;
            AD_1.default.hideBanner();
        });
        //引导弹窗继续游戏点击事件
        this.jiXuYouXiBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            //解除暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
            UIManager_1.default.gameUI.yinDaoFa.visible = false; //弹窗关闭
            //该引导完成
            if (UIManager_1.default.gameUI.banZiHeCheng.visible == true) {
                PlayerData_1.default.SetUserData("fuBanHeShouQiangBingYd", true);
            }
            if (UIManager_1.default.gameUI.shiBingHeCheng.visible == true) {
                PlayerData_1.default.SetUserData("xiangTongShiBingHeChengYd", true);
                //弹出引导完成UId
                UIManager_1.default.gameUI.jiaoXueWanChengUI.visible = true;
                Laya.timer.frameOnce(8, this, function () {
                    //暂停
                    Laya.stage.renderingEnabled = false;
                    Laya.timer.scale = 0;
                });
            }
            if (UIManager_1.default.gameUI.jvDianZhanLingYd.visible == true) {
                PlayerData_1.default.SetUserData("guShouJvDianYinDao", true);
            }
            if (UIManager_1.default.gameUI.jvDianZhanLing2Yd.visible == true) {
                PlayerData_1.default.SetUserData("zhanLingJvDianYinDao", true);
            }
            if (UIManager_1.default.gameUI.xiaoDaoZuiHouYd.visible == true) {
                PlayerData_1.default.SetUserData("xiaoDaoZuiHouYinDao", true);
            }
            if (UIManager_1.default.gameUI.zuoZHanXianFengYd.visible == true) {
                PlayerData_1.default.SetUserData("zuoZhanXianFengYinDao", true);
            }
            PlayerData_1.default.SaveData();
        });
        //开始教学点击事件
        this.kaiShiJiaoXueBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            UIManager_1.default.gameUI.jiaoXueTiShi.visible = false;
            // this.jinRuDaoYouXiMoShi();
        });
        //完成教学继续点击事件
        this.wanChengJiaoXueJxBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            UIManager_1.default.gameUI.jiaoXueWanChengUI.visible = false;
            //取消暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //教程按钮点击事件
        this.jiaoChengBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (GameManager_1.default.curLevelManager.moShi == "haiDaoZhengBa") {
                this.yindaoTanChuang(UIManager_1.default.gameUI.haiDaoZhengBaYinDao);
            }
            if (GameManager_1.default.curLevelManager.moShi == "jvDianZhanLing") {
                this.yindaoTanChuang(UIManager_1.default.gameUI.jvDianZhanLingYd);
            }
            if (GameManager_1.default.curLevelManager.moShi == "jvDianZhanLing2") {
                this.yindaoTanChuang(UIManager_1.default.gameUI.jvDianZhanLing2Yd);
            }
            if (GameManager_1.default.curLevelManager.moShi == "xiaoDaoZuiHou") {
                this.yindaoTanChuang(UIManager_1.default.gameUI.xiaoDaoZuiHouYd);
            }
            if (GameManager_1.default.curLevelManager.moShi == "zuoZhanXianFeng") {
                this.yindaoTanChuang(UIManager_1.default.gameUI.zuoZHanXianFengYd);
            }
            AD_1.default.showChaPing(3);
        });
        //增益区域点击时
        this.zengYiZsZu.on(Laya.Event.MOUSE_DOWN, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (this.zengYiGeShu > 6) {
                //恢复
                Laya.stage.renderingEnabled = true;
                Laya.timer.scale = 1;
            }
        });
        //增益区域展示抬起时
        this.zengYiZsZu.on(Laya.Event.MOUSE_UP, this, function (e) {
            GameManager_1.default.PlaySound("but");
            if (this.zengYiGeShu > 6) {
                //暂停
                Laya.stage.renderingEnabled = false;
                Laya.timer.scale = 0;
            }
        });
        //增益弹窗 增益点击事件
        for (var p = 0; p < this.zengYiZsZu.numChildren; p++) {
            this.zengYiZsZu.getChildAt(p).paiXu = p;
            this.zengYiZsZu.getChildAt(p).on(Laya.Event.CLICK, this, function (e) {
                //恢复暂停
                Laya.stage.renderingEnabled = true;
                Laya.timer.scale = 1;
                this.xiaoGuoMiaoShu.text = GameManager_1.default.curLevelManager.genJvNameFanHuiMiaoShu(e.target.getChildAt(0).text, e.target.suoYin, true);
                //边框处理
                for (var z = 0; z < this.zengYiZsZu.numChildren; z++) {
                    this.zengYiZsZu.getChildAt(z).getChildAt(1).visible = false;
                    if (this.zengYiZsZu.getChildAt(z) == e.target) {
                        this.zengYiZsZu.getChildAt(z).getChildAt(1).visible = true;
                    }
                }
                Laya.timer.frameOnce(3, this, function () {
                    //暂停
                    Laya.stage.renderingEnabled = false;
                    Laya.timer.scale = 0;
                });
            });
        }
        //增益展示按钮
        this.zengYiBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            this.zengYiTanChuangUI.visible = true;
            this.xiaoGuoMiaoShu.text = "";
            this.shuaXinZengYiXiaoGuoXianShi();
            Laya.timer.frameOnce(8, this, function () {
                //暂停
                Laya.stage.renderingEnabled = false;
                Laya.timer.scale = 0;
            });
        });
        ////增益UI 关闭按钮
        this.zengYiTanChuangGuanBut.on(Laya.Event.CLICK, this, function (e) {
            GameManager_1.default.PlaySound("but");
            this.zengYiTanChuangUI.visible = false;
            //恢复暂停
            Laya.stage.renderingEnabled = true;
            Laya.timer.scale = 1;
        });
        //升星动画禁止滑动
        if (GameManager_1.default.shengXinDongHua != null) {
            this.xuanGuanUI.mouseEnabled = false; //禁止滑动
            this.zhunBeiYeUI.visible = false;
            this.xuanGuanUI.visible = true;
            if (GameManager_1.default.shengXinDongHua == "haiDaoZhengBaDj") {
                this.shengXiangDongHuaChuLi(this.haiDaoZhengBaBut, "haiDaoZhengBaDj", "海岛争霸");
            }
            if (GameManager_1.default.shengXinDongHua == "guShouJvDianDj") {
                this.shengXiangDongHuaChuLi(this.jvDianZhanLingBut, "guShouJvDianDj", "固守据点");
            }
            if (GameManager_1.default.shengXinDongHua == "jvDianZhanLingDj") {
                this.shengXiangDongHuaChuLi(this.jvDianZhanYing2But, "jvDianZhanLingDj", "据点占领");
            }
            if (GameManager_1.default.shengXinDongHua == "xiaoDaoZuiHouDj") {
                this.shengXiangDongHuaChuLi(this.sheiNengXiaoDaoZhBut, "xiaoDaoZuiHouDj", "谁能笑到最后");
            }
            if (GameManager_1.default.shengXinDongHua == "zuoZhanXianFengDj") {
                this.shengXiangDongHuaChuLi(this.zuoZhanXianFengBut, "zuoZhanXianFengDj", "作战先锋");
            }
        }
        //引导过 就隐藏锁子
        if (PlayerData_1.default.GetUserData("xiangTongShiBingHeChengYd") == true) {
            this.haiDaoZhengBaBut.getChildByName("suoZi").visible = false;
            this.haiDaoZhengBaBut.getChildByName("giqnQiaYinDaoShou").visible = false;
            this.jvDianZhanLingBut.getChildByName("suoZi").visible = false;
            this.jvDianZhanYing2But.getChildByName("suoZi").visible = false;
            this.sheiNengXiaoDaoZhBut.getChildByName("suoZi").visible = false;
            this.zuoZhanXianFengBut.getChildByName("suoZi").visible = false;
        }
        this.shuaXinGuangGaoJiNengShou(); //刷新广告技能展示
        this.initAD();
    }
    initAD() {
        GxGame_1.default.showPrivacyBtnWithParent(this.yinsiBtn);
        GxGame_1.default.showGameAgeWithParent(this.shilingBtn);
        GxGame_1.default.showMoreGameBtnWithParent(this.gengDuoBtn);
        this.desktopBtn.visible = AD_1.default.haveDesktop();
        AD_1.default.checkDesktop(() => {
            this.desktopBtn.visible = false;
        });
        AD_1.default.showChaPing(0);
        AD_1.default.showBanner();
        AD_1.default.showVivoIcon();
        AD_1.default.showJiMu();
        this.desktopBtn.on(Laya.Event.CLICK, this, () => {
            GameManager_1.default.PlaySound("but");
            AD_1.default.addDesktop(() => {
                this.desktopBtn.visible = false;
            });
        });
    }
    //刷新增益效果显示
    shuaXinZengYiXiaoGuoXianShi() {
        for (var p = 0; p < this.zengYiZsZu.numChildren; p++) {
            this.zengYiZsZu.getChildAt(p).skin = "";
            this.zengYiZsZu.getChildAt(p).getChildAt(0).text = "";
            this.zengYiZsZu.getChildAt(p).getChildAt(1).visible = false;
        }
        this.zengYiGeShu = 0; //增益的总个数
        for (var i = 0; i < GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi.length; i++) {
            //是否有升级
            if (GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[i] > 0) {
                //确定位置
                for (var p = 0; p < this.zengYiZsZu.numChildren; p++) {
                    if (this.zengYiZsZu.getChildAt(p).skin == "") {
                        this.zengYiZsZu.getChildAt(p).skin = "UIRes/tanCHuang/zy" + (i + 1) + ".png";
                        this.zengYiZsZu.getChildAt(p).getChildAt(0).text = GameManager_1.default.curLevelManager.zzxfZyName[i];
                        this.zengYiZsZu.getChildAt(p).suoYin = i;
                        this.zengYiGeShu = this.zengYiGeShu + 1;
                        break;
                    }
                }
            }
        }
    }
    //刷新广告技能显示
    shuaXinGuangGaoJiNengShou() {
        if (PlayerData_1.default.GetUserData("huiFuAD") > 0) {
            this.huiFuJiNengBut.getChildAt(0).visible = false;
        }
        else {
            this.huiFuJiNengBut.getChildAt(0).visible = true;
        }
        if (PlayerData_1.default.GetUserData("gongJiLiAD") > 0) {
            this.tiShengGongJiLiJiNengBut.getChildAt(0).visible = false;
        }
        else {
            this.tiShengGongJiLiJiNengBut.getChildAt(0).visible = true;
        }
        if (PlayerData_1.default.GetUserData("shanDianAD") > 0) {
            this.guangGaoShanDian.getChildAt(0).visible = false;
        }
        else {
            this.guangGaoShanDian.getChildAt(0).visible = true;
        }
        if (PlayerData_1.default.GetUserData("bingFengAD") > 0) {
            this.guangGaoBingDongBut.getChildAt(0).visible = false;
        }
        else {
            this.guangGaoBingDongBut.getChildAt(0).visible = true;
        }
    }
    //进入到游戏模式
    jinRuDaoYouXiMoShi() {
        if (UIManager_1.default.gameUI.jiaoXueTiShi.visible == true) {
            return;
        }
        this.haiDaoZhengBaBut.visible = false; //隐藏按钮
        //加载动画
        this.jaiZaiUI.visible = true;
        this.xuanGuanFanHuiBut.visible = false; //隐藏选关返回按钮
        //加载游戏场景
        GameManager_1.default.loadScene(function () {
            UIManager_1.default.gameUI.jiNnegZuUIFa.visible = true; //显示底部技能
            UIManager_1.default.gameUI.beiJing.visible = false;
            UIManager_1.default.gameUI.xuanGuanUI.visible = false;
            UIManager_1.default.gameUI.yoUXiUI.visible = true;
            UIManager_1.default.gameUI.jinBiUI.visible = false;
            UIManager_1.default.gameUI.laBaBut.visible = false;
            GameManager_1.default.PlayMusic("bgm2");
            //获取模式
            GameManager_1.default.curLevelManager.moShi = "haiDaoZhengBa";
            GameManager_1.default.curLevelManager.nanDuDengJi = parseInt(PlayerData_1.default.GetUserData("haiDaoZhengBaDj")); //难度等级
            GameManager_1.default.curLevelManager.moShiChuLi();
            UIManager_1.default.gameUI.jaiZaiUI.visible = false; //隐藏加载页
        }, "Scene1");
        AD_1.default.GameStartCeLue(1);
    }
    //升星动画处理  1. 模式选择 按钮  2.星级 key 
    shengXiangDongHuaChuLi(anniu, xingJiKey, miaoShud) {
        this.quanJvZsAnNiu = anniu;
        //固守据点星级+1
        PlayerData_1.default.SetUserData(xingJiKey, PlayerData_1.default.GetUserData(xingJiKey) + 1);
        PlayerData_1.default.SaveData();
        var shiJieZuoBiao = this.xuanGuanUI.localToGlobal(new Laya.Point(this.quanJvZsAnNiu.x + PlayerData_1.default.GetUserData(xingJiKey) * 45, this.quanJvZsAnNiu.y + 30));
        Laya.Tween.to(this.feiXing, { "x": shiJieZuoBiao.x, "y": shiJieZuoBiao.y }, 1000, Laya.Ease.sineOut, Laya.Handler.create(this, function () {
            UIManager_1.default.gameUI.feiXing.x = -567;
            UIManager_1.default.gameUI.feiXing.y = -395;
            //根据难度数据 更新上面的星星
            var shu = parseInt(PlayerData_1.default.GetUserData(xingJiKey));
            //星星显示
            for (var i = 0; i < shu; i++) {
                UIManager_1.default.gameUI.quanJvZsAnNiu.getChildAt(1).getChildAt(i).skin = "UIRes/xuanGuan/xingxing.png";
            }
            //难度描述
            UIManager_1.default.gameUI.quanJvZsAnNiu.getChildAt(0).skin = "UIRes/xuanGuan/xiShu" + shu + ".png";
            GameManager_1.default.shengXinDongHua = null; //初始化升星动画
            this.xuanGuanUI.mouseEnabled = true; //取消禁止滑动
            GameManager_1.default.PlaySound("shengXing");
            UIManager_1.default.ShowGameTipUI(miaoShud + " 难度提升");
            //显示选关返回按钮
            this.xuanGuanFanHuiBut.visible = true;
        }));
    }
    //商城动态展示数据
    shangChengDongTaiZhanShiShuJv() {
        //升级属性数值展示
        for (var i = 0; i < this.shangChengUI.numChildren; i++) {
            this.shangChengUI.getChildAt(i).getChildAt(3).getChildAt(0).getChildAt(1).text = GameManager_1.default.jsonShuJv["shangDianShuJv"]["shengJiXueLiang"];
            this.shangChengUI.getChildAt(i).getChildAt(3).getChildAt(1).getChildAt(1).text = GameManager_1.default.jsonShuJv["shangDianShuJv"]["shengJiGongJiLi"];
            this.shangChengUI.getChildAt(i).getChildAt(3).getChildAt(2).getChildAt(1).text = GameManager_1.default.jsonShuJv["shangDianShuJv"]["shengJiDanJia"];
            this.shangChengUI.getChildAt(i).getChildAt(1).text = "等级" + PlayerData_1.default.GetUserData("shangDianDengJiZu")[i]; //等级展示
            //升级所需金币展示
            this.shangChengUI.getChildAt(i).getChildAt(2).getChildAt(0).text = PlayerData_1.default.GetUserData("shangDianDengJiZu")[i] * parseInt(GameManager_1.default.jsonShuJv["shangDianShuJv"]["shengJiZengJia"]);
        }
    }
    anNiuAnXia() {
        if (GameManager_1.default.curPlayerControl != null) {
            this.yaoGanFa.visible = true;
            this.yaoGanFa.x = Laya.stage.mouseX;
            this.yaoGanFa.y = Laya.stage.mouseY;
        }
    }
    anNiuYiDong() {
        var shiJieZuoBiao = this.yaoGanFa.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY));
        //获取摇杆向量
        var xiangL = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.subtract(new Laya.Vector3(shiJieZuoBiao.x, shiJieZuoBiao.y, 0), new Laya.Vector3(this.yaoGanYuanDian.x, this.yaoGanYuanDian.y, 0), xiangL);
        //获取标量
        var biaoLiang = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.normalize(xiangL, biaoLiang);
        //获取向量的长度
        var ChangDu = Laya.Vector3.scalarLength(xiangL);
        //摇杆处理
        if (ChangDu > 100) {
            var ronGQi = new Laya.Vector3();
            Laya.Vector3.add(new Laya.Vector3(this.yaoGanYuanDian.x, this.yaoGanYuanDian.y, 0), new Laya.Vector3(biaoLiang.x * 99, biaoLiang.y * 99, 0), ronGQi);
            this.yaoGan.x = ronGQi.x;
            this.yaoGan.y = ronGQi.y;
        }
        else {
            var ronGQi = new Laya.Vector3();
            Laya.Vector3.add(new Laya.Vector3(this.yaoGanYuanDian.x, this.yaoGanYuanDian.y, 0), new Laya.Vector3(xiangL.x, xiangL.y, 0), ronGQi);
            this.yaoGan.x = ronGQi.x;
            this.yaoGan.y = ronGQi.y;
        }
        if (GameManager_1.default.curPlayerControl != null) {
            GameManager_1.default.curPlayerControl.yiDongFun(biaoLiang);
        }
    }
    anNiuTaiQi() {
        this.yaoGan.x = 129;
        this.yaoGan.y = 129;
        this.yaoGanFa.visible = false;
        GameManager_1.default.curPlayerControl.daiJiFun();
    }
    onDisable() {
        Laya.stage.off("UpdateGold", this, this.UpdateGold);
        Laya.stage.off("anNiuYiDong", this, this.anNiuYiDong);
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.anNiuAnXia);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.anNiuYiDong);
    }
    //引导弹窗封装点击事件
    yindaoTanChuang(objUI) {
        UIManager_1.default.gameUI.yinDaoFa.visible = true; //进行弹窗
        for (var i = 0; i < UIManager_1.default.gameUI.yinDaoFa.numChildren; i++) {
            UIManager_1.default.gameUI.yinDaoFa.getChildAt(i).visible = false;
        }
        objUI.visible = true;
        UIManager_1.default.gameUI.jiXuYouXiBut.visible = true;
        UIManager_1.default.gameUI.wanFaJieShao.visible = true;
        Laya.timer.frameOnce(8, this, function () {
            //暂停
            Laya.stage.renderingEnabled = false;
            Laya.timer.scale = 0;
        });
    }
    Init() {
        GameManager_1.default.curSelectLevel = PlayerData_1.default.GetUserData("GuanQia");
        //GameManager.curSelectLevel = 6 ; //锁定关 卡
        this.yaoTuiSong = true;
        this.UpdateGold();
        //关卡号
        var znawei1 = GameManager_1.default.curSelectLevel;
    }
    //刷新行走进度
    shuaXinJinDu(shu) {
        this.jinDu.width = 150 * shu;
    }
    UpdateGold() {
        this.goldTex.text = PlayerData_1.default.GetUserData("Gold");
    }
}
exports.default = PanelGameRun;
