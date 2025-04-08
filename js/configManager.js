/*
File: configManager.js
Author: Finn Morris
Created: 10/10/2023
Last Mod: 13/02/2023
Description: All in one file to handle the Digital Signage Config Webpage - Dont seperate functions into files due to SignManager sharing root
*/

//VARIABLE DECLARATION
//Variables read/written to config:
var CHECK_CURRENT_TIME_INTERVAL; 
var CHECK_ALARM_STATUS_INTERVAL;
var images_data = [];
var image_intervals = [];
var activeFireSigns = [];
var activeFireBuildings = [];
var scheduleData = [ [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],[0,0] ];

var CHANGE_IMAGE_INTERVAL; //Holder for current interval (changes with image rotation)

var valid = false; //Guilty until proven innocent
var validFile = false;
/*
METHOD: main
DESC: Main function, call functions in needed order to set variables and initiate timers
INPUT: None
OUTPUT: None
NOTES: To be run once on startup
*/
function main(){
    
    writeLogEvent("NEW SIGN MANAGER SESSION STARTED");
    document.getElementById("defaultOpen").click(); //Set Default Tab
    setSystemVariables(); //Call function setSystemVariables before starting program

    //Reading from file takes around 200ms, delay is to wait for this
    setTimeout(() => {
        console.log("Variables loaded"); //DEBUG
        changesMade(0); //Initialise the changes made text to be green
     }, 1000);
}

/*
METHOD: writeLogEvent
DESC: Takes an input and writes it to a log file via php
INPUT: data (String)
OUTPUT: JSON OBj (on success: data, on error: error message)
NOTES: 
*/
function writeLogEvent(data){
    jQuery.ajax({
        type: "POST", //More secure than GET
        url: '/server/logEvent.php', //In same directory
        dataType: 'json',
        data: {
            "message": data //String to write to file
        },
        success: function (obj, textstatus) {
                      if( !('error' in obj) ) { //No error
                          yourVariable = obj.result;
                      }
                      else {
                          console.log(obj.error); //Error, output to console
                      }
                }
    });
}

/*
METHOD: restoreUpload
DESC: Changes Upload form back to default
INPUT: none
OUTPUT: visual change of html upload div
NOTES: Outline/border of div is not changed to show red, green or orange on error, sucess or warning
*/
function restoreUpload(){
    $('#uploadForm')[0].reset(); //Clear form contents
    //Replace entire div with new HTML code
    $("#uploadFormDiv").replaceWith(`<div class="formbold-mb-5 formbold-file-input" id="uploadFormDiv">
        <form id="uploadForm" name="form" method="post" action="" enctype="multipart/form-data" target="iframe">
            <input type="file" id="fileInput" name="images[]" accept="image/jpeg, image/png, image/jpg">
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
    </div>`);
    document.getElementById("uploadForm").reset(); //Reset again, compatibility
    uploadReactSetup(); //Perform form js setup -> attach functions
}

/*
METHOD: setSystemVariables
DESC: organiser function to read a file and call every config paramater setting function
INPUT:  None
OUTPUT: None
NOTES: Asyncronous function
*/
async function setSystemVariables() {
    var data = await fetch('/config/config.json')
        .then(response => response.text()) // Parse the response as text
        .then(text => {
          try {
            data = JSON.parse(text); // Try to parse the response as JSON
            valid = checkValidData(data);
            if(valid){
                setCurrentImages(data.image_data); //Image Path
                setScheduleData(data.schedule_data); //Schedule Data
                setCheckCurrentTimeInterval(data.check_current_time_interval); //Check Time Interval
                setActiveFireSigns(data.active_fire_signs); //Active Fire Signs
                setActiveFireBuildings(data.active_fire_buildings); //Active Fire Buildings
                setAlarmStatusInterval(data.check_alarm_status_interval); //Check Alarm Interval
                checkSystemVariabels(); //Output to Console
            }else{
                alert("Error in config file.");
            }
          } catch(err) {
            alert("Config Error" + err);
          }
    });
    writeLogEvent("System variables set for new session ");
}

/*
METHOD: tabHandler
DESC: Change what content is displaying 
INPUT: onClick from HTML (evt, tabName)
OUTPUT: None
NOTES: Credit: https://www.w3schools.com/howto/howto_js_tabs.asp
*/
function tabHandler(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    if(tabName=='CurrentImagesTab'){
        $("#image").show();
    }else{
        $("#image").hide();
    }
  }

/*
METHOD: checkValidData
DESC: Check to see if imported Config data is valid.
INPUT: data
OUTPUT: valid (Boolean)
NOTES: 
*/
function checkValidData(data){
    valid = false;
    imagePath_valid = false;
    imageIntervals_valid = false;
    scheduleData_valid = false;
    checkCurrentTimeInterval_valid = false;
    activeFireSigns_valid = false;
    activeFireBuildings_valid = false;
    checkAlarmStatusInterval_valid = false;

    //Check image data exists:
    if(data.image_data != null){
        imageData_valid = true;
    }
    //Check schedule data exists:
    if(data.schedule_data != null){
       if((data.schedule_data).length == 7){
        scheduleData_valid = true;
       }
    }
    //Check time checking data exists:
    if(data.check_current_time_interval != null){
        checkCurrentTimeInterval_valid = true;
    }
    //Check fire signs data exists:
    if(data.active_fire_signs != null){
        activeFireSigns_valid = true;
    }
    //Check fire buildings data exists:
    if(data.active_fire_buildings != null){
        activeFireBuildings_valid = true;
    }
    //Check alarm data exists:
    if(data.check_alarm_status_interval != null){
        checkAlarmStatusInterval_valid = true;
    }
    //If all data is valid, set valid variable to true
    if(imageData_valid && scheduleData_valid && checkCurrentTimeInterval_valid && activeFireSigns_valid && activeFireBuildings_valid && checkAlarmStatusInterval_valid){
        valid = true;
    }
    writeLogEvent("Data validated. ->from checkValidData()"); //Write log of check
    return valid;
}

/*
METHOD: isValidJson
DESC: Error handle for invalid json
INPUT: json
OUTPUT: true or false (Boolean)
NOTES: No error returned, only caught
*/
function isValidJson(json) {
    try {
        JSON.parse(json);
        writeLogEvent("Data is JSON -> from isValidJson()");
        return true;
    } catch (e) { //If Valid json
        console.log(e);
        return false;
    }
}

