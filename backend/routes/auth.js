const express = require("express");
const router = express.Router();
const db = require("../db");

// ========================================
// ADMIN LOGIN
// ========================================
router.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required" 
    });
  }

  const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";
  
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const admin = results[0];
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        phone: admin.phone,
        role: "admin"
      }
    });
  });
});

// ========================================
// STUDENT LOGIN
// ========================================
router.post("/student/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required" 
    });
  }

  const sql = `
    SELECT s.*, r.room_number 
    FROM students s
    LEFT JOIN rooms r ON s.room_id = r.id
    WHERE s.email = ? AND s.password = ?
  `;
  
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const student = results[0];
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: student.id,
        username: student.username,
        email: student.email,
        full_name: student.full_name,
        phone: student.phone,
        course: student.course,
        year: student.year,
        room_id: student.room_id,
        room_number: student.room_number,
        role: "student"
      }
    });
  });
});

module.exports = router;
