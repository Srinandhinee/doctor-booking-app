import { Router } from 'express';
import { requireAuth } from '../utils/auth.middleware.js';
import { loadDoctorForUser, requireDoctorApproved } from '../utils/doctor.middleware.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Doctor from '../models/Doctor.js';

const router = Router();

// Doctor approval status (no approval required to view)
router.get('/status', requireAuth(['doctor']), loadDoctorForUser, async (req, res) => {
    if (!req.doctor) return res.status(404).json({ message: 'doctor profile not found' });
    return res.json({ status: req.doctor.status });
});

// My appointments
router.get('/appointments', requireAuth(['doctor']), loadDoctorForUser, requireDoctorApproved(), async (req, res) => {
	const appts = await Appointment.find({ doctor: req.doctor._id }).populate('patient', 'name');
	return res.json(appts);
});

// Accept/Reject/Reschedule
router.post('/appointments/:id/status', requireAuth(['doctor']), loadDoctorForUser, requireDoctorApproved(), async (req, res) => {
	const { status, scheduledFor, slotLabel } = req.body;
	const appt = await Appointment.findOneAndUpdate(
		{ _id: req.params.id, doctor: req.doctor._id },
		{ status, scheduledFor, slotLabel },
		{ new: true }
	);
	if (!appt) return res.status(404).json({ message: 'not found' });
	return res.json(appt);
});

// Upload prescription
router.post('/appointments/:id/prescription', requireAuth(['doctor']), loadDoctorForUser, requireDoctorApproved(), async (req, res) => {
	const { content } = req.body;
	const appt = await Appointment.findOne({ _id: req.params.id, doctor: req.doctor._id });
	if (!appt) return res.status(404).json({ message: 'not found' });
	const pres = await Prescription.create({ appointment: appt._id, patient: appt.patient, doctor: req.doctor._id, content });
	return res.status(201).json(pres);
});

// Get availability
router.get('/availability', requireAuth(['doctor']), loadDoctorForUser, requireDoctorApproved(), async (req, res) => {
	return res.json(req.doctor);
});

// Update availability
router.post('/availability', requireAuth(['doctor']), loadDoctorForUser, requireDoctorApproved(), async (req, res) => {
	const { availability } = req.body;
	const doc = await Doctor.findOneAndUpdate({ _id: req.doctor._id }, { availability }, { new: true });
	return res.json(doc);
});

export default router;


