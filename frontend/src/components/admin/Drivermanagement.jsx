import { useState, useEffect } from "react";
import "../../css/admin/driverManagement.css";

const DriverManagement = () => {
  const [assignedDrivers, setAssignedDrivers] = useState([]);

  // Function to fetch assigned drivers from backend
  const fetchAssignedDrivers = async () => {
    try {
      const response = await fetch("http://localhost:5000/assigned-drivers");
      const data = await response.json();
      setAssignedDrivers(data);
    } catch (error) {
      console.error("Error fetching assigned drivers:", error);
    }
  };

  // Load initially + refresh every 1 minute
  useEffect(() => {
    fetchAssignedDrivers(); // Load once when mounted

    const interval = setInterval(() => {
      fetchAssignedDrivers(); // Refresh every 1 min
    }, 60000); // 60,000 ms = 1 min

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="driver-management-container">
      <h2>Driver Management</h2>
      <table className="driver-table">
      <thead>
  <tr>
    <th>Vehicle No</th>
    <th>Driver Name</th>
    <th>Timing Slot</th>
    <th>Start Time</th> {/* NEW */}
    <th>End Time</th>   {/* NEW */}
  </tr>
</thead>

<tbody>
  {assignedDrivers.length > 0 ? (
    assignedDrivers.map((driver, index) => (
      <tr key={index}>
        <td>{driver.vehicleNo}</td>
        <td>{driver.driverName}</td>
        <td>{driver.timingSlot}</td>
        <td>{driver.startTime}</td> {/* NEW */}
        <td>{driver.endTime}</td>   {/* NEW */}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">No drivers assigned yet</td> {/* Adjust colspan */}
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default DriverManagement;
