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
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `vehicleID` varchar(15) NOT NULL,
  `tagID` varchar(10) NOT NULL,
  `tagProvider` varchar(13) NOT NULL,
  `licenseYear` int NOT NULL,
  PRIMARY KEY (`vehicleID`),
  UNIQUE KEY `vehicleID_UNIQUE` (`vehicleID`),
  UNIQUE KEY `tagID_UNIQUE` (`tagID`),
  KEY `fk_operator_idx` (`tagProvider`),
  CONSTRAINT `fk_operator` FOREIGN KEY (`tagProvider`) REFERENCES `operators` (`opID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES ('AT19HLV57173','OO14E0167','olympia_odos',2004),('AY38OQF67603','OO01A7197','olympia_odos',2020),('BI87HYL81972','MR98F8272','moreas',2020),('BK77KNV91142','OO67L7721','olympia_odos',2007),('BM25PHF40639','AO19M3646','aodos',2018),('BY85QGR11636','GF64H7689','gefyra',2018),('BZ76ROL87339','AO94O1451','aodos',2017),('CK97FAU13897','GF85Z5553','gefyra',2007),('CM15YCB60994','EG87N4472','egnatia',2005),('CP56DAO45598','GF96B8067','gefyra',2017),('CR31GMR97972','EG56V3913','egnatia',2000),('DO24BCW15511','KO87M8492','kentriki_odos',2009),('DP11ENT03275','AO11L5271','aodos',2008),('DV04FQL29609','AO87S8322','aodos',2010),('DW44ZOO26361','EG74B6896','egnatia',2009),('EC02LZC49528','EG23G6966','egnatia',2001),('ED51EWW52190','KO38E3788','kentriki_odos',2017),('EE22TMX10817','OO29X6651','olympia_odos',2001),('EG95RTB75032','NE91T5473','nea_odos',2013),('EM54HQI58682','OO58I4183','olympia_odos',2008),('EN26OAB52983','GF51E2190','gefyra',2002),('EV77EDV52985','NE31Q7933','nea_odos',2001),('EZ65FLV39493','MR55V8401','moreas',2012),('FL13UMN92207','KO37T8485','kentriki_odos',2006),('FY47TUN40300','NE43B7275','nea_odos',2002),('HA82SCK64299','MR30M7731','moreas',2001),('HE38BQH01623','MR72G8045','moreas',2016),('HR53SRO94328','MR93N1400','moreas',2004),('HT62RDI04611','AO69I5108','aodos',2000),('HW75BKT77773','KO82C5500','kentriki_odos',2016),('IA29IQS63679','NE83K9493','nea_odos',2010),('IC95TLY24827','OO65G9691','olympia_odos',2020),('IN99SEN20660','EG47U1656','egnatia',2014),('IO09FGE68100','GF87C4626','gefyra',2015),('IW53OQE31439','EG05B7264','egnatia',2014),('IX01MVL33676','KO57Z7727','kentriki_odos',2001),('IZ65WAT29135','MR39O1247','moreas',2002),('JD78PQD35395','EG13U6715','egnatia',2002),('JE65QJK64802','GF48M7092','gefyra',2002),('JF94VYA88954','OO49W8536','olympia_odos',2000),('JO50FSF60755','KO95P1306','kentriki_odos',2011),('JV67MTI17124','NE61X5911','nea_odos',2000),('KB55KTM48860','KO72G8546','kentriki_odos',2009),('KF48RSD79865','MR56E8319','moreas',2012),('KW50MJG67260','GF84U4130','gefyra',2016),('LC72NRN52084','OO85U6024','olympia_odos',2001),('LG64ARC91224','AO27P4628','aodos',2019),('LM86GYO69819','GF61W4412','gefyra',2010),('MA30QLI76818','GF94Q2036','gefyra',2019),('MP14WFM40909','GF62J1185','gefyra',2008),('MQ65WJJ60020','KO53F1683','kentriki_odos',2009),('MU06LHX94338','EG87C3789','egnatia',2016),('MX39VOS38645','AO12K0807','aodos',2018),('NO82BAX82566','NE74M6592','nea_odos',2000),('NY14GZR94632','NE66B0405','nea_odos',2011),('NZ35XLQ89678','NE71H2256','nea_odos',2015),('OC94ASJ72024','AO19H6549','aodos',2002),('OY94SZK34436','NE97X0282','nea_odos',2007),('PD45WOT56494','NE55G3669','nea_odos',2010),('PE73VJU23485','AO18S3731','aodos',2010),('PF04UCA93312','GF84T8932','gefyra',2007),('PM58XHX45588','NE66N5124','nea_odos',2006),('QH15HWX24570','MR36J6829','moreas',2009),('QN12NTR81378','GF26N8608','gefyra',2003),('QN23UHH39091','MR58R4385','moreas',2014),('QO68DIC93032','MR26E3126','moreas',2016),('QO77TFN61853','KO80I5938','kentriki_odos',2004),('QP02SYE47964','NE74M0871','nea_odos',2010),('QR03XCJ37459','OO43C8099','olympia_odos',2014),('QU94IGC75528','EG52J0268','egnatia',2003),('QW79CHL42244','KO64Z6868','kentriki_odos',2006),('QX75YWC61835','OO20E8329','olympia_odos',2019),('RK48BOP88344','OO41Q9202','olympia_odos',2016),('RR73DWB65452','AO13W1028','aodos',2017),('RR98KQE80731','MR06V9056','moreas',2020),('RV87TIY76692','KO69R5975','kentriki_odos',2001),('SL09NOT64494','GF17K5976','gefyra',2005),('SU00RDZ36214','AO31K4646','aodos',2014),('SY96JDQ97089','AO88V0724','aodos',2004),('TE24LCO18661','EG36L0177','egnatia',2009),('TV81MAQ99005','EG00X1873','egnatia',2000),('TZ48CCW54765','EG79G1284','egnatia',2015),('UA13YTK28483','MR57I0349','moreas',2020),('UF84JOS00561','GF26E1328','gefyra',2020),('UO75YNW62238','KO75W9528','kentriki_odos',2003),('UP28MBM38391','NE09V3603','nea_odos',2010),('VJ92OYV94295','OO59B1482','olympia_odos',2000),('VL67TFO75321','EG76E0993','egnatia',2007),('VX68BAR38623','NE80E5551','nea_odos',2005),('WG11QVY31890','OO68H9901','olympia_odos',2006),('WU78BMX13511','GF52G9102','gefyra',2008),('WY00MLL63827','KO44J2006','kentriki_odos',2000),('XE59BZM26378','EG47I2811','egnatia',2020),('XF28DGK65250','GF52T0389','gefyra',2021),('XV40HUQ04740','OO26V4144','olympia_odos',2001),('XV91YMP27722','MR63V2295','moreas',2012),('YH66OKD41942','KO58G5356','kentriki_odos',2019),('YL27IFD65117','AO49I8807','aodos',2006),('YX66XYW62640','GF85R2347','gefyra',2014),('ZY93PCY41868','KO91P5387','kentriki_odos',2006);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-11 21:02:51
