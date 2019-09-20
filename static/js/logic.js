
// API key
const API_KEY = "pk.eyJ1IjoiajY5MjEiLCJhIjoiY2swanNoamRuMDFyZzNidXBkMXJ1bWhjbSJ9.y5QNFmDyUeHFWx-I8igKSA";

// Assemble API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

  // Creating map object
  var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 2,
    //layers: [streetmap, earthquakes]
    })

    // Adding tile layer to the map
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);

    // Define a markerSize function that will give each city a different radius based on its population
    function markerSize(mag) {
      return mag*40000;}

// Grab the data with d3
d3.json(url, function(response) {

    console.log(response);



    // // Define a function we want to run once for each feature in the features array
    // // Give each feature a popup describing the place and time of the earthquake
    // function onEachFeature(feature, layer) {
    //   layer.bindPopup("<h3>" + feature.properties.place +
    //     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    // }

    // // Create a GeoJSON layer containing the features array on the earthquakeData object
    // // Run the onEachFeature function once for each piece of data in the array
    // var earthquakes = L.geoJSON(response, {
    //   onEachFeature: onEachFeature
    // });
    // Loop through the cities array and create one marker for each city object
  for (var i = 0; i < response.features.length; i++) {
    var earthquakelocation = [response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]
    L.circle(earthquakelocation, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: "purple",
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: markerSize(response.features[i].properties.mag)
    }).bindPopup("<h3>" + response.features[i].properties.place + "</h3><hr><p>" + new Date(response.features[i].properties.time) + "</p>").addTo(myMap);
  }

  });