import React, { useEffect, useState } from "react";
import "../../../css/user/students/requestStatus.css";

const RequestStatus = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/request-status") // Fetch all booking requests
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching booking requests:", err));
  }, []);

  const handleCancel = (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (confirmCancel) {
      fetch(`http://localhost:5000/cancel-booking/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Cancelled" }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to cancel booking");
          }
          // Update frontend list without refetch
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req.id === id ? { ...req, status: "Cancelled" } : req
            )
          );
          alert("Booking cancelled successfully ✅");
        })
        .catch((err) => console.error("Error cancelling booking:", err));
    }
  };

  return (
    <div className="request-status-container">
      <h1>🔄 Request Status</h1>
      <p>Check the status of your booking requests.</p>

      <table className="status-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Vehicle ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Place</th>
            <th>Reason</th>
            <th>Timing</th>
            <th>Status</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.vehicleId}</td>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.place}</td>
                <td>{req.reason}</td>
                <td>{req.timing}</td>
                <td>
                  <button className={`status-btn ${req.status.toLowerCase()}`}>
                    {req.status}
                  </button>
                </td>
                <td>
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(req.id)}
                    disabled={req.status.toLowerCase() !== "pending"} 
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestStatus;
