import { useState, useEffect } from "react";
import "../../css/admin/VehicleManagement.css";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);

  // Fetch Vehicles from Backend
  const fetchVehicles = async () => {
    try {
      const response = await fetch("http://localhost:5000/vehicles");
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Load vehicles when the component mounts
  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="vehicle-management-container">
      <h2>Vehicle Management</h2>
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Vehicle No</th>
            <th>Vehicle Name</th>
            <th>Driver</th>
            <th>Seating Capacity</th>
            <th>Vehicle Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, index) => (
            <tr key={index}>
              <td>{vehicle.vehicleNo}</td>
              <td>{vehicle.vehicleName}</td>
              <td>{vehicle.driver}</td>
              <td>{vehicle.seatingCapacity}</td>
              <td>{vehicle.vehicleNumber}</td>
              <td>{vehicle.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleManagement;
