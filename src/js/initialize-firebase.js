import { db } from './firebase-config.js';

const initialConfig = {
    image_data: [
        {
            image_path: "images/PARKAMWhite On Campus vert_TEXT.jpg",
            interval: "6000"
        },
        {
            image_path: "images/5405UM_PG Expo Campaign Digital_On campus digital screens  24.jpg",
            interval: "10000"
        },
        {
            image_path: "images/smart-sign-virus-distancing-3.jpg",
            interval: "10000"
        },
        {
            image_path: "images/Fire Signage-1.png",
            interval: "10000"
        }
    ],
    active_fire_signs: ["sign2", "sign1"],
    active_fire_buildings: ["BEN 431", "BEN 418", "BEN 420", "BEN 433"],
    schedule_data: [
        ["0:00", "0:00"],
        ["8:00", "18:00"],
        ["8:00", "18:00"],
        ["8:00", "18:00"],
        ["8:00", "18:00"],
        ["1:00", "1:30"],
        ["0:00", "0:00"]
    ],
    check_current_time_interval: "10000",
    check_alarm_status_interval: "5000",
    show_map: true
};

async function initializeFirebase() {
    try {
        // Check if config already exists
        const configDoc = await db.collection('config').doc('main').get();
        
        if (!configDoc.exists) {
            // Initialize with default config
            await db.collection('config').doc('main').set(initialConfig);
            console.log('Firebase configuration initialized successfully');
        } else {
            console.log('Configuration already exists');
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

// Run initialization
initializeFirebase(); 