import BattleCity from "./BattleCity";
export default class Tank extends BattleCity {
    // 坦克宽度
    tankW: number
    // 坦克高度
    tankH: number
    // 坦克X位置
    tankX: number
    // 坦克Y位置
    tankY: number
    // 方向
    dir: '上' | '下' | '左' | '右'
    // 坦克颜色
    color: string
    // 坦克速度
    seed: number
    // 是否开启无敌
    isInvincible: Boolean
    // 坦克血量
    lifeVal: number

    constructor(seed:number, color:string,lifeVal:number,x?:number, y?:number ) {
        super();
        this.tankW = this.config.tankWidth;
        this.tankH = this.config.tankHeight;
        this.tankX = x || 0;
        this.tankY = y || 0;
        this.dir = "上";
        this.color = color;
        this.seed = seed;
        this.isInvincible = false;
        this.lifeVal = lifeVal;

        //出生有3s无敌
        this.invincible(300);
    }
    //开启无敌（有时间） 
    invincible(timer) {
        this.isInvincible = true;
        setTimeout(()=>{
            this.isInvincible = false;
        }, timer)
    }

    //坦克移动
    //然后promise?
    move(){

    }

    //绘制坦克
    drawTank() {
        const x = this.tankX;
        const y = this.tankY;
        const {ctx, tankW, tankH,color,dir} = this;

        //绘制左右坦轮
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = color;
        //根据方向旋转
        this.rotate(x, y , tankW, tankH,dir === '上' ? 0 : dir === '下' ? 180 : dir === '左' ? 270 : 90)
        ctx.fillRect(x,y,tankW/4,tankH); //对应i=1
        ctx.fillRect(x+(3*4/tankW),y,tankW/4,tankH); //对应 i=2
        
        
        //轮子轮廓
        ctx.strokeStyle = "rgba(153,153,153,0.6)"
        //轮子里的横线绘制
        //2个轮子  遍历
        for(let i = 0; i< 2 ;i++) {
            ctx.lineWidth = 1;
            for(let k =1; k < 6;k++) {
                const currentY = y + (tankH/5) * k; 
                switch(i){
                    case 1:{
                        ctx.moveTo(x,currentY);
                        ctx.lineTo(x+tankW/4, currentY);
                    }
                    case 2:{
                        ctx.moveTo(x+ tankW - tankW/4, currentY);
                        ctx.lineTo(x + (tankW - tankW / 4) + tankW / 4, currentY)
                    }

                }

            }
            ctx.stroke();
        }

        //绘制坦身
        this.borderRect(x + (tankW / 2) - ((tankW / 2.6) / 2), y + ((tankH - (tankH / 1.4)) / 2), tankW / 2.6, tankH / 1.4)
        ctx.lineWidth = 1

        //绘制炮管  
        this.borderRect(x + ((tankW / 2) - ((tankW / 6) / 2)), y - 5, tankW / 6, tankH / 1.3);

        //绘制无敌
        if(this.isInvincible) {
            ctx.beginPath();
            ctx.strokeStyle = "rgb(255,133,0)";
            ctx.arc(x+(tankW/2), y+(tankH/2),tankW-2,Math.PI*2, 0);
            ctx.stroke();
            ctx.closePath();
        }
        //坦克绘制完毕
        ctx.restore();
        ctx.closePath();

        //绘制裂痕
        //判断是主角坦克还是敌人坦克，两种坦克血量不同
        if(
            this.lifeVal <= (this.color == this.config.myTankColor?this.levelParams.myTankLife/2 : this.levelParams.enemyLife/2)
        ){
            ctx.beginPath();
            ctx.save();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.moveTo(x + tankH / 4, y)
            ctx.lineTo(x + 5, y + tankH / 2)
            ctx.lineTo(x + tankH / 3, y + tankH / 2)
            ctx.lineTo(x + tankH / 4, y + tankH)
            ctx.moveTo(x + tankH - 5, y)
            ctx.lineTo(x + tankH - 5, y + tankH / 2)
            ctx.lineTo(x + tankH, y + tankH / 2)
            ctx.lineTo(x + tankH - 10, y + tankH)
            ctx.stroke()
            ctx.restore()
            ctx.closePath()
        }
    }
}