/*
METHOD: setCurrentImages
DESC: Creates the variable images which store image paths from the config file. 
      Creates a cloned DIV node of clone-file-item and appennds to imagesWrapper div to display a list item of images
INPUT: image_pth
OUTPUT: None
NOTES: Default image is 
*/
function setCurrentImages(image_data){
    images_data = image_data;
    image = images_data[1].image_path; //Set default

    clone = document.getElementById('clone-file-item'); //Get the Clone HTML DIV of a list item
    wrapper = document.getElementById('imagesWrapper'); //Get the list wrapper
    //Loop Assertion: Loop every image in the new image path list
    for (var i = 0; i<images_data.length; i++){
        var clone = $('#clone-file-item').clone().appendTo('#imagesWrapper'); //Clone and append
        clone.show(); //Show div (as hidden by default)
        clone.children(0).children("span").text(images_data[i].image_path.split("/")[4]); //Change the name to user friendly
        clone.attr("id", images_data[i].image_path); //Set ID to be referenced in future 
        clone.children(0).children("img").attr('src',images_data[i].image_path);
    }
    console.log(images_data);
    var images_print = images_data.reduce((a, b) => a +'Image: '+ b.image_path +', Interval: ' + b.interval + ' ', '');
    writeLogEvent("Got image data: "+ images_print);

}

/*
METHOD: setScheduleData
DESC: Creat new schedule data variable from config file
      Set the input options on HTML w/ convert to  AM-PM
INPUT: data
OUTPUT: None
NOTES: 
*/
function setScheduleData(data){
    scheduleData = new Array(); //Clear current scheduleData
    //Loop Assertion: Loop every schedule item
    for (let i=0; i < data.length; i+=1) {
        //Switch Case Assertion:  i = 0-6 (sunday = 0 saturday = 6)
        switch(i) {
            //SUNDAY
            case 0:
                var sunday = new Array( data[0][0], data[0][1]);
                scheduleData.push(sunday);
                $('#sunday-start').val(amTopm(sunday[0]));
                $('#sunday-end').val(amTopm(sunday[1]));
                break;
            //MONDAY
            case 1:
                var monday = new Array( data[1][0], data[1][1]);
                scheduleData.push(monday);
                $('#monday-start').val(amTopm(monday[0]));
                $('#monday-end').val(amTopm(monday[1]));
                break;
            //TUESDAY
            case 2:
                var tuesday = new Array(data[2][0], data[2][1]);
                scheduleData.push(tuesday);
                $('#tuesday-start').val(amTopm(tuesday[0]));
                $('#tuesday-end').val(amTopm(tuesday[1]));
                break;
            //WEDNESDAY
            case 3:
                var wednesday = new Array( data[3][0], data[3][1]);
                scheduleData.push(wednesday);
                $('#wednesday-start').val(amTopm(wednesday[0]));
                $('#wednesday-end').val(amTopm(wednesday[1]));
                break;
            //THURSDAY
            case 4:
                var thursday = new Array( data[4][0], data[4][1]);
                scheduleData.push(thursday);
                $('#thursday-start').val(amTopm(thursday[0]));
                $('#thursday-end').val(amTopm(thursday[1]));
                break;
            //FRIDAY
            case 5:
                var friday = new Array(data[5][0], data[5][1]);
                scheduleData.push(friday);
                $('#friday-start').val(amTopm(friday[0]));
                $('#friday-end').val(amTopm(friday[1]));
                break;
            //SATURDAY
            case 6:
                var saturday = new Array(data[6][0], data[6][1]);
                scheduleData.push(saturday);
                $('#saturday-start').val(amTopm(saturday[0]));
                $('#saturday-end').val(amTopm(saturday[1]));
                break;
            default:
              console.log("ERROR with importing schedule data");
          } 
    }
    writeLogEvent("Got schedule data: "+ scheduleData);

}

/*
METHOD: amTopm
DESC: converts a config variable from scheduleData from 24Hours to 12-Hour with AM/PM
INPUT: time
OUTPUT: time (FORMAT: HH:MM aa)
NOTES: This is my favourite function. One liner
*/
function amTopm(time){
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
}

/*
METHOD: setCheckCurrentTimeInterval
DESC: take the json config input for Current Time Interval and assign to relavant html for visuals
INPUT: data (json string)
OUTPUT: None
NOTES: 
*/
function setCheckCurrentTimeInterval(data){
    CHECK_CURRENT_TIME_INTERVAL = data; //Set global variable
    document.getElementById("checkTimeIntervalInput").value = CHECK_CURRENT_TIME_INTERVAL/1000; //Input box 
    document.getElementById('checkTimeToMinutes').innerHTML = "("+(CHECK_CURRENT_TIME_INTERVAL/60000).toFixed(2)+" Minutes)"; //(1.00 Minutes)
    writeLogEvent("Got check time interval: "+ CHECK_CURRENT_TIME_INTERVAL); //Log event
}

/*
METHOD: setAlarmStatusInterval
DESC: take the json config input for Alarm Status Interval and assign to relavant html for visuals
INPUT: data (json string)
OUTPUT: None
NOTES: 
*/
function setAlarmStatusInterval(data){
    CHECK_ALARM_STATUS_INTERVAL = data;
    document.getElementById("checkAlarmIntervalInput").value = CHECK_ALARM_STATUS_INTERVAL/1000; //Input box 
    document.getElementById('checkAlarmToMinutes').innerHTML = "("+(CHECK_ALARM_STATUS_INTERVAL/60000).toFixed(2)+" Minutes)"; //(1.00 Minutes)
    writeLogEvent("Got check alarm status interval: "+ CHECK_ALARM_STATUS_INTERVAL); //Log event

}

/*
METHOD: setActiveFireSigns
DESC: Set the checkboxes for Fire Signs 
INPUT: signs (json String)
OUTPUT: Visually check or uncheck boxes
NOTES: 
*/
function setActiveFireSigns(signs){
    activeFireSigns = []
    for (var i in signs) {
        activeFireSigns.push(signs[i]); //Loop all json elements, append to array
    }
    if(activeFireSigns.includes('sign1')) //Sign 1
        document.getElementById("sign1").checked = true;
    if(activeFireSigns.includes('sign2')) //Sign 2
        document.getElementById("sign2").checked = true;
    if(activeFireSigns.includes('sign3'))//Sign 3
        document.getElementById("sign3").checked = true;
    if(activeFireSigns.includes('sign4'))//Sign 4
        document.getElementById("sign4").checked = true;
    if(activeFireSigns.includes('sign5'))//Sign 5
        document.getElementById("sign5").checked = true;
	if(activeFireSigns.includes('sign6'))//Sign 6
        document.getElementById("sign6").checked = true;
    writeLogEvent("Got active signs data: "+ activeFireSigns); //Log Event

}

/*
METHOD: setActiveFireBuildings
DESC: Set the check boxes in html for buildings to activate fire signs
INPUT: buildings (Json object)
OUTPUT: visual change in checkboxes
NOTES: Can add more buildings/non checkboxes in TODO
*/
function setActiveFireBuildings(buildings){
    activeFireBuildings = []
    for (var i in buildings) {
        activeFireBuildings.push(buildings[i]);
    }
    //By defult boxes are unchecked, if buildings are in config -> checkboxes / else do nothing
    if(activeFireBuildings.includes('BEN 433'))
        document.getElementById("BEN 433").checked = true;
    if(activeFireBuildings.includes('BEN 431'))
        document.getElementById("BEN 431").checked = true;
    if(activeFireBuildings.includes('BEN 418'))
        document.getElementById("BEN 418").checked = true;
    if(activeFireBuildings.includes('BEN 420'))
        document.getElementById("BEN 420").checked = true;
    writeLogEvent("Got active buildings data: "+ activeFireBuildings); //Log Event

}

