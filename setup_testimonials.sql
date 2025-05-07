-- Create the database
CREATE DATABASE IF NOT EXISTS rental;

-- Use the database
USE rental;

-- Create the testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_picture VARCHAR(255) NOT NULL,
    room_image VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    stars INT CHECK (stars BETWEEN 1 AND 5)
);

-- Insert sample data
INSERT INTO testimonials (profile_picture, room_image, comment, stars)
VALUES 
('../images/person1.jpg', '../images/room1.jpg', 'Great stay! Very comfortable and clean.', 4),
('../images/person2.jpg', '../images/bestbookedplace5.jpg', 'Amazing experience, will visit again!', 5),
('../images/person3.jpg', '../images/bestbookedplace4.jpg', 'Decent place but could be better.', 3);
