/**
 * Created by PurpleUma on 2018/01/06.
 */
import dat from '../../node_modules/dat.gui/build/dat.gui.min'

import guiValues from './guiValues'

export default class GUI{
    constructor()
    {
        this.values = new guiValues();
        this.gui = new dat.GUI();

        this.gui.width = 400;



        this.gui.remember(this.values);

        this.visibles = this.gui.addFolder('visibles');

        this.cameraAnimation = this.gui.addFolder('camera animation');
        this.errorGui = this.gui.addFolder('error gui');
        this.background = this.gui.addFolder('background');



        this.visibleDancingErrors;
        this.errorGuiColor;
        this.gradThreshold;

        this.init();
    }

    init()
    {

        this.visibleDancingErrors = this.visibles.add(this.values,'visibleDancingErrors');

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



        this.gradThreshold = this.errorGui.add(this.values,'gradThreshold', 0.0,1.0);

        this.errorGui.add(this.values,'gradThresholdDulation', 0.0,5.0);
    }
}