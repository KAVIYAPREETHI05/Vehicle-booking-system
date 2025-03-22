import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role, onLogout }) => {
  return (
    <div className="sidebar">
      <h2>{role.toUpperCase()} PANEL</h2>
      
      {/* Admin Sidebar */}
      {role === "admin" && (
        <>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/add-vehicle">Add Vehicle</Link>
          <Link to="/admin/assign-driver">Assign Driver</Link>
          <Link to="/admin/vehicle-management">Vehicle Management</Link>
          <Link to="/admin/driver-management">Driver Management</Link>
        </>
      )}

      {/* User Sidebar */}
      {role === "user" && (
        <>
          <Link to="/users/students/dashboard">Dashboard</Link>
          <Link to="/users/students/book-vehicle">Book Vehicle</Link>
          <Link to="/users/students/booking-history">Booking History</Link>
          <Link to="/users/students/request-status">Request Status</Link>
          <Link to="/users/students/contact-support">Contact Support</Link>
        </>
      )}

      {/* Driver Sidebar */}
      {role === "driver" && (
        <>
          <Link to="/users/drivers/dashboard">Dashboard</Link>
          <Link to="/users/drivers/requests">Ride Requests</Link>
          <Link to="/users/drivers/accepted-rides">Accepted Rides</Link>
          <Link to="/users/drivers/completed-rides">Completed Rides</Link>
        </>
      )}

      {/* Logout Button */}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
