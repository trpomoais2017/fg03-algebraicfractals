var Plane = {
    left: -2,
    top: -2,
    right: 2,
    bottom: 2,   
};

var Fractal;
var Coloring;
var N;
var ConstJulia= {x: -0.12, y: 0.72};
var Scale = 2;
var Center = {x:0, y:0};

function run() {
    Fractal = Form.fractal.options[Form.fractal.selectedIndex].value;
    Coloring = Form.color.options[Form.color.selectedIndex].value;
    N = parseInt(document.getElementById("n").value);
    ConstJulia.x = parseFloat(document.getElementById("x").value);
    ConstJulia.y = parseFloat(document.getElementById("y").value);
    Plane.left = Center.x - Scale;
    Plane.right = Center.x + Scale;
    Plane.top = Center.y - Scale;
    Plane.bottom = Center.y + Scale;
    draw();
}

function draw() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var canvasHeight = parseInt(canvas.getAttribute("height"));
    var canvasWidth = parseInt(canvas.getAttribute("width"));
    var imageData = context.createImageData(canvasWidth, canvasHeight);

    

    for (var i = 0; i < canvasWidth; i++) {
        for (var j = 0; j < canvasHeight; j++) {
            var point = getRealCoordinates(i, j, canvasWidth, canvasHeight);

            var atr = getAttractor(point);
            var color = getColor(atr);

            imageData.data[4 * (i + canvasWidth * j) + 0] = color[0];
            imageData.data[4 * (i + canvasWidth * j) + 1] = color[1];
            imageData.data[4 * (i + canvasWidth * j) + 2] = color[2];
            imageData.data[4 * (i + canvasWidth * j) + 3] = color[3];
        }
    }
    context.putImageData(imageData, 0, 0);
}

function getRealCoordinates(i, j, width, height) {
    var X = Plane.left + i * (Plane.right - Plane.left) / (width - 1);
    var Y = Plane.top + j * (Plane.bottom - Plane.top) / (height - 1);
    return { x: X, y: Y };
}

function getAttractor(point) {
    switch (Fractal) {
        case '1':
            return getNewtonAttr(point, N, 0);
            break;
        case '2':
            return getMandelbrotAttr(point);
            break;
        case '3':            
            return getJuliaAttr(point);
            break;

    }
}

function getNewtonAttr(point, n, it) {
    var sin = Math.sin(Math.PI / 3);
    var cos = Math.cos(Math.PI / 3);
    if (n == 0)
        return { attr: 0, iter: it };
    if (checkLimit(point, 1, 0))
        return { attr: 1, iter: it };
    if (checkLimit(point, -cos, sin))
        return { attr: 2, iter: it };
    if (checkLimit(point, -cos, -sin))
        return { attr: 3, iter: it };

    var x = point.x * point.x;
    var y = point.y * point.y;
    var newX = 2 * point.x/3 + (x - y) / (3 * (x + y) * (x + y));
    var newY = 2  * point.y * (1 - point.x /Math.pow((x + y),2)) /3;
    var newP = { x: newX, y: newY };
    return getNewtonAttr(newP, n - 1, it + 1);

}

function checkLimit(start, endX, endY) {
    var eps = 0.0001;
    var deltaX = Math.abs(start.x - endX);
    var deltaY = Math.abs(start.y - endY);
    return deltaX <= eps && deltaY <= eps;
}

function getMandelbrotAttree(point) {
    var x = 0;
    var y = 0;
    var newX=0;
    var newY=0;
    for (var i = 0; i < N; i++) {
        newX = x * x - y * y + point.x;
        newY = 2 * x * y + point.y;
        if (newX * newX + newX * newY > 4)
            return i;
        x = newX;
        y = newY;
    }
    return 0;
}

function getMandelbrotAttr(point) {
    var x = point.x;
    var y = point.y;
    var newX = 0;
    var newY = 0;
    for (var i = 0; i < N; i++) {
        if (x * x + y * y > 4)
            return i;
        newX = x * x - y * y + point.x;
        newY = 2 * x * y + point.y;
        x = newX;
        y = newY;
    }
    return 0;
}

function getJuliaAttr(point) {
    var x = point.x;
    var y = point.y;
    var newX = 0;
    var newY = 0;
    for (var i = 0; i < N; i++) {
        if (x * x + y * y > 4)
            return i;
        newX = x * x - y * y + ConstJulia.x;
        newY = 2 * x * y + ConstJulia.y;
        x = newX;
        y = newY;
    }
    return 0;
}

function getColor(atr) {
    switch (Coloring) {
        case '1':
            return getClassicColor(atr);
        case '2':
            return getLevelColor(atr);
        case '3':
            return getZebraColor(atr);
    }

}

function getClassicColor(atr) {
    if (Fractal == '1') {
        switch (atr.attr) {
            case 0:
                return [0, 0, 0, 0];
                break;
            case 1:
                return [255, 0, 0, 255];
                break;
            case 2:
                return [0, 255, 0, 255];
                break;
            case 3:
                return [0, 0, 255, 255];
                break;
        }
    }
    else{
        if (atr == 0)
        return [0, 0, 0, 255]
    else
        return [255, 255, 255, 255];
    }
    

}

function getLevelColor(atr) {

    if (Fractal == '1')   {
        var it = atr.iter;
    }
    else{
        var it = atr;
    }
    var bright = 255;
    if (N > 1)
        bright = bright * it * 4 / (N - 1);
    return [bright, bright, bright, bright];

}

function getZebraColor(atr) {
    if (Fractal == '1')   {
        var it = atr.iter;
    }
    else{
        var it = atr;
    }

    if (it % 2 == 0)
        return [0, 0, 0, 255];
    return [255, 255, 255, 255];
}

function mouseDownHandler(canvas, e) {
     var сoords = canvas.relMouseCoords(e);
     var i = сoords.x * (Plane.right - Plane.left) / (canvas.width - 1) + Plane.left;
     var j = сoords.y * (Plane.bottom - Plane.top) / (canvas.height - 1) + Plane.top;
     if (e.button === 0) {
         Scale /= 1.5;
     }
     if (e.button === 2) {
         Scale *= 1.5;
     }
     Center.x = i;
     Center.y = j;
     run();
 }
 
 function mousePress() {
    canvas.addEventListener("mousedown",
        function (e) {
            mouseDownHandler(canvas, e);
        },
        false);
}

function resetScale()
{
    Scale = 2;
    Center.x = 0;
    Center.y = 0;
}
 