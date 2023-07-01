import Tank from "./Tank";
import config from './config'
// @ts-ignore
import Modal from "custom-dialog"

type hitObj = {
  x: number,
  y: number,
  w: number,
  h: number
}

// 坦克大战、类，所有类的父亲
const canvas = document.querySelector('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

export default class BattleCity {
  // canvas 元素
  canvas: HTMLCanvasElement
  // canvas绘画的上下文对象
  ctx: CanvasRenderingContext2D
  // canvas的宽度
  cw: number
  // cnavas的高度
  ch: number
  // 配置信息
  config: any
  // 弹框
  dialog = Modal

  // 地图对象
  static barrierObj_: Array<{
    x: number,
    y: number,
    w: number,
    h: number,
    type: string
  }> = []
  // 敌人对象
  static enemyAll_: Array<{
    // 子弹的定时器ID
    bulletId?: NodeJS.Timer,
    // 转向的定时器ID
    turnToId?: NodeJS.Timer,
    tankObj: Tank
  }> = []
  // 子弹对象
  static bulletAll_: Array<{
    x: number,
    y: number,
    dir: string,
    seed: number,
    color: string
  }> = []
  // 关卡参数
  static levelParams_: {
    enemySeed: number,
    enemyAmount: number,
    enemyCeiling: number,
    enemyLife: number,
    myTankLife: number,
    enemyCreateSeed: number,
  }
  // 关卡关数
  static level_: number = 0
  // 消灭敌人
  static enemyVanishNum_: number = 0
  // 游戏是否结束
  static isFinish_: Boolean
  // 游戏是否暂停
  static isSuspend_: boolean = false

  constructor() {
    this.canvas = canvas
    this.cw = this.canvas.width
    this.ch = this.canvas.height
    this.ctx = ctx
    this.config = config
    this.dialog = new Modal()

    // console.log(this)
  }

  // 绘制边框矩形
  borderRect(x: number, y: number, w: number, h: number) {
    const { ctx } = this
    ctx.beginPath()
    ctx.fillRect(x, y, w, h)
    ctx.strokeRect(x, y, w, h)
    ctx.closePath()
  }

  // 根据图形中心旋转
  // x、y、宽、高、角度
  rotate(x: number, y: number, w: number, h: number, r: number) {
    let xx = x + (w / 2)
    let yy = y + (h / 2)

    const { ctx } = this
    ctx.translate(xx, yy);
    ctx.rotate((r * Math.PI) / 180);
    ctx.translate(- xx, - yy)
  }

  // 碰撞检测
  hitDetection(hitObj1: hitObj, hitObj2: hitObj) {
    return hitObj1.x + hitObj1.w >= hitObj2.x &&
        hitObj1.x <= hitObj2.x + hitObj2.w &&
        hitObj1.y + hitObj1.h >= hitObj2.y &&
        hitObj1.y <= hitObj2.y + hitObj2.h;
  }

  // 更新游戏状态的页面元素
  updateStatus() {
    (<Element>document.querySelector('#myLife')).innerHTML = String(this.myTanke?.tankObj.lifeVal);
    (<Element>document.querySelector('#enemyNum')).innerHTML = String(this.levelParams.enemyAmount - this.enemyVanishNum)
  }

  // 暂停事件
  suspend() {
    // 如果已经暂停不用重复暂停
    if (this.isSuspend) return

    // 暂停状态
    this.isSuspend = true;
    // 暂停方法
    this.dialog.alert({
      content: `
      操作：↑↓←→<br>Space：发射子弹<br>点击选择关卡，每一关难度不同<br>
      我设置了三个关卡<br>第一关：简单，第二关：困难，第三关：地狱<br>
      胜利条件：消灭所有敌人<br>
      失败条件：家全部被毁灭，或主角生命&lt;=0
    `,
      buttons: {
        ok: () => {
          this.isSuspend = false;
          return true;
        },
      }
    })
  }

  // 地图对象
  get barrierObj() {
    return BattleCity.barrierObj_
  }
  set barrierObj(val) {
    BattleCity.barrierObj_ = val
  }
  // 敌人对象
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
  // 游戏是否暂停
  get isSuspend() {
    return BattleCity.isSuspend_
  }
  set isSuspend(val) {
    BattleCity.isSuspend_ = val
  }
  // 消灭敌人数量
  get enemyVanishNum() {
    return BattleCity.enemyVanishNum_
  }
  set enemyVanishNum(val) {
    BattleCity.enemyVanishNum_ = val
  }
  // 关卡关数
  get level(){
    return BattleCity.level_
  }
  set level(val) {
    BattleCity.level_ = val
  }
  // 游戏是否结束
  get isFinish(){
    return BattleCity.isFinish_
  }
  set isFinish(val) {
    BattleCity.isFinish_ = val
  }

  // 主角坦克
  get myTanke() {
    return BattleCity.enemyAll_.find(v => v.tankObj.color === this.config.myTankColor) as { tankObj: Tank, lifeVal: number }
  }
}
