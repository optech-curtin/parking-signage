import { db } from './firebase-config.js';

// ... existing code ...

async function setSystemVariables() {
    try {
        const dataService = new DataService();
        const data = await dataService.getConfig();
        
        if (data) {
            setShowMap(data.show_map);
            setCurrentImages(data.image_data);
            setChangeImageInterval(data.change_image_interval);
            setScheduleData(data.schedule_data);
            setCheckCurrentTimeInterval(data.check_current_time_interval);
            setActiveFireSigns(data.active_fire_signs);
            setActiveFireBuildings(data.active_fire_buildings);
            setAlarmStatusInterval(data.check_alarm_status_interval);
            checkSystemVariabels();
        } else {
            console.error("No configuration found");
        }
    } catch (error) {
        console.error("Error loading configuration:", error);
    }
}

// ... existing code ... 