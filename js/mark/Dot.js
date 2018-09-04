define(function () {
  var pointArray = new Array(); //point
  var pointArrayLength = 0;

  var lineArray = new Array(); //line{'line','point1','point2'}
  var lineArrayLength = 0;
  var line;

  var polygonArray = new Array();
  var polygonArrayLength = 0;
  var polygon;

  var picArray = new Array();
  var picArrayLength = 0;
  var pic;
  var Dot = function (viewer, infoBox, handler) {
    $("#dot").click(function () {
      if (line !== undefined) {
        lineArrayLength++;
        line = undefined;
      }
      if (polygon !== undefined) {
        polygonArrayLength++;
        polygon = undefined;
      }
      var drawForDot = new drawDot(viewer, infoBox, handler);
    });

    $("#line").click(function () {
      if (line !== undefined) {
        lineArrayLength++;
        line = undefined;
      }
      if (polygon !== undefined) {
        polygonArrayLength++;
        polygon = undefined;
      }
      var drawForLine = new drawLine(viewer, infoBox, handler);
      infoBox.viewModel.description = "请选择第1个点";
    });

    $("#plane").click(function () {
      if (line !== undefined) {
        lineArrayLength++;
        line = undefined;
      }
      if (polygon !== undefined) {
        polygonArrayLength++;
        polygon = undefined;
      }
      // var drawForPlane=new
      drawPlane(viewer, infoBox, handler);
      infoBox.viewModel.description = "请选择第1个点";
    });

    $("#reset").click(function () {
      viewer.entities.removeAll();
      for (var i = 0; i < pointArrayLength; i++) {
        pointArray.pop();
      }

      for (var i = 0; i < lineArrayLength; i++) {
        lineArray.pop();
      }

      for (var i = 0; i < polygonArrayLength; i++) {
        polygonArray.pop();
      }
      lineArrayLength = 0;
      pointArrayLength = 0;
      polygonArrayLength = 0;
      handler.setInputAction(function (event) {

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      infoBox.viewModel.description = "";
      // viewer.camera.flyTo({
      //     destination : Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 1.0)
      // });
      // viewer.camera.zoomOut(1);
    })

    $("#pic").click(function () {
      drawPic(viewer, infoBox, handler);
    })
  }


  function getPosition(event) { //获得窗体位置坐标
    var windowPosition;
    var pos = event.position || window.event;
    windowPosition = new Cesium.Cartesian2(pos.x, pos.y);
    return windowPosition;
  }

  var drawDot = function (viewer, infoBox, handler) {
    infoBox.viewModel.description = "画点";
    handler.setInputAction(function (event) {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var windowPosition = getPosition(event);
      var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);

      var point = viewer.entities.add({
        name: 'dot',
        position: cartesian,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 4,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1
        }
      });
      pointArray[pointArrayLength] = point;
      infoBox.viewModel.description = "";
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  var drawLine = function (viewer, infoBox, handler) {
    var index = 0;
    var points = new Array();
    var lat, lon;
    handler.setInputAction(function (event) {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var windowPosition = getPosition(event);
      var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
      //经纬度转换

      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
      lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

      if (index === 0) {
        var point = viewer.entities.add({
          name: 'line_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        point = { "point": point, "lat": lat, "lon": lon };
        infoBox.viewModel.description = "请选择第" + (index + 2) + "个端点";
        points[index++] = point;
      } else {
        var point = viewer.entities.add({
          name: 'line_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        point = { "point": point, "lat": lat, "lon": lon };
        points[index++] = point;
        line = viewer.entities.add({
          name: "line",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([points[index - 2].lon, points[index - 2].lat, points[index - 1].lon, points[index - 1].lat]),
            width: 1,
            material: Cesium.Color.RED
          }
        });
        line = { 'line': line, 'points': points };
        infoBox.viewModel.description = "请选择第" + (index + 1) + "个端点";
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  function drawPlane(viewer, infoBox, handler) {
    var index = 0;
    var points = new Array();
    var lat, lon;
    var array = new Array();
    handler.setInputAction(function (event) {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var windowPosition = getPosition(event);
      var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
      //经纬度转换

      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
      lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

      array[2 * index] = lon;
      array[2 * index + 1] = lat;
      if (index < 2) {
        var point = viewer.entities.add({
          name: 'plane_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.BLUE,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        point = { "point": point, "lat": lat, "lon": lon };
        points[index] = point;
        index++;
      } else {
        var point = viewer.entities.add({
          name: 'plane_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.BLUE,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        point = { "point": point, "lat": lat, "lon": lon };
        points[index] = point;
        if (index !== 2) {
          viewer.entities.remove(polygon.plane);
        }
        polygon = viewer.entities.add({
          name: "plane",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(array),
            material: Cesium.Color.RED.withAlpha(0.5),
            outlineColor: Cesium.Color.BLACK,
            outline: true
          }
        });
        polygon = { 'plane': polygon, 'points': points };
        polygonArray[polygonArrayLength] = polygon;
        index++;
      }
      infoBox.viewModel.description = "请选择第 " + (index + 1) + " 个点";
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  }

  function drawPic(viewer, infoBox, handler) {
    infoBox.viewModel.description = "请在需要标注的地方选取一点";
    var lon, lat;
    var array = new Array();
    var points = new Array();
    var index;
    handler.setInputAction(function (event) {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var windowPosition = getPosition(event);
      var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
      //经纬度转换

      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
      lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

      array[2 * index] = lon;
      array[2 * index + 1] = lat;
      var point = viewer.entities.add({
        name: 'dot',
        position: cartesian,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 4,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1
        }
      });
      pic = viewer.entities.add({
        name: 'pic',
        position: cartesian,
        billboard: {
          image: "./Source/fire.jpg",
          width: 50,
          height: 50
        }
      });
      picArray[picArrayLength++] = pic;
      infoBox.viewModel.description = "";
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  return Dot;
});
