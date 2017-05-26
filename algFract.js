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

var Colors = {
    Red: [246, 0, 24, 255],
    Green: [37, 213, 0, 255],
    Blue: [15, 77, 168, 255],
    White: [255, 255, 255, 255],
    Black: [0, 0, 0, 255]
};

var cos = Math.cos(Math.PI / 3);
var sin = Math.sin(Math.PI / 3);

class NewtonFractal {
    constructor(coloringType) {
        this.coloringType = coloringType;
        this.attractors = [
            new Neighbourhood(1, 0, Colors.Red),
            new Neighbourhood(-cos, sin, Colors.Blue),
            new Neighbourhood(-cos, -sin, Colors.Green)
        ];
    }

    getColor(attractor, actialIteration, maxIterations) {
        return attractor.color;
    }

    nextPoint(p) {
        var x = p.x;
        var y = p.y;

        return {
            x: 2 / 3 * x + 1 / 3 * (x * x - y * y) / Math.pow(x * x + y * y, 2),
            y: 2 / 3 * y * (1 - x / Math.pow(x * x + y * y, 2))
        };
    }

    getPointColor(x, y, maxIterations) {
        var point = { x: x, y: y };
        for (var i = 0; i < maxIterations; i++) {
            for (var j = 0; j < this.attractors.length; j++) {
                // console.log(i + " " + j);
                if (this.attractors[j].contain(point.x, point.y)) {
                    return this.getColor(this.attractors[j], i, maxIterations);
                }
            }
            point = this.nextPoint(point);
        }
        return Colors.White;
    }
}

var fractalBorder = {
    top: -2,
    bottom: 2,
    left: -2,
    right: 2
}

function getRealCoordinate(i, j) {
    return {
        x: fractalBorder.left + i * (fractalBorder.right - fractalBorder.left) / (width - 1),
        y: fractalBorder.top + i * (fractalBorder.bottom - fractalBorder.top) / (height - 1)
    };
}

var Newton = new NewtonFractal("s");

function setup() {
    createCanvas(300, 300);
    pixelDensity(1);
    drawFractal();
}

function drawFractal() {
    loadPixels();

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var coord = getRealCoordinate(x, y);
            var color = Newton.getPointColor(coord.x, coord.y, ITERATIONS);
            pix = (x + y * width) * 4;
            pixels[pix + 0] = color[0];
            pixels[pix + 1] = color[1];
            pixels[pix + 2] = color[2];
            pixels[pix + 3] = color[3];
        }
    }
    updatePixels();
}