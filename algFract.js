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

var Colors = {
    Red: [240, 60, 50],
    Green: [100, 240, 60],
    Blue: [60, 100, 240],
    White: [255, 255, 255],
    Black: [0, 0, 0]
};

function getColor(actualIterations, attractor) {
    switch (coloringType) {
        case "Classic":
            if (fractalType === "Newton Fractal") {
                return attractor.color;
            }
            return actualIterations === 0 ? Colors.Black : Colors.White;
        case "Zebra":
            return actualIterations % 2 === 0 ? Colors.Black : Colors.White;
        case "Rainbow":
            var c = HSVtoRGB(maxIterations / actualIterations, 1,
                maxIterations / actualIterations % 0.8);
            var color = [c.r, c.g, c.b];
            return color;
        case "Levels":
            var brightness = maxIterations > 1 ?
                255 * actualIterations / (maxIterations - 1) : 0;
            var color = [];
            for (var i = 0; i < 3; i++) {
                color[i] = brightness
            }
            return color;
        default:
            return actualIterations === 0 ? Colors.Black : Colors.White;
    }
}

class JuliaSet {
    getPointColor(i, j) {
        var i0 = i;
        var j0 = j;
        var i1 = 0;
        var j1 = 0;
        var k = 0;
        while (k < maxIterations) {
            if (i0 * i0 + j0 * j0 > 4)
                return getColor(k);
            i1 = i0 * i0 - j0 * j0 + re;
            j1 = 2 * i0 * j0 + im;
            i0 = i1;
            j0 = j1;
            k++;
        }
        return getColor(0);
    }
}

class MandelbrotSet {
    getPointColor(x, y) {
        var i0 = 0;
        var j0 = 0;
        var i1 = 0;
        var j1 = 0;
        var k = 0;
        while (k < maxIterations) {
            i1 = i0 * i0 - j0 * j0 + x;
            j1 = 2 * i0 * j0 + y;
            if (i1 * i1 + j1 * j1 > 4)
                return getColor(k);
            i0 = i1;
            j0 = j1;
            k++;
        }
        return getColor(0);
    }
}

class NewtonFractal {
    constructor() {
        this.attractors = [
            new Neighbourhood(1, 0, Colors.Red),
            new Neighbourhood(-Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), Colors.Blue),
            new Neighbourhood(-Math.cos(Math.PI / 3), -Math.sin(Math.PI / 3), Colors.Green)
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

    getPointColor(x, y) {
        var point = { x: x, y: y };
        for (var i = 0; i < maxIterations; i++) {
            for (var j = 0; j < this.attractors.length; j++) {
                if (this.attractors[j].contain(point.x, point.y)) {
                    return getColor(i, this.attractors[j]);
                }
            }
            point = this.nextPoint(point);
        }
        return Colors.White;
    }
}

const defaultBorder = 2;
var fractalBorder = {
    top: -defaultBorder,
    bottom: defaultBorder,
    left: -defaultBorder,
    right: defaultBorder
}

function resetBorder() {
    fractalBorder.top = -defaultBorder;
    fractalBorder.bottom = defaultBorder;
    fractalBorder.left = -defaultBorder;
    fractalBorder.right = defaultBorder;
}

function getRealCoordinate(i, j) {
    return {
        x: fractalBorder.left + i * (fractalBorder.right - fractalBorder.left) / (width - 1),
        y: fractalBorder.top + j * (fractalBorder.bottom - fractalBorder.top) / (height - 1)
    };
}

const EPSILON = 0.001;
var im;
var re;

var NewtonFract = new NewtonFractal();
var Mandelbrot = new MandelbrotSet();
var Julia = new JuliaSet();

var fractalSelect;
var fractalType;
var coloringSelect;
var iteraionsSlider;
var maxIterations;
var screenshotButton;
var drawButton;
var reSlider;
var imSider;

function setup() {
    createCanvas(600, 600);
    pixelDensity(1);
    setGUI();
    drawFractal();
}

function coloringSelectEvent() {
    coloringType = coloringSelect.value();
    drawFractal();
}

function fractalTypeSelectEvent() {
    fractalType = fractalSelect.value();
    resetBorder();
    drawFractal();
}

function resetViewAndDraw() {
    resetBorder();
    drawFractal();
}

function drawFractal() {
    loadPixels();
    maxIterations = iteraionsSlider.value();
    re = reSlider.value();
    im = imSlider.value();

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var coord = getRealCoordinate(x, y);
            var color = getFractalPointColor(coord.x, coord.y, coloringType);
            drawPixel(x, y, color[0], color[1], color[2]);
        }
    }
    updatePixels();
}

