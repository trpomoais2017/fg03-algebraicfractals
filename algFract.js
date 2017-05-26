var EPSILON = 0.001;
var ITERATIONS = 100;

class Neighbourhood {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.eps = EPSILON;
        this.color = color;
    }
    contain(x, y) {
        return Math.abs(x - this.x) <= this.eps && Math.abs(y - this.y) <= this.eps;
    }
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

var Colors = {
    Red: [240, 60, 50],
    Green: [100, 240, 60],
    Blue: [60, 100, 240],
    White: [255, 255, 255],
    Black: [0, 0, 0]
};

var m = Math.random();

function getColor(actualIterations, coloringType, fractalType, attractor) {
    switch (coloringType) {
        case "Classic":
            if (fractalType === "NewtonFractal")
                return attractor.color;
            return actualIterations === 0 ? Colors.Black : Colors.White;
        case "Zebra":
            return actualIterations % 2 === 0 ? Colors.Black : Colors.White;
        case "Rainbow":
            var c = HSVtoRGB(m / actualIterations, 0.9, ITERATIONS / actualIterations % 0.8);
            var color = [c.r, c.g, c.b];
            return color;
        case "Levels":
            var brightness = ITERATIONS > 1 ? 255 * actualIterations / (ITERATIONS - 1) : 0;
            var color = [];
            for (var i = 0; i < 3; i++) {
                color[i] = brightness
            }
            return color;
        default:
            return actualIterations === 0 ? Colors.Black : Colors.White;
    }
}

var im = Math.random(2);
var re = Math.random(2);
class JuliaSet {
    getPointColor(i, j, coloringType) {
        var i0 = i;

        var j0 = j;
        var i1 = 0;
        var j1 = 0;
        var k = 0;
        while (k < ITERATIONS) {
            if (i0 * i0 + j0 * j0 > 4)
                return getColor(k, coloringType, "JuliaSet");
            i1 = i0 * i0 - j0 * j0 + re;
            j1 = 2 * i0 * j0 + im;
            i0 = i1;
            j0 = j1;
            k++;
        }
        return getColor(0, coloringType, "JuliaSet");
    }
}

class MandelbrotSet {

    getPointColor(x, y, coloringType) {
        var i0 = 0;
        var j0 = 0;
        var i1 = 0;
        var j1 = 0;
        var k = 0;
        while (k < ITERATIONS) {
            i1 = i0 * i0 - j0 * j0 + x;
            j1 = 2 * i0 * j0 + y;
            if (i1 * i1 + j1 * j1 > 4)
                return getColor(k, coloringType, "MandelbrotSet");
            i0 = i1;
            j0 = j1;
            k++;
        }
        return getColor(0, coloringType, "MandelbrotSet");
    }
}

class NewtonFractal {
    constructor() {
        this.cos = Math.cos(Math.PI / 3);
        this.sin = Math.sin(Math.PI / 3);
        this.attractors = [
            new Neighbourhood(1, 0, Colors.Red),
            new Neighbourhood(-this.cos, this.sin, Colors.Blue),
            new Neighbourhood(-this.cos, -this.sin, Colors.Green)
        ];
    }
    nextPoint(p) {
        var x = p.x;
        var y = p.y;

        return {
            x: 2 / 3 * x + 1 / 3 * (x * x - y * y) / Math.pow(x * x + y * y, 2),
            y: 2 / 3 * y * (1 - x / Math.pow(x * x + y * y, 2))
        };
    }

    getPointColor(x, y, coloringType) {
        var point = { x: x, y: y };
        for (var i = 0; i < ITERATIONS; i++) {
            for (var j = 0; j < this.attractors.length; j++) {
                if (this.attractors[j].contain(point.x, point.y)) {
                    return getColor(i, coloringType, "NewtonFractal", this.attractors[j]);
                }
            }
            point = this.nextPoint(point);
        }
        return Colors.White;
    }
}

var fractalBorder = {
    top: -1.8,
    bottom: 1.8,
    left: -1.8,
    right: 1.8
}

function getRealCoordinate(i, j) {
    return {
        x: fractalBorder.left + i * (fractalBorder.right - fractalBorder.left) / (width - 1),
        y: fractalBorder.top + j * (fractalBorder.bottom - fractalBorder.top) / (height - 1)
    };
}

var NewtonFract = new NewtonFractal();
var Mandelbrot = new MandelbrotSet();
var Julia = new JuliaSet();

function setup() {
    createCanvas(500, 500);
    pixelDensity(1);
    drawFractal();
}

function drawFractal() {
    loadPixels();

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var coord = getRealCoordinate(x, y);
            var color = getFractalPointColor(coord.x, coord.y, "Julia", "Rainbow");
            drawPixel(x, y, color[0], color[1], color[2]);
        }
    }

    updatePixels();
    // saveCanvas('myCanvas', 'png');
}

function getFractalPointColor(x, y, fractalType, coloringType) {
    switch (fractalType) {
        case "Newton":
            return NewtonFract.getPointColor(x, y, coloringType);
        case "Mandelbrot":
            return Mandelbrot.getPointColor(x, y, coloringType);
        case "Julia":
            return Julia.getPointColor(x, y, coloringType);
        default:
            return NewtonFractal.getPointColor(x, y, coloringType);
    }
}

function drawPixel(x, y, r, g, b) {
    pix = (x + y * width) * 4;
    pixels[pix + 0] = r;
    pixels[pix + 1] = g;
    pixels[pix + 2] = b;
    pixels[pix + 3] = 255;
}