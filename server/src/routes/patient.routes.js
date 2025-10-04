import { Router } from 'express';
import { requireAuth } from '../utils/auth.middleware.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import MedicalHistory from '../models/MedicalHistory.js';
import Prescription from '../models/Prescription.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Browse/search doctors
router.get('/doctors', requireAuth(['patient']), async (req, res) => {
	try {
		const { location, specialization } = req.query;
		const query = { status: 'approved' };
		if (location) query.location = new RegExp(location, 'i');
		if (specialization) query.specialization = new RegExp(specialization, 'i');
		const doctors = await Doctor.find(query).populate('user', 'name');
		return res.json(doctors);
	} catch (e) {
		return res.status(500).json({ message: 'failed' });
	}
});

// Book appointment
router.post('/appointments', requireAuth(['patient']), async (req, res) => {
	try {
		const { doctorId, type, scheduledFor, slotLabel, amount } = req.body;
		const appt = await Appointment.create({
			patient: req.user.id,
			doctor: doctorId,
			type,
			scheduledFor,
			slotLabel,
			amount: amount || 0,
			consultationId: type === 'online' ? uuidv4() : undefined
		});
		return res.status(201).json(appt);
	} catch (e) {
		return res.status(500).json({ message: 'failed' });
	}
});

// Get my appointments
router.get('/appointments', requireAuth(['patient']), async (req, res) => {
	const appts = await Appointment.find({ patient: req.user.id }).populate('doctor');
	return res.json(appts);
});

// View/download prescription
router.get('/prescriptions/:appointmentId', requireAuth(['patient']), async (req, res) => {
	const pres = await Prescription.findOne({ appointment: req.params.appointmentId, patient: req.user.id });
	if (!pres) return res.status(404).json({ message: 'not found' });
	return res.json(pres);
});

// Rate and review doctor (simple storage on Appointment)
router.post('/appointments/:id/rate', requireAuth(['patient']), async (req, res) => {
	const { rating, review } = req.body;
	const appt = await Appointment.findOneAndUpdate(
		{ _id: req.params.id, patient: req.user.id },
		{ rating, review },
		{ new: true }
	);
	if (!appt) return res.status(404).json({ message: 'not found' });
	return res.json(appt);
});

// Medical history retrieval
router.get('/history', requireAuth(['patient']), async (req, res) => {
	const hist = await MedicalHistory.findOne({ patient: req.user.id })
		.populate('records.appointment')
		.populate('records.doctor')
		.populate('records.prescription');
	return res.json(hist || { records: [] });
});

// Request history access for a new doctor
router.post('/history/request', requireAuth(['patient']), async (req, res) => {
	const { doctorId } = req.body;
	if (!doctorId) return res.status(400).json({ message: 'doctorId required' });
	let hist = await MedicalHistory.findOne({ patient: req.user.id });
	if (!hist) hist = await MedicalHistory.create({ patient: req.user.id, records: [], accessRequests: [] });
	const exists = hist.accessRequests?.find((r) => r.doctor.toString() === doctorId);
	if (!exists) {
		hist.accessRequests.push({ doctor: doctorId, status: 'requested', patient: req.user.id });
		await hist.save();
	}
	return res.json(hist);
});

export default router;


