
import GameManager from "./GameManager";
import NpcControl from "./NpcControl";
import ziDan from "./ziDan";
import CwControl from "./CwControl";
import jvDian from "./jvDian";
export default class jiao extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {
        if (GameManager.curLevelManager.moShi == "jvDianZhanLing2") {

            if (this.owner.parent.suoShuDaoYu == 100) {


            } else { //岛屿上的士兵
                //进攻据点模式就 隐藏脚底下的显示
                this.owner.getChildAt(0).meshRenderer.enable = false;
                this.owner.getChildAt(2).active = false;
            }
        }



        //玩家板子集合
        this.diRenJiHe = GameManager.curPlayerControl.owner.getChildByName("banZiJiHe");

        //我方集合
        this.woFangJiHe = GameManager.curScene.getChildByName("diRenJiHe");

        //如果是守护据点模式
        if (GameManager.curLevelManager.moShi == "jvDianZhanLing") {
            //获取据点
            this.jvDianObj = GameManager.curScene.getChildByName("jvDian");

        }

        this.zhenYing = 1;//阵营 敌方
        this.xueTiaoObj = this.owner.getChildByName("xueTiao");//血条对象



        //动态生成


        this.wt = null;



        //板子上没有物体
        if (this.owner.getChildByName("wuTi").numChildren == 0) {

            this.xueTiaoObj.active = false;
            this.owner.getChildByName("xueTiaoFa").active = false;

            return;
        }
        this.wt = this.owner.getChildByName("wuTi").getChildAt(0);//板子上的物体








        //死亡消失时间
        this.gouDaiXiaoShiTime = 60;


        this.sheSu1 = 0;  //射速

