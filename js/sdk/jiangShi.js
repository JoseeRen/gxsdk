
import GameManager from "./GameManager";
import jiao from "./jiao";
export default class jiangShi extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {




        //取消重力
        this.owner.getComponent(Laya.Rigidbody3D).gravity = new Laya.Vector3(0, 0, 0);

        //设置空气摩擦力
        this.owner.getComponent(Laya.Rigidbody3D).linearDamping = 0.1;
        this.owner.getComponent(Laya.Rigidbody3D).angularDamping = 0.1;
        this.owner.getComponent(Laya.Rigidbody3D).mass = 10;


        //冲向玩家
        this.jinGongWanJiaFun();



    }

    onStart() {



    }

    onDisable() {

    }

    daiJiFun() {
        this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, 0);

        this.state = "daiJi";

    }


    jinGongJvDianFun() {

        //据点
        this.jvDian = GameManager.curScene.getChildByName("jvDian");

        this.jinGongSuDu = 1;


        this.state = "jinGongJvDian";


    }
    jinGongWanJiaFun() {
        alert("123");
        //玩家
        this.wanJia = GameManager.curPlayerControl.owner;
        this.jinGongSuDu = 2;

        this.state = "jinGongWanJia";
    }
    //闲游
    xianYouFun() {

        //闲游方向修改时间
        this.xianYouFangXiangXiuGai1 = 0;
        this.xianYouFangXiangXiuGai2 = 120;


        this.xianYouSuDu = 1;
        this.suiJiFangXiang = GameManager.RandomInt(1, 4);
        this.state = "xianYou";


    }

    //巡逻
    xunLuoFun(dian1, dian2) {

        this.xunLuoSuDu = 1;

        //巡逻地点1
        this.xunLuoDiDian1 = dian1;
        //巡逻地点2
        this.xunLuoDiDian2 = dian2;

        //巡逻目标点
        //   if (this.xunLuoMuBiaoDian == null) {
        //       this.xunLuoMuBiaoDian = this.xunLuoDiDian1;
        //   }

        //更改寻路目标
        if (this.xunLuoMuBiaoDian == this.xunLuoDiDian1) {
            this.xunLuoMuBiaoDian = this.xunLuoDiDian2;
        } else if (this.xunLuoMuBiaoDian == this.xunLuoDiDian2) {
            this.xunLuoMuBiaoDian = this.xunLuoDiDian1;
        } else {
            this.xunLuoMuBiaoDian = this.xunLuoDiDian1;

        }

        //告诉下面的板子巡逻
        for (var i = 0; i < this.owner.numChildren; i++) {

            var wt = this.owner.getChildAt(i).getComponent(jiao).wt;
            wt.transform.lookAt(this.xunLuoMuBiaoDian.transform.position, new Laya.Vector3(0, 1, 0), false);
            wt.transform.rotationEuler = new Laya.Vector3(wt.transform.rotationEuler.x, wt.transform.rotationEuler.y + 180, wt.transform.rotationEuler.z)

            this.owner.getChildAt(i).getComponent(jiao).xunLuoFun();
        }


        this.state = "xunLuo";


    }
    //巡逻待机
    xunLuoDaiJiFun() {

        this.xunLuoDaiJitime = 100;
        //告诉下面的板子待机
        for (var i = 0; i < this.owner.numChildren; i++) {
            this.owner.getChildAt(i).getComponent(jiao).daiJiFang();
        }

        this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, 0);


        this.state = "xunLuoDaiJi";

    }
    xiFuFun() {

        this.owner.getComponent(Laya.Rigidbody3D).isKinematic = true;//开启运动学
        //  console.log(this.owner.getComponent(Laya.Rigidbody3D).canCollideWith);
        this.owner.getComponent(Laya.Rigidbody3D).destroy();


        this.state = "xiFu";

    }

    //消失
    xiaoShi() {

        this.owner.destroy();//该敌认移除

    }


    //板子上物体是否狗带完
    gouDaiWanPanDuan() {

        for (var i = 0; i < this.owner.numChildren; i++) {
            if (this.owner.getChildAt(i).getChildByName("wuTi").numChildren > 0) {
                return false;
            }

        }

        return true;
    }


    onUpdate() {


        this.AutoMove();
    }


    AutoMove() {

        if (this.state == "daiJi") {

            this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, 0);


        }


        //进攻据点
        else if (this.state == "jinGongJvDian") {

            if (this.owner.transform.position.x > this.jvDian.transform.position.x) {
                if (this.owner.transform.position.z > this.jvDian.transform.position.z) {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.jinGongSuDu, 0, -this.jinGongSuDu);
                } else {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.jinGongSuDu, 0, this.jinGongSuDu);
                }
            } else {
                if (this.owner.transform.position.z > this.jvDian.transform.position.z) {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(this.jinGongSuDu, 0, -this.jinGongSuDu);
                } else {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(this.jinGongSuDu, 0, this.jinGongSuDu);
                }
            }
        }

        //进攻玩家
        else if (this.state == "jinGongWanJia") {

            if (this.owner.transform.position.x > this.wanJia.transform.position.x) {
                if (this.owner.transform.position.z > this.wanJia.transform.position.z) {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.jinGongSuDu, 0, -this.jinGongSuDu);
                } else {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.jinGongSuDu, 0, this.jinGongSuDu);
                }
            } else {
                if (this.owner.transform.position.z > this.wanJia.transform.position.z) {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(this.jinGongSuDu, 0, -this.jinGongSuDu);
                } else {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(this.jinGongSuDu, 0, this.jinGongSuDu);
                }
            }
        }

        //闲游
        else if (this.state == "xianYou") {
            this.xianYouFangXiangXiuGai1 = this.xianYouFangXiangXiuGai1 + 1;
            if (this.xianYouFangXiangXiuGai1 >= this.xianYouFangXiangXiuGai2) {
                this.xianYouFun();
            }

            if (this.suiJiFangXiang == 1) {
                this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, this.xianYouSuDu);

            } else if (this.suiJiFangXiang == 2) {
                this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(0, 0, -this.xianYouSuDu);
            } else if (this.suiJiFangXiang == 3) {
                this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(this.xianYouSuDu, 0, 0);
            } else if (this.suiJiFangXiang == 4) {
                this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.xianYouSuDu, 0, 0);
            }

        }

        else if (this.state == "xunLuoDaiJi") {
            this.xunLuoDaiJitime = this.xunLuoDaiJitime - 1;

            if (this.xunLuoDaiJitime == 0) {

                this.xunLuoFun(this.xunLuoDiDian1, this.xunLuoDiDian2);

            }

        }
        //巡逻
        else if (this.state == "xunLuo") {


            if (this.owner.transform.position.x > this.xunLuoMuBiaoDian.transform.position.x) {
                if (this.owner.transform.position.z > this.xunLuoMuBiaoDian.transform.position.z) {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.xunLuoSuDu, 0, -this.xunLuoSuDu);
                } else {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(-this.xunLuoSuDu, 0, this.xunLuoSuDu);
                }
            } else {
                if (this.owner.transform.position.z > this.xunLuoMuBiaoDian.transform.position.z) {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(this.xunLuoSuDu, 0, -this.xunLuoSuDu);
                } else {
                    this.owner.getComponent(Laya.Rigidbody3D).linearVelocity = new Laya.Vector3(this.xunLuoSuDu, 0, this.xunLuoSuDu);
                }
            }



            var jvLi = Laya.Vector3.distance(this.owner.transform.position, this.xunLuoMuBiaoDian.transform.position);
            // console.log(jvLi);
            if (jvLi <= 0.01) {

                //巡逻待机
                this.xunLuoDaiJiFun();


            }
        }

        else if (this.state == "xiFu") {

            var targetRota = GameManager.curPlayerControl.owner.transform.position;
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(this.owner.transform.position, targetRota, 0.35, targetRotaLerp);
            this.owner.transform.position = targetRotaLerp;


            var jvLi = Laya.Vector3.distance(this.owner.transform.position, GameManager.curPlayerControl.owner.transform.position);

            if (jvLi <= 0.3) {
                GameManager.PlaySound("heCheng2");

                //玩家生成新的地块儿
                for (var i = 0; i < this.owner.numChildren; i++) {
                    GameManager.curPlayerControl.addbanZiFun(0);
                }

                //海岛模式处理  组敌人狗带完 是胜利还是开门
                if (GameManager.curLevelManager.moShi == "haiDaoZhengBa") {
                    //当前关卡敌人地块儿<=0
                    if (GameManager.curLevelManager.dikuaiErZongShu <= 0) {
                        //当前关卡地块儿数量为0

                        if (GameManager.curLevelManager.banZiLeiXingArray.length - 1 == GameManager.curLevelManager.dangQianGuanQia) {

                            //玩家胜利触发
                            GameManager.curPlayerControl.shengLiChuLiFun();

                        } else {
                            //玩家执行开门
                            GameManager.curPlayerControl.kaiMenFun();

                        }
                    } else {


                    }


                }

                //坚守据点模式
                if (GameManager.curLevelManager.moShi == "jvDianZhanLing" || GameManager.curLevelManager.moShi == "xiaoDaoZuiHou") {
                    //判断敌人是否都消灭了
                    GameManager.curLevelManager.jiBaiDeDiRenShuLiang = GameManager.curLevelManager.jiBaiDeDiRenShuLiang + 1;
                    if (GameManager.curLevelManager.jiBaiDeDiRenShuLiang == GameManager.curLevelManager.diRenZongShu) {
                        //玩家胜利触发
                        GameManager.curPlayerControl.shengLiChuLiFun();

                    }


                }

                this.owner.destroy();//该敌认移除
            }

        }
        else if (this.state == "guiWei") {

            var targetRota = this.weiZhi.transform.position;
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.lerp(this.owner.transform.position, targetRota, 0.35, targetRotaLerp);
            this.owner.transform.position = targetRotaLerp;

            this.owner.transform.rotation = GameManager.curScene.getChildByName("WalkMobs2").transform.rotation;
        }



        else if (this.state == "run") {

            // 玩家生成点向前移动
            // this.pathTrans.position = new Laya.Vector3(this.playerTrans.position.x, this.playerTrans.position.y, this.playerTrans.position.z + 0.2);


            //玩家位置以及角度跟随玩家生成点
            this.playerTrans.position = this.pathTrans.position.clone();
            this.playerTrans.rotation = this.pathTrans.rotation.clone();


            //左右行走判断
            if (this.isMouseDown) {
                var offsetX = Laya.stage.mouseX - this.lastMouseX;

                this.curPosX -= offsetX * 0.037; //控制左右移动速度
                this.curPosX = this.Clamp(this.curPosX, -2.0, 2.0);

                this.curRotaY -= offsetX * 0.3;
                this.curRotaY = this.Clamp(this.curRotaY, -50, 50);

                this.lastMouseX = Laya.stage.mouseX;
                this.lastMouseY = Laya.stage.mouseY;

                //  this.moveTrans.localRotationEulerY = this.curRotaY;
                this.curRotaY += (0 - this.curRotaY) * 0.1;
            }
            else {
                this.moveTrans.localRotationEulerY += (0 - this.moveTrans.localRotationEulerY) * 0.1;
            }

            var targetRota = new Laya.Vector3(this.curPosX, 0, 0);
            var targetRotaLerp = new Laya.Vector3(0, 0, 0);
            var currentRota = new Laya.Vector3(this.moveTrans.localPositionX, 0, 0);
            Laya.Vector3.lerp(currentRota, targetRota, 0.15, targetRotaLerp);
            this.moveTrans.localPositionX = targetRotaLerp.x;


            //相机跟随玩家
            GameManager.cameraTrans.position = this.moveTrans.position.clone();
            GameManager.cameraTrans.rotation = this.pathTrans.rotation.clone();

            if (this.bianDaKg == true) {
                this.owner.transform.setWorldLossyScale(new Laya.Vector3(this.owner.transform.getWorldLossyScale().x + 0.01, this.owner.transform.getWorldLossyScale().y + 0.01, this.owner.transform.getWorldLossyScale().z + 0.01));
            }

            if (this.suoXiaoKg == true) {
                this.owner.transform.setWorldLossyScale(new Laya.Vector3(this.owner.transform.getWorldLossyScale().x - 0.01, this.owner.transform.getWorldLossyScale().y - 0.01, this.owner.transform.getWorldLossyScale().z - 0.01));
            }
        }


    }





    onTriggerEnter(other) {
        var oname = other.owner.name;
        var obj = other.owner;


        //碰到辣椒
        if (oname.indexOf("HotItem1") != -1) {
            obj.name = "xxx";
            obj.active = false;


            this.bianShenJiShu = this.bianShenJiShu - 1;

            if (this.bianShenJiShu <= 0) {
                this.bianShenJiShu = 7;

                if (this.dangQianyf != 0) {

                    //切换衣服
                    this.dangQianyf = this.dangQianyf - 1;
                    this.yiFuQieHuanFun(this.dangQianyf);

                    //增加痴汉
                    if (this.dangQianyf < 2) {
                        this.addChiHan();
                    }
                } else {


                }

                //转圈动作
                this.playerAnima.play("Zhuan", 0, 0); //人物奔跑动画

                Laya.timer.frameOnce(20, this, function () {
                    this.playerAnima.play("Walk", 0, 0); //人物奔跑动画
                })

            }


        }


    }





}