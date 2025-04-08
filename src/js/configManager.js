import { db } from './firebase-config.js';

// ... existing code ...

async function setSystemVariables() {
    try {
        const dataService = new DataService();
        const data = await dataService.getConfig();
        
        if (data) {
            valid = checkValidData(data);
            if(valid){
                setCurrentImages(data.image_data);
                setScheduleData(data.schedule_data);
                setCheckCurrentTimeInterval(data.check_current_time_interval);
                setActiveFireSigns(data.active_fire_signs);
                setActiveFireBuildings(data.active_fire_buildings);
                setAlarmStatusInterval(data.check_alarm_status_interval);
                checkSystemVariabels();
            } else {
                alert("Error in config file.");
            }
        } else {
            alert("No configuration found.");
        }
    } catch (error) {
        console.error("Error loading configuration:", error);
        alert("Error loading configuration: " + error.message);
    }
    writeLogEvent("System variables set for new session");
}

// ... existing code ...

function writeData() {
    const dataService = new DataService();
    const config = {
        image_data: images_data,
        active_fire_signs: activeFireSigns,
        active_fire_buildings: activeFireBuildings,
        schedule_data: scheduleData,
        check_current_time_interval: CHECK_CURRENT_TIME_INTERVAL,
        check_alarm_status_interval: CHECK_ALARM_STATUS_INTERVAL,
    };

    dataService.saveConfig(config)
        .then(() => {
            console.log("Configuration saved successfully");
            writeLogEvent("Configuration saved successfully");
            setTimeout(() => {
                document.location.reload(true);
            }, 1500);
        })
        .catch(error => {
            console.error("Error saving configuration:", error);
            alert("Error saving configuration: " + error.message);
            writeLogEvent("Error saving configuration: " + error.message);
        });
}

// ... existing code ... 