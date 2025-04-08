var data = {};
var alarms;
var numOfAlarms;

var fireActive = false; //False by default
CHECK_ALARM_STATUS_INTERVAL = 5000;

/*
METHOD: delay
DESC: Returns a promise that resolves after a specified number of milliseconds.
INPUT: The number of milliseconds to delay (in integer form).
OUTPUT: A promise that resolves after the specified number of milliseconds.
NOTES: The function is marked "async" to allow it to be used with the "await" keyword.
*/

async function delay(ms) {
    // Return a promise that resolves after the specified number of milliseconds
    return await new Promise(resolve => setTimeout(resolve, ms));
}

async function getFreeAlarmCounts(updateSourcesAlarm) {		
	fireActive = false;
    $(document).ready(function(){
        function getData(){
            $.ajax({
                type: 'GET',
                url: '/server/gallagher.php',
                //dataType: 'JSON',
                success: function(data){
                    var active = false;
                    var jsonData = JSON.parse(data);
                    var newArray = jsonData.filter(function (al) {
                        return al.priority == 9
                      });
                      
                      newArray.forEach(alarm => {
                        if((alarm.message).includes("(FireRelay)")){ //Check for fire
                            //Check for correct building
							console.log(alarm.message);
							if(activeFireBuildings.includes('ALL')){
                                active = true;
                            }else{
								for (let i = 0; i < activeFireSigns.length; i++) { 
									if((activeFireSigns[i]).includes((window.location.href).split("/").pop().split(".")[0])){ //Check for correct buildings
										for (let i = 0; i < activeFireBuildings.length; i++) { 
											if((alarm.message).includes(activeFireBuildings[i])){ //Check for correct buildings
												active = true;
											}
										}
									}
								}
							}
                        }
                      });
                      if(active == true){
                        activateFireImage();
                        fireActive = true;
                      }else{
                        fireActive = false;
                      }
                }
            });
        }
        getData();
    });


    if(!data){
        return null;
    }
    return data;
} 

function activateFireImage(){
    if(activeFireSigns.includes((window.location.href).split("/").pop().split(".")[0])){
		if((window.location.href).split("/").pop().split(".")[0] == 'sign6'){
			//Check for current signs
			document.getElementById('displayedImage').src = "/media/images/main_images/Fire_Signage_2.gif";
			console.log("sign6");
		}else{
			//Check for current signs
			document.getElementById('displayedImage').src = "/media/images/main_images/Fire_Signage-1.png";
		}
			document.getElementById('video').style.visibility = "hidden";
			document.getElementById('content').style.display = "none";
			document.getElementById("preloadedImage").style.visibility = 'hidden';
    }
}

function deactivateFireImageToMap(){
        //Check for current signs
		if((window.location.href).split("/").pop().split(".")[0] == 'sign6') {
			//Check for current signs
			document.getElementById('displayedImage').src = "/media/images/main_images/Fire_Signage_2.gif";
			console.log("sign6");
		}else{
			//Check for current signs
			document.getElementById('displayedImage').src = "/media/images/main_images/Fire_Signage-1.png";
		}
		document.getElementById('video').style.visibility = "visible";
        document.getElementById('content').style.display = "";
        document.getElementById("preloadedImage").style.visibility = 'visible';
}

function deactivateFireImageToRolling(){
        if((window.location.href).split("/").pop().split(".")[0] == 'sign6'){
			//Check for current signs
			document.getElementById('displayedImage').src = "/media/images/main_images/Fire_Signage_2.gif";
			console.log("sign6");
		}else{
			//Check for current signs
			document.getElementById('displayedImage').src = "/media/images/main_images/Fire_Signage-1.png";
		}
		document.getElementById('video').style.visibility = "visible";
        document.getElementById('content').style.display = "none";
        document.getElementById("preloadedImage").style.visibility = 'visible';
}



let updateSourcesAlarm = async () => {
    while (true) {

        const alarms = await getFreeAlarmCounts(updateSourcesAlarm); //Get new bay count
        for (let i = 1; i < numOfAlarms; i++) {
            console.log(alarms) //DEBUG
        }
        await delay(CHECK_ALARM_STATUS_INTERVAL); //Delay
    }
}
updateSourcesAlarm();