/*
METHOD: uploadImage
DESC: Create the newly uploaded image config with associated attributes to the config file
INPUT: image (String) (path to image)
OUTPUT: image data updated
NOTES: No raw image data, only path passed through here
*/
function uploadImage(image){
    document.getElementById("image").src = image; //Set displayed image to new image
    clone = document.getElementById('clone-file-item'); //Get the dummy div for cloning
    wrapper = document.getElementById('imagesWrapper'); //Get the image wrapper

    var clone = $('#clone-file-item').clone().appendTo('#imagesWrapper'); //Clone div and append to the images list
    clone.show(); //Show the new cloned div (orig hidden)
    clone.children(0).children("span").text(image.split("/")[4]); //Get the image name without path
    clone.children(0).children("img").attr("src", image); //change the thumbnail image to new image
    clone.attr("id", image); //Change ID to match image name
    //DEFAULT image attributes 
    newImage = {
        "image_path": image,
        "interval" : 10000, //10  second interval
        "validity_date": "false", //No validity date
        "start_date": "01-01-2023", //DEFULT  start and end validity dates
        "end_date": "02-01-2023", 
        "signs": "sign1, sign2, sign3, sign4, sign5", //DEFULT to show on all signs
        "dotw": "sunday, monday, tuesday, wednesday, thursday, friday, saturday", //DEFULT to show every day
        "schedule": "00:00,23:59" //DEFUALT to show at all times
    }
    images_data.push(newImage); //Add new image to global variable (but not to config file yet)

    document.getElementById("fileNameLabel").style.border = "1px dashed #e0e0e0";     //Change border of upload div to green
    changesMade(1); //Activate changes display at top of page
    writeLogEvent("Uploaded new image: "+ newImage.image_path); //Log Event

} 

/*
METHOD: checkBoxChangeSigns
DESC: append or remove a sign from the fire signs variable list when a checkbox is changed
INPUT: checkboxesElem (the element of the changed checkbox)
OUTPUT: Log Event
NOTES: Called from html 
*/

function checkBoxChangeSigns(checkboxElem) {
    //If the checkbox is changed to checked
    if (checkboxElem.checked) {
      activeFireSigns.push(checkboxElem.id) //Add checkbox id to list of checked boxes
      console.log(activeFireSigns) //Output the list
    //If the checkbox is changed to unchecked
    } else {
        activeFireSigns = activeFireSigns.filter(e => e !== checkboxElem.id); // will return ['A', 'C']
        console.log(activeFireSigns) //Output the list
    }
    changesMade(1); //Changed made warning activate
    writeLogEvent("Active signs changed: "+ activeFireSigns); //Log Event

  }

  /*
METHOD: checkBoxChangeImageSigns
DESC: append or remove a sign from an image's display on which sign list when a checkbox is changed
INPUT: checkboxElem (elment from html)
OUTPUT: Log Event
NOTES: 
*/
  function checkBoxChangeImageSigns(checkboxElem) {
    image = document.getElementById("image").getAttribute("src"); //Get the image currently selected 
    for (let [key, value] of Object.entries(images_data)) { //Loop all image objects in images_data
        if(value.image_path == image){ //Confirm image path matches image
            //If checkbox changed to checked
            if (checkboxElem.checked) {
                if(value.signs.length ==0 ){
                    value.signs = value.signs + checkboxElem.id.split("_")[0]; //If its the first sign, dont add a "," to string list
                }else{
                    value.signs = value.signs + ", "+checkboxElem.id.split("_")[0]; //If not the first sign, add a "," to string list
                }
            //If checkbox changed to unchecked
            } else {
                value.signs = (value.signs).replace(checkboxElem.id.split("_")[0]+", ",''); //replace with nothing
                value.signs = (value.signs).replace(checkboxElem.id.split("_")[0],''); //Could be last element without a ","
              
            }
            changesMade(1); //Changes made warning active
            writeLogEvent("Active signs changed: " + value.signs); //Log Event
        }
    }

  }

  /*
METHOD: checkBoxChangeImageDays
DESC: handle changes in the checkboxes for days of the week to show signs
INPUT: checkbox element
OUTPUT: log event
NOTES: dotw (Days of the week)
*/
// This function updates the "dotw" property of an object in the images_data array when a checkbox element is checked or unchecked
function checkBoxChangeImageDays(checkboxElem) {
    // Get the src attribute of the element with the id "image"
    image = document.getElementById("image").getAttribute("src");
    // Loop through the entries in the images_data object
    for (let [key, value] of Object.entries(images_data)) {
        // If the "image_path" property of the value is equal to the image variable
        if(value.image_path == image){
            console.log(value.dotw);
            // Check if the checkbox is checked
            if (checkboxElem.checked) {
                // If the "dotw" property of the value is an empty string, set it to the id of the checkbox element
                if(value.dotw.length == 0) {
                    value.dotw = value.dotw + checkboxElem.id.split("_")[0];
                // Otherwise, append the id of the checkbox element to the "dotw" property of the value, separated by a comma and a space
                } else {
                    value.dotw = value.dotw + ", " + checkboxElem.id.split("_")[0];
                }
            // If the checkbox is not checked
            } else {
                // Remove the id of the checkbox element from the "dotw" property of the value, with or without a comma and a space after it
                value.dotw = (value.dotw).replace(checkboxElem.id.split("_")[0] + ", ", '');
                value.dotw = (value.dotw).replace(checkboxElem.id.split("_")[0], '');
            }
            // Call the changesMade function with an argument of 1
            changesMade(1);
            // Write a log event
            writeLogEvent("Active Days changed: " + value.dotw);
        }
    }
}

/*
METHOD: checkBoxChangeBuildings
DESC: This function updates the activeFireBuildings array when a checkbox element is checked or unchecked.
INPUT: checkboxElem - a checkbox element
OUTPUT: The activeFireBuildings array is updated
NOTES: 
*/
function checkBoxChangeBuildings(checkboxElem) {
    // Check if the checkbox is checked
    if (checkboxElem.checked) {
        // Add the id of the checkbox element to the activeFireBuildings array
        activeFireBuildings.push(checkboxElem.id)
    // If the checkbox is not checked
    } else {
        // Remove all elements from the activeFireBuildings array that are equal to the id of the checkbox element
        activeFireBuildings = activeFireBuildings.filter(e => e !== checkboxElem.id);
    }
    console.log(checkboxElem.id);
    console.log(activeFireBuildings)
    // Call the changesMade function with an argument of 1
    changesMade(1);
    // Write a log event
    writeLogEvent("Active buildings changed: " + activeFireBuildings);
}

