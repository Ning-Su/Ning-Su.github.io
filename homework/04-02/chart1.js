d3.select(".w3-image")
  .on("mousemove", function() {
    d3.select("#tooltip")
      .style("display", "block")
      .style("top", d3.event.pageY + 20 + "px")
      .style("left", d3.event.pageX + 20 + "px")
      .html("Welcome to my final project!")
      .style("color","white") 
      .style("font", "Gill Sans");
  })

  .on("mouseout", function() {
    d3.select("#tooltip")
      .style("display", "none");
  });

  