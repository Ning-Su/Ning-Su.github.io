 
      var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/111999474";
      var frequency = 10 * 1000; 

     var width = window.innerWidth;
     var height = window.innerHeight;
     var margin = {top: 100, left: 200, right: 100, bottom: 100};
     var svg = d3.select("body")
      .append("svg")
      .attr("width",width)
      .attr("height",height);

      function fetchData() {

        d3.json(realtimeURL, function(error, users) {
         


    var data2 = [
        {area: "Back Bay", rent: 2920, income: 97.8, population: 21.88, charles: true},
        {area: "Charlestown", rent: 2590, income: 94.6, population: 16.44, charles: false},
        {area: "Chinatown", rent: 3210, income: 121.0, population: 6.87, charles: false},
        {area: "Downtown", rent: 3325, income: 168.6, population: 1.98, charles: true},
        {area: "Fenway", rent: 2400, income: 37.9, population: 21.77, charles: true},
        {area: "Mission Hill", rent: 1990, income: 37.3, population: 13.93, charles: false},
        {area: "North End", rent: 2350, income: 98.5, population: 10.61, charles: false},
        {area: "Allston", rent: 1900, income: 52.1, population: 28.82, charles: true},
        {area: "Brighton", rent: 1750, income: 65.7, population: 45.98, charles: true},
        {area: "Dorchester", rent: 1800, income: 62.2, population: 60.79, charles: false},
        {area: "Jamaica Plain", rent: 1950, income: 84.0, population: 41.26, charles: false},
        {area: "Roxbury", rent: 1610, income: 32.3, population: 52.53, charles: false},
        {area: "South Boston", rent: 2900, income: 89.1, population: 33.69, charles: false},
        {area: "West Roxbury", rent: 1910, income: 90.5, population: 30.44, charles: true}
    ];

    var data3 = [
        {area: "Back Bay", rent: 2800, income: 97.8, population: 21.88, charles: true},
        {area: "Charlestown", rent: 2500, income: 94.6, population: 16.44, charles: false},
        {area: "Chinatown", rent: 2910, income: 121.0, population: 6.87, charles: false},
        {area: "Downtown", rent: 3070, income: 168.6, population: 1.98, charles: true},
        {area: "Fenway", rent: 2350, income: 37.9, population: 21.77, charles: true},
        {area: "North End", rent: 2300, income: 98.5, population: 10.61, charles: false},
        {area: "Allston", rent: 2150, income: 52.1, population: 28.82, charles: true},
        {area: "Brighton", rent: 1950, income: 65.7, population: 45.98, charles: true},
        {area: "Dorchester", rent: 1800, income: 62.2, population: 60.79, charles: false},
        {area: "Jamaica Plain", rent: 1700, income: 84.0, population: 41.26, charles: false},
        {area: "South Boston", rent: 2840, income: 89.1, population: 33.69, charles: false},
        {area: "West Roxbury", rent: 1810, income: 90.5, population: 30.44, charles: true},
        {area: "South End", rent: 2700, income: 69.9, charles: false},
        {area: "Roslindale", rent: 1600, income: 77.9, charles: false},
        {area: "East Boston", rent: 1900, income: 54.9, charles: false}
    ];   

 
    var xScale = d3.scaleLinear()
      .domain([0,200])
      .range([margin.left, width-margin.right]);

    var yScale = d3.scaleLinear()
      .domain([0,3500])
      .range([height-margin.bottom, margin.top]);


    var circle = svg.selectAll("circle")
        .data(data2)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.income); })
            .attr("cy", function(d) { return yScale(d.rent); })
            .attr("r", 15)
            .attr("fill","#95cd8b");


    var c = svg.selectAll("circle")
      .data(data3, function(d) { return d.area; });

    c.enter().append("circle")
      .attr("cx", function(d) { return xScale(d.income); })
      .attr("cy", function(d) { return yScale(d.rent); })
      .attr("r", 0)
      .attr("fill","#fcdd7c")
    .merge(c)
      .transition()
      .duration(3000)
      .delay(2000)
      .attr("cx", function(d) { return xScale(d.income); })
      .attr("cy", function(d) { return yScale(d.rent); })
      .attr("r", 15)
      .attr("fill","#f6967d");
    
    c.exit()
      .transition()
      .duration(3000)
      .delay(2000) 
      .attr("r",0)
      .remove(); 
     


        });

      }

      fetchData();
      setInterval(fetchData, frequency);
