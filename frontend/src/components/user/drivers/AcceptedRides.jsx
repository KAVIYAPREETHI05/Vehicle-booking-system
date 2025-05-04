import React, { useEffect, useState } from "react";
import '../../../css/user/drivers/acceptedRides.css';

const AcceptedRides = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/accepted-bookings")
      .then((res) => res.json())
      .then((data) => setRides(data))
      .catch((err) => console.error("Error fetching accepted rides:", err));
  }, []);

  const handleMarkCompleted = (ride) => {
    fetch("http://localhost:5000/completed-rides", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ride),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to move to completed rides");
        }
        return res.json();
      })
      .then(() => {
        // Remove the ride from accepted list locally
        setRides((prevRides) => prevRides.filter((r) => r.id !== ride.id));
      })
      .catch((err) => console.error("Error moving ride to completed:", err));
  };

  const handleAcceptRide = (ride) => {
    fetch("http://localhost:5000/accepted-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ride),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to accept ride");
        }
        return res.json();
      })
      .then(() => {
        setRides((prevRides) => [...prevRides, ride]);
      })
      .catch((err) => console.error("Error accepting ride:", err));
  };

  return (
    <div className="accepted-rides">
      <h2>🚗 Accepted Rides</h2>
      <ul>
        {rides.length > 0 ? (
          rides.map((ride) => (
            <li key={ride.id}>
              <strong>{ride.name}</strong> - {ride.place} ({ride.reason}) at {ride.timing}
              <button onClick={() => handleMarkCompleted(ride)}>Mark as Completed</button>
            </li>
          ))
        ) : (
          <p>No accepted rides at the moment.</p>
        )}
      </ul>
    </div>
  );
};

export default AcceptedRides;
