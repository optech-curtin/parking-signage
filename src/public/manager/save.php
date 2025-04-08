<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('log_errors', 0);
    define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);

    if (!empty($_REQUEST["action"]) && $_REQUEST["action"] == "save" && !empty($_REQUEST["elem"])){
        $data = json_decode(file_get_contents(ROOT_PATH .'/config/config.json'), true);
        $data= $_REQUEST["elem"];
        file_put_contents(ROOT_PATH. '/config/config.json', json_encode($data));
    }
?>
