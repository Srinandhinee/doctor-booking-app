import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const { user, logout } = useAuth();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const isActive = (path) => location.pathname === path;

	return (
		<header className="navbar">
			<Link to="/" className="navbar-brand">
				<div className="navbar-logo">H</div>
				HealConnect
			</Link>
			
			<nav className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
				<Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
				{!user && (<>
					<Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
					<Link to="/register" className="hc-btn btn-primary">Get Started</Link>
				</>)}
				{user && user.role === 'patient' && (<>
					<Link to="/patient" className={isActive('/patient') ? 'active' : ''}>Dashboard</Link>
					<Link to="/patient/book" className={isActive('/patient/book') ? 'active' : ''}>Book</Link>
					<Link to="/patient/appointments" className={isActive('/patient/appointments') ? 'active' : ''}>Appointments</Link>
					<Link to="/patient/history" className={isActive('/patient/history') ? 'active' : ''}>History</Link>
				</>)}
				{user && user.role === 'doctor' && (<>
					<Link to="/doctor" className={isActive('/doctor') ? 'active' : ''}>Dashboard</Link>
					<Link to="/doctor/availability" className={isActive('/doctor/availability') ? 'active' : ''}>Availability</Link>
					<Link to="/doctor/earnings" className={isActive('/doctor/earnings') ? 'active' : ''}>Earnings</Link>
				</>)}
				{user && user.role === 'admin' && (<>
					<Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Verify</Link>
					<Link to="/admin/payments" className={isActive('/admin/payments') ? 'active' : ''}>Payments</Link>
					<Link to="/admin/support" className={isActive('/admin/support') ? 'active' : ''}>Support</Link>
					<Link to="/admin/reports" className={isActive('/admin/reports') ? 'active' : ''}>Reports</Link>
				</>)}
			</nav>
			
			<div className="navbar-profile">
				{user && (
					<>
						<span className="user-name">Welcome, {user.name}</span>
						<button className="profile-btn" onClick={logout} title="Logout">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
								<polyline points="16,17 21,12 16,7"></polyline>
								<line x1="21" y1="12" x2="9" y2="12"></line>
							</svg>
						</button>
					</>
				)}
				<button 
					className="mobile-menu-btn"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					aria-label="Toggle mobile menu"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				</button>
			</div>
		</header>
	);
}


