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
  
    // Function to get time range
    const getTimeSlotRange = (slot) => {
      switch (slot) {
        case "Early Morning":
          return ["07:00:00", "09:00:00"];
        case "Morning":
          return ["09:00:00", "12:00:00"];
        case "Afternoon":
          return ["12:00:00", "16:00:00"];
        case "Evening":
          return ["16:00:00", "20:00:00"];
        default:
          return [null, null];
      }
    };
  
    const [startTime, endTime] = getTimeSlotRange(timingSlot);
  
    if (!startTime || !endTime) {
      return res.status(400).json({ error: "Invalid timing slot selected" });
    }
  
    // Insert assignment into driver_management table with startTime and endTime
    const sql = `
      INSERT INTO driver_management (vehicleNo, driverName, timingSlot, startTime, endTime) 
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(sql, [vehicleNo, driver, timingSlot, startTime, endTime], (err, result) => {
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
  
          console.log("✅ Driver assigned with timing slot and vehicle updated.");
          res.status(201).json({ message: "Driver assigned successfully!" });
        }
      );
    });
  });

  
// 🧼 Add this block just before app.listen
setInterval(() => {
    const now = new Date().toTimeString().slice(0, 8); // current time in HH:MM:SS
    const sql = "DELETE FROM driver_management WHERE endTime <= ?";
    db.query(sql, [now], (err, result) => {
      if (err) {
        console.error("❌ Error cleaning expired drivers:", err);
      } else if (result.affectedRows > 0) {
        console.log(`🧹 Removed ${result.affectedRows} expired drivers`);
      }
    });
  }, 60 * 1000); // Every minute
  // 3️⃣ Fetch Available Vehicles
app.get("/available-vehicles", (req, res) => {
  const sql = `
      SELECT vehicleNumber AS id, vehicleName AS name 
      FROM vehicles 
      WHERE status = 'Available'
  `;
  
  db.query(sql, (err, result) => {
      if (err) {
          console.error("❌ Error fetching available vehicles:", err);
          return res.status(500).json({ error: "Database error while fetching vehicles" });
      }

      // Optional: If no vehicles are available
      if (result.length === 0) {
          return res.status(404).json({ message: "No available vehicles found" });
      }

      res.status(200).json(result);
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
    const sql = "SELECT vehicleNo, driverName, timingSlot, startTime, endTime FROM driver_management";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching assigned drivers:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  });
  

// Update vehicle status
app.put("/update-vehicle-status/:vehicleNumber", (req, res) => {
    const { vehicleNumber } = req.params;
    const { status } = req.body;

    const sql = "UPDATE vehicles SET status = ? WHERE vehicleNumber = ?";

    db.query(sql, [status, vehicleNumber], (err, result) => {
        if (err) {
            console.error("❌ Error updating vehicle status:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log("✅ Vehicle status updated:", result);
        res.json({ message: "Vehicle status updated successfully!" });
    });
});

// students page

app.get("/api/vehicles/available", (req, res) => {
  const sql = "SELECT vehicleId, vehicleName FROM vehicles WHERE status = 'Available'";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching available vehicles:", err);
      return res.status(500).json({ error: "Failed to fetch vehicles" });
    }
    res.json(results);
  });
});


app.get("/booking-requests", (req, res) => {
  const sql = "SELECT * FROM bookings ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching booking requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ POST Booking
app.post("/book-vehicle", (req, res) => {
  const { vehicleId, name, email, place, reason, timing } = req.body;

  if (!vehicleId || !name || !email || !place || !reason || !timing) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    INSERT INTO bookings (vehicleId, name, email, place, reason, timing, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(sql, [vehicleId, name, email, place, reason, timing], (err, result) => {
    if (err) {
      console.error("❌ Error inserting booking:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "Booking saved successfully!" });
  });
});


// ✅ GET All Bookings for Request Status Page
// GET all bookings for request status
app.get("/request-status", (req, res) => {
  db.query("SELECT * FROM bookings", (err, results) => {
    if (err) {
      console.error("❌ Error fetching bookings:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results); // Should return array of bookings
  });
});



// Cancel booking route
app.put("/cancel-booking/:id", (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body; // should be "Cancelled"

  const query = "UPDATE bookings SET status = ? WHERE id = ?";
  db.query(query, [status, bookingId], (err, result) => {
    if (err) {
      console.error("Error updating booking status:", err);
      return res.status(500).json({ error: "Failed to cancel booking" });
    }
    res.json({ message: "Booking cancelled successfully" });
  });
});

// ride request

app.get("/bookings", (req, res) => {
  const query = `
    SELECT id, vehicleId, name, email, place, reason, timing
    FROM bookings
    WHERE status = 'Pending'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching ride requests:", err);
      return res.status(500).json({ message: "Failed to fetch bookings" });
    }
    res.json(results);
  });
});

