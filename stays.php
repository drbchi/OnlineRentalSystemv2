<?php
include "../apis/config.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$inputData = json_decode(file_get_contents('php://input'), true);

// Fetch all required columns except 'id'
$sql = "SELECT title, description, price, roomtype, capacity, location, images FROM room";
$result = $conn->query($sql);

if ($result) {
    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }
    echo json_encode(["status" => 200, "data" => $rooms]);
} else {
    echo json_encode(["status" => 500, "message" => "Error fetching rooms: " . $conn->error]);
}

$conn->close();
?>