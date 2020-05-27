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

var DraggableCircle = L.Circle.extend({
  initialize: function (name, options) {
    this.name = name;
    L.setOptions(this, options);
    this.setRadius(2);
    this.setLatLng([54.069223, -4.768973]);
    this.on({
      mousedown: function () {
        map.on("mousemove", this.moveObject);
      },
      click: function () {
        map.off("mousemove", this.moveObject);
        map.dragging.enable();
      },
    });
    this.addTo(map);
  },

  moveObject: function (event) {
    L.Circle.prototype.setLatLng.call(this, event.latlng);
    map.dragging.disable();
  },
});

var testCircle = new DraggableCircle("Draggable", {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 1,
  interactive: true,
});

/* var circle = L.circle([54.069122, -4.769456], 2, {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 1,
  interactive: true,
}).addTo(map);

circle.on({
  mousedown: function () {
    map.on("mousemove", moveObject);
  },
  click: function () {
    map.off("mousemove", moveObject);
    map.dragging.enable();
  },
});

function moveObject(event) {
  circle.setLatLng(event.latlng);
  map.dragging.disable();
} */
