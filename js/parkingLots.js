var parkingLots;
var numOfSensors;
var features = new Array();
var data = {};


//refresh rate for updating numbers
var refreshInterval = 10000.00; //10 Seconds

async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
}

async function getFreeBayCounts() {		
    $(document).ready(function(){
        $.ajax({
            type: 'GET',
            url: '/server/parking.php',
            //dataType: 'JSON',
            success: function(data){
				console.log(data);
                parkingLots = JSON.parse(data);
				//parkingLots = (data);
                numOfSensors = Object.keys(parkingLots).length;		
            },
			error: function(){
				console.log('Error');
			  }
        });
		
    });


    if(!parkingLots){
        return null;
    }
    return parkingLots;

} 

let updateSources = async () => {
    while (true) {
        const parkingLots = await getFreeBayCounts(); //Get new bay count
        if(parkingLots != null){
            //console.log(parkingLots);
            if(parkingLots == null){
                writeLogEvent(window.location.href + "Parking Data is NULL" );
            }
            for (let i = 1; i < numOfSensors; i++) {
                if(document.getElementById(parkingLots[i]["zone"]) != null){
                    document.getElementById(parkingLots[i]["zone"]).innerHTML = parkingLots[i]["vacant"];
                    if(parkingLots[i]["zone"] == "PI1"){
                        document.getElementById("PI1").innerHTML = parseInt(parkingLots[i]["vacant"]) + parseInt(parkingLots[i+1]["vacant"])+""
    
                    }else if(parkingLots[i]["zone"] == "PH1"){
                       var H1vac = parseInt(parkingLots[i]["vacant"]);
                    }else if(parkingLots[i]["zone"] == "PH4"){
                        document.getElementById("PH4").innerHTML = parseInt(parkingLots[i]["vacant"]) + H1vac+""
                    }
                }
            };
        }
        await delay(refreshInterval); //Delay

    }
}
let connectionInit = async () => {
    const parkingLots = await getFreeBayCounts(); //Get new bay count
}


connectionInit(); //Initialise the changes made text to be green
setTimeout(() => {
    updateSources();//Initialise the changes made text to be green
 }, 500);
