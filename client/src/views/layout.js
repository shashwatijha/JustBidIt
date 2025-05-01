// src/components/Layout.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/products.css";
import "../styles/custRepDashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Layout({ children, notificationCount = 0, onAlertClick = () => { } }) {
    const fullName = localStorage.getItem("fullName") || "Unknown";
    const location = useLocation();
    const navigate = useNavigate();



    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="rep-dashboard-container">
            {/* Header */}
            <header className="rep-header">
                <div className="rep-header-title">
                    <span className="ikea-logo">JustBIDit</span>
                    <span className="dashboard-title">Marketplace</span>
                </div>
                <div className="header-user-info">
                    <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                    <span className="user-name">{fullName}</span>
                    <button className="ikea-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {/* Sidebar and Main Content */}
            <div className="layout-container">
                <nav className="sidebar">
                    <ul className="sidebar-menu">
                        <li><a href="/products" className={location.pathname === "/products" ? "active-link" : ""}>Home</a></li>
                        <li><a href="/create" className={location.pathname === "/create" ? "active-link" : ""}>Sell a Product</a></li>
                        <li><a href="#">My Bids</a></li>
                        <li className="sidebar-alert" onClick={onAlertClick}>
                            <span>🔔 Alert</span>
                            {notificationCount > 0 && (
                                <span className="notification-count">{notificationCount}</span>
                            )}
                        </li>
                    </ul>
                </nav>

                <div className="main-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
