"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameManager_1 = __importDefault(require("./GameManager"));
const PlayerControl_1 = __importDefault(require("./PlayerControl"));
const PlayerData_1 = __importDefault(require("./PlayerData"));
const NpcControl_1 = __importDefault(require("./NpcControl"));
const jvDian_1 = __importDefault(require("./jvDian"));
const UIManager_1 = __importDefault(require("./UIManager"));
const youTong_1 = __importDefault(require("./youTong"));
class LevelManager extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {
        this.moShi = null;
        //难度等级
        this.nanDuDengJi = 0;
        this.cjg = false;
        //皮肤处理
        // this.qieHuanPlayer(PlayerData.GetUserData("EquipHat"));
        //作战先锋增益           
        //1 圣神祝福 恢复所有的浮板 10% 血量
        //2.治疗光塔 每5秒治疗一定血量 最多提升五次
        //3.攻速强化 提升一定百分比攻速 最多叠加五次
        //4.导弹轰炸 每45 秒对目标发射导弹 可升五级
        //5.旋涡 减少敌人2% 移动速度 最多五次
        //6.无敌金钟罩 冷却30s 升级减少2s 最多五次
        //7.时间风暴  敌人暂停5s 冷却40s 升级减少2s 最多五次
        //8.新兵入列  增加一名士兵
        //9.特殊加固  所有木板 增加5点血量
        //11.机枪炮台  玩家武器达到狙击枪才会出现
        //12.榴弹炮塔  玩家武器达到狙击枪才会出现
        //13.武器升级  升级玩家当前武器  冲锋枪、步枪、机枪、狙击枪、火焰枪、榴弹枪
        //组合数组
        // this.zzxfZuHeShuZu = [[13, 3, 5], [2, 6, 9], [4, 7, 1], [8, 3, 4], [1, 7, 8], [13, 5, 9], [13, 6, 2]];
        //this.zzxfZuHeShuZu = [[2, 6, 9],[4, 7, 1]];
        // this.zzxfZuHeShuZu = [[5, 7, 1], [2, 6, 9,], [4, 6, 13]];
        this.zzxfZuHeShuZu = [[5, 7, 12], [2, 6, 9], [4, 6, 13], [3, 5, 2], [4, 7, 6], [6, 1, 9], [13, 11, 1]];
        //this.zzxfZuHeShuZu = [[13, 11, 1]];
        //描述数组
        //   this.zzxfZyMiaoShu = ["", "提供一名医疗兵,每过一段时间治疗我方所有单位", "提供一名神经突击队员,提升我方全体攻速", "提供一名通讯兵,定时呼叫导弹支援", "在周围生成一个旋涡,区域内敌人减速", "提供一名保卫者,定时给全体生成护盾", "每过一段时间,产生暴风雪,禁锢敌人", " ", "提升全体单位的血量", "", "提供一座机枪炮台", "提供一座榴弹炮台", "队长武器升级,获得一把更好的枪"];
        //名字数组
        this.zzxfZyName = ["圣神祝福", "医疗兵", "神经突击队", "通讯兵", "旋涡", "保卫者", "时间风暴", " ", "特殊加固", "", "机枪炮台", "榴弹炮台", "武器升级"];
        this.zzxfDuiYingDeDengJi = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //武器名字
        this.wuQiMingZiShuZu = ["闪电冲锋枪", "火麒麟步枪", "追猎者狙击枪", "加特林机关枪", "火焰喷射器"];
        //油桶生成计时器
        this.youTongShengChengTime1 = 0;
        this.youTongShengChengTime2 = parseInt(GameManager_1.default.jsonShuJv["youTongShengChengShiJian"]) * 60;
        this.youTongJiHe = GameManager_1.default.curScene.getChildByName("youTongShengChengJiHe"); //油桶集合
        //大石头生成计时器
        this.daShiTouTime1 = 0;
        this.daShiTouTime2 = parseInt(GameManager_1.default.jsonShuJv["shiTiouShengChengShiJian"]) * 60;
        this.daShiTouJiHe = GameManager_1.default.curScene.getChildByName("shiZhuJiHe"); //大石头集合  
        //敌人集合
        this.diRenJiHe = GameManager_1.default.curScene.getChildByName("diRenJiHe");
    }
    onDisable() {
    }
    onUpdate() {
        if (this.moShi == "zuoZhanXianFeng") {
            //小岛移动处理
            // if (this.chuShiHuaShiJian < 10 && this.chuShiHuaShiJian > 0 && GameManager.curScene.getChildByName("xiaoDao").transform.position.z < -73) {
            //       GameManager.curScene.getChildByName("xiaoDao").transform.position = new Laya.Vector3(GameManager.curScene.getChildByName("xiaoDao").transform.position.x, GameManager.curScene.getChildByName("xiaoDao").transform.position.y, GameManager.curScene.getChildByName("xiaoDao").transform.position.z + 0.06)
            //   }
            this.zhenTimer1 = this.zhenTimer1 + 1;
            if (this.zhenTimer1 >= this.zhenTimer2) {
                this.zhenTimer1 = 0;
                if (this.chuShiHuaShiJian <= 0) {
                    return;
                }
                this.chuShiHuaShiJian = this.chuShiHuaShiJian - 1;
                UIManager_1.default.gameUI.shiJian.text = this.chuShiHuaShiJian;
                if (this.chuShiHuaShiJian == 13) {
                    GameManager_1.default.curPlayerControl.jiuYuanFun(); //飞机救援
                }
                if (this.chuShiHuaShiJian <= 0) {
                    GameManager_1.default.curPlayerControl.shengLiChuLiFun();
                }
            }
        }
        //作战先锋油桶生成判断
        if (this.moShi == "zuoZhanXianFeng") {
            this.youTongShengChengTime1 = this.youTongShengChengTime1 + 1;
            if (this.youTongShengChengTime1 >= this.youTongShengChengTime2) {
                this.youTongShengChengTime1 = 0;
                //生成油桶
                this.shengChengYouTong();
            }
            if (this.youTongJiHe != null) {
                if (this.youTongJiHe.numChildren > 0) {
                    for (var i = 0; i < this.youTongJiHe.numChildren; i++) {
                        if (this.youTongJiHe.getChildAt(i).transform.position.y < 0) {
                            this.youTongJiHe.getChildAt(i).transform.position = new Laya.Vector3(this.youTongJiHe.getChildAt(i).transform.position.x, this.youTongJiHe.getChildAt(i).transform.position.y + 0.1, this.youTongJiHe.getChildAt(i).transform.position.z);
                        }
                    }
                }
            }
            this.daShiTouTime1 = this.daShiTouTime1 + 1;
            if (this.daShiTouTime1 >= this.daShiTouTime2) {
                this.daShiTouTime1 = 0;
                //小岛移动的时候不生成大石头
                if (this.chuShiHuaShiJian > 10) {
                    //生成大石头
                    // this.shengChengDaShiTou();
                }
            }
            if (this.daShiTouJiHe != null) {
                if (this.daShiTouJiHe.numChildren > 0) {
                    for (var i = 0; i < this.daShiTouJiHe.numChildren; i++) {
                        //  if (this.daShiTouJiHe.getChildAt(i).transform.position.z < 0) {
                        this.daShiTouJiHe.getChildAt(i).transform.position = new Laya.Vector3(this.daShiTouJiHe.getChildAt(i).transform.position.x, this.daShiTouJiHe.getChildAt(i).transform.position.y, this.daShiTouJiHe.getChildAt(i).transform.position.z + 0.1);
                        //  console.log(this.daShiTouJiHe.getChildAt(i).transform.position.z)
                        if (this.daShiTouJiHe.getChildAt(i).transform.position.z > -50) {
                            this.daShiTouJiHe.getChildAt(i).destroy();
                        }
                        //  }
                    }
                }
            }
        }
        // 敌人生成处理
        if (this.moShi == "jvDianZhanLing" || this.moShi == "xiaoDaoZuiHou" || this.moShi == "zuoZhanXianFeng") {
            if (this.moShi == "zuoZhanXianFeng") {
                this.diRenChuShengDingShiQi1 = this.diRenChuShengDingShiQi1 + 1;
                if (this.diRenChuShengDingShiQi1 >= this.diRenChuShengDingShiQi2) {
                    this.diRenChuShengDingShiQi1 = 0;
                    //  if (GameManager.curLevelManager.jiBaiDeDiRenShuLiang % 30 == 0) {
                    //       this.shengChengGuaiWu(4);//生成怪物
                    //   }
                    //查看当前的怪物数量
                    if (this.diRenJiHe.numChildren >= parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["zuiDaDiRenShu"])) {
                    }
                    else {
                        //总敌人少的情况下 敌人生成速度提升
                        if (this.diRenJiHe.numChildren < parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["zuiDaDiRenShu"]) / 2) {
                            this.diRenChuShengDingShiQi2 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["diRenChuShengDingShiQi"]) / 2;
                        }
                        else {
                            this.diRenChuShengDingShiQi2 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["diRenChuShengDingShiQi"]);
                        }
                        var suiJi = GameManager_1.default.RandomInt(1, 2);
                        //随机生成一堆蝙蝠
                        if (suiJi == 1) {
                            var bianFuSuiJi = GameManager_1.default.RandomInt(3, 8);
                            for (var i = 0; i < bianFuSuiJi; i++) {
                                this.shengChengGuaiWu(2); //生成怪物
                            }
                        }
                        else {
                            var bianFuSuiJi = GameManager_1.default.RandomInt(2, 5);
                            for (var i = 0; i < bianFuSuiJi; i++) {
                                this.shengChengGuaiWu(1); //生成怪物
                            }
                        }
                        var suiJi = GameManager_1.default.RandomInt(1, 5);
                        //出生boss 
                        if (this.dangQianDengJi > 3 && suiJi == 3) {
                            this.shengChengGuaiWu(3); //生成怪物
                        }
                        var suiJi = GameManager_1.default.RandomInt(1, 5);
                        //出生boss 
                        if (this.dangQianDengJi > 3 && suiJi == 3) {
                            this.shengChengGuaiWu(4); //生成怪物
                        }
                    }
                }
            }
            else {
                this.diRenChuShengDingShiQi1 = this.diRenChuShengDingShiQi1 + 1;
                if (this.diRenChuShengDingShiQi1 >= this.diRenChuShengDingShiQi2) {
                    this.diRenChuShengDingShiQi1 = 0;
                    if (this.diRenShengChengJiLu == this.diRenZongShu) {
                    }
                    else {
                        this.shengChengShouJvDianDi(); //生成守护据点的敌人
                    }
                }
            }
        }
    }
    moShiChuLi() {
        //生成玩家
        this.CreatePlayer();
        //隐藏全屏特效
        this.baoXueTx = GameManager_1.default.curScene.getChildByName("Camera").getChildByName("Camera").getChildByName("FX").getChildByName("FX_jiansu_QuanPing");
        this.baoXueTx.active = false;
        this.shanDianTx = GameManager_1.default.curScene.getChildByName("Camera").getChildByName("Camera").getChildByName("FX").getChildByName("FX_shandian_QuanPing");
        this.shanDianTx.active = false;
        //隐藏 旋涡
        this.xuanWoFa = GameManager_1.default.curPlayerControl.owner.getChildByName("xuanWojiHe");
        for (var i = 0; i < this.xuanWoFa.numChildren; i++) {
            this.xuanWoFa.getChildAt(i).active = false;
        }
        //补给提升的攻击力
        this.buJiGongJiLi = 0;
        //海岛屿争霸模式
        if (this.moShi == "haiDaoZhengBa") {
            UIManager_1.default.gameUI.shiJiaoQieHuanBut.visible = true; //显示视角按钮
            //生成玩家
            //   this.CreatePlayer();
            //敌人板子数组
            this.banZiLeiXingArray = [[1, 2, 2], [1, 2, 1, 2, 2], [1, 1, 2, 3, 2, 1, 1]];
            //当前关卡  关卡越大 高级兵种就越多(2 3 级)
            this.dangQianGuanQia = 0;
            //-----------------------------------------------------
            //生成敌人
            this.shengChengDiRen();
        }
        else if (this.moShi == "jvDianZhanLing") {
            UIManager_1.default.gameUI.shiJiaoQieHuanBut.visible = true; //显示视角按钮
            //敌人板子数组
            this.banZiLeiXingArray = [2, 2, 1, 2, 2, 3, 3, 1, 3, 2, 3, 3, 2, 2, 1, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3];
            // this.banZiLeiXingArray = [1];
            this.diRenZongShu = this.banZiLeiXingArray.length; //敌人总数 用来处理停止敌人出生
            this.jiBaiDeDiRenShuLiang = 0; //击败的敌人数量 用来判断胜利
            this.diRenShengChengJiLu = 0; //当前升成了多少个士兵 其实是组
            this.direnTongPingZuiDaGeShu = 5; //敌人同屏最大个数
            //生成玩家
            //   this.CreatePlayer();
            //生成据点
            this.shengChengJvDian();
            //敌人游戏内最大人数
            this.diRenZuiDaRenShu = 6;
            //敌人出生定时器
            this.diRenChuShengDingShiQi1 = 0;
            this.diRenChuShengDingShiQi2 = 100;
            //初始敌人
            var bianFuSuiJi = GameManager_1.default.RandomInt(1, 1);
            var weiZhi = new Laya.Vector3(GameManager_1.default.curPlayerControl.owner.transform.position.x, GameManager_1.default.curPlayerControl.owner.transform.position.y, GameManager_1.default.curPlayerControl.owner.transform.position.z - 12);
            for (var i = 0; i < bianFuSuiJi; i++) {
                this.shengChengShouJvDianDi(weiZhi); //生成怪物
            }
        }
        else if (this.moShi == "jvDianZhanLing2") {
            var light = GameManager_1.default.curScene.getChildByName("Light").getChildByName("Liang_Light");
            light.shadowMode = Laya.ShadowMode.SoftHigh;
            light.shadowDistance = 60;
            light.shadowResolution = 1024;
            UIManager_1.default.gameUI.jvDianZhanLing2MiaoShu.visible = true; //显示该关卡任务
            UIManager_1.default.gameUI.shiJiaoQieHuanBut.visible = true; //显示视角按钮
            //岛屿集合
            this.daoYuJiHe = GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe");
            //生成玩家
            //  this.CreatePlayer();
            //岛屿上生成敌人
            this.daoYuShengChengDiRen();
            //生成门神
            this.shengChengMenShen();
        }
        else if (this.moShi == "xiaoDaoZuiHou") {
            UIManager_1.default.gameUI.shiJiaoQieHuanBut.visible = true; //显示视角按钮
            UIManager_1.default.gameUI.zzxfDengJiShow.visible = false; //隐藏等级展示
            //敌人板子数组
            this.banZiLeiXingArray = [1, 2, 2, 1, 2, 2, 3, 3, 1, 3, 2, 3, 3, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
            this.diRenZongShu = this.banZiLeiXingArray.length; //敌人总数 用来处理停止敌人出生
            this.jiBaiDeDiRenShuLiang = 0; //击败的敌人数量 用来判断胜利
            this.diRenShengChengJiLu = 0; //当前升成了多少个士兵 其实是组
            this.direnTongPingZuiDaGeShu = 5; //敌人同屏最大个数
            //生成玩家
            //   this.CreatePlayer();
            //生成据点
            // this.shengChengJvDian();
            //敌人游戏内最大人数
            this.diRenZuiDaRenShu = 6;
            //敌人出生定时器
            this.diRenChuShengDingShiQi1 = 0;
            this.diRenChuShengDingShiQi2 = 200;
            //显示升级进度UI
            UIManager_1.default.gameUI.shengJiJinDuUI.visible = true;
            //初始敌人
            var bianFuSuiJi = GameManager_1.default.RandomInt(2, 2);
            var weiZhi = new Laya.Vector3(GameManager_1.default.curPlayerControl.owner.transform.position.x, GameManager_1.default.curPlayerControl.owner.transform.position.y, GameManager_1.default.curPlayerControl.owner.transform.position.z - 12);
            for (var i = 0; i < bianFuSuiJi; i++) {
                this.shengChengShouJvDianDi(weiZhi); //生成怪物
            }
        }
        else if (this.moShi == "zuoZhanXianFeng") {
            //显示时间倒计时
            UIManager_1.default.gameUI.shiJian.visible = true;
            //初始化时间
            this.chuShiHuaShiJian = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengJianDanJianShouShiJian"]) + parseInt(PlayerData_1.default.GetUserData("zuoZhanXianFengDj") * GameManager_1.default.jsonShuJv["meiJiZengJiaJianShouShiJian"]);
            //时间缩减计时器
            this.zhenTimer1 = 0;
            this.zhenTimer2 = 60;
            UIManager_1.default.gameUI.shiJiaoQieHuanBut.visible = true; //显示视角按钮
            UIManager_1.default.gameUI.zengYiBut.visible = true; //显示增益查看按钮
            //当前阶段
            this.dangQianJieDuan = 0;
            //当前等级
            this.dangQianDengJi = 1;
            this.jiBaiDeDiRenShuLiang = 0; //击败的敌人数量 用来判断胜利
            //  jvDianZhanLing
            this.direnTongPingZuiDaGeShu = 5; //敌人同屏最大个数
            //生成玩家
            //    this.CreatePlayer();
            this.diRenChuShengDingShiQi1 = 0;
            this.diRenChuShengDingShiQi2 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["diRenChuShengDingShiQi"]);
            //显示升级进度UI
            UIManager_1.default.gameUI.shengJiJinDuUI.visible = true;
            UIManager_1.default.gameUI.buXiShoubanZi.visible = false; //隐藏不吸收板子
            //补给提升的攻击力
            //  this.buJiGongJiLi = 0;
            //开始五个蝙蝠
            var bianFuSuiJi = GameManager_1.default.RandomInt(9, 9);
            var weiZh = new Laya.Vector3(GameManager_1.default.curPlayerControl.owner.transform.position.x, GameManager_1.default.curPlayerControl.owner.transform.position.y, GameManager_1.default.curPlayerControl.owner.transform.position.z + 15);
            for (var i = 0; i < bianFuSuiJi; i++) {
                this.shengChengGuaiWu(2, weiZh); //生成怪物
            }
        }
    }
    CreatePlayer() {
        //  Laya.Sprite3D.instantiate(GameManager.models.getChildByName("canZhaoDian"), GameManager.curScene);
        var pathTrans = GameManager_1.default.curScene.getChildByName("chuShengDian").transform;
        //var Player = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("player" + PlayerData.GetUserData("EquipHat")), GameManager.curScene);
        var Player = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("player"), GameManager_1.default.curScene);
        Player.transform.position = pathTrans.position.clone();
        Player.transform.rotationEuler = pathTrans.rotationEuler.clone();
        Player.addComponent(PlayerControl_1.default);
        GameManager_1.default.curPlayerControl = Player.getComponent(PlayerControl_1.default);
        // GameManager.curPlayerControl.addbanZiFun(1);
    }
    shengChengJvDian() {
        var jvDianObj = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("jvDian"), GameManager_1.default.curScene);
        jvDianObj.transform.position = new Laya.Vector3(0, 0, 0);
        //设置空气摩擦力
        jvDianObj.getComponent(Laya.Rigidbody3D).linearDamping = 1;
        jvDianObj.getComponent(Laya.Rigidbody3D).angularDamping = 0.1;
        jvDianObj.getComponent(Laya.Rigidbody3D).mass = 10;
        for (var i = 0; i < jvDianObj.getChildByName("banZiJiHe").numChildren; i++) {
            jvDianObj.getChildByName("banZiJiHe").getChildAt(i).getChildByName("xueTiaoFa").active = false;
            jvDianObj.getChildByName("banZiJiHe").getChildAt(i).getChildByName("xueTiao").active = false;
        }
        //随机生成炮台
        var paoTai = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("jiQiang_paoTai"), jvDianObj.getChildByName("banZiJiHe").getChildAt(0).getChildByName("wuTi"));
        paoTai.transform.localPosition = new Laya.Vector3(0, 0, 0);
        paoTai.parent.parent.addComponent(jvDian_1.default);
        jvDianObj.getChildByName("banZiJiHe").getChildAt(0).getChildByName("xueTiaoFa").active = true;
        jvDianObj.getChildByName("banZiJiHe").getChildAt(0).getChildByName("xueTiao").active = true;
    }
    //生成怪物
    shengChengGuaiWu(index, weiZhi) {
        // console.log(weiZhi);
        var suiJiWeiZhi = GameManager_1.default.RandomInt(0, GameManager_1.default.curScene.getChildByName("diRenJiChuShengDian").numChildren - 1);
        var canZhaoWeiZhi = GameManager_1.default.curScene.getChildByName("diRenJiChuShengDian").getChildAt(suiJiWeiZhi).transform.position;
        if (weiZhi != null) {
            canZhaoWeiZhi = weiZhi;
        }
        var jvLi = Laya.Vector3.distance(canZhaoWeiZhi, GameManager_1.default.curPlayerControl.owner.transform.position);
        if (jvLi > 50) {
            return;
        }
        var dr = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("diRen1Xiao"), GameManager_1.default.curScene.getChildByName("diRenJiHe"));
        dr.transform.position = new Laya.Vector3(canZhaoWeiZhi.x, canZhaoWeiZhi.y - 0.8, canZhaoWeiZhi.z);
        var shengCHengName = "";
        if (index == 1) {
            shengCHengName = "jiangshi01";
        }
        else if (index == 2) {
            shengCHengName = "bianFu1";
        }
        else if (index == 3) {
            shengCHengName = "shiTouRen";
        }
        else if (index == 4) {
            shengCHengName = "bianFuBoss";
        }
        var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName(shengCHengName), dr.getChildAt(0).getChildByName("wuTi"));
        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
        dr.addComponent(NpcControl_1.default);
        dr.getComponent(NpcControl_1.default).jinGongWanJiaFun(); //敌人绑定代码
    }
    //生成据点守护敌人
    shengChengShouJvDianDi(weiZhi) {
        if (GameManager_1.default.curScene.getChildByName("diRenJiHe").numChildren > this.direnTongPingZuiDaGeShu) {
            return;
        }
        //敌人总数(单位总数)
        //根据敌人类型生成敌人
        var wtName = "diRen" + this.banZiLeiXingArray[this.diRenShengChengJiLu]; //物体name
        var dr = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName(wtName), GameManager_1.default.curScene.getChildByName("diRenJiHe"));
        var suiJiWeiZhi = GameManager_1.default.RandomInt(0, 7);
        dr.transform.position = GameManager_1.default.curScene.getChildByName("jvDian").getChildByName("diChuShengJiHe").getChildAt(suiJiWeiZhi).transform.position;
        if (weiZhi != null) {
            dr.transform.position = weiZhi;
        }
        //生成上面的物体
        var dangQianShengChengLeDsG = 0; //当前升成了多少个士兵  (算上随机空的)
        var dangQianShengChengLeDsGBs = 0; //当前升成了多少个士兵  (不算上随机空的)
        for (var p = 0; p < dr.numChildren; p++) {
            //一个板子的为炮台
            if (dr.numChildren == 1) {
                if (this.moShi == "jvDianZhanLing") {
                    var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("jiQiang_paoTai"), dr.getChildAt(p).getChildByName("wuTi"));
                    wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    dangQianShengChengLeDsGBs = dangQianShengChengLeDsGBs + 1;
                }
                else {
                    var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("chongFeng_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                    wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    dangQianShengChengLeDsGBs = dangQianShengChengLeDsGBs + 1;
                }
            }
            else {
                //小概率为空板子  只有一个板子不考虑(一开始就是空的怎么打)
                var kongBanGaiLv = GameManager_1.default.RandomInt(0, 4);
                if (kongBanGaiLv == 4 && dr.numChildren > 1) {
                    //最后一个为空板子,并且别的也是空的(概率根低)  就强行加个手枪兵凑数
                    if (p == dr.numChildren - 1 && dangQianShengChengLeDsGBs == 0) {
                        //默认手枪兵
                        var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("shouQiang_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                        dangQianShengChengLeDsGBs = dangQianShengChengLeDsGBs + 1;
                    }
                    else {
                        //空板子
                    }
                }
                else {
                    //冲锋兵 或者 步枪兵
                    if (this.diRenShengChengJiLu % 3 == 0 && this.diRenShengChengJiLu != 0) {
                        //第一个为高级兵
                        if (p == 0) {
                            var suiJi = GameManager_1.default.RandomInt(1, 2);
                            if (suiJi == 1) {
                                var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("chongFeng_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                                wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                            }
                            else if (suiJi == 2) {
                                var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("buQiang_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                                wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                            }
                        }
                        else {
                            //默认手枪兵
                            var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("shouQiang_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                            wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                        }
                    }
                    else {
                        //默认手枪兵
                        var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("shouQiang_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    }
                    //
                    dangQianShengChengLeDsGBs = dangQianShengChengLeDsGBs + 1;
                }
            }
            dangQianShengChengLeDsG = dangQianShengChengLeDsG + 1;
        }
        dr.addComponent(NpcControl_1.default); //敌人绑定代码
        if (this.moShi == "jvDianZhanLing") {
            dr.getComponent(NpcControl_1.default).jinGongJvDianFun();
        }
        else if (this.moShi == "xiaoDaoZuiHou") {
            dr.getComponent(NpcControl_1.default).jinGongWanJiaFun();
        }
        this.diRenShengChengJiLu = this.diRenShengChengJiLu + 1;
    }
    //海岛争霸生成敌人
    shengChengDiRen() {
        //敌人总数(单位总数)
        this.diRenZongShu = 0;
        for (var m = 0; m < this.banZiLeiXingArray[this.dangQianGuanQia].length; m++) {
            this.diRenZongShu = this.diRenZongShu + this.banZiLeiXingArray[this.dangQianGuanQia][m];
        }
        //敌人地块儿总数
        this.dikuaiErZongShu = this.banZiLeiXingArray[this.dangQianGuanQia].length;
        var dangQianShengChengLeDsG = 0; //当前升成了多少个士兵  (算上随机空的)
        var dangQianShengChengLeDsGBs = 0; //当前升成了多少个士兵  (不算上随机空的)
        for (var i = 0; i < this.banZiLeiXingArray[this.dangQianGuanQia].length; i++) {
            var wtName = "diRen" + this.banZiLeiXingArray[this.dangQianGuanQia][i]; //物体name
            //根据敌人类型生成敌人
            var dr = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName(wtName), GameManager_1.default.curScene.getChildByName("diRenJiHe"));
            dr.transform.position = GameManager_1.default.curScene.getChildByName("diRenJiChuShengDian").getChildAt(this.dangQianGuanQia).getChildAt(i).transform.position;
            //生成上面的物体
            for (var p = 0; p < dr.numChildren; p++) {
                /*
                //小概率为空板子  只有一个板子不考虑(没法合并)
                var kongBanGaiLv = GameManager.RandomInt(0, 4);
                if (kongBanGaiLv == 4 && dr.numChildren > 1) {

                    //最后一个为空板子,并且别的也是空的(概率根低)  就强行加个手枪兵凑数
                    if (p == dr.numChildren - 1 && dangQianShengChengLeDsGBs == 0) {
                        //默认手枪兵
                        var wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("shouQiang_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    }

                } else {
*/
                //冲锋兵 或者 步枪兵
                if (dangQianShengChengLeDsG % 5 == 0 && dangQianShengChengLeDsG != 0) {
                    var suiJi = GameManager_1.default.RandomInt(1, 2);
                    if (suiJi == 1) {
                        var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("chongFeng_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    }
                    else if (suiJi == 2) {
                        var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("buQiang_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    }
                }
                else {
                    //默认手枪兵
                    var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("shouQiang_Bing"), dr.getChildAt(p).getChildByName("wuTi"));
                    wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                }
                dangQianShengChengLeDsGBs = dangQianShengChengLeDsGBs + 1;
                //   }
                dangQianShengChengLeDsG = dangQianShengChengLeDsG + 1;
            }
            dr.addComponent(NpcControl_1.default); //敌人绑定代码
            if (i == 0) {
                //触发引导 第一个敌人进攻玩家
                if (PlayerData_1.default.GetUserData("fuBanHeShouQiangBingYd") == false) {
                    dr.getComponent(NpcControl_1.default).jinGongWanJiaFun();
                }
            }
        }
    }
    shengChengMenShen() {
        //根据敌人类型生成敌人
        var dr = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("diRen4"), GameManager_1.default.curScene.getChildByName("diRenJiHe"));
        dr.transform.position = GameManager_1.default.curScene.getChildByName("menShenWeiZhi").transform.position;
        //生成上面的高阶士兵
        for (var i = 0; i < dr.numChildren; i++) {
            var suiJi = GameManager_1.default.RandomInt(1, 2);
            if (suiJi == 1) {
                //默认手枪兵
                var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("chongFeng_Bing"), dr.getChildAt(i).getChildByName("wuTi"));
                wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
            }
            else {
                var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("buQiang_Bing"), dr.getChildAt(i).getChildByName("wuTi"));
                wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
            }
        }
        dr.suoShuDaoYu = 100; //敌人绑定代码
        dr.addComponent(NpcControl_1.default).suoShuDaoYu = 100; //敌人绑定代码
        dr.getComponent(NpcControl_1.default).daiJiFun();
    }
    //岛屿上生成敌人
    daoYuShengChengDiRen() {
        var dangQianShengChenggeShu = 0;
        for (var i = 0; i < this.daoYuJiHe.numChildren; i++) {
            //俘虏待机动画
            for (var m = 0; m < this.daoYuJiHe.getChildAt(i).getChildByName("fuLuJiHe").numChildren; m++) {
                this.daoYuJiHe.getChildAt(i).getChildByName("fuLuJiHe").getChildAt(m).getComponent(Laya.Animator).play("juese_Skin_furu", 0, 0);
            }
            for (var p = 0; p < this.daoYuJiHe.getChildAt(i).getChildByName("diRenChuShengDian").numChildren; p++) {
                dangQianShengChenggeShu = dangQianShengChenggeShu + 1;
                var shengChengDian = this.daoYuJiHe.getChildAt(i).getChildByName("diRenChuShengDian").getChildAt(p);
                //根据敌人类型生成敌人
                var dr = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("diRen1Xiao"), GameManager_1.default.curScene.getChildByName("diRenJiHe"));
                dr.transform.position = shengChengDian.transform.position;
                dr.suoShuDaoYu = i;
                if (dangQianShengChenggeShu % 3 == 0) {
                    if (GameManager_1.default.RandomInt(1, 2) == 1) {
                        var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("buQiang_Bing"), dr.getChildAt(0).getChildByName("wuTi"));
                        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    }
                    else {
                        var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("chongFeng_Bing"), dr.getChildAt(0).getChildByName("wuTi"));
                        wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    }
                }
                else {
                    //默认手枪兵
                    var wt = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("shouQiang_Bing"), dr.getChildAt(0).getChildByName("wuTi"));
                    wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
                }
                dr.suoShuDaoYu = i; //敌人所属
                dr.addComponent(NpcControl_1.default); //敌人绑定代码
                dr.getComponent(NpcControl_1.default).suoShuDaoYu = i; //敌人所属
                //敌人巡逻模式
                dr.getComponent(NpcControl_1.default).xunLuoFun(shengChengDian, shengChengDian.getChildAt(0));
            }
        }
        // this.daoYuJiHe
    }
    diRenBangJiaoBen() {
        for (var i = 0; i < GameManager_1.default.curScene.getChildByName("diRenJiHe").numChildren; i++) {
            GameManager_1.default.curScene.getChildByName("diRenJiHe").getChildAt(i).addComponent(NpcControl_1.default);
        }
    }
    //加载下一关
    xiaYiGuanJiaZai() {
        //当前关卡  关卡越大 高级兵种就越多(2 3 级)
        this.dangQianGuanQia = this.dangQianGuanQia + 1;
        //-----------------------------------------------------
        //生成敌人
        this.shengChengDiRen();
    }
    //生成油桶
    shengChengYouTong() {
        var youTongObj = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("barrel01_A"), GameManager_1.default.curScene.getChildByName("youTongShengChengJiHe"));
        var suiJiWeiZhi = GameManager_1.default.RandomInt(0, GameManager_1.default.curScene.getChildByName("youTongShengChengDian").numChildren - 1);
        youTongObj.transform.position = GameManager_1.default.curScene.getChildByName("youTongShengChengDian").getChildAt(suiJiWeiZhi).transform.position;
        youTongObj.addComponent(youTong_1.default);
    }
    //生成大石头
    shengChengDaShiTou() {
        var youTongObj = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("ShiZhu"), GameManager_1.default.curScene.getChildByName("shiZhuJiHe"));
        var suiJiWeiZhi = GameManager_1.default.RandomInt(0, GameManager_1.default.curScene.getChildByName("shiZhuShengChengDianJiHe").numChildren - 1);
        youTongObj.transform.position = GameManager_1.default.curScene.getChildByName("shiZhuShengChengDianJiHe").getChildAt(suiJiWeiZhi).transform.position;
    }
    //增加经验
    addJingYan() {
        if (this.moShi == "zuoZhanXianFeng") {
            //根据等级和阶段 计算出每击杀一个怪物增加的多少
            var xuYaoShengJigeShu = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jiShangZengJiaGuDingJingYan"]) + this.dangQianDengJi * parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jiShangJingYanDengJiJiaCheng"]) + this.dangQianJieDuan * parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jiShangJingYanJieDuanJiaCheng"]);
            var zengJiaDuoShao = 443 / xuYaoShengJigeShu;
            UIManager_1.default.gameUI.dangQianShengJiJinDu.width = UIManager_1.default.gameUI.dangQianShengJiJinDu.width + zengJiaDuoShao;
            //救援或者胜利时候 就不弹窗
            if (UIManager_1.default.gameUI.yoUXiUI.visible == false) {
                UIManager_1.default.gameUI.dangQianShengJiJinDu.width = 0;
            }
        }
        else {
            UIManager_1.default.gameUI.dangQianShengJiJinDu.width = UIManager_1.default.gameUI.dangQianShengJiJinDu.width + 50;
        }
        if (UIManager_1.default.gameUI.dangQianShengJiJinDu.width >= 443) {
            UIManager_1.default.gameUI.dangQianShengJiJinDu.width = 0;
            //作战先锋 增益弹窗
            if (this.moShi == "zuoZhanXianFeng") {
                UIManager_1.default.gameUI.buJiUITwo.visible = true; //显示补给UI
                UIManager_1.default.gameUI.jiNnegZuUIFa.visible = false; //隐藏广告技能UI
                UIManager_1.default.gameUI.ani8.play(1, false); //播放一次
                //播放动画
                UIManager_1.default.gameUI.ani7.play(1, false); //播放一次
                UIManager_1.default.gameUI.ani7_0.play(1, false); //播放一次
                UIManager_1.default.gameUI.ani7_0_0.play(1, false); //播放一次
                var suiJi = GameManager_1.default.RandomInt(0, this.zzxfZuHeShuZu.length - 1);
                var jiNengShuZu = this.zzxfZuHeShuZu[suiJi];
                for (var i = 0; i < UIManager_1.default.gameUI.zengYiFuJi.numChildren; i++) {
                    if (jiNengShuZu[i] == 13) {
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(0).skin = "UIRes/tanCHuang/wq" + parseInt(this.zzxfDuiYingDeDengJi[12] + 1) + ".png";
                        // console.log("UIRes/tanCHuang/wq" + this.zzxfDuiYingDeDengJi[12] + ".png")
                    }
                    else {
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(0).skin = "UIRes/tanCHuang/zy" + jiNengShuZu[i] + ".png";
                    }
                    //名字展示
                    var zhanShiDeMingZi = this.zzxfZyName[jiNengShuZu[i] - 1];
                    if (jiNengShuZu[i] == 13) {
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(2).text = "武器-" + this.wuQiMingZiShuZu[this.zzxfDuiYingDeDengJi[12]]; //展示名字
                    }
                    else {
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(2).text = zhanShiDeMingZi; //展示名字
                    }
                    //根据名字返回描述
                    var miaoShu = this.genJvNameFanHuiMiaoShu(UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(2).text, jiNengShuZu[i] - 1);
                    UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(3).text = miaoShu; //展示描述
                    var dangQianDengJi = this.zzxfDuiYingDeDengJi[jiNengShuZu[i] - 1];
                    UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).disabled = false; //默认都可以点击
                    //科技强化 类型 等级如果等于8 就灰色
                    if (zhanShiDeMingZi == "旋涡") {
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(4).text = dangQianDengJi; //展示当前等级
                        if (dangQianDengJi >= 8) {
                            UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).disabled = true;
                        }
                    }
                    else if (zhanShiDeMingZi.indexOf("武器") != -1) {
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(4).text = dangQianDengJi; //展示当前等级
                        if (dangQianDengJi >= 5) {
                            UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).disabled = true;
                            UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(2).text = "武器已满级";
                        }
                        //队长被击败无法升级
                        if (GameManager_1.default.curPlayerControl.duiZhangObj == null) {
                            UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).disabled = true;
                            UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(2).text = "队长已跑路";
                        }
                    }
                    else {
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).getChildAt(4).text = ""; //不显示等级
                        UIManager_1.default.gameUI.zengYiFuJi.getChildAt(i).skin = "UIRes/tanCHuang/kuang_2.png"; //超强技能背景
                    }
                }
                this.dangQianDengJi = this.dangQianDengJi + 1;
                if (this.dangQianDengJi % 5 == 1) {
                    this.dangQianJieDuan = this.dangQianJieDuan + 1;
                }
                UIManager_1.default.gameUI.zzxfDengJiShow.text = "等级" + this.dangQianDengJi;
                //暂停
                Laya.timer.frameOnce(60, this, function () {
                    //存在才
                    if (UIManager_1.default.gameUI.buJiUITwo.visible == true) {
                        Laya.stage.renderingEnabled = false;
                        Laya.timer.scale = 0;
                    }
                });
            }
            else {
                UIManager_1.default.gameUI.buJiUI.visible = true; //显示补给UI
                UIManager_1.default.gameUI.jiNnegZuUIFa.visible = false; //隐藏广告技能UI
                Laya.timer.frameOnce(6, this, function () {
                    Laya.stage.renderingEnabled = false;
                    Laya.timer.scale = 0;
                });
            }
            GameManager_1.default.PlaySound("zhengQue");
        }
    }
    qieHuanPlayer(pifuSuoYin) {
        GameManager_1.default.curPlayerControl.piFuSuoYin = pifuSuoYin;
        for (var i = 0; i < GameManager_1.default.curPlayerControl.owner.numChildren; i++) {
            GameManager_1.default.curPlayerControl.owner.getChildAt(i).active = false;
            if (i == pifuSuoYin - 1) {
                GameManager_1.default.curPlayerControl.owner.getChildAt(i).active = true;
            }
        }
    }
    genJvNameFanHuiMiaoShu(nameStr, dengJiSuoYin, dangQIan) {
        // console.log(nameStr);
        //console.log(dengJiSuoYin);
        var fuJia = 0;
        //展示不+1 升级+1
        if (dangQIan == true) {
            fuJia = 0;
        }
        else {
            fuJia = 1;
        }
        if (nameStr == "医疗兵") {
            var miaoShuZiFu = "医疗兵加入队伍,每过" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["zhiLiaoGuangTaLengQue"] + "秒,治疗我方全部单位" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["zhiLiaoGuangTaZhiLiaoXueLiang"] * (this.zzxfDuiYingDeDengJi[dengJiSuoYin] + fuJia) + " 点生命值";
            return miaoShuZiFu;
        }
        else if (nameStr == "保卫者") {
            var miaoShuZiFu = "保卫者 加入队伍, 每过" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["wuDiJinZhongZhaoLengQue"] + "秒,为我方全体单位生成" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["wuDiJinZhongZhaoWuDiShiJian"] + " 秒的力场护盾";
            return miaoShuZiFu;
        }
        else if (nameStr == "特殊加固") {
            var miaoShuZiFu = "我方全体血量提升" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["teShuJiaGuMeiCiTiShengXueLiang"] * (this.zzxfDuiYingDeDengJi[dengJiSuoYin] + fuJia) + " 最大血量";
            return miaoShuZiFu;
        }
        else if (nameStr == "通讯兵") {
            var miaoShuZiFu = "通讯兵加入队伍, 每过一段时间 呼叫 " + (parseInt(this.zzxfDuiYingDeDengJi[dengJiSuoYin]) + fuJia) + "枚 导弹 轰炸目标";
            return miaoShuZiFu;
        }
        else if (nameStr == "时间风暴") {
            var jiSuan = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shiJianFengBaoLengQue"]) - parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shiJianFengBaoLengQueSuoJian"]) * (this.zzxfDuiYingDeDengJi[dengJiSuoYin] + fuJia);
            var miaoShuZiFu = "每过" + jiSuan + "秒 对敌人禁锢" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shiJianFengBaoZanTingShiJian"] + "秒";
            return miaoShuZiFu;
        }
        else if (nameStr == "圣神祝福") {
            var miaoShuZiFu = "全体恢复" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shengShenZhuFuZengJiaXueLiang"] * 100 + "%的血量";
            return miaoShuZiFu;
        }
        else if (nameStr.indexOf("武器") != -1) {
            var miaoShuZiFu = "队长更换一把更强的武器";
            return miaoShuZiFu;
        }
        else if (nameStr == "旋涡") {
            var miaoShuZiFu = "场景中生成" + (this.zzxfDuiYingDeDengJi[dengJiSuoYin] + fuJia) + "个旋涡,漩涡中敌人减速" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["xuanWOJianSuBaiFenBi"] + "%";
            return miaoShuZiFu;
        }
        else if (nameStr == "神经突击队") {
            var miaoShuZiFu = "神经突击队员加入队伍,使全员兴奋,增加全员" + GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shenJingTuJiDuiGongSuZeng"] + "%攻速";
            return miaoShuZiFu;
        }
        else if (nameStr == "机枪炮台") {
            var miaoShuZiFu = "获得一座火力凶猛的机枪炮台";
            return miaoShuZiFu;
        }
        else if (nameStr == "榴弹炮台") {
            var miaoShuZiFu = "获得一座榴弹炮台,难得的AOE伤害";
            return miaoShuZiFu;
        }
        else {
            return "";
        }
    }
}
exports.default = LevelManager;
