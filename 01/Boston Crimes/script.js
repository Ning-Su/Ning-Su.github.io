

var promises = [
    d3.csv("./data/crime.csv",parseCSV),
    d3.json("./geojson/Boston_Neighborhoods.geojson")
];

Promise.all(promises).then(function(data) {


    console.log(data);


    var CrimeData = data[0];
    var boston = data[1];


    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);




    var projection = d3.geoAlbers()
        .translate([width/2, height/2])
        .scale(2500)
        .fitExtent([[0,-830], [650, 1500]], boston);


    var geoPath = d3.geoPath().projection(projection);

    svg.selectAll( "path" )
        .data( boston.features )
        .enter()
        .append( "path" )
        .attr( "fill", "white" )
        .attr( "stroke", "#58595b")
        .attr(  "stroke-width","1")
        .attr( "d", geoPath)


    CrimeData = CrimeData.sort(function(a,b) { return a.YEAR - b.YEAR; });



    var slider = d3.select("#selectYEAR");

    slider
        .property("min", CrimeData[0].YEAR)
        .property("max", CrimeData[CrimeData.length-1].YEAR)
        .property("value", CrimeData[CrimeData.length-1].YEAR);

    var selectedYEAR = slider.property("value");




    var YEARLabel = svg.append("text")
        .attr("class","YEARLabel")
        .attr("x",320)
        .attr("y", height - 275)
        .attr("font-family","Verdana,sans-serif")
        .attr("font-size","100px")
        .attr("fill","#E2E2E2")
        .attr("font-weight","700")
        .text(selectedYEAR);


    var rScale = d3.scaleSqrt()
        .domain([0,2000])
        .range([0,25]);

    function updateMap(YEAR) {
        var filtered_data = CrimeData.filter(function(d){
            return d.YEAR == YEAR;
        });


        var c = svg.selectAll("circle")

           .data(filtered_data, function(d){return d.id});
        c.enter().append("circle")
            .attr("cx", function(d){
                var proj = projection([d.Long, d.Lat]);
                return proj[0];
            }).attr("cy",function(d){
                var proj = projection([d.Long, d.Lat]);
                return proj[1];
            }).attr("r",0)
                .attr("opacity",0.7)
                .attr("fill", "#CC0000")
        .merge(c)
            .transition(1000)
            .attr("cx", function(d){
                var proj = projection([d.Long, d.Lat]);
                return proj[0];
            }).attr("cy",function(d){
                var proj = projection([d.Long, d.Lat]);
                return proj[1];
            }).attr("r",function(d){return rScale(d.REPORTING_AREA)})
            .attr("opacity",0.7)
            .attr("fill", "#CC0000")
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
                    .html(d.STREET + "<br>" + d.OFFENSE_DESCRIPTION);
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


function parseCSV(data) {
    var d = {};
    d.id = data.INCIDENT_NUMBER;
    d.STREET = data.STREET;
    d.OFFENSE_DESCRIPTION = data.OFFENSE_DESCRIPTION;
    d.Location = data.Location;
    d.Lat = +data.Lat;
    d.Long = +data.Long;
    d.REPORTING_AREA = +data["REPORTING_AREA"];
    d.date = new Date(data.Date);
    d.YEAR = data.YEAR;

    return d;

}
