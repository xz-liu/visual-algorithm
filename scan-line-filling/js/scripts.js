var gridNow;
var isClicked = false;
var x;
var y;
var points;
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
    points = [];
    seedx = seedy = undefined;
    gridNow.act();
}
$("#data_y").change(onGridSizeChange);
$("#data_x").change(onGridSizeChange);


function repaint() {
    gridNow.clearRects();
    gridNow.setNextColor('blue');
    var ctx = gridNow.ctx();
    for (var i in points) {
        gridNow.drawBlockInst(points[i], ctx);
    }
    // gridNow.act();
}
$("#output_grid").on('click', function (e) {
    if (gridNow) {
        var offset = $(this).offset();
        var ox = e.pageX - offset.left;
        var oy = e.pageY - offset.top;
        var width = $(this).width();
        var height = $(this).height();
        var nowX = Math.floor(ox / width * x);
        var nowY = Math.floor(oy / height * y);
        points.push([nowX, nowY]);
        repaint();
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
    // if (gridNow) {
    //     if (now >= order.length) return;
    //     gridNow.drawBlockInst(order[now], ctx);
    //     setTimeout(function () {
    //         showSteps(ctx, order, now + 1);
    //     }, 0);
    // }
    while (now < order.length) gridNow.drawBlockInst(order[now++], ctx);
}
$("#start").on("click", function () {
    if (gridNow) {
        var order = scanLine(points, y, 0);
        console.log(order);
        gridNow.setNextColor("orange");
        var ctx = gridNow.ctx();
        showSteps(ctx, order, 0);
    } else {
        alert("INIT NOT COMPLETE");
    }

});