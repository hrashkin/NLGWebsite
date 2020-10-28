
var inpF, hist,chart,canvas,context;
var inpFdefault = "Enter your text here.";

window.onload = setup;

function roundToPIPScale(number){
 return Math.round(number * 1000000) / 1000000
}

function drawLine(sourceX,sourceY,destnationX,destnationY){
  context.beginPath();
  context.moveTo(sourceX, sourceY);
  context.lineTo(destnationX, destnationY);
  context.stroke();
}

function calcScale(data,boxSize){
  var result = new Object();
  result.stepInPixel = boxSize / (data.length - 1); 


  var min = Number.POSITIVE_INFINITY;
  var max = Number.NEGATIVE_INFINITY;
  for(var i = 0; i < data.length;i++){
    if(data[i] < min){
      min = data[i];
    }
    if(data[i] > max){
      max = data[i];
    }

  }  

  var delta = max - min;

  result.offsetY = min;
  result.multiplicatorY = ((boxSize / delta));  
  return result; 
}


function drawGraphAxis(data,boxSize){

  var labelCount = 10;
  var stepSize = boxSize / labelCount;

  var min = Number.POSITIVE_INFINITY;
  var max = Number.NEGATIVE_INFINITY;
  for(var i = 0; i < data.length;i++){
    if(data[i] < min){
      min = data[i];
    }
    if(data[i] > max){
      max = data[i];
    }  
  }  

  context.font="20px Georgia";
  for(var i = 0; i <= labelCount;i++){ 
    
    var delta = max - min;
    
    var currentScale = (1 / labelCount) * i; 
    
    var label = roundToPIPScale(min + (delta*currentScale));
    if (((stepSize * i) * -1 ) + boxSize < 0){
      context.fillText( label, boxSize + 5, 1);

    } 
    else{
      context.fillText( label, 2*boxSize + 5, ((stepSize * i) * -1 ) + boxSize+15);

    }
  }  
}


function drawGraphXAxis(data,boxSize){

  var labelCount = data.length-1;
  var stepSize = boxSize / (labelCount-1);

  var min = 0;
  var max = data.length;

  for(var i = 0; i < labelCount;i++){ 
    
    var delta = max - min;
    
    var currentScale = (1 / labelCount) * i; 
    
    var label = data[i+1];
    if (((stepSize * i) * -1 ) + boxSize < 0){
      context.fillText( label,  1, boxSize + 5);

    } 
    else{
      context.fillText( label, 2*((stepSize * i)),  boxSize +40);

    }
  }  
}

function drawGraph(data,xaxis){

  context.clearRect(0, 0, canvas.width, canvas.height);  
  var boxSize = 300;

  drawLine(0,15,0,boxSize+15);
  drawLine(0,15,2*boxSize,15);
  drawLine(2*boxSize,15,2*boxSize,boxSize+15);
  drawLine(0,boxSize+15,2*boxSize,boxSize+15);

  var scale = calcScale(data,boxSize);

  var stepInPixel = scale.stepInPixel;
  var multiplicatorY = scale.multiplicatorY;
  var offsetY = scale.offsetY;

  var offset = 0;
  var lastY = ((data[0] * multiplicatorY) * -1) + (offsetY * multiplicatorY)   + boxSize ;
  for(var i = 1; i < data.length;i++){
    var currentY =  ((data[i] * multiplicatorY) * -1) + (offsetY* multiplicatorY)   + boxSize ;
    if(i == 0){
      lastY = currentY;
    }
   
    
    drawLine(2*offset,lastY+15,2*(offset+stepInPixel),currentY+15)
    offset += stepInPixel;
    lastY = currentY;

  } 
  drawGraphAxis(data,boxSize);
  drawGraphXAxis(xaxis,boxSize);
}



function getResponse(){
  // Pushing prompt to the history
  canvas = document.getElementById('myChart');
  context = canvas.getContext('2d');

  var prompt = inpF.value;
  if (prompt === inpFdefault || prompt === "")
    return; // show warning message?
  hist = document.getElementById("history");
  hist.innerHTML = `<div class="history user">${prompt}</div>`;
  inpF.value = "";
  console.log([inpF.value]);
  console.log(prompt);

  // Sending stuff to server (for now, no server)
  var nlgResponse = "SWABHA's MY FAVORITE NLPer!";
  toSend = $.trim(prompt).replace(/\n/g,"|||");
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
  	if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
      console.log(xmlHttp.responseText);
      nlgResponse = xmlHttp.responseText;
      a = nlgResponse.split("|");
      var b = a[0].split(',').map(Number);
      drawGraph(b, a[1].split('~'));

    


    }
  }
  xmlHttp.open("POST", window.location.href+"?inputText="+toSend, true);
  xmlHttp.send();
}


function setup(){
  /*Input field aesthetics*/
  inpF = document.getElementById("inputfield");
  inpF.onfocus = function(){
    if(inpF.value === inpFdefault){
      inpF.style = "color: black;font-style: normal";
      inpF.value = "";
    }
  };
  inpF.onblur = function(){
    if (inpF.value === ""){
      inpF.style = "color: grey;font-style: italic;";
      inpF.value = inpFdefault;
    }
  };
  inpF.onkeyup = function(e){
    if (e.keyCode === 13 && !e.shiftKey){
      getResponse();
    }
  };
}