/*
METHOD: checkSystemVariabels
DESC: This function logs the values of certain variables and properties to the console.
INPUT: None
OUTPUT: The values of the variables and properties are logged to the console
NOTES: 
*/
function checkSystemVariabels(){
    // Create a string by concatenating the "image_path" and "interval" properties of the objects in the images_data array
    var images_print = images_data.reduce((a, b) => a +'Image: '+ b.image_path +', Interval: ' + b.interval + ' ', '');
    console.log("IMAGES: "+images_print);

    console.log("CHECK_CURRENT_TIME_INTERVAL: "+ CHECK_CURRENT_TIME_INTERVAL);
    console.log("CHECK_ALARM_STATUS_INTERVAL: "+ CHECK_ALARM_STATUS_INTERVAL);

    console.log("ACTIVE_FIRE_SIGNS: "+ activeFireSigns);
    console.log("ACTIVE_FIRE_BUILDINGS: "+ activeFireBuildings);

    console.log("SCHEDULE DATA: "+ scheduleData);
}

/*
METHOD: save
DESC: This function writes data to storage, reloads the page, and writes a log event if the valid variable is true. If valid is false, it displays an alert and writes a log event.
INPUT: None
OUTPUT: The page is reloaded and a log event is written
NOTES: 
*/
function save(){
    // Check if the valid variable is true
    if(valid){
        // Call the writeData function
        writeData();
        // Call the changesMade function with an argument of 0
        changesMade(0);
        // Write a log event
        writeLogEvent("ALL VARIABLES SAVED...reloading");
        // After 1.5 seconds, reload the page
        setTimeout(() => {
            document.location.reload(true);
         }, 1500);    
    // If the valid variable is false
    } else {
        // Display an alert
        alert("Cannot save...Config Error");
        // Write a log event
        writeLogEvent("Error: CONFIG SAVE FAILED");
    }
}

/*
METHOD: writeData
DESC: This function sends an AJAX request to a server-side script with certain data, and writes a log event.
INPUT: None
OUTPUT: None (an AJAX request is sent)
NOTES: 
*/
function writeData(){
    console.log(images_data);
    // Create an object with certain properties
    data = {
        elem: {
            image_data: images_data,
            active_fire_signs: activeFireSigns,
            active_fire_buildings: activeFireBuildings,
            schedule_data: scheduleData,
            check_current_time_interval: CHECK_CURRENT_TIME_INTERVAL,
            check_alarm_status_interval: CHECK_ALARM_STATUS_INTERVAL,
        }
    };
    // Send an AJAX request to the server-side script "save.php" with certain data
    $.ajax({
        url: "save.php?action=save",
        method: "POST",
        data: { 
            elem: {
                image_data: images_data,
                active_fire_signs: activeFireSigns,
                active_fire_buildings: activeFireBuildings,
                schedule_data: scheduleData,
                check_current_time_interval: CHECK_CURRENT_TIME_INTERVAL,
                check_alarm_status_interval: CHECK_ALARM_STATUS_INTERVAL,
            }
        },
        beforeSend: function(){
            // Update the HTML of an element with an image
            $('#saveBtn').html('<img hight="30px" width="30px" src="/media/images/main_images/uploading.gif"/>');
            // Disable a button element
            $('#saveBtn').prop('disabled', true);
        },
        success: function (data){
            console.log("Saved!");
            console.log(data);
        }
    });
    writeLogEvent("Attemptiong save."); // Write a log event


}

/*
METHOD: changesMade
DESC: This function updates the text and color of an element depending on the value of the "state" input.
INPUT: state - a number representing the state (0 or 1)
OUTPUT: The text and color of an element is updated
NOTES: 
*/
function changesMade(state){
    // Get an element by its ID
    changesText = document.getElementById("changesMade");
    // If the state is 0
    if(state == 0){
        // Update the inner HTML and style of the element
        changesText.innerHTML = "No changes made."
        changesText.style.color = "green"
    // If the state is 1
    } else if(state == 1){
        // Update the inner HTML and style of the element
        changesText.innerHTML = "Changes made. NOT saved"
        changesText.style.color = "red"
    }
}

/*
METHOD: isNum
DESC: This function returns a boolean indicating whether or not the input string contains a digit.
INPUT: v - a string
OUTPUT: A boolean indicating whether or not the input string contains a digit
NOTES: 
*/
function isNum(v) {
    // Test if the input string contains a digit and return the result
    return /\d/.test(v);
}


const targetDiv = document.getElementById("developerOptions");
const btn = document.getElementById("devBtn");

/*
METHOD: n/a (anonymous function)
DESC: This function toggles the display property of an element and updates the inner HTML of a button element when it is clicked.
INPUT: None
OUTPUT: The display property of an element is toggled, and the inner HTML of a button element is updated
NOTES: This function is assigned to the "onclick" event of a button element.
*/
btn.onclick = function () {
    // If the display property of the target element is not "none"
    if (targetDiv.style.display !== "none") {
      // Set the display property to "none"
      targetDiv.style.display = "none";
      // Update the inner HTML of the button element
      btn.innerHTML = "Show developer options"
    } else {
      // Set the display property to "inline-block"
      targetDiv.style.display = "inline-block";
      // Update the inner HTML of the button element
      btn.innerHTML = "Hide developer options"
    }
  };


/*
METHOD: n/a (anonymous function)
DESC: This function calls another function when the document is ready.
INPUT: None
OUTPUT: Another function is called
NOTES: This function is wrapped in the jQuery "ready" function, which is called when the document is ready.
*/
$(document).ready(function(){
    // Call the "uploadReactSetup" function
    uploadReactSetup();
});


