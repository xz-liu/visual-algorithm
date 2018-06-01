var gridNow;
var lineHorizontal;
var lineVertical;
var showIndex = 0;
$(window).mousemove(function (event) {

    if (gridNow) {
        var p = $('#output_grid').offset();
        var r = gridNow.getCoordinate(event.pageX - p.left,
            event.pageY - p.top);
        lineVertical.css("top", event.clientY);
        lineVertical.css("left", 0);
        lineHorizontal.css("top", 0);
        lineHorizontal.css("left", event.clientX);
        var posNow = $('#pos_now');
        posNow.html("(" + parseInt(r[0]) + ","
            + parseInt(r[1]) + ")");
        posNow.css("left", event.clientX);
        posNow.css("top", event.clientY);
    }
    // console.log(event.clientX+""+event.clientY);
});


function updateCanvas() {
    document.getElementById('output_grid').width = window.innerWidth * 0.98;
    console.log('update width');
    if (gridNow) gridNow.act();
}

$("#generate").click(function () {
    var xMin = $('#x_min').val(),
        xMax = $('#x_max').val(),
        yMin = $('#y_min').val(),
        yMax = $('#y_max').val();
    var cnt = $('#points_count').val();
    gridNow = new Grid('output_grid', xMin, xMax, yMax, yMin);
    for (var i = 0; i < cnt; i++) {
        var addNow = [Math.random() * (xMax - xMin) + xMin,
        Math.random() * (yMax - yMin) + yMin];
        // console.log(addNow);
        gridNow.addPoint(addNow[0], addNow[1]);
    }
    gridNow.act();
    $('#hint').show();
});

function getFormat(res, date1, date2, dis) {
    var time = ((date2 - date1) / 1000).toFixed(3);
    //     <div class="input-group ">
    //     <div class="input-group-prepend">
    //         <span class="input-group-text">X max</span>
    //     </div>
    //     <input type="number" class="form-control" readonly></input>
    // </div>
    var pre = '<div class="input-group "><div class="input-group-prepend"><span class="input-group-text">';
    var mid = '</span></div><input type="text" class="form-control" readonly value="';
    var end = '"></input></div>';
    var show = '';
    show += pre + 'RESULT' + mid + res[0].toFixed(6) + end;
    show += pre + 'Point 1' + mid + "(" + parseFloat(res[1][0]).toFixed(3) + "," + parseFloat(res[1][1]).toFixed(3) + ")" + end;
    show += pre + 'Point 2' + mid + "(" + parseFloat(res[2][0]).toFixed(3) + "," + parseFloat(res[2][1]).toFixed(3) + ")" + end;
    show += pre + 'Time' + mid + time + 's' + end;
    show += pre + 'distance() called' + mid + dis + " times" + end;
    // return "Result:" ++
    // "<br>Point 1:(" + parseFloat(res[1][0]).toFixed(3) + "," + parseFloat(res[1][1]).toFixed(3) + ")" +
    // "<br>Point 2:(" + parseFloat(res[2][0]).toFixed(3) + "," + parseFloat(res[2][1]).toFixed(3) + ")" +
    // // "<br>"+
    // "<br>Time:" + time + "s" +
    // "<br>distance called " + dis + " times" +
    // "<br>";
    return show;
}

function setResPoints(res, points) {
    res[1] = points[res[1]]; res[2] = points[res[2]];
    return res;
}

$("#run").click(function () {
    console.log('hi');
    if (gridNow) {
        gridNow.clearLines();
        console.log('hello');
        var points = gridNow.getPoints();
        var date1 = new Date();
        resetCalledTimes();
        var res = bruteForce(points);
        var dis1 = getCalledTimes();
        console.log(res);
        var date2 = new Date();
        res = setResPoints(res, points);
        var date3 = new Date();
        resetCalledTimes();
        var res2 = algo(points);
        var dis2 = getCalledTimes();
        console.log(res2);
        var date4 = new Date();
        // res2[1]=points[res2[1]];res2[2]=points[res2[2]];
        res2 = setResPoints(res2, points);
        console.log(res);
        console.log(res2);
        var show = "<h3>Brute force (O(n^2)):</h3>" +
            getFormat(res, date1, date2, dis1);

        var show2 = "<h3>Divide and Conquer (O(nlog(n))):</h3>" +
            getFormat(res2, date3, date4, dis2);
        console.log(show);
        $('#result_text').html(show + show2);
        gridNow.addVisLine(res[1], res[2], 'blue');
        gridNow.addVisLine(res2[1], res2[2], 'yellow');
        $('#show_result').modal('show');
    }
});

$("#clear").click(function () {
    if (gridNow) {
        gridNow.clear();
        gridNow = undefined;
        $('#hint').hide();
    }
});

function showSteps(grid, points, lines, index, sIndex) {
    var interval = 100;
    if (sIndex !== showIndex) return;
    if (grid !== gridNow) return;
    if (index >= lines.length) return;
    // console.log(lines[index]);
    gridNow.addVisLine(points[lines[index][1]], points[lines[index][2]], lines[index][3]);
    setTimeout(function () {
        showSteps(grid, points, lines, index + 1, sIndex);
    }, interval);
}

$("#run_demo").click(function () {
    if (gridNow) {
        gridNow.clearLines();
        var lines = [];
        var points = gridNow.getPoints();
        resetCalledTimes();
        var date1 = new Date();
        var res = algoDemo(points, lines);
        var date2 = new Date();
        // lines.push(res.concat('green'));
        showSteps(gridNow, points, lines, 0, ++showIndex);
        res = setResPoints(res, points);
        // console.log(res);
        $('#result_text').html(getFormat(res, date1, date2, getCalledTimes()));
        $('#show_result').modal('show');
    }
});


$('#run_bf_demo').click(function () {
    if (gridNow) {
        gridNow.clearLines();
        var lines = [];
        var points = gridNow.getPoints();
        resetCalledTimes();
        var date1 = new Date();
        var res = bruteForceDemo(points, lines);
        var date2 = new Date();
        // lines.push(res.concat('green'));
        res = setResPoints(res, points);
        showSteps(gridNow, points, lines, 0, ++showIndex);
        // console.log(res);
        $('#result_text').html(getFormat(res, date1, date2, getCalledTimes()));
        $('#show_result').modal('show');
    }
});
$(document).ready(function () {
    lineHorizontal = $('#line_horizontal');
    lineVertical = $('#line_vertical');
    updateCanvas();
    $('#x_min').val(1);
    $('#x_max').val(12345);
    $('#y_min').val(1);
    $('#y_max').val(12345);
    $('#points_count').val(100);
    $('#hint').hide();

});

$(window).on('resize', function () {
    updateCanvas();
});