cos = Math.cos(Math.PI / 3);
sin = Math.sin(Math.PI / 3);

function getAtract(x, y, iteration, n) {
    if (n == 0) return { atract: 0, iteration: iteration };

    if (Check(x, y, 1, 0)) return { atract: 1, iteration: iteration };

    if (Check(x, y, -cos, sin)) return { atract: 2, iteration: iteration };

    if (Check(x, y, -cos, -sin)) return { atract: 3, iteration: iteration };

    var a = x * x;
    var b = y * y;

    var X = 2 * x / 3 + (a - b) / (3 * ((a + b) * (a + b)));
    var Y = 2 * y * (1 - x / ((a + b) * (a + b))) / 3;
    return getAtract(X, Y, iteration + 1, n - 1);
}

function Check(x1, y1, x2, y2) {
    var epsilon = 0.000000001;
    return (Math.abs(x1 - x2) <= epsilon && Math.abs(y1 - y2) <= epsilon);
}

function GetPool(x, y) {
    var atract = getAtract(x, y, 0, myCanvas.n);
    return myCanvas.identifyColor(atract);
}