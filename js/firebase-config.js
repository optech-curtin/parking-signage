// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBY_n9z2ontYAQ6Vdg7woi0P6F3cEnF_6s",
    authDomain: "parking-signage.firebaseapp.com",
    projectId: "parking-signage",
    storageBucket: "parking-signage.firebasestorage.app",
    messagingSenderId: "554045710944",
    appId: "1:554045710944:web:7a11d5ddabdc5de5671905",
    measurementId: "G-5CPREPSTYK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export services
export { auth, db, storage }; 