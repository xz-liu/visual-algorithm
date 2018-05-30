<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="description" content="General Turing Machine Emulator"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <title>Turing Machine</title>
    <link href="https://res.joker.im/Content/bootstrap.css" rel="stylesheet"/>
    <link rel="icon" href="https://res.joker.im/favicon_code.ico" type="image/x-icon"/>
    <link rel="shortcut icon" href="https://res.joker.im/favicon_code.ico" type="image/x-icon"/>
    <link href="https://res.joker.im/Fonts/css/fontawesome.css" media="all" rel="stylesheet"/>
    <link href="https://res.joker.im/Fonts/css/fontawesome-all.css" media="all" rel="stylesheet"/>
    <link href="styles.css" media="all" rel="stylesheet"/>
    <script src="https://res.joker.im/Scripts/jquery-3.1.1.min.js"></script>
    <script src="https://res.joker.im/Scripts/bootstrap.bundle.js"></script>
    <script src="machine_ctrl.js"></script>
</head>
<body id="page_body">
<div class="container shadow_effect rounded">
    <h1 class="text-center"><code>Turing Machine Emulator</code></h1>
    <div class="shadow_effect rounded">
        <div class=" input-group" id="input_group">
            <div class="input-group-prepend ">
                <span class="input-group-text bg-transparent " id="code_label">
                    <i class="fas fa-terminal"></i> Code</span>
            </div>
            <textarea class="form-control "
                      placeholder=" Format:  init_state (q,a,a',d,q')....&#10; init_state should be an integer &#10; d: 0->backward, 1->forward, 2->stop&#10; Sample:1(1,2,1,0,1)(2,2,1,0,0)"
                      id="input"></textarea>
        </div>
        <div class="input-group" id="input_memory">
            <div class="input-group-prepend ">
                <span id="memory_label" class="input-group-text bg-transparent">
                    <i class="fas fa-hdd"></i> Memory</span>
            </div>
            <textarea class="form-control "
                      placeholder=" C: start &#10;Sample :C1100101010" id="memory"></textarea>
            <div class="input-group-append">
                <button type="submit" id="run_turing_machine" class=" btn btn-outline-secondary" onclick="parseInput()">
                    <i class="fas fa-play-circle"></i> Go!
                </button>
            </div>
        </div>
    </div>
    <hr class="my-1">
    <div class="btn btn-group shadow_effect" id="ctrl">
        <div class="btn btn-outline-info ctrl_class" onclick="execCur(program_id_now)" >
            <i class="fas fa-step-forward"></i> Next
        </div>
        <div class="btn btn-outline-success ctrl_class" onclick="setRun()">
            <i class="fas fa-fast-forward"></i> Run
        </div>
        <div class="btn btn-outline-warning ctrl_class" onclick="setPause()">
            <i class="fas fa-pause"></i> Pause
        </div>
    </div>
    <hr class="my-1">
    <div id="machine">
        <ul class="list-group-horizontal shadow_effect paper_tape rounded" id="turing_memory"></ul>
    </div>
    <hr class="my-1">
    <div class="row" id="row_position">
        <div class="col-md-3 col-xs-12 stat_and_code card shadow_effect" id="status_card">
            <!--                <div class="" >-->
            <h3 class="card-title">Status</h3>
            <hr class="my-1">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">Paused</span>
                </div>
                <input type="text" class="form-control" readonly id="status_paused"/>
            </div>
            <hr class="my-1">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" >Pos</span>
                </div>
                <input type="text" class="form-control" readonly id="status_position"/>
            </div>
            <hr class="my-1">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">HasNext</span>
                </div>
                <input type="text" class="form-control" readonly id="status_hasnxt"/>
            </div>
            <hr class="my-1">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">State</span>
                </div>
                <input type="text" class="form-control" readonly id="status_state"/>
            </div>
            <hr class="my-1">

            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">Dir</span>
                </div>
                <input type="text" class="form-control" readonly id="status_direction"/>
            </div>

            <!--                </div>-->
        </div>
        <div id="get_aid_pos"></div>
        <div class="col-md-3 col-xs-12 ">
            <div class=" shadow_effect stat_and_code overflow-hidden " id="turing_container">
                <ul class="list-group" id="turing_code">

                </ul>
            </div>
        </div>
        <div class="col-md-6 col-xs-12" >
            <div  class=" shadow_effect program_log">
                <div id="code_container"> <code id="program_log"></code></div>
            </div>
        </div>
    </div>
</div>
<?php
echo '<script>';
    if (isset($_REQUEST['code'])){
        echo 'getById("input").value="'.$_REQUEST['code'].'";';
    }
    if(isset($_REQUEST['memory'])){
        echo 'getById("memory").value="'.$_REQUEST['memory'].'";';
    }
echo '</script>';
?>
</body>
</html>
