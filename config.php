<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'recovery_db');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");

// Function to sanitize input
function sanitize($input) {
    global $conn;
    return $conn->real_escape_string(strip_tags(trim($input)));
}

// Function to handle database errors
function handleError($error) {
    error_log($error);
    return ['success' => false, 'message' => 'An error occurred. Please try again later.'];
}
?>