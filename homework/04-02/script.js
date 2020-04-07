
d3.queue()
    .defer(d3.csv, "NYS wildland fire.csv")
    .defer(d3.json, "nys.json")   
    .awaitAll(function(error, results) {     
        if (error) throw error;     
        var FireData = results[0];     
        var NYS = results[1];   




    console.log(FireData);

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;

    console.log(width);
    console.log(height);
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);




   var legendX = width+20;
        var legendY = 100;
        var legendSize = 20;
        var legendPadding = 10;

    var legend = svg.select("#legend")
    .attr("transform", "translate(" + legendX + ", " + legendY + ")");

        // var legendData = data.map(function(d) {
        //     return d.Cause;
        //     });

            var entries = d3.nest()
            .key(function(d) { return d.Cause; })
            .key(function(d) { return d.Acreage; })
            .entries(FireData);

          console.log(entries);

            // legendData = legendData.filter(function(d, i) {
            //     return legendData.indexOf(d) === i;
            // })
            // .sort(function(a, b) {
            //     return b - a;
            // });


        
    var barColor = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, 10]);


        var legendRects = legend.selectAll("rect")
        .data(entries);

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
      .data(entries);

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
       .fitSize([width, height], NYS)
  



       var geoPath = d3.geoPath().projection(projection);

  
console.log(NYS);

       svg.selectAll( "path" )
       .data(NYS.features)
       .enter()
       .append( "path" )
       .attr( "fill", "white" )
       .attr( "stroke", "black")
       .attr(  "stroke-width","1")
       .attr( "d", geoPath);

 

    FireData = FireData.sort(function(a,b) { return a.YEAR - b.YEAR; });



    var slider = d3.select("#selectedYEAR");

    slider
        .property("min", FireData[0].YEAR)
        .property("max", FireData[FireData.length-1].YEAR)
        .property("value", FireData[FireData.length-1].YEAR);

    var selectedYEAR = slider.property("value");


    var YEARLabel = svg.append("text")
        .attr("class","YEARLabel")
        .attr("x",width-72)
        .attr("y", height-998)
        .attr("font-family","Gill Sans")
        .attr("font-size","32px")
        .attr("fill","#d3d3d3")
        .attr("font-weight","400")
        .text(selectedYEAR);


    var rScale = d3.scaleSqrt()
        .domain([0,700])
        .range([0,100]);

    function updateMap(YEAR) {
        var filtered_data = FireData.filter(function(d){
            return d.YEAR == YEAR;
        });


        var c = svg.select("#shapes").selectAll("circle")

           .data(filtered_data, function(d){return d.id});
        c.enter().append("circle")
            .attr("cx", function(d){
                var proj = projection([d.Longitude, d.Latitude]);
                return proj[0];
            }).attr("cy",function(d){
                var proj = projection([d.Longitude, d.Latitude]);
                return proj[1];
            }).attr("r",0)
                .attr("opacity",0.8)
                .attr("fill", 
                function(d) {
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
            .attr("opacity",0.8)
            .attr("fill", 
            function(d) {
                return barColor(d.Cause)})
        c.exit()
            .transition()
            .duration(1000)
            .attr("r",0)
            .remove();

        YEARLabel.text(YEAR);
        svg.selectAll("circle")
            .on("mouseover",function(d){
                var cx = +d3.select(this).attr("cx") + 30;
                var cy = +d3.select(this).attr("cy") - 15;
                tooltip.style("visibility","visible")
                    .style("left", cx +"px")
                    .style("top", cy + "px")
                    .html("Acreage: " + d.Acreage + "<br>" +"Incident Name: " + d.IncidentName + "<br>" + "County: " + d.County + "<br>" + "NFFL Fuel Model:" + d.NFFL_Fuel_Model);
                svg.selectAll("circle")
                    .attr("opacity",0.2);
                d3.select(this)
                    .attr("opacity",0.8);

            }).on("mouseout",function(){
                tooltip.style("visibility","hidden")
                    .attr("opacity",0.8);
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

function parseCSV(data) {
    var d = {};
  
    d.STREET = data.STREET;
    d.IncidentName = data.IncidentName;
    d.County = data.County;
    d.Latitude = +data.Latitude;
    d.Longitude = +data.Longitude;
    d.Acreage = +data["Acreage"];
    d.date = new Date(data.Date);
    d.YEAR = data.YEAR;


        }



 







