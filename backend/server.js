const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kaviya@05",
    database: "vehicleBooking"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL Database!");
    }
});

// 1️⃣ Add Vehicle Endpoint (POST)
app.post("/add-vehicle", (req, res) => {
    const { vehicleNo, vehicleName, driver, seatingCapacity, vehicleNumber, status } = req.body;

    if (!vehicleNo || !vehicleName || !driver || !seatingCapacity || !vehicleNumber || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const vehicleNoInt = parseInt(vehicleNo, 10);
    const seatingCapacityInt = parseInt(seatingCapacity, 10);

    if (isNaN(vehicleNoInt) || isNaN(seatingCapacityInt)) {
        return res.status(400).json({ error: "Invalid number format for vehicleNo or seatingCapacity" });
    }

    const sql = `
        INSERT INTO vehicles (vehicleNo, vehicleName, driver, seatingCapacity, vehicleNumber, status) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [vehicleNoInt, vehicleName, driver, seatingCapacityInt, vehicleNumber, status], (err, result) => {
        if (err) {
            console.error("❌ Error inserting data:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        console.log("✅ Vehicle added:", result);
        res.status(201).json({ message: "Vehicle added successfully!" });
    });
});

// 2️⃣ Get All Vehicles Endpoint (GET)
app.get("/vehicles", (req, res) => {
    const sql = "SELECT * FROM vehicles";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching vehicles:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
