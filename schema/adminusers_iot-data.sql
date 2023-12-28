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
-- Table structure for table `iot-data`
--

DROP TABLE IF EXISTS `iot-data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot-data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `psiData` varchar(8) NOT NULL,
  `humidityData` varchar(8) NOT NULL,
  `o3Data` varchar(8) NOT NULL,
  `no2Data` varchar(8) NOT NULL,
  `so2Data` varchar(8) NOT NULL,
  `coData` varchar(8) NOT NULL,
  `temperatureData` varchar(8) NOT NULL,
  `windspeedData` varchar(8) NOT NULL,
  `currentTime` varchar(20) NOT NULL,
  `regionData` varchar(10) NOT NULL,
  `createdAt` varchar(20) DEFAULT NULL,
  `updatedAt` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot-data`
--

LOCK TABLES `iot-data` WRITE;
/*!40000 ALTER TABLE `iot-data` DISABLE KEYS */;
INSERT INTO `iot-data` VALUES (1,'426','9%','231ppm','812ppm','653ppm','39ppm','25°C','34km/h','2023-12-19 16:52:38','central','2023-12-19 18:00:00','');
/*!40000 ALTER TABLE `iot-data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-27 21:22:58
