import React, { useEffect, useState } from "react";
import api from "../api/client";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function DoctorGuard({ children }) {
	const { user, loading } = useAuth();
	const [status, setStatus] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		if (loading) return;
		if (!user || user.role !== 'doctor') return;
		let mounted = true;
		(async () => {
			try {
				const res = await api.get('/doctor/status');
				const normalized = (res.data?.status || '').toString().trim().toLowerCase();
				if (mounted) setStatus(normalized || null);
			} catch (e) {
				// Fallback probe: try hitting appointments to infer approval
				try {
					const ap = await api.get('/doctor/appointments');
					if (mounted) {
						setStatus('approved');
					}
				} catch (e2) {
					if (mounted) {
						if (e2?.response?.status === 403) setStatus('pending');
						else if (e2?.response?.status === 401) setError('Not authenticated');
						else setError('Failed to load status');
					}
				}
			}
		})();
		return () => { mounted = false; };
	}, [loading, user]);

	if (loading || (!status && !error)) {
		return (
			<DashboardLayout>
				<h2 className="hc-page-title">Loading...</h2>
			</DashboardLayout>
		);
	}

	if (error) {
		return (
			<DashboardLayout>
				<h2 className="hc-page-title">Unable to verify approval</h2>
				<p className="hc-muted">{error}. Please log in again or check your connection.</p>
				<p className="hc-muted">Please check your connection and try again.</p>
			</DashboardLayout>
		);
	}

	if (status && status !== 'approved') {
		return (
			<DashboardLayout>
				<h2 className="hc-page-title">Waiting for Approval</h2>
				<p className="hc-muted">Your profile status: {status || 'unknown'}. Admin approval is required to access the dashboard.</p>
			</DashboardLayout>
		);
	}

	return children;
}


