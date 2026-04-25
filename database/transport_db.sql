-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2026 at 11:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `transport_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `buses`
--

CREATE TABLE `buses` (
  `bus_id` int(11) NOT NULL,
  `bus_number` varchar(20) NOT NULL,
  `seating_capacity` int(11) NOT NULL,
  `bus_model` varchar(50) NOT NULL,
  `city` varchar(50) DEFAULT NULL,
  `route` varchar(100) DEFAULT NULL,
  `manufacturing_year` year(4) NOT NULL,
  `operational_status` enum('Active','Under Maintenance','Not in Service') NOT NULL DEFAULT 'Active',
  `status_updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buses`
--

INSERT INTO `buses` (`bus_id`, `bus_number`, `seating_capacity`, `bus_model`, `city`, `route`, `manufacturing_year`, `operational_status`, `status_updated_at`, `remarks`, `created_at`) VALUES
(1, 'AP16AB1234', 50, 'Ashok Leyland', 'Tenali', 'Itanagar', '2019', 'Active', '2026-01-11 13:17:31', 'Newly serviced', '2026-01-07 05:10:45'),
(2, 'AP16CD5678', 52, 'Tata Starbus', 'Tenali', 'Chinaravuru', '2020', 'Active', '2026-01-11 13:17:31', 'Assigned to morning and evening routes', '2026-01-07 05:10:45'),
(3, 'AP37EF9012', 45, 'Eicher Skyline', 'Guntur', 'Amaravathi Road', '2022', 'Active', '2026-01-11 13:17:54', 'New bus added to fleet', '2026-01-07 05:10:45'),
(4, 'AP07GH3456', 50, 'Ashok Leyland Viking', 'Guntur', 'Kothapeta', '2018', 'Active', '2026-01-11 13:25:05', 'Recently serviced and operational', '2026-01-07 05:10:45'),
(5, 'AP28JK7890', 48, 'Tata LP 912', 'Guntur', 'Pattabhipuram', '2017', 'Active', '2026-01-11 13:25:05', 'Maintenance completed and bus is active', '2026-01-07 05:10:45'),
(6, 'AP03LM1122', 55, 'Ashok Leyland Oyster', 'Vijayawada', '-', '2015', 'Not in Service', '2026-01-11 13:22:15', 'Severe accident damage', '2026-01-07 05:10:45'),
(7, 'AP16NO3344', 50, 'Tata Starbus', 'Vijayawada', '-', '2012', 'Not in Service', '2026-01-11 13:22:15', 'Bus retired due to age', '2026-01-07 05:10:45'),
(8, 'AP07PQ5566', 44, 'Eicher Canter', 'Vijayawada', 'Poranki', '2021', 'Active', '2026-01-11 13:18:08', 'Used for short-distance routes', '2026-01-07 05:10:45'),
(9, 'AP39RS7788', 49, 'Ashok Leyland', 'Vijayawada', 'Kanuru', '2016', 'Active', '2026-01-11 13:25:05', 'Inspection completed and bus is operational', '2026-01-07 05:10:45'),
(10, 'AP16UV9900', 53, 'Tata Starbus Ultra', 'Chilakaluripeta', 'Market Area', '2023', 'Active', '2026-01-11 13:18:23', 'Recently purchased bus', '2026-01-07 05:10:45'),
(11, 'AP39CL2024', 50, 'Ashok Leyland', 'Chilakaluripeta', 'Housing Board Area', '2022', 'Active', '2026-01-11 13:19:03', 'New route added', '2026-01-11 13:19:03'),
(12, 'AP16VJ8888', 52, 'Tata Starbus', 'Vijayawada', 'Gannavaram', '2023', 'Active', '2026-01-11 13:19:22', 'New Vijayawada route', '2026-01-11 13:19:22'),
(13, 'AP16BZ2024', 52, 'Tata Starbus', 'Vijayawada', 'Benz Circle', '2022', 'Active', '2026-01-11 13:22:45', 'Assigned to Benz Circle route', '2026-01-11 13:22:45'),
(14, 'AP16OT2024', 50, 'Ashok Leyland', 'Vijayawada', 'One Town', '2021', 'Active', '2026-01-11 13:22:45', 'Assigned to One Town route', '2026-01-11 13:22:45');

-- --------------------------------------------------------

--
-- Table structure for table `bus_assignments`
--

CREATE TABLE `bus_assignments` (
  `assignment_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `worker_id` int(11) DEFAULT NULL,
  `assigned_date` date DEFAULT curdate(),
  `status` enum('Pending','Assigned','Completed') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_assignments`
--

INSERT INTO `bus_assignments` (`assignment_id`, `bus_id`, `driver_id`, `worker_id`, `assigned_date`, `status`) VALUES
(50, 6, 11, 11, '2026-02-24', 'Completed'),
(51, 6, 16, 4, '2026-02-24', 'Completed'),
(52, 4, 11, 1, '2026-02-26', 'Completed'),
(53, 6, 16, 18, '2026-02-26', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `bus_inspection`
--

CREATE TABLE `bus_inspection` (
  `inspection_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `fitness_certificate_no` varchar(50) NOT NULL,
  `fitness_issued_date` date NOT NULL,
  `fitness_expiry_date` date NOT NULL,
  `condition_status` enum('Good','Average','Poor') NOT NULL DEFAULT 'Good',
  `inspection_date` date NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_inspection`
--

INSERT INTO `bus_inspection` (`inspection_id`, `bus_id`, `fitness_certificate_no`, `fitness_issued_date`, `fitness_expiry_date`, `condition_status`, `inspection_date`, `remarks`, `created_at`) VALUES
(1, 1, 'FC-AP16-001', '2024-01-10', '2026-05-30', 'Good', '2025-01-05', 'Fitness valid and bus in excellent condition', '2026-01-07 05:41:40'),
(2, 2, 'FC-AP16-002', '2023-08-20', '2026-05-30', 'Good', '2025-01-06', 'Routine inspection completed', '2026-01-07 05:41:40'),
(3, 3, 'FC-AP37-003', '2024-03-05', '2026-05-30', 'Good', '2025-01-06', 'New bus, no issues found', '2026-01-07 05:41:40'),
(4, 4, 'FC-AP07-004', '2023-06-10', '2026-05-30', 'Average', '2025-01-07', 'Engine repair ongoing', '2026-01-07 05:41:40'),
(5, 5, 'FC-AP28-005', '2024-02-05', '2026-05-30', 'Average', '2025-01-07', 'Tyre replacement required', '2026-01-07 05:41:40'),
(6, 6, 'FC-AP03-006', '2022-10-05', '2025-05-30', 'Poor', '2025-01-08', 'Fitness expired and bus damaged', '2026-01-07 05:41:40'),
(7, 7, 'FC-AP16-007', '2022-05-10', '2025-05-30', 'Poor', '2025-01-08', 'Bus retired due to age', '2026-01-07 05:41:40'),
(8, 8, 'FC-AP07-008', '2024-04-10', '2026-05-30', 'Good', '2025-01-09', 'Short-route bus, well maintained', '2026-01-07 05:41:40'),
(9, 9, 'FC-AP39-009', '2023-09-10', '2026-05-30', 'Average', '2025-01-09', 'Brake inspection recommended', '2026-01-07 05:41:40'),
(10, 10, 'FC-AP16-010', '2024-07-15', '2026-05-30', 'Good', '2025-01-10', 'Recently purchased and certified', '2026-01-07 05:41:40'),
(11, 12, 'FC-AP39-012', '2024-02-10', '2026-05-30', 'Good', '2025-01-10', 'Routine inspection completed', '2026-01-25 06:06:59'),
(12, 13, 'FC-AP16-013', '2024-03-15', '2026-05-30', 'Good', '2025-01-10', 'New bus and fully compliant', '2026-01-25 06:06:59'),
(13, 14, 'FC-AP16-014', '2024-01-20', '2026-05-30', 'Good', '2025-01-11', 'Fitness verified and approved', '2026-01-25 06:06:59'),
(14, 15, 'FC-AP16-015', '2024-04-05', '2026-05-30', 'Good', '2025-01-11', 'Periodic inspection passed', '2026-01-25 06:06:59');

-- --------------------------------------------------------

--
-- Table structure for table `bus_insurance`
--

CREATE TABLE `bus_insurance` (
  `insurance_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `insurance_company` varchar(100) NOT NULL,
  `policy_number` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `expiry_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_insurance`
