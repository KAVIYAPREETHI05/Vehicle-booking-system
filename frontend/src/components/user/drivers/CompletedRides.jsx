import React, { useState } from "react";

const CompletedRides = () => {
  const [completedRides, setCompletedRides] = useState([
    { id: 1, user: "David White", pickup: "Hostel", drop: "Airport" },
    { id: 2, user: "Emma Green", pickup: "Library", drop: "Shopping Mall" },
  ]);

  return (
    <div className="completed-rides">
      <h2>Completed Rides</h2>
      <ul>
        {completedRides.length > 0 ? (
          completedRides.map((ride) => (
            <li key={ride.id}>
              <strong>{ride.user}</strong> - Pickup: {ride.pickup}, Drop: {ride.drop}
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
