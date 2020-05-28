var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var polygon = L.polygon([
  [54.069122, -4.769456],
  [54.069223, -4.768973],
  [54.069465, -4.769123],
  [54.069368, -4.769606],
]).addTo(map);

function DraggableCircle(position) {
  let draggableCircle = L.circleMarker(position, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 1,
    interactive: true,
    radius: 3,
  }).addTo(map);
  draggableCircle.parentPolygon = null;
  draggableCircle.index = null;
  draggableCircle.on({
    mousedown: function () {
      map.dragging.disable();
      map.on("mousemove", function (e) {
        draggableCircle.setLatLng(e.latlng);
        draggableCircle.parentPolygon.refresh(draggableCircle.index);
      });
    },
  });
  map.on("mouseup", function (e) {
    map.dragging.enable();
    map.removeEventListener("mousemove");
  });

  return draggableCircle;
}

var testCircle = new DraggableCircle([54.069368, -4.769606]);

function ResizeablePolygon(firstPoint) {
  let resizeablePolygon = L.polygon([firstPoint.getLatLng()], {
    color: "green",
    fillColor: "#f03",
    fillOpacity: 0.5,
  }).addTo(map);
  firstPoint.index = 0;
  firstPoint.parentPolygon = resizeablePolygon;
  resizeablePolygon.points = [firstPoint];

  resizeablePolygon.addPoint = function (point) {
    point.parentPolygon = this;
    resizeablePolygon.addLatLng(point.getLatLng());
    this.points.push(point);
    point.index = this.points.length - 1;
  };

  resizeablePolygon.refresh = function (index) {
    let updatedLatLngs = resizeablePolygon.getLatLngs();
    updatedLatLngs[0][index] = this.points[index].getLatLng();
    this.redraw();
  };

  return resizeablePolygon;
}

var testPoly = new ResizeablePolygon(testCircle);

testPoly.addPoint(new DraggableCircle([54.069465, -4.769123]));

testPoly.addPoint(new DraggableCircle([54.069223, -4.768973]));

testPoly.addPoint(new DraggableCircle([54.069122, -4.769456]));
