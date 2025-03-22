import React, { useState } from "react";

const RideRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, user: "John Doe", pickup: "College Gate", drop: "City Hospital" },
    { id: 2, user: "Jane Smith", pickup: "Library", drop: "Bus Station" },
  ]);

  return (
    <div className="ride-requests">
      <h2>Ride Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <strong>{request.user}</strong> - From {request.pickup} to {request.drop}
            <button>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RideRequests;
