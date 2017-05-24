function CheckDistanses(a, b, n) {
    var x0 = 0;
    var y0 = 0;
    var x1 = 0;
    var y1 = 0;
    var i = 0;
    while (i < n) {
        x1 = x0 * x0 - y0 * y0 + a;
        y1 = 2 * x0 * y0 + b;
        if (x1 * x1 + y1 * y1 > 4)
            return i;
        x0 = x1;
        y0 = y1;
        i++;
    }
    return 0;
}

function GetMandelbrot(x, y) {
    var d = CheckDistanses(x, y, myCanvas.n);
    return myCanvas.identifyColor(d);
}