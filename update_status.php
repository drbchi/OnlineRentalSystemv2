<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

date_default_timezone_set('Asia/Kathmandu');

$host = 'localhost';
$dbname = 'rental';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id or status']);
        exit;
    }

    $roomId = $data['id'];
    $status = $data['status'] === 'APPROVED' ? 'accepted' : 'declined'; // Map 'APPROVED' to 'accepted', 'DENIED' to 'declined'
    // $status = strtolower($data['status']); // will be 'approved' or 'denied'


    if (!in_array($status, ['accepted', 'declined'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status']);
        exit;
    }

    // if (!in_array($status, ['approved', 'denied'])) {
    //     http_response_code(400);
    //     echo json_encode(['error' => 'Invalid status']);
    //     exit;
    // }
    
    $stmt = $pdo->prepare("UPDATE properties SET status = ? WHERE id = ?");
    $stmt->execute([$status, $roomId]);

    $stmt = $pdo->prepare("SELECT * FROM properties WHERE id = ?");
    $stmt->execute([$roomId]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        http_response_code(404);
        echo json_encode(['error' => 'Room not found']);
        exit;
    }

    echo json_encode($room);
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'General error: ' . $e->getMessage()]);
}
?>