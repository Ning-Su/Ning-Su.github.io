document.querySelector("p").innerHTML = "Hello this is Ning! This sunrise photo was taken on plane by chance when I flew from new York to Boston on Jan 01, 2020. ";

function changeColor(color) {
  document.querySelector("p").style.color = color;
}

document.querySelector("#clickToChangeColor").onclick = function(){
   changeColor("red");
}