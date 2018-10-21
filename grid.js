var config = {
    pointRadius: 2,
    lineWidth: 2,
    colorNormal: "black",
    colorSelected: "red",
};


function RGBA(r, g, b, a, mxVal) {
    r = Math.floor(r / mxVal * 256);
    g = Math.floor(g / mxVal * 256);
    b = Math.floor(b / mxVal * 256);
    a = (a / mxVal);
    return "rgba(" + [r, g, b, a].join() + ")";
}
function randomColor() {
    return RGBA(
        Math.random(),
        Math.random(),
        Math.random(),
        1,
        1
    );
}

function Grid(id, boundL, boundR, boundU, boundD) {
    this.elem = document.getElementById(id);
    var box = this.elem.getBoundingClientRect();
    this.elemWidth = box.width;
    this.elemHeight = box.height;
    this.boundL = boundL;
    this.boundR = boundR;
    this.boundU = boundU;//0
    this.boundD = boundD;//700
    this.bWidth = (boundR - boundL);
    this.bHeight = (boundU - boundD);
    var dotX = (1 - this.boundL) / this.bWidth;
    var dotY = (1 - this.boundD) / this.bHeight;
    dotX = ( dotX * this.elemWidth);
    dotY = ((1 - dotY) * this.elemHeight);
    this.gridUnit = [dotX, dotY];
    this.clear();
}

function _fillPointImpl(ctx, dotX, dotY) {
    var pr = config.pointRadius;
    var wh = pr * 2;
    ctx.beginPath();
    ctx.fillRect(dotX - pr, dotY - pr, wh, wh);
}

function _drawLineImpl(ctx, p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
}

Grid.prototype.calculatePositon = function (x, y) {
    var dotX = (x - this.boundL) / this.bWidth;
    var dotY = (y - this.boundD) / this.bHeight;
    dotX = Math.floor(0.5 + dotX * this.elemWidth);
    dotY = Math.floor(0.5 + (1 - dotY) * this.elemHeight);
    return [dotX, dotY];
};

Grid.prototype.calculatePositonInst = function (x, y) {
    return [this.gridUnit[0] * x, this.gridUnit[1] * y];
}

Grid.prototype.ctx = function () {
    return this.elem.getContext("2d");
};

Grid.prototype.clearScreen = function () {
    this.ctx().clearRect(0, 0, this.elemWidth, this.elemHeight);
};

Grid.prototype.drawPoint = function (ctx, x, y) {
    var dot = this.calculatePositon(x, y);
    _fillPointImpl(ctx, dot[0], dot[1]);
};

Grid.prototype.setColor = function (ctx, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
};

Grid.prototype.drawLine = function (ctx, x1, y1, x2, y2) {
    var dot1 = this.calculatePositon(x1, y1),
        dot2 = this.calculatePositon(x2, y2);
    _drawLineImpl(ctx, dot1, dot2, config);
};

Grid.prototype.fillRect = function (ctx, x1, y1, x2, y2) {
    var dot1 = this.calculatePositon(x1, y1),
        dot2 = this.calculatePositon(x2, y2);
    ctx.fillRect(dot1[0], dot1[1], dot2[0], dot2[1]);
};
Grid.prototype.addPoint = function (x, y) {
    this.points.push([x, y]);
};

Grid.prototype.addLine = function (p1, p2, color) {
    this.lines.push([p1, p2, color]);
};

Grid.prototype.addRect = function (p1, p2, color) {
    this.rects.push([p1, p2, color]);
}

Grid.prototype.clearLines = function () {
    if (this.lines.length) {
        this.lines = [];
        this.act();
    }
};

Grid.prototype.clearPoints = function () {
    if (this.points.length) {
        this.points = [];
        this.act();
    }
};

Grid.prototype.clearRects = function (prev) {
    if (prev) this.rects = prev;
    else if (this.rects.length) {
        this.rects = [];
        this.act();
    }
}

Grid.prototype.clear = function () {
    this.lines = [];
    this.points = [];
    this.rects = [];
    this.act();
};
Grid.prototype.setNextColor = function (color) {
    this.setColor(this.ctx(), color);
}
Grid.prototype.act = function () {
    this.clearScreen();
    var ctx = this.ctx();
    ctx.lineWidth = config.lineWidth;
    this.setColor(ctx, config.colorNormal);
    for (var i in this.points) {
        this.drawPoint(ctx, this.points[i][0], this.points[i][1]);
    }
    for (var i in this.lines) {
        this.setColor(ctx, this.lines[i][2]);
        this.drawLine(ctx,
            this.lines[i][0][0], this.lines[i][0][1],
            this.lines[i][1][0], this.lines[i][1][1]
        );
    }
    for (var i in this.rects) {
        this.setColor(ctx, this.rects[i][2]);
        this.fillRect(ctx,
            this.rects[i][0][0], this.rects[i][0][1],
            this.rects[i][1][0], this.rects[i][1][1]
        );
    }
};

Grid.prototype.addVisLine = function (p1, p2, color) {
    this.addLine(p1, p2, color);
    var ctx = this.ctx();
    this.setColor(ctx, color);
    this.drawLine(ctx, p1[0], p1[1], p2[0], p2[1]);
};
Grid.prototype.addVisRect = function (p1, p2, color) {
    this.addRect(p1, p2, color);
    var ctx = this.ctx();
    this.setColor(ctx, color);
    this.fillRect(ctx, p1[0], p1[1], p2[0], p2[1]);
};
Grid.prototype.drawBlockInst = function (p, ctx) {
    ctx.fillRect(p[0] * this.gridUnit[0], p[1] * this.gridUnit[1], this.gridUnit[0], this.gridUnit[1]);
}

Grid.prototype.getPoints = function () {
    return this.points;
};

Grid.prototype.getCoordinate = function (x, y) {
    var oriX = x / this.elemWidth * this.bWidth,
        oriY = (y) / this.elemHeight * this.bHeight;
    oriX += this.boundL; oriY += this.boundD;
    return [oriX, oriY];
};