define(function () {

  var EARTH_RADIUS = 6378137.0; //单位M

  var PI = Math.PI;

  var earthRadiusMeters = 6371000.0;
  var metersPerDegree = 2.0 * Math.PI * earthRadiusMeters / 360.0;
  var radiansPerDegree = Math.PI / 180.0;
  var degreesPerRadian = 180.0 / Math.PI;

  function getRad(d) {
    return d * PI / 180.0;
  }

  function getFlatternDistance(lat1, lng1, lat2, lng2) {
    var f = getRad((lat1 + lat2) / 2);
    var g = getRad((lat1 - lat2) / 2);
    var l = getRad((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;
    s = sg * (1 - sl) + (1 - sf) * sl;

    c = (1 - sg) * (1 - sl) + sf * sl;
    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;

    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  }

  function getAngle(l1, l2, l3) {
    return Math.acos((l1 * l1 + l2 * l2 - l3 * l3) / (2 * l1 * l2)) * 180 / Math.PI;
  }

  function getPosition(event) { //获得窗体位置坐标
    var windowPosition;
    var pos = event.position || window.event;
    windowPosition = new Cesium.Cartesian2(pos.x, pos.y);
    return windowPosition;
  }

  var calLength = function (viewer, infoBox, handler) {
    var index = 0;
    var points = new Array();
    var lat, lon;
    var length = 0;
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
        infoBox.viewModel.description = "请选择第2个端点";
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
        var line = viewer.entities.add({
          name: "line",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([points[index - 2].lon, points[index - 2].lat, points[index - 1].lon, points[index - 1].lat]),
            width: 1,
            material: Cesium.Color.RED
          }
        });
        length = length + getFlatternDistance(points[index - 2].lat, points[index - 2].lon, points[index - 1].lat, points[index - 1].lon);
        if (length < 1000) {
          infoBox.viewModel.description = "线段长度为" + length.toFixed(2) + "米";
        } else {
          infoBox.viewModel.description = "线段长度为" + (length / 1000).toFixed(2) + "公里";
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  var calAngle = function (viewer, infoBox, handler) {
    var index = 0;
    var point1, point2, point3;
    var lat, lon;
    var length = 0;
    handler.setInputAction(function (event) {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var windowPosition = getPosition(event);
      var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
      //经纬度转换

      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
      lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

      if (index === 0) {
        point1 = viewer.entities.add({
          name: 'line_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        point1 = { "point": point1, "lat": lat, "lon": lon };
        infoBox.viewModel.description = "请选择第1个端点";
        index++;
      } else if (index === 1) {
        point2 = viewer.entities.add({
          name: 'line_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        point2 = { "point": point2, "lat": lat, "lon": lon };
        var line = viewer.entities.add({
          name: "line",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([point1.lon, point1.lat, point2.lon, point2.lat]),
            width: 1,
            material: Cesium.Color.RED
          }
        });
        infoBox.viewModel.description = "请选择第2个端点";
        index++;
      } else {
        point3 = viewer.entities.add({
          name: 'line_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        point3 = { "point": point3, "lat": lat, "lon": lon }
        var line = viewer.entities.add({
          name: "line",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([point1.lon, point1.lat, point3.lon, point3.lat]),
            width: 1,
            material: Cesium.Color.RED
          }
        });
        var l1 = getFlatternDistance(point1.lat, point1.lon, point2.lat, point2.lon).toFixed(2);
        var l2 = getFlatternDistance(point1.lat, point1.lon, point3.lat, point3.lon).toFixed(2);
        var l3 = getFlatternDistance(point2.lat, point2.lon, point3.lat, point3.lon).toFixed(2);
        var angle = getAngle(l1, l2, l3).toFixed(3);
        infoBox.viewModel.description = "角度为" + angle + "°";
        index = 0;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  var calArea = function (viewer, infoBox, handler) {
    var index = 0;
    var pointArr = new Array();
    var array = new Array();
    var lat, lon;
    var area = 0;
    var polygon
    handler.setInputAction(function (event) {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var windowPosition = getPosition(event);
      var cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
      //经纬度转换

      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
      lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));
      pointArr[2 * index] = lon;
      pointArr[2 * index + 1] = lat;
      array[index] = [lon, lat];

      if (index < 2) {
        viewer.entities.add({
          name: 'line_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        index++;
      } else {
        if (index !== 2) {
          viewer.entities.remove(polygon);
        }
        viewer.entities.add({
          name: 'line_dot',
          position: cartesian,
          point: {
            color: Cesium.Color.GREEN,
            pixelSize: 4,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });
        polygon = viewer.entities.add({
          name: "plane",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(pointArr),
            material: Cesium.Color.RED.withAlpha(0.5),
            outlineColor: Cesium.Color.BLACK,
            outline: true
          }
        });
        area = calculateArea(array).toFixed(3);
        if (area < 1000000.0) {
          infoBox.viewModel.description = "面积为" + area + "平方米";
        } else {
          infoBox.viewModel.description = "面积为" + (area / 1000000).toFixed(3) + "平方公里";
        }
        index++;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  function calculateArea(points) {
    var areaMeters2 = PlanarPolygonAreaMeters2(points);
    if (areaMeters2 > 1000000.0) {
      areaMeters2 = SphericalPolygonAreaMeters2(points);
    }
    return areaMeters2;
  }

  /*球面多边形面积计算*/
  function SphericalPolygonAreaMeters2(points) {
    var totalAngle = 0;
    for (var i = 0; i < points.length; i++) {
      var j = (i + 1) % points.length;
      var k = (i + 2) % points.length;
      totalAngle += Angle(points[i], points[j], points[k]);
    }
    var planarTotalAngle = (points.length - 2) * 180.0;
    var sphericalExcess = totalAngle - planarTotalAngle;
    if (sphericalExcess > 420.0) {
      totalAngle = points.length * 360.0 - totalAngle;
      sphericalExcess = totalAngle - planarTotalAngle;
    } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
      sphericalExcess = Math.abs(360.0 - sphericalExcess);
    }
    return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
  }

  /*角度*/
  function Angle(p1, p2, p3) {
    var bearing21 = Bearing(p2, p1);
    var bearing23 = Bearing(p2, p3);
    var angle = bearing21 - bearing23;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }


  /*方向*/
  function Bearing(from, to) {
    var lat1 = from[1] * radiansPerDegree;
    var lon1 = from[0] * radiansPerDegree;
    var lat2 = to[1] * radiansPerDegree;
    var lon2 = to[0] * radiansPerDegree;
    var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
      angle += Math.PI * 2.0;
    }
    angle = angle * degreesPerRadian;
    return angle;
  }

  /*平面多边形面积*/
  function PlanarPolygonAreaMeters2(points) {
    var a = 0;
    for (var i = 0; i < points.length; ++i) {
      var j = (i + 1) % points.length;
      var xi = points[i][0] * metersPerDegree * Math.cos(points[i][1] * radiansPerDegree);
      var yi = points[i][1] * metersPerDegree;
      var xj = points[j][0] * metersPerDegree * Math.cos(points[j][1] * radiansPerDegree);
      var yj = points[j][1] * metersPerDegree;
      a += xi * yj - xj * yi;
    }
    return Math.abs(a / 2);
  }

  var Measure = function (viewer, infoBox, handler) {
    $("#distance").click(function () {
      new calLength(viewer, infoBox, handler);
    });

    $("#angle").click(function () {
      new calAngle(viewer, infoBox, handler);
      infoBox.viewModel.description = "角度测量，请选择角顶点";
    });

    $("#area").click(function () {
      infoBox.viewModel.description = "面积测量中。。。";
      new calArea(viewer, infoBox, handler);
    });
  }

  return Measure;
});
