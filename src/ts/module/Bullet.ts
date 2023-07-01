import BattleCity from "./BattleCity";

export default class Bullet extends BattleCity {
    // 特效对象 -- 子弹碰撞后的特效
    effectsAll: Array<{
        x: number,
        y: number,
        radius: 0,
        color: string,
    }>
    constructor() {
        super();
        this.effectsAll = [];
        this.move()
    }

    //子弹移动
    move() {
        const { canvas } = this;
        // 子弹超出边界就会删除
        this.bulletAll = this.bulletAll.filter(v => {
            return !(v.x < 0 || v.x > canvas.width || v.y < 0 || v.y > canvas.height)
        })

        //根据方向改变子弹位置
        this.bulletAll = this.bulletAll.map(v => {
            switch (v.dir) {
                case "上": {
                    v.y -= v.seed;
                    break
                }
                case "下": {
                    v.y += v.seed;
                    break
                }
                case "左": {
                    v.x -= v.seed;
                    break
                }
                case "右": {
                    v.x += v.seed;
                }
            }
            return v;
        }) || [];

        this.isBulletHit()
        this.redrawBullet()
    }

    //判断子弹是否碰撞
    isBulletHit() {
        const mc = this.config.myTankColor;
        //第一层 遍历子弹
        this.bulletAll = this.bulletAll.filter(v1 => {

            //每个子弹的参数
            const bulletHitObj = {
                x: v1.x,
                y: v1.y,
                w: 5,
                h: 5,
            }

            //是否删除子弹
            let isRemoveBullet = false;
            //是否删除敌人
            let isRemoveEnemy = false;
            //是否删除我的坦克
            let isRemoveMyTank = false;

            //遍历墙🧱 ---- 会变没 所以filter1
            this.barrierObj = this.barrierObj.filter(v2 => {
                //子弹是否撞到墙
                let isHit = this.hitDetection(bulletHitObj, v2);
                //撞上墙子弹要删除的
                if (isHit && v2.type !== "h") isRemoveBullet = true;
                return v2.type === "z" || v2.type === "h" ? true : !isHit;
            })

            //家没了
            if (this.barrierObj.filter(v2 => v2.type === "j").length <= 0 && !this.isFinish) {
                this.isFinish = true
                // 删除主角坦克
                this.enemyAll = this.enemyAll.filter(v => v.tankObj.color !== mc)
                this.dialog.alert({
                    content: '家没了，大侠请重新来过',
                    buttons: {
                        ok() {
                            return true;
                        },
                    }
                })
                return
            }

            //主角子弹判断
            if (v1.color === mc) {
                //遍历敌人
                this.enemyAll = this.enemyAll.filter((v2, i2) => {
                    if (v2.tankObj.color === mc) {
                        return true;
                    }
                    //子弹对敌人的碰撞检测
                    let isHit = this.hitDetection(bulletHitObj, {
                        x: v2.tankObj.tankX,
                        y: v2.tankObj.tankY,
                        w: v2.tankObj.tankW,
                        h: v2.tankObj.tankH,
                    })
                    if (isHit) {
                        isRemoveBullet = true;
                        if (!v2.tankObj.isInvincible) {
                            this.enemyAll[i2].tankObj.lifeVal -= 1;
                        }
                        if (this.enemyAll[i2].tankObj.lifeVal <= 0) {
                            isRemoveEnemy = true;
                            //将敌人的计时器清
                            clearTimeout(v2.bulletId);
                            clearTimeout(v2.turnToId);
                            // 消灭敌人数 +1
                            this.enemyVanishNum++
                            if (this.enemyVanishNum >= this.levelParams.enemyAmount) {
                                this.dialog.alert({
                                    content:
                                        this.level === 0 ? '胜利了，你可以开始下一关' :
                                            this.level === 1 ? '你居然过了第二关，有点实力' :
                                                this.level === 2 ? '牛啊，给你个大拇指' : '',
                                    buttons: {
                                        ok() {
                                            return true;
                                        },
                                    }
                                })
                            }
                            this.updateStatus()
                        }
                    } else {
                        //没装上
                        isRemoveEnemy = false;
                    }
                    return !isRemoveEnemy;
                })
            } else {
                //敌人子弹判断
                this.enemyAll = this.enemyAll.filter((v2, i2) => {
                    // 不是主角坦克的会被过滤
                    if (v2.tankObj.color != 'mc') return v2;
                    let isHit = this.hitDetection(bulletHitObj, {
                        x: v2.tankObj.tankX,
                        y: v2.tankObj.tankY,
                        w: v2.tankObj.tankW,
                        h: v2.tankObj.tankH,
                    })
                    if(isHit) {
                        if(!v2.tankObj.isInvincible) {
                            this.enemyAll[i2].tankObj.lifeVal -= 1;
                            v2.tankObj.invincible(500);
                        }
                        isRemoveBullet = true;
                        this.updateStatus();
                        //游戏失败
                        if (this.enemyAll[i2].tankObj.lifeVal <= 0) {
                            this.isFinish = true
                            isRemoveMyTank = true
                            this.dialog.alert( {
                              content: '失败，坦克没了，大侠请重新来过',
                              buttons: {
                                ok(){
                                  return true;
                                },
                              }
                            })
                          
                        }
                        return !isRemoveMyTank;
                    }

                })
            }

            //如果要删除子弹，就添加一个子弹特效在再删除
            if(isRemoveBullet) this.effectsAll.push({
                x:v1.x,
                y:v1.y,
                radius:0,
                color:v1.color
            })
            return !isRemoveBullet;
        })

    }


    //子弹碰撞效果绘制
    drawHitEffects() {
        this.effectsAll = this.effectsAll.map(v => {
            v.radius++;
            this.drawFires(v.x, v.y, 12, v.radius, v.color);
            return v;
        })
        //过滤半径超过某个值的
        this.effectsAll = this.effectsAll.filter(v => v.radius <= 13);
    }

    //绘制烟花效果
    drawFires(x:number, y:number, count:number, radius:number, color:string) {
        const {ctx} = this;
        for(let i1 = 0; i1 <=2 ; i1++) {  // i1是层数
            for(let i2 = 0; i2 < count ;i2 ++) {   //i2是每层中的花弧
                //渲染出当前数据
                let angle = 360 / (count /  i1) * i2;
                let randians = angle * Math.PI / 180;
                let moveX = x + Math.cos(randians) * radius / i1;
                let moveY = y + Math.sin(randians) * radius / i1;
                //开始路径
                ctx.beginPath();
                ctx.arc(moveX, moveY,1.3,Math.PI * 2, 0, false);
                //结束
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
            }
        }
    }

    //绘制子弹
    redrawBullet() {
        const {ctx} = this;
        this.bulletAll?.forEach(v => {
            ctx.beginPath();
            ctx.save();
            ctx.fillStyle = v.color;
            ctx.arc(v.x , v.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.closePath();
        })
    }
}