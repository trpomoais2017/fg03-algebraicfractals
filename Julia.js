function FindIteration(x, y, a, b, n) {
    var x0 = x;
    var y0 = y;
    var x1 = 0;
    var y1 = 0;
    var i = 0;
    while (i < n) {
        if (x0 * x0 + y0 * y0 > 4)
            return i;
        x1 = x0 * x0 - y0 * y0 + a;
        y1 = 2 * x0 * y0 + b;
        x0 = x1;
        y0 = y1;
        i++;
    }
    return 0;
}

function GetJulia(x, y) {
    var iteration = FindIteration(x, y, parseFloat(myCanvas.a), parseFloat(myCanvas.b), myCanvas.n);
    return myCanvas.identifyColor(iteration);
}