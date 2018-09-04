require(['./mark/Dot','./measure/Measure','./exchange/Exchange'],function (Dot,Measure,Exchange) {
    //////////////////////////////////////////////////////////////////////////
    // Creating the Viewer
    //////////////////////////////////////////////////////////////////////////

    var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: true,
        scene3DOnly: false,
        selectionIndicator: false,
        baseLayerPicker: false,
        canvas:false,
        infoBox:true,
        geocoder:false,
        sceneModePicker: true,
        homeButton: false,
        timeline: true,
        fullscreenButton: false,
        navigationHelpButton: false
    });
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    var infoBox=new Cesium.InfoBox("info");
    infoBox.viewModel.showInfo=true;
    infoBox.viewModel.titleText="Info:";
    // viewer.terrainProvider = Cesium.createWorldTerrain({
    //     requestWaterMask : true, // required for water effects
    //     requestVertexNormals : true // required for terrain lighting
    // });

    new Dot(viewer,infoBox,handler);
    new Measure(viewer,infoBox,handler);
    new Exchange(viewer,infoBox);
});