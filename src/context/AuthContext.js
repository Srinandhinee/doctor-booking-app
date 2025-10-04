import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			setLoading(false);
			return;
		}
		api.get("/auth/me").then((res) => {
			setUser(res.data);
		}).catch(() => {
			localStorage.removeItem("token");
		}).finally(() => setLoading(false));
	}, []);

	const value = useMemo(() => ({
		user,
		loading,
		login: async (email, password) => {
			const res = await api.post("/auth/login", { email, password });
			localStorage.setItem("token", res.data.token);
			setUser(res.data.user);
			return res.data.user;
		},
		register: async (payload) => {
			const res = await api.post("/auth/register", payload);
			localStorage.setItem("token", res.data.token);
			setUser(res.data.user);
			return res.data.user;
		},
		logout: () => {
			localStorage.removeItem("token");
			setUser(null);
		}
	}), [user, loading]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}


