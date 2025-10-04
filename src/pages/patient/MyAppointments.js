import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function MyAppointments() {
	const [list, setList] = useState([]);
	useEffect(() => {
		api.get("/patient/appointments").then((res) => setList(res.data));
	}, []);
	return (
		<DashboardLayout>
			<h3 className="hc-page-title">My Appointments</h3>
			<div className="hc-list">
				{list.map((a) => (
					<div key={a._id} className="hc-list-item">
						<div>
							<div className="hc-strong">{new Date(a.scheduledFor).toLocaleString()}</div>
							<div className="hc-muted">{a.type} • {a.status}</div>
						</div>
						<div>
							{a.type === 'online' && <a className="hc-btn" href="/patient/consult">Join</a>}
						</div>
					</div>
				))}
			</div>
		</DashboardLayout>
	);
}


