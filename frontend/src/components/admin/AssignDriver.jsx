import React, { useState } from "react";

const AssignDriver = () => {
  const [assignment, setAssignment] = useState({ driverId: "", vehicleId: "" });

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Driver Assigned:", assignment);
  };

  return (
    <div>
      <h2>Assign Driver</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="driverId" placeholder="Driver ID" onChange={handleChange} required />
        <input type="text" name="vehicleId" placeholder="Vehicle ID" onChange={handleChange} required />
        <button type="submit">Assign</button>
      </form>
    </div>
  );
};

export default AssignDriver;
