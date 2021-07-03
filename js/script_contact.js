function afficheMap() {

  var lat = 48.708998;
  var lon = 2.163917;
  var icon_file = "https://cdn1.iconfinder.com/data/icons/money-finance-set-2/512/29-512.png";

  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

  var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);

  $("#map").empty(); // Fonctionne jusque là
  console.log("test");

  map = new OpenLayers.Map("map");
  var mapnik = new OpenLayers.Layer.OSM();
  map.addLayer(mapnik);

  var size = new OpenLayers.Size(50, 50);
  var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
  var icon = new OpenLayers.Icon(icon_file, size, offset);

  var marker = new OpenLayers.Marker(position, icon.clone());

  var markers = new OpenLayers.Layer.Markers();
  map.addLayer(markers);
  markers.addMarker(marker);

  var zoom = 10;
  map.setCenter(position, zoom);
};