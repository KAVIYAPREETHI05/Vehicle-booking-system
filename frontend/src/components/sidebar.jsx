import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiHome, FiBook, FiClock, FiCheckCircle, FiPhone } from "react-icons/fi";
import { FaCar, FaUserTie, FaClipboardList, FaUsersCog, FaClipboardCheck } from "react-icons/fa";
import "../css/sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isStudent = location.pathname.startsWith("/users/students");
  const isDriver = location.pathname.startsWith("/users/drivers");
  const isAdmin = location.pathname.startsWith("/admin");

  const studentMenu = [
    { path: "/users/students/dashboard", label: " Dashboard", icon: <FiHome /> },
    { path: "/users/students/book-vehicle", label: " Book Vehicle", icon: <FiBook /> },
    { path: "/users/students/booking-history", label: " Booking History", icon: <FiClock /> },
    { path: "/users/students/request-status", label: " Request Status", icon: <FiCheckCircle /> },
    { path: "/users/students/contact-support", label: " Contact Support", icon: <FiPhone /> },
  ];

  const driverMenu = [
    { path: "/users/drivers/dashboard", label: " Dashboard", icon: <FiHome /> },
    { path: "/users/drivers/requests", label: " Ride Requests", icon: <FaClipboardList /> },
    { path: "/users/drivers/accepted-rides", label: " Accepted Rides", icon: <FiCheckCircle /> },
    { path: "/users/drivers/completed-rides", label: " Completed Rides", icon: <FaClipboardCheck /> },
  ];

  const adminMenu = [
    { path: "/admin/dashboard", label: " Dashboard", icon: <FiHome /> },
    { path: "/admin/add-vehicle", label: " Add Vehicle", icon: <FaCar /> },
    { path: "/admin/assign-driver", label: " Assign Driver", icon: <FaUserTie /> },
    { path: "/admin/vehicle-management", label: " Vehicle Management", icon: <FaUsersCog /> },
    { path: "/admin/driver-management", label: "  Driver Management", icon: <FaClipboardCheck /> },
  ];

  const menuItems = isStudent ? studentMenu : isDriver ? driverMenu : isAdmin ? adminMenu : [];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <FiMenu className="menu-icon" onClick={toggleSidebar} />
        {!isCollapsed && <h2>{isStudent ? "Student Panel" : isDriver ? "Driver Panel" : "Admin Panel"}</h2>}
      </div>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-text">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
