import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function SupportPage() {
	const [tickets, setTickets] = useState([]);

	async function refresh() {
		const res = await api.get('/admin/support');
		setTickets(res.data);
	}

	useEffect(() => { refresh(); }, []);

	async function update(id, status) {
		await api.post(`/admin/support/${id}/status`, { status });
		await refresh();
	}

return (
	<DashboardLayout>
		<h3 className="hc-page-title">Support Tickets</h3>
		<div className="hc-list">
			{tickets.map((t) => (
				<div key={t._id} className="hc-list-item">
					<div>
						<div className="hc-strong">{t.category}</div>
						<div className="hc-muted">{t.description}</div>
					</div>
					<div>
						<button className="hc-btn" onClick={() => update(t._id, 'in_progress')}>Start</button>
						<button className="hc-btn-outline" onClick={() => update(t._id, 'closed')}>Close</button>
					</div>
				</div>
			))}
		</div>
	</DashboardLayout>
);
}


