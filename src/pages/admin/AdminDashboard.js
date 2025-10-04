import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AdminDashboard() {
	const [doctors, setDoctors] = useState([]);

	useEffect(() => {
		api.get("/admin/doctors").then((res) => setDoctors(res.data));
	}, []);

	async function updateStatus(id, status) {
		await api.post(`/admin/doctors/${id}/status`, { status });
		const refreshed = await api.get("/admin/doctors");
		setDoctors(refreshed.data);
	}

return (
	<DashboardLayout>
		<h2 className="hc-page-title">Doctor Verification</h2>
		<div className="hc-table">
			<div className="hc-table-row hc-table-header">
				<div>Name</div>
				<div>Specialization</div>
				<div>Status</div>
				<div>Actions</div>
			</div>
			{doctors.map((d) => (
				<div key={d._id} className="hc-table-row">
					<div>{d.user?.name}</div>
					<div>{d.specialization}</div>
					<div>{d.status}</div>
					<div>
						<button className="hc-btn" onClick={() => updateStatus(d._id, 'approved')}>Approve</button>
						<button className="hc-btn-outline" onClick={() => updateStatus(d._id, 'rejected')}>Reject</button>
					</div>
				</div>
			))}
		</div>
	</DashboardLayout>
);
}


