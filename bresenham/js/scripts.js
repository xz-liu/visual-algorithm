var gridNow;
var isClicked = false;

var x;
var y;
var cx, cy;


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
    rects = [];
    gridNow.act();
}
$("#data_y").change(onGridSizeChange);
$("#data_x").change(onGridSizeChange);

$("#output_grid").click(function (e) {
    if (gridNow) {
        var offset = $(this).offset();
        var ox = e.pageX - offset.left;
        var oy = e.pageY - offset.top;
        var width = $(this).width();
        var height = $(this).height();
        var nowX = Math.floor(ox / width * x);
        var nowY = Math.floor(oy / height * y);
        if (isClicked) {
            isClicked = false;
        } else {
            cx = nowX;
            cy = nowY;
            // console.log(cx+' '+cy);
            isClicked = true;
            gridNow.clearRects();
            gridNow.addRect([cx, cy][1, 1], 'red');
            gridNow.act();
        }

    }
});
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
            var rects = getLine(cx, cy, nowX, nowY);
            var cRects = getCircle(cx, cy, nowX, nowY);
            var eRects = getEllipse(cx, cy, nowX, nowY);
            //    console.log(eRects);
            gridNow.clearRects();
            for (var i in rects) {
                gridNow.addRect([rects[i][0], rects[i][1]], [1, 1],
                    'slateblue');
            }
            for (var i in cRects) {
                gridNow.addRect([cRects[i][0], cRects[i][1]], [1, 1],
                    'DarkCyan');
            }
            for (var i in eRects) {
                gridNow.addRect([eRects[i][0], eRects[i][1]], [1, 1],
                    'orchid');
            }
            gridNow.act();
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