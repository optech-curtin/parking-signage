import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

class AuthService {
    constructor() {
        this.auth = auth;
        this.db = db;
        this.user = null;
        
        // Listen for auth state changes
        onAuthStateChanged(this.auth, user => {
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
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
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
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            
            // Store additional user data in Firestore
            await this.db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                role: role,
                createdAt: new Date()
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
            await signOut(this.auth);
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