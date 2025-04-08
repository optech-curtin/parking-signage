import { db, storage } from './firebase-config.js';

class DataService {
    constructor() {
        this.db = db;
        this.storage = storage;
    }

    // Parking Data Operations
    async getParkingData() {
        try {
            const snapshot = await this.db.collection('parking').get();
            const parkingLots = {};
            
            snapshot.forEach(doc => {
                parkingLots[doc.id] = doc.data();
            });
            
            return parkingLots;
        } catch (error) {
            console.error('Error getting parking data:', error);
            throw error;
        }
    }

    async updateParkingData(lotId, data) {
        try {
            await this.db.collection('parking').doc(lotId).set(data, { merge: true });
        } catch (error) {
            console.error('Error updating parking data:', error);
            throw error;
        }
    }

    // Configuration Operations
    async getConfig() {
        try {
            const doc = await this.db.collection('config').doc('main').get();
            if (!doc.exists) {
                console.log('No configuration found');
                return null;
            }
            return doc.data();
        } catch (error) {
            console.error('Error getting config:', error);
            throw error;
        }
    }

    async saveConfig(config) {
        try {
            await this.db.collection('config').doc('main').set(config);
            return true;
        } catch (error) {
            console.error('Error saving config:', error);
            throw error;
        }
    }

    // Image Operations
    async uploadImage(file) {
        try {
            const storageRef = this.storage.ref();
            const imageRef = storageRef.child(`images/${file.name}`);
            await imageRef.put(file);
            return await imageRef.getDownloadURL();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    async deleteImage(imageUrl) {
        try {
            const imageRef = this.storage.refFromURL(imageUrl);
            await imageRef.delete();
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    // Logging
    async logEvent(message) {
        try {
            await this.db.collection('logs').add({
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                user: firebase.auth().currentUser?.email || 'system'
            });
        } catch (error) {
            console.error('Error logging event:', error);
            throw error;
        }
    }
}

export default DataService; 