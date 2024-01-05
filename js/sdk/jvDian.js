
import GameManager from "./GameManager";
import ziDan from "./ziDan";
import jiao from "./jiao";
export default class jvDian extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {

        //敌人集合
        this.diRenJiHe = GameManager.curScene.getChildByName("diRenJiHe");

        this.zhenYing = 0;//阵营 我方
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



        //炮台判断
        if (this.wt.name == "jiQiang_paoTai") {



        } else {
            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuHong").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuHong").meshRenderer.material;
        }



        //死亡消失时间
        this.gouDaiXiaoShiTime = 10;


        this.sheSu1 = 0;  //射速

        if (this.wt.name.indexOf("shouQiang") != -1) {

            this.leiXing = 1;

            this.gongJiFanWei = 8;//攻击范围

            this.sheSu2 = 30;  //射速

            this.huaNDanShiJian = 10;  //换弹时间
            this.shengYuHuanDanShiJian = 10;  //剩余换弹时间

            this.ziDanRongLiang = 7; //弹夹容量
            this.danQianZiDan = 7; //当前子弹

            this.gongJiLi = 3;  //攻击力

            this.xueLiang = 50;//血量

            this.dangQianXueLiang = 50;  //当前血量

            this.kaiHuoYinXiao = "shouqiang";//开火音效
        }
        else if (this.wt.name.indexOf("chongFeng") != -1) {
            this.leiXing = 2;


            this.gongJiFanWei = 8;//攻击范围

            this.sheSu2 = 6;  //射速

            this.huaNDanShiJian = 120;  //换弹时间
            this.shengYuHuanDanShiJian = 120;  //剩余换弹时间

            this.ziDanRongLiang = 6; //弹夹容量
            this.danQianZiDan = 6; //当前子弹

            this.gongJiLi = 5;  //攻击力

            this.xueLiang = 70;//血量

            this.dangQianXueLiang = 70;  //当前血量

            this.kaiHuoYinXiao = "buQiang";//开火音效

        } else if (this.wt.name.indexOf("buQiang_Bing") != -1) {
            this.leiXing = 3;

            this.gongJiFanWei = 10;//攻击范围

            this.sheSu2 = 25;  //射速

            this.huaNDanShiJian = 10;  //换弹时间
            this.shengYuHuanDanShiJian = 10;  //剩余换弹时间

            this.ziDanRongLiang = 3; //弹夹容量
            this.danQianZiDan = 3; //当前子弹

            this.gongJiLi = 7;  //攻击力

            this.xueLiang = 80;//血量

            this.dangQianXueLiang = 80;  //当前血量

            this.kaiHuoYinXiao = "buQiang";//开火音效


        } else if (this.wt.name.indexOf("jiQiang_paoTai") != -1) {//机枪炮台
            this.leiXing = 10;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["sheSu"]) * 2;  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiLi"]); //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "buQiang";//开火音效


        }

        //刷新血量显示
        this.shuaXinXueLiangXianShi();

        this.daiJiFang();
        this.state = "daiJi";

    }
    onDisable() {

    }


    daiJiFang() {

        this.state = "daiJi";
        //炮台判断
        if (this.wt.name == "jiQiang_paoTai") {
            this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_daiji", 0, 0);

        } else {


            if (this.leiXing == 1) {
                this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang_DaiJi", 0, 0);
            }
        }
    }

    gongJiFun() {
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
        GameManager.PlaySound("gouDai1");

        this.state = "gouDai";

        if (this.wt != null) {

            if (this.wt.name == "jiQiang_paoTai") {

                //   this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_sheji", 0, 0);

                //炮台爆炸
                GameManager.PlaySound("baoZha1");
                //爆炸特效
                var bz = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("fx_hongzha"), GameManager.curScene);
                bz.transform.position = this.wt.transform.position;

            } else {
                this.wt.getComponent(Laya.Animator).play("juese_Skin_Siwang4", 0, 0);

            }

        }

        //隐藏血条
        this.xueTiaoObj.active = false;
        this.owner.getChildByName("xueTiaoFa").active = false;
        //  this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, -100, this.owner.transform.position.z);
    }


    gouDaiTouFun() {

        this.state = "gouDaiTou";


        //随机生成炮台
        var jvDianObj = GameManager.curScene.getChildByName("jvDian");

        var shuLiang = 0;
        for (var i = 0; i < jvDianObj.getChildByName("banZiJiHe").numChildren; i++) {
            if (jvDianObj.getChildByName("banZiJiHe").getChildAt(i).getChildByName("wuTi").numChildren > 0) {

                shuLiang = shuLiang + 1;
            }
        }
        if (shuLiang <= 1) {

            GameManager.curPlayerControl.shiBaiChuLiFun();//失败处理
        }




        //移除炮台
        if (this.wt != null) {
            this.wt.destroy();
            this.wt = null;
        }


    }


    //受击
    shouJi(shuZhi) {
        if (this.wt.name == "jiQiang_paoTai") {
            this.wt.getChildAt(0).meshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = 3;
        } else {
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

        this.xueTiaoObj.transform.setWorldLossyScale(new Laya.Vector3(2.5 * xueLiangBaiFenBi, xueTiaoSuoFang.y, xueTiaoSuoFang.z));

    }

    onUpdate() {

        if (this.wt == null) {

        } else {
            if (this.wt.name == "jiQiang_paoTai") {
                if (this.wt != null && this.wt.getChildAt(0).meshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                }
            } else {
                if (this.wt != null && this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity - 0.1;
                }
            }
        }



        if (this.state == "daiJi") {

            //检测周围敌人
            for (var i = 0; i < this.diRenJiHe.numChildren; i++) {

                for (var p = 0; p < this.diRenJiHe.getChildAt(i).numChildren; p++) {

                    var wt = this.diRenJiHe.getChildAt(i).getChildAt(p).getChildByName("wuTi");
                    if (wt.numChildren == 0) {//木板上没东西就跳过
                        continue;
                    }

                    var jvLi = Laya.Vector3.distance(wt.getChildAt(0).transform.position, this.wt.transform.position);
                    if (jvLi < this.gongJiFanWei) {

                        this.gongJiFun();
                        this.gongJimuBiao = wt.parent;
                        return;
                    }
                }




            }

        }

        else if (this.state == "gongJi") {

            if (this.gongJimuBiao == null || this.gongJimuBiao.getComponent(jiao).state == "gouDai" || this.gongJimuBiao.getComponent(jiao).state == "gouDaiTou") {


                this.daiJiFang();
                return;
            }

            var jvLi = Laya.Vector3.distance(this.gongJimuBiao.transform.position, this.wt.transform.position);

            if (this.gongJimuBiao == null || jvLi > this.gongJiFanWei) {

                this.daiJiFang();
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

                        if (this.wt.name == "jiQiang_paoTai") {

                            this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_sheji", 0, 0);


                        } else {
                            if (this.leiXing == 1) {
                                this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang", 0, 0);
                            }
                        }


                        var ziDanObj = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("ziDan1"), GameManager.curScene);
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


        //碰到辣椒
        if (oname.indexOf("ziDan") != -1) {


            if (obj.getComponent(ziDan).zhuRen.zhenYing == 1) {

                if (this.wt == null || this.state == "gouDai" || this.state == "gouDaiTou" || GameManager.curPlayerControl.state == "shiBai") {



                } else {
                    obj.name = "xxx";
                    obj.active = false;

                    this.shouJi(obj.getComponent(ziDan).zhuRen.gongJiLi);
                }



            }



        }


    }




}