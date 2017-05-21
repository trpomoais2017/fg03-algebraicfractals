var canvas = document.getElementById("canvas");
//canvas.addEventListener("onmousemove", MouseDown);
var canvasHeight = parseInt(canvas.getAttribute("height"));
var canvasWidth = parseInt(canvas.getAttribute("width"));

var context = canvas.getContext('2d');
var imageFract = context.createImageData(canvasWidth, canvasHeight);
var sframe = document.getElementById('selectFrame');

var N = 30;
var ColorType = "";
var C = {x: -0.19, y: 0.75};
var FractalType = "";

var PCP = {	//PointsComplexPlane
	left : -2,
	topp : -2,
	right : 2,
	bottom : 2,
	
	startCoords: 0,
	endCoords: 0
};
var ColorFractal = {
	red: 0,
	green: 0,
	blue: 0,
	opacity: 255,
	entry: function(i, j){
		imageFract.data[4*(i + canvasWidth*j) + 0] = this.red;
		imageFract.data[4*(i + canvasWidth*j) + 1] = this.green;
		imageFract.data[4*(i + canvasWidth*j) + 2] = this.blue;
		imageFract.data[4*(i + canvasWidth*j) + 3] = this.opacity;
	},
	classical: function(atractor, i, j){
		let color = atractor == 0 ? 0 : 255;
		this.red = this.green = this.blue = color;
		this.entry(i, j);
	},
	levels: function(atractor, i, j){
		let brightness = N > 1 ? 255*Math.log(1+atractor)/Math.log(N) : 0;
		this.red = this.green = this.blue = brightness;
		this.entry(i, j);
	},
	zebra: function(atractor, i, j){
		let color = atractor % 2 == 0 ? 0 : 255;
		this.red = this.green = this.blue = color;
		this.entry(i, j);
	},
	classicalNewton: function(atractor, i, j){
		this.red = this.green = this.blue = 0;
		if(atractor == 1)	this.red = 255;
		if(atractor == 2)	this.green = 255;
		if(atractor == 3)	this.blue = 255;
		this.entry(i, j);
	},
	hybridNewton: function(atractor, k, i, j){
		this.red = this.green = this.blue = 0;
		if(atractor == 1)	this.red = N > 1 ? 255*k/ (N - 1) : 255;
		if(atractor == 2)	this.green = N > 1 ? 255*k/ (N - 1) : 255;
		if(atractor == 3)	this.blue = N > 1 ? 255*k/ (N - 1) : 255;
		this.entry(i, j);
	}
}
var Fractals = {
	cos: Math.cos(Math.PI / 3),
	sin: Math.sin(Math.PI / 3),
	epsilon: 0.0001,

	Mandelbrot: function(c){
		let x = 0;
		let y = 0;
		let newX = 0;
		let newY = 0;
		for(var i=0; i<N; i++) {
			newX = x * x - y * y + c.x;
			newY = 2 * x * y + c.y;
			if (newX * newX + newY * newY > 4)
				return i;
			x = newX;
			y = newY;
		}
		return 0;
	},
	Newton: function(complex){
		return this.NewtonR(complex, 0, N);
	},
	NewtonR: function(c, iter, n) {
		if (n == 0)	return {at : 0, it : iter};
		if (Math.abs(c.x - 1) <= this.epsilon && c.y <= this.epsilon)	return {at : 1, it : iter};
		if (Math.abs(c.x + this.cos) <= this.epsilon && Math.abs(c.y - this.sin) <= this.epsilon)	return {at : 2, it : iter};
		if (Math.abs(c.x + this.cos) <= this.epsilon && Math.abs(c.y + this.sin) <= this.epsilon)	return {at : 3, it : iter};

		let a = c.x * c.x;
		let b = c.y * c.y;
		let nX = 2 * c.x / 3 + (a - b) / (3 * Math.pow((a + b), 2));
		let nY = 2 * c.y * (1 - c.x / Math.pow((a + b), 2)) / 3;
		return this.NewtonR({x: nX, y: nY}, iter + 1, n - 1);
	},
	Julian: function (c) {
		var x = c.x;
		var y = c.y;
		var newX = 0;
		var newY = 0;
		for(var i=0; i<N; i++) {
			if (x * x + y * y > 4)
				return i;
			newX = x * x - y * y + C.x;
			newY = 2 * x * y + C.y;
			x = newX;
			y = newY;
		}
		return 0;
	}
}

