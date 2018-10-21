var gridNow;
var isClicked = false;
var selectMode = false;
var x;
var y;
var points;
var cx, cy;
var seedx, seedy;
function create2DArray(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }

    return arr;
}
function updateCanvas() {
    document.getElementById('output_grid').width = window.innerWidth * 0.98;
    // console.log('update width');
    if (gridNow) gridNow.act();
}

function onGridSizeChange() {
    isClicked = false;

    x = $("#data_x").val();
    y = $("#data_y").val();
    if (x <= 0 || y <= 0) return;
    gridNow = new Grid("output_grid", 0, x, 0, y);
    if (x * 5 < $(window).width() && y * 5 < $(window).height()) {
        for (var i = 0; i <= y; i++) {
            gridNow.addLine([0, i], [x, i], 'gray');
        }
        for (var i = 0; i <= x; i++) {
            gridNow.addLine([i, 0], [i, y], 'gray');
        }
    }
    points = create2DArray(x);
    rects = [];
    seedx = seedy = undefined;
    gridNow.act();
}
$("#data_y").change(onGridSizeChange);
$("#data_x").change(onGridSizeChange);

$("#output_grid").on("mousedown", function (e) {
    isClicked = true;
});
$("#output_grid").on("mouseup", function (e) {
    isClicked = false;
});
$("#output_grid").on("mouseleave", function (e) {
    isClicked = false;
});


function repaint() {
    gridNow.clearRects();
    for (var row in points) {
        for (var col in points[row]) {
            if (points[row][col] == 2) {
                gridNow.addRect([row, col], [1, 1], 'slateblue');
            } else if (points[row][col] == 1) {
                gridNow.addRect([row, col], [1, 1], 'orange');
            }
        }
    }
    gridNow.act();
}
$("#output_grid").mousemove(function (e) {
    if (gridNow) {
        if (isClicked) {
            var offset = $(this).offset();
            var ox = e.pageX - offset.left;
            var oy = e.pageY - offset.top;
            var width = $(this).width();
            var height = $(this).height();
            var nowX = Math.floor(ox / width * x);
            var nowY = Math.floor(oy / height * y);
            if (cx || cy) {
                var line = getLine(cx, cy, nowX, nowY);
                for (var i in line) {
                    points[line[i][0]][line[i][1]] = 2;
                }
                cx = nowX; cy = nowY;
                repaint();
            } else {
                cx = nowX; cy = nowY;
            }
        } else { cx = undefined; cy = undefined; }
    }
});
$("#output_grid").on('click', function (e) {
    if (gridNow) {
        if (selectMode) {
            var offset = $(this).offset();
            var ox = e.pageX - offset.left;
            var oy = e.pageY - offset.top;
            var width = $(this).width();
            var height = $(this).height();
            seedx = Math.floor(ox / width * x);
            seedy = Math.floor(oy / height * y);
        }
    }
});
$(document).ready(function () {
    updateCanvas();
    $('#data_x').val(
        Math.floor($(window).width() / 10));
    $('#data_y').val(
        Math.floor($(window).height() / 10));
    onGridSizeChange();
});

$(window).on('resize', function () {
    updateCanvas();
});

$("#clear").on("click", function () {
    onGridSizeChange();
});
function showSteps(ctx, order, now) {
    if (gridNow) {
        if (now >= order.length) return;

        gridNow.drawBlockInst(order[now], ctx);
        setTimeout(function () {
            showSteps(ctx, order, now + 1);
        }, 0);
    }
}
$("#start").on("click", function () {
    if (gridNow && seedx && seedy) {
        var order = boundaryFilling(points, [x, y], [seedx, seedy]);
        gridNow.setNextColor("orange");
        var ctx = gridNow.ctx();
        showSteps(ctx, order, 0);
    } else {
        alert("INIT NOT COMPLETE");
    }

});
$('#select_mode').on('change', function () {
    selectMode = $(this).is(':checked');
});