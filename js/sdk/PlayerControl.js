"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameManager_1 = __importDefault(require("./GameManager"));
const PlayerData_1 = __importDefault(require("./PlayerData"));
const UIManager_1 = __importDefault(require("./UIManager"));
const jiao_1 = __importDefault(require("./jiao"));
const CwControl_1 = __importDefault(require("./CwControl"));
const youTong_1 = __importDefault(require("./youTong"));
class PlayerControl extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {
    }
    onStart() {
        //取消重力
        this.owner.getComponent(Laya.Rigidbody3D).gravity = new Laya.Vector3(0, 0, 0);
        //设置空气摩擦力
        this.owner.getComponent(Laya.Rigidbody3D).linearDamping = 0.1;
        this.owner.getComponent(Laya.Rigidbody3D).angularDamping = 0.1;
        this.owner.getComponent(Laya.Rigidbody3D).mass = 20;
        //默认状态为待机
        this.state = "wait";
        //手指点击屏幕
        UIManager_1.default.gameUI.bj.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        //手指抬起屏幕
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        //手指移出
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseUp);
        this.xiangJiFa = GameManager_1.default.curScene.getChildByName("Camera");
        this.banZiJiHe = this.owner.getChildByName("banZiJiHe"); //板子集合
        //每一个板子都绑定代码
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            this.banZiJiHe.getChildAt(i).addComponent(CwControl_1.default);
        }
        //刚体的碰撞体集合
        this.pengZhuangJihe = new Laya.CompoundColliderShape();
        //定位状态开关
        this.dingWeiZhuangTai = false;
        if (GameManager_1.default.curLevelManager.moShi == "haiDaoZhengBa") {
            GameManager_1.default.curPlayerControl.addbanZiFun(1); //激活一个初始板子
            GameManager_1.default.curPlayerControl.addbanZiFun(0); //激活一个初始板子
            GameManager_1.default.curPlayerControl.addbanZiFun(0); //激活一个初始板子
            GameManager_1.default.curPlayerControl.addbanZiFun(0); //激活一个初始板子
        }
        else if (GameManager_1.default.curLevelManager.moShi == "jvDianZhanLing") {
            GameManager_1.default.curPlayerControl.addbanZiFun(1); //激活一个初始板子
        }
        else if (GameManager_1.default.curLevelManager.moShi == "jvDianZhanLing2") {
            GameManager_1.default.curPlayerControl.addbanZiFun(1); //激活一个初始板子
        }
        else if (GameManager_1.default.curLevelManager.moShi == "xiaoDaoZuiHou") {
            GameManager_1.default.curPlayerControl.addbanZiFun(1); //激活一个初始板子
            GameManager_1.default.curPlayerControl.addbanZiFun(2); //激活一个初始板子
            GameManager_1.default.curPlayerControl.addbanZiFun(3); //激活一个初始板子
        }
        else if (GameManager_1.default.curLevelManager.moShi == "zuoZhanXianFeng") {
            GameManager_1.default.curPlayerControl.addbanZiFun(1); //激活一个初始板子
            /*
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[4] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[4] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[12] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[12] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[6] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[6] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[3] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[3] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[8] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[8] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[11] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[11] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[10] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[10] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[2] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[2] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[5] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[5] + 1;
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[1] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[1] + 1;
            */
        }
        //作战先锋增益激活状态
        //治疗光塔
        //治疗光塔计时器
        this.zhiLiaoGuangTaTime1 = 0;
        this.zhiLiaoGuangTaTime2 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["zhiLiaoGuangTaLengQue"]) * 60;
        //无敌金钟罩计时器
        this.wuDiJinZhongZhaoTime1 = 0;
        this.wuDiJinZhongZhaoTime2 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["wuDiJinZhongZhaoLengQue"]) * 60;
        //金钟罩移除计时器
        this.wuDiJinZhongZhaoTime3 = 0;
        this.wuDiJinZhongZhaoTime4 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["wuDiJinZhongZhaoWuDiShiJian"]) * 60;
        //金钟罩是否开启
        this.wuDiJinZhongZhaokaiGuan = false;
        //导弹轰炸计时器
        this.daoDanHongZhaTime1 = 0;
        this.daoDanHongZhaTime2 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["daoDanHongZhaLengQue"]) * 60;
        this.daoDanJihe = GameManager_1.default.curScene.getChildByName("daoDanJiHe"); //导弹集合
        //敌人集合
        this.diRenJiHe = GameManager_1.default.curScene.getChildByName("diRenJiHe");
        //时间风暴计时器
        this.shiJianFengBaoTime1 = 0;
        this.shiJianFengBaoTime2 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shiJianFengBaoLengQue"]) * 60;
        this.shiJianFengBaoTime3 = 0;
        this.shiJianFengBaoTime4 = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shiJianFengBaoZanTingShiJian"]) * 60;
        this.shiJianFengBaoKaiGuan = false;
        //临时增加经验
        //for (var i = 0; i < 8; i++) {
        //     GameManager.curLevelManager.addJingYan();
        // }
        //闪电持续定时器
        this.shanDianTime1 = 0;
        this.shanDianTime2 = 200;
        this.shanDianKaiGuan = false;
        //冰封持续定时器
        this.bingFengTime1 = 0;
        this.bingFengTime2 = parseInt(GameManager_1.default.jsonShuJv["guangGaoBingDongShiJian"]) * 60;
        this.bingFengKaiGuan = false;
        //玩家移速
        this.wanJiayiSu = parseInt(GameManager_1.default.jsonShuJv["wanJiaYiSu"]);
    }
    onDisable() {
        //关闭手势
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.mouseUp);
    }
    StartGame() {
        if (this.state != "wait") {
            return;
        }
        //隐藏进度条
        //UIManager.gameUI.jinDu.visible = true;
        //移除指引提示
        UIManager_1.default.gameUI.guideTip.visible = false;
        //隐藏商城和签到
        UIManager_1.default.gameUI.shangDianBut.visible = false;
        UIManager_1.default.gameUI.QianDaoBut.visible = false;
        //状态为奔跑
        this.state = "run";
        //  this.pathAni.speed = 0.5;
        this.owner.getChildAt(this.piFuSuoYin - 1).getComponent(Laya.Animator).play("p_anim_zou1", 0, 0); //人物奔跑动画
        this.owner.getChildAt(this.piFuSuoYin - 1).getComponent(Laya.Animator).speed = 1.3; //人物奔跑动画
        //GameManager.cameraAnima.play("CameraStart", 0, 0); //相机开始动画
        this.chiHanBuZhuan = false;
    }
    onUpdate() {
        //刷新行走进度
        // this.suanJinDu();
        this.AutoMove();
    }
    AutoMove() {
        //闪电持续处理
        if (this.shanDianKaiGuan == true) {
            this.shanDianTime1 = this.shanDianTime1 + 1;
            if (this.shanDianTime1 > this.shanDianTime2) {
                this.shanDianTime1 = 0;
                this.shanDianKaiGuan = false;
                GameManager_1.default.curScene.getChildByName("Camera").getChildByName("Camera").getChildByName("FX").getChildByName("FX_shandian_QuanPing").active = false;
            }
        }
        if (this.bingFengKaiGuan == true) {
            UIManager_1.default.gameUI.bingDongZheZhao.alpha = UIManager_1.default.gameUI.bingDongZheZhao.alpha + 0.1;
            this.bingFengTime1 = this.bingFengTime1 + 1;
            if (this.bingFengTime1 > this.bingFengTime2) {
                this.bingFengTime1 = 0;
                this.bingFengKaiGuan = false; //关闭时间风暴
                GameManager_1.default.curLevelManager.baoXueTx.active = false; //关闭全屏暴雪特效
                UIManager_1.default.gameUI.bingDongZheZhao.visible = false; //隐藏冰冻遮罩
            }
        }
        //作战先锋 治疗光塔等级
        if (GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[1] > 0) {
            this.zhiLiaoGuangTaTime1 = this.zhiLiaoGuangTaTime1 + 1;
            if (this.zhiLiaoGuangTaTime1 > this.zhiLiaoGuangTaTime2) {
                this.zhiLiaoGuangTaTime1 = 0;
                var dengJi = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[1];
                var meiJiXueLiang = parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["zhiLiaoGuangTaZhiLiaoXueLiang"]);
                this.quanTizhiLiao(dengJi * meiJiXueLiang);
            }
        }
        //无敌金钟罩 
        if (GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[5] > 0) {
            this.wuDiJinZhongZhaoTime1 = this.wuDiJinZhongZhaoTime1 + 1;
            if (this.wuDiJinZhongZhaoTime1 > this.wuDiJinZhongZhaoTime2) {
                this.wuDiJinZhongZhaoTime1 = 0;
                this.quanTiHuDun(); //全体护盾
            }
        }
        //无敌金钟罩移除处理
        if (this.wuDiJinZhongZhaokaiGuan == true) {
            this.wuDiJinZhongZhaoTime3 = this.wuDiJinZhongZhaoTime3 + 1;
            if (this.wuDiJinZhongZhaoTime3 > this.wuDiJinZhongZhaoTime4) {
                this.wuDiJinZhongZhaoTime3 = 0;
                this.quanTiHuDunYiChu(); //全体移除护盾
            }
        }
        //导弹轰炸 冷却处理
        if (GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[3] > 0) {
            this.daoDanHongZhaTime1 = this.daoDanHongZhaTime1 + 1;
            if (this.daoDanHongZhaTime1 > this.daoDanHongZhaTime2) {
                this.daoDanHongZhaTime1 = 0;
                //投射导弹
                this.touSheDaoDan(GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[3]);
            }
            //导弹位置检测,接近水面就爆炸
            if (this.daoDanJihe.numChildren > 0) {
                for (var i = 0; i < this.daoDanJihe.numChildren; i++) {
                    if (this.daoDanJihe.getChildAt(i).getChildAt(0).transform.position.y <= 1) {
                        var bz = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("fx_hongzha"), GameManager_1.default.curScene);
                        bz.transform.position = this.daoDanJihe.getChildAt(i).transform.position;
                        GameManager_1.default.PlaySound("baoZha1");
                        //对附近的敌人造成伤害
                        for (var p = 0; p < this.diRenJiHe.numChildren; p++) {
                            var diRenWeiZhi = this.diRenJiHe.getChildAt(p).transform.position;
                            var jvLi = Laya.Vector3.distance(this.daoDanJihe.getChildAt(i).transform.position, diRenWeiZhi);
                            //距离爆炸位置近就受伤
                            if (jvLi < parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["daoDanHongZhaFanWei"])) {
                                console.log(parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["daoDanHongZhaShangHai"]));
                                this.diRenJiHe.getChildAt(p).getChildAt(0).getComponent(jiao_1.default).shouJi(parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["daoDanHongZhaShangHai"]));
                            }
                        }
                        this.daoDanJihe.getChildAt(i).destroy();
                    }
                }
            }
        }
        //时间风暴处理
        if (GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[6] > 0) {
            this.shiJianFengBaoTime1 = this.shiJianFengBaoTime1 + 1;
            if (this.shiJianFengBaoTime1 > this.shiJianFengBaoTime2) {
                this.shiJianFengBaoTime1 = 0;
                this.shiJianFengBaoChuFa(); //时间风暴触发
            }
            if (this.shiJianFengBaoKaiGuan == true) {
                this.shiJianFengBaoTime3 = this.shiJianFengBaoTime3 + 1;
                UIManager_1.default.gameUI.bingDongZheZhao.alpha = UIManager_1.default.gameUI.bingDongZheZhao.alpha + 0.1;
                if (this.shiJianFengBaoTime3 > this.shiJianFengBaoTime4) {
                    this.shiJianFengBaoTime3 = 0;
                    this.shiJianFengBaoKaiGuan = false; //关闭时间风暴
                    GameManager_1.default.curLevelManager.baoXueTx.active = false; //关闭全屏暴雪特效
                    UIManager_1.default.gameUI.bingDongZheZhao.visible = false; //隐藏冰冻遮罩
                }
            }
        }
        if (this.state == "jiuYuan") {
            //相机跟随直升机
            var targetRota = new Laya.Vector3(GameManager_1.default.curScene.getChildByName("FeijI").transform.position.x, GameManager_1.default.curScene.getChildByName("FeijI").transform.position.y + 9, GameManager_1.default.curScene.getChildByName("FeijI").transform.position.z);
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(this.xiangJiFa.transform.position, targetRota, 0.06, targetRotaLerp);
            this.xiangJiFa.transform.position = targetRotaLerp;
            //飞机飞向玩家
            var feiXiangMb = new Laya.Vector3(this.owner.transform.position.x, GameManager_1.default.curScene.getChildByName("FeijI").transform.position.y, this.owner.transform.position.z);
            var targetRota = feiXiangMb;
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(GameManager_1.default.curScene.getChildByName("FeijI").transform.position, targetRota, 0.005, targetRotaLerp);
            GameManager_1.default.curScene.getChildByName("FeijI").transform.position = targetRotaLerp;
            GameManager_1.default.curScene.getChildByName("FeijI").transform.lookAt(feiXiangMb, new Laya.Vector3(0, 1, 0), false);
            GameManager_1.default.curScene.getChildByName("FeijI").transform.rotationEuler = new Laya.Vector3(GameManager_1.default.curScene.getChildByName("FeijI").transform.rotationEuler.x, GameManager_1.default.curScene.getChildByName("FeijI").transform.rotationEuler.y + 180, GameManager_1.default.curScene.getChildByName("FeijI").transform.rotationEuler.z);
        }
        if (this.state == "daiJi") {
            if (this.dingWeiZhuangTai == true) {
                //相机跟随玩家
                var targetRota = GameManager_1.default.curScene.getChildByName("shiJiaoDian").transform.position;
                var targetRotaLerp = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.lerp(this.xiangJiFa.transform.position, targetRota, 0.06, targetRotaLerp);
                this.xiangJiFa.transform.position = targetRotaLerp;
            }
            else {
                //相机跟随玩家
                var targetRota = this.owner.transform.position;
                var targetRotaLerp = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.lerp(this.xiangJiFa.transform.position, targetRota, 0.06, targetRotaLerp);
                this.xiangJiFa.transform.position = targetRotaLerp;
            }
        }
        if (this.state == "yiDong") {
            var zhaNWei = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.add(this.owner.transform.position, new Laya.Vector3(-this.yiDongBiaoLiang.x * 0.1, 0, -this.yiDongBiaoLiang.y * 0.1), zhaNWei);
            // this.owner.transform.position = zhaNWei;
            this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.yiDongBiaoLiang.x * this.wanJiayiSu, 0, -this.yiDongBiaoLiang.y * this.wanJiayiSu);
            //相机跟随玩家
            var targetRota = this.owner.transform.position;
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(this.xiangJiFa.transform.position, targetRota, 0.06, targetRotaLerp);
            this.xiangJiFa.transform.position = targetRotaLerp;
        }
        else if (this.state == "kaiMen") {
            var targetRota = new Laya.Vector3(this.menObj.transform.position.x, this.xiangJiFa.transform.position.y, this.menObj.transform.position.z);
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(this.xiangJiFa.transform.position, targetRota, 0.03, targetRotaLerp);
            this.xiangJiFa.transform.position = targetRotaLerp;
            var jvLi = Laya.Vector3.distance(this.xiangJiFa.transform.position, targetRota);
            if (jvLi <= 0.3) {
                this.menObj.transform.position = new Laya.Vector3(this.menObj.transform.position.x, this.menObj.transform.position.y - 0.1, this.menObj.transform.position.z);
                //门已经打开
                if (this.menObj.transform.position.y <= -10) {
                    this.menObj.active = false;
                    //加载下一关敌人
                    GameManager_1.default.curLevelManager.xiaYiGuanJiaZai();
                    //玩家进入到待机状态
                    this.state = "zanShi";
                    this.daiJiFun();
                }
            }
        }
        //准备战斗
        else if (this.state == "zhunBeiZhanDou") {
            var targetRota = GameManager_1.default.curScene.getChildByName("LV").getChildByName("luojiwuti").getChildByName("WinObj").getChildByName("zhanDouDian").transform.position;
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(this.owner.transform.position, targetRota, 0.02, targetRotaLerp);
            this.owner.transform.position = targetRotaLerp;
            this.owner.transform.rotationEuler = this.canZhaoDian.transform.rotationEuler;
            //相机跟随玩家
            GameManager_1.default.cameraTrans.position = this.moveTrans.position;
            GameManager_1.default.cameraTrans.rotationEuler = this.moveTrans.rotationEuler;
            var jvLi = Laya.Vector3.distance(this.owner.transform.position, GameManager_1.default.curScene.getChildByName("LV").getChildByName("luojiwuti").getChildByName("WinObj").getChildByName("zhanDouDian").transform.position);
            if (jvLi < 0.3) {
                this.zhanDou();
            }
            this.bingDuXueTiao();
        }
        else if (this.state == "zhanDou") {
            this.bingDuXueTiao();
            //玩家攻击间隔处理
            this.gongJiJianGe1 = this.gongJiJianGe1 + 1;
            if (this.gongJiJianGe1 >= this.gongJiJianGe2) {
                this.gongJiJianGe1 = this.gongJiJianGe2;
            }
            this.fanJiShiJian = this.fanJiShiJian - 1;
            if (this.fanJiShiJian <= 0) {
                this.guaiShouFanJi();
            }
        }
        else if (this.state == "xiaLuo") {
            this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y - 0.3, this.owner.transform.position.z);
        }
        else if (this.state == "fuLuBiaoYan") {
            if (GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe").getChildAt(this.daoYuSuoYin).getChildByName("QiZi").getComponent(Laya.Animator).getCurrentAnimatorPlayState()._normalizedTime > 0.95) {
                GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe").getChildAt(this.daoYuSuoYin).getChildByName("QiZi").getComponent(Laya.Animator).play("2", 0, 0);
            }
            if (this.fuLuJihe.numChildren > 0) {
                var targetRota = this.fuLuJihe.getChildAt(0).transform.position;
                var targetRotaLerp = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.lerp(this.xiangJiFa.transform.position, targetRota, 0.03, targetRotaLerp);
                this.xiangJiFa.transform.position = targetRotaLerp;
            }
            if (this.kaiLongZi == true) {
                for (var i = 0; i < this.longZiJiHe.numChildren; i++) {
                    this.longZiJiHe.getChildAt(i).transform.position = new Laya.Vector3(this.longZiJiHe.getChildAt(i).transform.position.x, this.longZiJiHe.getChildAt(i).transform.position.y - 0.05, this.longZiJiHe.getChildAt(i).transform.position.z);
                    if (i == 0) {
                        if (this.longZiJiHe.getChildAt(i).transform.position.y < -1.9) {
                            this.longZiJiHe.getChildAt(i).transform.position = new Laya.Vector3(this.longZiJiHe.getChildAt(i).transform.position.x, -2, this.longZiJiHe.getChildAt(i).transform.position.z);
                            this.kaiLongZi = false; //开笼子
                            this.benXiangXiangZi = true; //奔向箱子
                            this.chuangZhuangBei = false; //穿装备
                            this.benxiangWanJia = false; //奔向玩家
                            for (var p = 0; p < this.fuLuJihe.numChildren; p++) {
                                this.fuLuJihe.getChildAt(p).getComponent(Laya.Animator).play("juese_Skin_Pao", 0, 0);
                            }
                        }
                    }
                }
            }
            if (this.benXiangXiangZi == true) {
                for (var i = 0; i < this.fuLuJihe.numChildren; i++) {
                    this.fuLuJihe.getChildAt(i).transform.lookAt(this.xiangZi.transform.position, new Laya.Vector3(0, 1, 0), false);
                    this.fuLuJihe.getChildAt(i).transform.rotationEuler = new Laya.Vector3(this.fuLuJihe.getChildAt(i).transform.rotationEuler.x, this.fuLuJihe.getChildAt(i).transform.rotationEuler.y + 180, this.fuLuJihe.getChildAt(i).transform.rotationEuler.z);
                    var targetRota = this.xiangZi.transform.position;
                    var targetRotaLerp = new Laya.Vector3(0, 0, 0);
                    Laya.Vector3.lerp(this.fuLuJihe.getChildAt(i).transform.position, targetRota, 0.02, targetRotaLerp);
                    this.fuLuJihe.getChildAt(i).transform.position = targetRotaLerp;
                    //距离
                    if (i == 0) {
                        var jvLi = Laya.Vector3.distance(this.xiangZi.transform.position, this.fuLuJihe.getChildAt(i).transform.position);
                        if (jvLi < 1) {
                            this.kaiLongZi = false; //开笼子
                            this.benXiangXiangZi = false; //奔向箱子
                            this.chuangZhuangBei = true; //穿装备
                            this.benxiangWanJia = false; //奔向玩家
                            GameManager_1.default.PlaySound("heCheng2");
                            this.chuanZHuangBeiDaoJiShi = 100;
                            //特效
                            var shuLiang = this.fuLuJihe.numChildren;
                            var weizhiShuZu = [];
                            for (var p = 0; p < shuLiang; p++) {
                                var tx = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("FX_shengji"), GameManager_1.default.curScene);
                                tx.transform.position = this.fuLuJihe.getChildAt(0).transform.position;
                                weizhiShuZu.push(this.fuLuJihe.getChildAt(0).transform.position);
                                this.fuLuJihe.getChildAt(0).destroy();
                            }
                            for (var p = 0; p < shuLiang; p++) {
                                //默认冲锋兵或者步兵
                                var ziFu = "";
                                if (GameManager_1.default.RandomInt(1, 2) == 1) {
                                    ziFu = "chongFeng_Bing";
                                }
                                else {
                                    ziFu = "buQiang_Bing";
                                }
                                var sqBing = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName(ziFu), this.fuLuJihe);
                                sqBing.transform.position = weizhiShuZu[p];
                                sqBing.getChildAt(1).skinnedMeshRenderer.material = GameManager_1.default.models.getChildByName("piFuLan").meshRenderer.material;
                                sqBing.getChildAt(2).skinnedMeshRenderer.material = GameManager_1.default.models.getChildByName("piFuLan").meshRenderer.material;
                            }
                        }
                    }
                }
            }
            if (this.chuangZhuangBei == true) {
                this.chuanZHuangBeiDaoJiShi = this.chuanZHuangBeiDaoJiShi - 1;
                if (this.chuanZHuangBeiDaoJiShi <= 0) {
                    this.kaiLongZi = false; //开笼子
                    this.benXiangXiangZi = false; //奔向箱子
                    this.chuangZhuangBei = false; //穿装备
                    this.benxiangWanJia = true; //奔向玩家
                    for (var p = 0; p < this.fuLuJihe.numChildren; p++) {
                        this.fuLuJihe.getChildAt(p).getComponent(Laya.Animator).play("juese_Skin_235_Run", 0, 0);
                    }
                }
            }
            if (this.benxiangWanJia == true) {
                for (var i = 0; i < this.fuLuJihe.numChildren; i++) {
                    this.fuLuJihe.getChildAt(i).transform.lookAt(GameManager_1.default.curPlayerControl.owner.transform.position, new Laya.Vector3(0, 1, 0), false);
                    this.fuLuJihe.getChildAt(i).transform.rotationEuler = new Laya.Vector3(this.fuLuJihe.getChildAt(i).transform.rotationEuler.x, this.fuLuJihe.getChildAt(i).transform.rotationEuler.y + 180, this.fuLuJihe.getChildAt(i).transform.rotationEuler.z);
                    var targetRota = GameManager_1.default.curPlayerControl.owner.transform.position;
                    var targetRotaLerp = new Laya.Vector3(0, 0, 0);
                    Laya.Vector3.lerp(this.fuLuJihe.getChildAt(i).transform.position, targetRota, 0.008 * (i + 1), targetRotaLerp);
                    this.fuLuJihe.getChildAt(i).transform.position = targetRotaLerp;
                    var jvLi = Laya.Vector3.distance(GameManager_1.default.curPlayerControl.owner.transform.position, this.fuLuJihe.getChildAt(i).transform.position);
                    if (jvLi < 3) {
                        if (this.fuLuJihe.getChildAt(i).active == true) {
                            GameManager_1.default.PlaySound("heCheng");
                            this.fuLuJihe.getChildAt(i).active = false;
                            //增加队友
                            if (this.fuLuJihe.getChildAt(i).name == "chongFeng_Bing") {
                                this.addbanZiFun(2);
                            }
                            else {
                                this.addbanZiFun(3);
                            }
                            if (i == 0) {
                                this.kaiLongZi = false; //开笼子
                                this.benXiangXiangZi = false; //奔向箱子
                                this.chuangZhuangBei = false; //穿装备
                                this.benxiangWanJia = false; //奔向玩家
                                this.state = "zanShi";
                                this.daiJiFun(); //玩家进入待机状态
                                //岛屿碰撞由内向外缩放 放置卡住玩家
                                GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe").getChildAt(this.daoYuSuoYin).getChildByName("pengZhuangJiHe").getComponent(Laya.Animator).play("daoPengZhuangKs", 0, 0);
                            }
                        }
                    }
                }
            }
        }
        /*
        else {
            this.moveTrans.localRotationEulerY += (0 - this.moveTrans.localRotationEulerY) * 0.1;
        }
        */
    }
    //救援
    jiuYuanFun() {
        this.state = "jiuYuan";
        this.yiDongBiaoLiang = new Laya.Vector3(0, 0, 0);
        this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, 0);
        UIManager_1.default.gameUI.yoUXiUI.visible = false;
        UIManager_1.default.gameUI.jiNnegZuUIFa.visible = false;
        UIManager_1.default.ShowGameTipUI("救援直升机已抵达,准备登机");
        //救援音效
        GameManager_1.default.PlaySound("zhiShengJi");
        GameManager_1.default.PlaySound("duiJiangJi");
    }
    //待机
    daiJiFun() {
        if (this.state == "kaiMen" || this.state == "fuLuBiaoYan" || this.state == "shiBai" || this.state == "gouDaiTou" || this.state == "shengLi") {
        }
        else {
            this.state = "daiJi";
            this.yiDongBiaoLiang = new Laya.Vector3(0, 0, 0);
            this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, 0);
        }
    }
    //开门
    kaiMenFun() {
        this.daiJiFun(); //先待机静止
        //获取要操作的们
        this.menObj = GameManager_1.default.curScene.getChildByName("menJiHe").getChildAt(GameManager_1.default.curLevelManager.dangQianGuanQia);
        GameManager_1.default.PlaySound("shiMenKai");
        this.state = "kaiMen";
    }
    //移动
    yiDongFun(biaoLiang) {
        if (this.state == "kaiMen" || this.state == "fuLuBiaoYan" || this.state == "gouDai" || this.state == "gouDaiTou" || this.state == "shengLi") {
        }
        else {
            this.state = "yiDong";
            this.yiDongBiaoLiang = biaoLiang;
            //作战先锋模式 只能左右移动
            if (GameManager_1.default.curLevelManager.moShi == "zuoZhanXianFeng") {
                // this.yiDongBiaoLiang = new Laya.Vector3(this.yiDongBiaoLiang.x, 0, this.yiDongBiaoLiang.z);
            }
            //console.log(this.yiDongBiaoLiang);
            //关闭定位状态
            if (this.dingWeiZhuangTai == true) {
                this.dingWeiZhuangTai = false;
            }
        }
    }
    //俘虏表演
    fuLuBiaoYanFun(daoYuSuoYin) {
        this.daiJiFun(); //先待机静止
        //俘虏集合
        this.fuLuJihe = GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe").getChildAt(daoYuSuoYin).getChildByName("fuLuJiHe");
        //笼子集合
        this.longZiJiHe = GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe").getChildAt(daoYuSuoYin).getChildByName("longZiJiHe");
        //箱子
        this.xiangZi = GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe").getChildAt(daoYuSuoYin).getChildByName("xiangZi");
        this.daoYuSuoYin = daoYuSuoYin;
        this.state = "fuLuBiaoYan";
        //俘虏待机动画
        // for (var p = 0; p < this.fuLuJihe.numChildren; p++) {
        //     this.fuLuJihe.getChildAt(p).getComponent(Laya.Animator).play("juese_Skin_furu", 0, 0);
        // }
        //旗子降落动画
        GameManager_1.default.curScene.getChildByName("xiaoDaoJiHe").getChildAt(daoYuSuoYin).getChildByName("QiZi").getComponent(Laya.Animator).play("QiZi", 0, 0);
        this.kaiLongZi = true; //开笼子
        this.benXiangXiangZi = false; //奔向箱子
        this.chuangZhuangBei = false; //穿装备
        this.benxiangWanJia = false; //奔向玩家
    }
    addbanZiFun(leiXing) {
        if (this.state == "shiBai") {
            return;
        }
        //激活板子
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            if (this.banZiJiHe.getChildAt(i).transform.position.y < -10) {
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).jiHuoFun(leiXing);
                break;
            }
        }
        //判断合成
        if (leiXing == 0) {
            //遍历是否已经有了四个空板子
            var shu = [];
            for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
                if (this.banZiJiHe.getChildAt(i).transform.position.y > -10) {
                    if (this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).leiXing == 0) {
                        shu.push(this.banZiJiHe.getChildAt(i));
                    }
                }
            }
            if (shu.length >= 4) {
                //判断是否已经失败
                if (this.state == "shiBai") {
                }
                else {
                    //弹出引导
                    if (PlayerData_1.default.GetUserData("fuBanHeShouQiangBingYd") == false) {
                        UIManager_1.default.gameUI.yindaoTanChuang(UIManager_1.default.gameUI.banZiHeCheng);
                    }
                    GameManager_1.default.PlaySound("heCheng");
                    for (var i = 0; i < shu.length; i++) {
                        shu[i].getComponent(CwControl_1.default).gouDaiTouFun();
                    }
                    this.addbanZiFun(1);
                }
            }
        }
        else if (leiXing == 1) {
            //遍历所有获取所有手枪集合
            var shu = [];
            for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
                if (this.banZiJiHe.getChildAt(i).transform.position.y > -10) {
                    if (this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).leiXing == 1) {
                        shu.push(this.banZiJiHe.getChildAt(i));
                    }
                }
            }
            //手枪并>=3 弹出进阶弹窗
            if (shu.length >= 3) {
                //弹出士兵升级引导
                if (PlayerData_1.default.GetUserData("xiangTongShiBingHeChengYd") == false) {
                    UIManager_1.default.gameUI.yindaoTanChuang(UIManager_1.default.gameUI.shiBingHeCheng);
                }
                UIManager_1.default.gameUI.shouQIangdShengJiUI.visible = true; //手枪兵进阶弹窗
                this.jinJieJiHe = shu; //三个 一级兵集合
                //暂停
                Laya.timer.frameOnce(8, this, function () {
                    if (UIManager_1.default.gameUI.shouQIangdShengJiUI.visible == false && UIManager_1.default.gameUI.chongFengQiangShengJiUI.visible == false && UIManager_1.default.gameUI.buQiangShengJiUI.visible == false || this.state == "shengLi" || this.state == "shiBai") {
                    }
                    else {
                        Laya.stage.renderingEnabled = false;
                        Laya.timer.scale = 0;
                    }
                });
            }
        }
        else if (leiXing == 2) {
            //遍历所有获取所有冲锋枪集合
            var shu = [];
            for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
                if (this.banZiJiHe.getChildAt(i).transform.position.y > -10) {
                    if (this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).leiXing == 2) {
                        shu.push(this.banZiJiHe.getChildAt(i));
                    }
                }
            }
            if (shu.length >= 3) {
                UIManager_1.default.gameUI.chongFengQiangShengJiUI.visible = true; //步枪或者冲锋枪 进阶弹窗
                this.jinJieJiHe = shu;
                //暂停
                Laya.timer.frameOnce(8, this, function () {
                    if (UIManager_1.default.gameUI.shouQIangdShengJiUI.visible == false && UIManager_1.default.gameUI.chongFengQiangShengJiUI.visible == false && UIManager_1.default.gameUI.buQiangShengJiUI.visible == false || this.state == "shengLi" || this.state == "shiBai") {
                    }
                    else {
                        Laya.stage.renderingEnabled = false;
                        Laya.timer.scale = 0;
                    }
                });
            }
        }
        else if (leiXing == 3) {
            //遍历所有获取所有步枪集合
            var shu = [];
            for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
                if (this.banZiJiHe.getChildAt(i).transform.position.y > -10) {
                    if (this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).leiXing == 3) {
                        shu.push(this.banZiJiHe.getChildAt(i));
                    }
                }
            }
            if (shu.length >= 3) {
                UIManager_1.default.gameUI.buQiangShengJiUI.visible = true; //步枪 进阶弹窗
                this.jinJieJiHe = shu;
                //暂停
                Laya.timer.frameOnce(8, this, function () {
                    if (UIManager_1.default.gameUI.shouQIangdShengJiUI.visible == false && UIManager_1.default.gameUI.chongFengQiangShengJiUI.visible == false && UIManager_1.default.gameUI.buQiangShengJiUI.visible == false || this.state == "shengLi" || this.state == "shiBai") {
                    }
                    else {
                        Laya.stage.renderingEnabled = false;
                        Laya.timer.scale = 0;
                    }
                });
            }
        }
    }
    //冲锋枪合成
    chongFengQiangHc() {
        GameManager_1.default.PlaySound("heCheng");
        for (var i = 0; i < this.jinJieJiHe.length; i++) {
            this.jinJieJiHe[i].getComponent(CwControl_1.default).gouDaiTouFun();
        }
        this.addbanZiFun(2);
    }
    //步枪合成
    buQiangHc() {
        GameManager_1.default.PlaySound("heCheng");
        for (var i = 0; i < this.jinJieJiHe.length; i++) {
            this.jinJieJiHe[i].getComponent(CwControl_1.default).gouDaiTouFun();
        }
        this.addbanZiFun(3);
    }
    //机枪合成
    jiQiangHc() {
        GameManager_1.default.PlaySound("heCheng");
        for (var i = 0; i < this.jinJieJiHe.length; i++) {
            this.jinJieJiHe[i].getComponent(CwControl_1.default).gouDaiTouFun();
        }
        this.addbanZiFun(4);
    }
    //火枪兵合成
    huoQiangHc() {
        GameManager_1.default.PlaySound("heCheng");
        for (var i = 0; i < this.jinJieJiHe.length; i++) {
            this.jinJieJiHe[i].getComponent(CwControl_1.default).gouDaiTouFun();
        }
        this.addbanZiFun(5);
    }
    //狙击手合成
    jvJiShouHc() {
        GameManager_1.default.PlaySound("heCheng");
        for (var i = 0; i < this.jinJieJiHe.length; i++) {
            this.jinJieJiHe[i].getComponent(CwControl_1.default).gouDaiTouFun();
        }
        this.addbanZiFun(6);
    }
    liuDanBingHc() {
        GameManager_1.default.PlaySound("heCheng");
        for (var i = 0; i < this.jinJieJiHe.length; i++) {
            this.jinJieJiHe[i].getComponent(CwControl_1.default).gouDaiTouFun();
        }
        this.addbanZiFun(7);
    }
    //返回当前板子上的人数
    fanHuiRenShu() {
        var shu = 0;
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            var geShu = this.banZiJiHe.getChildAt(i).getChildByName("wuTi");
            if (geShu.parent.getComponent(CwControl_1.default).state == "gouDai" || geShu.parent.getComponent(CwControl_1.default).state == "gouDaiTou") {
            }
            else {
                shu = shu + 1;
            }
        }
        return shu;
    }
    //圣神祝福
    shengShenZhuFu() {
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            if (this.banZiJiHe.getChildAt(i).transform.position.y < -10) {
                continue;
            }
            else {
                // console.log(shuLiang);
                var chengDeShu = parseFloat(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shengShenZhuFuZengJiaXueLiang"]);
                var yaoZengJiaDe = this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).xueLiang * chengDeShu;
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).zhiLiao(yaoZengJiaDe);
            }
        }
    }
    //全体治疗
    quanTizhiLiao(shuLiang) {
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            if (this.banZiJiHe.getChildAt(i).transform.position.y < -10) {
                continue;
            }
            else {
                // console.log(shuLiang);
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).zhiLiao(shuLiang);
            }
        }
    }
    //全体护盾
    quanTiHuDun() {
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            if (this.banZiJiHe.getChildAt(i).transform.position.y < -10) {
                continue;
            }
            else {
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).huDun();
                this.wuDiJinZhongZhaokaiGuan = true; //金钟罩是否开启
            }
        }
    }
    //全体护盾移除
    quanTiHuDunYiChu() {
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            if (this.banZiJiHe.getChildAt(i).transform.position.y < -10) {
                continue;
            }
            else {
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).yiChuHuDun();
                this.wuDiJinZhongZhaokaiGuan = false; //金钟罩是否开启
            }
        }
    }
    //特殊加固
    teShuJiaGu() {
        for (var i = 0; i < this.banZiJiHe.numChildren; i++) {
            if (this.banZiJiHe.getChildAt(i).transform.position.y < -10) {
                continue;
            }
            else {
                //血量进行相应的提升
                var tiShengDeXueLiang = GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[8] * parseInt(GameManager_1.default.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["teShuJiaGuMeiCiTiShengXueLiang"]);
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).xueLiang = this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).xueLiang + tiShengDeXueLiang;
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).dangQianXueLiang = this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).dangQianXueLiang + tiShengDeXueLiang;
                this.banZiJiHe.getChildAt(i).getComponent(CwControl_1.default).shuaXinXueLiangXianShi(); //刷新血量显示
            }
        }
    }
    //投射导弹
    touSheDaoDan(num) {
        for (var i = 0; i < num; i++) {
            GameManager_1.default.PlaySound("daoDanSou");
            var suiJiShu = GameManager_1.default.RandomInt(0, this.diRenJiHe.numChildren - 1);
            var jvLi = Laya.Vector3.distance(this.diRenJiHe.getChildAt(i).transform.position, GameManager_1.default.curPlayerControl.owner.transform.position);
            if (jvLi < 20) {
                var dr = Laya.Sprite3D.instantiate(GameManager_1.default.models.getChildByName("daoDanFa"), GameManager_1.default.curScene.getChildByName("daoDanJiHe"));
                dr.transform.position = this.diRenJiHe.getChildAt(i).transform.position;
                return;
            }
            else {
            }
        }
    }
    //触发时间风暴
    shiJianFengBaoChuFa() {
        GameManager_1.default.PlaySound("baoXue");
        UIManager_1.default.gameUI.bingDongZheZhao.visible = true; //显示冰冻遮罩
        UIManager_1.default.gameUI.bingDongZheZhao.alpha = 0.1;
        GameManager_1.default.curLevelManager.baoXueTx.active = true; //显示全屏暴雪特效
        this.shiJianFengBaoKaiGuan = true; //激活时间风暴
    }
    guangGaoBingDongChuFa() {
        GameManager_1.default.PlaySound("baoXue");
        UIManager_1.default.gameUI.bingDongZheZhao.visible = true; //显示冰冻遮罩
        UIManager_1.default.gameUI.bingDongZheZhao.alpha = 0.1;
        GameManager_1.default.curLevelManager.baoXueTx.active = true; //显示全屏暴雪特效
        this.bingFengKaiGuan = true;
    }
    mouseDown() {
        if (this.state != "run") {
            return;
        }
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.curPosX = this.moveTrans.localPositionX;
        this.curRotaY = this.moveTrans.localRotationEulerY;
        this.isMouseDown = true;
    }
    mouseUp() {
        if (this.isMouseDown == true) {
            this.isMouseDown = false;
        }
    }
    //射线检测
    sheXianJiance() {
        this.hitResult = new Laya.HitResult();
        this.hitResults = [];
        //进行射线检测,检测第一个碰撞物体
        GameManager_1.default.curScene.physicsSimulation.raycastAllFromTo(this.sheXianQiDian.transform.position, this.sheXianZhongDian.transform.position, this.hitResults);
        if (this.hitResults.length > 0) {
            for (var i = 0; i < this.hitResults.length; i++) {
                if (this.hitResults[i].collider.owner.name.indexOf("guaiWu") != -1) {
                    //开火
                    this.kaiHuoBool = true;
                    break;
                }
                if (i == this.hitResults.length - 1) {
                    //停止开火
                    this.kaiHuoBool = false;
                }
            }
        }
        else {
            //停止开火
            this.kaiHuoBool = false;
        }
    }
    //引爆附近油桶
    yinBaoFuJinYouTong() {
        if (this.fuJinYouTong == null || this.fuJinYouTong == undefined) {
            return;
        }
        this.fuJinYouTong.getComponent(youTong_1.default).shouJi(1000);
    }
    //闪电风暴
    shanDianFengBao() {
        GameManager_1.default.PlaySound("shanDian");
        this.shanDianKaiGuan = true;
        GameManager_1.default.curScene.getChildByName("Camera").getChildByName("Camera").getChildByName("FX").getChildByName("FX_shandian_QuanPing").active = true;
        for (var i = 0; i < this.diRenJiHe.numChildren; i++) {
            for (var p = 0; p < this.diRenJiHe.getChildAt(i).numChildren; p++) {
                //不秒杀 直接省丝血
                if (parseInt(GameManager_1.default.jsonShuJv["guangGaoLeiDianShangHai"]) > this.diRenJiHe.getChildAt(i).getChildAt(p).getComponent(jiao_1.default).dangQianXueLiang) {
                    this.diRenJiHe.getChildAt(i).getChildAt(p).getComponent(jiao_1.default).shouJi(this.diRenJiHe.getChildAt(i).getChildAt(p).getComponent(jiao_1.default).dangQianXueLiang - 1);
                }
                else {
                    this.diRenJiHe.getChildAt(i).getChildAt(p).getComponent(jiao_1.default).shouJi(parseInt(GameManager_1.default.jsonShuJv["guangGaoLeiDianShangHai"]));
                }
            }
        }
    }
    onTriggerEnter(other) {
        var oname = other.owner.name;
        var obj = other.owner;
        //碰到胜利点
        if (oname.indexOf("shengLiDian") != -1) {
            obj.active = false;
            this.shengLiChuLiFun();
        }
        //碰到油桶
        if (oname.indexOf("barrel01_A") != -1) {
            UIManager_1.default.gameUI.yinBaoYouTongBut.visible = true;
            this.fuJinYouTong = obj;
        }
    }
    onTriggerExit(other) {
        var oname = other.owner.name;
        var obj = other.owner;
        //离开油桶
        if (oname.indexOf("barrel01_A") != -1) {
            UIManager_1.default.gameUI.yinBaoYouTongBut.visible = false;
            this.fuJinYouTong = null;
        }
    }
    //刷新2D
    erDShuaXin(scenePos) {
        var screenPos = new Laya.Vector3();
        var screenPos4 = new Laya.Vector3();
        GameManager_1.default.curScene.getChildByName("CameraRoot").getChildByName("AnimatorRoot").getChildByName("TranslateNode").getChildByName("EulerY").getChildByName("EulerX").getChildByName("Main Camera").worldToViewportPoint(scenePos, screenPos4);
        screenPos.x = screenPos4.x;
        screenPos.y = screenPos4.y;
        return screenPos;
    }
    //队长升级武器
    duiZhangShengWuQi() {
        this.duiZhangObj.getComponent(CwControl_1.default).wt.active = false;
        GameManager_1.default.curScene.addChild(this.duiZhangObj.getComponent(CwControl_1.default).wt);
        if (this.duiZhangObj.getComponent(CwControl_1.default).leiXing == 1) {
            this.duiZhangObj.getComponent(CwControl_1.default).leiXing = 2;
        }
        else if (this.duiZhangObj.getComponent(CwControl_1.default).leiXing == 2) {
            this.duiZhangObj.getComponent(CwControl_1.default).leiXing = 3;
        }
        else if (this.duiZhangObj.getComponent(CwControl_1.default).leiXing == 3) {
            this.duiZhangObj.getComponent(CwControl_1.default).leiXing = 6;
        }
        else if (this.duiZhangObj.getComponent(CwControl_1.default).leiXing == 6) {
            this.duiZhangObj.getComponent(CwControl_1.default).leiXing = 4;
        }
        else if (this.duiZhangObj.getComponent(CwControl_1.default).leiXing == 4) {
            this.duiZhangObj.getComponent(CwControl_1.default).leiXing = 5;
        }
        this.duiZhangObj.getComponent(CwControl_1.default).jiHuoFun(this.duiZhangObj.getComponent(CwControl_1.default).leiXing);
    }
    //刷新旋涡
    shuaXinXuanWo() {
        for (var i = 0; i < GameManager_1.default.curLevelManager.zzxfDuiYingDeDengJi[4]; i++) {
            GameManager_1.default.curLevelManager.xuanWoFa.getChildAt(i).active = true;
        }
    }
    //胜利逻辑处理
    shengLiChuLiFun() {
        this.yiDongBiaoLiang = new Laya.Vector3(0, 0, 0);
        this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, 0);
        this.state = "shengLi";
        //GameManager.curGoldNum = 100;//奖励金币
        Laya.timer.frameOnce(100, this, function () {
            //修改状态为胜利
            this.state = "shengLi";
            GameManager_1.default.PlaySound("win");
            //过两秒弹出宝箱页面
            UIManager_1.default.ShowUIPanel("Win");
        });
    }
    //失败逻辑处理
    shiBaiChuLiFun() {
        this.yiDongBiaoLiang = new Laya.Vector3(0, 0, 0);
        this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, 0);
        //失败状态
        this.state = "shiBai";
        Laya.timer.frameOnce(120, this, function () {
            //修改状态为胜利
            GameManager_1.default.PlaySound("shiBai");
            //过两秒弹出宝箱页面
            UIManager_1.default.ShowUIPanel("Fail", false);
        });
    }
    suanJinDu() {
        UIManager_1.default.gameUI.jinDu.width = 200 * GameManager_1.default.curScene.getChildByName("PlayerStart").getComponent(Laya.Animator).getCurrentAnimatorPlayState()._normalizedTime;
        /*
        //已经到达就不在增加
        if (this.xingZouBaiFenBi >= 1) {
            return;
        }

        ////jinDu
        var ZouGuoDe = Laya.Vector3.distance(this.qiDian, this.pathTrans.position);

        //计算行走百分比
        this.xingZouBaiFenBi = ZouGuoDe / this.ZongJuLi;

        //视图显示
        UIManager.gameUI.shuaXinJinDu(this.xingZouBaiFenBi);
*/
    }
}
exports.default = PlayerControl;
