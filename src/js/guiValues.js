
export default class guiValues{
    constructor()
    {


        this.displayFps = true;
        this.displayDebugInfo = true;

        this.visibleDancingErrors = false;
        this.visibleErrors = false;
        this.visibleMail = false;
        this.errorsLoiter = false;
        this.visibleBackground = false;
        this.visibleOuterWalls = false;

        this.cameraAnimeation01PosX = 0.0;
        this.cameraAnimeation01PosY = 0.0;
        this.cameraAnimeation01PosZ = 0.0;

        this.cameraAnimeation01LookX = 0.0;
        this.cameraAnimeation01LookY = 0.0;
        this.cameraAnimeation01LookZ = 0.0;
        this.cameraStartFov = 50;
        this.cameraAfterFov = 100;

        this.dancingErrorbaseWindowScale = 1.0;
        this.dancingErrorWorkAreaWidth = 5;
        this.dancingErrorWorkAreaHeight = 7;
        this.dancingErrorTrackAreaWidth = 5;
        this.dancingErrorTrackAreaHeight = 7;
        this.dancingErrorExcursionWidth = 30;
        this.dancingErrorExcursionHeight = 30;
        this.dancingErrorNoiseScaleX = 0.01;
        this.dancingErrorNoiseScaleY = 0.01;
        this.dancingErrorOffsetX = 0;
        this.dancingErrorOffsetY = 0;
        this.errorGuiInterval = 20;
        this.errorGuiColor = [ 0, 128, 255 ];
        this.errorGuiSide = [ 0, 128, 255 ];
        this.errorGuiBack = [ 0, 128, 255 ];



        this.errorPopUpRangeX_min = 0.0;
        this.errorPopUpRangeX_max = 0.0;
        this.errorPopUpRangeY_min = 0.0;
        this.errorPopUpRangeY_max = 0.0;
        this.errorPopUpRangeZ_min = 0.0;
        this.errorPopUpRangeZ_max = 0.0;
        this.diffErrorPosX = 0;
        this.diffErrorPosY = 0;
        this.diffErrorPosZ = 0;
        this.errorPopUpDuration = 0.5;
        this.errorBaseWindowScale = 1.0;




        this.outerWallPositionX = 0.0;
        this.outerWallPositionY = 0.0;
        this.outerWallPositionZ = -2500;


        this.backgroundAnimationX = 0.0;
        this.backgroundAnimationY = 0.0;
        this.backgroundAnimationZ = -50.0;


        this.gradThreshold = 0.0;
        this.gradThresholdDulation = 2.0;


        this.backgroundColor = [255,215,255];



        // this.
    }
}