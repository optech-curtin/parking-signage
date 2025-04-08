<?php
	//Dont store passwords in this file
	require_once './password.php';
    $parking_lots = array(
	0 => array("zone" => "", "vacant" => 0, "total" => 0),
	1 => array("zone" => "", "vacant" => 0, "total" => 0),
	2 => array("zone" => "", "vacant" => 0, "total" => 0),
	3 => array("zone" => "", "vacant" => 0, "total" => 0),
	4 => array("zone" => "", "vacant" => 0, "total" => 0),
	5 => array("zone" => "", "vacant" => 0, "total" => 0),
	6 => array("zone" => "", "vacant" => 0, "total" => 0),
	7 => array("zone" => "", "vacant" => 0, "total" => 0),
	8 => array("zone" => "", "vacant" => 0, "total" => 0),
	9 => array("zone" => "", "vacant" => 0, "total" => 0),
	10 => array("zone" => "", "vacant" => 0, "total" => 0),
	11 => array("zone" => "", "vacant" => 0, "total" => 0),
	12 => array("zone" => "", "vacant" => 0, "total" => 0),
	13 => array("zone" => "", "vacant" => 0, "total" => 0),
	14 => array("zone" => "", "vacant" => 0, "total" => 0),
	15 => array("zone" => "", "vacant" => 0, "total" => 0),
	16 => array("zone" => "", "vacant" => 0, "total" => 0),
	17 => array("zone" => "", "vacant" => 0, "total" => 0),
	18 => array("zone" => "", "vacant" => 0, "total" => 0),
	19 => array("zone" => "", "vacant" => 0, "total" => 0),
	20 => array("zone" => "", "vacant" => 0, "total" => 0),
	21 => array("zone" => "", "vacant" => 0, "total" => 0),
	22 => array("zone" => "", "vacant" => 0, "total" => 0),
	23 => array("zone" => "", "vacant" => 0, "total" => 0),
	24 => array("zone" => "", "vacant" => 0, "total" => 0),
	25 => array("zone" => "", "vacant" => 0, "total" => 0),
	26 => array("zone" => "", "vacant" => 0, "total" => 0),
	27 => array("zone" => "", "vacant" => 0, "total" => 0),
	28 => array("zone" => "", "vacant" => 0, "total" => 0),
	29 => array("zone" => "", "vacant" => 0, "total" => 0),
	);
	
    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $db, 3306);
    // Check connection
    if (!$conn) {
    	die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT id, total, vacant, vacant, zone FROM curtin_parking_data";

	$result = $conn->query($sql);					
	if ($result->num_rows > 0) {							
		while($row = $result->fetch_assoc()){
			
			$parking_lots[$row["id"]] = array("zone" => $row["zone"], "id" => $row["id"], "vacant" =>  $row["vacant"], "total" =>  $row["total"]);
		}
	} else {
		echo "0 results";
	}
	echo json_encode($parking_lots);
	
?>

