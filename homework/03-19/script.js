

    d3.csv("NYS wildland fire.csv", function(error, data) {
        var WildfireData = data;
    
        });

    var width = window.innerWidth;
    var height = window.innerHeight;

   var svg = d3.select("#viz")
   .attr("width", width)
   .attr("height", height);

   svg.select("#ocean")
 .attr("width", width)
 .attr("height", height);

   var map = svg.select("#map");


   d3.json("nys.json", function(error, geoJSON) {



       var projection = d3.geoMercator()
       .fitSize([width, height], geoJSON);


       var path = d3.geoPath()
       .projection(projection);

       var countries = map.selectAll("path")
       .data(geoJSON.features);

       countries.enter().append("path")
       .attr("d", path)
       .attr("fill", "green")
       .attr("stroke","orange");

       var points = [
       {"name": "Boston", "coords": [-71.0589, 42.3601]},
       {"name": "London", "coords": [-0.1278, 51.5074]}
       ];

       var circles = map.selectAll("circle")
       .data(points);

       circles.enter().append("circle")
       .attr("transform", function(d){
           return "translate(" + projection(d.coords) + ")";
       })
       .attr("r", 10)
       .attr("fill", "white");

       var zoom = d3.zoom()
       .translateExtent([[0, 0], [width, height]])
       .scaleExtent([1, 20])
       .on("zoom", zoomed);

       function zoomed() {
       map.attr("transform", d3.event.transform);
       }

       svg.call(zoom);
  


       

   
   });
