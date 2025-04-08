<?php  
    $fp = fopen('log/log.txt', 'a');//opens file in append mode  
    $time = new DateTime("now", new DateTimeZone('Australia/Perth'));
    fwrite($fp, $time->format('Y-m-d H:i:s'));
    fwrite($fp, " ".$_POST['message']."\n");
    fclose($fp);  
    
    echo "Logged Event";  
?> 
