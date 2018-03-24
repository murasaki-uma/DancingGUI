export default class CancasPaint
{
    constructor() {
        this.canvas = document.getElementById('paint');

        //レスポンシブ対応 画面サイズでキャンバスサイズを調整します
        // if (screen.width < 860) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext('2d');

        this.defosize
        this.defocolor
        this.defoalpha

        this.mouseX;
        this.mouseY;

        this.init();
        // }
    }

//キャンバスの背景カラーを決定。 fillRectは長方形に塗るメソッド
    init()
    {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(0,0,0,0)";
        this.ctx.fillRect(0, 0, this.width, this.height);

//初期値（サイズ、色、アルファ値）の決定
        this.defosize = 1;
        this.defocolor = "#000";
        this.defoalpha = 1.0;

//マウス継続値の初期値、ここがポイント
        this.mouseX = "";
        this.mouseY = "";

//各イベントに紐づけ
        this.canvas.addEventListener('mousemove', this.onMove, false);
        this.canvas.addEventListener('mousedown', this.onClick, false);
        this.canvas.addEventListener('mouseup', this.drawEnd, false);
        this.canvas.addEventListener('mouseout', this.drawEnd, false);
    }

    reset()
    {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(0,0,0,0)";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

//マウス動いていて、かつ左クリック時に発火。
    onMove =(e)=>
    {
        if (e.buttons === 1 || e.witch === 1) {
            let rect = e.target.getBoundingClientRect();
            let X = ~~(e.clientX - rect.left);
            let Y = ~~(e.clientY - rect.top);
            //draw 関数にマウスの位置を渡す
            this.draw(X, Y);
        };
    }

//マウスが左クリックされると発火。
    onClick =(e)=> {
        if (e.button === 0) {
            let rect = e.target.getBoundingClientRect();
            let X = ~~(e.clientX - rect.left);
            let Y = ~~(e.clientY - rect.top);
            //draw 関数にマウスの位置を渡す
            this.draw(X, Y);
        };
    }

//渡されたマウス位置を元に直線を描く関数
    draw =(X, Y)=> {
        this.ctx.beginPath();
        this.ctx.globalAlpha = this.defoalpha;
        //マウス継続値によって場合分け、直線の moveTo（スタート地点）を決定
        if (this.mouseX === "") {
            //継続値が初期値の場合は、現在のマウス位置をスタート位置とする
            this.ctx.moveTo(X, Y);
        } else {
            //継続値が初期値ではない場合は、前回のゴール位置を次のスタート位置とする
            this.ctx.moveTo(this.mouseX, this.mouseY);
        }
        //lineTo（ゴール地点）の決定、現在のマウス位置をゴール地点とする
        this.ctx.lineTo(X, Y);
        //直線の角を「丸」、サイズと色を決める
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = this.defosize;
        this.ctx.strokeStyle = this.defocolor;
        this.ctx.stroke();
        //マウス継続値に現在のマウス位置、つまりゴール位置を代入
        this.mouseX = X;
        this.mouseY = Y;
    }

//左クリック終了、またはマウスが領域から外れた際、継続値を初期値に戻す
     drawEnd =()=> {
         this.mouseX = "";
         this.mouseY = "";
    }

//メニューのアイコン関係
// var menuIcon = document.getElementsByClassName("menuicon");
// for (i = 0; i < menuIcon.length; i++) {
//     menuIcon[i].addEventListener("click", canvasMenu, false)
// }

//メニューボタン管理
// function canvasMenu() {
//     //id 値によって場合分け
//     var thisId = this.id;
//     if (thisId.indexOf("size") + 1) {
//         defosize = ~~this.id.slice(4, this.id.length);
//     }
//     if (thisId.indexOf("color") + 1) {
//         defocolor = "#" + this.id.slice(5, this.id.length);
//     }
//     if (thisId.indexOf("alpha") + 1) {
//         defoalpha = (~~this.id.slice(5, this.id.length)) / 10;
//     }
//     if (thisId.indexOf("clear") + 1) {
//         //全消しボタン、OKされた場合は fillRect 長方形で覆います
//         if (confirm("すべて消去しますか？")) {
//             ctx.beginPath();
//             ctx.fillStyle = "#f5f5f5";
//             ctx.globalAlpha = 1.0;
//             ctx.fillRect(0, 0, 700, 400);
//         }
//     }
// }
}