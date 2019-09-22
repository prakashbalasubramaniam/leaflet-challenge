
// API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 2,    
  })

// Adding tile layer to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
  }).addTo(myMap);

// Define a markerSize function based on earthquake magnitude
function markerSize(mag) {
  return mag*20000;}
    
// Function to color circle based on earthquake magnitude
function getColor(d) {
  return d > 5 ? '#bd0026' :
         d > 4  ? '#f03b20' :
         d > 3  ? '#fd8d3c' :
         d > 2  ? '#feb24c' :
         d > 1  ? '#fed976' :
                  '#addd8e';
    }

// Grab the data with d3
d3.json(url, function(response) {

  //print out queried data
  console.log(response);

  //loop to plot earthquake location, circle color and magnitude, add bindPopup message
  for (var i = 0; i < response.features.length; i++) {
    var earthquakelocation = [response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]
    L.circle(earthquakelocation, {
      weight: 0.2,
      fillOpacity: 0.5,
      color: "black",
      fillColor: getColor(response.features[i].properties.mag),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: markerSize(response.features[i].properties.mag)
    }).bindPopup("<h3>" + response.features[i].properties.place + "</h3><hr><p>" + 
    new Date(response.features[i].properties.time) + "</h3><hr><p>" + 
    response.features[i].properties.mag + " magnitude" + "</p>").addTo(myMap);
  }

  //set legend location to bottom right of screen
  var legend = L.control({position: 'bottomright'});

  //setting up legend color and magnitude assignment
  legend.onAdd = function (map) {

    //create a div
    var div = L.DomUtil.create('div', 'info legend'), 
    
    //create an array holding earthquake magnitude
    mag_steps = [0, 1, 2, 3, 4, 5];    

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag_steps.length; i++) {
        div.innerHTML +=
            '<li style="background:' + getColor(mag_steps[i]+1) + '"></li> ' +
            mag_steps[i] +  (mag_steps[i + 1] ? '&ndash;' + mag_steps[i + 1] + '<br>' : '+');
    }
    return div;
  };

  //add legend to map
  legend.addTo(myMap);

});