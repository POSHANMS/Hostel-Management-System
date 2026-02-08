const express = require("express");
const router = express.Router();
const db = require("../db");

// ========================================
// GET ADMIN PROFILE
// ========================================
router.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  
  db.query("SELECT * FROM admins WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Admin not found" });
    
    const admin = results[0];
    delete admin.password;
    
    res.json({ 
      success: true, 
      data: admin  // Return full admin object
    });
  });
});

// ========================================
// UPDATE ADMIN PROFILE
// ========================================
router.put("/profile/:id", (req, res) => {
  const { id } = req.params;
  const { full_name, phone, email } = req.body;
  
  const sql = "UPDATE admins SET full_name = ?, phone = ?, email = ? WHERE id = ?";
  
  db.query(sql, [full_name, phone, email, id], (err) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ success: false, message: "Update failed: " + err.message });
    }
    res.json({ success: true, message: "Profile updated successfully" });
  });
});

// ========================================
// CHANGE ADMIN PASSWORD
// ========================================
router.put("/profile/:id/password", (req, res) => {
  const { id } = req.params;
  const { current_password, new_password } = req.body;
  
  // Verify current password
  db.query("SELECT password FROM admins WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Admin not found" });
    
    if (results[0].password !== current_password) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }
    
    // Update password
    db.query("UPDATE admins SET password = ? WHERE id = ?", [new_password, id], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Password update failed" });
      res.json({ success: true, message: "Password updated successfully" });
    });
  });
});

// ========================================
// ADD NEW STUDENT
// ========================================
router.post("/students/add", (req, res) => {
  const { username, email, full_name, phone, course, year, guardian_name, guardian_phone, address } = req.body;
  
  const password = 'student123';
  
  const sql = `
    INSERT INTO students (username, email, password, full_name, phone, course, year, guardian_name, guardian_phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, [username, email, password, full_name, phone, course, year, guardian_name, guardian_phone, address], (err, result) => {
    if (err) {
      console.error("Add student error:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: "Username or email already exists" });
      }
      return res.status(500).json({ success: false, message: "Failed to add student: " + err.message });
    }
    
    res.json({ 
      success: true, 
      message: "Student added successfully with default password: student123",
      student_id: result.insertId 
    });
  });
});

// ========================================
// GET ALL STUDENTS
// ========================================
router.get("/students", (req, res) => {
  const sql = `
    SELECT s.*, r.room_number, r.room_type
    FROM students s
    LEFT JOIN rooms r ON s.room_id = r.id
    ORDER BY s.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get students error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, data: results });
  });
});

// ========================================
// CREATE NEW ROOM
// ========================================
router.post("/rooms/create", (req, res) => {
  const { room_number, capacity, floor, room_type, rent } = req.body;
  
  const finalRent = rent || 5000.00;  // Default rent
  
  const sql = "INSERT INTO rooms (room_number, capacity, floor, room_type, rent, status) VALUES (?, ?, ?, ?, ?, 'Active')";
  
  db.query(sql, [room_number, capacity, floor, room_type, finalRent], (err, result) => {
    if (err) {
      console.error("Create room error:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: "Room number already exists" });
      }
      return res.status(500).json({ success: false, message: "Failed to create room: " + err.message });
    }
    
    res.json({ 
      success: true, 
      message: "Room created successfully",
      room_id: result.insertId 
    });
  });
});

// ========================================
// GET ALL ROOMS
// ========================================
router.get("/rooms", (req, res) => {
  db.query("SELECT * FROM rooms ORDER BY room_number", (err, results) => {
    if (err) {
      console.error("Get rooms error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, data: results });
  });
});

// ========================================
// GET AVAILABLE ROOMS (for assign room page)
// ========================================
router.get("/rooms/available", (req, res) => {
  const sql = "SELECT * FROM rooms WHERE occupied < capacity AND status = 'Active' ORDER BY room_number";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get available rooms error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, data: results });
  });
});

