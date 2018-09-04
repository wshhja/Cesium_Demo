define(function () {
    var Exchange=function (viewer,infoBox) {

        var layerCollections=viewer.scene.imageryLayers;
        var dian,wei;
        $("#weixing").click(function () {
            infoBox.viewModel.description="切换卫星地图";
            if(layerCollections.contains(dian)){
                layerCollections.remove(dian);
            }
        });

        $("#dizi").click(function () {
            infoBox.viewModel.description="切换电子地图";
            if(layerCollections.contains(dian)){
                layerCollections.raiseToTop(dian);
            }
            else {
                dian=layerCollections.addImageryProvider(new  Cesium.ArcGisMapServerImageryProvider({
                    url : '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
                }));
            }
        });
    };
    return Exchange;
});