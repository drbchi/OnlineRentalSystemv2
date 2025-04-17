<?php
$host = "localhost";
$db = "booking";      
$user = "root";      
$pass = "";      

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $db);

// Check for connection error
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>