import { useState, useEffect } from "react";
import "../../css/admin/assignDriver.css";

const AssignDriver = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assignment, setAssignment] = useState({
    vehicleNo: "",
    driver: "",
    timingSlot: "",
  });

  useEffect(() => {
    fetchUnassignedVehicles();
    fetchUnassignedDrivers();
  }, []);

  const fetchUnassignedVehicles = async () => {
    try {
      const response = await fetch("http://localhost:5000/available-vehicles");
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchUnassignedDrivers = async () => {
    try {
      const response = await fetch("http://localhost:5000/unassigned-drivers");
      const data = await response.json();

      // Hardcoded drivers
      const hardcodedDrivers = [
        { id: "d101", name: "Jayaram" },
        { id: "d102", name: "Kathikeyan" },
        { id: "d103", name: "shrivanth" },
      ];

      // Combine fetched drivers and hardcoded drivers
      setDrivers([...data, ...hardcodedDrivers]);
    } catch (error) {
      console.error("Error fetching drivers:", error);

      // If fetch fails, use only hardcoded drivers
      setDrivers([
        { id: "d101", name: "Jayaram" },
        { id: "d102", name: "karthikeyan" },
        { id: "d103", name: "shrivanth" },
      ]);
    }
  };

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignment.vehicleNo || !assignment.driver || !assignment.timingSlot) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/assign-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignment),
      });

      const data = await response.json();
      if (response.ok) {
        await fetch(`http://localhost:5000/update-vehicle-status/${assignment.vehicleNo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "In Use" }),
        });

        alert("Driver assigned successfully!");
        setAssignment({ vehicleNo: "", driver: "", timingSlot: "" });

        fetchUnassignedVehicles();
        fetchUnassignedDrivers();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver.");
    }
  };

  return (
    <div className="assign-driver-container">
      <h2>Assign Driver to Vehicle</h2>
      <form onSubmit={handleSubmit} className="assign-driver-form">
        
        <div>
          <label>Vehicle No</label>
          <select name="vehicleNo" value={assignment.vehicleNo} onChange={handleChange} required>
            <option value="">Select Vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.vehicleNo} value={vehicle.vehicleNo}>
                {vehicle.vehicleNo} - {vehicle.vehicleName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Driver</label>
          <select name="driver" value={assignment.driver} onChange={handleChange} required>
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.name}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Timing Slot</label>
          <select name="timingSlot" value={assignment.timingSlot} onChange={handleChange} required>
            <option value="">Select Slot</option>
            <option value="Early Morning">Morning (7 AM - 9 AM)</option>
            <option value="Morning">Morning (9 AM - 12 PM)</option>
            <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
            <option value="Evening">Evening (4 PM - 8 PM)</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Assign Driver</button>
      </form>
    </div>
  );
};

export default AssignDriver;
