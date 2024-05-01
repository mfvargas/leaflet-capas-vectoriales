// Objeto mapa
var mapa = L.map("mapaid", { center: [9.5, -84], zoom: 8 });

// Mapa Positron de Carto
var CartoDB_Positron = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }
).addTo(mapa);

// OSM
var OpenStreetMap_Mapnik = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

// ESRI WorldImagery
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

// Capas base
var mapasbase = {
  "Carto Positron": CartoDB_Positron,
  OpenStreetMap: OpenStreetMap_Mapnik,
  "ESRI WorldImagery": Esri_WorldImagery,
};

// Control de capas
control_capas = L.control
  .layers(mapasbase, null, { collapsed: false })
  .addTo(mapa);

// Capa vectorial de polígonos en formato GeoJSON
$.getJSON("datos/asp.geojson", function (geodata) {
  var capa_asp = L.geoJson(geodata, {
    style: function (feature) {
      return { color: "green", weight: 3, fillOpacity: 0.3 };
    },
    onEachFeature: function (feature, layer) {
      var popupText =
        "<strong>Área protegida</strong>: " +
        feature.properties.nombre_asp +
        "<br>" +
        "<strong>Categoría</strong>: " +
        feature.properties.cat_manejo +
        "<br>" +
        "<strong>Estatus</strong>: " +
        feature.properties.estatus;
      layer.bindPopup(popupText);
    },
  }).addTo(mapa);

  control_capas.addOverlay(capa_asp, "ASP");
});

// Capa vectorial de líneas en formato GeoJSON
$.getJSON("datos/via_ferrea.geojson", function (geodata) {
  var capa_via_ferrea = L.geoJson(geodata, {
    style: function (feature) {
      return { color: "brown", weight: 3, fillOpacity: 0.3 };
    },
    onEachFeature: function (feature, layer) {
      var popupText = "<strong>Nombre</strong>: " + feature.properties.nombre;
      layer.bindPopup(popupText);
    },
  }).addTo(mapa);

  control_capas.addOverlay(capa_via_ferrea, "Vía ferrea");
});

// Capa vectorial de puntos en formato GeoJSON
$.getJSON("datos/aerodromos.geojson", function (geodata) {
  var aerodromoIcon = L.divIcon({
    html: '<i class="fa fa-plane-arrival" style="color: red; font-size: 18px;"></i>',
    iconSize: [20, 20], // Dimensiones del ícono
    iconAnchor: [10, 10], // Punto central del ícono
    className: "myDivIcon", // Clase personalizada para más estilos si es necesario
  });

  var capa_aerodromos = L.geoJson(geodata, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: aerodromoIcon });
    },
    style: function (feature) {
      return { color: "black", weight: 3, fillOpacity: 0.3 };
    },
    onEachFeature: function (feature, layer) {
      var popupText = "<strong>Nombre</strong>: " + feature.properties.nombre;
      layer.bindPopup(popupText);
    },
  }).addTo(mapa);

  control_capas.addOverlay(capa_aerodromos, "Aeródromos");
});
