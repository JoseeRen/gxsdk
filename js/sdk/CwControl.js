
import GameManager from "./GameManager";
import PlayerData from "./PlayerData";
import UIManager from "./UIManager";
import ziDan from "./ziDan";
import jiao from "./jiao";
import youTong from "./youTong";
export default class CwControl extends Laya.Script3D {
    constructor() {
        super();
    }
    onEnable() {

        //敌人集合
        this.diRenJiHe = GameManager.curScene.getChildByName("diRenJiHe");


        this.gongJiFanWei = -10;

        this.zhenYing = 0;//阵营 我方

        this.xueTiaoObj = this.owner.getChildByName("xueTiao");//血条对象

        this.wt = null;

        //死亡消失时间
        this.gouDaiXiaoShiTime = 60;

        //隐藏状态
        this.gouDaiTouFun();

    }
    onDisable() {

    }



    //激活  0 空板子 1 手枪
    jiHuoFun(leiXing) {

        //出场动作
        this.owner.getChildAt(0).getComponent(Laya.Animator).play("FuKuai_ChuSheng", 0, 0);//显示动画

        this.leiXing = leiXing;

        this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, 0, this.owner.transform.position.z);//显示

        this.sheSu1 = 0;
        if (leiXing == 0) {

        } else if (leiXing == 1) {
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("shouQiang_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;


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

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[0]; //等级

            //作战先锋 首个手枪兵为 队长  属性全面提升
            if (GameManager.curLevelManager.moShi == "zuoZhanXianFeng") {

                if (GameManager.curPlayerControl.fanHuiRenShu() == 0) {

                    GameManager.curPlayerControl.duiZhangObj = this.owner;
                }

            }


        } else if (leiXing == 2) {
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("chongFeng_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

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

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[1]; //等级


        } else if (leiXing == 3) {//步枪
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("buQiang_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

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

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[2]; //等级

        } else if (leiXing == 4) {//机关枪
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("jiQiang_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;


            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jiQiang";//开火音效

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[4]; //等级


        } else if (leiXing == 5) {//喷火枪
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("huoQiang_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);
            this.wt.getChildByName("FX_shanxinghuoyan").active = false;


            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["penHuoBingShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["penHuoBingShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["penHuoBingShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["penHuoBingShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["penHuoBingShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["penHuoBingShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "penHuo";//开火音效

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[5]; //等级


        } else if (leiXing == 6) {//狙击枪
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("jvJi_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["jvJiShouShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["jvJiShouShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["jvJiShouShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["jvJiShouShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["jvJiShouShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["jvJiShouShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jvJi";//开火音效

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[3]; //等级

        } else if (leiXing == 7) {//榴弹兵
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("liuDan_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["xueLiang"]);//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "liuDan";//开火音效

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[6]; //等级

        } else if (leiXing == 8) {//医疗兵
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("yiLiao_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

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

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[0];  //等级

        }
        else if (leiXing == 9) {//保卫者
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("yiLiao_Bing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

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

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[1];  //等级
        }
        else if (leiXing == 10) {//神经突击队
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("shenJingTuJiDui"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

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

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[1];  //等级

        }
        else if (leiXing == 11) {//通讯兵
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("tongXunBing"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(1).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;
            this.wt.getChildAt(2).skinnedMeshRenderer.material = GameManager.models.getChildByName("piFuLan").meshRenderer.material;

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

            this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[1];  //等级

        }

        else if (leiXing == 16) {//机枪炮台
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("jiQiang_paoTai"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiL").meshRenderer.material;
            this.wt.getChildAt(0).getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiL").meshRenderer.material;
            this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiL").meshRenderer.material;


            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["jiQiangShouShuJv"]["xueLiang"]) * 2;//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "jiQiang";//开火音效

            // this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[4];  //等级
            this.dengJi = 1;  //等级
        }
        else if (leiXing == 17) {//榴弹炮台
            this.wt = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("liuDan_paoTai"), this.owner.getChildByName("wuTi"));
            this.wt.transform.localPosition = new Laya.Vector3(0, 0, 0);

            this.wt.getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiL").meshRenderer.material;
            this.wt.getChildAt(0).getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiL").meshRenderer.material;
            this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material = GameManager.models.getChildByName("paoTaiCaiZhiL").meshRenderer.material;


            this.gongJiFanWei = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["gongJiFenWei"]);//攻击范围

            this.sheSu2 = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["sheSu"]);  //射速

            this.huaNDanShiJian = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["huaNDanShiJian"]);  //换弹时间
            this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

            this.ziDanRongLiang = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["ziDanRongLiang"]); //弹夹容量
            this.danQianZiDan = this.ziDanRongLiang; //当前子弹

            this.gongJiLi = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["gongJiLi"]);  //攻击力

            this.xueLiang = parseInt(GameManager.jsonShuJv["liuDanShouShuJv"]["xueLiang"]) * 2;//血量

            this.dangQianXueLiang = this.xueLiang;  //当前血量

            this.kaiHuoYinXiao = "liuDan";//开火音效

            // this.dengJi = PlayerData.GetUserData("shangDianDengJiZu")[4];  //等级
            this.dengJi = 1;  //等级
        }

        // 队长  属性全面提升
        if (GameManager.curLevelManager.moShi == "zuoZhanXianFeng") {

            if (GameManager.curPlayerControl.duiZhangObj == this.owner) {

                this.huaNDanShiJian = this.huaNDanShiJian - 10;  //换弹时间
                if (this.huaNDanShiJian < 1) {
                    this.huaNDanShiJian = 1;
                }
                this.shengYuHuanDanShiJian = this.huaNDanShiJian;  //剩余换弹时间

                this.gongJiFanWei = this.gongJiFanWei * 1.5;

                this.sheSu2 = this.sheSu2 - 10;
                if (this.sheSu2 < 5) {
                    this.sheSu2 = 5;
                }

                this.ziDanRongLiang = this.ziDanRongLiang * 2;
                this.danQianZiDan = this.ziDanRongLiang; //当前子弹

                this.gongJiLi = this.gongJiLi * 2;

                this.xueLiang = this.xueLiang * 3;
                this.dangQianXueLiang = this.xueLiang;  //当前血量

                this.wt.transform.setWorldLossyScale(new Laya.Vector3(1.5, 1.5, 1.5));
            }

        }

        //根据等级 重置 血量 攻击力 和弹夹
        this.xueLiang = this.xueLiang + parseInt(GameManager.jsonShuJv["shangDianShuJv"]["shengJiXueLiang"]) * parseInt(this.dengJi);
        this.dangQianXueLiang = this.xueLiang;

        //火枪单独判断增加的攻击力
        if (leiXing == 5) {
            this.gongJiLi = this.gongJiLi + parseInt(GameManager.jsonShuJv["shangDianShuJv"]["shengJiGongJiLiHuoQiang"]) * parseInt(this.dengJi);

        } else {
            this.gongJiLi = this.gongJiLi + parseInt(GameManager.jsonShuJv["shangDianShuJv"]["shengJiGongJiLi"]) * parseInt(this.dengJi);

        }

        this.ziDanRongLiang = this.ziDanRongLiang + parseInt(GameManager.jsonShuJv["shangDianShuJv"]["shengJiDanJia"]) * parseInt(this.dengJi);
        this.danQianZiDan = this.ziDanRongLiang;

        //特殊加固 增加额外的血量
        if (GameManager.curLevelManager.zzxfDuiYingDeDengJi[8] > 0) {
            var tiShengDeXueLiang = GameManager.curLevelManager.zzxfDuiYingDeDengJi[8] * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["teShuJiaGuMeiCiTiShengXueLiang"]);
            this.xueLiang = this.xueLiang + tiShengDeXueLiang;
            this.dangQianXueLiang = this.dangQianXueLiang + tiShengDeXueLiang;
        }



        if (leiXing > 0) {

            this.xueTiaoObj.active = true;
            this.owner.getChildByName("xueTiaoFa").active = true;

            //刷新血量显示
            this.shuaXinXueLiangXianShi();
            this.daiJiFang();

        }


        var boxShape = new Laya.BoxColliderShape(3, 1, 3);
        //获取本地偏移
        var localOffset = boxShape.localOffset;
        //修改偏移
        localOffset.setValue(this.owner.transform.localPosition.x, this.owner.transform.localPosition.y, this.owner.transform.localPosition.z);
        boxShape.localOffset = localOffset;
        //往组合碰撞器形状中添加该碰撞器形状
        GameManager.curPlayerControl.pengZhuangJihe.addChildShape(boxShape);

        this.pengZhaungObj = boxShape;//绑定对应的碰撞

        //添加碰撞体
        GameManager.curPlayerControl.owner.getComponent(Laya.Rigidbody3D).colliderShape = GameManager.curPlayerControl.pengZhuangJihe;

    }

    daiJiFang() {

        if (this.state == "daiJi") {
            return;
        }

        this.state = "daiJi";


        //待机动作
        if (this.kaiHuoYinXiao == "shouqiang") {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang_DaiJi", 0, 0);
        } else if (this.kaiHuoYinXiao == "buQiang") {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_235_DaiJi", 0, 0);
        } else if (this.kaiHuoYinXiao == "jiQiang") {

            if (this.leiXing > 15) {
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

            if (this.leiXing > 15) {
                this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_daiji", 0, 0);

            } else {
                this.wt.getComponent(Laya.Animator).play("juese_Skin_67_DaiJi", 0, 0);
            }
        }

    }

    gongJiFun() {

        if (this.state == "gongJi") {
            return;
        }
        this.state = "gongJi";


        /*
        if (this.leiXing == 1) {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang_DaiJi", 0, 0);
        } else if (this.leiXing == 2) {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_2BuBing", 0, 0);
        } else if (this.leiXing == 3) {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_3BuBing", 0, 0);
        } else if (this.leiXing == 4) {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_4JiQiang", 0, 0);
        } else if (this.leiXing == 5) {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_6HuoYan", 0, 0);

            //    this.wt.getChildByName("FX_shanxinghuoyan").active = true;

        } else if (this.leiXing == 6) {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_5JuJi", 0, 0);
        } else if (this.leiXing == 7) {
            this.wt.getComponent(Laya.Animator).play("juese_Skin_6HuoYan", 0, 0);
        }

        */
    }
    gouDaiFun() {
        GameManager.PlaySound("gouDai1");
        this.state = "gouDai";

        if (this.wt != null) {
            if (this.wt.name.indexOf("Bing") != -1) {
                this.wt.getComponent(Laya.Animator).play("juese_Skin_Siwang4", 0, 0);
            } else if (this.wt.name.indexOf("paoTai") != -1) {

                //炮台爆炸
                GameManager.PlaySound("baoZha1");
                //爆炸特效
                var bz = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("fx_hongzha"), GameManager.curScene);
                bz.transform.position = this.wt.transform.position;
            }
        } else {

        }


        //如果是医疗兵狗带 减少医疗兵增益
        if (this.wt.name == "yiLiao_Bing") {
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[1] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[1] - 1;
        }
        //如果是保卫者  减少保卫者增益
        if (this.wt.name == "baoWeiZhe") {

            GameManager.curLevelManager.zzxfDuiYingDeDengJi[5] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[5] - 1;
        }
        if (this.wt.name == "shenJingTuJiDui") {
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[2] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[2] - 1;
        }
        if (this.wt.name == "tongXunBing") {
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[3] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[3] - 1;
        }

        if (this.wt.name == "jiQiang_paoTai") {
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[10] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[10] - 1;
        }

        if (this.wt.name == "liuDan_paoTai") {
            GameManager.curLevelManager.zzxfDuiYingDeDengJi[11] = GameManager.curLevelManager.zzxfDuiYingDeDengJi[11] - 1;
        }

        //查看人数  小于等于1的话就失败
        var shu = GameManager.curPlayerControl.fanHuiRenShu();
        if (shu <= 0) {
            GameManager.curPlayerControl.shiBaiChuLiFun();
        }

        // 队长 
        if (GameManager.curLevelManager.moShi == "zuoZhanXianFeng") {

            if (GameManager.curPlayerControl.duiZhangObj == this.owner) {
                GameManager.curPlayerControl.duiZhangObj = null;

                UIManager.ShowGameTipUI("队长被击败了,无法获取 队长武器升级增益");
            }
        }

    }
    gouDaiTouFun() {
        this.state = "gouDaiTou";

        //移除身上的物体
        if (this.wt != null) {
            this.wt.destroy();
            this.wt = null;
        }

        this.xueTiaoObj.active = false;
        this.owner.getChildByName("xueTiaoFa").active = false;


        this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, -100, this.owner.transform.position.z);//隐藏

        //绑定的一块父级碰撞盒
        if (this.pengZhaungObj != null) {
            GameManager.curPlayerControl.pengZhuangJihe.removeChildShape(this.pengZhaungObj);//移除对应的碰撞
        }

    }
    //受击
    shouJi(shuZhi) {

        //无视受击判断
        if (this.wt == null || this.state == "gouDai" || this.state == "gouDaiTou" || GameManager.curPlayerControl.state == "shiBai" || GameManager.curPlayerControl.state == "shengLi" || this.huDunObj != null) {
            return;
        }

        //受击高亮 炮台判断
        if (this.leiXing > 15) {
            this.wt.getChildAt(0).meshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = 3;
        } else {
            this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity = 3;
            this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity = 3;
        }


        //相同士兵合成引导没完成  或者 直升机救援状态 就不受伤   
        if (PlayerData.GetUserData("xiangTongShiBingHeChengYd") == false || GameManager.curPlayerControl.state == "jiuYuan") {
            shuZhi = 0;
        }


        //无星时受到的伤害为三分之一
        if (GameManager.curLevelManager.nanDuDengJi == 0) {
            shuZhi = shuZhi / 3;
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


        this.AutoMove();
    }


    AutoMove() {

        if (this.wt != null) {

            if (this.leiXing > 15) {
                if (this.wt.getChildAt(0).meshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity = this.wt.getChildAt(0).getChildAt(0).getChildAt(0).meshRenderer.material.albedoIntensity - 0.1;

                }
            } else {
                if (this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity > 1) {
                    this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildAt(1).skinnedMeshRenderer.material.albedoIntensity - 0.1;
                    this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity = this.wt.getChildAt(2).skinnedMeshRenderer.material.albedoIntensity - 0.1;

                }
            }


        }

        if (this.state == "daiJi") {


            //作战先锋也要 优先 攻击油桶
            /*
            if (GameManager.curLevelManager.moShi == "zuoZhanXianFeng") {

                for (var i = 0; i < GameManager.curLevelManager.youTongJiHe.numChildren; i++) {

                    var muBiao = GameManager.curLevelManager.youTongJiHe.getChildAt(i);

                    if (muBiao.getComponent(youTong) == null) {
                        continue;
                    }

                    var jvLi = Laya.Vector3.distance(muBiao.transform.position, this.wt.transform.position);
                    if (jvLi < this.gongJiFanWei) {

                        this.gongJiFun();
                        this.gongJimuBiao = muBiao;
                        return;
                    }

                }

            }
            */


            //检测周围敌人
            //组里的元素遍历
            for (var i = 0; i < this.diRenJiHe.numChildren; i++) {
                //组里的小单位遍历
                for (var p = 0; p < this.diRenJiHe.getChildAt(i).numChildren; p++) {



                    var wt = this.diRenJiHe.getChildAt(i).getChildAt(p).getChildByName("wuTi");
                    if (wt.numChildren == 0) {//木板上没东西就跳过
                        continue;
                    } else {
                        if (wt.parent.getComponent(jiao).state == "gouDai" || wt.parent.getComponent(jiao).state == "gouDaiTou") {

                            continue;
                        }
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
        else if (this.state == "yinCang") {


        }
        else if (this.state == "gongJi") {

            //油桶判断
            if (this.gongJimuBiao.name == "barrel01_A") {

                if (this.gongJimuBiao.getComponent(youTong) == null) {
                    this.daiJiFang();
                    return;
                }

            } else {
                if (this.gongJimuBiao == null || this.gongJimuBiao.getComponent(jiao).state == "gouDai" || this.gongJimuBiao.getComponent(jiao).state == "gouDaiTou") {
                    this.daiJiFang();
                    return;
                }
            }



            var jvLi = Laya.Vector3.distance(this.gongJimuBiao.transform.position, this.wt.transform.position);

            if (this.gongJimuBiao == null || jvLi > this.gongJiFanWei) {

                this.daiJiFang();
            } else {

                this.wt.transform.lookAt(this.gongJimuBiao.transform.position, new Laya.Vector3(0, 1, 0), false);
                this.wt.transform.rotationEuler = new Laya.Vector3(0, this.wt.transform.rotationEuler.y + 180, this.wt.transform.rotationEuler.z)

                //判断是否还有子弹
                if (this.danQianZiDan <= 0) {
                    //没有子弹

                    //火枪兵判断
                    if (this.leiXing == 5) {
                        if (this.wt.getChildByName("FX_shanxinghuoyan").active == true) {
                            this.wt.getChildByName("FX_shanxinghuoyan").active = false;
                        }
                    }

                    //换弹中
                    this.shengYuHuanDanShiJian = this.shengYuHuanDanShiJian - 1;
                    if (this.shengYuHuanDanShiJian <= 0) {
                        //换弹完毕
                        this.shengYuHuanDanShiJian = this.huaNDanShiJian;//重置剩余子弹
                        this.danQianZiDan = this.ziDanRongLiang;//重置当前子弹
                    }

                } else {

                    //射击中
                    this.sheSu1 = this.sheSu1 + 1;

                    //射速 神经突击队加成
                    var zhenShiSHeSu = this.sheSu2 * (1 - GameManager.curLevelManager.zzxfDuiYingDeDengJi[2] * parseInt(GameManager.jsonShuJv["zuoZhanXianFengMoShiShuJv"]["shenJingTuJiDuiGongSuZeng"]) / 100)

                    if (this.sheSu1 >= zhenShiSHeSu) {
                        this.sheSu1 = 0;


                        //开火动作
                        if (this.kaiHuoYinXiao == "shouqiang") {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_1ShouQiang", 0, 0);

                        } else if (this.kaiHuoYinXiao == "buQiang") {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_2BuBing", 0, 0);

                        } else if (this.kaiHuoYinXiao == "jiQiang") {

                            if (this.leiXing > 15) {
                                this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_sheji", 0, 0);
                            } else {
                                this.wt.getComponent(Laya.Animator).play("juese_Skin_4JiQiang", 0, 0);
                            }

                        } else if (this.kaiHuoYinXiao == "penHuo") {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_6HuoYan", 0, 0);

                        } else if (this.kaiHuoYinXiao == "jvJi") {
                            this.wt.getComponent(Laya.Animator).play("juese_Skin_5JuJi", 0, 0);

                        } else if (this.kaiHuoYinXiao == "liuDan") {
                            if (this.leiXing > 15) {
                                this.wt.getChildAt(0).getChildAt(0).getComponent(Laya.Animator).play("PaoTai_sheji", 0, 0);
                            } else {
                                this.wt.getComponent(Laya.Animator).play("juese_Skin_2BuBing", 0, 0);
                            }


                        }


                        //火枪兵单独判断
                        if (this.leiXing == 5) {
                            if (this.wt.getChildByName("FX_shanxinghuoyan").active == false) {
                                this.wt.getChildByName("FX_shanxinghuoyan").active = true;

                                GameManager.PlaySound(this.kaiHuoYinXiao);//开火音效

                            }
                        } else {
                            //创建一颗子弹

                            if (this.leiXing == 6) {
                                var ziDanObj = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("ziDan2"), GameManager.curScene);

                            } else if (this.leiXing == 7 || this.leiXing == 17) {
                                var ziDanObj = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("ziDan3"), GameManager.curScene);

                            } else {
                                var ziDanObj = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("ziDan1"), GameManager.curScene);

                            }

                            ziDanObj.transform.position = this.wt.getChildByName("ziDanDian").transform.position;
                            ziDanObj.transform.lookAt(this.gongJimuBiao.transform.position, new Laya.Vector3(0, 1, 0), false);
                            ziDanObj.transform.rotationEuler = new Laya.Vector3(ziDanObj.transform.rotationEuler.x, ziDanObj.transform.rotationEuler.y + 180, ziDanObj.transform.rotationEuler.z)

                            var zanShi = new Laya.Vector3(0, 0, 0);
                            Laya.Vector3.subtract(this.gongJimuBiao.transform.position, this.wt.transform.position, zanShi)
                            var zanShi2 = new Laya.Vector3(0, 0, 0);
                            Laya.Vector3.normalize(zanShi, zanShi2);

                            ziDanObj.addComponent(ziDan).biaoLiang = zanShi2;
                            ziDanObj.getComponent(ziDan).zhuRen = this;

                            GameManager.PlaySound(this.kaiHuoYinXiao);//开火音效
                        }

                        this.danQianZiDan = this.danQianZiDan - 1;//当前子弹-1

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

    //治疗
    zhiLiao(shuLiang) {

        if (this.state == "gouDai" || this.state == "gouDaiTou") {
            return;
        }

        //恢复特效
        var Tx = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("FX_huixue"), this.owner);
        Tx.transform.position = this.owner.transform.position;

        this.dangQianXueLiang = this.dangQianXueLiang + shuLiang;
        if (this.dangQianXueLiang > this.xueLiang) {
            this.dangQianXueLiang = this.xueLiang;
        }
        this.shuaXinXueLiangXianShi();
    }

    //护盾
    huDun() {

        if (this.state == "gouDai" || this.state == "gouDaiTou") {
            return;
        }

        GameManager.PlaySound("huDun");

        //护盾特效
        var Tx = Laya.Sprite3D.instantiate(GameManager.models.getChildByName("FX_hudun"), this.owner);
        Tx.transform.position = this.owner.transform.position;


        this.huDunObj = Tx;//护盾特效
    }

    //移除护盾
    yiChuHuDun() {

        if (this.huDunObj != null) {
            this.huDunObj.destroy();
            this.huDunObj = null;
        }

    }


    onTriggerEnter(other) {
        var oname = other.owner.name;
        var obj = other.owner;


        //碰到辣椒
        if (oname.indexOf("ziDan") != -1) {

            if (obj.getComponent(ziDan).zhuRen.zhenYing == 1) {

                if (this.wt == null || this.wt == undefined) {

                } else {
                    obj.name = "xxx";
                    obj.active = false;
                    this.shouJi(obj.getComponent(ziDan).zhuRen.gongJiLi);
                }

            }

        }

        //撞到石柱
        if (oname.indexOf("ShiZhu") != -1) {
            obj.name = "xxx";

            GameManager.curScene.addChild(obj);
            obj.active = false;

            // obj.destroy();


            this.shouJi(parseInt(GameManager.jsonShuJv["shiTiouDeShangHai"]));

        }
    }
}