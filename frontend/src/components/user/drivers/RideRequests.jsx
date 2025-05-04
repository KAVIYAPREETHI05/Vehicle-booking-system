import React, { useEffect, useState } from "react";
import "../../../css/user/drivers/rideRequests.css"; // Optional if you want to style it

const RideRequests = () => {
  const [requests, setRequests] = useState([]);

  // Fetching the initial list of requests
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings from the backend
  const fetchBookings = () => {
    fetch("http://localhost:5000/bookings")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching ride requests:", err));
  };

  const handleAccept = (id) => {
    const confirmAccept = window.confirm("Are you sure you want to accept this booking?");
    if (confirmAccept) {
      const acceptedRide = requests.find((r) => r.id === id);
  
      // First, send the ride to accepted-bookings
      fetch("http://localhost:5000/accepted-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(acceptedRide),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to move to accepted rides");
          // Now delete from the bookings list
          return fetch(`http://localhost:5000/bookings/${id}`, {
            method: "DELETE",
          });
        })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete from ride requests");
          console.log("Ride moved to accepted rides successfully");
          // Update UI
          fetchBookings();
        })
        .catch((err) => {
          console.error("Error processing booking:", err);
        });
    }
  };
  
  

  return (
    <div className="ride-requests">
      <h2>🚗 Ride Requests</h2>
      {requests.length > 0 ? (
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Place</th>
              <th>Reason</th>
              <th>Timing</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.vehicleId}</td>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.place}</td>
                <td>{request.reason}</td>
                <td>{request.timing}</td>
                <td>
                  <button className="accept-btn" onClick={() => handleAccept(request.id)}>
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ride requests available.</p>
      )}
    </div>
  );
};

export default RideRequests;
