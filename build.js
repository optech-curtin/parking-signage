const fs = require('fs');
const path = require('path');

// Read the .env file
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};

// Parse the .env file
envFile.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim();
        }
    }
});

// Read the firebase-config.js file
const configPath = path.join(__dirname, 'src', 'js', 'firebase-config.js');
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