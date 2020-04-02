

    d3.csv("NYS wildland fire.csv", function(error, data) {
        var FireData = data;
    
        });

        var width = window.innerWidth;
        var height = window.innerHeight;


        
        
   var svg = d3.select("#viz")
   .attr("width", width-350)
   .attr("height", height-170)
  ; 

   svg.select("#ocean")
    .attr("width", width-100)
    .attr("height", height-200);

   var map = svg.select("#map")
   ;

   var legendX = width-100;
        var legendY = height-300;
        var legendSize = 20;
        var legendPadding = 10;

    var legend = svg.select("#legend")
    .attr("transform", "translate(" + legendX + ", " + legendY + ")");


   d3.json("nys.json", function(error, geoJSON) {

        var legendData = data.map(function(d) {
            return d.Cause;
            });


    var legendData1 = legendData.filter(function(d) {
            return d.Cause ==="Campfire";});

    var legendData2 = legendData.filter(function(d) {
            return d.Cause ==="Prescribed Fire";});

    var legendData3 = legendData.filter(function(d) {
            return d.Cause ==="Debris Burning";});

    var legendData4 = legendData.filter(function(d) {
                return d.Cause ==="Lightning";});
    
     var legendData5 = legendData.filter(function(d) {
                return d.Cause ==="Equipment";});
    
     var legendData3 = legendData.filter(function(d) {
                return d.Cause ==="Incendiary";});
        
    var legendData2 = legendData.filter(function(d) {
        return d.Cause ==="Power line";});

    var legendData3 = legendData.filter(function(d) {
            return d.Cause ==="Smoking";});

    var legendData3 = legendData.filter(function(d) {
                return d.Cause ==="Miscellaneous";});
        
    var legendData2 = legendData.filter(function(d) {
        return d.Cause ==="Children";});

    var legendData3 = legendData.filter(function(d) {
            return d.Cause ==="Structure";});
            

        
    var barColor ={

        };


        var legendRects = legend.selectAll("rect")
        .data(legendData);

      var legendRectsEnter = legendRects.enter().append("rect");

      legendRects.merge(legendRectsEnter)
      .attr("x", 0)
      .attr("y", function(d, i) {
          return i * legendSize + i * legendPadding;
      })
      .attr("fill", barColor)
      .attr("width", legendSize)
      .attr("height", legendSize);

      var legendTexts = legend.selectAll("text")
      .data(legendData);

      var legendTextsEnter = legendTexts.enter().append("text")
      .attr("baseline-shift", "-100%");

      legendTexts.merge(legendTextsEnter)
      .attr("x", legendPadding + legendSize + legendPadding / 2)
      .attr("y", function(d, i) {
          return i * legendSize + i * 10;
      })
      .text(function(d) {
          return d;
      });



       var projection = d3.geoMercator()
       .fitSize([width/1.4, height/1.4], geoJSON)
      
       ;

       var path = d3.geoPath()
       .projection(projection);

       var countries = map.selectAll("path")
       .data(geoJSON.features);

       countries.enter().append("path")
       .attr("d", path)
       .attr("fill", "white")
       .attr("stroke","red");

       
       var zoom = d3.zoom()
       .translateExtent([[0, 0], [width, height]])
       .scaleExtent([1, 1])
       .on("zoom", zoomed);

       function zoomed() {
       map.attr("transform", d3.event.transform);
       }

       svg.call(zoom);
       
      

    FireData = FireData.sort(function(a,b) { return a.YEAR - b.YEAR; });



    var slider = d3.select("#selectYEAR");

    slider
        .property("min", FireData[0].YEAR)
        .property("max", FireData[FireData.length-1].YEAR)
        .property("value", FireData[FireData.length-1].YEAR);

    var selectedYEAR = slider.property("value");


    var YEARLabel = svg.append("text")
        .attr("class","YEARLabel")
        .attr("x",320)
        .attr("y", height - 275)
        .attr("font-family","Verdana,sans-serif")
        .attr("font-size","50px")
        .attr("fill","#E2E2E2")
        .attr("font-weight","200")
        .text(selectedYEAR);


    var rScale = d3.scaleSqrt()
        .domain([0,2000])
        .range([0,25]);

    function updateMap(YEAR) {
        var filtered_data = FireData.filter(function(d){
            return d.YEAR == YEAR;
        });


        var c = svg.selectAll("circle")

           .data(filtered_data, function(d){return d.id});
        c.enter().append("circle")
            .attr("cx", function(d){
                var proj = projection([d.Longitude, d.Latitude]);
                return proj[0];
            }).attr("cy",function(d){
                var proj = projection([d.Longitude, d.Latitude]);
                return proj[1];
            }).attr("r",0)
                .attr("opacity",0.7)
                .attr("fill", function(d) {
                    return barColor(d.Cause)})
        .merge(c)
            .transition(1000)
            .attr("cx", function(d){
                var proj = projection([d.Longitude, d.Latitude]);
                return proj[0];
            }).attr("cy",function(d){
                var proj = projection([d.Longitude, d.Latitude]);
                return proj[1];
            }).attr("r",function(d){return rScale(d.Acreage)})
            .attr("opacity",0.7)
            .attr("fill", function(d) {
                return barColor(d.Cause)})
        c.exit()
            .transition()
            .duration(1000)
            .attr("r",0)
            .remove();
        YEARLabel.text(YEAR);
        svg.selectAll("circle")
            .on("mouseover",function(d){
                var cx = +d3.select(this).attr("cx") + 15;
                var cy = +d3.select(this).attr("cy") - 15;
                tooltip.style("visibility","visible")
                    .style("left", cx + "px")
                    .style("top", cy + "px")
                    .html("Incident Name:" + d.IncidentName + "<br>" + "County:" + d.County + "<br>" + "NFFL Fuel Model:" + d.NFFL_Fuel_Model);
                svg.selectAll("circle")
                    .attr("opacity",0.2);
                d3.select(this)
                    .attr("opacity",0.7);

            }).on("mouseout",function(){
                tooltip.style("visibility","hidden")
                    .attr("opacity",0.7);
            })
        }



    updateMap(selectedYEAR);

    slider.on("input", function(){
        var YEAR = this.value;


        selectedYEAR = YEAR;
        updateMap(selectedYEAR);

    })





    var tooltip = d3.select("#chart")
    .append("div")
    .attr("class","tooltip")

});










