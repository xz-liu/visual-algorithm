<?php
/**
 * Created by PhpStorm.
 * User: joker
 * Date: 2018/5/30
 * Time: 11:56
 */
$cur_select=$_SERVER['REQUEST_URI'];
$cur_root='/algo/';
$pack=array_filter(glob('*'), 'is_dir');
//var_dump($pack);
$cur_select=str_replace($cur_root,'',$cur_select);
$cur_select=str_replace('/','',$cur_select);
//$exists=false;
if(!strcmp($cur_select,'')){
    include 'list.html';
    echo "<script>addDirs(".json_encode($pack) .")</script>";
//    $exists=true;
}
//else foreach ($pack as $val){
//    if(!strcmp($val,$cur_select)){
//        $exists=true;
//        echo "<script>console.log('calling')</script>";
//        include $val.'/index.html';
//    }
//}
else{
    header('location:'.$cur_root);
}


?>
