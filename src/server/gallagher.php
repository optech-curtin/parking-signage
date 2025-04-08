<?php 
 require_once './gallagher_secret.php';
  $data = array();
    
    //  Initiate curl
  $ch = curl_init();
  // Will return the response, if false it print the response
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  //Set Headers
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  // Set the url
  curl_setopt($ch, CURLOPT_URL,$url);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
  $array = [];
  do{
    curl_setopt($ch, CURLOPT_URL, $url);

    $response = curl_exec($ch);
    $results = json_decode($response, true);
    $array = array_merge($array, $results['alarms']);
    
    // Checking if any error occurs
    // during request or not
    if($e = curl_error($ch)) {
      echo $e;
    }
    if(isset($results['next']['href'])){
      $url = ($results['next']['href']);
      //echo $url;
    }
  }while (isset($results['next']['href']));

  
  if(isset($results['updates']['href'])){
    $url = ($results['updates']['href']);
  }

  echo json_encode($array);

  // Closing curl
  curl_close($ch);

?>