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
var direction = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
];
function boundaryFilling(graph, sz, seed) {
    var result = [];
    var queue = [];
    queue.push(seed);
    while (queue.length != 0) {
        var curr = queue.shift();
        result.push(curr);
        for (var i in direction) {
            var point = [curr[0] + direction[i][0], curr[1] + direction[i][1]];
            if (point[0] < 0 || point[1] < 0) continue;
            if (point[0] >= sz[0] || point[1] >= sz[1]) continue;
            if (graph[point[0]][point[1]]) continue;
            graph[point[0]][point[1]] = 1;
            queue.push(point);
        }
    }
    return result;
}