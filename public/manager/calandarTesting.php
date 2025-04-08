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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
    <link rel="stylesheet" href="/css/calandarStyle.css">
    <link href='/fullcalendar/lib/main.css' rel='stylesheet' />
    <script src='/fullcalendar/lib/main.js'></script>
</head>

<body>
    <div class="curtinLogo" style="display: flex; margin: auto; padding-bottom: 10px; max-width: 1100px;"> 
        <img src="/media/images/main_images/curtin_logo.png" width="170" height="30" alt=""/>
        <h1> Sign 1 - Uni Boulavard/Hayman Rd</h1>
        <div class="profile-content" style="padding: 10px">
            <a href="manager.php" class="btn-manager"><i class="fas fa-map-signs"></i>Signage Manager</a>
            <a href="logout.php"class="btn-logout"><i class="fas fa-sign-out-alt"></i>Logout</a>
        </div>
    </div>
    </div>
    
    <div id='calendar'></div>
    <script language="JavaScript" type="text/javascript" src="/js/calendar.js"></script>
</body>
</html>