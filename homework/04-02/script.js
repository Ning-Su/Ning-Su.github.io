d3.queue()
    .defer(d3.csv, "NYS wildland fire.csv")
    .defer(d3.json, "nys.json")   
    .awaitAll(function(error, results) {     
        if (error) throw error;     
        var FireData = results[0];     
        var NYS = results[1];   



        var Cause = [];
        FireData.forEach(function (d, i) {
            if (Cause.indexOf(d.Cause) == -1 && d.Cause!="") {
                Cause.push(d.Cause);
            }
        });
        console.log(Cause);

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;

    console.log(width);
    console.log(height);

    var svg = d3.select("#chart")
        
        .attr("width", width)
        .attr("height", height);


        var entries = d3.nest()
        .key(function(d) { return d.Cause; })
        .entries(FireData);

      console.log(entries);

      entries = entries.filter(function(d, i) {
            return entries.indexOf(d) === i;
        })
        .sort(function(a, b) {
            return b - a;
        });


// //    var legendX = width+20;
// //         var legendY = height-100;
        var legendSize = 20;
//         var legendPadding = 10;

    var legend = svg.selectAll("#legend")
    // .attr("transform", "translate(" + legendX + ", " + legendY + ")");

console.log(legend);
  
        var colors = ["#262262","#662d91", "#9e1f63", "#ee2a7b",
        "#be1e2d","#ed1c24", "#ef4136", "#f15a29", "#f7941d", "#fbb040", "#f9ed32", 
        "#8dc63f", "#009444", ];
        var CircleColor = d3.scaleThreshold()
            .domain(Cause)
            .range(colors);

        legend
       
            .data(colors)
            .enter()
            .append("rect")
            .attr("transform", function (d, i) {
                return "translate(1250,"+(i*35)+")"
            })
            .attr("fill", o=>o)
            .attr("y", "23px")
            .attr("width", legendSize)
            .attr("height", legendSize);

        legend
       
            .data(Cause)
            .enter()
            .append("text")
            .attr("fill", "white")
            .attr("y", "23px")
            .attr("transform", function (d, i) {
                return "translate(1290," + (i * 35+15) + ")"
            })
            .text(o => o);


    //     // var legendRects = legend.selectAll(".rect")
    //     // .data(colors);
  


    //   var legendRectsEnter = legend
    //   .data(colors)
    //   .enter().append(".rect");

    //   legendRects.merge(legendRectsEnter)
    //   .attr("transform", function (d, i) {
    //     return "translate(1250,"+(i*35)+")"
    // })
    //   .attr("fill", o=>o)
    //   .attr("stroke-width","1")
    //   .attr("width", legendSize)
    //   .attr("height", legendSize);

     



    //   var legendTexts = legend.selectAll(".text")

    //   .data(Causes);

    //   var legendTextsEnter = legendTexts.enter().append(".text")
    //   .attr("baseline-shift", "-100%");

    //   legendTexts.merge(legendTextsEnter)
    //   .attr("transform", function (d, i) {
    //     return "translate(1280," + (i * 35+15) + ")"
    // })
    //   .text(o => o);

       var projection = d3.geoMercator()
       .fitSize([width, height], NYS)

       var geoPath = d3.geoPath().projection(projection);
       svg.select("#map").selectAll( "path" )
       .data(NYS.features)
       .enter()
       .append( "path" )
       .attr( "fill", "white" )
       .attr( "stroke", "black")
       .attr(  "stroke-width","1")
       .attr( "d", geoPath);

 

    FireData = FireData.sort(function(a,b) { return a.YEAR - b.YEAR; });



    var slider = d3.select("#selectedYEAR")

    slider
        .property("min", FireData[0].YEAR)
        .property("max", FireData[FireData.length-1].YEAR)
        .property("value", FireData[FireData.length-1].YEAR);

    var selectedYEAR = slider.property("value")
    


    var YEARLabel = svg.append("text")
        .attr("class","YEARLabel")
        .attr("x",width-1400)
        .attr("y", height-1100)
        .attr("opacity", 0.5)
        .attr("font-family","Gill Sans")
        .attr("font-size","120px")
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
            function (d) {
                console.log(d.Cause);
                return CircleColor(d.Cause)
            })
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
                return CircleColor(d.Cause)})
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



 







 







