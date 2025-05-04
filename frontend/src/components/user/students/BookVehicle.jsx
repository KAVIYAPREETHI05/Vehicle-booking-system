import React, { useEffect, useState } from "react";
import "../../../css/user/students/bookVehicle.css";

const BookVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    name: "",
    email: "",
    place: "",
    reason: "",
    timing: "",
  });

  const [availableVehicles, setAvailableVehicles] = useState([]);

  const places = [
    "IB front", "IB back", "AS front", "AS back", "girls hostel", "boys hostel",
    "football ground", "basketball ground", "research park", "sf block",
    "mech block", "cafeteria", "library", "main gate", "gate B", "gate C", "main auditorium"
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles/available")
      .then(res => res.json())
      .then(data => setAvailableVehicles(data))
      .catch(err => console.error("Failed to fetch vehicles", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.endsWith("@bitsathy.ac.in")) {
      alert("Email must be a valid bitsathy.ac.in address.");
      return;
    }

    const selectedTime = new Date(`1970-01-01T${formData.timing}`);
    const now = new Date();
    const currentTime = new Date(`1970-01-01T${now.toTimeString().slice(0, 5)}`);

    if (selectedTime <= currentTime) {
      alert("Please select a future timing.");
      return;
    }

    // ✅ Submit form to backend
    fetch("http://localhost:5000/book-vehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to book vehicle");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Booking successful:", data);
        alert("Vehicle booked successfully!");
        setFormData({
          vehicleId: "",
          name: "",
          email: "",
          place: "",
          reason: "",
          timing: "",
        });
      })
      .catch((err) => {
        console.error("❌ Booking error:", err);
        alert("Something went wrong while booking.");
      });
  };

  return (
    <div className="book-vehicle-container">
      <h3>Book a Vehicle</h3>
      <p>Select a vehicle and schedule your trip.</p>

      <form onSubmit={handleSubmit} className="book-vehicle-form">
        <label>Vehicle ID:</label>
        <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
          <option value="">-- Select a Vehicle --</option>
          {availableVehicles.map((vehicle) => (
            <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
              {vehicle.vehicleId} - {vehicle.vehicleName}
            </option>
          ))}
        </select>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email ID:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="yourname@bitsathy.ac.in"
        />

        <label>Place:</label>
        <select name="place" value={formData.place} onChange={handleChange} required>
          <option value="">-- Select Place --</option>
          {places.map((place, index) => (
            <option key={index} value={place}>{place}</option>
          ))}
        </select>

        <label>Reason:</label>
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <label>Timing:</label>
        <input
          type="time"
          name="timing"
          value={formData.timing}
          onChange={handleChange}
          required
        />

        <button type="submit" className="book-btn">Book Vehicle</button>
      </form>
    </div>
  );
};

export default BookVehicle;
