<?php
// FILE: authenticate.php
// CREATED Date: 7/09/22
// LM DATE: 19/01/23
// DESC: Server side script to check if a provided username and password is valid
// NOTE: Will write incorrect logins to a log file

session_start();
// Change this to your connection info.
include('./db_connection.php');

if(isset($_SESSION['loggedin'])) { //Check is set first, avoid undefined index error
    if($_SESSION['loggedin']) {
        // If the user is already logged in, redirect to the home page
        header('Location: ./manager.php');
        exit;
    }
}

// Try and connect using the info above.
$options = array("UID" => $DATABASE_USER,"PWD" =>$DATABASE_PASS,"Database"=>$DATABASE_NAME);
$con = sqlsrv_connect($DATABASE_HOST, $options);
//$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if($con == false)
    die( print_r( sqlsrv_errors(), true));

$username = $_POST['username'];
$password = $_POST['password'];

$tsql = "SELECT id, password, role FROM accounts WHERE username = ?";

// Prepare our SQL, preparing the SQL statement will prevent SQL injection.
$stmt = sqlsrv_prepare($con, $tsql, array(&$username));
sqlsrv_execute($stmt);
$row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
if ($row) {
	$dbpassword = $row['password'];
	$id = $row['id'];
	$role = $row['role'];
	if (password_verify($password, $dbpassword)) {
		// Verification success! User has logged-in!
		// Create sessions, so we know the user is logged in, they basically act like cookies but remember the data on the server.
		$fp = fopen($_SERVER['DOCUMENT_ROOT'].'/log/log.txt', 'a');//opens file in append mode  
		$time = new DateTime("now", new DateTimeZone('Australia/Perth'));
		fwrite($fp, $time->format('Y-m-d H:i:s'));
		fwrite($fp, " User: ".$_POST['username']." Logged in\n");
		fclose($fp);  

		session_regenerate_id();
		$_SESSION['loggedin'] = TRUE;
		$_SESSION['name'] = $_POST['username'];
		$_SESSION['id'] = $id;
		$_SESSION['password'] = $_POST['password'];
		$_SESSION['role'] = $role;
		session_write_close();
		header('Location: manager.php');
	} else {
		// Incorrect password
		//Write to LOG
		$fp = fopen($_SERVER['DOCUMENT_ROOT'].'/log/log.txt', 'a');//opens file in append mode  
		$time = new DateTime("now", new DateTimeZone('Australia/Perth')); //Get current time
		fwrite($fp, $time->format('Y-m-d H:i:s'));
		fwrite($fp, " Failed login Attempt:  Username attempt: ".$_POST['username']."\n");
		fclose($fp); 
		header('Location: /index.html');
	}
}else{
	header('Location: /index.html');
}
sqlsrv_free_stmt($stmt);
sqlsrv_close($con);

?>