/*
METHOD: uploadReactSetup
DESC: This function sets up event listeners for a form element and a file input element. The form element is
    set to submit data via an AJAX request when submitted. The file input element is set to validate the file
    that is selected by the user and to update a label element with the file name.
INPUT: None
OUTPUT: Event listeners are added to form and file input elements
NOTES: 
*/
function uploadReactSetup(){
    // Add a submit event listener to the form element
    $("#uploadForm").on('submit', function(e){
        // If the file is valid
        if(validFile){
            // Prevent the default submit action
            e.preventDefault();
            // Send an AJAX request
            $.ajax({
                type: 'POST',
                url: 'uploadImage.php',
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData:false,
                // Before the request is sent, log a message to the console
                beforeSend: function(){
                    console.log("Ready to upload...");
                },
                // If there is an error, log a message to the console
                error:function(){
                    console.log("ERROR on AJAX upload");
                },
                // When the request is successful, call the "uploadImage" function and reset the form
                success: function(data){
                    uploadImage(data);
                    console.log(data);
                    restoreUpload();
                }
            });
            // Log an event to the console
            writeLogEvent("New File Uploaded");
    }
    });
    
    // Add a change event listener to the file input element
    $("#fileInput").change(function(){
        // Initialize a variable to track whether or not the selected file is a duplicate
        var duplicateCheck = false;
        // Initialize an array of allowed file types
        var match= ["image/jpeg","image/png","image/jpg","image/gif", "video/mp4"];
        // Get the selected file
        var file = this.files[0];
        // Check if the file has

        // If the file has already been uploaded, set the "duplicateCheck" variable to true
        for (var i=0; i<images_data.length; i++) {
            if(images_data[i].image_path == 'media/images/rolling_images/'+file.name){
                duplicateCheck = true;
            }
        }
        // Get the file type
        var imagefile = file.type;
        // Set the border color of the label element to green
        document.getElementById("fileNameLabel").style.border = "2px solid green";
        // Set the text of the label element to the file name
        $('#fileNameLabel').text(file.name);
        // If the file is a duplicate
        if(duplicateCheck){
            // Alert the user and reset the form
            alert('Image with name already uploaded. Please choose a different name.');
            $("#fileInput").val('');
            restoreUpload();
            // Set the border color of the label element to red
            document.getElementById("fileNameLabel").style.border = "2px solid red";     
            // Set the "validFile" variable to false
            validFile = false;
        // If the file is not an allowed file type
        }else if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]) || (imagefile==match[3]) || (imagefile==match[4]))){
            // Alert the user and reset the form
            alert('Please select a valid image file (JPEG/JPG/PNG/GIF/MP4).');
            $("#fileInput").val('');
            restoreUpload();
            document.getElementById("fileNameLabel").style.border = "2px solid red";     
            validFile = false;
        }else{
            var reader = new FileReader();

            //Read the contents of Image File.
            reader.readAsDataURL(file);
            // When the file is loaded
            reader.onload = function (e) {

                // Create a new JavaScript Image object
                var image = new Image();

                // Set the Base64 string returned by the FileReader as the source
                image.src = e.target.result;

                // When the image is loaded
                image.onload = function () {
                    // Get the image's height and width
                    var height = this.height;
                    var width = this.width;
                    // If the image's height and width do not match the ideal values
                    if (height != 433 || width != 192) {
                        // Alert the user that the image will be distorted
                        alert("Ideal height and width is 443x192px. This image will be distorted.");
                        // Set the border color of the label element to orange
                        document.getElementById("fileNameLabel").style.border = "2px solid orange";
                    };
                };
                // Set the "validFile" variable to true
                validFile = true;
            }
        }
    });
}

/*
METHOD: $('#changeImageIntervalInput').on('input',function(e)
DESC: This function is triggered when the user changes the value of the input field.
INPUT: The new value of the input field.
OUTPUT: Changes the interval at which images are displayed, and updates an element to show the new interval in minutes. May also display an alert or write log events.
NOTES: The function checks if the input is a number, and calls another function called changesMade with an argument of 1.
*/
$('#changeImageIntervalInput').on('input',function(e){
    if(isNum($('#changeImageIntervalInput').val()) || ($('#changeImageIntervalInput').val() == '')){
        // Get the source attribute of the image element
        image = document.getElementById("image").getAttribute("src");
        // Check if the image source is 'media/images/main_images/none.png'
        if(image == '/media/images/main_images/none.png'){
            alert("Select Image");
        } else {
            // Set the global variable "CHANGE_IMAGE_INTERVAL" to the value of the input field multiplied by 1000
            CHANGE_IMAGE_INTERVAL = $('#changeImageIntervalInput').val()*1000;
            // Iterate through the "images_data" object and find the entry with the matching "image_path"
            for (let [key, value] of Object.entries(images_data)) {
                if(value.image_path == image){
                    // Set the "interval" property of the matching entry to the value of "CHANGE_IMAGE_INTERVAL"
                    value.interval = CHANGE_IMAGE_INTERVAL;
                }
            }
            // Update the inner HTML of an element to show the value of "CHANGE_IMAGE_INTERVAL" in minutes
            document.getElementById('changeImageToMinutes').innerHTML = "("+(CHANGE_IMAGE_INTERVAL/60000).toFixed(2)+" Minutes)";
            // Call the function "changesMade" with an argument of 1
            changesMade(1);
            // Write a log event
            writeLogEvent("Image interval changed. Interval: " + CHANGE_IMAGE_INTERVAL);

        }
    } else {
        // Display an alert saying "Numbers only"
        alert("Numbers only");
        // Write a log event
        writeLogEvent("Failed to change interval. Interval: " + CHANGE_IMAGE_INTERVAL);

    }
});

/*
METHOD: $('#checkAlarmIntervalInput').on('input',function(e)
DESC: This function is triggered when the user changes the value of the input field.
INPUT: The new value of the input field.
OUTPUT: Changes the interval at which the alarm status is checked, and updates an element to show the new interval in minutes. May also display an alert or write log events.
NOTES: The function checks if the input is a number, and calls another function called changesMade with an argument of 1.
*/
$('#checkAlarmIntervalInput').on('input',function(e){
    // Check if the value of the input field is a number
    if(isNum($('#checkAlarmIntervalInput').val())){
        // Set the global variable "CHECK_ALARM_STATUS_INTERVAL" to the value of the input field multiplied by 1000
        CHECK_ALARM_STATUS_INTERVAL = parseInt($('#checkAlarmIntervalInput').val()*1000);
        // Update the inner HTML of an element to show the value of "CHECK_ALARM_STATUS_INTERVAL" in minutes
        document.getElementById('checkAlarmToMinutes').innerHTML = "("+(CHECK_ALARM_STATUS_INTERVAL/60000).toFixed(2)+" Minutes)";
        // Call the function "changesMade" with an argument of 1
        changesMade(1);
        // Write a log event
        writeLogEvent("Alarm interval changed. Interval: " + CHECK_ALARM_STATUS_INTERVAL);
    } else {
        // Display an alert saying "Numbers only"
        alert("Numbers only");
        // Write a log event
        writeLogEvent("Failed to change interval. Interval: " + CHECK_ALARM_STATUS_INTERVAL);
    }
});

/*
METHOD: $('#checkTimeIntervalInput').on('input',function(e)
DESC: This function is triggered when the user changes the value of the input field.
INPUT: The new value of the input field.
OUTPUT: Changes the interval at which the current time is checked, and updates an element to show the new interval in minutes. May also display an alert or write log events.
NOTES: The function checks if the input is a number, and calls another function called changesMade with an argument of 1.
*/
$('#checkTimeIntervalInput').on('input',function(e){
    // Check if the value of the input field is a number
    if(isNum($('#checkTimeIntervalInput').val())){
        // Set the global variable "CHECK_CURRENT_TIME_INTERVAL" to the value of the input field multiplied by 1000
        CHECK_CURRENT_TIME_INTERVAL = int($('#checkTimeIntervalInput').val()*1000);
        // Update the inner HTML of an element to show the value of "CHECK_CURRENT_TIME_INTERVAL" in minutes
        document.getElementById('checkTimeToMinutes').innerHTML = "("+(CHECK_CURRENT_TIME_INTERVAL/60000).toFixed(2)+" Minutes)";
        // Call the function "changesMade" with an argument of 1
        changesMade(1);
        // Write a log event
        writeLogEvent("Time check interval changed. Interval: " + CHECK_CURRENT_TIME_INTERVAL);
    } else {
        // Display an alert saying "Numbers only"
        alert("Numbers only");
        // Write a log event
        writeLogEvent("Failed to change interval. Interval: " + CHECK_CURRENT_TIME_INTERVAL);
    }
});

