const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pkpkpk", // CHANGE THIS TO YOUR MYSQL PASSWORD
  database: "hostel_management",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

module.exports = db;
