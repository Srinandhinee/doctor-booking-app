import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function PaymentsPage() {
	const [payments, setPayments] = useState([]);
	useEffect(() => {
		api.get('/admin/payments').then((res) => setPayments(res.data));
	}, []);
return (
	<DashboardLayout>
		<h3 className="hc-page-title">All Payments</h3>
		<div className="hc-list">
			{payments.map((p) => (
				<div key={p._id} className="hc-list-item">
					<div className="hc-strong">₹{p.amount}</div>
					<div className="hc-muted">{p.status} • {new Date(p.createdAt).toLocaleString()}</div>
				</div>
			))}
		</div>
	</DashboardLayout>
);
}