/*
METHOD: $( "#saveBtn" ).click(function()
DESC: This function is triggered when the user clicks the #saveBtn element.
INPUT: None.
OUTPUT: Calls the save function.
NOTES: None.
*/
$( "#saveBtn" ).click(function() {
    // Call the function "save"
    save();
});

/*
METHOD:  EventListener: OnClick imagesWrapper Div
DESC: Handle click on images list item. 
      Display Image, Image interval and image to minutes text
INPUT: e
OUTPUT: None
NOTES: If device is mobile, show a modal instead
*/
$("#imagesWrapper").on('click','div', function(e){
    // Declare a variable "found" and set it to 0 by default
    var found = 0;
    // Get the image element and the interval input element
    var image = document.getElementById("image");
    var intervalInput = document.getElementById("changeImageIntervalInput");
    // Set the background color of all child elements of the "imagesWrapper" element to "#f5f7fb"
    $("#imagesWrapper").children().css('background-color', "#f5f7fb");
    // Check if the clicked element has the class "wrapperItem"
    if($(this).hasClass('wrapperItem')){
        // If it does, set the background color of the clicked element to "#dee2e7"
        $(this).css('background-color', '#dee2e7');
    }
    // Iterate through the "images_data" object
    for (let [key, value] of Object.entries(images_data)) {
        // Check if the "id" attribute of the clicked element matches the "image_path" property of the current entry in the object
        if(value.image_path == $(this).attr("id")){
            // If it does, set the value of the interval input element to the "interval" property of the current entry divided by 1000
            // (converting it to seconds)
            intervalInput.value = value.interval/1000;
            // Update the inner HTML of an element to show the value of the "interval" property of the current entry in minutes
            document.getElementById('changeImageToMinutes').innerHTML = "("+(value.interval/60000).toFixed(2)+" Minutes)";
            // Set the start and end dates of a datepicker element to the "start_date" and "end_date" properties of the current entry
            $('#start-date').datepicker("setDate", value.start_date);
            $('#end-date').datepicker("setDate", value.end_date);
            // Split the "schedule" property of the current entry into an array and assign the values to variables
            var timeImageStart = value.schedule.split(",")[0];
            var timeImageEndvalue = value.schedule.split(",")[1];
            //
            console.log(timeImageEndvalue);
            // Update the value of two input elements to the values of the "timeImageStart" and "timeImageEndvalue" variables
            $('#image-time-start').val(amTopm(timeImageStart));
            $('#image-time-end').val(amTopm(timeImageEndvalue));
            // Check the value of the "validity_date" property of the current entry
            if(value.validity_date == "true"){
                // If it is "true", check a checkbox element
                $( "#ValidityRangeCheckbox" ).prop( "checked", true );
                // Show a div element
                $('#VailidityScheduleDiv').show();
            }else{
                // If it is not "true", uncheck the checkbox element
                $( "#ValidityRangeCheckbox" ).prop( "checked", false );
                // Hide the div element
                $('#VailidityScheduleDiv').hide();
            }
            // Check the value of the "signs" property of the current entry
            if(value.signs.includes('sign1')){
                // If it includes "sign1", check a radio button element
                document.getElementById("sign1_Image").checked = true;
            }else{
                // If it does not include "sign1", uncheck the radio button element
                document.getElementById("sign1_Image").checked = false;
            }
            if(value.signs.includes('sign2')){
                // If it includes "sign2", check a radio button element
                document.getElementById("sign2_Image").checked = true;
            }else{
                // If it does not include "sign2", uncheck the radio button element
                document.getElementById("sign2_Image").checked = false;
            }
            if(value.signs.includes('sign3')){
                // If it includes "sign3", check a radio button element
                document.getElementById("sign3_Image").checked = true;
            }else{
                // If it does not include "sign3
                document.getElementById("sign3_Image").checked = false;
            }
            if(value.signs.includes('sign4')){
                // If it includes "sign4", check a radio button element
                document.getElementById("sign4_Image").checked = true;
            }else{
                // If it does not include "sign4", uncheck the radio button element
                document.getElementById("sign4_Image").checked = false;
            }
            if(value.signs.includes('sign5')){
                // If it includes "sign5", check a radio button element
                document.getElementById("sign5_Image").checked = true;
            }else{
                // If it does not include "sign5", uncheck the radio button element
                document.getElementById("sign5_Image").checked = false;
            }
            // Check the value of the "dotw" property of the current entry
            if(value.dotw.includes('sunday')){
                // If it includes "sunday", check a checkbox element
                document.getElementById("sunday").checked = true;
            }else{
                // If it does not include "sunday", uncheck the checkbox element
                document.getElementById("sunday").checked = false;
            }
            // If image is found in images_data, update all relevant fields
            if(value.dotw.includes('monday')){
                // Check the monday checkbox element if it includes "monday"
                document.getElementById("monday").checked = true;
            }else{
                // Uncheck the monday checkbox element if it does not include "monday"
                document.getElementById("monday").checked = false;
            }
            if(value.dotw.includes('tuesday')){
                // Check the tuesday checkbox element if it includes "tuesday"
                document.getElementById("tuesday").checked = true;
            }else{
                // Uncheck the tuesday checkbox element if it does not include "tuesday"
                document.getElementById("tuesday").checked = false;
            }
            if(value.dotw.includes('wednesday')){
                // Check the wednesday checkbox element if it includes "wednesday"
                document.getElementById("wednesday").checked = true;
            }else{
                // Uncheck the wednesday checkbox element if it does not include "wednesday"
                document.getElementById("wednesday").checked = false;
            }
            if(value.dotw.includes('thursday')){
                // Check the thursday checkbox element if it includes "thursday"
                document.getElementById("thursday").checked = true;
            }else{
                // Uncheck the thursday checkbox element if it does not include "thursday"
                document.getElementById("thursday").checked = false;
            }
            if(value.dotw.includes('friday')){
                // Check the friday checkbox element if it includes "friday"
                document.getElementById("friday").checked = true;
            }else{
                // Uncheck the friday checkbox element if it does not include "friday"
                document.getElementById("friday").checked = false;
            }
            if(value.dotw.includes('saturday')){
                // Check the saturday checkbox element if it includes "saturday"
                document.getElementById("saturday").checked = true;
            }else{
                document.getElementById("saturday").checked = false;
            }
            found = 1;
            // Enable all relevant form elements
            $( "#changeImageIntervalInput" ).prop( "disabled", false );
            $( "#ValidityRangeCheckbox" ).prop( "disabled", false );
            $( "#start-date" ).prop( "disabled", false );
            $( "#end-date" ).prop( "disabled", false );

            $( "#sign1_Image" ).prop( "disabled", false );
            $( "#sign2_Image" ).prop( "disabled", false );
            $( "#sign3_Image" ).prop( "disabled", false );
            $( "#sign4_Image" ).prop( "disabled", false );
            $( "#sign5_Image" ).prop( "disabled", false );

            $( "#sunday" ).prop( "disabled", false );
            $( "#monday" ).prop( "disabled", false );
            $( "#tuesday" ).prop( "disabled", false );
            $( "#wednesday" ).prop( "disabled", false );
            $( "#thursday" ).prop( "disabled", false );
            $( "#friday" ).prop( "disabled", false );
            $( "#saturday" ).prop( "disabled", false );
        }
    }
    image.src =  $(this).attr("id"); //Update the image displayed

});


