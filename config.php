<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'rental';


$conn = new mysqli($host, $username, $password);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$db_selected = $conn->select_db($database);
if (!$db_selected) {
   
    $create_db_query = "CREATE DATABASE IF NOT EXISTS $database";
    if ($conn->query($create_db_query) === TRUE) {
        
    } else {
        die("Error creating database: " . $conn->error);
    }

    
    $conn->select_db($database);
}


$sql_file_path = __DIR__ . '/attendance.sql';  
$sql = file_get_contents($sql_file_path);


if ($sql) {
  
    if ($conn->multi_query($sql)) {
        
        while ($conn->next_result()) {
            
        }
        // echo "Database and tables created successfully.\n";
    } else {
        die("Error executing SQL script: " . $conn->error);
    }
} else {
    die("Error: Unable to read the file 'create_database.sql'.");
}

?>