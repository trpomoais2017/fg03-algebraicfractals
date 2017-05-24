function Zebra(n) {
    if (n % 2 == 0)
        return [0, 0, 0, 255];
    else
        return [255, 255, 255, 255];
}

function Level(n) {
    var k = n;
    n = myCanvas.n;
    var brightness = n;
    if (n > 1)
        brightness = 255 * k * 4 / (n - 1);
    else
        brightness = 255;
    return [brightness, brightness, brightness, 255];
}

function Classic(d) {
    if (d == 0)
        return [0, 0, 0, 255];
    else
        return [255, 255, 255, 255];
}

function ClassicPool(atract) {
    var red = 0;
    var green = 0;
    var blue = 0;
    switch (atract) {
        case 1:
            red = 255;
            break;
        case 2:
            green = 255;
            break;
        case 3:
            blue = 255;
            break;
    }
    return [red, green, blue, 255];
}
function GibridColor(atract, n) {
    var red = 0;
    var green = 0;
    var blue = 0;
    var k = n;
    n = myCanvas.n;
    var bright = document.getElementById("numberBright");
    var brValue = bright.value;
    switch (atract) {
        case 1:
            if (n != 0)
                red = 255 * k * brValue / (n - 1);
            else
                red = 255;
            break;
        case 2:
            if (n != 0)
                green = 255 * k * brValue / (n - 1);
            else
                green = 255;
            break;
        case 3:
            if (n != 0)
                blue = 255 * k * brValue / (n - 1);
            else
                blue = 255;
            break;
    }
    return [red, green, blue, 255];
}