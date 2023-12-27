-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: mpsqldatabasean.mysql.database.azure.com    Database: adminusers
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `lastLogin` timestamp NULL DEFAULT NULL,
  `jobTitle` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expiry` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (22,'tester','tester','whtsean234@gmail.com','$2b$10$.D/HS/TMOq6fh0NedWUH6OIdhsCPy//WIvdi8LPWsgijZLjSuiN9e','2023-12-27 08:04:00','admin',NULL,NULL,NULL,NULL),(23,'BIG2EYEZ','BIG2EYEZ','123','$2b$10$ZePWpETN8Gzxe5T0HGmR1OyyqxCnN5OdNzFpuXXBVLUFczT/RCDD6',NULL,'admin',NULL,NULL,NULL,NULL),(81,'BIG2EYEZ','tester45','whtsean234@gmail.com45','$2b$10$meJELmKgTfWcGCHnsp5usulJ0bFk70EI/1xhDBjnctMTYaf/x3h4O',NULL,'admin',NULL,NULL,NULL,NULL),(82,'BIG2EYEZ','tester67','whtsean234@gmail.com67','$2b$10$/JKAs21D1ZV9G.6Qp.tVWOsnPQU.RPAfQyHtKd8FoKN7JNi0AmgLq',NULL,'admin',NULL,NULL,NULL,NULL),(83,'BIG2EYEZ','BIG2EYEZ1','whtsean234@gmail.com69','$2b$10$NzjSfPUeZKaxXlZhxtLC9OmdNiJBnf5JxqpzEiRCUA3z4uHygYtO2',NULL,'admin',NULL,NULL,NULL,NULL),(84,'BIG2EYEZ','RT','whtsean234@gmail.comRT','$2b$10$q1vi8968.PStCMfd2ISVc.xfEX07jUVGUsq2JVahtjQ6umO/p7wnG',NULL,'admin',NULL,NULL,NULL,NULL),(85,'BIG2EYEZ','testerko','whtsean234@gmail.comko','$2b$10$a66w7IZgQfNp60n5UeLeB.r0V41LKtXxAe3P0xX1Oc2WDXoncz8vu',NULL,'admin',NULL,NULL,NULL,NULL),(86,'BIG2EYEZ','testerjk','whtsean234@gmail.comjk','$2b$10$s1dPUZq/JH1EcACVw9opgOiDmdjNRRU8SH/iHuYbI/Eo9mFfo0mQC',NULL,'admin',NULL,NULL,NULL,NULL);
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

-- Dump completed on 2023-12-27 21:22:52
