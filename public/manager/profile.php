<?php
// We need to use sessions, so you should always start sessions using the below code.
session_start();
// Change this to your connection info.
include('./db_connection.php');
// If the user is not logged in redirect to the login page...
if (!isset($_SESSION['loggedin'])) {
	header('Location: index.html');
	exit;
}

$options = array("UID" => $DATABASE_USER,"PWD" =>$DATABASE_PASS,"Database"=>$DATABASE_NAME);
$con = sqlsrv_connect($DATABASE_HOST, $options);

if($con == false)
    die( print_r( sqlsrv_errors(), true));

// We don't have the password or email info stored in sessions so instead we can get the results from the database.
$tsql = "SELECT password, email, role FROM accounts WHERE id = ?";
$stmt = sqlsrv_prepare($con, $tsql, array(&$_SESSION['id']));
if ($stmt) {  
    sqlsrv_execute($stmt);
} else {  
    echo "Error in statement preparation.\n";  
    die(print_r(sqlsrv_errors(), true));  
} 
sqlsrv_execute($stmt);

if(sqlsrv_execute($stmt)){
    while($row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)){
		$email = $row['email'];
		$role = $row['role'];
	}
}else{
  die( print_r( sqlsrv_errors(), true));

} 

// In this case we can use the account ID to get the account info.
sqlsrv_free_stmt($stmt);
sqlsrv_close($con);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="Cache-control" content="no-cache">
    <title>Digital Signage Manager</title>
    <link rel="stylesheet" href="/css/loginStyle.css">
    <link rel="stylesheet" href="/css/managerStyles.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">

</head>

<body>

    <div class="formbold-main-wrapper">
        <div class="formbold-form-wrapper" style="min-width=399px;">
            <div  class="profile-content">
                <a href="manager.php"class="btn-manager"><i class="fas fa-map-signs"></i>Signage Manager</a>
                <a href="logout.php" class="btn-logout"><i class="fas fa-sign-out-alt"></i>Logout</a>
            </div>
			<div class="curtinLogo" style="display: flex; position: relative; top: 0px; left: 0px"> 
				<img src="/media/images/main_images/curtin_logo.png" width="170" height="30" alt=""/>
			</div>
            <div class="content">
                <h2>Profile Page</h2>
                <div>
                    <p>Your account details are below:</p>
                    <table>
                        <tr>
                            <td>Username:</td>
                            <td><?=$_SESSION['name']?></td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td>
                                <div style="display: inline-block;"><input style="border: none;" type="password" name="password" autocomplete="current-password" required="" id="id_password" value=<?=$_SESSION['password']?> disabled>
                                <i class="far fa-eye" id="togglePassword" style="cursor: pointer;"></i></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td class="emailRow"><?=$email?></td>
                        </tr>
                        <tr>
                            <td>User Type:</td>
                            <td><?=$role?></td>
                        </tr>
                    </table>
                </div>
                <?php 
                    if (isset($role)){
                        if($role == 'admin'){
                            echo '<form action="register.php" method="post"> <input class="button-2" type="submit" value="Add New User"></form>';
                        }
                    }
                ?>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script>
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#id_password');
    togglePassword.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
    </script>
</body>
