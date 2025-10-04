import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardLayout({ children }) {
	return (
		<div className="hc-layout">
			<Navbar />
			<main className="hc-main">
				<div className="hc-container">
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
}


