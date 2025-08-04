-- MariaDB dump 10.19  Distrib 10.6.17-MariaDB, for osx10.19 (arm64)
--
-- Host: localhost    Database: blackpanther_db
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `resource_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `resource_id` (`resource_id`),
  KEY `ix_action_id` (`id`),
  CONSTRAINT `action_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` VALUES (1,1,'2025-04-14 21:41:22','2025-04-14 21:41:22',NULL,'list',1),(2,1,'2025-04-14 21:41:54','2025-04-14 21:41:54',NULL,'create',1),(3,1,'2025-04-14 21:42:05','2025-04-14 21:42:05',NULL,'edit',1),(4,1,'2025-04-14 21:42:13','2025-04-14 21:42:13',NULL,'show',1),(5,1,'2025-04-14 22:05:50','2025-04-14 22:05:50',NULL,'list',2),(6,1,'2025-04-14 22:05:59','2025-04-14 22:05:59',NULL,'create',2),(7,1,'2025-04-14 22:06:35','2025-04-14 22:06:35',NULL,'edit',2),(8,1,'2025-04-14 22:06:45','2025-04-14 22:06:45',NULL,'show',2),(9,1,'2025-04-17 21:40:53','2025-05-09 08:23:44',NULL,'list',3),(10,1,'2025-04-17 21:46:05','2025-05-09 08:23:10',NULL,'list',4),(11,1,'2025-04-17 21:52:45','2025-04-17 21:52:45',NULL,'list',5),(12,1,'2025-04-17 21:56:18','2025-04-17 21:56:18',NULL,'create',5),(13,1,'2025-04-17 21:56:27','2025-04-17 21:56:27',NULL,'edit',5),(14,1,'2025-04-17 22:37:04','2025-04-17 22:37:04',NULL,'delete',5),(20,1,'2025-04-20 12:28:01','2025-05-08 08:24:24',NULL,'list',14),(21,1,'2025-04-20 12:28:01','2025-04-20 12:28:01',NULL,'create',14),(22,1,'2025-04-20 12:28:01','2025-04-20 12:28:01',NULL,'edit',14),(23,1,'2025-04-20 12:28:01','2025-04-20 12:28:01',NULL,'show',14),(24,1,'2025-04-20 12:28:01','2025-04-20 12:28:01',NULL,'delete',14),(25,1,'2025-04-20 12:30:59','2025-04-20 12:30:59',NULL,'create-action',5),(26,1,'2025-04-20 12:30:59','2025-04-20 12:30:59',NULL,'edit-action',5),(27,1,'2025-04-20 12:30:59','2025-04-20 12:30:59',NULL,'delete-action',5),(33,1,'2025-04-21 08:38:20','2025-04-21 08:38:20',NULL,'show-action',5),(36,1,'2025-04-21 20:54:32','2025-04-21 20:54:32',NULL,'authorize',2),(37,1,'2025-04-22 22:42:49','2025-04-22 22:42:49',NULL,'list',15),(40,1,'2025-05-10 17:19:11','2025-05-10 17:19:14','2025-05-10 17:19:14','ccccc',4),(41,1,'2025-05-12 21:14:19','2025-05-12 21:14:19',NULL,'list',16),(42,1,'2025-05-12 21:14:19','2025-05-12 21:14:19',NULL,'create',16),(43,1,'2025-05-12 21:14:19','2025-05-12 21:14:19',NULL,'edit',16),(44,1,'2025-05-12 21:14:19','2025-05-12 21:14:19',NULL,'show',16),(45,1,'2025-05-12 21:14:19','2025-05-12 21:14:19',NULL,'delete',16),(46,1,'2025-05-14 08:49:49','2025-05-14 08:49:49',NULL,'delete',1),(47,1,'2025-05-14 21:10:39','2025-05-14 21:10:39',NULL,'list',17),(48,1,'2025-05-14 21:10:39','2025-05-14 21:10:39',NULL,'create',17),(49,1,'2025-05-14 21:10:39','2025-05-14 21:10:39',NULL,'edit',17),(50,1,'2025-05-14 21:10:39','2025-05-14 21:10:39',NULL,'show',17),(51,1,'2025-05-14 21:10:39','2025-05-14 21:10:39',NULL,'delete',17),(52,1,'2025-05-14 22:10:24','2025-05-14 22:10:24',NULL,'delete',2),(53,1,'2025-05-28 22:21:09','2025-05-28 22:21:09',NULL,'update_password',1),(54,1,'2025-06-01 12:23:10','2025-06-01 12:23:10',NULL,'list',18),(55,1,'2025-06-01 12:23:10','2025-06-01 12:23:10',NULL,'create',18),(56,1,'2025-06-01 12:23:10','2025-06-01 12:23:10',NULL,'edit',18),(57,1,'2025-06-01 12:23:10','2025-06-01 12:23:10',NULL,'show',18),(58,1,'2025-06-01 12:23:10','2025-06-01 12:23:10',NULL,'delete',18),(59,1,'2025-06-03 22:03:02','2025-06-03 22:03:02',NULL,'list',19),(60,1,'2025-06-03 22:03:02','2025-06-03 22:03:02',NULL,'create',19),(61,1,'2025-06-03 22:03:02','2025-06-03 22:03:02',NULL,'edit',19),(62,1,'2025-06-03 22:03:02','2025-06-03 22:03:02',NULL,'show',19),(63,1,'2025-06-03 22:03:02','2025-06-08 19:41:19',NULL,'delete',19),(64,1,'2025-06-08 20:59:06','2025-06-08 20:59:06',NULL,'show',5),(65,1,'2025-06-14 15:30:15','2025-06-14 15:30:15',NULL,'list',20),(66,1,'2025-06-14 15:30:15','2025-06-14 15:30:15',NULL,'create',20),(67,1,'2025-06-14 15:30:15','2025-06-14 15:30:15',NULL,'edit',20),(68,1,'2025-06-14 15:30:15','2025-06-14 15:30:15',NULL,'show',20),(69,1,'2025-06-14 15:30:15','2025-06-14 15:30:15',NULL,'delete',20);
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachment_file`
--

