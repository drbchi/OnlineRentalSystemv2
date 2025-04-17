<?php
// update_bookings.php

header('Content-Type: application/json');

// Decode the JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'], $input['status'])) {
    echo json_encode(['success' => false, 'message' => 'Missing ID or status.']);
    exit;
}

$bookingId = $input['id'];
$status = $input['status'];
$comment = isset($input['comment']) ? $input['comment'] : null;

// 🔧 Database credentials
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'booking';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Ensure the table has `status` and `comment` columns!
$sql = "UPDATE booking SET status = ?, comment = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssi", $status, $comment, $bookingId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Booking updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
