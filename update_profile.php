<?php
header('Content-Type: application/json');

$mysqli = new mysqli('localhost', 'root', '', 'rental'); 
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'DB connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['email'])) {
    $email = $mysqli->real_escape_string($_GET['email']);
    $result = $mysqli->query("SELECT username, email FROM users WHERE email = '$email'");

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(['user' => $user]);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'User not found']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'update') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['originalEmail'], $data['fullName'], $data['newEmail'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
        exit;
    }

    $originalEmail = $mysqli->real_escape_string($data['originalEmail']);
    $fullName = $mysqli->real_escape_string($data['fullName']);
    $newEmail = $mysqli->real_escape_string($data['newEmail']);

    $updateQuery = "UPDATE users SET username = '$fullName', email = '$newEmail' WHERE email = '$originalEmail'";
    if ($mysqli->query($updateQuery)) {
        echo json_encode(['message' => 'Profile updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Update failed']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['message' => 'Invalid request']);
?>