--

INSERT INTO `bus_insurance` (`insurance_id`, `bus_id`, `insurance_company`, `policy_number`, `start_date`, `expiry_date`) VALUES
(1, 1, 'ICICI Lombard', 'ICICI-AP16-001', '2024-01-01', '2026-01-01'),
(2, 2, 'HDFC Ergo', 'HDFC-AP16-002', '2023-08-15', '2025-08-14'),
(3, 3, 'Bajaj Allianz', 'BA-AP37-003', '2024-03-01', '2026-03-01'),
(4, 4, 'ICICI Lombard', 'ICICI-AP07-004', '2023-06-01', '2024-06-01'),
(5, 5, 'HDFC Ergo', 'HDFC-AP28-005', '2024-02-01', '2025-02-01'),
(6, 6, 'New India Assurance', 'NIA-AP03-006', '2022-10-01', '2023-10-01'),
(7, 7, 'United India Insurance', 'UII-AP16-007', '2022-05-01', '2023-05-01'),
(8, 8, 'Bajaj Allianz', 'BA-AP07-008', '2024-04-01', '2026-04-01'),
(9, 9, 'ICICI Lombard', 'ICICI-AP39-009', '2023-09-01', '2024-09-01'),
(10, 10, 'HDFC Ergo', 'HDFC-AP16-010', '2024-07-01', '2027-07-01'),
(11, 12, 'ICICI Lombard', 'ICICI-AP39-012', '2024-02-01', '2026-06-30'),
(12, 13, 'HDFC Ergo', 'HDFC-AP16-013', '2024-03-01', '2026-06-30'),
(13, 14, 'Bajaj Allianz', 'BA-AP16-014', '2024-01-15', '2026-06-30'),
(14, 15, 'United India Insurance', 'UII-AP16-015', '2024-04-01', '2026-06-30');

-- --------------------------------------------------------

--
-- Table structure for table `bus_passes`
--

