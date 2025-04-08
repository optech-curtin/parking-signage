<?php
require_once './env.php';

// Initialize Firebase Admin SDK
require __DIR__ . '/vendor/autoload.php';
use Kreait\Firebase\Factory;

$factory = (new Factory)
    ->withServiceAccount(__DIR__ . '/firebase-credentials.json')
    ->withDatabaseUri(env('FIREBASE_DATABASE_URL'));

$database = $factory->createDatabase();

try {
    // Get parking data from Firebase
    $snapshot = $database->getReference('parking')->getValue();
    
    if ($snapshot === null) {
        // Initialize with empty data if no data exists
        $defaultData = array_fill(0, 30, [
            "zone" => "",
            "vacant" => 0,
            "total" => 0
        ]);
        
        $database->getReference('parking')->set($defaultData);
        echo json_encode($defaultData);
    } else {
        echo json_encode($snapshot);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