function getFractalPointColor(x, y, coloringType) {
    switch (fractalType) {
        case "Newton Fractal":
            return NewtonFract.getPointColor(x, y);
        case "Mandelbrot Set":
            return Mandelbrot.getPointColor(x, y);
        case "Julia Set":
            return Julia.getPointColor(x, y);
        default:
            return NewtonFract.getPointColor(x, y);
    }
}

function drawPixel(x, y, r, g, b) {
    pix = (x + y * width) * 4;
    pixels[pix + 0] = r;
    pixels[pix + 1] = g;
    pixels[pix + 2] = b;
    pixels[pix + 3] = 255;
}

function mousePressed() {
    //Обработка только тех нажатий, которые произошли на канвасе
    if (mouseX > width || mouseY > height)
        return;
    var halfWidth = Math.abs(fractalBorder.left - fractalBorder.right) / 4;
    var realPoint = getRealCoordinate(mouseX, mouseY);
    fractalBorder.top = realPoint.y - halfWidth;
    fractalBorder.bottom = realPoint.y + halfWidth;
    fractalBorder.left = realPoint.x - halfWidth;
    fractalBorder.right = realPoint.x + halfWidth;

    console.log(fractalBorder);
    drawFractal();
}

function takeScreenshot() {
    var fractalName = fractalSelect.value();
    saveCanvas(fractalName, 'png');
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

//Надеюсь сюда никто не посмотрит...
function setGUI() {
    drawButton = createButton('Draw');
    drawButton.mousePressed(drawFractal);
    drawButton.position(width + 10, 10);
    screenshotButton = createButton('Save image');
    screenshotButton.mousePressed(takeScreenshot);
    screenshotButton.position(width + 180, 10)
    resetViewButton = createButton('Reset view');
    resetViewButton.mousePressed(resetViewAndDraw);
    resetViewButton.position(width + 80, 10);
    var sl = createP('Max iterations slider');
    sl.position(width + 10, 60);
    iteraionsSlider = createSlider(2, 200, 50, 1);
    iteraionsSlider.position(width + 10, 100);
    maxIterations = iteraionsSlider.value();
    fractalSelect = createSelect();
    fractalSelect.option('Newton Fractal');
    fractalSelect.option('Mandelbrot Set');
    fractalSelect.option('Julia Set');
    fractalSelect.changed(fractalTypeSelectEvent);
    fractalSelect.position(width + 10, 40);
    fractalType = fractalSelect.value();
    coloringSelect = createSelect();
    coloringSelect.option('Classic');
    coloringSelect.option('Levels');
    coloringSelect.option('Zebra');
    coloringSelect.option('Rainbow');
    coloringSelect.changed(coloringSelectEvent);
    coloringSelect.position(width + 150, 40);
    coloringType = coloringSelect.value();
    sl = createP('Julia set re im sliders');
    sl.position(width + 10, 120);

    reSlider = createSlider(-1, 1, 0.4, 0.01);
    reSlider.position(width + 10, 160);
    imSlider = createSlider(-1, 1, -0.3, 0.01);
    imSlider.position(width + 10, 190);

    re = reSlider.value();
    im = imSlider.value();
}