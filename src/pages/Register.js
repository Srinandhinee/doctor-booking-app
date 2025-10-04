import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Register() {
	const { register } = useAuth();
	const nav = useNavigate();
	const [role, setRole] = useState("patient");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [specialization, setSpecialization] = useState("");
	const [experienceYears, setExperienceYears] = useState(0);
	const [fees, setFees] = useState(0);

	async function onSubmit(e) {
		e.preventDefault();
	  
		const payload = {
		  email,
		  password,
		  role,
		  profile:
			role === "patient"
			  ? { name, location }
			  : { name, location, specialization, experienceYears: Number(experienceYears), consultationFees: Number(fees) }
		};
	  
		try {
		  const res = await register(payload);
	  
		  // If backend returns a token (patient)
		  if (res.token) {
			if (res.user.role === "patient") nav("/patient");
			else if (res.user.role === "doctor") nav("/doctor");
			else nav("/admin");
		  } 
		  // If backend returns a message (doctor waiting approval)
		  else if (res.message) {
			alert(res.message); // shows: "Doctor registered successfully. Waiting for admin approval."
			nav("/waiting-approval"); // optional: redirect to a waiting page
		  }
		} catch (err) {
		  if (err.response && err.response.data && err.response.data.message) {
			alert(err.response.data.message);
		  } else {
			alert("Something went wrong. Please try again.");
		  }
		}
	  }	  

return (
	<DashboardLayout>
		<h2 className="hc-page-title">Create your account</h2>
		<form className="hc-form" onSubmit={onSubmit}>
			<label>Role</label>
			<select value={role} onChange={(e) => setRole(e.target.value)}>
				<option value="patient">Patient</option>
				<option value="doctor">Doctor</option>
			</select>
			<label>Name</label>
			<input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
			<label>Email</label>
			<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<label>Password</label>
			<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<label>Location</label>
			<input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
			{role === 'doctor' && (
				<>
					<label>Specialization</label>
					<input placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
					<label>Experience Years</label>
					<input placeholder="Experience Years" type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
					<label>Consultation Fees</label>
					<input placeholder="Consultation Fees" type="number" value={fees} onChange={(e) => setFees(e.target.value)} />
				</>
			)}
			<button className="hc-btn" type="submit">Create Account</button>
		</form>
	</DashboardLayout>
);
}


