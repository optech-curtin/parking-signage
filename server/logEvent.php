<?php
require_once './env.php';

// Initialize Firebase Admin SDK
require __DIR__ . '/vendor/autoload.php';
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;

$factory = (new Factory)
    ->withServiceAccount(__DIR__ . '/firebase-credentials.json')
    ->withDatabaseUri(env('FIREBASE_DATABASE_URL'));

$database = $factory->createDatabase();
$auth = $factory->createAuth();

// Get the message and Firebase ID token from POST data
$message = $_POST['message'] ?? '';
$idToken = $_POST['idToken'] ?? '';

// Verify the Firebase ID token
try {
    $verifiedToken = $auth->verifyIdToken($idToken);
    $userEmail = $verifiedToken->claims()->get('email') ?? 'unknown';

    // Create log entry
    $logEntry = [
        'timestamp' => (new DateTime("now", new DateTimeZone('Australia/Perth')))->format('Y-m-d H:i:s'),
        'message' => $message,
        'user' => $userEmail
    ];

    // Push to Firebase
    $database->getReference('logs')->push($logEntry);
    echo json_encode(['status' => 'success', 'message' => 'Log entry created']);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication failed: ' . $e->getMessage()]);
}
?> 
