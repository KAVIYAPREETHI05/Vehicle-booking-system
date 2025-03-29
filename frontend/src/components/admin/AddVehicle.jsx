import { useState } from "react";
import "../../css/admin/AddVehicle.css";

const AddVehicle = () => {
  const [vehicle, setVehicle] = useState({
    vehicleNo: "",
    vehicleName: "",
    driver: "",
    seatingCapacity: "",
    vehicleNumber: "",
    status: "",
  });

  const drivers = ["kumar", "ram", "karthik", "kalai", "boomi"];

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const vehicleData = {
      vehicleNo: parseInt(vehicle.vehicleNo, 10),
      vehicleName: vehicle.vehicleName,
      driver: vehicle.driver,
      seatingCapacity: parseInt(vehicle.seatingCapacity, 10),
      vehicleNumber: vehicle.vehicleNumber,
      status: vehicle.status,
    };

    try {
      const response = await fetch("http://localhost:5000/add-vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Vehicle Added Successfully!");
        setVehicle({
          vehicleNo: "",
          vehicleName: "",
          driver: "",
          seatingCapacity: "",
          vehicleNumber: "",
          status: "",
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting vehicle data:", error);
      alert("Failed to add vehicle.");
    }
  };

  return (
    <div className="vehicle-form-container">
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="vehicle-form">
        
        <div>
          <label>Vehicle Name</label>
          <input type="text" name="vehicleName" value={vehicle.vehicleName} onChange={handleChange} required />
        </div>

        <div>
          <label>Vehicle No</label>
          <input type="number" name="vehicleNo" value={vehicle.vehicleNo} onChange={handleChange} required min="1" />
        </div>

        <div>
          <label>Driver</label>
          <select name="driver" value={vehicle.driver} onChange={handleChange} required>
            <option value="">Select Driver</option>
            {drivers.map((driver, index) => (
              <option key={index} value={driver}>
                {driver}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Seating Capacity</label>
          <input type="number" name="seatingCapacity" value={vehicle.seatingCapacity} onChange={handleChange} required min="1" />
        </div>

        <div>
          <label>Vehicle Number (License Plate)</label>
          <input type="text" name="vehicleNumber" value={vehicle.vehicleNumber} onChange={handleChange} required />
        </div>

        <div>
          <label>Status</label>
          <select name="status" value={vehicle.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Add Vehicle</button>
      </form>
    </div>
  );
};

export default AddVehicle;
