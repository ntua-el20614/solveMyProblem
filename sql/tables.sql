DROP DATABASE IF EXISTS name_here;

CREATE DATABASE name_here;
USE name_here;

CREATE TABLE users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    is_admin BOOLEAN DEFAULT FALSE,
    username VARCHAR(255) UNIQUE,
    approved BOOLEAN,
    password_hashed VARCHAR(255)
);
