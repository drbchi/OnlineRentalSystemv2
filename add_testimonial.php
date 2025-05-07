<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "rental";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['profile_picture'], $data['room_image'], $data['comment'], $data['stars'])) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$profile = $conn->real_escape_string($data['profile_picture']);
$room = $conn->real_escape_string($data['room_image']);
$comment = $conn->real_escape_string($data['comment']);
$stars = intval($data['stars']);

if ($stars < 1 || $stars > 5) {
    echo json_encode(["success" => false, "message" => "Stars must be between 1 and 5"]);
    exit;
}

$sql = "INSERT INTO testimonials (profile_picture, room_image, comment, stars) VALUES ('$profile', '$room', '$comment', $stars)";
if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}

$conn->close();
?>
