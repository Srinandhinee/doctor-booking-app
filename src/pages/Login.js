import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Login() {
	const { login } = useAuth();
	const nav = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		try {
			const user = await login(email, password);
			if (user.role === "patient") nav("/patient");
			else if (user.role === "doctor") nav("/doctor");
			else nav("/admin");
		} catch (e) {
			setError("Invalid credentials");
		}
	}

return (
	<DashboardLayout>
		<h2 className="hc-page-title">Login</h2>
		<form className="hc-form" onSubmit={onSubmit}>
			<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<button className="hc-btn" type="submit">Login</button>
		</form>
		{error && <p className="hc-error">{error}</p>}
	</DashboardLayout>
);
}


