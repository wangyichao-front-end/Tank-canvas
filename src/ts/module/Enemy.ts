import Tank from "./Tank";
import BattleCity from "./BattleCity";

export default class Enemy extends BattleCity {
    createEnemyId: NodeJS.Timer | null
    constructor() {
        super();
        this.createEnemyId = null;
    }

    //创建敌人
    create() {
        if (this.createEnemyId !== null) {
            clearInterval(this.createEnemyId);
        }

        this.createHandle();
        //创建
        this.createEnemyId = setInterval(() => {
            // 限制地图上最大显示的敌人坦克数量
            // 并且限制 关卡敌人数量 - 消灭敌人数量
            // 并且不在暂停状态下
            if (this.enemyAll.length <= this.levelParams.enemyCeiling &&
                (this.levelParams.enemyAmount - this.enemyVanishNum) > this.enemyAll.length - 1 &&
                !this.isSuspend
            ) this.createHandle();
        },
            this.levelParams.enemyCreateSeed
        )
        this.move();
    }

    //创造敌人的操作
    createHandle() {
        //时间间隔
        const arrLaunch = [1.2, 1.5, 1.8, 2, 2.2, 2.5, null];

        //随机获取发射间隔的数值
        const launchVal = arrLaunch[Math.floor(Math.random() * 6)]
        //创建Tank实例
        const tankObj = new Tank(this.levelParams.enemySeed, 'e80000', this.levelParams.enemyLife, 100, 0)
        //发射子弹定时器
        const bulletId = setInterval(() => {
            if (!this.isSuspend) {
                this.enemyBullet(tankObj);
            }
        }, (launchVal * 1000 / 1.5))
        //转向定时器    
        const turnToId = setInterval(() => {
            if (!this.isSuspend) {
                this.turnTo(tankObj)
            }
        }, launchVal * 1000)
        //创造敌人
        this.enemyAll.push({
            bulletId,
            turnToId,
            tankObj
        })
        this.draw();
    }

    //转向
    //@tankObj 要转向的坦克对象
    //@not 随机值不会随机到这个位置
    turnTo(tankObj: Tank, not?: string) {
        const arr = ['下', '上', '左', '右'].filter(v => v != not);
        this.enemyAll = this.enemyAll.map((v) => {
            if (tankObj == v.tankObj) {
                //随机取
                v.tankObj.dir = arr[Math.floor(Math.random() * arr.length)] as '上' | '下' | '左' | '右'
                return v;
            }
            return v
        })
    }

    //绘制敌人
    draw = () => {
        this.enemyAll.forEach(v => {
            v.tankObj.drawTank();
        })
    }

    //move敌人移动
    move = () => {
        this.enemyAll = this.enemyAll.map(v => {
            if (v.tankObj.color == "yellow") return v;
            v.tankObj.move().then(() => {
                this.turnTo(v.tankObj, v.tankObj.dir);
            })
            return v;
        })
    }

    //敌人发射子弹
    enemyBullet = (tankObj: Tank) => {
        const { tankW, tankH, tankX, tankY, dir } = tankObj
        this.bulletAll.push({
            dir,
            x: tankX + tankW / 2 ,
            y: tankY + tankH / 2,
            seed:4,
            color:"red",

        })
    }
}