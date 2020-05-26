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

var circle = L.circle([54.069122, -4.769456], 2, {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 1,
  interactive: true,
}).addTo(map);

circle.on("click");
