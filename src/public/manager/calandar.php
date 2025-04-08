<?php
// We need to use sessions, so you should always start sessions using the below code.
session_start();
// If the user is not logged in redirect to the login page...
if (!isset($_SESSION['loggedin'])) {
	header('Location: index.html');
	exit;
}
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
                <a href="manager.php" class="btn-manager"><i class="fas fa-map-signs"></i>Signage Manager</a>
                <a href="logout.php"class="btn-logout"><i class="fas fa-sign-out-alt"></i>Logout</a>
            </div>
			<div class="curtinLogo" style="display: flex; position: relative; top: 0px; left: 0px"> 
				<img src="/media/images/main_images/curtin_logo.png" width="170" height="30" alt=""/>
			</div>
            <div class="content">
                <h2>Calandar</h2>
                <div>
                    <h1>Coming Soon</h1>
            
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script language="JavaScript" type="text/javascript" src="/CurtinParkingSigns/js/calandar.js"></script>

</body>
