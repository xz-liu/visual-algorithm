var polygon = [];
var ETABLE_X = 0,
    ETABLE_YMAX = 1,
    ETABLE_K = 2;
function newEdge(p1, p2) {
    var x1 = p1[0], x2 = p2[0], y1 = p1[1], y2 = p2[1];
    var ans = [];
    if (y1 < y2) {
        ans[ETABLE_X] = x1;
        ans[ETABLE_YMAX] = y2;
        ans[ETABLE_K] = (x2 - x1) * 1.0 / (y2 - y1);
        return [y1, ans];
    } else {
        ans[ETABLE_X] = x2;
        ans[ETABLE_YMAX] = y1;
        ans[ETABLE_K] = (x2 - x1) * 1.0 / (y2 - y1);
        return [y2, ans];
    }

}
function createEdgeTable(yMin, yMax) {
    var edgeList = [];
    for (var i = yMin; i <= yMax; i++)edgeList[i - yMin] = [];
    var n = polygon.length;
    for (var i = 1; i < n; i++) {
        var R = newEdge(polygon[i - 1], polygon[i]);
        edgeList[R[0] - yMin].push(R[1]);
    }
    var R = newEdge(polygon[n - 1], polygon[0]);
    edgeList[R[0] - yMin].push(R[1]);
    return edgeList;
}
function scanLine(points, yMin, yMax) {
    if (points.length < 3) return [];
    polygon = points;
    var result = [];
    for (var i in polygon) {
        yMax = Math.max(polygon[i][1], yMax);
        yMin = Math.min(polygon[i][1], yMin);
    }
    console.log(yMax + ' ' + yMin);
    var edgeTable = createEdgeTable(yMin, yMax);
    console.log(edgeTable);
    var activeET = [];
    for (var i = 0; i < yMax - yMin + 1; i++) {
        console.log("NEXT LINE");
        // console.log(activeET);
        for (var j = 0; j < edgeTable[i].length; j++) {
            activeET.push(edgeTable[i][j]);
        }
        activeET.sort((a, b) => {
            if (Math.abs(a[ETABLE_X] - b[ETABLE_X]) < 1e-6)
                return Math.sign(a[ETABLE_K] - b[ETABLE_K]);
            return Math.sign(a[ETABLE_X] - b[ETABLE_X]);
        });
        for (var j = 0; j < activeET.length; j++) {
            console.log("\t\t" + activeET[j]);
        }
        for (var j = 0; j < activeET.length - 1; j += 2) {
            var ll;
            if (activeET[j][ETABLE_X] - Math.floor(activeET[j][ETABLE_X]) >= 0.5) {
                ll = Math.floor(activeET[j][ETABLE_X]) + 1;
            } else
                ll = Math.floor(activeET[j][ETABLE_X]);
            var rr;
            if (activeET[j + 1][ETABLE_X] - Math.floor(activeET[j + 1][ETABLE_X]) >= 0.5) {
                rr = Math.floor(activeET[j + 1][ETABLE_X]) + 1;
            } else
                rr = Math.floor(activeET[j + 1][ETABLE_X]);
            console.log("\t " + ll + " " + rr);
            for (var l = ll; l < rr; l++) {
                result.push([l, i + yMin]);
            }
        }

        for (var j = 0; j < activeET.length;) {
            if (activeET[j][ETABLE_YMAX] - 1 == i + yMin) {
                activeET.splice(j, 1);
            } else j++;
        }
        for (var j = 0; j < activeET.length; j++) {
            activeET[j][ETABLE_X] += activeET[j][ETABLE_K];
        }
    }
    return result;
}
// function polygonReset() {
//     polygon = [];
// }
// function polygonAddPoint(xpos, ypos) {
//     polygon.push([xpos, ypos]);
// }
