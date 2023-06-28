import Tank from "./Tank";
import config from "./config"
import Modal from "custom-dialog"

type hitObj = {
    x: number,
    y: number,
    w: number,
    h: number
}

// 坦克大战、类，所有类的父亲
const canvas = document.querySelector("#canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;


export default class BattleCity {
    // canvas 元素
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    // canvas的宽度
    cw: number
    // cnavas的高度
    ch: number
    // 配置信息
        config: any
    // 弹框
    dialog = Modal

    //地图对象
    static barrierObj_: Array<{
        x: number,
        y: number,
        w: number,
        h: number,
    }> = []

    //敌人对象
    static enemyAll_: Array<{
        tankObj: Tank,
        //子弹定时器ID
        bulletId?: NodeJS.Timer,
        //转向定时器的ID
        turnToId?: NodeJS.Timer
    }> = []

    //子弹对象
    static bulletAll_: Array<{
        x: number,
        y: number,
        dir: string,
        seed: number,
        color: string
    }> = []

    //关卡参数
    static levelParams_: {
        enemySeed: number,
        enemyAmount: number,
        enemyCeiling: number,
        enemyLife: number,
        myTankLife: number,
        enemyCreateSeed: number,

    }

    //当前关卡层数
    static level_: number = 0
    //消灭敌人个数
    static enemyVanishNum_: number = 0
    // 游戏是否结束
    static isFinish_: Boolean

    constructor() {
        this.canvas = canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.ctx = ctx;
        this.config = config;
        this.dialog = new Modal()
    }

    // 绘制边框矩形
    borderRect(x: number, y: number, w: number, h: number) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }

    // 根据图形中心旋转
    // x、y、宽、高、角度
    rotate(x: number, y: number, w: number, h: number, r: number) {
        const { ctx } = this;
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(r * Math.PI / 180);

        //此处有修改¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥
        ctx.translate(-w / 2, -h / 2);
    }
    // 碰撞检测
    //此处有修改¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥
    hitDetection(hitObj1: hitObj, hitObj2: hitObj) {
        return (hitObj1.x >= hitObj2.x && hitObj1.x <= hitObj2.x + hitObj2.w
            && hitObj1.y >= hitObj2.y && hitObj1.y <= hitObj2.y + hitObj2.h) || (
                hitObj2.x >= hitObj1.x && hitObj2.x <= hitObj1.x + hitObj1.w
                && hitObj2.y >= hitObj1.y && hitObj2.y <= hitObj1.y + hitObj1.h)
    }

    //地图对象
    get barrierObj() {
        return BattleCity.barrierObj_
    }
    set barrierObj(val): void {
        BattleCity.barrierObj_ = val
    }

    //敌人对象
    get enemyAll() {
        return BattleCity.enemyAll_
    }
    set enemyAll(val) {
        BattleCity.enemyAll_ = val
    }
    // 子弹对象
    get bulletAll() {
        return BattleCity.bulletAll_
    }
    set bulletAll(val) {
        BattleCity.bulletAll_ = val
    }
    // 关卡参数
    get levelParams() {
        return BattleCity.levelParams_
    }
    set levelParams(val) {
        BattleCity.levelParams_ = val
    }
    // 消灭敌人数量
    get enemyVanishNum() {
        return BattleCity.enemyVanishNum_
    }
    set enemyVanishNum(val) {
        BattleCity.enemyVanishNum_ = val
    }
    // 关卡关数
    get level() {
        return BattleCity.level_
    }
    set level(val) {
        BattleCity.level_ = val
    }
    // 游戏是否结束
    get isFinish() {
        return BattleCity.isFinish_
    }
    set isFinish(val) {
        BattleCity.isFinish_ = val
    }

    //玩家
    get myTanke() {
        // return BattleCity.enemyAll_.find(v => v.tankObj.color)
    }


}