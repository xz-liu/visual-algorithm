var init_pos;//1
var cur_exec;
var init_state;//1
var cur_pos;//1
var paused = true;//1
var cur_state;//1
var this_program;//1
var this_memory;//1
var prog_id = 0;

var has_next;
var cur_memory;
var cur_direction;

var program_id_now;

var log_elem;

var DIR_BACK=0,DIR_FORWARD=1,DIR_STOP=2;
var QUI_STATE_CUR=0,QUI_CHAR_CUR=1,QUI_CHAR_MOD=2,QUI_DIR=3,QUI_STATE_MOD=4;

function checkSpace(ch) {
    return ' \t\n\r\v'.indexOf(ch) > -1;
}

function logInfo(str) {
    log_elem.innerHTML+=str;
    log_elem.innerHTML+='<br>';
}

function execCur(program_id) {
    if (program_id !== prog_id) return;
    if(has_next){
        logInfo('Execute program #'+program_id+' :');
        logInfo('\tposition\t:'+cur_pos);
        logInfo('\tcommand\t:'+cur_exec);
        logInfo('\tdirection\t:'+cur_direction);
        logInfo('\tvalue\t:'+cur_memory);
        this_memory[cur_pos]=this_program[cur_exec][QUI_CHAR_MOD];
        cur_state=this_program[cur_exec][QUI_STATE_MOD];
        if(cur_direction===DIR_FORWARD){
            cur_pos++;
        }else if(cur_direction===DIR_BACK)  cur_pos--;
        else if(cur_direction===DIR_STOP){}
        logInfo('\tval after exec\t:'+this_memory[cur_pos]);
        logInfo('\tpos after exec\t:'+cur_pos);
        logInfo('\tstat after exec\t:'+cur_state);
        if(cur_pos<0||cur_pos>=this_memory.length){
            logInfo('Memory outbound .Terminate Program #'+prog_id++);
            paused=true;
        }
    }
}
var s_exec,s_mem;
function getById(id) {
    return document.getElementById(id);
}
function setStatus() {
    var s_paused=getById('status_paused'),
        s_pos=getById('status_position'),
        s_hasNxt=getById('status_hasnxt'),
        s_state=getById('status_state'),
        s_dir=getById('status_direction');
    s_paused.value=paused?'Yes':'No';
    s_pos.value=cur_pos;

    s_hasNxt.value=has_next?'Yes':'No';
    s_state.value=cur_state;


    if(cur_direction!==undefined)
        s_dir.value=cur_direction;
    else s_dir.value='Undefined';
    var selected='bg-success';

    for(var id in this_memory){
        getById('memory_id_'+id).innerHTML=this_memory[id];
    }

    if(s_exec!==undefined)s_exec.classList.remove(selected);
    if(s_mem!==undefined)s_mem.classList.remove(selected);

    if(cur_exec!==undefined)
        s_exec=getById('code_id_'+cur_exec);
    if(cur_pos!==undefined)
        s_mem=getById('memory_id_'+cur_pos);

    s_exec.classList.add(selected);
    s_mem.classList.add(selected);
    if(cur_pos||cur_pos===0) setPos();
    if(cur_exec||cur_exec===0)setPosV();
}

function setRun() {
    paused=false;
}

function setPause() {
    paused=true;
}

function setPos() {
    var tapeNow=getById('memory_id_'+cur_pos);
    var father=getById('turing_memory');
    var rectNow=tapeNow.getBoundingClientRect(),rectFather=father.getBoundingClientRect();
    var rectBody=document.body.getBoundingClientRect();
    // var dis=(rectNow.left-(rectBody.width/2+rectNow.width/2));
    // if(dis>0) {
    father.style.left = (-(cur_pos+1)*rectNow.width+rectBody.width/2) + 'px';
    // }
    // father.style.top=(-(rectNow.top-rectFather.top))+'px';
}

function setPosV() {
    var tapeNow=getById('code_id_'+cur_exec);
    var father=getById('turing_code');
    var code=getById('status_card');
    var aid=getById('get_aid_pos').getBoundingClientRect();
    var rectNow=tapeNow.getBoundingClientRect(),rectFather=father.getBoundingClientRect();
    var rectBody=document.body.getBoundingClientRect();
    var rectCode=code.getBoundingClientRect();
    // code.top=(-code.height-aid.height+aid.top)+'px';
    // var dis=(rectNow.left-(rectBody.width/2+rectNow.width/2));
    // if(dis>0) {
    father.style.marginTop = ((-(cur_exec)*parseInt(rectNow.height))+parseInt(rectCode.height)/2) + 'px';
    // }
    // father.style.top=(-(rectNow.top-rectFather.top))+'px';
}

