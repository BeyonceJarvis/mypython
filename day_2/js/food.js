// 食物构造函数





function Food() {

    // 食物在横坐标的位置；
    this.x = 0;

    // 食物在纵坐标的位置

    this.y = 0;

    // 创建div代表食物

    this.divs = $('<div></div>').addClass('food').appendTo('.map');
   
    $('.food').css({
        background: colos[cc(0, 7)]
       })
   
   
}


var colos = ['red', 'orange', 'yellow', 'skyblue', 'green', 'blue', 'pink', 'gold'];

// 随机食物颜色

function cc(min, max) {


    return Math.floor(Math.random() * (max - min + 1) + min);

};

function cols(){
   $('.food').css({
    background: colos[cc(0, 7)]
   })

}
cols()





// console.log(divs)
// 食物随机的方法函数

var yx = Food.prototype;
// console.log(yx)



yx.randomLocation = function () {
    // 1.计算得到横向最大格子数范围   地图宽度/20;

    var maxX = $('.map').width() / 20;
    // 2.计算得到纵向最大格子数范围   地图宽度/20;

    //  console.log(maxX);

    var maxY = $('.map').height() / 20;

    //  3.随机一个横向的食物出现次数  Math.random() * maxX → 取整

    var numX = parseInt(Math.random() * maxX);

    // 4.随机一个纵向的食物出现次数  Math.random() * maxX → 取整

    var numY = parseInt(Math.random() * maxY);

    //  5.记录食物在横向的位置   numX*20；

    this.x = numX * 20;
    // console.log(this.x)


    this.y = numY * 20;


    // 6.更改div食物这个盒子的位置
    this.divs.css({
        left: this.x,
        top: this.y
    })



}


//  定义构造蛇

function Sanke() {


    //  蛇的方向
    this.direction = 'right';

    // 默认蛇的原始数据
    this.datas = [{
            x: 3,
            y: 0,
            className: 'snake-head',
          
            
        },

        {
            x: 2,
            y: 0,
            className: 'snake-body',
            
        },
        {
            x: 1,
            y: 0,
            className: 'snake-body',
            
        }
    ]


}

//    根据数据动态生成蛇的样式

Sanke.prototype.drawSanke = function () {

    // 1.遍历蛇的数据
    for (var i = 0; i < this.datas.length; i++) {

        // 2.遍历中取出一个数据

        var obj = this.datas[i];

        //   3.创建div
        $('<div></div>')
            .css({
                left: obj.x * 20,
                top: obj.y * 20,
                background: colos[cc(0, 7)],
            })
            .addClass(obj.className)
            
            .appendTo('.map');
    }


}


// 蛇移动
Sanke.prototype.move = function () {
    // 1. 更改蛇身数据→ 把前一节的x和y 赋值给 后一节的x和y 
    // 2. 循环遍历蛇节数据，更改蛇身数据。倒着遍历操作
    // 3. 在循环遍历中→ 把前一节的x和y 赋值给 后一节的x和y 

    for (var i = this.datas.length - 1; i > 0; i--) {

        this.datas[i].x = this.datas[i - 1].x;
        this.datas[i].y = this.datas[i - 1].y;


    }

    // 4.取出舌头

    var head = this.datas[0];


    // 5.根据方向设置x,y;

    if (this.direction == 'right') {
        head.x += 1;
    } else if (this.direction == 'left') {
        head.x -= 1;
    } else if (this.direction == 'top') {
        head.y -= 1;

    } else if (this.direction == 'bottom') {
        head.y += 1;
    }

    // 6. 移除所有的蛇节div
    $('.snake-head,.snake-body').remove();
    // 7. 重新生成新的蛇界面
    this.drawSanke();
}


Sanke.prototype.dead = function () {
    // 1. 获取蛇头数据 head
    var head = this.datas[0];
    // 2. 判断蛇头的死亡情况
    if (
        head.x < 0 ||
        head.x >= $('.map').width() / 20 ||
        head.y < 0 ||
        head.y >= $('.map').height() / 20
    ) {
        return true;
    } else {
        return false;
    }
    // ① head.x < 0 
    // ② head.x >= 地图的宽度/20
    // ③ head.y < 0 
    // ④ head.y >= 地图的高度/20
    // 满足，死亡，返回true
    // 否则，没死，返回false

}


// 蛇吃食物
Sanke.prototype.eat = function (left,top) {
    // 1. 获取蛇头
    var head = this.datas[0];
    // 2. 让蛇头的数据x * 20 和 y * 20后的结果 去和 食物的left和top比较
    if (
      head.x * 20 == left &&
      head.y * 20 == top
    ) {
      // 3. 满足：吃了，返回true
      return true;
    } else {
       // 4. 否则：没吃，返回false
      return false;
    }
    
   
  };




//   给游戏创建对象


function Game() {
    this.foods = new Food();

    this.Sankes = new Sanke();
    this.score = 0;
    this.foods.randomLocation();
    this.Sankes.drawSanke()

}
var timer; // 表示定时器标识
Game.prototype.start = function () {
    // 定义临时变量，存放this,存放了调用者
    var that = this
    //  开启定时器

    timer = setInterval(function () {
        that.Sankes.move();

        // 检测蛇是否死亡
        var isDead = that.Sankes.dead();
        // 判断死亡后的操作
        if (isDead) {
            // 停止定时器
            clearInterval(timer);
            // 显示游戏结束
            $('.dead').show(500);
           
        }
        // 检测蛇是否吃到食物
    // 调用蛇的eat时，要将食物的数据当做实参传入eat方法中
    var isEat = that.Sankes.eat(that.foods.x, that.foods.y,);
    // 判断
    if (isEat) {
      // 食物变化位置
      that.foods.randomLocation();
    //   var a=$('.food').css('background')
       cols();
      
      // 分数增加10
      that.score += 1;  // 记录分数
      $('.sc').val('分数：' + that.score * 10);  // 更新到文本框中
     
      // 蛇自增一节，向蛇节数据中添加一个数据
      that.Sankes.datas.push({ 
          className: 'snake-body',

        })
       
    }


    }, 100);
   
    // 检测蛇是否吃到食物
    // 调用蛇的eat时，要将食物的数据当做实参传入eat方法中


    //  键盘控制
    $(document).keydown(function (e) {
        // 获取键码值
        var code = e.keyCode; // 37 38  39 40
        // 判断键码值，更改游戏中蛇对象的方向
        if (code == 37) {
            if (that.Sankes.direction != 'right') {
                that.Sankes.direction = 'left';
            }
        } else if (code == 38) {
            if (that.Sankes.direction != 'bottom') {
                that.Sankes.direction = 'top';
            }
        } else if (code == 39) {
            if (that.Sankes.direction != 'left') {
                that.Sankes.direction = 'right';
            }
        } else if (code == 40) {
            if (that.Sankes.direction != 'top') {
                that.Sankes.direction = 'bottom';
            }
        }
    })
}

Game.prototype.stop = function () {
    clearInterval(timer);
}

Game.prototype.reSet = function () {
    location.reload();

}