import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function DoctorDashboard() {
	const [appointments, setAppointments] = useState([]);
	const [status, setStatus] = useState(null);
	const [error, setError] = useState("");

	async function refresh() {
		setError("");
		try {
			const s = await api.get('/doctor/status');
			setStatus(s.data?.status || null);
			if (s.data?.status === 'approved') {
				const ap = await api.get('/doctor/appointments');
				setAppointments(ap.data);
			}
		} catch (e) {
			setError('Failed to load status');
		}
	}

	useEffect(() => { refresh(); }, []);

	if (status && status !== 'approved') {
		return (
			<DashboardLayout>
				<h2 className="hc-page-title">Waiting for Approval</h2>
				<p className="hc-muted">Your profile status: {status}. Admin approval is required to access the dashboard.</p>
				<button className="hc-btn" onClick={refresh}>Retry</button>
			</DashboardLayout>
		);
	}

	if (!status && !error) {
		return (
			<DashboardLayout>
				<h2 className="hc-page-title">Loading...</h2>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<h2 className="hc-page-title">Incoming appointments</h2>
			<div className="hc-list">
				{appointments.map((a) => (
					<div key={a._id} className="hc-list-item">
						<div>
							<div className="hc-strong">{a?.patient?.name}</div>
							<div className="hc-muted">{new Date(a.scheduledFor).toLocaleString()} • {a.status}</div>
						</div>
						{a.type === 'online' && <a className="hc-btn" href="/doctor/consult">Join</a>}
					</div>
				))}
			</div>
		</DashboardLayout>
	);
}


