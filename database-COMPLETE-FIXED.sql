-- ========================================
-- HOSTEL MANAGEMENT SYSTEM - COMPLETE FIXED DATABASE
-- All tables in correct order + All missing columns added
-- ========================================

DROP DATABASE IF EXISTS hostel_management;
CREATE DATABASE hostel_management;
USE hostel_management;

-- ========================================
-- ROOMS TABLE (FIRST - others reference it)
-- ========================================
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INT NOT NULL,
    occupied INT DEFAULT 0,
    floor INT,
    room_type VARCHAR(50),
    rent DECIMAL(10,2) DEFAULT 5000.00,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample rooms with rent
INSERT INTO rooms (room_number, capacity, floor, room_type, rent, status) VALUES
('101', 4, 1, 'Shared', 3000.00, 'Active'),
('102', 4, 1, 'Shared', 3000.00, 'Active'),
('103', 2, 1, 'Double', 4500.00, 'Active'),
('201', 4, 2, 'Shared', 3500.00, 'Active'),
('202', 2, 2, 'Double', 5000.00, 'Active'),
('203', 1, 2, 'Single', 7000.00, 'Active');

-- ========================================
-- ADMINS TABLE
-- ========================================
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin
INSERT INTO admins (username, email, password, full_name, phone) 
VALUES ('admin', 'admin@hostel.com', 'admin123', 'System Administrator', '9999999999');

-- ========================================
-- STUDENTS TABLE (with guardian info and address)
-- ========================================
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    course VARCHAR(100),
    year INT,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(15),
    address TEXT,
    room_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- Sample students
INSERT INTO students (username, email, password, full_name, phone, course, year, guardian_name, guardian_phone, address, room_id) VALUES
('raj123', 'raj@gmail.com', 'hostel123', 'Raj Kumar', '9876543210', 'Computer Science', 2, 'Mr. Kumar', '9876543200', '123 Main St, City', 1),
('rajesh456', 'rajesh@gmail.com', 'hostel123', 'Rajesh Sharma', '9876543211', 'Mechanical', 3, 'Mrs. Sharma', '9876543201', '456 Park Ave, City', 1),
('amit789', 'amit@gmail.com', 'hostel123', 'Amit Patel', '9876543212', 'Electronics', 1, 'Mr. Patel', '9876543202', '789 Oak Rd, City', 2);

-- Update room occupancy
UPDATE rooms SET occupied = 2 WHERE id = 1;
UPDATE rooms SET occupied = 1 WHERE id = 2;

-- ========================================
-- PAYMENTS TABLE
-- ========================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',
    month VARCHAR(20),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Sample payments
INSERT INTO payments (student_id, amount, due_date, status, month, year) VALUES
(1, 5000.00, '2026-02-10', 'Paid', 'February', 2026),
(2, 5000.00, '2026-02-10', 'Pending', 'February', 2026),
(3, 5000.00, '2026-02-10', 'Pending', 'February', 2026),
(1, 5000.00, '2026-03-10', 'Pending', 'March', 2026);

-- ========================================
-- COMPLAINTS TABLE (with category)
-- ========================================
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Sample complaints
INSERT INTO complaints (student_id, category, title, description) VALUES
(1, 'Maintenance', 'AC Not Working', 'The air conditioner in room 101 has stopped working since yesterday.'),
(2, 'Utilities', 'Water Supply Issue', 'No water supply in the morning from 6 AM to 8 AM.'),
(3, 'General', 'Noise Complaint', 'Loud music from neighboring room disturbing studies.');

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
SELECT '✅ DATABASE SETUP COMPLETE!' AS Status;
SELECT '' AS '';

SELECT '=== ADMINS ===' AS Info;
SELECT id, username, email, full_name, phone FROM admins;
SELECT '' AS '';

SELECT '=== ROOMS (with rent & status) ===' AS Info;
SELECT id, room_number, capacity, occupied, floor, room_type, rent, status FROM rooms;
SELECT '' AS '';

SELECT '=== STUDENTS (with guardian info) ===' AS Info;
SELECT id, username, full_name, email, course, year, guardian_name, room_id FROM students;
SELECT '' AS '';

SELECT '=== PAYMENTS ===' AS Info;
SELECT p.id, s.full_name as student, p.amount, p.status, p.month, p.year 
FROM payments p 
JOIN students s ON p.student_id = s.id;
SELECT '' AS '';

SELECT '=== COMPLAINTS (with category) ===' AS Info;
SELECT c.id, s.full_name as student, c.category, c.title, c.status, DATE(c.created_at) as date
FROM complaints c 
JOIN students s ON c.student_id = s.id;

UPDATE students
SET email = 'rajesh@gmail.com'
WHERE username = 'rajesh456';