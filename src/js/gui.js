/**
 * Created by PurpleUma on 2018/01/06.
 */
import dat from '../../node_modules/dat.gui/build/dat.gui.min'

import guiValues from './guiValues'
// const setting = require('./JSON/gui.json');
export default class GUI{
    constructor(json)
    {
        // console.log(setting);
        this.values = new guiValues();
        // this.gui = new dat.GUI();
        this.gui = new dat.GUI({load:json});
        this.gui.width = 400;



        this.gui.remember(this.values);


        // this.renderer = this.gui.addFolder('renderer');
        this.visibles = this.gui.addFolder('visibles');

        this.animationSettings= this.gui.addFolder('animation settings');
        this.cameraAnimation = this.gui.addFolder('camera animation');
        this.dancingErrors = this.gui.addFolder('dancing errors');
        this.errorGui = this.gui.addFolder('error gui');
        this.background = this.gui.addFolder('background');
        this.outerWall = this.gui.addFolder('outerWall');
        this.dom = this.gui.addFolder('dom');



        this.visibleOuterWalls;
        this.visibleDancingErrors;
        this.visibleErrors;
        this.visibleBackground;
        this.visibleMail;
        this.errorGuiColor;
        this.errorGuiSide;
        this.errorGuiBack;
        this.gradThreshold;
        this.errorsLoiter;
        this.dancingErrorbaseWindowScale;
        this.errorBaseWindowScale;
        this.displayFps;
        this.displayDebugInfo;

        this.outerWallPositionX;
        this.outerWallPositionY;
        this.outerWallPositionZ;

        this.backgroundColor;
        this.backgroundEndColor;

        this.outerStartColor;
        this.outerEndColor;

        this.init();



        dat.GUI.toggleHide();
    }

    init()
    {


        this.animationSettings.add(this.values,'fpsDenominator',1,60);

        this.animationSettings.add(this.values,'animationDulation01',1,60);

        this.animationSettings.add(this.values,'animationDulation02',1,60);

        this.animationSettings.add(this.values,'animationDulation03',1,60);

        this.animationSettings.add(this.values,'animationDulation04',1,60);


        this.visibleOuterWalls = this.visibles.add(this.values,'visibleOuterWalls');
        this.visibleBackground = this.visibles.add(this.values,'visibleBackground');
        this.visibleDancingErrors = this.visibles.add(this.values,'visibleDancingErrors');
        this.visibleErrors = this.visibles.add(this.values,'visibleErrors');
        this.visibleMail = this.visibles.add(this.values,'visibleMail');
        this.errorsLoiter = this.animationSettings.add(this.values,'errorsLoiter');

        this.displayFps = this.visibles.add(this.values,'displayFps');
        this.displayDebugInfo = this.visibles.add(this.values,'displayDebugInfo');


        this.cameraAnimation.add(this.values,'cameraStartFov',0,100);

        this.cameraAnimation.add(this.values,'cameraAfterFov',0,100);

        this.cameraAnimation.add(this.values,'cameraAnimeation01PosX',-250,250);
        this.cameraAnimation.add(this.values,'cameraAnimeation01PosY',-250,250);
        this.cameraAnimation.add(this.values,'cameraAnimeation01PosZ',-250,250);

        this.cameraAnimation.add(this.values,'cameraAnimeation01LookX',-150,150);
        this.cameraAnimation.add(this.values,'cameraAnimeation01LookY',-150,150);
        this.cameraAnimation.add(this.values,'cameraAnimeation01LookZ',-150,150);


        this.background.add(this.values,'backgroundAnimationX',-150,150);
        this.background.add(this.values,'backgroundAnimationY',-150,150);
        this.background.add(this.values,'backgroundAnimationZ',-1000,500);


        this.dancingErrorbaseWindowScale = this.dancingErrors.add(this.values,'dancingErrorbaseWindowScale', 0.0,2.0);
        this.dancingErrors.add(this.values,'errorGuiInterval',0.80);
        this.errorGuiColor = this.dancingErrors.addColor(this.values,'errorGuiColor');

        this.dancingErrors.add(this.values,'dancingErrorOffsetX',-20.0,20.0);
        this.dancingErrors.add(this.values,'dancingErrorOffsetY',-20.0,20.0);
        this.dancingErrors.add(this.values,'dancingErrorNoiseScaleX',0.0,0.1);
        this.dancingErrors.add(this.values,'dancingErrorNoiseScaleY',0.0,0.1);
        this.dancingErrors.add(this.values,'dancingErrorWorkAreaWidth',0.0,40.0);
        this.dancingErrors.add(this.values,'dancingErrorWorkAreaHeight',0.0,40.0);
        this.dancingErrors.add(this.values,'dancingErrorTrackAreaWidth',0.0,50.0);
        this.dancingErrors.add(this.values,'dancingErrorTrackAreaHeight',0.0,50.0);
        this.dancingErrors.add(this.values,'dancingErrorExcursionWidth',0.0,50.0);
        this.dancingErrors.add(this.values,'dancingErrorExcursionHeight',0.0,50.0);

        this.errorGuiSide = this.errorGui.addColor(this.values,'errorGuiSide');
        this.errorGuiBack = this.errorGui.addColor(this.values,'errorGuiBack');

        this.errorGui.add(this.values,'errorPopUpRangeX_min',-300,300);
        this.errorGui.add(this.values,'errorPopUpRangeX_max',-300,
            300);
        this.errorGui.add(this.values,'errorPopUpRangeY_min',-100,100);
        this.errorGui.add(this.values,'errorPopUpRangeY_max',-100,100);
        this.errorGui.add(this.values,'errorPopUpRangeZ_min',-100,100);
        this.errorGui.add(this.values,'errorPopUpRangeZ_max',-100,100);
        this.errorGui.add(this.values,'diffErrorPosX',0,150);
        this.errorGui.add(this.values,'diffErrorPosY',0,150);
        this.errorGui.add(this.values,'diffErrorPosZ',0,150);
        this.errorGui.add(this.values,'errorPopUpDuration', 0.0, 2.0);
        this.errorBaseWindowScale = this.errorGui.add(this.values,'errorBaseWindowScale',0.0,2.0);


        this.outerWallPositionX = this.outerWall.add(this.values,'outerWallPositionX',-3000,3000);
        this.outerWallPositionY = this.outerWall.add(this.values,'outerWallPositionY',-3000,3000);
        this.outerWallPositionZ = this.outerWall.add(this.values,'outerWallPositionZ',-3000,3000);



        this.gradThreshold = this.errorGui.add(this.values,'gradThreshold', 0.0,1.0);

        this.errorGui.add(this.values,'gradThresholdDulation', 0.0,5.0);

        this.backgroundColor = this.dom.addColor(this.values,'backgroundColor');
        this.backgroundEndColor = this.dom.addColor(this.values,'backgroundEndColor');


        this.outerStartColor = this.outerWall.addColor(this.values,'outerStartColor');
        this.outerEndColor = this.outerWall.addColor(this.values,'outerEndColor');


        if(this.values.displayDebugInfo)
        {
            document.querySelector('.debugInfo').style.display = "block";
        } else
        {
            document.querySelector('.debugInfo').style.display = "none";
        }



        this.displayFps.onChange((e)=>{
            let stats = document.getElementById('stats');
            if(e)
            {
                stats.style.display = "block";
            } else
            {
                stats.style.display = "none";
            }
        })

        this.displayDebugInfo.onChange((e)=>{
            let info = document.querySelector('.debugInfo');
            if(e)
            {
                info.style.display = "block";
            } else
            {
                info.style.display = "none";
            }
        })
    }
}