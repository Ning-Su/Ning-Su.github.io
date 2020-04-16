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



        var legendSize = 10;


    var legend = svg.selectAll("#legend");


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
                return "translate(0,"+(i*25)+")"
            })
            .attr("fill", o=>o)
            .attr("y", "0px")
            .attr("width", legendSize)
            .attr("height", legendSize);

        legend
       
            .data(Cause)
            .enter()
            .append("text")
            .attr("font-family","Gill Sans")
            .attr("font-size","14px")
            .attr("fill", "white")
            .attr("y", "0px")
            .attr("transform", function (d, i) {
                return "translate(20," + (i * 25+10) + ")"
            })
            .text(o => o);



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
        .attr("x",width-790)
        .attr("y", height-90)
        .attr("opacity", 0.5)
        .attr("font-family","Gill Sans")
        .attr("font-size","120px")
        .attr("fill","#d3d3d3")
        .attr("font-weight","400")
        .text(selectedYEAR);


    var rScale = d3.scaleSqrt()
        .domain([0,1000])
        .range([0,150]);

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
                var cx = d3.event.pageX + 15;
                var cy = d3.event.pageY - 15;
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


    var tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip");
    
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
    return d;

        }



 







 







