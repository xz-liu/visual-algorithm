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

function toCode(x, y, leftTop, rightBottom) {
    var code = 0;
    if (y < leftTop[1]) code = 8;
    else if (y < rightBottom[1]) code = 0;
    else code = 4;
    if (x < leftTop[0]) code += 1;
    else if (x > rightBottom[0]) code += 2;
    return code;
}
var LINESTATUS_DISCARD = 0,
    LINESTATUS_ACCEPT = 1,
    LINESTATUS_DIVIDE = 2;
function nextLine(line, leftTop, rightBottom) {
    var c1 = toCode(line[0], line[1], leftTop, rightBottom);
    var c2 = toCode(line[2], line[3], leftTop, rightBottom);
    console.log(c1 + " " + c2 + " " + leftTop + " " + rightBottom);
    if ((c1|c2)==0) {
        return LINESTATUS_ACCEPT;
    } else if ((c1&c2)!=0) {
        return LINESTATUS_DISCARD;
    } else return LINESTATUS_DIVIDE;
}
function trivial(line) {
    var xDis = Math.abs(line[2] - line[0]),
        yDis = Math.abs(line[1] - line[3]);
    return (xDis < 2 && yDis < 2);
}
function cohenSutherland(lines, leftTop, rightBottom) {
    var result = [];
    var stack = lines.slice();
    while (stack.length != 0) {
        var curr = stack.shift();
        var c = nextLine(curr, leftTop, rightBottom);
        console.log(curr + " C_STATUS " + c + " LENGTH " + stack.length);
        if (c == LINESTATUS_ACCEPT) result.push(curr);
        else if (c == LINESTATUS_DIVIDE) {
            if (trivial(curr)) {
                result.push(curr);
            } else {
                var midP = [Math.floor((curr[0] + curr[2]) / 2),
                Math.floor((curr[1] + curr[3]) / 2)];
                stack.push(curr.slice(0, 2).concat(midP));
                stack.push(midP.concat(curr.slice(2)));
            }
        }
    }
    return result;
}