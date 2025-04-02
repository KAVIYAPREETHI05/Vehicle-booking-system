import { useState, useEffect } from "react";
import "../../css/admin/driverManagement.css";

const DriverManagement = () => {
  const [assignedDrivers, setAssignedDrivers] = useState([]);

  useEffect(() => {
    fetchAssignedDrivers();
  }, []);

  const fetchAssignedDrivers = async () => {
    try {
      const response = await fetch("http://localhost:5000/assigned-drivers");
      const data = await response.json();
      setAssignedDrivers(data);
    } catch (error) {
      console.error("Error fetching assigned drivers:", error);
    }
  };

  return (
    <div className="driver-management-container">
      <h2>Driver Management</h2>
      <table className="driver-table">
        <thead>
          <tr>
            <th>Vehicle No</th>
            <th>Driver Name</th>
            <th>Timing Slot</th>
          </tr>
        </thead>
        <tbody>
          {assignedDrivers.length > 0 ? (
            assignedDrivers.map((driver, index) => (
              <tr key={index}>
                <td>{driver.vehicleNo}</td>
                <td>{driver.driverName}</td>
                <td>{driver.timingSlot}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No drivers assigned yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverManagement;
