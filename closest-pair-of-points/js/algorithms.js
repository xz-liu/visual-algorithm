var disCalledTimes=0;
function resetCalledTimes() {
    disCalledTimes=0;
}

function getCalledTimes() {
    return disCalledTimes;
}

function distance(p1,p2) {
    disCalledTimes++;
    var x=(p1[0]-p2[0]);
    var y=(p1[1]-p2[1]);
    return Math.sqrt(x*x+y*y);
}

function bruteForce(points) {
    var minDis,minPair;
    for(var i=0;i<points.length;i++){
        for(var j=i+1; j<points.length;j++){
                if (minDis === undefined) {
                    minDis = distance(points[i],points[j]);
                    minPair=[i,j];
                }else {
                    var now=distance(points[i],points[j]);
                    if(now<minDis){
                        minDis = now;//distance(points[i],points[j]);
                        minPair=[i,j];
                    }
                }
        }
    }
    return [minDis].concat(minPair);
}
// v
function bruteForceDemo(points,line) {
    var minDis,minPair;
    for(var i=0;i<points.length;i++){
        for(var j=i+1; j<points.length;j++){
                if (minDis === undefined) {
                    minDis = distance(points[i],points[j]);
                    minPair=[i,j];
                    line.push([minDis].concat(minPair.concat(['red'])));
                }else {
                    var now=distance(points[i],points[j]);
                    line.push([now,i,j,'blue']);
                    if(now<minDis){
                        minDis = now; //distance(points[i],points[j]);
                        minPair=[i,j];
                        line.push([minDis].concat(minPair.concat(['red'])));
                    }
                }
        }
    }
    line.push([minDis].concat(minPair.concat(['green'])));
    return [minDis].concat(minPair);
}
function cmpByY(p1,p2) {
    return Math.sign(p2[1]-p1[1]);
}
function cmpByY_sortT(p1,p2) {
    return cmpByY(p1[0],p2[0]);
}

function algo(points) {
    points.sort(cmpByY);
    // console.log(0+' '+(parseInt(points.length)-1));
    return closest(points,0,points.length-1);
}

function closest(p,l,r) {
    // console.log('cnt'+l+" "+r);
    if(l===r){
        // console.log('base1 '+l+" "+r);
        return [Number.MAX_VALUE,l,r];
    }
    if((l+1)===r){
        // console.log('base2 '+l+" "+r);
        return [distance(p[l],p[r]),l,r];
    }
    if((l+2)===r) {
        var traid = [[distance(p[l], p[r]), l, r],
            [distance(p[l], p[l + 1]), l, l + 1],
            [distance(p[l + 1], p[r]), l + 1, r]];
        var ret=0;
        for (var i in traid){
            if(traid[i][0]<traid[ret][0]){
                ret=i;
            }
        }
        return traid[ret];
    }
    var mid=parseInt((r+l)/2);
    var dis1=closest(p,l,mid);
    var dis2=closest(p,mid+1,r);
    var tr=dis2;
    if(dis1[0]<dis2[0]){tr=dis1;}
    // else {tr=dis2;}
    var t=[];
    for(i=l;i<=r;i++){
        if(Math.abs(p[i][0]-p[mid][0])<=tr[0]){
            t.push([p[i],i]);
        }
        else if(Math.abs(p[i][0]-p[mid+1][0])<=tr[0]){
            t.push([p[i],i]);
        }
    }
    t.sort(cmpByY_sortT);
    for(i=0;i<t.length;i++){
        for(var j=i+1;j<t.length&&(t[j][0][1]-t[i][0][1])<tr[0];j++){
            var tmpDis=distance(t[i][0],t[j][0]);
            if(tmpDis<tr[0]){
                tr=[tmpDis,t[i][1],t[j][1]];
            }
        }
    }
    // console.log('RET!!!!!!!!');
    // console.log(tr);
    return tr;
}


function algoDemo(points,lines) {
    points.sort(cmpByY);
    // console.log(0+' '+(parseInt(points.length)-1));
    var res= closestDemo(points,0,parseInt(points.length)-1,lines);
    lines.push(res.concat('green'));
    return res;
}

function closestDemo(p, l, r, lines) {
    // console.log('cnt'+l+" "+r);
    if(l===r){
        // console.log('base1 '+l+" "+r);
        return [Number.MAX_VALUE,l,r];
    }
    if((l+1)===r){
        // console.log('base2 '+l+" "+r);
        return [distance(p[l],p[r]),l,r];
    }

    if((l+2)===r) {
        var traid = [[distance(p[l], p[r]), l, r],
            [distance(p[l], p[l + 1]), l, l + 1],
            [distance(p[l + 1], p[r]), l + 1, r]];
        var ret=0;
        for (var i in traid){
            if(traid[i][0]<traid[ret][0]){
                ret=i;
            }
        }
        return traid[ret];
    }
    var mid=parseInt((r+l)/2);
    var dis1=closestDemo(p,l,mid,lines);
    var dis2=closestDemo(p,mid+1,r,lines);
    lines.push(dis1.concat('blue'));lines.push(dis2.concat('blue'));
    var tr=dis2;
    if(dis1[0]<dis2[0]){tr=dis1;}
    // else {tr=dis2;}
    var t=[];
    for(i=l;i<=r;i++){
        if(Math.abs(p[i][0]-p[mid][0])<=tr[0]){
            t.push([p[i],i]);
        }
        else if(Math.abs(p[i][0]-p[mid+1][0])<=tr[0]){
            t.push([p[i],i]);
        }
    }
    t.sort(cmpByY_sortT);
    for(i=0;i<t.length;i++){
        for(var j=i+1;j<t.length;j++){
            if((t[j][0][1]-t[i][0][1])>tr[0])continue;
            var tmpDis=distance(t[i][0],t[j][0]);
            if(tmpDis<tr[0]){
                tr=[tmpDis,t[i][1],t[j][1]];
                lines.push(tr.concat('blue'));
            }
        }
    }
    // console.log('RET!!!!!!!!');
    // console.log(tr);
    lines.push(tr.concat('red'));
    return tr;
}