<?php
header('Content-Type: application/json');
date_default_timezone_set('Asia/Kathmandu');

$host = 'localhost';
$dbname = 'rental';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM properties WHERE status = 'pending'");
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    

    echo json_encode($rooms);
} catch (PDOException $e) {
    // Output error for debugging
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['error' => 'General error: ' . $e->getMessage()]);
}
?>