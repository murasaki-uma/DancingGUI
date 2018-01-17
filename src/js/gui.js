/**
 * Created by PurpleUma on 2018/01/06.
 */
import dat from '../../node_modules/dat.gui/build/dat.gui.min'

import guiValues from './guiValues'
const setting = require('./json/gui.json');
export default class GUI{
    constructor()
    {
        this.values = new guiValues();
        // this.gui = new dat.GUI();
        this.gui = new dat.GUI({load:setting});
        this.gui.width = 400;



        this.gui.remember(this.values);


        this.visibles = this.gui.addFolder('visibles');

        this.animationSettings= this.gui.addFolder('animation settings');
        this.cameraAnimation = this.gui.addFolder('camera animation');
        this.errorGui = this.gui.addFolder('error gui');
        this.background = this.gui.addFolder('background');



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

        this.init();
    }

    init()
    {

        this.visibleOuterWalls = this.visibles.add(this.values,'visibleOuterWalls');
        this.visibleBackground = this.visibles.add(this.values,'visibleBackground');
        this.visibleDancingErrors = this.visibles.add(this.values,'visibleDancingErrors');
        this.visibleErrors = this.visibles.add(this.values,'visibleErrors');
        this.visibleMail = this.visibles.add(this.values,'visibleMail');
        this.errorsLoiter = this.animationSettings.add(this.values,'errorsLoiter');

        this.cameraAnimation.add(this.values,'cameraAnimeation01PosX',-150,150);
        this.cameraAnimation.add(this.values,'cameraAnimeation01PosY',-150,150);
        this.cameraAnimation.add(this.values,'cameraAnimeation01PosZ',-150,150);

        this.cameraAnimation.add(this.values,'cameraAnimeation01LookX',-150,150);
        this.cameraAnimation.add(this.values,'cameraAnimeation01LookY',-150,150);
        this.cameraAnimation.add(this.values,'cameraAnimeation01LookZ',-150,150);


        this.background.add(this.values,'backgroundAnimationX',-150,150);
        this.background.add(this.values,'backgroundAnimationY',-150,150);
        this.background.add(this.values,'backgroundAnimationZ',-1000,500);


        this.errorGui.add(this.values,'errorGuiInterval',0.80);
        this.errorGuiColor = this.errorGui.addColor(this.values,'errorGuiColor');

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



        this.gradThreshold = this.errorGui.add(this.values,'gradThreshold', 0.0,1.0);

        this.errorGui.add(this.values,'gradThresholdDulation', 0.0,5.0);
    }
}