/*
METHOD: $("#imagesWrapper").on('click','img', function(e)
DESC: This function is triggered when an img element within the #imagesWrapper element is clicked.
INPUT: The img element that was clicked.
OUTPUT: Displays a modal and sets the src of the modal image to the src of the img element that was clicked.
NOTES: The function checks if the img element clicked is the edit button. The modal and modal image elements are obtained from the DOM.
*/
$("#imagesWrapper").on('click','img', function(e){
    if($(this).attr("id") != "editBtnSrc"){ // Check if the image clicked is not the edit button
        var image = $(this).attr("src"); // Get the src of the image that was clicked
        var modal = document.getElementById("myModal"); // Get the modal element
        // Get the image and insert it inside the modal
        var modalImg = document.getElementById("img01");// Get the modal image element
        // Display the modal
        modal.style.display = "block"; 
        modalImg.src = image; // Set the src of the modal image to the src of the image that was clicked
    }
});


/*
METHOD: 
DESC: 
INPUT: 
OUTPUT: 
NOTES: 
*/
$(document).ready(function(){
    $('.inputTime').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        defaultTime: '12',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: function(time) {
            // the input field
            var element = $(this), text;
            // get access to this Timepicker instance
            var element = (element[0].id).split("-");
            var hours = time.getHours();
            hours = hours < 10 ? '0'+hours : hours;
            var minutes = time.getMinutes();
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var stringTime = hours+":"+minutes
            if(element[0] == 'sunday'){
                if(element[1] == 'start'){
                    scheduleData[0][0] = stringTime;
                }else if(element[1] == 'end'){
                    scheduleData[0][1] = stringTime;
                }
            }else if(element[0] == 'monday'){
                if(element[1] == 'start'){
                    scheduleData[1][0] = stringTime;
                }else if(element[1] == 'end'){
                    scheduleData[1][1] = stringTime;
                }
            }else if(element[0] == 'tuesday'){
                if(element[1] == 'start'){
                    scheduleData[2][0] = stringTime;
                }else if(element[1] == 'end'){
                    scheduleData[2][1] = stringTime;
                }
            }else if(element[0] == 'wednesday'){
                if(element[1] == 'start'){
                    scheduleData[3][0] = stringTime;
                }else if(element[1] == 'end'){
                    scheduleData[3][1] = stringTime;
                }
            }else if(element[0] == 'thursday'){
                if(element[1] == 'start'){
                    scheduleData[4][0] = stringTime;
                }else if(element[1] == 'end'){
                    scheduleData[4][1] = stringTime;
                }
            }else if(element[0] == 'friday'){
                if(element[1] == 'start'){
                    scheduleData[5][0] = stringTime;
                }else if(element[1] == 'end'){
                    scheduleData[5][1] = stringTime;
                }
            }else if(element[0] == 'saturday'){
                if(element[1] == 'start'){
                    scheduleData[6][0] = stringTime;
                }else if(element[1] == 'end'){
                    scheduleData[6][1] = stringTime;
                }
                
            }else if(element[0] = "image"){
                if(element[2] == 'end'){
                    image = document.getElementById("image").getAttribute("src");
                    for (let [key, value] of Object.entries(images_data)) {
                        if(value.image_path == image){
                            console.log(stringTime);
                            value.schedule =  value.schedule.split(",")[0] +"," + stringTime;                    
                        }
                    }
                }else if(element[2] == 'start'){
                    image = document.getElementById("image").getAttribute("src");
                    for (let [key, value] of Object.entries(images_data)) {
                        if(value.image_path == image){
                            console.log(stringTime);
                            value.schedule =  stringTime + "," + value.schedule.split(",")[1];
                            
                        }
                    }
                }
            }
            changesMade(1);
        }

    });
});

function infoButton() {
    var popup = document.getElementById("myPopup"); // Get the element with the id "myPopup"
    popup.classList.toggle("show"); // Toggle the "show" class on the element
  }
  
function infoButton2() {
    // Get the element with the id "myPopup2"
    var popup = document.getElementById("myPopup2");
    // Toggle the "show" class on the element
    popup.classList.toggle("show");
}

/*
METHOD: exportConfig()
DESC: This function exports the data object as a JSON file.
INPUT: None.
OUTPUT: Downloads a JSON file with the data object as its contents.
NOTES: The data object is converted to a JSON string and set as the href of an anchor element with the id "downloadAnchorElem". The anchor element's download attribute is set to "scene.json", and it is clicked to trigger the download. A log event is also written.
*/
function exportConfig(){
    // Convert the data object to a JSON string
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    // Get the anchor element with the id "downloadAnchorElem"
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    // Set the href and download attributes of the anchor element
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    // Click the anchor element to trigger the download
    dlAnchorElem.click();
    // Write a log event
    writeLogEvent("Config Exported.");
}

/*
METHOD: $("#exportBtn").click(function()
DESC: This function is triggered when the #exportBtn element is clicked.
INPUT: None.
OUTPUT: Downloads a JSON file with certain data as its contents.
NOTES: The function creates an object with the data to be exported and sets it as the href of a new anchor element. The anchor element's download attribute is set to "config.json", and it is clicked to trigger the download. The anchor element is then removed from the DOM.
*/
$("#exportBtn").click(function() {
    // Create an object with the data to be exported
    data ={
        image_path: images_data,
        image_intervals: image_intervals,
        active_fire_signs: activeFireSigns,
        active_fire_buildings: activeFireBuildings,
        schedule_data: scheduleData,
        check_current_time_interval: CHECK_CURRENT_TIME_INTERVAL,
        check_alarm_status_interval: CHECK_ALARM_STATUS_INTERVAL
    }
    // Create a new anchor element
    $("<a />", {
      "download": "config.json",
      // Set the href and download attributes of the anchor element
      "href" : "data:application/json," + encodeURIComponent(JSON.stringify(data))
    }).appendTo("body")
    // Remove the anchor element after it has been clicked
    .click(function() {
       $(this).remove()
    })[0].click()
  })

