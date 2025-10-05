import React, { useState, useEffect } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

const DAYS_OF_WEEK = [
	{ value: 0, label: "Sunday" },
	{ value: 1, label: "Monday" },
	{ value: 2, label: "Tuesday" },
	{ value: 3, label: "Wednesday" },
	{ value: 4, label: "Thursday" },
	{ value: 5, label: "Friday" },
	{ value: 6, label: "Saturday" }
];

const TIME_SLOTS = [
	"09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
	"12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
	"16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function AvailabilityPage() {
	const [availability, setAvailability] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saved, setSaved] = useState(false);

	// Load existing availability on component mount
	useEffect(() => {
		loadAvailability();
	}, []);

	async function loadAvailability() {
		try {
			const response = await api.get('/doctor/availability');
			if (response.data?.availability) {
				setAvailability(response.data.availability);
			}
		} catch (error) {
			console.log('No existing availability found');
		}
	}

	function addDaySlot() {
		setAvailability([...availability, { 
			dayOfWeek: 1, 
			start: "09:00", 
			end: "17:00", 
			slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"] 
		}]);
	}

	function removeDaySlot(index) {
		setAvailability(availability.filter((_, i) => i !== index));
	}

	function updateDaySlot(index, field, value) {
		const updated = [...availability];
		updated[index][field] = value;
		setAvailability(updated);
	}

	function toggleTimeSlot(dayIndex, slot) {
		const updated = [...availability];
		const day = updated[dayIndex];
		const slotIndex = day.slots.indexOf(slot);
		
		if (slotIndex > -1) {
			day.slots.splice(slotIndex, 1);
		} else {
			day.slots.push(slot);
			day.slots.sort();
		}
		
		setAvailability(updated);
	}

	function generateSlots(start, end) {
		const slots = [];
		const startTime = new Date(`2000-01-01T${start}`);
		const endTime = new Date(`2000-01-01T${end}`);
		
		let current = new Date(startTime);
		while (current < endTime) {
			slots.push(current.toTimeString().slice(0, 5));
			current.setMinutes(current.getMinutes() + 30);
		}
		
		return slots;
	}

	async function save() {
		setLoading(true);
		setSaved(false);
		try {
		await api.post('/doctor/availability', { availability });
			setSaved(true);
			setTimeout(() => setSaved(false), 3000);
		} catch (error) {
			alert('Error saving availability');
		} finally {
			setLoading(false);
		}
	}

	return (
		<DashboardLayout>
			<h2 className="hc-page-title">Manage Your Availability</h2>
			
			<div className="form-container">
				<div className="hc-card">
					<h3>📅 Weekly Availability Schedule</h3>
					<p className="hc-muted">Set your available days and time slots for patient appointments.</p>
					
					<div className="availability-section">
						<button className="hc-btn btn-primary" onClick={addDaySlot}>
							➕ Add Day Schedule
						</button>
						
						{availability.map((day, dayIndex) => (
							<div key={dayIndex} className="day-slot">
								<div className="day-header">
									<h4>Day Schedule #{dayIndex + 1}</h4>
									<button 
										className="hc-btn-outline btn-small" 
										onClick={() => removeDaySlot(dayIndex)}
									>
										🗑️ Remove
									</button>
								</div>
								
								<div className="day-controls">
									<div className="form-group">
										<label className="form-label">Day of Week</label>
										<select 
											className="form-select"
											value={day.dayOfWeek} 
											onChange={(e) => updateDaySlot(dayIndex, 'dayOfWeek', parseInt(e.target.value))}
										>
											{DAYS_OF_WEEK.map(d => (
												<option key={d.value} value={d.value}>{d.label}</option>
											))}
										</select>
									</div>
									
									<div className="form-group">
										<label className="form-label">Start Time</label>
										<select 
											className="form-select"
											value={day.start} 
											onChange={(e) => updateDaySlot(dayIndex, 'start', e.target.value)}
										>
											{TIME_SLOTS.map(time => (
												<option key={time} value={time}>{time}</option>
											))}
										</select>
									</div>
									
									<div className="form-group">
										<label className="form-label">End Time</label>
										<select 
											className="form-select"
											value={day.end} 
											onChange={(e) => updateDaySlot(dayIndex, 'end', e.target.value)}
										>
											{TIME_SLOTS.map(time => (
												<option key={time} value={time}>{time}</option>
											))}
										</select>
									</div>
								</div>
								
								<div className="slots-section">
									<label className="form-label">Available Time Slots (30-minute intervals)</label>
									<div className="slots-grid">
										{generateSlots(day.start, day.end).map(slot => (
											<button
												key={slot}
												className={`slot-button ${day.slots.includes(slot) ? 'selected' : ''}`}
												onClick={() => toggleTimeSlot(dayIndex, slot)}
											>
												{slot}
											</button>
										))}
									</div>
									<div className="form-help">
										Selected slots: {day.slots.length} slots
									</div>
								</div>
							</div>
						))}
						
						{availability.length === 0 && (
							<div className="empty-state">
								<p>No availability set. Click "Add Day Schedule" to get started.</p>
							</div>
						)}
					</div>
					
					<div className="save-section">
						<button 
							className="hc-btn btn-secondary btn-large" 
							onClick={save}
							disabled={loading || availability.length === 0}
						>
							{loading ? '💾 Saving...' : '💾 Save Availability'}
						</button>
						
						{saved && (
							<div className="success-message">
								✅ Availability saved successfully!
							</div>
						)}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}