// ========================================
// ASSIGN ROOM TO STUDENT
// ========================================
router.post("/assign-room", (req, res) => {
  const { student_id, room_id } = req.body;
  
  // Check if student already has a room
  db.query("SELECT room_id FROM students WHERE id = ?", [student_id], (err, studentResults) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (studentResults.length === 0) return res.status(404).json({ success: false, message: "Student not found" });
    
    const oldRoomId = studentResults[0].room_id;
    
    // Check if new room has space
    db.query("SELECT * FROM rooms WHERE id = ?", [room_id], (err, rooms) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      if (rooms.length === 0) return res.status(404).json({ success: false, message: "Room not found" });
      
      const room = rooms[0];
      
      if (room.occupied >= room.capacity) {
        return res.status(400).json({ success: false, message: "Room is full" });
      }
      
      // Assign room
      db.query("UPDATE students SET room_id = ? WHERE id = ?", [room_id, student_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Assignment failed" });
        
        // Decrease old room occupancy if exists
        if (oldRoomId) {
          db.query("UPDATE rooms SET occupied = occupied - 1 WHERE id = ?", [oldRoomId], () => {});
        }
        
        // Increase new room occupancy
        db.query("UPDATE rooms SET occupied = occupied + 1 WHERE id = ?", [room_id], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Failed to update occupancy" });
          
          res.json({ success: true, message: "Room assigned successfully" });
        });
      });
    });
  });
});

// ========================================
// GET ALL PAYMENTS
// ========================================
router.get("/payments", (req, res) => {
  const sql = `
    SELECT p.*, s.full_name, s.email, s.phone, r.room_number
    FROM payments p
    JOIN students s ON p.student_id = s.id
    LEFT JOIN rooms r ON s.room_id = r.id
    ORDER BY p.due_date DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get payments error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, data: results });
  });
});

// ========================================
// CREATE NEW PAYMENT
// ========================================
router.post("/payments/create", (req, res) => {
  const { student_id, amount, month, year, due_date, status } = req.body;
  
  console.log('Creating payment with data:', { student_id, amount, month, year, due_date, status });
  
  // Validate required fields
  if (!student_id || !amount || !month || !year || !due_date) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields" 
    });
  }
  
  // If status is "Paid", set paid_date to today
  const paid_date = (status === 'Paid') ? new Date().toISOString().split('T')[0] : null;
  
  const sql = `
    INSERT INTO payments (student_id, amount, month, year, due_date, status, paid_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, [student_id, amount, month, year, due_date, status || 'Pending', paid_date], (err, result) => {
    if (err) {
      console.error("Create payment error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to create payment: " + err.message 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Payment created successfully",
      payment_id: result.insertId 
    });
  });
});

// ========================================
// UPDATE PAYMENT STATUS
// ========================================
router.put("/payments/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const paid_date = status === 'Paid' ? new Date().toISOString().split('T')[0] : null;
  
  const sql = "UPDATE payments SET status = ?, paid_date = ? WHERE id = ?";
  
  db.query(sql, [status, paid_date, id], (err) => {
    if (err) {
      console.error("Update payment error:", err);
      return res.status(500).json({ success: false, message: "Update failed: " + err.message });
    }
    res.json({ success: true, message: "Payment status updated successfully" });
  });
});

// ========================================
// GET ALL COMPLAINTS
// ========================================
router.get("/complaints", (req, res) => {
  const sql = `
    SELECT c.*, s.full_name, s.email, r.room_number
    FROM complaints c
    JOIN students s ON c.student_id = s.id
    LEFT JOIN rooms r ON s.room_id = r.id
    ORDER BY c.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get complaints error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, data: results });
  });
});

// ========================================
// UPDATE COMPLAINT STATUS
// ========================================
router.put("/complaints/:id", (req, res) => {
  const { id } = req.params;
  const { status, admin_response } = req.body;
  
  const sql = "UPDATE complaints SET status = ?, admin_response = ? WHERE id = ?";
  
  db.query(sql, [status, admin_response || '', id], (err) => {
    if (err) {
      console.error("Update complaint error:", err);
      return res.status(500).json({ success: false, message: "Update failed: " + err.message });
    }
    res.json({ success: true, message: "Complaint updated successfully" });
  });
});

// ========================================
// GET DASHBOARD STATS
// ========================================
router.get("/dashboard/stats", (req, res) => {
  const queries = {
    totalStudents: "SELECT COUNT(*) as count FROM students",
    totalRooms: "SELECT COUNT(*) as count FROM rooms",
    occupiedRooms: "SELECT COUNT(*) as count FROM rooms WHERE occupied > 0",
    availableRooms: "SELECT COUNT(*) as count FROM rooms WHERE occupied < capacity",
    pendingPayments: "SELECT COUNT(*) as count FROM payments WHERE status = 'Pending'",
    pendingComplaints: "SELECT COUNT(*) as count FROM complaints WHERE status = 'Pending'"
  };
  
  const stats = {};
  let completed = 0;
  
  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, results) => {
      if (!err) {
        stats[key] = results[0].count;
      } else {
        stats[key] = 0;
      }
      completed++;
      
      if (completed === Object.keys(queries).length) {
        res.json({ success: true, data: stats });
      }
    });
  });
});

module.exports = router;
