const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get environment variables from process.env or .env file
const envVars = {};

// Check if we're running in GitHub Actions
if (process.env.FIREBASE_API_KEY) {
    // Use environment variables from GitHub Actions
    envVars.FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
    envVars.FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
    envVars.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
    envVars.FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
    envVars.FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID;
    envVars.FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;
    envVars.FIREBASE_MEASUREMENT_ID = process.env.FIREBASE_MEASUREMENT_ID;
} else {
    // Read from .env file for local development
    try {
        const envFile = fs.readFileSync('.env', 'utf8');
        envFile.split('\n').forEach(line => {
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    envVars[key.trim()] = value.trim();
                }
            }
        });
    } catch (error) {
        console.error('Error reading .env file:', error);
        process.exit(1);
    }
}

// Read and update the firebase-config.js file
const configPath = path.join(__dirname, 'js', 'firebase-config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace process.env variables with actual values
Object.keys(envVars).forEach(key => {
    if (key.startsWith('FIREBASE_')) {
        const value = envVars[key];
        configContent = configContent.replace(
            new RegExp(`process\\.env\\.${key}`, 'g'),
            `"${value}"`
        );
    }
});

// Write the updated file
fs.writeFileSync(configPath, configContent);

console.log('Firebase configuration updated successfully!');

// Function to replace environment variables in HTML files
function replaceEnvVars(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace environment variables
    content = content.replace(/\${process\.env\.([^}]+)}/g, (match, envVar) => {
        return process.env[envVar] || '';
    });
    
    fs.writeFileSync(filePath, content);
}

// List of HTML files to process
const htmlFiles = [
    'index.html',
    'public/manager/manager.html'
];

// Process each HTML file
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        replaceEnvVars(filePath);
    }
});

console.log('Environment variables replaced in HTML files'); 