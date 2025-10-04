import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function WaitingApproval() {
	return (
		<DashboardLayout>
			<h2 className="hc-page-title">Waiting for Approval</h2>
			<p className="hc-muted">Your doctor account has been created and is pending admin approval. You'll be able to access the dashboard once approved.</p>
		</DashboardLayout>
	);
}



