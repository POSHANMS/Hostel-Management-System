const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "🏠 Hostel Management System API",
    status: "Running",
    version: "1.0.0"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
