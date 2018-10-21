var gridNow;
var isClicked = false;
var selectMode = false;
var x;
var y;
var lines = [];
var cx, cy;
var selectCx, selectCy, selectEx, selectEy;
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
            // lines.push([cx, cy, nowX, nowY]);
            isClicked = false;
        } else {
            isClicked = true;
            if (selectMode) {
                selectCx = nowX;
                selectCy = nowY;
            } else {
                cx = nowX;
                cy = nowY;
                // console.log(cx+' '+cy);
                lines.push([cx, cy]);
                // gridNow.act();
            }
        }
    }
});
function repaint() {
    gridNow.clearRects();
    for (var i in lines) {
        var rects = getLine(lines[i][0], lines[i][1], lines[i][2], lines[i][3]);
        //    console.log(eRects);
        for (var j in rects) {
            gridNow.addRect([rects[j][0], rects[j][1]], [1, 1],
                'slateblue');
        }
    }
    var selSt=[Math.min(selectCx,selectEx),Math.min(selectCy,selectEy)];
    var selEd=[Math.max(selectCx,selectEx),Math.max(selectCy,selectEy)];
    var selSz=[Math.abs(selectEx-selectCx),Math.abs(selectCy-selectEy)];

    gridNow.addRect(selSt,selSz,'red');
    var newLines=cohenSutherland(lines,selSt,selEd);
    for (var i in newLines) {
        var rects = getLine(newLines[i][0], newLines[i][1], newLines[i][2], newLines[i][3]);
        //    console.log(eRects);
        for (var j in rects) {
            gridNow.addRect([rects[j][0], rects[j][1]], [1, 1],
                'white');
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
            if (selectMode) {
                selectEx=nowX;
                selectEy=nowY;
            } else {
                lines[lines.length - 1][2] = nowX;
                lines[lines.length - 1][3] = nowY;
            }
            repaint();
        }
    }
});

$(document).ready(function () {
    updateCanvas();
    $('#data_x').val(
        Math.floor($(window).width() / 2));
    $('#data_y').val(
        Math.floor($(window).height() / 2));
    onGridSizeChange();
});

$(window).on('resize', function () {
    updateCanvas();
});

$("#clear").on("click", function () {
    lines = [];
    onGridSizeChange();
});
$('#select_mode').on('change', function () {
    // console.log("FUCK");
    console.log($(this).is(':checked'));
    selectMode = $(this).is(':checked');
});