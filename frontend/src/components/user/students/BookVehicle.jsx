import React, { useState } from "react";
import '../../../css/user/students/bookVehicle.css'

const BookVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    name: "",
    email: "",
    place: "",
    reason: "",
    timing: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Details:", formData);
    alert("Vehicle booked successfully!");
  };

  return (
    <div className="book-vehicle-container">
      <h3>Book a Vehicle</h3>
      <p>Select a vehicle and schedule your trip.</p>

      <form onSubmit={handleSubmit} className="book-vehicle-form">
        <label>Vehicle ID:</label>
        <input
          type="text"
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          required
        />

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
        />

        <label>Place:</label>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
          required
        />

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
