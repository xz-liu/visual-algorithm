function getLine(x0, y0, x1, y1) {
    var st = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (st) {
        y0 = [x0, x0 = y0][0];
        y1 = [x1, x1 = y1][0];
    }
    if (x0 > x1) {
        x1 = [x0, x0 = x1][0];
        y1 = [y0, y0 = y1][0];
    }
    var dx = x1 - x0, dy = Math.abs(y1 - y0);
    var up = 2 * dx - 2 * dy;
    var down = -2 * dy;
    var err = Math.floor(dx - 2 * dy);// dx / 2;
    var ys, y = y0, x = x0;
    if (y0 < y1) ys = 1; else ys = -1;
    var res = [];
    for (x = x0; x <= x1; x++) {
        if (st) res.push([y, x]);
        else res.push([x, y]);
        // err -= dy;
        if (err < 0) {
            y += ys;
            err += up;
        } else err += down;
    }
    return res;

}

function getCircle(x0, y0, x1, y1) {
    var r = Math.floor(Math.sqrt((x1 - x0) * (x1 - x0)
        + (y1 - y0) * (y1 - y0)))
    var x = 0, y = r, d = 1 - r;
    var res = [];
    while (x <= y) {
        res.push([x + x0, y + y0]);
        res.push([-x + x0, -y + y0]);
        res.push([x + x0, -y + y0]);
        res.push([-x + x0, y + y0]);
        res.push([y + x0, x + y0]);
        res.push([y + x0, -x + y0]);
        res.push([-y + x0, x + y0]);
        res.push([-y + x0, -x + y0]);
        if (d < 0) d += 2 * x + 3;
        else {
            d += 2 * (x - y) + 5;
            y--;
        }
        x++;
    }
    return res;
}

function getEllipse(x0, y0, x1, y1) {
    var a = Math.abs(y0 - y1), b = Math.abs(x0 - x1);
    var st = a < b;
    if (st) {
        b = [a, a = b][0];
    }
    var res = [];
    //console.log('ab ' + a + " " + b);
    var x = 0, y = b;
    var a2 = a * a, b2 = b * b;
    var p = b2 + Math.floor((a2 * (1 - 4 * b) - 2) / 4);
    var dpe = 3 * b2, d2pe = 2 * b2, dpse = dpe - 2 * a2 * (b - 1), d2pse = d2pe + 2 * a2;

    var pushRes = function (xc, yc, yn, xn) {
        res.push([xc + xn, yc + yn]);
        res.push([xc - xn, yc + yn]);
        res.push([xc + xn, yc - yn]);
        res.push([xc - xn, yc - yn]);
    }
    if (st) pushRes(x0, y0, y, x);
    else pushRes(x0, y0, x, y);
    while (dpse < (2 * a2 + 3 * b2)) {
        if (p < 0) {
            p += dpe;
            dpe += d2pe;
            dpse += d2pe;
        } else {
            p += dpse;
            dpe += d2pe;
            dpse += d2pse;
            y--;
        }
        x++;
        if (st) pushRes(x0, y0, y, x);
        else pushRes(x0, y0, x, y);
    }
    p -= Math.floor((a2 * (4 * y - 3) + b2 * (4 * x + 3) + 2) / 4);
    var d2ps = 2 * a2;
    dpe = a2 * (3 - 2 * y);
    dpse = 2 * b2 + 3 * a2;
    while (y > 0) {
        if (p > 0) {
            p += dpe;
            dpe += d2ps;
            dpse += d2ps;
        } else {
            p += dpse;
            dpe += d2ps;
            dpse += d2pse;
            x++;
        }
        y--;
        if (st) pushRes(x0, y0, y, x);
        else pushRes(x0, y0, x, y);
    }
    return res;
}
