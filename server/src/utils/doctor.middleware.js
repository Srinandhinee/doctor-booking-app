import Doctor from '../models/Doctor.js';

export async function loadDoctorForUser(req, _res, next) {
	const doctor = await Doctor.findOne({ user: req.user.id });
	req.doctor = doctor || null;
	return next();
}

export function requireDoctorApproved() {
	return function (req, res, next) {
		if (!req.doctor) return res.status(404).json({ message: 'doctor profile not found' });
		if (req.doctor.status !== 'approved') return res.status(403).json({ message: 'doctor not approved' });
		return next();
	};
}


