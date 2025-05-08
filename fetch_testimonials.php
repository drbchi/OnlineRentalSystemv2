<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "rental";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM testimonials";
$result = $conn->query($sql);

$testimonials = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $testimonials[] = $row;
    }
}
echo json_encode($testimonials);
$conn->close();
?>