app.post('/accepted-bookings', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  const fetchQuery = 'SELECT * FROM bookings WHERE id = ?';
  db.query(fetchQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching booking', details: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = results[0];

    const insertQuery = `
      INSERT INTO accepted_bookings (id, vehicleId, name, email, place, reason, timing)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      booking.id,
      booking.vehicleId,
      booking.name,
      booking.email,
      booking.place,
      booking.reason,
      booking.timing
    ];

    db.query(insertQuery, values, (err2) => {
      if (err2) {
        return res.status(500).json({ error: 'Error inserting into accepted_bookings', details: err2 });
      }

      db.query('DELETE FROM bookings WHERE id = ?', [id], (err3) => {
        if (err3) {
          return res.status(500).json({ error: 'Error deleting from bookings', details: err3 });
        }

        res.status(200).json({ message: 'Booking accepted', acceptedBooking: booking });
      });
    });
  });
});

// This should be in your Express app
app.delete('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const sql = 'DELETE FROM bookings WHERE id = ?';

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("Error deleting booking:", err);
      return res.status(500).json({ error: "Failed to delete booking" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  });
});



// Route to fetch all accepted bookings
app.get('/accepted-bookings', (req, res) => {
  const sql = 'SELECT * FROM accepted_bookings';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching accepted bookings:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json(results);
  });
});

app.post('/accepted-bookings', (req, res) => {
  const { id, vehicleId, name, email, place, reason, timing } = req.body;

  const sql = `
    INSERT INTO accepted_bookings (id, vehicleId, name, email, place, reason, timing)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [id, vehicleId, name, email, place, reason, timing], (err, result) => {
    if (err) {
      console.error('Error inserting accepted booking:', err);
      return res.status(500).json({ error: 'Database insert error' });
    }

    res.status(201).json({ message: 'Ride accepted and saved' });
  });
});



// POST to /completed-bookings and DELETE from accepted-bookings
app.post('/completed-bookings', async (req, res) => {
  const { id, vehicleId, name, email, place, reason, timing } = req.body;

  try {
    const insertSql = `INSERT INTO completed_rides (id, vehicleId, name, email, place, reason, timing) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const deleteSql = `DELETE FROM accepted_bookings WHERE id = ?`;

    await db.execute(insertSql, [id, vehicleId, name, email, place, reason, timing]);
    await db.execute(deleteSql, [id]);

    res.status(200).json({ message: 'Ride moved to completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to complete ride' });
  }
});

app.get("/completed-rides", (req, res) => {
  const sql = "SELECT * FROM completed_rides";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching completed rides:", err);
      return res.status(500).json({ error: "Failed to fetch completed rides" });
    }
    res.json(result);
  });
});

app.post('/completed-rides', (req, res) => {
  const { id, vehicleId, name, email, place, reason, timing } = req.body;

  const insertQuery = `
    INSERT INTO completed_rides (id, vehicleId, name, email, place, reason, timing)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [id, vehicleId, name, email, place, reason, timing], (err, result) => {
    if (err) {
      console.error("Error inserting into completed_rides:", err);
      return res.status(500).json({ error: "Failed to insert completed ride" });
    }

    // ✅ Delete from accepted_bookings after insert
    const deleteQuery = `DELETE FROM accepted_bookings WHERE id = ?`;
    db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting from accepted_bookings:", deleteErr);
        return res.status(500).json({ error: "Ride inserted but not removed from accepted list" });
      }

      res.status(200).json({ message: "Ride moved to completed and removed from accepted list" });
    });
  });
});








// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
