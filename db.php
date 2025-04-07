<?php
$servername = "localhost";
$username = "root";  
$password = "";      
$database = "rental"; 

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}


$conn->set_charset("utf8");

?>
