import React, { useEffect } from "react";
import { io } from "socket.io-client";

export default function ConsultRoom() {
	useEffect(() => {
		const socket = io(process.env.REACT_APP_WS_URL || "http://localhost:5000");
		socket.emit('join-consult', { consultationId: 'demo', userId: 'patient' });
		return () => socket.disconnect();
	}, []);
	return (
		<div style={{ padding: 24 }}>
			<h3>Online Consultation</h3>
			<p>Connected (placeholder). Video/chat to be integrated.</p>
		</div>
	);
}