CREATE TABLE `bus_passes` (
  `pass_id` int(11) NOT NULL,
  `reg_no` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `bus_no` varchar(20) NOT NULL,
  `boarding_point` varchar(100) NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `rejection_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `fee_id` int(11) DEFAULT NULL,
  `payment_status` enum('Unpaid','Partially Paid','Fully Paid') NOT NULL DEFAULT 'Unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_passes`
--

INSERT INTO `bus_passes` (`pass_id`, `reg_no`, `city`, `bus_no`, `boarding_point`, `status`, `rejection_reason`, `created_at`, `fee_id`, `payment_status`) VALUES
(1, '221FA07005', 'Tenali', 'AP16CD5678', 'Chinaravuru', 'Approved', '', '2026-02-10 16:34:51', 2, 'Fully Paid'),
(2, '221FA07032', 'Guntur', 'AP37EF9012', 'Amaravathi Road', 'Approved', '', '2026-02-10 16:40:00', 1, 'Fully Paid'),
(4, '221FA07026', 'Vijayawada', 'AP39RS7788', 'Kanuru', 'Approved', '', '2026-02-10 16:47:14', 3, 'Fully Paid'),
(5, '221FA07051', 'Chilakaluripeta', 'AP39CL2024', 'Housing Board Area', 'Approved', '', '2026-02-10 16:54:56', 4, 'Fully Paid'),
(6, '221FA07011', 'Tenali', 'AP16CD5678', 'Chinaravuru', 'Approved', '', '2026-02-11 03:07:20', 2, 'Fully Paid'),
(7, '221FA07010', 'Guntur', 'AP07GH3456', 'Kothapeta', 'Approved', '', '2026-02-13 14:17:01', 1, 'Fully Paid'),
(9, '221FA07030', 'Guntur', 'AP37EF9012', 'Amaravathi Road', 'Approved', '', '2026-03-05 05:07:48', 1, 'Fully Paid'),
(10, '221FA07025', 'Guntur', 'AP37EF9012', 'Amaravathi Road', 'Approved', '', '2026-03-11 05:52:18', 1, 'Unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `bus_pass_payments`
--

CREATE TABLE `bus_pass_payments` (
  `payment_id` int(11) NOT NULL,
  `reg_no` varchar(20) NOT NULL,
  `pass_id` int(11) NOT NULL,
  `receipt_no` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_pass_payments`
--

INSERT INTO `bus_pass_payments` (`payment_id`, `reg_no`, `pass_id`, `receipt_no`, `amount`, `payment_date`, `created_at`) VALUES
(1, '221FA07005', 1, 'TP-RCPT-1', 22000.00, '2026-02-10', '2026-02-10 16:35:09'),
(2, '221FA07032', 2, 'TP-RCPT-2', 25000.00, '2026-02-10', '2026-02-10 16:40:12'),
(4, '221FA07026', 4, 'TP-RCPT-3', 40000.00, '2026-02-10', '2026-02-10 16:47:45'),
(5, '221FA07051', 5, 'TP-RCPT-5', 45000.00, '2026-02-10', '2026-02-10 16:55:16'),
(6, '221FA07011', 6, 'TP-RCPT-6', 22000.00, '2026-02-11', '2026-02-11 03:16:23'),
(7, '221FA07010', 7, 'TP-RCPT-7', 25000.00, '2026-02-13', '2026-02-13 14:17:17'),
(9, '221FA07030', 9, 'TP-RCPT-8', 25000.00, '2026-03-06', '2026-03-05 05:08:05'),
(10, '221FA07025', 10, 'TP-RCPT-10', 25000.00, '2026-03-11', '2026-03-11 05:52:31');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `license_no` varchar(50) NOT NULL,
  `license_expiry_date` date NOT NULL,
  `status` enum('Available','Assigned','Inactive') DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`driver_id`, `name`, `phone`, `license_no`, `license_expiry_date`, `status`, `created_at`) VALUES
(1, 'Raju', '+912213456789', 'DL-2026-4157', '2026-02-11', 'Available', '2026-02-12 04:17:07'),
(2, 'Raju Kumar', '+919876543210', 'DL-2026-2002', '2026-12-31', 'Available', '2026-02-12 04:36:46'),
(3, 'Suresh Reddy', '+919123456780', 'DL-2026-2003', '2025-06-15', 'Available', '2026-02-12 04:36:46'),
(4, 'Mahesh Babu', '+919000011111', 'DL-2026-2004', '2024-01-10', 'Inactive', '2026-02-12 04:36:46'),
(5, 'Arjun Rao', '+919845612345', 'DL-2026-2005', '2026-08-20', 'Available', '2026-02-12 04:36:46'),
(6, 'Kiran Reddy', '+919765432109', 'DL-2026-2006', '2027-03-14', 'Inactive', '2026-02-12 04:36:46'),
(7, 'Vikram Singh', '+919654321098', 'DL-2026-2007', '2025-11-05', 'Available', '2026-02-12 04:36:46'),
(8, 'Naveen Kumar', '+919812345678', 'DL-2026-2008', '2026-09-22', 'Available', '2026-02-12 04:36:46'),
(9, 'Pradeep Kumar', '+919923456781', 'DL-2026-2009', '2027-01-18', 'Inactive', '2026-02-12 04:36:46'),
(10, 'Ramesh Yadav', '+919834567812', 'DL-2026-2010', '2026-07-30', 'Available', '2026-02-12 04:36:46'),
(11, 'Ajay Sharma', '+919988776655', 'DL-2026-2011', '2025-12-12', 'Available', '2026-02-12 04:36:46'),
(12, 'Manoj Reddy', '+919656789234', 'DL-2026-2012', '2026-10-05', 'Available', '2026-02-12 04:36:46'),
(13, 'Sunil Verma', '+919567890345', 'DL-2026-2013', '2027-04-25', 'Available', '2026-02-12 04:36:46'),
(14, 'Deepak Kumar', '+919478901456', 'DL-2026-2014', '2026-05-15', 'Available', '2026-02-12 04:36:46'),
(15, 'Rohit Reddy', '+919389012567', 'DL-2026-2015', '2025-09-19', 'Inactive', '2026-02-12 04:36:46'),
(16, 'Anil Kumar', '+919290123678', 'DL-2026-2016', '2027-02-10', 'Assigned', '2026-02-12 04:36:46'),
(17, 'Vamsi Krishna', '+919101234789', 'DL-2026-2017', '2026-11-28', 'Inactive', '2026-02-12 04:36:46'),
(18, 'Lokesh Kumar', '+919212345890', 'DL-2026-2018', '2027-06-06', 'Available', '2026-02-12 04:36:46'),
(19, 'Harish Reddy', '+919323456901', 'DL-2026-2019', '2025-08-08', 'Available', '2026-02-12 04:36:46'),
(20, 'Sanjay Kumar', '+919434567012', 'DL-2026-2020', '2026-04-14', 'Available', '2026-02-12 04:36:46'),
(21, 'Rakesh Sharma', '+919545678123', 'DL-2026-2021', '2027-12-01', 'Available', '2026-02-12 04:36:46'),
(25, 'Sai teja', '+919866535621', 'DL-2026-8053', '2026-02-12', 'Available', '2026-02-12 04:37:42'),
(26, 'sasi', '+919876541234', 'DL-2026-6407', '2026-02-05', 'Available', '2026-02-12 05:45:11'),
(27, 'Deekshit', '+919030565403', 'DL-2026-6297', '2026-02-04', 'Available', '2026-02-12 06:16:25'),
(28, 'Mokshit', '+917702471915', 'DL-2026-5076', '2026-02-01', 'Inactive', '2026-02-12 06:50:51'),
(29, 'Sasi Kumar K', '+918179234567', 'DL-2026-4575', '2026-02-18', 'Available', '2026-02-18 05:21:56'),
(30, 'Bhanu', '+918754434522', 'DL-2026-6545', '2026-02-23', 'Available', '2026-02-23 04:14:40'),
(31, 'Pavan ', '+919877552612', 'AP-25-2026-7765341', '2026-03-03', 'Available', '2026-02-24 03:12:03');

-- --------------------------------------------------------

--
-- Table structure for table `fuel_logs`
--

CREATE TABLE `fuel_logs` (
  `fuel_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `fuel_date` date NOT NULL,
  `liters` decimal(6,2) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `odometer_reading` int(11) NOT NULL,
  `mileage` decimal(6,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fuel_logs`
--

INSERT INTO `fuel_logs` (`fuel_id`, `bus_id`, `fuel_date`, `liters`, `cost`, `odometer_reading`, `mileage`, `created_at`) VALUES
(6, 1, '2026-02-20', 100.00, 9707.00, 23786, 0.00, '2026-02-24 07:04:22'),
(7, 1, '2026-02-24', 60.00, 5850.00, 24026, 4.00, '2026-02-24 07:04:43'),
(8, 4, '2026-03-11', 200.00, 19600.00, 24026, 0.00, '2026-03-11 05:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_expenses`
--

CREATE TABLE `maintenance_expenses` (
  `expense_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `expense_type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `expense_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_expenses`
--

INSERT INTO `maintenance_expenses` (`expense_id`, `bus_id`, `expense_type`, `description`, `expense_date`, `amount`, `created_at`) VALUES
(1, 1, 'Bus Parts', 'Side Mirrors', '2026-02-24', 20000.00, '2026-02-24 07:11:23');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `route_id` int(11) NOT NULL,
  `route_number` varchar(20) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `city` varchar(50) NOT NULL,
  `route_areas` text NOT NULL,
  `destination` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`route_id`, `route_number`, `bus_id`, `city`, `route_areas`, `destination`) VALUES
(1, 'R-01', 1, 'Tenali', 'Itanagar → Bus Stand → Campus', 'Vignan University'),
(2, 'R-02', 2, 'Tenali', 'Chinaravuru → Market → Campus', 'Vignan University'),
(3, 'R-03', 3, 'Guntur', 'Amaravathi Road → Inner Ring Road → Campus', 'Vignan University'),
(4, 'R-04', 4, 'Guntur', 'Kothapeta → RTC Bus Stand → Campus', 'Vignan University'),
(5, 'R-05', 5, 'Guntur', 'Pattabhipuram → Brodipet → Campus', 'Vignan University'),
(6, 'R-06', 8, 'Vijayawada', 'Poranki → Auto Nagar → Campus', 'Vignan University'),
(7, 'R-07', 9, 'Vijayawada', 'Kanuru → Ramavarappadu → Campus', 'Vignan University'),
(8, 'R-08', 10, 'Chilakaluripeta', 'Market Area → RTC Complex → Campus', 'Vignan University'),
(9, 'R-09', 12, 'Chilakaluripeta', 'Housing Board Area → Main Road → Campus', 'Vignan University'),
(10, 'R-10', 13, 'Vijayawada', 'Gannavaram → Airport Road → Campus', 'Vignan University'),
(11, 'R-11', 14, 'Vijayawada', 'Benz Circle → MG Road → Campus', 'Vignan University'),
(12, 'R-12', 15, 'Vijayawada', 'One Town → Durga Gudi → Campus', 'Vignan University');

-- --------------------------------------------------------

--
-- Table structure for table `service_records`
--

CREATE TABLE `service_records` (
  `service_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `service_date` date NOT NULL,
  `next_service_due` date NOT NULL,
  `service_center` varchar(150) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_records`
--

INSERT INTO `service_records` (`service_id`, `bus_id`, `service_type`, `service_date`, `next_service_due`, `service_center`, `cost`, `remarks`, `created_at`) VALUES
(1, 1, 'Engine Service', '2026-02-24', '2026-05-24', 'Bismillah Auto Garaee', 10000.00, 'Recently Serviced And Operational', '2026-02-24 07:10:58'),
(2, 4, 'Oil filter replacement', '2026-03-11', '2026-07-11', 'Bismillah Auto Garage', 15000.00, 'Engine serviced successfully', '2026-03-11 05:48:45');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `reg_no` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(50) NOT NULL,
  `section` varchar(10) NOT NULL,
  `year` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `photo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`reg_no`, `name`, `department`, `section`, `year`, `semester`, `phone`, `email`, `photo`) VALUES
('221FA05021', 'Praveen Kumar Reddy', 'CSE', 'A', 3, 6, '9988776655', 'praveen.reddy22@gmail.com', '221FA05021.jpg'),
('221FA05034', 'Divya Sri Nalluri', 'CSE', 'B', 3, 6, '8899776655', 'divya.nalluri22@gmail.com', '221FA05034.jpg'),
('221FA05047', 'Harsha Vardhan Kona', 'CSE', 'A', 3, 6, '7788996655', 'harsha.kona22@gmail.com', '221FA05047.jpg'),
('221FA05060', 'Karthik Reddy Y', 'CSE', 'A', 3, 6, '9876543210', 'karthik.reddy22@gmail.com', '221FA05060.jpg'),
('221FA05061', 'Sneha Kumari P', 'CSE', 'B', 3, 6, '9876543211', 'sneha.kumari22@gmail.com', '221FA05061.jpg'),
('221FA05062', 'Rohith Varma K', 'CSE', 'A', 3, 6, '9876543212', 'rohith.varma22@gmail.com', '221FA05062.jpg'),
('221FA05063', 'Nithya Sri M', 'CSE', 'B', 3, 6, '9876543213', 'nithya.sri22@gmail.com', '221FA05063.jpg'),
('221FA07005', 'Kondepu Dinesh Kumar', 'IT', 'A', 4, 8, '8179035403', 'dineshkumarkondepu@gmail.com', '221FA07005.jpg'),
('221FA07010', 'Tiyyagura Chanikya Kumar Reddy', 'IT', 'A', 4, 8, '6301176837', 'chanikyatiyyagura@gmail.com', '221FA07010.jpg'),
('221FA07011', 'Vukoti Bharath Vamsi', 'IT', 'A', 4, 8, '8639822553', 'vukotibharathvamsi@gmail.com', '221FA07011.jpg'),
('221FA07018', 'Addanki Sai Teja', 'IT', 'A', 4, 8, '6302557891', 'saitejaaddanki@gmail.com', '221FA07018.jpg'),
('221FA07025', 'Vallapuri Venkata Sivasai', 'IT', 'A', 4, 8, '9515529086', 'SivasaiVallapuri@gmail.com', '221FA07025.jpg'),
('221FA07026', 'Gudapati Raja Gopal', 'IT', 'A', 4, 8, '7659083167', 'rajagopalgudapati@gmail.com', '221FA07026.jpg'),
('221FA07030', 'Chanti Pavan Venkata Krishna', 'IT', 'A', 4, 8, '8106156696', 'PavanVenkataKrishnach2@gmail.com', '221FA07030.jpg'),
('221FA07032', 'Allu Mahesh Pothan', 'IT', 'A', 4, 8, '6305788806', 'allupothan33@gmail.com', '221FA07032.jpg'),
('221FA07040', 'Damineni Teja', 'IT', 'A', 4, 8, '6301163927', 'tejadamineni@gmail.com', '221FA07040.jpg'),
('221FA07048', 'Suresh Naidu Mandava', 'IT', 'B', 4, 8, '9012345678', 'suresh.mandava22@gmail.com', '221FA07048.jpg'),
('221FA07051', 'Nadendla Raghu', 'IT', 'A', 4, 8, '8096581184', 'raghavanadendla9999@gmail.com ', '221FA07051.jpg'),
('221FA07054', 'Amathi Venkata Vedavyas', 'IT', 'A', 4, 8, '6305558233', 'vedavyasamathi@gmail.com', '221FA07054.jpg'),
('221FA07061', 'Anusha Reddy Pothireddy', 'IT', 'B', 4, 8, '8123456789', 'anusha.pothireddy22@gmail.com', '221FA07061.jpg'),
('221FA07064', 'Ajay Kumar T', 'IT', 'A', 4, 8, '9876543214', 'ajay.kumar22@gmail.com', '221FA07064.jpg'),
('221FA07065', 'Kiran Kumar B', 'IT', 'A', 4, 8, '9876543215', 'kiran.kumar22@gmail.com', '221FA07065.jpg'),
('221FA07066', 'Lakshmi Devi P', 'IT', 'B', 4, 8, '9876543216', 'lakshmi.devi22@gmail.com', '221FA07066.jpg'),
('221FA07067', 'Manoj Kumar V', 'IT', 'A', 4, 8, '9876543217', 'manoj.kumar22@gmail.com', '221FA07067.jpg'),
('221FA07068', 'Ravi Teja G', 'IT', 'A', 4, 8, '9876543218', 'raviteja.g22@gmail.com', '221FA07068.jpg'),
('221LA07009', 'Kiran Kumar Yadav', 'IT', 'A', 4, 8, '9345678123', 'kiran.yadav22@gmail.com', '221LA07009.jpg'),
('231FA03001', 'Sai Kiran Reddy', 'ECE', 'A', 2, 4, '9100000001', 'saikiran1@gmail.com', '231FA03001.jpg'),
('231FA03002', 'Nikhil Kumar', 'ECE', 'B', 2, 4, '9100000002', 'nikhil2@gmail.com', '231FA03002.jpg'),
('231FA03003', 'Teja Varma', 'ECE', 'A', 2, 4, '9100000003', 'teja3@gmail.com', '231FA03003.jpg'),
('231FA03004', 'Harish Kumar', 'ECE', 'B', 2, 4, '9100000004', 'harish4@gmail.com', '231FA03004.jpg'),
('231FA03005', 'Praneeth Reddy', 'ECE', 'A', 2, 4, '9100000005', 'praneeth5@gmail.com', '231FA03005.jpg'),
('231FA03012', 'Sai Kiran Gadde', 'ECE', 'A', 2, 4, '9123456780', 'saikiran.gadde23@gmail.com', '231FA03012.jpg'),
('231FA03026', 'Bhavya Lakshmi Uppala', 'ECE', 'B', 2, 4, '9234567810', 'bhavya.uppala23@gmail.com', '231FA03026.jpg'),
('231FA03045', 'Keerthana S', 'ECE', 'A', 2, 4, '9876543219', 'keerthana.s23@gmail.com', '231FA03045.jpg'),
('231FA03046', 'Pranay Kumar D', 'ECE', 'B', 2, 4, '9876543220', 'pranay.kumar23@gmail.com', '231FA03046.jpg'),
('231FA03047', 'Sandeep Kumar R', 'ECE', 'A', 2, 4, '9876543221', 'sandeep.kumar23@gmail.com', '231FA03047.jpg'),
('231FA03048', 'Harika Devi M', 'ECE', 'B', 2, 4, '9876543222', 'harika.devi23@gmail.com', '231FA03048.jpg'),
('231FA05001', 'Ravi Kumar', 'CSE', 'A', 2, 4, '9100000006', 'ravi6@gmail.com', '231FA05001.jpg'),
('231FA05002', 'Ajay Kumar', 'CSE', 'B', 2, 4, '9100000007', 'ajay7@gmail.com', '231FA05002.jpg'),
('231FA05003', 'Sandeep Reddy', 'CSE', 'A', 2, 4, '9100000008', 'sandeep8@gmail.com', '231FA05003.jpg'),
('231FA05004', 'Lokesh Kumar', 'CSE', 'B', 2, 4, '9100000009', 'lokesh9@gmail.com', '231FA05004.jpg'),
('231FA05005', 'Chaitanya Reddy', 'CSE', 'A', 2, 4, '9100000010', 'chaitanya10@gmail.com', '231FA05005.jpg'),
('231FA07001', 'Rohit Kumar', 'IT', 'A', 2, 4, '9100000011', 'rohit11@gmail.com', '231FA07001.jpg'),
('231FA07002', 'Karthik Reddy', 'IT', 'B', 2, 4, '9100000012', 'karthik12@gmail.com', '231FA07002.jpg'),
('231FA07003', 'Praveen Kumar', 'IT', 'A', 2, 4, '9100000013', 'praveen13@gmail.com', '231FA07003.jpg'),
('231FA07004', 'Harsha Varma', 'IT', 'B', 2, 4, '9100000014', 'harsha14@gmail.com', '231FA07004.jpg'),
('231FA07005', 'Teja Kumar', 'IT', 'A', 2, 4, '9100000015', 'teja15@gmail.com', '231FA07005.jpg'),
('231LA07001', 'Naralasetty Sasi Bhushan', 'IT', 'A', 4, 8, '9618396830', 'sasibhushannaralasetty@gmail.com', '231LA07001.jpg'),
('241FA01001', 'Arjun Kumar', 'MECH', 'A', 1, 2, '9100000016', 'arjun16@gmail.com', '241FA01001.jpg'),
('241FA01002', 'Rakesh Kumar', 'MECH', 'B', 1, 2, '9100000017', 'rakesh17@gmail.com', '241FA01002.jpg'),
('241FA01003', 'Mahesh Reddy', 'MECH', 'A', 1, 2, '9100000018', 'mahesh18@gmail.com', '241FA01003.jpg'),
('241FA01004', 'Vinay Kumar', 'MECH', 'B', 1, 2, '9100000019', 'vinay19@gmail.com', '241FA01004.jpg'),
('241FA01005', 'Manoj Kumar', 'MECH', 'A', 1, 2, '9100000020', 'manoj20@gmail.com', '241FA01005.jpg'),
('241FA01008', 'Rohit Sharma N', 'MECH', 'A', 1, 2, '9345612345', 'rohit.mech24@gmail.com', '241FA01008.jpg'),
('241FA01019', 'Sandeep Kumar P', 'MECH', 'B', 1, 2, '9456123456', 'sandeep.mech24@gmail.com', '241FA01019.jpg'),
('241FA01020', 'Arjun Kumar P', 'MECH', 'A', 1, 2, '9876543223', 'arjun.mech24@gmail.com', '241FA01020.jpg'),
('241FA01021', 'Rakesh Kumar T', 'MECH', 'B', 1, 2, '9876543224', 'rakesh.mech24@gmail.com', '241FA01021.jpg'),
('241FA03006', 'Kiran Kumar', 'ECE', 'A', 1, 2, '9100000021', 'kiran21@gmail.com', '241FA03006.jpg'),
('241FA03007', 'Bhargav Reddy', 'ECE', 'B', 1, 2, '9100000022', 'bhargav22@gmail.com', '241FA03007.jpg'),
('241FA03008', 'Harika Devi', 'ECE', 'A', 1, 2, '9100000023', 'harika23@gmail.com', '241FA03008.jpg'),
('241FA03009', 'Sowmya Sri', 'ECE', 'B', 1, 2, '9100000024', 'sowmya24@gmail.com', '241FA03009.jpg'),
('241FA03010', 'Naveen Kumar', 'ECE', 'A', 1, 2, '9100000025', 'naveen25@gmail.com', '241FA03010.jpg'),
('241FA05006', 'Rohith Kumar', 'CSE', 'A', 1, 2, '9100000026', 'rohith26@gmail.com', '241FA05006.jpg'),
('241FA05007', 'Ajith Kumar', 'CSE', 'B', 1, 2, '9100000027', 'ajith27@gmail.com', '241FA05007.jpg'),
('241FA05008', 'Deepak Kumar', 'CSE', 'A', 1, 2, '9100000028', 'deepak28@gmail.com', '241FA05008.jpg'),
('241FA05009', 'Tarun Kumar', 'CSE', 'B', 1, 2, '9100000029', 'tarun29@gmail.com', '241FA05009.jpg'),
('241FA05010', 'Nikhil Reddy', 'CSE', 'A', 1, 2, '9100000030', 'nikhil30@gmail.com', '241FA05010.jpg'),
('241FA07006', 'Sai Teja', 'IT', 'A', 1, 2, '9100000031', 'saiteja31@gmail.com', '241FA07006.jpg'),
('241FA07007', 'Pranay Kumar', 'IT', 'B', 1, 2, '9100000032', 'pranay32@gmail.com', '241FA07007.jpg'),
('241FA07008', 'Ravi Teja', 'IT', 'A', 1, 2, '9100000033', 'raviteja33@gmail.com', '241FA07008.jpg'),
('241FA07009', 'Karthik Varma', 'IT', 'B', 1, 2, '9100000034', 'karthik34@gmail.com', '241FA07009.jpg'),
('241FA07010', 'Vamsi Krishna', 'IT', 'A', 1, 2, '9100000035', 'vamsi35@gmail.com', '241FA07010.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `transport_admins`
--

CREATE TABLE `transport_admins` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'Transport Officer',
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport_admins`
--

INSERT INTO `transport_admins` (`admin_id`, `username`, `password`, `name`, `role`, `email`, `phone`, `status`, `created_at`) VALUES
(1, 'transport_admin', 'admin123', 'Ramesh Kumar', 'Transport Officer', 'transport@college.edu', '9876543210', 'Active', '2026-02-04 06:03:30');

-- --------------------------------------------------------

--
-- Table structure for table `transport_fees`
--

CREATE TABLE `transport_fees` (
  `fee_id` int(11) NOT NULL,
  `city` varchar(100) NOT NULL,
  `route` varchar(100) NOT NULL,
  `total_fee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport_fees`
--

INSERT INTO `transport_fees` (`fee_id`, `city`, `route`, `total_fee`) VALUES
(1, 'Guntur', 'Guntur - College', 25000.00),
(2, 'Tenali', 'Tenali - College', 22000.00),
(3, 'Vijayawada', 'Vijayawada - College', 40000.00),
(4, 'Chilakaluripeta', 'Chilakaluripeta - College', 45000.00);

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

CREATE TABLE `trips` (
  `trip_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `trip_type` enum('Morning','Evening') NOT NULL,
  `trip_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trips`
--

INSERT INTO `trips` (`trip_id`, `bus_id`, `route_id`, `trip_type`, `trip_time`) VALUES
(1, 1, 1, 'Morning', '07:00:00'),
(2, 1, 1, 'Evening', '16:15:00'),
(3, 2, 2, 'Morning', '07:00:00'),
(4, 2, 2, 'Evening', '16:15:00'),
(5, 3, 3, 'Morning', '07:00:00'),
(6, 3, 3, 'Evening', '16:15:00'),
(7, 4, 4, 'Morning', '07:00:00'),
(8, 4, 4, 'Evening', '16:15:00'),
(9, 5, 5, 'Morning', '07:00:00'),
(10, 5, 5, 'Evening', '16:15:00'),
(11, 8, 6, 'Morning', '06:00:00'),
(12, 8, 6, 'Evening', '16:15:00'),
(13, 9, 7, 'Morning', '06:00:00'),
(14, 9, 7, 'Evening', '16:15:00'),
(15, 10, 8, 'Morning', '06:00:00'),
(16, 10, 8, 'Evening', '16:15:00'),
(17, 12, 9, 'Morning', '06:00:00'),
(18, 12, 9, 'Evening', '16:15:00'),
(19, 13, 10, 'Morning', '06:00:00'),
(20, 13, 10, 'Evening', '16:15:00'),
(21, 14, 11, 'Morning', '06:00:00'),
(22, 14, 11, 'Evening', '16:15:00'),
(23, 15, 12, 'Morning', '06:00:00'),
(24, 15, 12, 'Evening', '16:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `workers`
--

CREATE TABLE `workers` (
  `worker_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('Helper','Cleaner','Attender') NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `status` enum('Available','Assigned','Inactive') DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workers`
--

INSERT INTO `workers` (`worker_id`, `name`, `role`, `phone`, `status`, `created_at`) VALUES
(1, 'Chanikya', 'Helper', '+919877543245', 'Available', '2026-02-12 04:45:00'),
(2, 'Sandeep', 'Cleaner', '+919812345671', 'Available', '2026-02-12 04:45:00'),
(3, 'Venkatesh', 'Attender', '+919823456782', 'Available', '2026-02-12 04:45:00'),
(4, 'Naresh', 'Helper', '+919834567893', 'Available', '2026-02-12 04:45:00'),
(5, 'Prakash', 'Cleaner', '+919845678904', 'Available', '2026-02-12 04:45:00'),
(6, 'Rohit', 'Attender', '+919856789015', 'Available', '2026-02-12 04:45:00'),
(7, 'Vijay', 'Helper', '+919867890126', 'Available', '2026-02-12 04:45:00'),
(8, 'Arvind', 'Cleaner', '+919878901237', 'Available', '2026-02-12 04:45:00'),
(9, 'Lokesh', 'Attender', '+919889012348', 'Available', '2026-02-12 04:45:00'),
(10, 'Siva', 'Helper', '+919890123459', 'Available', '2026-02-12 04:45:00'),
(11, 'Karthik', 'Cleaner', '+919901234560', 'Available', '2026-02-12 04:45:00'),
(12, 'Mahender', 'Attender', '+919912345671', 'Available', '2026-02-12 04:45:00'),
(13, 'Ramesh', 'Helper', '+919923456782', 'Available', '2026-02-12 04:45:00'),
(14, 'Harish', 'Cleaner', '+919934567893', 'Available', '2026-02-12 04:45:00'),
(15, 'Anand', 'Attender', '+919945678904', 'Assigned', '2026-02-12 04:45:00'),
(16, 'Teja', 'Helper', '+919956789015', 'Available', '2026-02-12 04:45:00'),
(17, 'Kiran Kumar', 'Cleaner', '+919967890126', 'Available', '2026-02-12 04:45:00'),
(18, 'Manoj', 'Attender', '+919978901237', 'Available', '2026-02-12 04:45:00'),
(19, 'Suresh', 'Helper', '+919989012348', 'Available', '2026-02-12 04:45:00'),
(20, 'Ravi Teja', 'Cleaner', '+919990123459', 'Available', '2026-02-12 04:45:00'),
(21, 'chandu', 'Helper', '+915643246578', 'Available', '2026-02-12 06:49:55'),
(22, 'Sasi Kumar', 'Attender', '+919852452615', 'Available', '2026-02-18 05:23:16'),
(23, 'Teja', 'Helper', '+919877432345', 'Available', '2026-02-20 06:02:33'),
(24, 'RAJU O', 'Attender', '+917798654323', 'Available', '2026-02-23 06:06:47'),
(25, 'Gopal', 'Attender', '+919877652345', 'Available', '2026-02-24 04:50:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buses`
--
ALTER TABLE `buses`
  ADD PRIMARY KEY (`bus_id`),
  ADD UNIQUE KEY `uk_bus_number` (`bus_number`);

--
-- Indexes for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `fk_assignment_driver` (`driver_id`),
  ADD KEY `fk_assignment_worker` (`worker_id`),
  ADD KEY `fk_assignment_bus` (`bus_id`);

--
-- Indexes for table `bus_inspection`
--
ALTER TABLE `bus_inspection`
  ADD PRIMARY KEY (`inspection_id`),
  ADD KEY `idx_bus_id` (`bus_id`);

--
-- Indexes for table `bus_insurance`
--
ALTER TABLE `bus_insurance`
  ADD PRIMARY KEY (`insurance_id`),
  ADD KEY `idx_bus_id` (`bus_id`);

--
-- Indexes for table `bus_passes`
--
ALTER TABLE `bus_passes`
  ADD PRIMARY KEY (`pass_id`),
  ADD KEY `fk_buspass_student` (`reg_no`),
  ADD KEY `fk_buspass_fee` (`fee_id`);

--
-- Indexes for table `bus_pass_payments`
--
ALTER TABLE `bus_pass_payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_student` (`reg_no`),
  ADD KEY `fk_payment_pass` (`pass_id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driver_id`),
  ADD UNIQUE KEY `license_no` (`license_no`);

--
-- Indexes for table `fuel_logs`
--
ALTER TABLE `fuel_logs`
  ADD PRIMARY KEY (`fuel_id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `maintenance_expenses`
--
ALTER TABLE `maintenance_expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`route_id`),
  ADD UNIQUE KEY `uk_route_number` (`route_number`),
  ADD KEY `idx_bus_id` (`bus_id`);

--
-- Indexes for table `service_records`
--
ALTER TABLE `service_records`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`reg_no`);

--
-- Indexes for table `transport_admins`
--
ALTER TABLE `transport_admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `transport_fees`
--
ALTER TABLE `transport_fees`
  ADD PRIMARY KEY (`fee_id`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`trip_id`),
  ADD UNIQUE KEY `uk_bus_trip` (`bus_id`,`trip_type`),
  ADD KEY `idx_route` (`route_id`);

--
-- Indexes for table `workers`
--
ALTER TABLE `workers`
  ADD PRIMARY KEY (`worker_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buses`
--
ALTER TABLE `buses`
  MODIFY `bus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `bus_inspection`
--
ALTER TABLE `bus_inspection`
  MODIFY `inspection_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `bus_insurance`
--
ALTER TABLE `bus_insurance`
  MODIFY `insurance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `bus_passes`
--
ALTER TABLE `bus_passes`
  MODIFY `pass_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bus_pass_payments`
--
ALTER TABLE `bus_pass_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `fuel_logs`
--
ALTER TABLE `fuel_logs`
  MODIFY `fuel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `maintenance_expenses`
--
ALTER TABLE `maintenance_expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `service_records`
--
ALTER TABLE `service_records`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transport_admins`
--
ALTER TABLE `transport_admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transport_fees`
--
ALTER TABLE `transport_fees`
  MODIFY `fee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `trips`
--
ALTER TABLE `trips`
  MODIFY `trip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `workers`
--
ALTER TABLE `workers`
  MODIFY `worker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  ADD CONSTRAINT `fk_assignment_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignment_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_assignment_worker` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`worker_id`) ON DELETE SET NULL;

--
-- Constraints for table `bus_passes`
--
ALTER TABLE `bus_passes`
  ADD CONSTRAINT `fk_buspass_fee` FOREIGN KEY (`fee_id`) REFERENCES `transport_fees` (`fee_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_buspass_student` FOREIGN KEY (`reg_no`) REFERENCES `students` (`reg_no`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `bus_pass_payments`
--
ALTER TABLE `bus_pass_payments`
  ADD CONSTRAINT `fk_payment_pass` FOREIGN KEY (`pass_id`) REFERENCES `bus_passes` (`pass_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_student` FOREIGN KEY (`reg_no`) REFERENCES `students` (`reg_no`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fuel_logs`
--
ALTER TABLE `fuel_logs`
  ADD CONSTRAINT `fk_bus_fuel` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`);

--
-- Constraints for table `maintenance_expenses`
--
ALTER TABLE `maintenance_expenses`
  ADD CONSTRAINT `fk_expense_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`);

--
-- Constraints for table `service_records`
--
ALTER TABLE `service_records`
  ADD CONSTRAINT `fk_service_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
