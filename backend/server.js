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

    const sql = `
        INSERT INTO vehicles (vehicleNo, vehicleName, driver, seatingCapacity, vehicleNumber, status) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [vehicleNo, vehicleName, driver, seatingCapacity, vehicleNumber, status], (err, result) => {
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

// 3️⃣ Fetch Available Vehicles
app.get("/available-vehicles", (req, res) => {
    const sql = "SELECT vehicleNumber, vehicleName FROM vehicles WHERE status = 'Available'";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching available vehicles:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});

// 4️⃣ Assign Driver to a Vehicle
app.post("/assign-driver", (req, res) => {
    const { vehicleNo, driver, timingSlot } = req.body;

    if (!vehicleNo || !driver || !timingSlot) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Insert assignment into driver_management table
    const sql = `
        INSERT INTO driver_management (vehicleNo, driverName, timingSlot) 
        VALUES (?, ?, ?)
    `;

    db.query(sql, [vehicleNo, driver, timingSlot], (err, result) => {
        if (err) {
            console.error("❌ Error inserting driver assignment:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        // Update vehicle status to "In Use"
        db.query(
            "UPDATE vehicles SET status = 'In Use' WHERE vehicleNumber = ?",
            [vehicleNo],
            (err) => {
                if (err) {
                    console.error("❌ Error updating vehicle status:", err);
                    return res.status(500).json({ error: "Failed to update vehicle status" });
                }

                console.log("✅ Driver assigned and vehicle updated.");
                res.status(201).json({ message: "Driver assigned successfully!" });
            }
        );
    });
});

// 5️⃣ Fetch Unassigned Drivers (Newly Added)
app.get("/unassigned-drivers", (req, res) => {
    const sql = "SELECT * FROM drivers WHERE assigned = 'No'";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching unassigned drivers:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Hardcoded drivers in case database fails
        const hardcodedDrivers = [
            { id: "d101", name: "Jayaram" },
            { id: "d102", name: "Karthikeyan" },
            { id: "d103", name: "Shrivanth" },
        ];

        // Combine DB results with hardcoded drivers
        res.json([...result, ...hardcodedDrivers]);
    });
});

// 6️⃣ Fetch Assigned Drivers
app.get("/assigned-drivers", (req, res) => {
    const sql = "SELECT * FROM driver_management";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching assigned drivers:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});

// 7️⃣ Update Vehicle Status (Fixed)
app.put("/update-vehicle-status/:vehicleNo", (req, res) => {
    const { vehicleNo } = req.params;
    const { status } = req.body;

    const sql = "UPDATE vehicles SET status = ? WHERE vehicleNumber = ?";
    
    db.query(sql, [status, vehicleNo], (err, result) => {
        if (err) {
            console.error("❌ Error updating vehicle status:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log("✅ Vehicle status updated:", result);
        res.json({ message: "Vehicle status updated successfully!" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