function program_run(program_id) {
    var interval = 1000;
    if (program_id !== prog_id) return;
    program_id_now=program_id;
    cur_memory=(this_memory[cur_pos]);
    has_next=false;
    for(var line in this_program){
        if (this_program[line][QUI_STATE_CUR]===cur_state
            &&this_program[line][QUI_CHAR_CUR]===cur_memory){
            cur_exec=line;
            has_next=true;
        }
    }
    if(has_next){
        cur_direction=this_program[cur_exec][QUI_DIR];
    }else {
        cur_exec=undefined;
        cur_direction=undefined;
        logInfo('No Possible Way To Go.Terminate Program #'+prog_id++);
        setPause()
    }
    if (!paused) {
        execCur(program_id);
    }
    setStatus();
    setTimeout(function () {
        program_run(program_id);
    }, interval);
}


function readQuintuple(str, now) {
    while (now < str.length && (str[now] === '(' || checkSpace(str[now]))) now++;
    if (now >= str.length) return null;
    // (q,a,a_2,dir,q_2')
    var q = parseInt(str.substr(now));
    while (str[now] !== ',') now++;
    while (str[now] === ',' || checkSpace(str[now])) now++;
    var a = parseInt(str.substr(now));
    while (str[now] !== ',') now++;
    while (str[now] === ',' || checkSpace(str[now])) now++;
    var a_2 = parseInt(str.substr(now));
    while (str[now] !== ',') now++;
    while (str[now] === ',' || checkSpace(str[now])) now++;
    var dir = parseInt(str.substr(now));
    while (str[now] !== ',') now++;
    while (str[now] === ',' || checkSpace(str[now])) now++;
    var q_2 = parseInt(str.substr(now));
    while ((now < str.length) && str[now] !== ')') now++;
    if (now < str.length) now++;
    var ret = new Array();
    ret['now'] = now;
    ret['qui'] = [q, a, a_2, dir, q_2];
    return ret;
}

function dieWithMessage(msg) {
    alert("Error :" + msg);
    window.location.reload();
}

function parseInput() {
    var cmds = new Array();
    cur_exec = 0;
    init_pos = -1;
    var input = document.getElementById('input');
    var memory = document.getElementById('memory');
    window.history.pushState(null,null,'?code='+input.value+'&memory='+memory.value);
    var str = input.value;
    var cnt = 0, now = 0;
    while (cnt < str.length && str[cnt] !== '(') cnt++;
    if (cnt === str.length) dieWithMessage('Syntax Error');
    else {
        init_state = parseInt(str.substr(0, cnt));
        if (isNaN(init_state)) {
            dieWithMessage('No init state');
            return;
        }
        while (true) {
            var ret = readQuintuple(str, now);
            if (ret) {
                now = ret['now'];
                cmds[cnt++] = ret['qui'];
            } else break;
        }
        this_program = cmds;
        var mems = memory.value;
        console.log(cmds);
        var show_code = document.getElementById('turing_code');
        show_code.innerHTML = '';
        for (var x in cmds) {
            show_code.innerHTML += '<li class="list-group-item" id="code_id_' + x + '">' + cmds[x] + '</li>';
        }
        mems = mems.toUpperCase();
        var list_items = '';
        var prefix = '<li class="list-group-item paper_tape_item" id="memory_id_';
        var middle = '" >';
        var suffix = "</li>";
        cnt = 0;
        this_memory = new Array();
        for (var x in mems) {
            if (!checkSpace(mems[x])) {
                if (mems[x] === 'C') {
                    if (init_pos < 0) init_pos = cnt;
                    else {
                        dieWithMessage('Duplicate definition of initial position');
                        break;
                    }
                    continue;
                }
                this_memory[cnt] = parseInt(mems[x]);
                if(isNaN(this_memory[cnt])){
                    dieWithMessage('Cannot read memory info');
                }
                list_items += prefix + cnt++ + middle + mems[x] + suffix;
            }
        }
        if (init_pos < 0) {
            dieWithMessage('Init not set');
        } else {
            document.getElementById('turing_memory').innerHTML = list_items;
            if(log_elem===undefined){
                log_elem=document.getElementById('program_log');
            }
            cur_state = init_state;
            cur_pos = init_pos;
            s_exec=s_mem=undefined;
            has_next=true;
            ++prog_id;
            logInfo('Start program #'+prog_id+':');
            logInfo('\tinit state\t:'+init_state);
            logInfo('\tinit pos\t:'+init_pos);
            program_run(prog_id);
        }
    }
}


