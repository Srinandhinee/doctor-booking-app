import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="hc-footer">
			<div className="hc-container">
				<div className="footer-section">
					<h4>HealConnect</h4>
					<p>Your trusted healthcare platform connecting patients with qualified doctors for seamless medical consultations.</p>
					<div className="social-links">
						<a href="#" aria-label="Facebook">📘</a>
						<a href="#" aria-label="Twitter">🐦</a>
						<a href="#" aria-label="LinkedIn">💼</a>
						<a href="#" aria-label="Instagram">📷</a>
					</div>
				</div>
				
				<div className="footer-section">
					<h4>Quick Links</h4>
					<Link to="/">Home</Link>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
					<Link to="/patient/book">Book Appointment</Link>
				</div>
				
				<div className="footer-section">
					<h4>Services</h4>
					<Link to="/patient">Patient Dashboard</Link>
					<Link to="/doctor">Doctor Portal</Link>
					<Link to="/admin">Admin Panel</Link>
					<Link to="/patient/history">Medical History</Link>
				</div>
				
				<div className="footer-section">
					<h4>Contact</h4>
					<p>📧 support@healconnect.com</p>
					<p>📞 +1 (555) 123-4567</p>
					<p>📍 123 Health Street, Medical City, MC 12345</p>
					<p>🕒 Mon-Fri: 9AM-6PM</p>
				</div>
			</div>
			
			<div className="footer-bottom">
				<div className="hc-container">
					<p>© {new Date().getFullYear()} HealConnect. All rights reserved.</p>
					<div className="footer-links">
						<Link to="/privacy">Privacy Policy</Link>
						<Link to="/terms">Terms of Service</Link>
						<Link to="/cookies">Cookie Policy</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}


