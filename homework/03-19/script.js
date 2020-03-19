
var promises = [
    d3.csv("./03-19/NYC wildland fire.csv",parseCSV),
    d3.json("./03-19/nys.json")
];

Promise.all(promises).then(function(data) {


    console.log(data);



    





});