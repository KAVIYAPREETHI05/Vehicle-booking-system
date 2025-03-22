import React, { useState } from "react";

const AddVehicle = () => {
  const [vehicle, setVehicle] = useState({ name: "", type: "", capacity: "" });

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vehicle Added:", vehicle);
  };

  return (
    <div>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Vehicle Name" onChange={handleChange} required />
        <input type="text" name="type" placeholder="Vehicle Type" onChange={handleChange} required />
        <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} required />
        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  );
};

export default AddVehicle;
