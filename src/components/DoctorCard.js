import React from "react";

export default function DoctorCard({ name, specialization, location, experience, rating, price, onBook }) {
	return (
		<div className="doctor-card">
			<div className="hc-card-header">
				<div className="hc-avatar" aria-hidden>👨‍⚕️</div>
				<div>
					<h4 className="hc-card-title">Dr. {name}</h4>
					<div className="specialty">{specialization}</div>
				</div>
			</div>
			
			<p className="hc-muted">📍 {location}</p>
			
			{experience && (
				<p className="hc-muted">🕒 {experience} years experience</p>
			)}
			
			{rating && (
				<div className="rating">
					<div className="stars">⭐⭐⭐⭐⭐</div>
					<span className="hc-muted">({rating})</span>
				</div>
			)}
			
			{price && (
				<div className="price">₹{price}</div>
			)}
			
			<div className="hc-card-actions">
				<button className="hc-btn btn-primary" onClick={onBook}>
					📅 Book Appointment
				</button>
			</div>
		</div>
	);
}


