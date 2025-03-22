import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../src/components/sidebar";
import Dashboard from "../src/components/user/students/Dashboard";
import BookVehicle from "../src/components/user/students/BookVehicle";
import BookingHistory from "../src/components/user/students/BookingHistory";
import RequestStatus from "../src/components/user/students/RequestStatus";
import ContactSupport from "../src/components/user/students/ContactSupport";

import AdminDashboard from "../src/components/admin/AdminDashboard";
import AddVehicle from "../src/components/admin/AddVehicle";
import AssignDriver from "../src/components/admin/AssignDriver";
import VehicleManagement from "../src/components/admin/Vehiclemanagement";
import DriverManagement from "../src/components/admin/Drivermanagement";

import DriverDashboard from "../src/components/user/drivers/DriverDashboard";
import RideRequests from "../src/components/user/drivers/RideRequests";
import AcceptedRides from "../src/components/user/drivers/AcceptedRides";
import CompletedRides from "../src/components/user/drivers/CompletedRides";

import LoginPage from "./components/LoginPage"; // Login page component


const App = () => {
  // State for storing user role
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch role securely from backend
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/getUserRole", { credentials: "include" });
        const data = await response.json();
        setRole(data.role); // Secure role fetching
      } catch (error) {
        console.error("Error fetching role:", error);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  // Logout function
  const handleLogout = () => {
    fetch("/api/logout", { method: "POST", credentials: "include" }) // Call logout API
      .then(() => {
        setRole(null);
        window.location.href = "/login"; // Redirect to login page
      })
      .catch(err => console.error("Logout failed", err));
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar only visible when role exists */}
        {role && <Sidebar role={role} onLogout={handleLogout} />}
        <div className="main-content">
          <Routes>
            {/* Redirect to login if no role */}
            {!role ? (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                {/* User Routes */}
                {role === "user" && (
                  <>
                    <Route path="/" element={<Navigate to="/users/students/dashboard" />} />
                    <Route path="/users/students/dashboard" element={<Dashboard />} />
                    <Route path="/users/students/book-vehicle" element={<BookVehicle />} />
                    <Route path="/users/students/booking-history" element={<BookingHistory />} />
                    <Route path="/users/students/request-status" element={<RequestStatus />} />
                    <Route path="/users/students/contact-support" element={<ContactSupport />} />
                  </>
                )}

                {/* Admin Routes */}
                {role === "admin" && (
                  <>
                    <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/add-vehicle" element={<AddVehicle />} />
                    <Route path="/admin/assign-driver" element={<AssignDriver />} />
                    <Route path="/admin/vehicle-management" element={<VehicleManagement />} />
                    <Route path="/admin/driver-management" element={<DriverManagement />} />
                  </>
                )}

                {/* Driver Routes */}
                {role === "driver" && (
                  <>
                    <Route path="/" element={<Navigate to="/users/drivers/dashboard" />} />
                    <Route path="/users/drivers/dashboard" element={<DriverDashboard />} />
                    <Route path="/users/drivers/requests" element={<RideRequests />} />
                    <Route path="/users/drivers/accepted-rides" element={<AcceptedRides />} />
                    <Route path="/users/drivers/completed-rides" element={<CompletedRides />} />
                  </>
                )}

                {/* 404 Page Not Found */}
                <Route path="*" element={<h2>404 Page Not Found</h2>} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
