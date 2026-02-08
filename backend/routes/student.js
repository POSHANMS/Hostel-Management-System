const express = require("express");
const router = express.Router();
const db = require("../db");

// ========================================
// GET STUDENT PROFILE
// ========================================
router.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT s.*, r.room_number, r.room_type, r.floor
    FROM students s
    LEFT JOIN rooms r ON s.room_id = r.id
    WHERE s.id = ?
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Student not found" });
    
    const student = results[0];
    delete student.password; // Don't send password
    res.json({ success: true, student });
  });
});

// ========================================
// UPDATE STUDENT PROFILE
// ========================================
router.put("/profile/:id", (req, res) => {
  const { id } = req.params;
  const { full_name, phone, email } = req.body;
  
  const sql = "UPDATE students SET full_name = ?, phone = ?, email = ? WHERE id = ?";
  
  db.query(sql, [full_name, phone, email, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Update failed" });
    res.json({ success: true, message: "Profile updated successfully" });
  });
});

// ========================================
// RESET PASSWORD
// ========================================
router.put("/reset-password/:id", (req, res) => {
  const { id } = req.params;
  const { old_password, new_password } = req.body;
  
  // Verify old password
  db.query("SELECT password FROM students WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Student not found" });
    
    if (results[0].password !== old_password) {
      return res.status(401).json({ success: false, message: "Incorrect old password" });
    }
    
    // Update password
    db.query("UPDATE students SET password = ? WHERE id = ?", [new_password, id], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Password reset failed" });
      res.json({ success: true, message: "Password reset successfully" });
    });
  });
});

// ========================================
// GET ROOM DETAILS AND ROOMMATES
// ========================================
router.get("/room-details/:student_id", (req, res) => {
  const { student_id } = req.params;
  
  // Get student's room
  db.query("SELECT room_id FROM students WHERE id = ?", [student_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Student not found" });
    
    const room_id = results[0].room_id;
    
    if (!room_id) {
      return res.json({ success: true, room: null, roommates: [] });
    }
    
    // Get room details
    db.query("SELECT * FROM rooms WHERE id = ?", [room_id], (err, roomResults) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      
      // Get roommates
      const sql = `
        SELECT id, full_name, email, phone, course, year
        FROM students
        WHERE room_id = ? AND id != ?
      `;
      
      db.query(sql, [room_id, student_id], (err, roommateResults) => {
        if (err) return res.status(500).json({ success: false, message: "Server error" });
        
        res.json({
          success: true,
          room: roomResults[0],
          roommates: roommateResults
        });
      });
    });
  });
});

// ========================================
// GET PAYMENT DETAILS
// ========================================
router.get("/payments/:student_id", (req, res) => {
  const { student_id } = req.params;
  
  const sql = `
    SELECT * FROM payments
    WHERE student_id = ?
    ORDER BY due_date DESC
  `;
  
  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    res.json({ success: true, payments: results });
  });
});

// ========================================
// SUBMIT COMPLAINT
// ========================================
router.post("/complaints", (req, res) => {
  const { student_id, title, description } = req.body;
  
  const sql = "INSERT INTO complaints (student_id, title, description) VALUES (?, ?, ?)";
  
  db.query(sql, [student_id, title, description], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to submit complaint" });
    
    res.json({ 
      success: true, 
      message: "Complaint submitted successfully",
      complaint_id: result.insertId 
    });
  });
});

// ========================================
// GET STUDENT'S COMPLAINTS
// ========================================
router.get("/complaints/:student_id", (req, res) => {
  const { student_id } = req.params;
  
  const sql = `
    SELECT * FROM complaints
    WHERE student_id = ?
    ORDER BY created_at DESC
  `;
  
  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    res.json({ success: true, complaints: results });
  });
});

module.exports = router;
