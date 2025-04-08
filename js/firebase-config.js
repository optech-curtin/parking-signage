import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: "AIzaSyBY_n9z2ontYAQ6Vdg7woi0P6F3cEnF_6s" || window.FIREBASE_API_KEY,
    authDomain: "parking-signage.firebaseapp.com" || window.FIREBASE_AUTH_DOMAIN,
    projectId: "parking-signage" || window.FIREBASE_PROJECT_ID,
    storageBucket: "parking-signage.firebasestorage.app" || window.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: "554045710944" || window.FIREBASE_MESSAGING_SENDER_ID,
    appId: "1:554045710944:web:7a11d5ddabdc5de5671905" || window.FIREBASE_APP_ID,
    measurementId: "G-5CPREPSTYK" || window.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services
export { auth, db, storage }; 