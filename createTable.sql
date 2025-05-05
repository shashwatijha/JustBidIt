CREATE DATABASE  IF NOT EXISTS `aos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aos`;
-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (arm64)
--
-- Host: localhost    Database: aos
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bid_history`
--

DROP TABLE IF EXISTS `bid_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `bid_amount` decimal(10,2) DEFAULT NULL,
  `auto_bid` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bid_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `bid_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid_history`
--

LOCK TABLES `bid_history` WRITE;
/*!40000 ALTER TABLE `bid_history` DISABLE KEYS */;
INSERT INTO `bid_history` VALUES (1,7,7,3000.00,0,'2025-05-01 20:15:16'),(2,9,14,700.00,0,'2025-05-01 16:54:46'),(3,10,14,1000.00,0,'2025-05-01 17:03:49'),(4,10,7,1001.00,1,'2025-05-01 17:05:02'),(5,11,14,1000.00,0,'2025-05-01 17:13:27'),(6,11,7,1001.00,1,'2025-05-01 17:14:06'),(7,11,8,1510.00,0,'2025-05-01 17:15:29'),(8,7,7,3000.00,0,'2025-05-01 17:29:01'),(9,12,8,400.00,0,'2025-05-01 19:32:48');
/*!40000 ALTER TABLE `bid_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bids` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `bid_amount` decimal(10,2) NOT NULL,
  `auto_bid` tinyint(1) DEFAULT '0',
  `max_limit` decimal(10,2) DEFAULT NULL,
  `increment` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bids`
--

LOCK TABLES `bids` WRITE;
/*!40000 ALTER TABLE `bids` DISABLE KEYS */;
INSERT INTO `bids` VALUES (1,1,0,1850.00,0,NULL,NULL,'2025-04-25 10:00:00'),(2,1,0,1900.00,1,2000.00,50.00,'2025-04-26 14:00:00'),(3,2,0,1150.00,0,NULL,NULL,'2025-04-26 09:30:00'),(4,2,0,1180.00,1,1250.00,20.00,'2025-04-27 11:45:00'),(5,3,0,1250.00,0,NULL,NULL,'2025-04-27 12:00:00'),(6,3,0,1300.00,0,NULL,NULL,'2025-04-28 08:15:00'),(7,4,0,1550.00,1,1700.00,30.00,'2025-04-28 09:00:00'),(9,7,7,3000.00,0,NULL,NULL,'2025-05-01 16:10:34'),(10,9,14,700.00,0,NULL,NULL,'2025-05-01 16:47:23'),(11,10,14,1000.00,0,NULL,NULL,'2025-05-01 16:47:23'),(12,10,7,1001.00,1,1500.00,25.00,'2025-05-01 16:47:23'),(13,11,14,1000.00,0,NULL,NULL,'2025-05-01 17:11:20'),(14,11,7,1001.00,1,1500.00,25.00,'2025-05-01 17:11:20'),(15,11,8,1510.00,0,NULL,NULL,'2025-05-01 17:11:20'),(16,7,8,1000.00,0,NULL,NULL,'2025-05-01 17:11:20'),(17,12,8,400.00,0,NULL,NULL,'2025-05-01 17:11:20');
/*!40000 ALTER TABLE `bids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_reps`
--

DROP TABLE IF EXISTS `customer_reps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_reps` (
  `rep_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`rep_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_reps`
--

LOCK TABLES `customer_reps` WRITE;
/*!40000 ALTER TABLE `customer_reps` DISABLE KEYS */;
INSERT INTO `customer_reps` VALUES (5,'admin','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'),(6,'cr1','b80e1708501e7931e51dcc67aabff84675821c55a054e6978095e2497d926f69'),(7,'cr2','7f5ab3fb97cdd75a3c4e02bf46f74f0c8e9700b383205c43a9a1abebd7c1b20c'),(8,'cr3','77141ab7baacfb622a18b3dcfb0ca36ebe6ad2b3fc7d1fb52eb11d4588e6351a'),(9,'cr5','ae5b4b5b50b5cfa407dbfe7e8b1d4cafc0a1922f50c058f4907f2503784f6423'),(13,'cr6','793cb499e474daf4e6e47c2070167d3a949f06373e91b80cd42c98edc2f0d45a'),(15,'cr10','0225a50b915b18a053e2af44083637aa8f3c32635183a80544366caf83b50602');
/*!40000 ALTER TABLE `customer_reps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `question` text NOT NULL,
  `answer` text,
  `answered` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,1,'How can I reset my password?','Go to your profile settings and click \"Reset Password\".',1),(2,2,'What is the refund policy?','Refunds are available within 14 days of purchase.',1),(3,3,'How do I update my email address?','Navigate to account settings and edit your email field.',1),(4,4,'Can I change my username?','Usernames cannot be changed after account creation.',1),(5,5,'Is there a mobile app?','Yes, our app is available on both iOS and Android.',1),(6,6,'How do I delete my account?','Contact Customer Care',1),(7,7,'What payment methods do you accept?',NULL,0),(8,8,'How can I contact support directly?',NULL,0),(9,9,'Do you offer discounts for students?',NULL,0),(10,10,'Where can I view my transaction history?',NULL,0),(11,1,'How do I place a return?',NULL,0),(12,1,'Test','test',1);
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (2,14,'You\'ve won the auction for Xiaomi 10T!','winner','2025-05-01 16:55:03'),(3,14,'You were outbid on Xiaomi 20T.','outbid','2025-05-01 17:05:02'),(4,14,'You were outbid on Xiaomi 30T.','outbid','2025-05-01 17:14:06'),(5,14,'You were outbid on Xiaomi 30T.','outbid','2025-05-01 17:15:29'),(6,7,'Your auto bid max limit was exceeded on Xiaomi 30T.','auto_bid_limit_exceeded','2025-05-01 17:15:29'),(7,8,'You\'ve won the auction for Xiaomi 30T!','winner','2025-05-01 17:17:00'),(8,8,'You were outbid on test3.','outbid','2025-05-01 17:29:01');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_requests`
--

DROP TABLE IF EXISTS `password_reset_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_requests`
--

LOCK TABLES `password_reset_requests` WRITE;
/*!40000 ALTER TABLE `password_reset_requests` DISABLE KEYS */;
INSERT INTO `password_reset_requests` VALUES (5,'cr1','2025-04-29 09:14:41','resolved'),(6,'cr1','2025-04-29 09:18:01','resolved'),(7,'cr2','2025-04-29 09:58:25','resolved'),(8,'cr2','2025-04-29 09:59:20','resolved'),(9,'cr3','2025-04-29 10:55:10','resolved'),(10,'cr2','2025-04-29 10:55:22','resolved'),(11,'cr1','2025-04-30 15:29:39','resolved'),(12,'cr2','2025-04-30 15:29:50','resolved'),(13,'cr5','2025-05-01 13:44:06','resolved');
/*!40000 ALTER TABLE `password_reset_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(100) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `storage` varchar(255) DEFAULT NULL,
  `ram` varchar(255) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `screen_size` varchar(100) DEFAULT NULL,
  `reserve_price` decimal(10,2) DEFAULT NULL,
  `closing_date` datetime DEFAULT NULL,
  `image_filename` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT '0',
  `bid_price` decimal(10,2) DEFAULT '0.00',
  `winner_notified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Galaxy S23 Ultra',1999.99,'Samsung','512GB','16GB','Silver','14\"',1800.00,'2025-05-10 23:59:00','3.jpg','2025-05-01 11:26:38',9,0.00,0),(2,'iPhone 14 Pro Max',1299.99,'Apple','256GB','8GB','White','13.3\"',1100.00,'2025-05-11 23:59:00','2.jpg','2025-05-01 11:26:38',9,0.00,0),(3,'OnePlus 11',1499.99,'OnePlus','512GB','16GB','Black','13.5\"',1200.00,'2025-05-12 23:59:00','6.png','2025-05-01 11:26:38',9,0.00,0),(4,'Pixel 7 Pro',1699.99,'Google','1TB','32GB','Black','14\"',1500.00,'2025-05-13 23:59:00','4.jpg','2025-05-01 11:26:38',9,0.00,0),(5,'test',1000.00,'apple','128GB','16GB','black','6',1500.00,'2025-05-01 11:39:00','2.jpg','2025-05-01 11:36:01',NULL,NULL,0),(7,'test3',3000.00,'Samsung','10','8','Pink','7',4979.00,'2025-05-09 15:19:00','4.jpg','2025-05-01 15:04:52',7,3000.00,0),(8,'test2',1000.00,'test','12','12','i','2',5000.00,'2025-05-01 15:54:00','4.jpg','2025-05-01 15:04:52',NULL,NULL,0),(9,'Xiaomi 10T',500.00,'Xiaomi','100GB','32GB','Silver','7inch',595.00,'2025-05-01 16:55:00','4.jpg','2025-05-01 16:47:23',14,700.00,1),(10,'Xiaomi 20T',698.00,'Xiaomi','100GB','32GB','red','7 inch',1100.00,'2025-05-01 17:07:00','1.jpg','2025-05-01 16:47:23',NULL,1001.00,1),(11,'Xiaomi 30T',700.00,'Xiaomi','10','8','Pink','6',1100.00,'2025-05-01 17:17:00','6.png','2025-05-01 17:11:20',8,1510.00,1),(12,'Nokia 305',350.00,'Nokia','3GB','2GB','White','2inches',400.00,'2025-05-01 21:31:00','nokia.jpeg','2025-05-01 17:11:20',8,400.00,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `account_type` varchar(20) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `business_name` varchar(100) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'t@test3.com','tes','scrypt:32768:8:1$fvYEo2GdG4iZMf0Z$d1068d0c5feddb2d8ad1a284a16eb3c990857d6794a2e715cf3b5b5dc97c4c64c6d9757c0c09f034e1e22c4723c30138e941df396771d52267f45c5cd01693e2','2025-04-22 22:52:42','personal','t1234',NULL,'AQ'),(7,'jhabshashwati@gmail.com','ShashwatiJha','scrypt:32768:8:1$JLxzsY8v0TBiz9zB$53cf63a0250181aa5f58a648c2eec3f4ff5170703d609fd445601c888f5d0098a16c557e634abaf7f15fc57da8637b5b0602ed0c9e996efdd6ee24480e5cd5f8','2025-04-30 20:58:13','personal','Shashwati Jha',NULL,'IN'),(8,'jwick@gmail.com','JWick','scrypt:32768:8:1$oV2cCa0SO8Zg5lDr$7decbcbe618edf226111021bf5522388ee8876b2d5e0110e907b98fb1a534f8bb95394ce480d17c77948968e4dd2f29e06a802bcfd7fefdb4619dedc30d971d9','2025-04-30 23:16:29','personal','John WIck',NULL,'US'),(9,'Sdevi@gmail.com','Sdevi','scrypt:32768:8:1$OPTWUuXOXdfrnWuu$0a2008b171458318f55c4b56f90544753009fc78062a33100eabbf713766082842444115c394e26d0af1274dff6bd4a19943e7f7a5220ced25f652a5d082fbed','2025-04-30 23:21:50','personal','SriDevi',NULL,'IO'),(10,'test@gmail.com','testUser','scrypt:32768:8:1$pbzSkc3qG72D3KfO$0b80fa109e967f3302e763268eef67c0ff50f86577f7646a7a7be0c9d036bf00dbd1a13bb0253facd48add65338e8e40bacba8d6f06fa1402b2d4a6e670a33b2','2025-04-30 23:24:10','personal','Test User',NULL,'AL'),(11,'jhashashwati99@gmail.com','JhaS','scrypt:32768:8:1$5w2AKBJfu9rwzQQu$70008c309e846b52929daf869a86c05f7e35f782e145a0237f1a8fdddf4f918866d81c9497c38580b2a27879822c8cd040dd5658876072926b71136a336781de','2025-05-01 12:26:12','personal','Shashwati Jha',NULL,'US'),(12,'z.afreen0830@gmail.com','ZAfreen','scrypt:32768:8:1$fyvA7eNWw9BWlxz6$8c217ba9335ebdd9c164cdb4e648c35f2a5ced11ca91886a52f3f3178df1082ac0c144b5c40fa33ae66ba72b1f1c647701e690c934d596a7d2598d04fe79fb13','2025-05-01 15:05:58','personal','Zeba Afreen',NULL,'AE'),(13,'Samn@gmail.com','SamN','Peenya1!','2025-05-01 20:34:09','personal','Sam Newt',NULL,'BQ'),(14,'ef508@scarletmail.rutgers.edu','EShah','scrypt:32768:8:1$hScDXI5qHBqlOJ6E$d170320dc94b7e042157454025ced05bde04fdeeaaa335c9e4781c9ab938e147199c0c5671cd52ed348c4c81ed5412f7bf5913b7aed035bd0f60a7fd103260eb','2025-05-01 20:49:09','personal','Ellysha Shah',NULL,'PK');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-05 10:28:23
