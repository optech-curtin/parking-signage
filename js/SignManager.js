/*
File: SignManager.js
Author: Finn Morris
Description: CHANGE THIS FILE to change the sign display paramaters (time between images)
             CHANGE THIS FILE to add images to the sign. Place image in images folder and add line to images variable
*/

var CHANGE_IMAGE_INTERVAL; //10 Minutes
var CHECK_CURRENT_TIME_INTERVAL;//10 Seconds
var CHECK_ALARM_STATUS_INTERVAL;
var images = [];
var image_intervals =[]
var activeFireSigns = [];
var activeFireBuildings = [];
var show_map =[];

//schdeule is in 24 hours (0->0 means map is never on. 8->18 means map ison 8am to 6pm)
var scheduleData = [ ];

//To be run once on startup
function main(){
    setSystemVariables();
    hidePreLoadedImage();
    setTimeout(() => {
        scheduleManager();
		preloadedImages(images);
    }, 1500);
    setTimeout(() => {
        setInterval(scheduleManager, CHECK_CURRENT_TIME_INTERVAL);
     }, 2000);
     writeLogEvent("New sign session started! " + window.location.href);
	 
	if('serviceWorker' in navigator) {
	  let registration;
	  const registerServiceWorker = async () => {
		registration = await navigator.serviceWorker.register('/js/service-worker.js');
	  };
	  registerServiceWorker();
	}
}

async function setSystemVariables() {
    var data = await fetch('/config/config.json')
        .then(data => data.json());
    console.log(data);
	setShowMap(data.show_map);
    setCurrentImages(data.image_data);
    setChangeImageInterval(data.change_image_interval);
    setScheduleData(data.schedule_data);
    setCheckCurrentTimeInterval(data.check_current_time_interval);
    setActiveFireSigns(data.active_fire_signs);
    setActiveFireBuildings(data.active_fire_buildings);
    setAlarmStatusInterval(data.check_alarm_status_interval);
    checkSystemVariabels();
    //writeLogEvent(window.location.href + ", Sign data: " +JSON.stringify(data));


}

function checkOnlineStatus(){
    window.addEventListener('offline', () => console.log('Became offline'));
}

function hidePreLoadedImage(){
    document.getElementById("preloadedImage").style.visibility = 'hidden';
}

function setCurrentImages(images_data){
    images = [];
    images = images_data
    image = images[1].image_path;
}

function setShowMap(signs){
    show_map = []
    for (var i in signs) {
        show_map.push(signs[i]);
    }
}

function setCheckCurrentTimeInterval(data){
    CHECK_CURRENT_TIME_INTERVAL = data;
}

function setChangeImageInterval(data){
    CHANGE_IMAGE_INTERVAL = 5000;
}

function setAlarmStatusInterval(data){
    CHECK_ALARM_STATUS_INTERVAL = data;
}


function setActiveFireSigns(signs){
    activeFireSigns = []
    for (var i in signs) {
        activeFireSigns.push(signs[i]);
    }
}

function setActiveFireBuildings(buildings){
    activeFireBuildings = []
    for (var i in buildings) {
        activeFireBuildings.push(buildings[i]);
    }
}

function setScheduleData(data){
    scheduleData = new Array();
    console.log(data);
    for (let i=0; i < data.length; i+=1) {
        switch(i) {
            case 0:
                var sunday = new Array( data[0][0], data[0][1]);
                scheduleData.push(sunday);
                $('#sunday-start').val(sunday[0]);
                $('#sunday-end').val(sunday[1]);
                break;
            case 1:
                var monday = new Array( data[1][0], data[1][1]);
                scheduleData.push(monday);
                $('#monday-start').val(monday[0]);
                $('#monday-end').val(monday[1]);
                break;
            case 2:
                var tuesday = new Array(data[2][0], data[2][1]);
                scheduleData.push(tuesday);
                $('#tuesday-start').val(tuesday[0]);
                $('#tuesday-end').val(tuesday[1]);
                break;
            case 3:
                var wednesday = new Array( data[3][0], data[3][1]);
                scheduleData.push(wednesday);
                $('#wednesday-start').val(wednesday[0]);
                $('#wednesday-end').val(wednesday[1]);
                break;
            case 4:
                var thursday = new Array( data[4][0], data[4][1]);
                scheduleData.push(thursday);
                $('#thursday-start').val(thursday[0]);
                $('#thursday-end').val(thursday[1]);
                break;
            case 5:
                var friday = new Array(data[5][0], data[5][1]);
                scheduleData.push(friday);
                $('#friday-start').val(friday[0]);
                $('#friday-end').val(friday[1]);
                break;
            case 6:
                var saturday = new Array(data[6][0], data[6][1]);
                scheduleData.push(saturday);
                $('#saturday-start').val(saturday[0]);
                $('#saturday-end').val(saturday[1]);
                break;
            default:
              console.log("ERROR with importing schedule data");
          } 
    }
}

function checkSystemVariabels(){

    var images_print = images.reduce((a, b) => a +'Image: '+ b.image_path +', Interval: ' + b.interval + ' ', '');
    console.log("IMAGES: "+images_print);

    console.log("CHECK_CURRENT_TIME_INTERVAL: "+ CHECK_CURRENT_TIME_INTERVAL);
    console.log("CHECK_ALARM_STATUS_INTERVAL: "+ CHECK_ALARM_STATUS_INTERVAL);

    console.log("ACTIVE_FIRE_SIGNS: "+ activeFireSigns);
    console.log("ACTIVE_FIRE_BUILDINGS: "+ activeFireBuildings);

    console.log("SCHEDULE DATA: "+ scheduleData);
	
	console.log("SHOW MAP: " +show_map);

}

function writeLogEvent(data){
    jQuery.ajax({
        type: "POST",
        url: '/src/server/logEvent.php',
        dataType: 'json',
        data: {
            "message": data
        },
        success: function (obj, textstatus) {
                      if( !('error' in obj) ) {
                          yourVariable = obj.result;
                      }
                      else {
                          console.log(obj.error);
                      }
                }
    });
}





main();
