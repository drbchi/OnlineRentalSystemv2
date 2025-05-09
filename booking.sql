-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 23, 2025 at 10:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL,
  `people` int(11) NOT NULL,
  `check_in_time` time NOT NULL,
  `check_out_time` time NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  -- `room_type` varchar(50) NOT NULL DEFAULT 'Standard',
  `user_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `price` decimal(10,2) NOT NULL DEFAULT 0.00
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `first_name`, `last_name`, `phone`, `region`, `checkin`, `checkout`, `people`, `check_in_time`, `check_out_time`, `payment_method`, `room_type`, `user_id`, `created_at`, `price`) VALUES
(10, 'Prajita', 'Prajapati', '9810011562', 'usa', '2025-03-29', '2025-03-31', 2, '17:40:00', '17:45:00', 'Bank Account', 'Family', 'guest', '2025-03-29 11:52:28', 0.00),
(11, 'Prajita', 'Prajapati', '9810011562', 'UK', '2025-03-31', '2025-04-01', 2, '18:40:00', '18:45:00', 'Bank Account', 'Family', 'guest', '2025-03-29 11:55:54', 0.00),
(12, 'ululu', 'lelele', '2380073435', 'usa', '2025-04-17', '2025-04-19', 0, '22:10:00', '00:00:00', 'Bank Account', 'Suite', 'guest', '2025-04-17 12:46:27', 0.00),
(13, 'luniva', 'Shrestha', '12345667812', 'Nepal', '2025-04-17', '2025-04-19', 0, '22:10:00', '00:00:00', 'Esewa', 'Single', 'guest', '2025-04-17 15:24:03', 0.00),
(14, 'Unisha', 'Mahara', '9851100815', 'nepal', '2025-04-23', '2025-04-25', 0, '13:06:00', '03:09:00', 'Bank Account', 'Deluxe', 'guest', '2025-04-23 07:21:46', 0.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
