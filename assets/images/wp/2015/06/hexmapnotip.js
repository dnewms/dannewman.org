
  //**********************************************************************************
  //********  LEAFLET HEXBIN LAYER CLASS *********************************************
  //**********************************************************************************
d3.helper = {};

d3.helper.tooltip = function(accessor){
    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
            // Clean up lost tooltips
            d3.select('body').selectAll('div.tooltip').remove();
            // Append tooltip
            tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px')
                .style('position', 'absolute') 
                .style('z-index', 1001);
            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';
            // Crop text arbitrarily
            //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
            //    .html(tooltipText);
        })
        .on('mousemove', function(d, i) {
            // Move tooltip
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px');
            var tooltipText = accessor(d, i) || '';
            tooltipDiv.html(tooltipText);
        })
        .on("mouseout", function(d, i){
            // Remove tooltip
            tooltipDiv.remove();
        });

    };
};
  L.HexbinLayer = L.Class.extend({
    includes: L.Mixin.Events,
    initialize: function (rawData, options) {
      this.levels = {};
      this.layout = d3.hexbin().radius(10);
      this.rscale = d3.scale.sqrt().range([0, 10]).clamp(false);
      this.rwData = rawData;
      this.config = options;
    },
    project: function(x) {
      var point = this.map.latLngToLayerPoint([x[1], x[0]]);
      return [point.x, point.y];
    },
    getBounds: function(d) {
      var b = d3.geo.bounds(d)
      return L.bounds(this.project([b[0][0], b[1][1]]), this.project([b[1][0], b[0][1]]));
    },
    update: function () {
      var pad = 100, xy = this.getBounds(this.rwData), zoom = this.map.getZoom();

      this.container
        .attr("width", xy.getSize().x + (2 * pad))
        .attr("height", xy.getSize().y + (2 * pad))
        .style("margin-left", (xy.min.x - pad) + "px")
        .style("margin-top", (xy.min.y - pad) + "px");

      if (!(zoom in this.levels)) {
          this.levels[zoom] = this.container.append("g").attr("class", "zoom-" + zoom);
          this.genHexagons(this.levels[zoom]);
          this.levels[zoom].attr("transform", "translate(" + -(xy.min.x - pad) + "," + -(xy.min.y - pad) + ")");
      }
      if (this.curLevel) {
        this.curLevel.style("display", "none");
      }
      this.curLevel = this.levels[zoom];
      this.curLevel.style("display", "inline");
    },
    genHexagons: function (container) {
      var data = this.rwData.features.map(function (d) {
        var coords = this.project(d.geometry.coordinates)
        return [coords[0],coords[1], d.properties];
      }, this);

      var bins = this.layout(data);
      var hexagons = container.selectAll(".hexagon").data(bins);
      var counts = [];
      bins.map(function (elem) { counts.push(elem.length) });
      this.rscale.domain([0, (ss.mean(counts) + (ss.standard_deviation(counts) * 10))]);

      var path = hexagons.enter().append("path").attr("class", "hexagon");
      this.config.style.call(this, path);

      that = this;
      hexagons
        .attr("d", function(d) { return that.layout.hexagon(that.rscale(d.length)); })
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        // .on("mouseover", function (d) {
//           var s=0, k=0;
//
//           that.config.mouse.call(this, [s,k]);
//           d3.select("#tooltip")
//             .style("visibility", "visible")
//             .style("top", function () { return (d3.event.pageY - 115)+"px"})
// 		  .style("left", function () { return (d3.event.pageX - 115)+"px";})
//         })
//         .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
    },
    addTo: function (map) {
      map.addLayer(this);
      return this;
    },
    onAdd: function (map) {
      this.map = map;
      var overlayPane = this.map.getPanes().overlayPane;

      if (!this.container || overlayPane.empty) {
          this.container = d3.select(overlayPane)
              .append('svg')
                  .attr("id", "hex-svg")
                  .attr('class', 'leaflet-layer leaflet-zoom-hide');
      }
      map.on({ 'moveend': this.update }, this);
      this.update();
    }
  });

  L.hexbinLayer = function (data, styleFunction) {
    return new L.HexbinLayer(data, styleFunction);
  };
  //**********************************************************************************
  //********  IMPORT DATA AND REFORMAT ***********************************************
  //**********************************************************************************
  d3.csv('/assets/images/wp/2015/06/schoolRawV.csv', function (error, schools) {

    function reformat (array) {
      var data = [];
      array.map(function (d){
        data.push({
          properties: {
			nfree: +d.nfree,
            free: +d.free,
            school: d.school
          }, 
          type: "Feature", 
          geometry: {
            coordinates:[+d.longitude,+d.latitude], 
            type:"Point"
          }
        });
      });
	  
      return data;
	 
    }
    geoData = { type: "FeatureCollection", features: reformat(schools) };

    //**********************************************************************************
    //********  CREATE LEAFLET MAP *****************************************************
    //**********************************************************************************
    var cscale = d3.scale.linear().domain([0,1]).range(["#00FF00","#FFA500"]);

    // PLEASE DO NOT USE MY MAP ID :)  YOU CAN GET YOUR OWN FOR FREE AT MAPBOX.COM
    	L.mapbox.accessToken = 'pk.eyJ1IjoiZG5ld21zIiwiYSI6IlR6WE9kUDAifQ.IXJ0PfUXntjO2LeyaxDzWw';
	var leafletMap = L.mapbox.map('mapContainer', 'dnewms.4e733c6b')
        .setView([47.62, -122.362], 11);

    //**********************************************************************************
    //********  ADD HEXBIN LAYER TO MAP AND DEFINE HEXBIN STYLE FUNCTION ***************
    //**********************************************************************************
    var hexLayer = L.hexbinLayer(geoData, { 
                      style: hexbinStyle,
                      // mouse: schoolName
                    }).addTo(leafletMap);
					
    function hexbinStyle(hexagons) {
      hexagons
  	  	.attr("stroke", "grey")
        .attr("fill", function (d) {
			              var avg = d3.mean(d, function(d) { return +d[2].free; })
			              return cscale(avg);
          })
				
        };
    //**********************************************************************************
    //********  PIE CHART ROLL-OVER ****************************************************
    //**********************************************************************************
    function schoolName (hexagons) {
          var svg = d3.select("#tooltip").select("svg")
                      .append("g")
                        .attr("transform", "translate(50,50)");

          var g = svg.selectAll("svg")
                    .data(schools)
						.enter().append("g");


              g.append("text")
                  .style("text-anchor", "middle")
						.call(d3.helper.tooltip(
						        function(d, i){
						          return d.school;
						        }
						        ));
	}
  });