<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "rental";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully to database: $dbname<br>";

// Test INSERT: Add a new user
$test_email = "testuser@example.com";
$test_password = password_hash("test123", PASSWORD_DEFAULT);
$sql_insert = "INSERT INTO users (username, email, password) VALUES ('testuser', '$test_email', '$test_password')";
if ($conn->query($sql_insert) === TRUE) {
    echo "New user inserted successfully.<br>";
} else {
    echo "Error inserting user: " . $conn->error . "<br>";
}

// Test UPDATE: Update the password for hridaya@gmail.com
$email = "hridaya@gmail.com";
$new_password = password_hash("testpassword123", PASSWORD_DEFAULT);
$sql_update = "UPDATE users SET password = '$new_password' WHERE email = '$email'";
if ($conn->query($sql_update) === TRUE) {
    if ($conn->affected_rows > 0) {
        echo "Password updated successfully for $email.<br>";
    } else {
        echo "No rows affected. Email not found.<br>";
    }
} else {
    echo "Error updating password: " . $conn->error . "<br>";
}

$conn->close();
?>