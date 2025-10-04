import React, { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../../layouts/DashboardLayout";
import DoctorCard from "../../components/DoctorCard";

export default function PatientDashboard() {
	const [doctors, setDoctors] = useState([]);

	useEffect(() => {
		api.get("/patient/doctors").then((res) => setDoctors(res.data));
	}, []);

	return (
		<DashboardLayout>
			<h2 className="hc-page-title">Find your specialist</h2>
			<div className="hc-grid">
				{doctors.map((d) => (
					<DoctorCard
						key={d._id}
						name={d.user?.name}
						specialization={d.specialization}
						location={d.location}
						onBook={() => window.location.assign('/patient/book')}
					/>
				))}
			</div>
		</DashboardLayout>
	);
}