/*
METHOD: $('#imagesWrapper').on('click', 'button',function(e)
DESC: This method is a click event listener that is triggered when a button element within the element with the id "imagesWrapper" is clicked.
INPUT: An event object (e) is passed as an argument.
OUTPUT: Removes the parent element of the button from the DOM, removes the corresponding entry from the images_data object, and calls the changesMade function with an argument of 0.
NOTES: If the button clicked has an id of "editBtn", the event is not triggered.
*/
$('#imagesWrapper').on('click', 'button',function(e) {
    if($(this).attr("id") != "editBtn"){ // Check if the button clicked is not the edit button
        e.stopPropagation();  // Stop the propagation of the event
        image = $(this).parent().parent(); // Get the parent of the button element
        value = image.attr("id"); // Get the id of the parent element

        images_data = images_data.filter(e => e.image_path !== value); // will return ['A', 'C']
        for (var i=0; i<e.length; i++) {  // Iterate through the e object
            if (e.options[i].id == value) // Find the corresponding option element
                e.remove(i);// Remove the option element 
        }
        for (let [key, value] of Object.entries(images_data)) { // Iterate through the images_data object
            if(value.image_path == image){
                value.remove();
            }
        }
        image.remove(); // Remove the parent element from the DOM
        changesMade(0);  // Call the changesMade function with an argument of 0
    }

});


/*
METHOD: change
DESC: Toggles the visibility of an element and updates the "validity_date" property of an object.
INPUT: None (triggered by a change in the element with the ID "ValidityRangeCheckbox")
OUTPUT: Toggles the visibility of the element with the ID "VailidityScheduleDiv" and updates the "validity_date" property of an object.
NOTES: The "validity_date" property is set to the value of the "checked" attribute. The function is initially triggered to ensure the initial visible state matches the value.
*/
$(function () {
    $('#ValidityRangeCheckbox').change(function () {                
       $('#VailidityScheduleDiv').toggle(this.checked);
       changesMade(1);
       // Get the src attribute of the element with the ID "image"
       image = document.getElementById("image").getAttribute("src");
       // Iterate through the "images_data" object and find the object with the matching "image_path" value
       for (let [key, value] of Object.entries(images_data)) {
        if(value.image_path == image){
            value.validity_date = String(document.getElementById('ValidityRangeCheckbox').checked);
            console.log(value);
        }
    }
    }).change(); //ensure visible state matches initially
  });

/*
METHOD: $(document).ready(function()
DESC: This method is a ready event that is triggered when the document is ready.
INPUT: None.
OUTPUT: Initializes a datepicker with specified date format, date validation, and start date update functionality.
NOTES: This method is dependent on the jQuery UI datepicker.
*/
$(document).ready(function() {
    $(function() {
        $( "#start-date" ).datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: function(dateText) {
                image = document.getElementById("image").getAttribute("src");
                for (let [key, value] of Object.entries(images_data)) {
                    if(value.image_path == image){
                        if(dateText.split("-")[2] == value.end_date.split("-")[2]){
                            if(dateText.split("-")[1] == value.end_date.split("-")[1]){
                                if(dateText.split("-")[0] > value.end_date.split("-")[0]){
                                    alert("Error, Start Date cannot be after End Date");
                                    $("#start-date").datepicker("setDate", value.start_date);
                                }else{
                                    value.start_date = dateText;
                                }
                            }else if(dateText.split("-")[1] < value.end_date.split("-")[1]){
                                value.start_date = dateText;
                            }else{
                                alert("Error, Start Date cannot be after End Date");
                                $("#start-date").datepicker("setDate", value.start_date);
                            }
                        }else if(dateText.split("-")[2] < value.end_date.split("-")[2]){
                            value.start_date = dateText;
                        }else{
                            alert("Error, Start Date cannot be after End Date");
                            $("#start-date").datepicker("setDate", value.start_date);
                        }
                    }
                }
            }
        });
    });
})
$(document).ready(function() {
    $(function() {
        $( "#end-date" ).datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: function(dateText) {
                image = document.getElementById("image").getAttribute("src");
                for (let [key, value] of Object.entries(images_data)) {
                    if(value.image_path == image){
                        if(dateText.split("-")[2] == value.start_date.split("-")[2]){
                            if(dateText.split("-")[1] == value.start_date.split("-")[1]){
                                if(dateText.split("-")[0] < value.start_date.split("-")[0]){
                                    alert("Error, End Date cannot be before Start Date");
                                    $("#end-date").datepicker("setDate", value.end_date);
                                }else{
                                    value.end_date = dateText;
                                }
                            }else if(dateText.split("-")[1] > value.start_date.split("-")[1]){
                                value.end_date = dateText;
                            }else{
                                alert("Error, End Date cannot be before Start Date");
                                $("#end-date").datepicker("setDate", value.end_date);
                            }
                        }else if(dateText.split("-")[2] > value.start_date.split("-")[2]){
                            value.end_date = dateText;
                        }else{
                            alert("Error, End Date cannot be before Start Date");
                            $("#end-date").datepicker("setDate", value.start_date);
                        }
                    }
                }
            }
        });
    });
})


/*
METHOD: sortImages
DESC: Sorts images in the draggable list
INPUT: event, ui
OUTPUT: sorted images_data array
NOTES: None
*/
function sortImages(event, ui){
    var tempArray = [];
    $sortableList = $( "#imagesWrapper" );
    var listElements = $sortableList.sortable( "toArray" );
    for(var i in listElements){
        for(var j in images_data){
            // Add element to tempArray if it's image_path matches the list element
            if(listElements[i] == images_data[j].image_path){
                tempArray.push(images_data[j]);
            }
        }
    }
   
    images_data = tempArray; // Set images_data to sorted tempArray
    console.log(images_data);
}

/*
METHOD: Sortable
DESC: Initializes the Sortable function on an element.
INPUT: The element to make sortable and optional parameters.
OUTPUT: Makes the element sortable.
NOTES: In the provided code, the Sortable function is initialized on the element with the class "wrapper", with optional parameters including animation duration, handle elements, and minimum distance to start a drag.
*/
// Select the element with the class "wrapper"
const dragArea = document.querySelector(".wrapper");
// Initialize the Sortable function on the element
new Sortable(dragArea, {
    // Set the animation duration to 350 milliseconds
    animation: 350,
    // Select the handle elements (i.e., elements with the tag 'i')
    handle: 'i',
    // Set the minimum distance to start a drag to 5 pixels
    distance: 5
});

/*
METHOD: sortable
DESC: Initializes the sortable feature on the element with the ID "imagesWrapper".
INPUT: None
OUTPUT: Makes the element with the ID "imagesWrapper" sortable.
NOTES: Calls "changesMade" when the list changes and "sortImages" when sorting stops.
*/
$( "#imagesWrapper" ).sortable({ 
    // Call the "changesMade" function when the list changes
    change: function( event, ui ) { 
        changesMade(1); 
    },
    // Call the "sortImages" function when sorting stops
    stop:  sortImages 
});

// Get the modal element
var modal = document.getElementById("myModal");
// Get the close button element
var span = document.getElementById("close");
// Set the display style of the modal to "none" when the close button is clicked
span.onclick = function() { 
    modal.style.display = "none";
}

main();
