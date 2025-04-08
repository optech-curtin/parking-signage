<?php    
require_once './env.php';

$url = env('GALLAGHER_API_URL') . '?fields=time,message';
$headers = array(
    'Authorization: ' . env('GALLAGHER_API_KEY'),
    'Content-type: application/json',
    'Access-Control-Allow-Origin: *'
);
?>
