-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ntua
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `stationId` varchar(4) NOT NULL,
  `stationProvider` varchar(13) NOT NULL,
  `stationName` varchar(30) NOT NULL,
  PRIMARY KEY (`stationId`),
  UNIQUE KEY `stationId_UNIQUE` (`stationId`),
  KEY `fk_operator_id_idx` (`stationProvider`),
  CONSTRAINT `fk_operator_id` FOREIGN KEY (`stationProvider`) REFERENCES `operators` (`opID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES ('AO00','aodos','aodos tolls station 00'),('AO01','aodos','aodos tolls station 01'),('AO02','aodos','aodos tolls station 02'),('AO03','aodos','aodos tolls station 03'),('AO04','aodos','aodos tolls station 04'),('AO05','aodos','aodos tolls station 05'),('AO06','aodos','aodos tolls station 06'),('AO07','aodos','aodos tolls station 07'),('AO08','aodos','aodos tolls station 08'),('AO09','aodos','aodos tolls station 09'),('AO10','aodos','aodos tolls station 10'),('AO11','aodos','aodos tolls station 11'),('AO12','aodos','aodos tolls station 12'),('AO13','aodos','aodos tolls station 13'),('AO14','aodos','aodos tolls station 14'),('AO15','aodos','aodos tolls station 15'),('AO16','aodos','aodos tolls station 16'),('AO17','aodos','aodos tolls station 17'),('AO18','aodos','aodos tolls station 18'),('AO19','aodos','aodos tolls station 19'),('EG00','egnatia','egnatia tolls station 00'),('EG01','egnatia','egnatia tolls station 01'),('EG02','egnatia','egnatia tolls station 02'),('EG03','egnatia','egnatia tolls station 03'),('EG04','egnatia','egnatia tolls station 04'),('EG05','egnatia','egnatia tolls station 05'),('EG06','egnatia','egnatia tolls station 06'),('EG07','egnatia','egnatia tolls station 07'),('EG08','egnatia','egnatia tolls station 08'),('EG09','egnatia','egnatia tolls station 09'),('EG10','egnatia','egnatia tolls station 10'),('EG11','egnatia','egnatia tolls station 11'),('EG12','egnatia','egnatia tolls station 12'),('GF00','gefyra','gefyra tolls station 00'),('KO00','kentriki_odos','kentriki_odos tolls station 00'),('KO01','kentriki_odos','kentriki_odos tolls station 01'),('KO02','kentriki_odos','kentriki_odos tolls station 02'),('KO03','kentriki_odos','kentriki_odos tolls station 03'),('KO04','kentriki_odos','kentriki_odos tolls station 04'),('KO05','kentriki_odos','kentriki_odos tolls station 05'),('KO06','kentriki_odos','kentriki_odos tolls station 06'),('KO07','kentriki_odos','kentriki_odos tolls station 07'),('KO08','kentriki_odos','kentriki_odos tolls station 08'),('KO09','kentriki_odos','kentriki_odos tolls station 09'),('MR00','moreas','moreas tolls station 00'),('MR01','moreas','moreas tolls station 01'),('MR02','moreas','moreas tolls station 02'),('MR03','moreas','moreas tolls station 03'),('MR04','moreas','moreas tolls station 04'),('MR05','moreas','moreas tolls station 05'),('MR06','moreas','moreas tolls station 06'),('MR07','moreas','moreas tolls station 07'),('MR08','moreas','moreas tolls station 08'),('NE00','nea_odos','nea_odos tolls station 00'),('NE01','nea_odos','nea_odos tolls station 01'),('NE02','nea_odos','nea_odos tolls station 02'),('NE03','nea_odos','nea_odos tolls station 03'),('NE04','nea_odos','nea_odos tolls station 04'),('NE05','nea_odos','nea_odos tolls station 05'),('NE06','nea_odos','nea_odos tolls station 06'),('NE07','nea_odos','nea_odos tolls station 07'),('NE08','nea_odos','nea_odos tolls station 08'),('NE09','nea_odos','nea_odos tolls station 09'),('NE10','nea_odos','nea_odos tolls station 10'),('NE11','nea_odos','nea_odos tolls station 11'),('NE12','nea_odos','nea_odos tolls station 12'),('NE13','nea_odos','nea_odos tolls station 13'),('NE14','nea_odos','nea_odos tolls station 14'),('NE15','nea_odos','nea_odos tolls station 15'),('NE16','nea_odos','nea_odos tolls station 16'),('OO00','olympia_odos','olympia_odos tolls station 00'),('OO01','olympia_odos','olympia_odos tolls station 01'),('OO02','olympia_odos','olympia_odos tolls station 02'),('OO03','olympia_odos','olympia_odos tolls station 03'),('OO04','olympia_odos','olympia_odos tolls station 04'),('OO05','olympia_odos','olympia_odos tolls station 05'),('OO06','olympia_odos','olympia_odos tolls station 06'),('OO07','olympia_odos','olympia_odos tolls station 07'),('OO08','olympia_odos','olympia_odos tolls station 08'),('OO09','olympia_odos','olympia_odos tolls station 09'),('OO10','olympia_odos','olympia_odos tolls station 10'),('OO11','olympia_odos','olympia_odos tolls station 11'),('OO12','olympia_odos','olympia_odos tolls station 12'),('OO13','olympia_odos','olympia_odos tolls station 13');
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-11 21:03:08
