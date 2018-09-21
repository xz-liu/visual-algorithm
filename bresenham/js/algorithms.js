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
    var err = dx / 2, ys, y = y0, x = x0;
    if (y0 < y1) ys = 1; else ys = -1;
    if (x0 < x1) xs = 1; else xs = -1;
    var res = [];
    for (x = x0; x <= x1; x++) {
        if (st) res.push([y,x]);
        else res.push([x,y]);
        err -= dy;
        if (err < 0) {
            y += ys;
            err += dx;
        }
    }
    return res;

}