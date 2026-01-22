jQuery(document).ready(function($) {
  $.ajax({
    type: "GET",
    url: "http://www.indiscreetacumen.com/wp-content/uploads/2015/05/schoolSample.csv",
    dataType: "text",
    success: function(data){displayData(data)}
  });
});
 
//now the function that is called after the file was loaded
 
function displayData(Text){
  data = $.csv.toObjects(Text);
 data_array= [0,0,0]; //create it before filling 
  for (i = 0; i < data.length; i++) {
    data_array[i] = [parseFloat(data[i].lat), parseFloat(data[i].long), parseFloat(data[i].free)]; // if values are marked as string in the object else:
//  data_array[i] = [data[i].lat,data[i].lon,data[i].val];
};

//here comes the leaflet standard for the basemap:
 
  var map = L.map('map').setView([0, 0], 2);
  var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, example by <a href="http://www.digital-geography.com">digital-geography.com</a>'
}).addTo(map);
var heat = L.heatLayer(data_array,{
          radius: 15,
          blur: 20, 
          maxZoom: 6,
      }).addTo(map);
}