function CreatFract(){
	var atractor, atr;
	for (var i = 0; i < canvasWidth; ++i){
        for (var j = 0; j < canvasHeight; ++j) {
			let complexP = ComplexPoints(i, j, PCP);
			switch(FractalType){
				case "1":
					var a = Fractals.Newton(complexP);
					atractor = a.it;
					atr = a.at;
					break;
				case "2":
					atractor = Fractals.Mandelbrot(complexP);
					break;
				case "3":
					atractor = Fractals.Julian(complexP);
					break;
			}
			switch(ColorType){
				case "1":
					ColorFractal.classicalNewton(atr, i, j);
					break;
				case "2":
					ColorFractal.classical(atractor, i, j);
					break;
				case "3":
					ColorFractal.levels(atractor, i, j);
					break;
				case "4":
					ColorFractal.zebra(atractor, i, j);
					break;
				case "5":
					ColorFractal.hybridNewton(atr, atractor, i, j);
					break;
			}
		}
	}
	context.putImageData(imageFract, 0, 0);
}

function ComplexPoints(i, j, thisC){
	let newPoints = {
		x: (i * (thisC.right - thisC.left)/(canvasWidth - 1)) + thisC.left,
		y: (j * (thisC.bottom - thisC.topp)/(canvasHeight - 1)) + thisC.topp
	}
	
	return newPoints;
}

function MouseDown(start, end){
	let left = start.x - 9;
    let topp = start.y - 9;
    let right = end.x - 9;
    let bottom = end.y - 9;
	
	let point1 = ComplexPoints(left, topp, PCP);
    let point2 = ComplexPoints(right, bottom, PCP);
    PCP.left = point1.x;
    PCP.topp = point1.y;
    PCP.right = point2.x;
    PCP.bottom = point2.y;
    CreatFract();
}

document.onmousedown = function(){
	PCP.startCoords = {
		x: event.clientX,
		y: event.clientY
	};
	sframe.style.left = PCP.startCoords.x;
	sframe.style.top = PCP.startCoords.y;

	if(event.clientX < canvasWidth && event.clientY < canvasHeight)
		sframe.style.visibility = 'visible';
	document.onmousemove = function(){
		PCP.endCoords = {
			x: event.clientX,
			y: event.clientY
		};
		//var sframe = document.getElementById('selectFrame');
		if(PCP.endCoords.x >= canvasHeight + 9)	PCP.endCoords.x = canvasHeight + 9;
		if(PCP.endCoords.y >= canvasWidth + 9)	PCP.endCoords.y = canvasWidth + 9;

		sframe.style.width = PCP.endCoords.x - PCP.startCoords.x;
		sframe.style.height = PCP.endCoords.y - PCP.startCoords.y;
	}
}

document.onmouseup = function(){
	sframe.style.visibility = 'hidden';
	if(parseInt(sframe.style.width.slice(0,-2)) < parseInt(sframe.style.height.slice(0,-2)))
		PCP.endCoords.y = PCP.startCoords.y + parseInt(sframe.style.width.slice(0,-2));
	else
		PCP.endCoords.x = PCP.startCoords.x + parseInt(sframe.style.height.slice(0,-2));
	if(PCP.startCoords.x < canvasWidth && PCP.startCoords.y < canvasHeight)
		MouseDown(PCP.startCoords, PCP.endCoords);
}

function Start(){
	PCP.left = -2,
	PCP.topp = -2,
	PCP.right = 2,
	PCP.bottom = 2,
	C.x = parseFloat(document.getElementById("x").value);
	C.y = parseFloat(document.getElementById("y").value);
	N = parseInt(document.getElementById("n").value);
	FractalType = myForm.type.options[myForm.type.selectedIndex].value;
	ColorType = myForm.colour.options[myForm.colour.selectedIndex].value;
	CreatFract();
}

addEventListener("keydown", function(event) {
    if (event.code == "Enter")	{	Start();}
 });

 myForm.type.addEventListener("change", function(){
	  var cH = document.getElementById("1");
	  var c = document.getElementById("2");
	  var h = document.getElementById("5");
	  if(myForm.type.options[myForm.type.selectedIndex].value != "1"){
		  c.disabled = false;
		  cH.disabled = true;
		  h.disabled = true;
	  }
	  else{
		  c.disabled = true;
		  cH.disabled = false;
		  h.disabled = false;
	  }
 });
