<?php
$servername = "localhost"; 
$username = "root"; 
$password = ""; 

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create the Rentalsystem database if it doesn't exist
//$sql = "CREATE DATABASE IF NOT EXISTS Rentalsystem";
//if ($conn->query($sql) === TRUE) {
    // Database created or already exists
//} else {
  //  die("Error creating database: " . $conn->error);
//}

// Select the rental database
$conn->select_db("rental");

// Create users table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
)";
if ($conn->query($sql) === TRUE) {
    // Table created or already exists
} else {
    die("Error creating table: " . $conn->error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST["username"];
    $email = $_POST["email"];
    $pass = password_hash($_POST["password"], PASSWORD_BCRYPT); 

    // Check if the email already exists
    $emailCheckSql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($emailCheckSql);

    if ($result->num_rows > 0) {
        // Email already exists, return an error message
        echo "email_exists";
    } else {
        // Insert the user data into the users table
        $sql = "INSERT INTO users (username, email, password) VALUES ('$user', '$email', '$pass')";

        if ($conn->query($sql) === TRUE) {
            
            echo "success";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close();
?>
