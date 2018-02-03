'use strict'
import * as THREE from 'three'
import 'imports-loader?THREE=three!../../node_modules/three/examples/js/controls/OrbitControls';
import Gui from "./gui";
import Stats from '../../node_modules/stats-js';
export default class SceneManager{
    constructor(guijson)
    {

        // this.bpmCalculater = bpmCalculater;

        this.width = window.innerWidth;
        this.height= window.innerHeight;
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,antialias:true,alpha:true
        });
        this.debugCamera = new THREE.PerspectiveCamera(50,this.width/this.height,0.1,10000);
        this.DEBUG_MODE = false;
        this.activeCamera = null;
        this.frameCount = 0;


        this.isRecord = false;

        this.stats;


        this.frameFraction = 4;
        this.renderFraction = 4;





        this.scenes = [];
        this.sceneNum = 0;




        this.gui = new Gui(guijson);
        this.init();
    }



    init()
    {



        this.debugCamera.position.set(0,0,500);
        // this.renderer.setPixelRatio(1);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(this.width,this.height);

        this.renderer.antialias = true;
        this.renderer.domElement.id = "out";
        document.getElementById('mainrender').appendChild( this.renderer.domElement );
        window.addEventListener('resize',this.onWindowResize.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener( 'click', this.onClick.bind(this), false );
        window.addEventListener('mousemove',this.mouseMove);



        let controls = new THREE.OrbitControls( this.debugCamera );
        controls.enableKeys = false;



        this.onWindowResize();
        this.cameraChange();

        this.stats = new Stats();
        document.body.appendChild(this.stats.domElement);

        console.log(this.stats);
        if(this.gui.values.displayFps)
        {
            this.stats.domElement.style.display = "block"
        } else
        {
            this.stats.domElement.style.display = "none"
        }

        // this.update();
    }

    addScene(scene)
    {
        this.scenes.push(scene);
        this.cameraChange();
    }

    mouseMove=(e)=>
    {

        this.scenes[this.sceneNum].mouseMove(e);
    }

    onKeyDown(e)
    {
        if(e.key == 'd')
        {
            this.debug();
        }

        if(e.key == 's')
        {
            this.saveCanvas('image/png');
        }



        console.log(e);

        if(this.scenes.length > 0)
        {
            this.scenes[this.sceneNum].onKeyDown(e);
        }


    }

    debug()
    {
        this.DEBUG_MODE = !this.DEBUG_MODE;
        this.cameraChange();
    }
    cameraChange()
    {
        if(this.scenes.length > 0)
        {



            if(this.DEBUG_MODE)
            {
                this.activeCamera = this.debugCamera;
            }else
            {
                this.activeCamera = this.scenes[this.sceneNum].camera;
            }

        }


        console.log(this.activeCamera);
    }


    onWindowResize (e)
    {

        this.debugCamera.aspect = window.innerWidth / window.innerHeight;
        this.debugCamera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        if(this.scenes.length != 0)
        {
            this.scenes[this.sceneNum].onWindowResize(e);
        }



    }

    onClick(e)
    {
        if(this.scenes.length != 0) {
            this.scenes[this.sceneNum].onClick(e);
        }
    }

    update =() =>
    {

        requestAnimationFrame(this.update);
        this.frameCount++;
        // if(this.frameCount % 2 == 0) { return; }

        this.stats.update();


        // this.frameCount = this.frameCount % 60;



        if(this.scenes.length != 0) {
            this.scenes[this.sceneNum].update(this.frameCount);


            if(this.frameCount % this.frameFraction == 0)
            {


                if(this.DEBUG_MODE)
                {
                    this.renderer.render(this.scenes[this.sceneNum].scene,this.scenes[this.sceneNum].camera);
                } else
                {
                    this.renderer.render(this.scenes[this.sceneNum].scene,this.debugCamera);
                }

                this.renderer.render(this.scenes[this.sceneNum].scene,this.activeCamera);
            }
        }
    }

    saveJson(storageObj)
    {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj))
        let downloadLink = document.createElement('a')
        downloadLink.setAttribute("href",dataStr)
        downloadLink.setAttribute("download", "data.json")
        downloadLink.click()
    }



    //
    // download(name) {
    //     var blob = new Blob([this.renderer.domElement.toDataURL()]);
    //
    //     var a = document.createElement("a");
    //     a.href = URL.createObjectURL(blob);
    //     a.target = '_blank';
    //     a.download = name;
    //     a.click();
    // }


    saveCanvas(saveType){
        let imageType = "image/png";
        let fileName = "sample.png";
        // if(saveType === "jpeg"){
        //     imageType = "image/jpeg";
        //     fileName = "sample.jpg";
        // }
        // console.log(this.renderer.domElement.toDataURL());
        let canvas = document.getElementById("out");
        // base64エンコードされたデータを取得 「data:image/png;base64,iVBORw0k～」
        let base64 = canvas.toDataURL();
        // console.log(base64);
        // base64データをblobに変換
        let blob = this.Base64toBlob(base64);
        // blobデータをa要素を使ってダウンロード
        this.saveBlob(blob, fileName);
    }

    Base64toBlob(base64)
    {
        // カンマで分割して以下のようにデータを分ける
        // tmp[0] : データ形式（data:image/png;base64）
        // tmp[1] : base64データ（iVBORw0k～）
        let tmp = base64.split(',');
        // base64データの文字列をデコード
        let data = atob(tmp[1]);
        // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
        let mime = tmp[0].split(':')[1].split(';')[0];
        //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
        let buf = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            buf[i] = data.charCodeAt(i);
        }
        // blobデータを作成
        let blob = new Blob([buf], { type: mime });
        return blob;
    }

// 画像のダウンロード
    saveBlob(blob, fileName)
    {
        let url = (window.URL || window.webkitURL);
        // ダウンロード用のURL作成
        let dataUrl = url.createObjectURL(blob);
        // イベント作成
        let event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // a要素を作成
        let a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        // ダウンロード用のURLセット
        a.href = dataUrl;
        // ファイル名セット
        a.download = fileName;
        // イベントの発火
        a.dispatchEvent(event);
    }

    toBlob(base64) {
        var bin = atob(base64.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        try{
            var blob = new Blob([buffer.buffer], {
                type: 'image/png'
            });
        }catch (e){
            return false;
        }
        return blob;
    }
}