import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function MedicalHistoryPage() {
	const [history, setHistory] = useState({ records: [] });
	const [doctorId, setDoctorId] = useState("");
	const [doctors, setDoctors] = useState([]);

	useEffect(() => {
		api.get("/patient/history").then((res) => setHistory(res.data || { records: [] }));
		api.get("/patient/doctors").then((res) => setDoctors(res.data));
	}, []);

	async function requestAccess() {
		await api.post('/patient/history/request', { doctorId });
		alert('Requested access approval');
	}

	return (
		<DashboardLayout>
			<h3 className="hc-page-title">Medical History</h3>
			<div className="hc-list">
				{(history.records || []).map((r, idx) => (
					<div key={idx} className="hc-list-item">
						<div>
							<div className="hc-strong">{r.doctor?.specialization}</div>
							<div className="hc-muted">{r.appointment ? new Date(r.appointment?.scheduledFor).toLocaleString() : ''}</div>
						</div>
					</div>
				))}
			</div>
			<div className="hc-form" style={{ marginTop: 24 }}>
				<h4>Share history with a new doctor</h4>
				<select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
					<option value="">Select Doctor</option>
					{doctors.map((d) => (
						<option key={d._id} value={d._id}>{d.user?.name} - {d.specialization}</option>
					))}
				</select>
				<button className="hc-btn" onClick={requestAccess}>Request Access</button>
			</div>
		</DashboardLayout>
	);
}


