import { db } from './firebase-config.js';

class ApiService {
    constructor() {
        this.db = db;
        this.apiKey = null;
        this.apiUrl = null;
        
        // Load API configuration from Firestore
        this.loadConfig();
    }

    async loadConfig() {
        try {
            const doc = await this.db.collection('config').doc('api').get();
            if (doc.exists) {
                const config = doc.data();
                this.apiKey = config.gallagherApiKey;
                this.apiUrl = config.gallagherApiUrl;
            }
        } catch (error) {
            console.error('Error loading API config:', error);
        }
    }

    async getGallagherAlarms() {
        try {
            if (!this.apiKey || !this.apiUrl) {
                await this.loadConfig();
            }

            const response = await fetch(`${this.apiUrl}?fields=time,message`, {
                headers: {
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching Gallagher alarms:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService(); 