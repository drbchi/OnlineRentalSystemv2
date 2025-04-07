<?php
// Database connection details
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

// Handle login form submission
if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Prevent SQL injection
    $email = mysqli_real_escape_string($conn, $email);
    $password = mysqli_real_escape_string($conn, $password);

    // Query to check if the user exists
    $sql = "SELECT * FROM users WHERE email = '$email'";  
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        
        // Verify the password using password_verify()
        if (password_verify($password, $row['password'])) {
            // Password is correct, successful login
            echo "<script>alert('Login successful!'); window.location.href = 'dashboard.php';</script>";
        } else {
            // Invalid password
            echo "<script>alert('Invalid email or password!');</script>";
        }
    } else {
        // User not found
        echo "<script>alert('Invalid email or password!');</script>";
    }
}

$conn->close();
?>
