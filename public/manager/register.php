
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
    <?php
// We need to use sessions, so you should always start sessions using the below code.
		session_start();
		// Change this to your connection info.
		include('./db_connection.php');
		// If the user is not logged in redirect to the login page...
		if (!isset($_SESSION['loggedin'])) {
			header('Location: /index.html');
			exit;
		}
		$options = array("UID" => $DATABASE_USER,"PWD" =>$DATABASE_PASS,"Database"=>$DATABASE_NAME);
		$con = sqlsrv_connect($DATABASE_HOST, $options);

		if($con == false)
			die( print_r( sqlsrv_errors(), true));

        // When form submitted, insert values into the database.
        if (isset($_REQUEST['username'])) {
            
            // removes backslashes
            $username = stripslashes($_REQUEST['username']);
            $email    = stripslashes($_REQUEST['email']);
            $password = stripslashes($_REQUEST['password']);
            $role = stripslashes($_REQUEST['role']);
			
            if(isset($_REQUEST['username'])) {
				$tsql = "SELECT * from accounts where username='$username' or email='$email'";
				$params = array();
                $duplicate= sqlsrv_query($con, $tsql);
                if (sqlsrv_num_rows($duplicate)>0){
                    echo "<div class='formbold-main-wrapper'>
                                <div class='formbold-form-wrapper' style='min-width=399px;'>
                                    <div style='float: right; z-index: 9;'>
                                        <a href='profile.php'><i class='fas fa-user-circle'></i>Profile</a>
                                        <a href='logout.php'><i class='fas fa-sign-out-alt'></i>Logout</a>
                                    </div>
                                    <div class='curtinLogo' style='display: flex; position: relative; top: 0px; left: 0px'> 
                                        <img src='media/images/main_images/curtin_logo.png' width='170' height='30' alt=''/>
                                    </div>
                                    <div class='content'>
                                        <h2>Failed to add user</h2>
                                        <div>
                                            <p class='link'>Username or Email already in use. Click <a href='register.php'>here</a> to try again</p>
                                        </div>
                                    </div>
                                </div>
                            </div>";
                }else{
                    $query    = "INSERT into accounts (username, password, email, role)
                                VALUES ('$username', '" . password_hash($password, PASSWORD_DEFAULT) . "', '$email', '$role')";
                    $result   = sqlsrv_query($con, $query);
					if( $result === false ) {
						die( print_r( sqlsrv_errors(), true));
					}

                    if ($result) {
                            $fp = fopen($_SERVER['DOCUMENT_ROOT'].'/log/log.txt', 'a');//opens file in append mode  
                            $time = new DateTime("now", new DateTimeZone('Australia/Perth'));
                            fwrite($fp, $time->format('Y-m-d H:i:s'));
                            fwrite($fp, " New User Registered. Username: $username\n");
                            fclose($fp);  
                            
                           echo "<div class='formbold-main-wrapper'>
                                <div class='formbold-form-wrapper' style='min-width=399px;'>
                                    <div style='float: right; z-index: 9;'>
                                        <a href='./profile.php'><i class='fas fa-user-circle'></i>Profile</a>
                                        <a href='./logout.php'><i class='fas fa-sign-out-alt'></i>Logout</a>
                                    </div>
                                    <div class='curtinLogo' style='display: flex; position: relative; top: 0px; left: 0px'> 
                                        <img src='/media/images/main_images/curtin_logo.png' width='170' height='30' alt=''/>
                                    </div>
                                    <div class='content'>
                                        <h2>Successfully added User</h2>
                                        <div>
                                            <p>User was successfully registerd. Click <a href='/index.html'>here</a> to login</p>
                                        </div>
                                    </div>
                                </div>
                            </div>";
                    } else {
                        echo "<div class='formbold-main-wrapper'>
                                <div class='formbold-form-wrapper' style='min-width=399px;'>
                                    <div style='float: right; z-index: 9;'>
                                        <a href='./profile.php'><i class='fas fa-user-circle'></i>Profile</a>
                                        <a href='./logout.php'><i class='fas fa-sign-out-alt'></i>Logout</a>
                                    </div>
                                    <div class='curtinLogo' style='display: flex; position: relative; top: 0px; left: 0px'> 
                                        <img src='/media/images/main_images/curtin_logo.png' width='170' height='30' alt=''/>
                                    </div>
                                    <div class='content'>
                                        <h2>Add New User</h2>
                                        <div>
                                            <p>Missing fields: Please enter all account details. Click <a href='register.php'>here</a> to try again</p>
                                        </div>
                                    </div>
                                </div>
                            </div>";
                    }
                }
            }
            }else {
    ?>
    <div class="formbold-main-wrapper">
        <div class="formbold-form-wrapper" style="min-width=399px;">
            <div style="float: right; z-index: 9;">
                <a href="./profile.php"><i class="fas fa-user-circle"></i>Profile</a>
                <a href="./logout.php"><i class="fas fa-sign-out-alt"></i>Logout</a>
            </div>
			<div class="curtinLogo" style="display: flex; position: relative; top: 0px; left: 0px"> 
				<img src="/media/images/main_images/curtin_logo.png" width="170" height="30" alt=""/>
			</div>
            <div class="content">
                <h2>Add New User</h2>
                <div>
                    <p>Please enter the account details below:</p>
                    <form action="" method="post">
                    <table>
                        <tr>
                            <td>Username:</td>
                            <td>
                                <input type="text" name="username"  required id="id_username">
                            </td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td>
                                <input type="password" name="password"  required id="id_password">
                            </td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>
                                <input type="text" name="email"  required id="id_email">  
                            </td>                     
                         </tr>
                            <td>User Type:</td>
                            <td><select name="role" id="id_role">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                               </select>
                            </td>
                        </tr>
                    </table>
                </div>
                <input type="submit" name="submit" value="Register User" class="button-2">
                </form>
            </div>
        </div>
    </div>
    <?php
    }
    ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
</body>
