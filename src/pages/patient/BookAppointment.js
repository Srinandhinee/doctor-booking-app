import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";
import SlotPicker from "../../components/SlotPicker";

export default function BookAppointment() {
	const [doctors, setDoctors] = useState([]);
	const [doctorId, setDoctorId] = useState("");
	const [type, setType] = useState("online");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [amount, setAmount] = useState(500);
	const [created, setCreated] = useState(null);

	useEffect(() => {
		api.get("/patient/doctors").then((res) => setDoctors(res.data));
	}, []);

	async function createBooking() {
		const scheduledFor = new Date(`${date}T${time}:00`);
		const res = await api.post("/patient/appointments", { doctorId, type, scheduledFor, slotLabel: time, amount: Number(amount) });
		setCreated(res.data);
	}

	return (
		<DashboardLayout>
			<h2 className="hc-page-title">Book Your Appointment</h2>
			
			<div className="form-container">
				<div className="hc-form">
					<div className="form-group">
						<label className="form-label">Select Doctor</label>
						<select 
							className="form-select" 
							value={doctorId} 
							onChange={(e) => setDoctorId(e.target.value)}
						>
							<option value="">Choose a doctor...</option>
							{doctors.map((d) => (
								<option key={d._id} value={d._id}>
									Dr. {d.user?.name} - {d.specialization}
								</option>
							))}
						</select>
						<div className="form-help">Select from our qualified medical professionals</div>
					</div>

					<div className="form-group">
						<label className="form-label">Consultation Type</label>
						<select 
							className="form-select" 
							value={type} 
							onChange={(e) => setType(e.target.value)}
						>
							<option value="online">🖥️ Online Consultation</option>
							<option value="offline">🏥 In-Person Visit</option>
						</select>
						<div className="form-help">Choose your preferred consultation method</div>
					</div>

					<div className="form-group">
						<label className="form-label">Appointment Date</label>
						<input 
							type="date" 
							className="form-input"
							value={date} 
							onChange={(e) => setDate(e.target.value)}
							min={new Date().toISOString().split('T')[0]}
						/>
						<div className="form-help">Select your preferred date</div>
					</div>

					<div className="form-group">
						<label className="form-label">Available Time Slots</label>
						<SlotPicker slots={["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00"]} value={time} onChange={setTime} />
						<div className="form-help">Choose your preferred time slot</div>
					</div>

					<div className="price-display">
						<div className="label">Consultation Fee</div>
						<div className="amount">
							₹{amount}
							<span className="currency">INR</span>
						</div>
						<div className="form-help">Fixed consultation fee (non-editable)</div>
					</div>

					<button className="hc-btn btn-primary btn-large" onClick={createBooking}>
						📅 Book Appointment
					</button>
				</div>

				{created && (
					<div className="hc-banner">
						<div>
							<h4>✅ Appointment Created Successfully!</h4>
							<p>Your appointment has been scheduled and is pending confirmation.</p>
							<p><strong>Status:</strong> {created.status}</p>
						</div>
						{type === 'online' && created.amount > 0 && (
							<button className="hc-btn btn-secondary" onClick={async () => {
								await api.post('/payments/confirm', { appointmentId: created._id });
								alert('Payment confirmed (placeholder)');
							}}>
								💳 Pay Now
							</button>
						)}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}


