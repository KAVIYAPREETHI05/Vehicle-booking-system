import React, { useEffect, useState } from "react";
import '../../../css/user/drivers/completedRides.css';

const CompletedRides = () => {
  const [completedRides, setCompletedRides] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/completed-rides")
      .then((res) => res.json())
      .then((data) => setCompletedRides(data))
      .catch((err) => console.error("Error fetching completed rides:", err));
  }, []);

  return (
    <div className="completed-rides">
      <h2>✅ Completed Rides</h2>
      <ul>
        {completedRides.length > 0 ? (
          completedRides.map((ride) => (
            <li key={ride.id}>
              <strong>{ride.name}</strong> - {ride.place} ({ride.reason}) at {ride.timing}
            </li>
          ))
        ) : (
          <p>No completed rides yet.</p>
        )}
      </ul>
    </div>
  );
};

export default CompletedRides;
