function MyCanvas() {
    this.left;
    this.top;
    this.right;
    this.bottom;
    this.width = 666;
    this.height = 666;
    this.color;
    this.method;
    this.a;
    this.b;
    this.n;

    this.getCoordinates = function (x, y) {
        var i = x * (this.right - this.left) / (this.width - 1) + this.left;
        var j = y * (this.bottom - this.top) / (this.height - 1) + this.top;
        return { x: i, y: j };
    };

    this.newCoords = function (l, t, r, b) {
        this.left = l;
        this.top = t;
        this.right = r;
        this.bottom = b;
    };

    this.callFunction = function (x, y) {
        switch (this.method) {
            case "Pool":
                return GetPool(x, y);
            case "Mandelbrot":
                return GetMandelbrot(x, y);
            case "Julia":
                return GetJulia(x, y);
        }
    };

    this.identifyColor = function (d) {
        var atract;
        var iteration = d;
        if (this.method == "Pool") {
            atract = d.atract;
            iteration = d.iteration;
        }
        switch (this.color) {
            case "classic":
                if (this.method == "Pool")
                    return ClassicPool(atract);
                return Classic(iteration);
            case "level":
                return Level(iteration);
            case "zebra":
                return Zebra(iteration);
            case "gibrid":
                if (this.method == "Pool")
                    return GibridColor(atract, iteration);
        }
    };

    this.readFields = function () {
        var p = document.getElementById("number");
        this.n = p.value
        p = document.getElementById("color");
        this.color = p.value;
        p = document.getElementById("method");
        this.method = p.value;
        p = document.getElementById("x");
        this.a = p.value;
        p = document.getElementById("y");
        this.b = p.value;
    }
}

myCanvas = new MyCanvas();

document.oncontextmenu = function () {
    return false;
};

function touch() {
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", function (e) {
        mouseDownHandler(canvas, e);
    }, false);
}

function getFractal(left, top, right, bottom) {
    myCanvas.newCoords(left, top, right, bottom);
    myCanvas.readFields();
    var canvas = document.getElementById("canvas");

    var context = canvas.getContext('2d');

    var imageData = context.createImageData(myCanvas.width, myCanvas.height);

    for (var i = 0; i < myCanvas.width; ++i) {
        for (var j = 0; j < myCanvas.height; ++j) {
            var point = myCanvas.getCoordinates(i, j);
            var paint = myCanvas.callFunction(point.x, point.y);
            imageData.data[4 * (i + myCanvas.width * j) + 0] = paint[0];
            imageData.data[4 * (i + myCanvas.width * j) + 1] = paint[1];
            imageData.data[4 * (i + myCanvas.width * j) + 2] = paint[2];
            imageData.data[4 * (i + myCanvas.width * j) + 3] = paint[3];
        }
    }

    context.putImageData(imageData, 0, 0);
}
function mouseDownHandler(canvas, e) {
    var z = 4;
    var coords = canvas.relMouseCoords(e);
    var ox, oy;

    if (e.button === 0) {
        ox = myCanvas.width / z;
        oy = myCanvas.height / z;
    } else if (e.button === 2) {
        ox = myCanvas.width * z / 2;
        oy = myCanvas.height * z / 2;
    }

    var left = coords.x - ox;
    var top = coords.y - oy;
    var right = coords.x + ox;
    var bottom = coords.y + oy;
    var point1 = myCanvas.getCoordinates(left, top);
    var point2 = myCanvas.getCoordinates(right, bottom);

    getFractal(point1.x, point1.y, point2.x, point2.y);
}

HTMLCanvasElement.prototype.relMouseCoords = function (event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;

    while (currentElement = currentElement.offsetParent) {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return { x: canvasX, y: canvasY }
}
