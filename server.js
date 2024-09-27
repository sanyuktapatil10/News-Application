const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() to parse JSON requests

// Create connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MySQL512501509@",
  database: "user_management",
});z

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Register route
app.post("/api/register", (req, res) => {
  const { username, email, password, mobile } = req.body;

  const sql =
    "INSERT INTO accounts (username, email, password, mobile) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, password, mobile], (err, result) => {
    if (err) {
      console.error("Error during registration:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  });
});

// Login route
app.post("/api/login", (req, res) => {
  // Change to POST
  const { username, password } = req.body;

  const sql = "SELECT * FROM accounts WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.status(200).json({ message: "Login successful", user: results[0] });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