        if (this.wt.name.indexOf("shouQiang") != -1) {

            this.leiXing = 1;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["shouQiangBingShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["shouQiangBingShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["shouQiangBingShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["shouQiangBingShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["shouQiangBingShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["shouQiangBingShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "shouqiang";//开火音效
        }
        else if (this.wt.name.indexOf("chongFeng") != -1) {
            this.leiXing = 2;


            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["tuJiDuiYuanShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["tuJiDuiYuanShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["tuJiDuiYuanShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["tuJiDuiYuanShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["tuJiDuiYuanShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["tuJiDuiYuanShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量


            this.kaiHuoYinXiao = "buQiang";//开火音效

        } else if (this.wt.name.indexOf("buQiang_Bing") != -1) {
            this.leiXing = 3;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["buBingShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["buBingShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["buBingShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["buBingShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["buBingShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["buBingShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "buQiang";//开火音效

        } else if (this.wt.name.indexOf("jiQiang_paoTai") != -1) {//机枪炮台
            this.leiXing = 10;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["sheSu"]) * 2;  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiLi"]) / 2;  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jiQiang";//开火音效

        } else if (this.wt.name.indexOf("jiangshi01") != -1) {//普通僵尸

            this.leiXing = 31;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["puTongJiangShiShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["puTongJiangShiShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["puTongJiangShiShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["puTongJiangShiShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["puTongJiangShiShuJv"]["gongJiLi"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jieDuanTiShengGongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["puTongJiangShiShuJv"]["xueLiang"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jeiDuanTiShengXueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jiangShiGongJi";//开火音效

        } else if (this.wt.name.indexOf("bianFu1") != -1) {//普通蝙蝠

            this.leiXing = 32;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["gongJiLi"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jieDuanTiShengGongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["xueLiang"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jeiDuanTiShengXueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jiangShiGongJi";//开火音效

        }
        else if (this.wt.name.indexOf("shiTouRen") != -1) {//石头人

            this.leiXing = 33;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["shiTouRenShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["shiTouRenShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["shiTouRenShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["shiTouRenShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["shiTouRenShuJv"]["gongJiLi"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jieDuanTiShengGongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["shiTouRenShuJv"]["xueLiang"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jeiDuanTiShengXueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jiangShiGongJi";//开火音效

        }
        else if (this.wt.name.indexOf("bianFuBoss") != -1) {//蝙蝠Boss

            this.leiXing = 34;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["gongJiFenWei"]) * 2;//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["gongJiLi"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jieDuanTiShengGongJiLi"]);  //攻击力
            this.gongJiLi = this.gongJiLi * 3;

            this.xueLiang = parseInt(GameManager.jsonShuJv["puTongBianFuShuJv"]["xueLiang"]) + GameManager.curLevelManager.dangQianJieDuan * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["jeiDuanTiShengXueLiang"]);//血量
            this.xueLiang = this.xueLiang * 0.2;
            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jiangShiGongJi";//开火音效


        }


        //根据难度等级增加血量和攻击力
        var tiShengDeXue = GameManager.curLevelManager.nanDuDengJi * parseInt(GameManager.jsonShuJv["nanDuDengJiShuJv"]["meiYiJiTiShengXueLiang"]);//攻击范围
        this.xueLiang = this.xueLiang + tiShengDeXue;//血量
        this.dangQianXueLiang = this.xueLiang;  //当前血量

        var tiShengGongJi = GameManager.curLevelManager.nanDuDengJi * parseInt(GameManager.jsonShuJv["nanDuDengJiShuJv"]["meiYiJiTiShengGongJiLi"]);
        this.gongJiLi = this.gongJiLi + tiShengGongJi;


        //颜色判断
        if (this.leiXing == 31) {

        } else if (this.leiXing == 32) {

        }
        else if (this.leiXing == 33) {

        }
        else if (this.leiXing == 34) {


        } else if (this.leiXing == 10) {
            this.wt.getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiH").meshRenderer.material;
            this.wt.getChildAt(0).getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiH").meshRenderer.material;
            this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiH").meshRenderer.material;

        } else {

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuHong").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuHong").meshRenderer.material;
        }

        //刷新血量显示
        this.shuaXinXueLiangXianShi();

        this.daiJiFang();
        // this.state = "daiJi";

        //据点占领2模式
        //  if (GameManager.curLevelManager.moShi == "jvDianZhanLing2") {

        //   this.xunLuoFun();//巡逻方法

        // }



    }
    onStart() {


    }
    onDisable() {

    }


    daiJiFang() {

        if (this.wt == null || this.state == "gouDai" || this.state == "gouDaiTou" || GameManager.curPlayerControl.state == "shiBai") {
            return;
        }
        this.state = "daiJi";



        //待机动作
        if (this.kaiHuoYinXiao == "shouqiang") {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang_DaiJi", 0, 0);
        } else if (this.kaiHuoYinXiao == "buQiang") {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_235_DaiJi", 0, 0);
        } else if (this.kaiHuoYinXiao == "jiQiang") {

            if (this.leiXing == 10) {
                this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_daiji", 0, 0);
            } else {
                this.wt.getComponent(Laya.Animator).play("juese_Skin_4JiQiang_DaiJi", 0, 0);
            }

        } else if (this.kaiHuoYinXiao == "penHuo") {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_67_DaiJi", 0, 0);
            this.wt.getChildByName("FX_shanxinghuoyan").active = false; //隐藏火焰
        } else if (this.kaiHuoYinXiao == "jvJi") {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_235_DaiJi", 0, 0);
        } else if (this.kaiHuoYinXiao == "liuDan") {

            //    if (this.leiXing > 15) {
            //        this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_daiji", 0, 0);

            //    } else {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_67_DaiJi", 0, 0);
            //  }
        }






    }


    xunLuoFun() {

        if (this.wt == null || this.state == "gouDai" || this.state == "gouDaiTou" || GameManager.curPlayerControl.state == "shiBai") {
            return;
        }

        this.state = "xunLuo";

        this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang_Run", 0, 0);

    }

    gongJiFun() {

        if (this.wt == null || this.state == "gouDai" || this.state == "gouDaiTou" || GameManager.curPlayerControl.state == "shiBai") {
            return;
        }


        this.state = "gongJi";

        //炮台判断
        if (this.wt.name == "jiQiang_paoTai") {

        } else {
            if (this.leiXing == 1) {
                this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang_DaiJi", 0, 0);
            }
        }
    }

    gouDaiFun() {

        this.state = "gouDai";

        if (this.wt != null) {

            if (this.leiXing == 31) {
                this.wt.getComponent(Laya.Animator).play("jiangshi_siwang", 0, 0);
                GameManager.PlaySound("jiangShiGongJi");
            } else if (this.leiXing == 32) {
                this.wt.getComponent(Laya.Animator).play("Die", 0, 0);
                GameManager.PlaySound("bianFuGouDai");
            } else if (this.leiXing == 33) {
                this.wt.getComponent(Laya.Animator).play("Die", 0, 0);
                GameManager.PlaySound("jiangShiGongJi");
            }
            else if (this.leiXing == 34) {
                this.wt.getComponent(Laya.Animator).play("Die", 0, 0);
                GameManager.PlaySound("jiangShiGongJi");
            } else if (this.leiXing == 10) {

                //炮台爆炸
                GameManager.PlaySound("baoZha1");
                //爆炸特效
                var bz = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("fx_hongzha"), GameManager.curScene);
                bz.transform.position = this.wt.transform.position;

            }
            else {
                GameManager.PlaySound("gouDai1");
                this.wt.getComponent(Laya.Animator).play("juese_Skin_Siwang4", 0, 0);
            }

        }

        //隐藏血条
        this.xueTiaoObj.active = false;
        this.owner.getChildByName("xueTiaoFa").active = false;
        //  this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, -100, this.owner.transform.position.z);

        if (this.wt.name == "bianFuBoss") {

            for (var i = 0; i < this.wt.getChildByName("zhouWei").numChildren; i++) {
                GameManager.curLevelManager.shengChengGuaiWu(2, new Laya.Vector3(this.wt.getChildByName("zhouWei").getChildAt(i).transform.position.x, 0, this.wt.getChildByName("zhouWei").getChildAt(i).transform.position.z));
            }

        }












    }


    gouDaiTouFun() {

        this.state = "gouDaiTou";

        //据点占领模式 狗带后岛屿其它敌人继续巡逻
        if (GameManager.curLevelManager.moShi == "jvDianZhanLing2") {

            var suoZaiDaoYu = this.owner.parent.getComponent(NpcControl).owner.suoShuDaoYu;
            //同岛屿其它敌人也开始巡逻
            for (var i = 0; i < this.woFangJiHe.numChildren; i++) {
                if (this.woFangJiHe.getChildAt(i).suoShuDaoYu == suoZaiDaoYu && this.woFangJiHe.getChildAt(i) != this.owner.parent) {

                    if (this.woFangJiHe.getChildAt(i).getChildAt(0).getComponent(jiao).state == "gouDaiTou" || this.woFangJiHe.getChildAt(i).getChildAt(0).getComponent(jiao).state == "gouDai") {


                    } else {
                        this.woFangJiHe.getChildAt(i).getComponent(NpcControl).xunLuoDaiJiFun();

                    }

                }
            }

        }


        if (this.wt != null) {
            this.wt.destroy();
            this.wt = null;
        }

        //遍历是否狗带完
        if (this.owner.parent.getComponent(NpcControl).gouDaiWanPanDuan() == true) {

            //笑到最后 作战先锋 模式 不吸附 直接消失
            if (GameManager.curLevelManager.moShi == "xiaoDaoZuiHou" || GameManager.curLevelManager.moShi == "zuoZhanXianFeng" || GameManager.curLevelManager.moShi == "jvDianZhanLing") {

                //据点占领
                if (GameManager.curLevelManager.moShi == "jvDianZhanLing") {
                    this.owner.parent.getComponent(NpcControl).xiFuFun();//守卫据点模式吸附

                } else {

                    this.owner.parent.getComponent(NpcControl).xiaoShi();
                }



                // console.log(GameManager.curLevelManager.jiBaiDeDiRenShuLiang);
                //判断敌人是否都消灭了
                GameManager.curLevelManager.jiBaiDeDiRenShuLiang = GameManager.curLevelManager.jiBaiDeDiRenShuLiang + 1;
                if (GameManager.curLevelManager.jiBaiDeDiRenShuLiang == GameManager.curLevelManager.diRenZongShu) {
                    //玩家胜利触发
                    GameManager.curPlayerControl.shengLiChuLiFun();
                }

            } else if (GameManager.curLevelManager.moShi == "jvDianZhanLing2") {

                if (this.owner.parent.getComponent(NpcControl).suoShuDaoYu == 100) {


                } else {

                    var suoShuDaoyu = this.owner.parent.getComponent(NpcControl).suoShuDaoYu;

                    //判断该岛屿是否都击败
                    var diRenJiHe = GameManager.curScene.getChildByName("diRenJiHe")
                    var jiShu = 0;
                    for (var i = 0; i < diRenJiHe.numChildren; i++) {
                        if (diRenJiHe.getChildAt(i).getComponent(NpcControl).suoShuDaoYu == suoShuDaoyu) {
                            jiShu = jiShu + 1;
                        }
                    }

                    if (jiShu == 1) {

                        //进入俘虏表演模式
                        GameManager.curPlayerControl.fuLuBiaoYanFun(suoShuDaoyu);

                    }

                }

                this.owner.parent.getComponent(NpcControl).xiaoShi();

            } else {
                this.owner.parent.getComponent(NpcControl).xiFuFun();//只有
            }
            GameManager.curLevelManager.dikuaiErZongShu = GameManager.curLevelManager.dikuaiErZongShu - 1;

            //console.log(GameManager.curLevelManager.dikuaiErZongShu)

        }

        //笑到最后模式 增加经验
        if (GameManager.curLevelManager.moShi == "xiaoDaoZuiHou" || GameManager.curLevelManager.moShi == "zuoZhanXianFeng") {

            GameManager.curLevelManager.addJingYan();
        }


    }


    //受击
    shouJi(shuZhi) {

        if (this.wt == null) {
            return;
        }


        if (this.leiXing == 31) {
            this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity = 3;
        } else if (this.leiXing == 32) {
            this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity = 3;
        } else if (this.leiXing == 33) {
            this.wt.getChildByName("Toon Rock Golem").skinnedMeshRenderer.material.albedoIntensity = 3;
        } else if (this.leiXing == 34) {
            this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity = 3;
        } else if (this.leiXing == 10) {

            this.wt.getChildAt(0).meshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = 3;

        }

        else {
            this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity = 3;
        }


        this.dangQianXueLiang = this.dangQianXueLiang - shuZhi;
        this.shuaXinXueLiangXianShi();

        if (this.dangQianXueLiang <= 0) {
            this.gouDaiFun();
        }
    }

    //刷新血条
    shuaXinXueLiangXianShi() {

        var xueLiangBaiFenBi = this.dangQianXueLiang / this.xueLiang;

        var xueTiaoSuoFang = this.xueTiaoObj.transform.getWorldLossyScale();


        if (this.leiXing > 30) {
            this.xueTiaoObj.transform.setWorldLossyScale(new Laya.Vector3(1.5 * xueLiangBaiFenBi, xueTiaoSuoFang.y, xueTiaoSuoFang.z));
        } else {
            this.xueTiaoObj.transform.setWorldLossyScale(new Laya.Vector3(2.5 * xueLiangBaiFenBi, xueTiaoSuoFang.y, xueTiaoSuoFang.z));

        }


    }

    onUpdate() {

        //击中闪烁恢复
        if (this.wt == null) {

        } else {

            if (this.leiXing == 31) {
                if (this.wt != null && this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity - 0.1;
                }

            } else if (this.leiXing == 32) {
                if (this.wt != null && this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity - 0.1;
                }
            } else if (this.leiXing == 33) {
                if (this.wt != null && this.wt.getChildByName("Toon Rock Golem").skinnedMeshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildByName("Toon Rock Golem").skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildByName("Toon Rock Golem").skinnedMeshRenderer.material.albedoIntensity - 0.1;
                }
            } else if (this.leiXing == 34) {
                if (this.wt != null && this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildByName("Toon Bat").skinnedMeshRenderer.material.albedoIntensity - 0.1;
                }
            } else if (this.leiXing == 10) {

                if (this.wt != null && this.wt.getChildAt(0).meshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                }

            }


            else {
                if (this.wt != null && this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity - 0.1;
                }
            }


        }




        if (this.state == "daiJi" || this.state == "xunLuo") {


            //console.log(this.leiXing);
            //僵尸 始终朝向玩家  行走
            if (this.leiXing > 30) {

                this.wt.transform.lookAt(GameManager.curPlayerControl.owner.transform.position, new Laya.Vector3(0, 1, 0), false);
                this.wt.transform.rotationEuler = new Laya.Vector3(this.wt.transform.rotationEuler.x, this.wt.transform.rotationEuler.y + 180, this.wt.transform.rotationEuler.z)
            }

            //检测周围敌人
            for (var i = 0; i < this.diRenJiHe.numChildren; i++) {

                var wt = this.diRenJiHe.getChildAt(i).getChildByName("wuTi")

                if (wt.numChildren > 0) {

                    var jvLi = Laya.Vector3.distance(wt.transform.position, this.wt.transform.position);

                    if (jvLi < this.gongJiFanWei) {

                        //判断是否为 据点占领模式2 是的话让上一级代码 进入待机状态(不动)
                        if (GameManager.curLevelManager.moShi == "jvDianZhanLing2") {
                            this.owner.parent.getComponent(NpcControl).daiJiFun();

                            var suoZaiDaoYu = this.owner.parent.getComponent(NpcControl).owner.suoShuDaoYu;
                            //同岛屿其它敌人奔向玩家
                            for (var i = 0; i < this.woFangJiHe.numChildren; i++) {
                                if (this.woFangJiHe.getChildAt(i).suoShuDaoYu == suoZaiDaoYu && this.woFangJiHe.getChildAt(i) != this.owner.parent) {
                                    this.woFangJiHe.getChildAt(i).getComponent(NpcControl).jinGongWanJiaFun();
                                }
                            }

                        }

                        //console.log(jvLi);
                        this.gongJiFun();
                        this.gongJimuBiao = wt.parent;
                        return;
                    }

                }

            }

            //守护据点模式  额外攻击目标搜索
            if (GameManager.curLevelManager.moShi == "jvDianZhanLing") {

                for (var p = 0; p < this.jvDianObj.getChildByName("banZiJiHe").numChildren; p++) {

                    var wt = this.jvDianObj.getChildByName("banZiJiHe").getChildAt(p).getChildByName("wuTi")

                    if (wt.numChildren > 0) {

                        var jvLi = Laya.Vector3.distance(wt.transform.position, this.wt.transform.position);

                        if (jvLi < this.gongJiFanWei) {
                            //console.log(jvLi);
                            this.gongJiFun();
                            this.gongJimuBiao = wt.parent;
                            return;
                        }

                    }

                }

            }



        }


        else if (this.state == "xunLuo") {




        }
        else if (this.state == "gongJi") {

            //没有了目标就待机
            if (this.gongJimuBiao.getChildByName("wuTi").numChildren == 0) {
                this.daiJiFang();
                return;
            }
            if (this.gongJimuBiao.getChildByName("wuTi").getChildAt(0).name == "jiQiang_paoTai") {


                if (GameManager.curLevelManager.moShi == "zuoZhanXianFeng") {
                    if (this.gongJimuBiao == null || this.gongJimuBiao.getComponent(CwControl).state == "gouDai" || this.gongJimuBiao.getComponent(CwControl).state == "gouDaiTou") {

                        this.daiJiFang();
                        return;
                    }

                } else {
                    if (this.gongJimuBiao == null || this.gongJimuBiao.getComponent(jvDian).state == "gouDai" || this.gongJimuBiao.getComponent(jvDian).state == "gouDaiTou") {

                        this.daiJiFang();
                        return;
                    }
                }


            } else {
                if (this.gongJimuBiao == null || this.gongJimuBiao.getComponent(CwControl).state == "gouDai" || this.gongJimuBiao.getComponent(CwControl).state == "gouDaiTou") {

                    this.daiJiFang();
                    return;
                }
            }



            var jvLi = Laya.Vector3.distance(this.gongJimuBiao.transform.position, this.wt.transform.position);

            if (this.gongJimuBiao == null || jvLi > this.gongJiFanWei) {

                this.daiJiFang();

                //判断是否为 据点占领模式2 是的话 父级代码进入巡逻待机状态  岛屿上的才这么做
                if (GameManager.curLevelManager.moShi == "jvDianZhanLing2") {

                    if (this.owner.parent.getComponent(NpcControl).suoShuDaoYu == 100) {

                    } else {
                        this.owner.parent.getComponent(NpcControl).xunLuoDaiJiFun();

                        var suoZaiDaoYu = this.owner.parent.getComponent(NpcControl).owner.suoShuDaoYu;
                        //同岛屿其它敌人也开始巡逻
                        for (var i = 0; i < this.woFangJiHe.numChildren; i++) {
                            if (this.woFangJiHe.getChildAt(i).suoShuDaoYu == suoZaiDaoYu && this.woFangJiHe.getChildAt(i) != this.owner.parent) {
                                this.woFangJiHe.getChildAt(i).getComponent(NpcControl).xunLuoDaiJiFun();
                            }
                        }
                    }

                }

            } else {

                this.wt.transform.lookAt(this.gongJimuBiao.transform.position, new Laya.Vector3(0, 1, 0), false);
                this.wt.transform.rotationEuler = new Laya.Vector3(this.wt.transform.rotationEuler.x, this.wt.transform.rotationEuler.y + 180, this.wt.transform.rotationEuler.z)

                //判断是否还有子弹
                if (this.danQianZiDan <= 0) {
                    //没有子弹

                    //换弹中
                    this.shengYuHuanDanShiJian = this.shengYuHuanDanShiJian - 1;
                    if (this.shengYuHuanDanShiJian <= 0) {

                        //换弹完毕
                        this.shengYuHuanDanShiJian = this.huaNDanShiJian;//重置剩余子弹
                        this.danQianZiDan = this.ziDanRongLiang;//重置当前子弹
                    }

                } else {

                    this.sheSu1 = this.sheSu1 + 1;
                    if (this.sheSu1 >= this.sheSu2) {
                        this.sheSu1 = 0;



                        if (this.leiXing == 1) {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang", 0, 0);
                        } else if (this.leiXing == 2) {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_2BuBing", 0, 0);
                        } else if (this.leiXing == 3) {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_3BuBing", 0, 0);
                        } else if (this.leiXing == 4) {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_4JiQiang", 0, 0);
                        } else if (this.leiXing == 5) {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_6HuoYan", 0, 0);
                        } else if (this.leiXing == 6) {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_5JuJi", 0, 0);
                        } else if (this.leiXing == 7) {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_6HuoYan", 0, 0);
                        } else if (this.leiXing == 10) {
                            this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_sheji", 0, 0);
                        } else if (this.leiXing == 31) {
                            this.wt.getComponent(Laya.Animator).play("jiangshi_gongji", 0, 0);
                        } else if (this.leiXing == 32) {
                            this.wt.getComponent(Laya.Animator).play("Attack", 0, 0);
                        } else if (this.leiXing == 33) {
                            this.wt.getComponent(Laya.Animator).play("Attack", 0, 0);
                        } else if (this.leiXing == 34) {
                            this.wt.getComponent(Laya.Animator).play("Attack", 0, 0);
                        }



                        var ziDanObj = null;
                        if (this.wt.name == "jiangshi01") {
                            ziDanObj = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("ziDan4"), GameManager.curScene);
                        } else {
                            ziDanObj = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("ziDan1"), GameManager.curScene);
                        }

                        //  ziDanObj.transform.position = new Laya.Vector3(this.wt.transform.position.x, this.wt.transform.position.y + 0.5, this.wt.transform.position.z);
                        ziDanObj.transform.position = this.wt.getChildByName("ziDanDian").transform.position;

                        ziDanObj.transform.lookAt(this.gongJimuBiao.transform.position, new Laya.Vector3(0, 1, 0), false);
                        ziDanObj.transform.rotationEuler = new Laya.Vector3(ziDanObj.transform.rotationEuler.x, ziDanObj.transform.rotationEuler.y + 180, ziDanObj.transform.rotationEuler.z)


                        GameManager.PlaySound(this.kaiHuoYinXiao);//开火音效
                        this.danQianZiDan = this.danQianZiDan - 1;//当前子弹-1
                        var zanShi = new Laya.Vector3(0, 0, 0);
                        Laya.Vector3.subtract(this.gongJimuBiao.transform.position, this.wt.transform.position, zanShi)
                        var zanShi2 = new Laya.Vector3(0, 0, 0);
                        Laya.Vector3.normalize(zanShi, zanShi2);

                        ziDanObj.addComponent(ziDan).biaoLiang = zanShi2;
                        ziDanObj.getComponent(ziDan).zhuRen = this;
                    }

                }


            }

        }
        else if (this.state == "gouDai") {
            this.gouDaiXiaoShiTime = this.gouDaiXiaoShiTime - 1;
            if (this.gouDaiXiaoShiTime <= 0) {



                this.gouDaiTouFun();




            }

        }


    }


    onTriggerEnter(other) {
        var oname = other.owner.name;
        var obj = other.owner;


        //碰到脚印


        //碰到子弹
        if (oname.indexOf("ziDan") != -1) 
        {
            console.log("碰到子弹")
            if (obj.getComponent(ziDan).zhuRen.zhenYing == 0) 
            {

                if (this.wt == null || this.state == "gouDai" || this.state == "gouDaiTou" || GameManager.curPlayerControl.state == "shiBai") {
                } else {
                    obj.name = "xxx";
                    obj.active = false;

                    this.shouJi(obj.getComponent(ziDan).zhuRen.gongJiLi + GameManager.curLevelManager.buJiGongJiLi);

                    if (obj.getComponent(ziDan).zhuRen.leiXing == 7 || obj.getComponent(ziDan).zhuRen.leiXing == 17) {

                        var tx = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("FX_liudanbaozha"), GameManager.curScene);
                        tx.transform.position = obj.transform.position;

                        GameManager.PlaySound("baoZha1");

                        //周围的队友受击
                        for (var i = 0; i < this.woFangJiHe.numChildren; i++) {
                            for (var p = 0; p < this.woFangJiHe.getChildAt(i).numChildren; p++) {
                                var duiXiangObj = this.woFangJiHe.getChildAt(i).getChildAt(p);

                                if (duiXiangObj == this.owner) {//不算自己
                                    continue;
                                }

                                var jvLi = Laya.Vector3.distance(duiXiangObj.transform.position, this.owner.transform.position);
                                //  console.log(jvLi)
                                if (jvLi < 5) {
                                    duiXiangObj.getComponent(jiao).shouJi(obj.getComponent(ziDan).zhuRen.gongJiLi);
                                }

                            }
                        }
                        this.woFangJiHe

                    }
                }

            }
        }

        //碰到减速
        if (oname.indexOf("fx_xuanwo") != -1) {

            this.moRenShuDu = this.owner.parent.getComponent(NpcControl).jinGongSuDu;


            var shengYuBaiFenBi = 1 - GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["xuanWOJianSuBaiFenBi"] / 100;

            this.owner.parent.getComponent(NpcControl).jinGongSuDu = this.owner.parent.getComponent(NpcControl).jinGongSuDu * shengYuBaiFenBi;

        }


    }

    onTriggerExit(other) {
        var oname = other.owner.name;
        var obj = other.owner;
        //离开旋涡减速
        if (oname.indexOf("fx_xuanwo") != -1) {

            this.owner.parent.getComponent(NpcControl).jinGongSuDu = this.moRenShuDu;

        }
    }

    onTriggerStay(other) {
        var oname = other.owner.name;
        var obj = other.owner;

        //碰到辣椒
        if (oname.indexOf("huoYan") != -1) {

            var DiKuaiERDaiMa = obj.parent.parent.parent.parent.getComponent(CwControl);

            if (DiKuaiERDaiMa.zhenYing == 0) {

                if (this.wt == null || this.state == "gouDai" || this.state == "gouDaiTou" || GameManager.curPlayerControl.state == "shiBai") {


                } else {
                    // obj.name = "xxx";
                    //  obj.active = false;

                    //笑到最后模式 受击加上补给的攻击力
                    //  if (GameManager.curLevelManager.moShi == "xiaoDaoZuiHou") {

                    var gjl = 0;
                    if (DiKuaiERDaiMa.leiXing == 5) {
                        gjl = DiKuaiERDaiMa.gongJiLi + GameManager.curLevelManager.buJiGongJiLi / 10;
                    } else {
                        gjl = DiKuaiERDaiMa.gongJiLi + GameManager.curLevelManager.buJiGongJiLi;
                    }

                    //  console.log(gjl);
                    this.shouJi(gjl);

                    //   } else {
                    //      this.shouJi(DiKuaiERDaiMa.gongJiLi);
                    // }


                }

            }
            // console.log("asdasdds");


        }



    }
}