var currentFract = 'newtonPool';
var currentColor = 'classic';
var scale = 2;
var coords = {
    left: -2,
    top: -2,
    right: 2,
    bottom: 2
};

function updateCoords(left, top, right, bottom) {
    coords.left = left;
    coords.right = right;
    coords.top = top;
    coords.bottom = bottom;
}

var resetScale = () => {
    scale = 2;
};

function paintClassic(point, fractType) {
    if (fractType === "newtonPool") {
        switch (point.attractor) {
            case 0:
                return [255, 255, 255, 255];
            case 1:
                return [255, 0, 0, 255];
            case 2:
                return [0, 255, 0, 255];
            case 3:
                return [0, 0, 255, 255];
        }
    } else return point.it === 0 ? [0, 0, 0, 255] : [255, 255, 255, 255];
}

function paintLevels(n, it) {
    var brightness = n > 1 ? 255 * it * 4 / (n - 1) : 255;
    return [brightness, brightness, brightness, 255];
}

function paintZebra(it) {
    var color;
    it % 2 === 0 ? color = [0, 0, 0, 255] : color = [255, 255, 255, 255];
    return color;
}

function changeColor(color) {
	resetScale();
    currentColor = color;
    run(0, 0, currentFract);
}

function chooseColor(pointData, n) {
    switch (currentColor) {
        case 'classic':
            return paintClassic(pointData, currentFract);
        case 'levels':
            return paintLevels(n, pointData.it);
        case 'zebra':
            return paintZebra(pointData.it);
    }
}

function mouseDownHandler(canvas, e) {
    var mouseCoords = canvas.relMouseCoords(e);
    var i = mouseCoords.x * (coords.right - coords.left) / (canvas.width - 1) + coords.left;
    var j = mouseCoords.y * (coords.bottom - coords.top) / (canvas.height - 1) + coords.top;
    if (e.button === 0) {
        scale /= 1.5;
    }
    if (e.button === 2) {
        scale *= 1.5;
    }
    run(i, j, currentFract);
}

function mousePress() {
    canvas.addEventListener("mousedown",
        function (e) {
            mouseDownHandler(canvas, e);
        },
        false);
}

function run(centerX, centerY, fractType) {
	resetScale();
    if (fractType === undefined)
        fractType = currentFract;
    currentFract = fractType;
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    var left = centerX - scale;
    var top = centerY - scale;
    var right = centerX + scale;
    var bottom = centerY + scale;
    var n = parseInt(document.getElementById('n').value);
    drawFractal(left, top, right, bottom, fractType, n);
}

function drawPixel(x, y, r, g, b, a, width, canvasData) {
    var index = (x + y * width) * 4;
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function drawFractal(left, top, right, bottom, fractType, n) {
    console.log("left " + left + " right " + right + " top " + top + " bottom  " + bottom);
    updateCoords(left, top, right, bottom);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            var i = x * (right - left) / (canvas.width - 1) + left;
            var j = y * (bottom - top) / (canvas.height - 1) + top;
            var pointData = choseFractal(i, j, n, fractType);
            var color = chooseColor(pointData, n);
            drawPixel(x, y, color[0], color[1], color[2], color[3], canvas.width, canvasData);
        }
    }
    ctx.putImageData(canvasData, 0, 0);
}

function choseFractal(i, j, n, fractType) {
    switch (fractType) {
        case 'newtonPool':
            return newtonPool(i, j, n, 0);
        case 'mandelbrotSet':
            return mandelbrotSet(i, j, n);
        case 'juliaSet':
            var re = parseFloat(document.getElementById('re').value);
    		var im = parseFloat(document.getElementById('im').value);
            return juliaSet(i, j, re, im, n);
    }
}

function newtonPool(i, j, n, it) {
    var cos = Math.cos(Math.PI / 3);
    var sin = Math.sin(Math.PI / 3);

    if (n === 0)
        return {
            attractor: 0,
            it: it
        };
    if (checkVicinity(i, j, 1, 0))
        return {
            attractor: 1,
            it: it
        };
    if (checkVicinity(i, j, -cos, sin))
        return {
            attractor: 2,
            it: it
        };
    if (checkVicinity(i, j, -cos, -sin))
        return {
            attractor: 3,
            it: it
        };
    var i2 = i * i;
    var j2 = j * j;
    var i1 = 2 / 3 * i + (i2 - j2) / (3 * Math.pow((i2 + j2), 2));
    var j1 = 2 / 3 * j * (1 - i / Math.pow((i2 + j2), 2));
    return newtonPool(i1, j1, n - 1, it + 1);
}

function checkVicinity(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) <= 0.0001 && Math.abs(y2 - y1) <= 0.0001;
}

function mandelbrotSet(i, j, n) {
    var i0 = 0;
    var j0 = 0;
    var i1 = 0;
    var j1 = 0;
    var k = 0;
    while (k < n) {
        i1 = i0 * i0 - j0 * j0 + i;
        j1 = 2 * i0 * j0 + j;
        if (i1 * i1 + j1 * j1 > 4)
            return {
                it: k
            };
        i0 = i1;
        j0 = j1;
        k++;
    }
    return {
        it: 0
    };
}

function juliaSet(i, j, re, im, n) {
    var i0 = i;
    var j0 = j;
    var i1 = 0;
    var j1 = 0;
    var k = 0;
    while (k < n) {
        if (i0 * i0 + j0 * j0 > 4)
            return {
                it: k
            };
        i1 = i0 * i0 - j0 * j0 + re;
        j1 = 2 * i0 * j0 + im;
        i0 = i1;
        j0 = j1;
        k++;
    }
    return {
        it: 0
    };
}