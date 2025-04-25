CREATE DATABASE IF NOT EXISTS recovery;
USE recovery;

CREATE TABLE IF NOT EXISTS treatment_centers (
    center_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treatment_programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT,
    name VARCHAR(255),
    type VARCHAR(100),
    FOREIGN KEY (center_id) REFERENCES treatment_centers(center_id)
);

CREATE TABLE IF NOT EXISTS insurance_providers (
    provider_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS center_insurance (
    center_id INT,
    provider_id INT,
    FOREIGN KEY (center_id) REFERENCES treatment_centers(center_id),
    FOREIGN KEY (provider_id) REFERENCES insurance_providers(provider_id),
    PRIMARY KEY (center_id, provider_id)
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT,
    user_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (center_id) REFERENCES treatment_centers(center_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS inquiries (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT,
    user_id INT,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (center_id) REFERENCES treatment_centers(center_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS center_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (center_id) REFERENCES treatment_centers(center_id)
);