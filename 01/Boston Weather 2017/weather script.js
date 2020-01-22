d3.csv("./data/weather.csv").then(function (data) {

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = { top: 50, left: 150, right: 50, bottom: 150 };
    var lineColors = ['#95cd8b', '#e7685d']
  

    function getFilterMonthData(month) {
      return data.filter(function (d) {
        return d.month == month;
      })
    }
  
    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  

    var defaultMonthData = getFilterMonthData(1)
   
    var xWidth = width - margin.right - margin.left
    var yHeight = height - margin.bottom - margin.top
  
    var xScale = d3.scaleLinear()
      .domain(d3.extent(defaultMonthData, function (d) {
        return +d.day
      }))
      .range([margin.left, width - margin.right]);
  
    var yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);
  
    var line1 = d3.line()
      .x(function (d) { return xScale(d.day); })
      .y(function (d) { return yScale(d.temperatureMin); })
      .curve(d3.curveLinear);
  
  
    var line2 = d3.line()
      .x(function (d) { return xScale(d.day); })
      .y(function (d) { return yScale(d.temperatureMax); })
      .curve(d3.curveLinear);
  
    var xAxis = svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));
  
    var yAxis = svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yScale));
  
    var path1 = svg.append("path")
      .datum(defaultMonthData)
      .attr("stroke", lineColors[0])
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("d", line1);
  
    var path2 = svg.append("path")
      .datum(defaultMonthData)
      .attr("stroke", lineColors[1])
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("d", line2);
  
  
    var xAxisLabel = svg.append("text")
      .attr("class", "axisLabel")
      .attr("x", width / 2 +30)
      .attr("y", height - margin.bottom / 2-10)
      .text("Day");
  
    var yAxisLabel = svg.append("text")
      .attr("class", "axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2 - 90)
      .attr("y", margin.left / 2 + 20)
      .text("Minimum/Maximum Temperature (°F)");
  
    d3.selectAll("button[data-month]")
      .on("click", function () {
        d3.selectAll("button[data-month]").attr("class", '')
        d3.select(this).attr("class", 'active')
        var month = d3.select(this).attr("data-month")
        var monthData = getFilterMonthData(month)
  
        xScale = d3.scaleLinear()
          .domain(d3.extent(monthData, function (d) {
            return +d.day
          }))
          .range([margin.left, width - margin.right]);
        svg.select('.x-axis').remove()
        xAxis = svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));
  
        path1.datum(monthData)
          .attr("stroke", lineColors[0])
          .attr("class", "line")
          .transition()
          .delay(200)
          .duration(1000)
          .attr("d", line1)
  
        path2.datum(monthData)
          .transition()
          .attr("class", "line")
          .delay(200)
          .duration(1000)
          .attr("d", line2)
          .attr("stroke", lineColors[1])
          .attr("stroke-width", 2);
      })
  
      var mouseM = svg.append("g")
      .attr("class", "mouse-over-effects")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);;
  
    mouseM.append("path") 
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');
  
    var mousePerLine = mouseM.selectAll('.mouse-per-line')
      .data(lineColors)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");
  
    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return d;
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");
  
    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");
  
    mouseM.append('svg:rect') 
      .attr('width', xWidth) 
      .attr('height', yHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { 
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { 
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { 
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            return `M${mouse[0]}, ${yHeight} ${mouse[0]} 0`;
          });
  
        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            var xT = mouse[0]
            var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;
            
            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = {
                x: lines[i].getPointAtLength(target).x - margin.left,
                y: lines[i].getPointAtLength(target).y - margin.top
              };
              if ((target === end || target === beginning) && pos.x !== xT) {
                break;
              }
              if (pos.x > xT)      end = target;
              else if (pos.x < xT) beginning = target;
              else break; 
            }
            
            d3.select(this).select('text')
              .text(yScale.invert(pos.y).toFixed(2));
              
            return `translate(${xT}, ${pos.y})`;
          });
        })
  
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  