d3.csv("data/states_all.csv").then(function(data) {

    console.log(data);

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top: 50, left: 150, right: 50, bottom: 150};

    var filtered_dataMASSACHUSETTS = data.filter(function(d) {
        return d.STATE === "MASSACHUSETTS";
    });

    var filtered_dataALABAMA = data.filter(function(d) {
        return d.STATE === "ALABAMA";
    });


    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var YEAR = {
        minMASSACHUSETTS: d3.min(filtered_dataMASSACHUSETTS, function(d) { return +d.YEAR; }),
        maxMASSACHUSETTS: d3.max(filtered_dataMASSACHUSETTS, function(d) { return +d.YEAR; }),
        minALABAMA: d3.min(filtered_dataALABAMA, function(d) { return +d.YEAR; }),
        maxALABAMA: d3.max(filtered_dataALABAMA, function(d) { return +d.YEAR; })
    };

    var TOTAL_REVENUE = {
        minMASSACHUSETTS: d3.min(filtered_dataMASSACHUSETTS, function(d) { return +d.TOTAL_REVENUE; }),
        maxMASSACHUSETTS: d3.max(filtered_dataMASSACHUSETTS, function(d) { return +d.TOTAL_REVENUE; }),
        minALABAMA: d3.min(filtered_dataALABAMA, function(d) { return +d.TOTAL_REVENUE; }),
        maxALABAMA: d3.max(filtered_dataALABAMA, function(d) { return +d.TOTAL_REVENUE; })
    };

    var TOTAL_EXPENDITURE = {
        minMASSACHUSETTS: d3.min(filtered_dataMASSACHUSETTS, function(d) { return +d.TOTAL_EXPENDITURE; }),
        maxMASSACHUSETTS: d3.max(filtered_dataMASSACHUSETTS, function(d) { return +d.TOTAL_EXPENDITURE; }),
        minALABAMA: d3.min(filtered_dataALABAMA, function(d) { return +d.TOTAL_EXPENDITURE; }),
        maxALABAMA: d3.max(filtered_dataALABAMA, function(d) { return +d.TOTAL_EXPENDITURE; })
    }


    var xScale = d3.scaleLinear()
        .domain([YEAR.minMASSACHUSETTS, YEAR.maxMASSACHUSETTS])
        .range([margin.left, width-margin.right]);

    var yScale = d3.scaleLinear()
        .domain([TOTAL_REVENUE.minMASSACHUSETTS, TOTAL_REVENUE.maxMASSACHUSETTS])
        .range([height-margin.bottom, margin.top]);

    var rScale = d3.scaleSqrt()
        .domain([TOTAL_EXPENDITURE.minMASSACHUSETTS, TOTAL_EXPENDITURE.maxMASSACHUSETTS])
        .range([0, 23]);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    var points = svg.selectAll("circle")
        .data(filtered_dataMASSACHUSETTS, function(d) { return d.STATE; })
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.YEAR); })
            .attr("cy", function(d) { return yScale(d.TOTAL_REVENUE); })
            .attr("r", function(d) { return rScale(d.TOTAL_EXPENDITURE); })
            .attr("fill", "#fbb040");

    var xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("YEAR");

    var yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/4)
        .text("TOTAL REVENUE");


   d3.select("#updateM").on("click", function() {

      var newPoints1 = svg.selectAll("circle")
          .data(filtered_dataMASSACHUSETTS, function(d) { return d.STATE; });

      newPoints1.enter().append("circle")
          .attr("cx", function(d) { return xScale(d.YEAR); })
          .attr("cy", function(d) { return yScale(d.TOTAL_REVENUE); })
          .attr("r", function(d) { return rScale(d.TOTAL_EXPENDITURE); })
          .attr("fill", "white")
      .merge(newPoints1)
          .transition()
          .duration(1000)
          .delay(250)
          .attr("cx", function(d) { return xScale(d.YEAR); })
          .attr("cy", function(d) { return yScale(d.TOTAL_REVENUE); })
          .attr("r", function(d) { return rScale(d.TOTAL_EXPENDITURE); })
          .attr("fill", "#fcaa9a");

      newPoints1.exit()
          .transition()
          .duration(1000)
          .delay(250)
          .attr("r",0)
          .remove();

        });



    d3.select("#updateA").on("click", function() {

    var newPoints2 = svg.selectAll("circle")
        .data(filtered_dataALABAMA, function(d) { return d.STATE; });

    newPoints2.enter().append("circle")
        .attr("cx", function(d) { return xScale(d.YEAR); })
        .attr("cy", function(d) { return yScale(d.TOTAL_REVENUE); })
        .attr("r", function(d) { return rScale(d.TOTAL_EXPENDITURE); })
        .attr("fill", "white")
    .merge(newPoints2)
        .transition()
        .duration(1000)
        .delay(250)
        .attr("cx", function(d) { return xScale(d.YEAR); })
        .attr("cy", function(d) { return yScale(d.TOTAL_REVENUE); })
        .attr("r", function(d) { return rScale(d.TOTAL_EXPENDITURE); })
        .attr("fill", "#f4d09f");

    newPoints2.exit()
        .transition()
        .duration(1000)
        .delay(250)
        .attr("r",0)
        .remove();

});
});
