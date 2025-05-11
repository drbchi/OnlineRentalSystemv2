<?php

include "../apis/config.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$all_rooms = [];

// Step 1: Fetch from room table (static)
$sql1 = "SELECT title, description, price, roomtype, capacity, location, images FROM room";
$result1 = $conn->query($sql1);

if ($result1) {
    while ($row = $result1->fetch_assoc()) {
        $row['price'] = floatval($row['price']);
        $row['capacity'] = preg_replace('/[^0-9]/', '', $row['capacity']); // keep only number
        $all_rooms[] = $row;
    }
}

// Step 2: Fetch from properties table (only accepted)
$sql2 = "SELECT name AS title, description, price, room_type AS roomtype, capacity, location, image AS images FROM properties WHERE status = 'accepted'";
$result2 = $conn->query($sql2);

if ($result2) {
    while ($row = $result2->fetch_assoc()) {
        $row['price'] = floatval($row['price']);
        $row['capacity'] = strval($row['capacity']);

        // Normalize roomtype to match frontend filters
        $type = strtolower(trim($row['roomtype']));
        if ($type === 'single') $row['roomtype'] = 'singleroom';
        elseif ($type === 'double') $row['roomtype'] = 'doubleroom';
        elseif ($type === 'family') $row['roomtype'] = 'familyroom';
        else $row['roomtype'] = ucfirst($type); // e.g., 'suite', 'penthouse' remain as-is

        $all_rooms[] = $row;
    }
}

echo json_encode(["status" => 200, "data" => $all_rooms]);
$conn->close();

?>