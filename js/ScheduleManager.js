var currentPos = 0; //Start at 1st image
var showMap = true; // map shown by default
var prevStateMap = true; // 0 for map 1 for images
var image;
var timer = 0;
var scheduleTime = 0;
var mapTimes2 =0;
var newImg;
var imagesArray = new Array();

function preloadedImages(images, index){

    index = index || 0;
    if (images && images.length > index) {
        if(images[index].image_path.includes("images")){ //Images
            var img = new Image ();
            img.src = images[index].image_path;
            imagesArray[index] = img;
			preloadedImages(images, index + 1);
        }else{ //Videos
            imagesArray[index] = images[index].image_path;
            preloadedImages(images, index+1);
        }
    }
}

function scheduleManager(){
    var date = new Date();
    var dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc...
    var mapTimes = scheduleData[dayOfWeek];

    if (mapTimes[0] && mapTimes[1]){

        var mapStart = new Date();
        mapStart.setHours(mapTimes[0].split(":")[0]);
        mapStart.setMinutes(mapTimes[0].split(":")[1]);
        
        var mapFinish = new Date();
        mapFinish.setHours(mapTimes[1].split(":")[0]);
        mapFinish.setMinutes(mapTimes[1].split(":")[1]);

        var time = new Date();
        time.setHours(time.getHours());
        time.setMinutes(time.getMinutes());

    // check that there are schedules properties
    if(mapStart > mapFinish){
        console.log(time, mapStart, mapFinish)
        showMap = (time >= mapStart && time > mapFinish);
    }else{
        showMap = (mapStart <= time && time < mapFinish);
    }
        //set variable to show or hide map
    }
	
	if(fireActive == true){
		prevStateMap = false;
	}

    if(fireActive == false){ //Check for fire alarm
        //No fire alarm:
        //Block to run when the map should be shown
        if(showMap){
            if(prevStateMap == false){//Previous check not was map
                prevStateMap = true;
                console.log("Map is showing"); //Debug
                writeLogEvent(window.location.href + " Map is Showing");
                document.getElementById('content').style.display = ""; //Show the numbers
                document.body.style.backgroundImage = "";  //Set background image to default (mapimage)
                document.getElementById("preloadedImage").style.visibility = 'hidden'; //Hide preloaded image
                document.getElementById("displayedImage").style.visibility = 'hidden'; //Hide displayed image
                document.getElementById("video").style.visibility = 'hidden'; //Hide video
                if(timer){
                    clearTimeout(timer);
                    timer = 0;
                }
            }
        }else{ //Block to run when the other images should show
            if(prevStateMap == true){ //Previous check was map
				preloadedImages(images);
                prevStateMap = false;
                console.log("Map is not showing"); //Debug
                writeLogEvent(window.location.href + " Rolling Images are showing");
                document.getElementById('content').style.display = "none";
                document.getElementById("preloadedImage").style.visibility = 'hidden';
                var newImage =  document.getElementById("displayedImage");
                newImage.src = image;
                newImage.addEventListener("load",function() { //Once new image is loaded, hide the prev image.
                    newImage.style.visibility = 'visible';
                }, false);
				if (imagesArray.length == 0) {
					console.log("Array Not Loaded");
					console.log(imagesArray);
				}else{
					console.log("Array Loaded");
					console.log(imagesArray);
				}
				changeImage();
            }
        }
    }
}

//This function runs independant of all other functions and will change the image every 10 minutes
function changeImage() {
    //Set prevImage image to current image and wait for load
    var prevImage =  document.getElementById("preloadedImage");
    var mainImage =  document.getElementById("displayedImage");
    var video =  document.getElementById("video");

    if(fireActive == false){ //Check for fire alarm
        currentPos = verifyImage(currentPos);
        newSrc = images[currentPos].image_path; //JSON Array
        newImg = imagesArray[currentPos]; //Cached images array

        if (++currentPos >= images.length){
            currentPos = 0;
        }

        for (let [key, value] of Object.entries(images)) {
            if(value.image_path == images[currentPos].image_path){
                CHANGE_IMAGE_INTERVAL = value.interval;
				//console.log("Image Interval: " + value.interval);
            }
        }
        if(!showMap){
            if(newSrc.includes("videos")){//Is video...Not loaded from cache -- TODO
                video.addEventListener('loadeddata', function() {
                    video.style.visibility = 'visible';
                    mainImage.style.visibility = 'hidden';
                    prevImage.style.visibility = 'hidden';
                 }, false);
                video.src = newImg;
            }else{  //Images loaded from local cache
                 mainImage.onload = function() {
                    mainImage.style.visibility = 'visible';
                    prevImage.style.visibility = 'hidden';
                    video.style.visibility = 'hidden';
                };
                mainImage.src = newImg.src;
                //writeLogEvent(window.location.href + " Image Changed to: " + image + " with timout "+CHANGE_IMAGE_INTERVAL+"ms");
            }
        }
    }
    timer = setTimeout(changeImage, CHANGE_IMAGE_INTERVAL);
}

function verifyImage(currentPos){
    var tempPos = currentPos;
    const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var now = new Date();
    var startDateStr = images[currentPos].start_date;
    var endDateStr = images[currentPos].end_date;
	
	const startDate = new Date(startDateStr.split("-")[2] + "-" + startDateStr.split("-")[1] + "-" + startDateStr.split("-")[0]);
	const endDate = new Date(endDateStr.split("-")[2] + "-" + endDateStr.split("-")[1] + "-" + endDateStr.split("-")[0]);	

    while(!(images[currentPos].signs.includes((window.location.href).split("/").pop().split(".")[0]))){
        if (++currentPos >= images.length){
            currentPos = 0;
        }
    }
    //Check Start Time
    if((images[currentPos].schedule).split(",")[0] > (("0" + now.getHours()).slice(-2) +":"+now.getMinutes())){
        ++currentPos;
        console.log("Start time is after current time");
    }
    //Check End Time
    if((images[currentPos].schedule).split(",")[1] < (("0" + now.getHours()).slice(-2) +":"+now.getMinutes())){
        console.log((images[currentPos].schedule).split(",")[1]);
        console.log((("0" + now.getHours()).slice(-2) +":"+now.getMinutes()));
        ++currentPos;
    }
    //Check Date
    if(images[currentPos].validity_date == "true"){
        if(images[currentPos].dotw.includes(weekday[now.getDay()])){
            if(now < startDate || now > endDate){
				++currentPos;
            }
        }else{
            ++currentPos;
        }
    }if (currentPos > images.length){
        currentPos = 0;
    }
    if(tempPos == currentPos){
        finalPos = currentPos
    }else{
        verifyImage(currentPos)
    }
    return finalPos;
}


function writeLogEvent(data){
    jQuery.ajax({
        type: "POST",
        url: '/server/logEvent.php',
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
