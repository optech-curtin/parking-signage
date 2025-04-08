import { auth, db } from './firebase-config.js';

class AuthService {
    constructor() {
        this.auth = auth;
        this.db = db;
        this.user = null;
        
        // Listen for auth state changes
        this.auth.onAuthStateChanged(user => {
            this.user = user;
            if (user) {
                console.log('User logged in:', user.email);
            } else {
                console.log('User logged out');
            }
        });
    }

    // Login with email and password
    async login(email, password) {
        try {
            console.log('Attempting login with:', email);
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful:', userCredential.user.email);
            return userCredential.user;
        } catch (error) {
            console.error('Login error details:', {
                code: error.code,
                message: error.message,
                email: email
            });
            throw error;
        }
    }

    // Register new user
    async register(email, password, role = 'user') {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            
            // Store additional user data in Firestore
            await this.db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return userCredential.user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Logout
    async logout() {
        try {
            await this.auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Check if user is admin
    async isAdmin() {
        if (!this.user) return false;
        
        const userDoc = await this.db.collection('users').doc(this.user.uid).get();
        return userDoc.exists && userDoc.data().role === 'admin';
    }
}

export const authService = new AuthService(); 