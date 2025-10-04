import React, { useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function AvailabilityPage() {
	const [availability, setAvailability] = useState([]);

	function addSlot() {
		setAvailability([...availability, { dayOfWeek: 1, start: "09:00", end: "17:00", slots: ["09:00","09:30","10:00"] }]);
	}

	async function save() {
		await api.post('/doctor/availability', { availability });
		alert('Saved');
	}

	return (
		<DashboardLayout>
			<h3 className="hc-page-title">Availability</h3>
			<div className="hc-form">
				<button className="hc-btn" onClick={addSlot}>Add Slot Template</button>
				<pre className="hc-code">{JSON.stringify(availability, null, 2)}</pre>
				<button className="hc-btn" onClick={save}>Save</button>
			</div>
		</DashboardLayout>
	);
}


