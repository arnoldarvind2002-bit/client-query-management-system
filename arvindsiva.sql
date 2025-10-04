-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for arvindsiva
CREATE DATABASE IF NOT EXISTS `arvindsiva` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `arvindsiva`;

-- Dumping structure for table arvindsiva.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(10) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `city` varchar(70) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `role` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table arvindsiva.admins: ~2 rows (approximately)
INSERT INTO `admins` (`id`, `email`, `hashed_password`, `created_at`, `phone`, `birthdate`, `city`, `country`, `role`) VALUES
	(3, 'admin@gmail.com', 'd9e26c4f727142372bd283443ce36551:100000:2fbb76f0bebdbf80b9c77f2c7e20fe5965737f419770263bcea471047690ee7e', '2025-09-28 11:40:18', '947593464', '2025-09-10', 'NAMAKKAL', 'America', 'admin'),
	(4, 'arivandsiva@gmail.com', '30b2a114682ab9b876e2a496a1d9583a:100000:a090fb59a44cadc904a297bfc9ae4a5fdc8e83f00f8227b8b67fab0fc31876ee', '2025-09-30 17:18:22', '9363110806', '2025-09-17', 'namakkal', 'India', 'admin');

-- Dumping structure for table arvindsiva.attachments
CREATE TABLE IF NOT EXISTS `attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_data` longblob DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table arvindsiva.attachments: ~0 rows (approximately)

-- Dumping structure for table arvindsiva.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table arvindsiva.comments: ~0 rows (approximately)

-- Dumping structure for table arvindsiva.tickets
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `assigned_to` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table arvindsiva.tickets: ~0 rows (approximately)
INSERT INTO `tickets` (`id`, `user_id`, `subject`, `description`, `status`, `priority`, `assigned_to`, `created_at`, `updated_at`) VALUES
	(11, 15, 'Bug Report', 'Tab focus jumps incorrectly.', 'open', 'medium', 'joshuaoneill@example.net', '2025-10-04 07:15:32', '2025-10-04 07:15:32'),
	(12, 16, 'Bug Report', 'Form validation not working properly.', 'open', 'high', 'edward91@example.net', '2025-10-04 07:16:12', '2025-10-04 07:16:12'),
	(13, 17, 'Account Suspension', 'Need help lifting restrictions.', 'open', 'high', 'cookmason@example.org', '2025-10-04 07:16:28', '2025-10-04 07:16:28'),
	(14, 18, 'Data Export', 'Need monthly data dump in CSV.', 'open', 'low', 'wtaylor@example.com', '2025-10-04 07:16:45', '2025-10-04 07:16:45'),
	(15, 19, 'UI Feedback', 'Icons not intuitive.', 'open', 'high', 'rmoore@example.net', '2025-10-04 07:16:58', '2025-10-04 07:16:58'),
	(16, 20, 'Technical Support', 'Graphs not rendering properly.', 'open', 'low', 'carrollamanda@example.net', '2025-10-04 07:17:12', '2025-10-04 07:17:12'),
	(17, 21, 'Account Suspension', 'How do I appeal a suspension?', 'open', 'medium', 'chavezlouis@example.com', '2025-10-04 07:17:24', '2025-10-04 07:17:24'),
	(18, 22, 'Billing Problem', 'Promo code was not applied.', 'open', 'high', 'monica93@example.net', '2025-10-04 07:17:40', '2025-10-04 07:17:40'),
	(19, 23, 'Payment Failure', 'EMI option not available anymore.', 'open', 'high', 'stephaniejackson@example.net', '2025-10-04 07:17:54', '2025-10-04 07:17:54'),
	(20, 24, 'Feature Request', 'Suggesting calendar integration.', 'open', 'medium', 'gregory24@example.com', '2025-10-04 07:18:41', '2025-10-04 07:18:41');

-- Dumping structure for table arvindsiva.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(10) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `city` varchar(70) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `role` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table arvindsiva.users: ~19 rows (approximately)
INSERT INTO `users` (`id`, `email`, `hashed_password`, `created_at`, `phone`, `birthdate`, `city`, `country`, `role`) VALUES
	(6, 'customer@gmail.com', 'ea573508b2d5b8c21d782caeaf1a6d9d:100000:2d5d2e0a6359d8f7e3405d05066e2e48ecc1d765d1d6bf43993894c286631502', '2025-09-28 11:39:21', '4643754754', '2025-09-09', 'NAMAKKAL', 'India', 'client'),
	(7, 'admin1@gmail.com', '0f9b87550cf7020fabdd0d66d773dd5e:100000:729b67c27ebc63d8e90366270f98f4287db74908c852e56331eda4bf4cb2233e', '2025-09-28 11:46:10', '9363110806', '2025-09-10', 'NAMAKKAL', 'Country', 'client'),
	(8, 'vishnuvarshan34@gmail.com', 'e1dde11268be9abcfca2a33b4b616cc1:100000:c50c09e80bbe30796131d3266e7b59eecfa0ff1e5130cc66ab95d3a8ffcc9e51', '2025-09-30 17:17:25', '9363110806', '2025-09-17', 'namakkal', 'Japan', 'client'),
	(9, 'vishnuvarshan0@gmail.com', '', '2025-09-30 17:36:59', '9363110806', NULL, '', '', 'client'),
	(10, 'demo@pteroca.com', '', '2025-09-30 17:52:09', '2143253251', NULL, '', '', 'client'),
	(11, 'vishnuvarshanhxh06@gmail.com', '', '2025-09-30 17:53:56', '3423432432', NULL, '', '', 'client'),
	(12, 'vishnu@gmail.com', '', '2025-10-01 04:54:09', '234567893', NULL, '', '', 'client'),
	(13, 'jfbdsuigh@gmail.com', '71a28b5fb8eb9b70884a7e90a5797d68:100000:f83370fad6aa55152b9d0a00c14cab30fcddcca74a23c0a6fd5f95c5525d3c77', '2025-10-01 17:36:27', '0464375475', '2025-10-22', 'tknfosdng', 'Nepal', 'client'),
	(14, 'vishnuvarshan@gmail.com', '', '2025-10-03 21:25:00', '214326433', NULL, '', '', 'client'),
	(15, 'joshuaoneill@example.net', '', '2025-10-04 07:15:32', '6638686049', NULL, '', '', 'client'),
	(16, 'edward91@example.net', '', '2025-10-04 07:16:12', '6369365581', NULL, '', '', 'client'),
	(17, 'cookmason@example.org', '', '2025-10-04 07:16:28', '2686615523', NULL, '', '', 'client'),
	(18, 'wtaylor@example.com', '', '2025-10-04 07:16:45', '4753393384', NULL, '', '', 'client'),
	(19, 'rmoore@example.net', '', '2025-10-04 07:16:58', '8523755943', NULL, '', '', 'client'),
	(20, 'carrollamanda@example.net', '', '2025-10-04 07:17:12', '5114031913', NULL, '', '', 'client'),
	(21, 'chavezlouis@example.com', '', '2025-10-04 07:17:24', '5120344433', NULL, '', '', 'client'),
	(22, 'monica93@example.net', '', '2025-10-04 07:17:40', '9214400119', NULL, '', '', 'client'),
	(23, 'stephaniejackson@example.net', '', '2025-10-04 07:17:54', '3033595411', NULL, '', '', 'client'),
	(24, 'gregory24@example.com', '', '2025-10-04 07:18:41', '4191042037', NULL, '', '', 'client');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
