import { db } from './firebase-config.js';

// ... existing code ...

async function getConfigImages() {
    try {
        const dataService = new DataService();
        const data = await dataService.getConfig();
        
        if (data && data.image_data != null) {
            allData = data;
            imageData = data.image_data;
        } else {
            alert("Error in config file.");
        }
    } catch (error) {
        console.error("Error loading configuration:", error);
        alert("Config Error: " + error.message);
    }
}

// ... existing code ... 