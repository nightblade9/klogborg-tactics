/////// helpers that, given a grid of tiles, get all tiles touched by a line from point a to point b
// Bresenham's line algorithm, poorly adapted from Wikipedia: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function getCellsLow(x0,y0, x1,y1) {
    var toReturn = [];

    var dx = x1 - x0;
    var dy = y1 - y0;
    var yi = 1;
    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    var D = 2*dy - dx;
    var y = y0;

    for (var x = x0; x <= x1; x++) { // [iQ: <= ]
        toReturn.push({"x": x, "y": y});
        if (D > 0) {
             y = y + yi;
             D = D - 2*dx;
        }        
        D = D + 2*dy;
    }

    return toReturn;
}

function getCellsHigh(x0,y0, x1,y1) {
    var toReturn = [];

    var dx = x1 - x0;
    var dy = y1 - y0;
    var xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    var D = 2*dx - dy;
    var x = x0

    for (var y = y0; y <= y1; y++) { // [iQ: <= ]
        toReturn.push({"x": x, "y": y});
        if (D > 0) {
            x = x + xi;
            D = D - 2*dy;
        }
        D = D + 2*dx;
    }

    return toReturn;
}

// Gets INCLUSIVE cells; for EXCLUSIVE of end-point, look up [iQ] above and change <= to <
function getCellsBetween(x0,y0, x1,y1) {
    if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
        if (x0 > x1) {
            return getCellsLow(x1, y1, x0, y0);
        } else {
            return getCellsLow(x0, y0, x1, y1);
        }
    } else {
        if (y0 > y1) {
            return getCellsHigh(x1, y1, x0, y0);
        } else {
            return getCellsHigh(x0, y0, x1, y1)
        }
    }
}