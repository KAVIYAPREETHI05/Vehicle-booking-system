import { useState, useEffect } from "react";
import "../../css/admin/VehicleManagement.css";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [statusOptions] = useState(["Available", "In Use", "Under Maintenance"]);

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

  // Update vehicle status in the backend
  const updateStatus = async (vehicleNumber, status) => {
    try {
      const response = await fetch(`http://localhost:5000/update-vehicle-status/${vehicleNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Failed to update status:", error);
      } else {
        console.log("✅ Vehicle status updated successfully!");
      }
    } catch (error) {
      console.error("❌ Error updating vehicle status:", error);
    }
  };

  // Handle dropdown change and update backend
  const handleStatusChange = (index, newStatus) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index].status = newStatus;
    setVehicles(updatedVehicles);

    updateStatus(updatedVehicles[index].vehicleNumber, newStatus);
  };

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
              <td>
                <select
                  value={vehicle.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleManagement;
