//init view angle
var map = L.map('map', {
  // Set latitude and longitude of the map center (required)
  center: [40.229301, -89.121094],
  // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
  zoom: 5
});

//adding streetmaps
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//draggable circle function
function DraggableCircle(position) {
  let draggableCircle = L.circleMarker(position, {
    color: "#4285F4",
    fillColor: "#4285F4",
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

  return draggableCircle; //returns the circle
}


//create a new polygon using a "mother" point
function ResizeablePolygon(firstPoint) {
  let resizeablePolygon = L.polygon([firstPoint.getLatLng()], {
    color: "#4285F4",
    fillColor: "#F4B400",
    fillOpacity: 0.5,
  }).addTo(map);
  firstPoint.index = 0;
  firstPoint.parentPolygon = resizeablePolygon;
  resizeablePolygon.points = [firstPoint];
  //add point function
  resizeablePolygon.addPoint = function (point) {
    point.parentPolygon = this;
    resizeablePolygon.addLatLng(point.getLatLng());
    this.points.push(point);
    point.index = this.points.length - 1;
  };
  //refreshes the polygon
  resizeablePolygon.refresh = function (index) {
    let updatedLatLngs = resizeablePolygon.getLatLngs();
    updatedLatLngs[0][index] = this.points[index].getLatLng();
    this.redraw();
  };

  return resizeablePolygon;
}

var pointArray = [];


//get lat and long from center of map
function findLatLong(){

  let ctr = map.getCenter();
  
  let lat = Math.round(ctr.lat * 1000000) / 1000000;
  let lon = Math.round(ctr.lng * 1000000) / 1000000;
  
  document.getElementById("latlong").innerHTML = "/tpll " + lat +", "+ lon;
}

//update lat and long
map.on('moveend', findLatLong);

//button code
var index = -1;
var motherPoints = [];
var arrayOfArrays = [];
var disposableArray = [];


function createNewMother()
{
  let ctr = map.getCenter();
  
  let lat = Math.round(ctr.lat * 1000000) / 1000000;
  let lon = Math.round(ctr.lng * 1000000) / 1000000;

  temp = new DraggableCircle([lat, lon]);
  tempPoly = new ResizeablePolygon(temp);
  
  motherPoints.push(tempPoly);

  arrayOfArrays.push(disposableArray);

  index++;
  disposableArray = [];
}

function addChildren()
{
  let ctr = map.getCenter();
  
  let lat = Math.round(ctr.lat * 1000000) / 1000000;
  let lon = Math.round(ctr.lng * 1000000) / 1000000;
  
  temp = new DraggableCircle([lat, lon]);

  disposableArray.push(temp);

  mother = motherPoints[index];

  mother.addPoint(temp);
}

var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  var searchControl = new L.esri.Controls.Geosearch().addTo(map);

  var results = new L.LayerGroup().addTo(map);

  searchControl.on('results', function(data){
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });

setTimeout(function(){$('.pointer').fadeOut('slow');},3400);