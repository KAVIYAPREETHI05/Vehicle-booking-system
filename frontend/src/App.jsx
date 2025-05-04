import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";

import Dashboard from "./components/user/students/Dashboard";
import BookVehicle from "./components/user/students/BookVehicle";
import RequestStatus from "./components/user/students/RequestStatus";
import ContactSupport from "./components/user/students/ContactSupport";

import AdminDashboard from "./components/admin/AdminDashboard";
import AddVehicle from "./components/admin/AddVehicle";
import AssignDriver from "./components/admin/AssignDriver";
import VehicleManagement from "./components/admin/Vehiclemanagement";
import DriverManagement from "./components/admin/Drivermanagement";

import DriverDashboard from "./components/user/drivers/DriverDashboard";
import RideRequests from "./components/user/drivers/RideRequests";
import AcceptedRides from "./components/user/drivers/AcceptedRides";
import CompletedRides from "./components/user/drivers/CompletedRides";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Default Route Redirect to Admin */}
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-vehicle" element={<AddVehicle />} />
            <Route path="/admin/assign-driver" element={<AssignDriver />} />
            <Route path="/admin/vehicle-management" element={<VehicleManagement />} />
            <Route path="/admin/driver-management" element={<DriverManagement />} />

            {/* Student Routes */}
            <Route path="/users/students/dashboard" element={<Dashboard />} />
            <Route path="/users/students/book-vehicle" element={<BookVehicle />} />
            <Route path="/users/students/request-status" element={<RequestStatus />} />
            <Route path="/users/students/contact-support" element={<ContactSupport />} />

            {/* Driver Routes */}
            <Route path="/users/drivers/dashboard" element={<DriverDashboard />} />
            <Route path="/users/drivers/requests" element={<RideRequests />} />
            <Route path="/users/drivers/accepted-rides" element={<AcceptedRides />} />
            <Route path="/users/drivers/completed-rides" element={<CompletedRides />} />

            {/* 404 Route */}
            <Route path="*" element={<h2>404 Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
