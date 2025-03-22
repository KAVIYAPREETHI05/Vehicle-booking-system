import React, { useState } from "react";

const AcceptedRides = () => {
  const [rides, setRides] = useState([
    { id: 1, user: "Alice Brown", pickup: "Cafeteria", drop: "Train Station" },
  ]);

  return (
    <div className="accepted-rides">
      <h2>Accepted Rides</h2>
      <ul>
        {rides.length > 0 ? (
          rides.map((ride) => (
            <li key={ride.id}>
              <strong>{ride.user}</strong> - Pickup: {ride.pickup}, Drop: {ride.drop}
              <button>Mark as Completed</button>
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