DROP TABLE IF EXISTS `attachment_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment_file` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `size` int(11) DEFAULT NULL,
  `extension` varchar(255) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  KEY `ix_attachment_file_id` (`id`),
  CONSTRAINT `attachment_file_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachment_file`
--

LOCK TABLES `attachment_file` WRITE;
/*!40000 ALTER TABLE `attachment_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachment_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `department` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `sort` int(11) DEFAULT 0,
  `leader` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dept_unique` (`path`),
  KEY `parent_id` (`parent_id`),
  KEY `ix_dept_id` (`id`),
  KEY `dept_path_IDX` (`path`) USING BTREE,
  CONSTRAINT `department_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `department` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,1,'2025-04-13 21:05:08','2025-06-02 21:10:06',NULL,'Company1',0,NULL,',1,',NULL),(2,1,'2025-04-13 21:06:59','2025-05-17 12:07:03',NULL,'Dept1',0,NULL,',1,2,',1),(3,1,'2025-04-13 21:07:16','2025-05-17 12:07:03',NULL,'Dept1.1',0,NULL,',1,2,3,',2),(4,1,'2025-04-13 21:37:11','2025-05-17 12:07:03',NULL,'Dept1.2',0,NULL,',1,2,4,',2),(7,1,'2025-04-13 22:31:28','2025-05-17 12:07:03',NULL,'333333',0,NULL,',1,2,4,7,',4),(8,1,'2025-04-13 22:33:36','2025-05-17 12:07:03',NULL,'pppp',0,NULL,',1,2,3,8,',3),(9,1,'2025-05-15 06:59:13','2025-05-17 12:08:00',NULL,'Dept2',0,NULL,',1,9,',1),(10,1,'2025-05-15 22:04:56','2025-06-03 21:38:51','2025-06-03 21:38:51','dddddd',0,NULL,',1,2,3,10,',3),(11,1,'2025-05-15 22:07:56','2025-05-17 12:07:03',NULL,'test',0,NULL,',1,2,3,11,',3),(12,1,'2025-05-15 22:49:16','2025-05-17 12:07:03','2025-05-15 22:49:20','pppppppp',0,NULL,',1,2,3,11,12,',11),(13,1,'2025-05-15 22:49:25','2025-05-17 12:07:03',NULL,'wwwww',0,NULL,',1,2,3,11,13,',11),(14,1,'2025-05-15 22:49:58','2025-05-17 12:29:55',NULL,'Dept3',0,NULL,',1,14,',1),(15,1,'2025-05-16 08:29:36','2025-05-17 12:29:55',NULL,'22222',0,NULL,',1,9,15,',9),(16,1,'2025-05-16 21:23:22','2025-05-17 12:29:55','2025-05-16 21:23:32','Sub1',0,NULL,',1,16,',1),(17,1,'2025-05-16 21:51:36','2025-05-17 12:29:55',NULL,'3333',0,NULL,',1,9,15,17,',15),(18,1,'2025-05-17 09:28:14','2025-05-17 13:23:41',NULL,'Company2',0,NULL,',18,',NULL),(19,1,'2025-05-17 09:31:46','2025-05-17 13:23:41',NULL,'Dept1',0,NULL,',18,19,',18),(20,1,'2025-05-17 12:03:03','2025-05-17 13:23:41',NULL,'dept1.1',0,NULL,',18,19,20,',19),(21,1,'2025-05-17 12:32:56','2025-05-17 12:32:56',NULL,'Company3',0,NULL,',21,',NULL),(22,1,'2025-05-17 12:34:15','2025-05-17 12:34:15',NULL,'dept1',0,NULL,',21,22,',21),(23,1,'2025-05-17 12:35:01','2025-05-17 12:35:01',NULL,'dept1.1',0,NULL,',21,22,23,',22),(24,1,'2025-05-17 12:35:15','2025-05-17 12:35:15',NULL,'dept1.2',0,NULL,',21,22,24,',22),(25,1,'2025-05-17 13:28:10','2025-05-17 13:28:10',NULL,'dept2',0,NULL,',21,25,',21),(26,1,'2025-05-18 14:40:22','2025-05-18 14:40:26','2025-05-18 14:40:26','ffffffff',0,NULL,',1,2,3,11,13,26,',13),(27,1,'2025-05-20 08:46:00','2025-05-20 08:46:00',NULL,'rd',0,NULL,',21,22,23,27,',23),(28,1,'2025-05-21 07:13:48','2025-05-21 07:14:00',NULL,'DEV3',0,NULL,',18,19,20,28,',20),(29,1,'2025-05-28 21:30:10','2025-05-28 21:30:10',NULL,'rd2',0,NULL,',21,22,23,29,',23);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enum`
--

DROP TABLE IF EXISTS `enum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enum` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_enum_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enum`
--

LOCK TABLES `enum` WRITE;
/*!40000 ALTER TABLE `enum` DISABLE KEYS */;
INSERT INTO `enum` VALUES (1,1,'2025-06-01 12:40:39','2025-06-03 21:37:39',NULL,'User Gender','SYS_USER_GENDER','User Gender');
/*!40000 ALTER TABLE `enum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enum_item`
--

DROP TABLE IF EXISTS `enum_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enum_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `sort` int(11) NOT NULL,
  `enum_id` bigint(20) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enum_id` (`enum_id`),
  KEY `ix_enum_item_id` (`id`),
  CONSTRAINT `enum_item_ibfk_1` FOREIGN KEY (`enum_id`) REFERENCES `resource` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enum_item`
--

LOCK TABLES `enum_item` WRITE;
/*!40000 ALTER TABLE `enum_item` DISABLE KEYS */;
INSERT INTO `enum_item` VALUES (115,1,'2025-06-22 11:15:54','2025-07-30 07:24:05',NULL,'Male','male',1,1,NULL),(116,1,'2025-06-22 11:15:54','2025-07-30 07:24:05',NULL,'Female','female',2,1,NULL),(117,0,'2025-06-22 11:15:54','2025-07-30 07:24:05',NULL,'Unknow','unknow',3,1,'');
/*!40000 ALTER TABLE `enum_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter`
--

DROP TABLE IF EXISTS `parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parameter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_system` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `ix_parameter_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parameter`
--

LOCK TABLES `parameter` WRITE;
/*!40000 ALTER TABLE `parameter` DISABLE KEYS */;
INSERT INTO `parameter` VALUES (1,1,'2025-06-03 22:10:30','2025-06-10 21:18:39',NULL,'Enable user registration','sys.account.register_user','1','',1);
/*!40000 ALTER TABLE `parameter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `position`
--

DROP TABLE IF EXISTS `position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `position` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_position_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `position`
--

LOCK TABLES `position` WRITE;
/*!40000 ALTER TABLE `position` DISABLE KEYS */;
INSERT INTO `position` VALUES (1,1,'2025-05-14 21:42:26','2025-06-02 21:03:40',NULL,'CEO','ceo','ceo'),(2,1,'2025-05-14 21:46:44','2025-06-22 11:14:08',NULL,'Employee','employee','employee'),(3,1,'2025-06-21 22:31:05','2025-06-21 22:31:09','2025-06-21 22:31:09','test','test','test'),(4,1,'2025-06-29 21:55:31','2025-06-29 21:55:31',NULL,'CFO','cfo',''),(5,1,'2025-06-29 21:55:40','2025-06-29 21:55:40',NULL,'COO','coo','');
/*!40000 ALTER TABLE `position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource`
--

DROP TABLE IF EXISTS `resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_resource_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource`
--

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
INSERT INTO `resource` VALUES (1,1,'2025-04-14 21:41:22','2025-04-14 21:41:22',NULL,'user','user',''),(2,1,'2025-04-14 22:05:41','2025-04-14 22:05:41',NULL,'role','role',NULL),(3,1,'2025-04-17 21:40:25','2025-04-17 21:40:25',NULL,'system_manager','system_manager',NULL),(4,1,'2025-04-17 21:45:49','2025-05-08 07:37:31',NULL,'dashboard','dashboard',NULL),(5,1,'2025-04-17 21:52:32','2025-04-20 07:34:22',NULL,'resource','resource',NULL),(14,1,'2025-04-20 12:28:01','2025-05-20 08:44:33',NULL,'department','department',NULL),(15,1,'2025-04-22 22:42:49','2025-05-07 08:25:23',NULL,'policy','policy',NULL),(16,1,'2025-05-12 21:14:19','2025-05-12 21:14:24','2025-05-12 21:14:24','ddd','ddd',NULL),(17,1,'2025-05-14 21:10:39','2025-05-14 21:10:39',NULL,'position','position',NULL),(18,1,'2025-06-01 12:23:10','2025-06-01 12:23:10',NULL,'enum','enum',NULL),(19,1,'2025-06-03 22:03:02','2025-06-08 20:36:46',NULL,'parameter','parameter',NULL),(20,1,'2025-06-14 15:30:15','2025-06-14 15:30:15',NULL,'toy','toy',NULL);
/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_role_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,1,'2025-04-13 14:35:59','2025-04-22 21:36:10',NULL,'Administrator','admin',NULL),(2,1,'2025-04-13 14:46:32','2025-06-08 21:24:10',NULL,'Data Entry','guest','Insert and update records'),(3,1,'2025-04-14 13:03:17','2025-05-14 21:45:10',NULL,'Auditor','auditor','Read and audit access logs'),(4,1,'2025-04-14 13:03:53','2025-06-03 21:28:32',NULL,'Data Analyst','data_analyst','Read-only access to data'),(5,1,'2025-04-22 22:59:10','2025-05-14 21:45:10',NULL,'Viewer','viewer',NULL);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_action_link`
--

DROP TABLE IF EXISTS `role_action_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_action_link` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) DEFAULT NULL,
  `action_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `action_id` (`action_id`),
  KEY `ix_role_action_link_id` (`id`),
  CONSTRAINT `role_action_link_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `role_action_link_ibfk_2` FOREIGN KEY (`action_id`) REFERENCES `action` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_action_link`
--

LOCK TABLES `role_action_link` WRITE;
/*!40000 ALTER TABLE `role_action_link` DISABLE KEYS */;
INSERT INTO `role_action_link` VALUES (1,1,1),(2,1,2),(4,1,3),(5,1,9),(6,1,10),(19,1,5),(20,1,6),(21,1,7),(22,1,8),(23,1,36),(130,1,37),(140,1,20),(141,1,21),(142,1,22),(143,1,23),(144,1,24),(145,1,4),(146,4,37),(147,4,20),(148,4,21),(149,4,22),(150,4,23),(151,4,24),(152,4,11),(153,4,12),(154,4,13),(155,4,14),(156,4,25),(157,4,26),(158,4,27),(159,4,33),(160,4,10),(161,4,9),(162,4,5),(163,4,6),(164,4,7),(165,4,8),(166,4,36),(167,4,1),(168,4,2),(169,4,3),(170,4,4),(172,2,20),(173,2,21),(174,2,22),(175,2,23),(176,2,24),(177,2,10),(178,2,9),(226,3,11),(227,3,12),(228,3,13),(229,3,14),(230,3,25),(231,3,26),(232,3,27),(233,3,33),(234,5,37),(235,5,20),(236,5,21),(237,5,22),(238,5,23),(239,5,24),(240,5,11),(241,5,12),(242,5,13),(243,5,14),(244,5,25),(245,5,26),(246,5,27),(247,5,33),(248,5,10),(249,5,9),(250,5,5),(251,5,6),(252,5,7),(253,5,8),(254,5,36),(255,5,1),(256,5,2),(257,5,3),(258,5,4),(259,3,37),(260,3,10),(261,3,9),(262,1,11),(271,1,47),(272,1,48),(273,1,49),(274,1,50),(275,1,51),(276,1,52),(277,1,53),(278,2,47),(279,2,48),(280,2,49),(281,2,50),(282,2,51),(283,1,54),(284,1,55),(285,1,56),(286,1,57),(287,1,58),(288,1,46),(290,1,60),(291,1,61),(292,1,62),(293,1,63),(294,1,12),(295,1,13),(296,1,25),(297,3,64),(298,1,64),(299,1,14),(300,1,26),(301,1,27),(302,1,33),(303,1,59),(304,1,65),(305,1,66),(306,1,67),(307,1,68),(308,1,69);
/*!40000 ALTER TABLE `role_action_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_login_log`
--

DROP TABLE IF EXISTS `sys_login_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_login_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `trace_id` varchar(255) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `ip` varchar(255) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `os` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `login_time` datetime NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_sys_login_log_id` (`id`),
  CONSTRAINT `sys_login_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_login_log`
--

LOCK TABLES `sys_login_log` WRITE;
/*!40000 ALTER TABLE `sys_login_log` DISABLE KEYS */;
INSERT INTO `sys_login_log` VALUES (86,1,'2025-06-12 20:54:32','2025-06-12 20:54:32',NULL,'c158f6214490482b911e53648b22b9cf','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-12 20:54:32',1),(87,1,'2025-06-19 21:43:41','2025-06-19 21:43:41',NULL,'7a18603c5a184dbcb660a96702713c74','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-19 21:43:41',1),(88,1,'2025-06-21 20:51:30','2025-06-21 20:51:30',NULL,'1c7c932a22144c11a40287d9ca9db15d','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-21 20:51:30',1),(89,1,'2025-06-21 20:53:06','2025-06-21 20:53:06',NULL,'eeded61997b84902a1d6352c75ed4028','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-21 20:53:06',1),(90,1,'2025-06-21 20:54:48','2025-06-21 20:54:48',NULL,'2513cc6880144b2c82d956b20a067842','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-21 20:54:48',1),(91,1,'2025-06-21 21:02:28','2025-06-21 21:02:28',NULL,'cc6f1ebb73a646c2a7730bf7098ca374','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-21 21:02:28',1),(92,1,'2025-06-21 21:02:40','2025-06-21 21:02:40',NULL,'f2100862bf1247fa9e6fc608982f2fdd','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-21 21:02:40',1),(93,1,'2025-06-22 15:35:40','2025-06-22 15:35:40',NULL,'0949f0e7692543cea245ddd9adbdb4da','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-22 15:35:40',1),(94,1,'2025-06-22 19:34:16','2025-06-22 19:34:16',NULL,'53c233a33b604f82b400ea4df68046dd','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 137.0.0','PC','登录成功','2025-06-22 19:34:16',1),(95,1,'2025-07-02 20:49:50','2025-07-02 20:49:50',NULL,'333a467f54874064a6b48861e719a234','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 138.0.0','PC','登录成功','2025-07-02 20:49:50',1),(96,1,'2025-07-13 15:19:11','2025-07-13 15:19:11',NULL,'7e1d77797df44820b59b79d10a903db2','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 138.0.0','PC','登录成功','2025-07-13 15:19:11',1),(97,1,'2025-07-27 07:19:48','2025-07-27 07:19:48',NULL,'48344cdb45574accb26150bcf2467f03','admin',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','Mac OS X 10.15.7','Chrome 138.0.0','PC','登录成功','2025-07-27 07:19:48',1);
/*!40000 ALTER TABLE `sys_login_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_operation_log`
--

DROP TABLE IF EXISTS `sys_operation_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_operation_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `trace_id` varchar(255) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `method` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `os` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  `args` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`args`)),
  `code` varchar(255) NOT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `cost_time` float NOT NULL,
  `operation_time` datetime NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_sys_operation_log_id` (`id`),
  CONSTRAINT `sys_operation_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1702 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_operation_log`
--

LOCK TABLES `sys_operation_log` WRITE;
/*!40000 ALTER TABLE `sys_operation_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_operation_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `toy`
--

DROP TABLE IF EXISTS `toy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `toy` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `tetx1` varchar(255) NOT NULL,
  `tetx2` varchar(255) NOT NULL,
  `textarea1` varchar(255) DEFAULT NULL,
  `switch1` tinyint(1) DEFAULT NULL,
  `checkbox1` tinyint(1) DEFAULT NULL,
  `select1` tinyint(4) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `position_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_toy_id` (`id`),
  KEY `toy_department_FK` (`department_id`),
  KEY `toy_position_FK` (`position_id`),
  CONSTRAINT `toy_department_FK` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`),
  CONSTRAINT `toy_position_FK` FOREIGN KEY (`position_id`) REFERENCES `position` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toy`
--

LOCK TABLES `toy` WRITE;
/*!40000 ALTER TABLE `toy` DISABLE KEYS */;
INSERT INTO `toy` VALUES (1,1,'2025-06-20 21:51:30','2025-08-01 20:41:27',NULL,'test11111','dddd333','ddd',1,1,2,28,4),(2,1,'2025-06-20 22:31:12','2025-08-01 20:41:55',NULL,'test2222','2222','222222',0,0,3,27,2),(3,1,'2025-06-20 22:53:17','2025-08-01 20:41:47',NULL,'helloworld','ddd1','ddd222',1,1,1,29,2),(4,1,'2025-06-21 10:37:19','2025-08-01 20:35:38',NULL,'dddddd','sssss','ddd',1,1,1,27,5);
/*!40000 ALTER TABLE `toy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `toy_detail`
--

DROP TABLE IF EXISTS `toy_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `toy_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `tetx1` varchar(255) NOT NULL,
  `tetx2` varchar(255) NOT NULL,
  `textarea1` varchar(255) DEFAULT NULL,
  `switch1` tinyint(1) DEFAULT NULL,
  `checkbox1` tinyint(1) DEFAULT NULL,
  `select1` tinyint(4) DEFAULT NULL,
  `toy_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `toy_id` (`toy_id`),
  KEY `ix_toy_detail_id` (`id`),
  CONSTRAINT `toy_detail_ibfk_1` FOREIGN KEY (`toy_id`) REFERENCES `toy` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toy_detail`
--

LOCK TABLES `toy_detail` WRITE;
/*!40000 ALTER TABLE `toy_detail` DISABLE KEYS */;
INSERT INTO `toy_detail` VALUES (42,1,'2025-08-01 21:40:56','2025-08-01 21:40:56',NULL,'ddd','dddd',NULL,1,1,2,2),(43,1,'2025-08-01 21:42:47','2025-08-01 21:42:47',NULL,'dddd','ddd',NULL,0,0,1,3),(44,1,'2025-08-01 21:42:55','2025-08-01 21:42:55',NULL,'ddd111','ddd',NULL,1,1,1,1),(45,1,'2025-08-01 21:42:55','2025-08-01 21:42:55',NULL,'ddd2222','dddd',NULL,1,1,2,1),(46,1,'2025-08-01 21:43:02','2025-08-01 21:43:02',NULL,'gggg','ggggg',NULL,1,1,NULL,4);
/*!40000 ALTER TABLE `toy_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `toy_role_link`
--

DROP TABLE IF EXISTS `toy_role_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `toy_role_link` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `toy_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `toy_id` (`toy_id`),
  KEY `role_id` (`role_id`),
  KEY `ix_toy_role_link_id` (`id`),
  CONSTRAINT `toy_role_link_ibfk_1` FOREIGN KEY (`toy_id`) REFERENCES `toy` (`id`),
  CONSTRAINT `toy_role_link_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toy_role_link`
--

LOCK TABLES `toy_role_link` WRITE;
/*!40000 ALTER TABLE `toy_role_link` DISABLE KEYS */;
INSERT INTO `toy_role_link` VALUES (1,2,2),(2,2,4),(3,3,3),(4,1,1),(5,4,3);
/*!40000 ALTER TABLE `toy_role_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `valid_state` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expiry_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_superuser` tinyint(1) DEFAULT NULL,
  `login_name` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `last_login_date` datetime DEFAULT NULL,
  `num_error_login` int(11) DEFAULT NULL,
  `last_error_login` datetime DEFAULT NULL,
  `last_pwd_modify_date` datetime DEFAULT NULL,
  `gender_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dept_id` (`department_id`),
  KEY `ix_user_id` (`id`),
  KEY `user_enum_item_FK` (`gender_id`),
  CONSTRAINT `user_enum_item_FK` FOREIGN KEY (`gender_id`) REFERENCES `enum_item` (`id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'2025-04-08 21:45:16','2025-07-30 08:01:14',NULL,1,1,'admin','admin','admin@photinia.com','$2b$12$baukEQYKyJbHzEvU9xPp0uuAZIY4s4BNBhsgwoBR.KlRYdoL1q7DW',28,'127.0.0.1','2025-07-27 07:19:48',0,'2025-04-10 21:52:16',NULL,115),(2,1,'2025-05-10 17:40:43','2025-07-30 08:33:59',NULL,1,0,'tom.king','tomking','tom@photinia.com','$2b$12$U4l8SAQ2imBLinYHsZ1ck.hjlpMpxWzNTuMxDoCjOsW.1p1gNfFlK',27,'127.0.0.1','2025-05-28 22:25:25',0,NULL,NULL,116),(3,1,'2025-05-14 08:34:38','2025-07-30 08:34:17',NULL,1,0,'kingkang','kingkang','kingkang@gmail.com','$2b$12$VaPwUCpZ81AawgDQx9bvceqkZ51vcw2u0U4Uqqd3J7xs1wBms4LQK',29,NULL,NULL,NULL,NULL,NULL,115),(4,1,'2025-06-08 21:22:19','2025-07-30 08:34:37',NULL,1,0,'max','max','max2025@qq.com','$2b$12$baukEQYKyJbHzEvU9xPp0uuAZIY4s4BNBhsgwoBR.KlRYdoL1q7DW',19,NULL,NULL,NULL,NULL,NULL,117);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_position_link`
--

DROP TABLE IF EXISTS `user_position_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_position_link` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `position_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `position_id` (`position_id`),
  KEY `ix_user_position_link_id` (`id`),
  CONSTRAINT `user_position_link_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_position_link_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `position` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_position_link`
--

LOCK TABLES `user_position_link` WRITE;
/*!40000 ALTER TABLE `user_position_link` DISABLE KEYS */;
INSERT INTO `user_position_link` VALUES (2,4,1),(3,2,2),(4,1,2),(7,3,2),(8,1,1);
/*!40000 ALTER TABLE `user_position_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role_link`
--

DROP TABLE IF EXISTS `user_role_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role_link` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  KEY `ix_user_role_link_id` (`id`),
  CONSTRAINT `user_role_link_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_role_link_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role_link`
--

LOCK TABLES `user_role_link` WRITE;
/*!40000 ALTER TABLE `user_role_link` DISABLE KEYS */;
INSERT INTO `user_role_link` VALUES (1,1,1),(2,2,2),(4,3,4),(5,3,3),(7,4,2),(12,4,4),(13,4,3),(15,1,2),(18,2,4);
/*!40000 ALTER TABLE `user_role_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'photinia_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-04  8:15:08
