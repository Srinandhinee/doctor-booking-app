import React from "react";

export default function SlotPicker({ slots = [], value, onChange }) {
	return (
		<div className="hc-slots">
			{slots.length === 0 && <p className="hc-muted">No slots available</p>}
			{slots.map((s) => (
				<button
					key={s}
					className={`hc-slot ${value === s ? 'selected' : ''}`}
					onClick={() => onChange(s)}
				>
					{s}
				</button>
			))}
		</div>
	);
}


