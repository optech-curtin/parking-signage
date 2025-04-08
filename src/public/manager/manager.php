<?php
// We need to use sessions, so you should always start sessions using the below code.
session_start();

include('/public/manager/db_connection.php');

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
    <link rel="stylesheet" href="/css/managerStyles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">
    <link href = "https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css"rel = "stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">

</head>

<body>

    <div class="formbold-main-wrapper">
        <div class="formbold-form-wrapper">
            <div class="userButtons">
                <a href="calandar.php" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-circle btn-lg"><i class="far fa-calendar-alt"></i></a>
                <a href="profile.php" class="btn-profile"><i class="fas fa-user-circle"></i>Profile</a>
                <a href="logout.php"class="btn-logout"><i class="fas fa-sign-out-alt"></i>Logout</a>
            </div>
			<div class="curtinLogo" style="display: flex; position: relative; top: 0px; left: 0px"> 
				<img src="/media/images/main_images/curtin_logo.png" width="170" height="30" alt=""/>
			</div>
			
			<div id="myModal" class="modal">
				<span id="close" class="close">&times;</span>
				<img class="modal-content" id="img01">
			  </div>

            <div class="formbold-mb-5">
                <label for="email" class="formbold-form-label formbold-form-label-3">
                    Curtin Digital Signage Manager:
                </label>
                <label for="email" class="formbold-form-label-changes-made" id="changesMade">No changes made.</label>
            </div>
            <div class="signLinkContainer">

            <a href="/public/StaticSignDisplay/sign1.html" target="_blank" rel="noopener noreferrer"><span class="signLink">1</span><span class="signLinkTitle">Uni Boulervard Hayman</span></a>
            <a href="/public/StaticSignDisplay/sign2.html" target="_blank" rel="noopener noreferrer"><span class="signLink">2</span><span class="signLinkTitle">Uni Boulervard Kent St</span></a>
            <a href="/public/StaticSignDisplay/sign3.html" target="_blank" rel="noopener noreferrer"><span class="signLink">3</span><span class="signLinkTitle">Stadium Entrance</span></a>
            <a href="/public/StaticSignDisplay/sign4.html" target="_blank" rel="noopener noreferrer"><span class="signLink">4</span><span class="signLinkTitle">Beazley Kent St</span></a>
            <a href="/public/StaticSignDisplay/sign5.html" target="_blank" rel="noopener noreferrer"><span class="signLink">5</span><span class="signLinkTitle">South Entrance</span></a>
			<a href="/public/StaticSignDisplay/sign6.html" target="_blank" rel="noopener noreferrer"><span class="signLink">6</span><span class="signLinkTitle">Pole Mount</span></a>
            <a href="/public/StaticSignDisplay/signpreview.html" target="_blank" rel="noopener noreferrer"><span class="signLink">All</span></a>
			</div>

            <div class="tab">
                <button class="formbold-form-label tablinks" onclick="tabHandler(event, 'CurrentImagesTab')" id="defaultOpen">Rolling Images</button>
                <button class="formbold-form-label tablinks" onclick="tabHandler(event, 'ScheduleTab')">Map Display Schedule</button>
                <button class="formbold-form-label tablinks" onclick="tabHandler(event, 'FireAlertDisplayTab')">Fire Alert Display</button>
            </div>

            <div id="CurrentImagesTab" class="tabcontent">
                <label class="formbold-form-label formbold-form-label-2">
                    Current Images
                </label>
                <div id="clone-file-item" class="formbold-file-list formbold-mb-5 wrapperItem" style="display: none;">
                    <div class="formbold-file-item">
                        <i class="fas fa-bars"></i>
                        <img id="previewImage" src="/media/images/main_images/none.png" width="19" height="44" alt=""/>
                        <span class="formbold-file-name"></span>
                        <a class="form-edit-button" href="#divOne"><img id="editBtnSrc" src="/media/images/main_images/edit.png" width=25 height=25></img></a>
                        <button id="removeBtn" class="form-remove-button">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                                    fill="currentColor" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="imagesWrapper" class="wrapper"></div>
                <div class="mb-6 pt-4">
                    <label class="formbold-form-label formbold-form-label-2" style="margin-top: 20px;">
                        Upload New Image
                    </label>
    
                    <div class="formbold-mb-5 formbold-file-input" id="uploadFormDiv">
                        <form id="uploadForm" name="form" method="post" action="" enctype="multipart/form-data" target="iframe">
                            <input type="file" id="fileInput" name="images[]" accept="image/jpeg, image/png, image/jpg, video/mp4">
                            <label for="fileInput" id="fileNameLabel" class="formbold-file-input">
                                <div>
                                    <span class="formbold-drop-file"> Drop files here </span>
                                    <span class="formbold-or"> Or </span>
                                    <span class="formbold-browse"> Browse </span>
                                </div>
                            </label>
                            <input type="submit" style="height: 47px; margin-top: 10px;" name="submit" value="Upload"/>
                            <div style="margin-bottom: 20px; margin-top: 10px;">
                                <button id="upload" class="formbold-btn w-full">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div id="ScheduleTab" class="tabcontent">
                <div class="mb-6 pt-4">
                    <label class="formbold-form-label formbold-form-label-2" style="margin-bottom: 0px;">
                       Map Display Schedule
                    </label>
					<div style="display: flex">
						<span style="position:relative; left:35%; padding-bottom: 0px;" class="schedule-form">Map Start Time</span>
						<span style="position:relative; padding-left: 35%; padding-bottom: 0px;" class="schedule-form">Map End Time</span>
					</div>
					<div class="slidecontainer">
							<span class="schedule-form">Sunday: <input id="sunday-start" class="inputTime center" type="text"/> <input id="sunday-end" class="inputTime end"type="text"/></span>
							<hr>
							<span class="schedule-form">Monday: <input id="monday-start" class="inputTime center" type="text" /> <input id="monday-end" class="inputTime end"type="text" /></span>
							<hr>
							<span class="schedule-form">Tuesday: <input id="tuesday-start"class="inputTime center" type="text" /> <input id="tuesday-end" class="inputTime end"type="text" /></span>
							<hr>
							<span class="schedule-form">Wednesday: <input  id="wednesday-start"class="inputTime center" type="text" /> <input id="wednesday-end" class="inputTime end"type="text"/></span>
							<hr>
							<span class="schedule-form">Thursday: <input  id="thursday-start"class="inputTime center" type="text" /> <input id="thursday-end"  class="inputTime end"type="text" /></span>
							<hr>
							<span class="schedule-form">Friday: <input id="friday-start"class="inputTime center" type="text" /> <input id="friday-end" class="inputTime end"type="text" /></span>
							<hr>
							<span class="schedule-form" style="padding-bottom: 40px;">Saturday: <input id="saturday-start"class="inputTime center" type="text" /> <input id="saturday-end" class="inputTime end"type="text"/></span>
					 </div>
				</div>
              </div>
              
              <div id="FireAlertDisplayTab" class="tabcontent">
                <div class="mb-6 pt-4">
                    <label class="formbold-form-label formbold-form-label-2" style="margin-bottom: 10px; width: 90%">
                        Signs that display Road Closure
                    </label>
                    <div class="form-checkbox-wrapper">
                        <label class="formbold-form-label checkbox" style="padding: 5px;"><input id="sign1"
                                type="checkbox" onchange="checkBoxChangeSigns(this)">Sign 1</label>
                        <label class="formbold-form-label checkbox" style="padding: 5px;"><input id="sign2"
                                type="checkbox" onchange="checkBoxChangeSigns(this)">Sign 2</label>
                        <label class="formbold-form-label checkbox" style="padding: 5px;"><input id="sign3"
                                type="checkbox" onchange="checkBoxChangeSigns(this)">Sign 3</label>
                        <label class="formbold-form-label checkbox" style="padding: 5px;"><input id="sign4"
                                type="checkbox" onchange="checkBoxChangeSigns(this)">Sign 4</label>
                        <label class="formbold-form-label checkbox" style="padding: 5px;"><input id="sign5"
                                type="checkbox" onchange="checkBoxChangeSigns(this)">Sign 5</label>
						<label class="formbold-form-label checkbox" style="padding: 5px;"><input id="sign6"
                                type="checkbox" onchange="checkBoxChangeSigns(this)">Sign 6</label>
                    </div>
                </div>
                <div class="mb-6 pt-5" style="margin-top: 40px;">
                    <label class="formbold-form-label formbold-form-label-2"  style="margin-bottom: 10px;">
                        Buildings that trigger a road closure sign
                    </label>
                    <div class="form-checkbox-wrapper">
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input type="checkbox"
                                id="BEN 418" onchange="checkBoxChangeBuildings(this)">BEN 418</label>
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input type="checkbox"
                                id="BEN 420" onchange="checkBoxChangeBuildings(this)">BEN 420</label>
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input type="checkbox"
                                id="BEN 431" onchange="checkBoxChangeBuildings(this)">BEN 431</label>
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input type="checkbox"
                                id="BEN 433" onchange="checkBoxChangeBuildings(this)">BEN 433</label>
                    </div>
                </div>
              </div>

				
            
                <div style="margin-top:10px; left: 0px">
                    <button id='devBtn' class="formbold-btn w-small">Developer Options</button>
                </div>

                <div style="display: none" id="developerOptions" class="developerOptions">
                    <div class="mb-6 pt-5" style="margin-top: 40px;">
                        <label class="formbold-form-label formbold-form-label-2">
                            Interval to check Alarm Status (sec): </label>
							<input id="checkAlarmIntervalInput" class="text-input" type="text"style='float:left;'> <label id="checkAlarmToMinutes" class="formbold-form-label" style="padding: 10px; float:left;"></label>

                    </div>
                    <div class="mb-6 pt-5" style="margin-top: 110px;">
                        <label class="formbold-form-label formbold-form-label-2">
                            Interval to check the Current Time (sec): </label>
							<input id="checkTimeIntervalInput" class="text-input" type="text"style='float:left;'> <label id="checkTimeToMinutes" class="formbold-form-label" style="padding: 10px; float:left;"> </label>
                    </div>
					<div style="margin-top: 100px;">
						<button id='exportBtn' class="formbold-small-btn w-really-small">Export Config</button>
						<button style="display: none;" id='importBtn' class="formbold-small-btn w-really-small">Import Config</button>
					</div>
                </div>
				<div style="margin-top:60px;">
					<button id='saveBtn' class="formbold-btn w-full">Save</button>
				</div>
            </div>

        </div>
		<div class="imageContainer"> 
			<img id="image" src="/media/images/main_images/none.png" width="192" height="443" alt=""/>
		</div>
    </div>

    <div id="imagesDetail" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <span class="close">&times;</span>
        </div>
    </div>

    <div class="editOverlay" id="divOne">
		<div class="editWrapper">
			<h2>Edit Image Settings:</h2><a class="close" href="#">&times;</a>
            <hr style="height:2px;border-width:0;color:gray;background-color:gray;width:86%">
			<div class="content">
				<div class="editContainer">
                <div class="mb-6 pt-5" style="margin-top: 5px; margin-bottom: 70px;">
                    <label class="formbold-form-label formbold-form-label-2">Interval to change Image (sec): </label>
                    <div stle="display: flex;">
                        <input id="changeImageIntervalInput" class="text-input" type="text"style='float:left;' disabled> 
                        <label id="changeImageToMinutes" class="formbold-form-label" style="padding: 10px; float:left;"> </label>
                    </div>
                </div>
                <div style="margin-top: 40px; margin-bottom: 5px;">
                    <label class="formbold-form-label formbold-form-label-2 checkbox" style="text-align: left; padding-right: 15px; display: inline-block;" >Validity Range:</label><input type="checkbox" style="padding: 10px;" id="ValidityRangeCheckbox" disabled>
                    <div class="mb-6 pt-5" style="margin-left: 20px;" id="VailidityScheduleDiv">
                        <span class="schedule-form" style="padding-top: 0px;">Start Date: <input id="start-date" class="inputDate center" type="text" disabled/> </span>

                        <span class="schedule-form">End Date: <input id="end-date" class="inputDate center" type="text" disabled/></span>

                        <div style="margin-top: 20px; margin-bottom: 30px;">
                            <label class="formbold-form-label formbold-form-label-2 checkbox" style="text-align: left; padding-right: 15px; display: inline-block;" >Days to show Image: </label>
                            <div class="form-checkbox-wrapper">
                                <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="sunday"
                                    type="checkbox" onchange="checkBoxChangeImageDays(this)"disabled>Sun</label>
                                <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="monday"
                                        type="checkbox" onchange="checkBoxChangeImageDays(this)"disabled>Mon</label>
                                <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="tuesday"
                                        type="checkbox" onchange="checkBoxChangeImageDays(this)"disabled>Tue</label>
                                <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="wednesday"
                                        type="checkbox" onchange="checkBoxChangeImageDays(this)"disabled>Wed</label>
                                <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="thursday"
                                        type="checkbox" onchange="checkBoxChangeImageDays(this)"disabled>Thur</label>
                                <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="friday"
                                        type="checkbox" onchange="checkBoxChangeImageDays(this)"disabled>Fri</label>
                                <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="saturday"
                                    type="checkbox" onchange="checkBoxChangeImageDays(this)"disabled>Sat</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px; margin-bottom: 5px;">
                    <label class="formbold-form-label formbold-form-label-2 checkbox" style="text-align: left; padding-right: 15px; display: inline-block; margin-bottom: 10px;" >Time Schedule:</label>
                    <div class="mb-6 pt-5" style="margin-left: 20px;" id="VailidityScheduleDiv">
                    <span style="display: flex" class="image-schedule-form"><input style="float: left" id="image-time-end" class="inputTime center" type="text"/><input id="image-time-start" class="inputTime"type="text"/></span>
                    </div>
                </div>
                <div style="margin-top: 10px; margin-bottom: 30px;">
                    <label class="formbold-form-label formbold-form-label-2 checkbox" style="text-align: left; padding-right: 15px; display: inline-block;" >Display on selected Signs: </label>
                    <div class="popup" onclick="infoButton()">?
                        <span class="popuptext" id="myPopup">Sign 1: Uni Boulervard Hayman<br />
                            Sign 2: Uni Boulavard Kent St<br />
                            Sign 3: Stadium Enterance<br />
                            Sign 4: Beazley Kent St<br />
                            Sign 5: South Entrance  <br />
                        </span>
                    </div>
                    <div class="form-checkbox-wrapper">
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="sign1_Image"
                                type="checkbox" onchange="checkBoxChangeImageSigns(this)"disabled>Sign 1</label>
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="sign2_Image"
                                type="checkbox" onchange="checkBoxChangeImageSigns(this)"disabled>Sign 2</label>
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="sign3_Image"
                                type="checkbox" onchange="checkBoxChangeImageSigns(this)"disabled>Sign 3</label>
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="sign4_Image"
                                type="checkbox" onchange="checkBoxChangeImageSigns(this)"disabled>Sign 4</label>
                        <label class="formbold-form-label checkbox" style="padding: 10px;"><input id="sign5_Image"
                                type="checkbox" onchange="checkBoxChangeImageSigns(this)"disabled>Sign 5</label>
                    </div>
                </div>
				</div>
			</div>
		</div>
	</div>


	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.10.2/Sortable.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>
	<script language="JavaScript" type="text/javascript" src="/js/configManager.js"></script>
</body>

