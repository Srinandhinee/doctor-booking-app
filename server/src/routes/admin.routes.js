import { Router } from 'express';
import { requireAuth } from '../utils/auth.middleware.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import SupportTicket from '../models/SupportTicket.js';
import MedicalHistory from '../models/MedicalHistory.js';

const router = Router();

// Verify doctors
router.get('/doctors', requireAuth(['admin']), async (_req, res) => {
	const docs = await Doctor.find().populate('user', 'name email');
	return res.json(docs);
});

router.post('/doctors/:id/status', requireAuth(['admin']), async (req, res) => {
	const doc = await Doctor.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
	if (!doc) return res.status(404).json({ message: 'not found' });
	return res.json(doc);
});

// Users management (basic list)
router.get('/users', requireAuth(['admin']), async (_req, res) => {
	const users = await User.find().select('name email role');
	return res.json(users);
});

// Payments overview
router.get('/payments', requireAuth(['admin']), async (_req, res) => {
	const payments = await Payment.find().sort({ createdAt: -1 });
	return res.json(payments);
});

// Support tickets
router.get('/support', requireAuth(['admin']), async (_req, res) => {
	const tickets = await SupportTicket.find().sort({ createdAt: -1 });
	return res.json(tickets);
});

router.post('/support/:id/status', requireAuth(['admin']), async (req, res) => {
	const t = await SupportTicket.findByIdAndUpdate(req.params.id, { status: req.body.status, adminComments: req.body.comment }, { new: true });
	if (!t) return res.status(404).json({ message: 'not found' });
	return res.json(t);
});

// History sharing approvals
router.post('/history/approve', requireAuth(['admin']), async (req, res) => {
	const { patientId, doctorId } = req.body;
	const hist = await MedicalHistory.findOneAndUpdate(
		{ patient: patientId, 'accessRequests.doctor': doctorId },
		{ $set: { 'accessRequests.$.status': 'admin_approved' } },
		{ new: true }
	);
	return res.json(hist);
});

// Patient marks request as approved by patient
router.post('/history/patient-approve', requireAuth(['admin']), async (req, res) => {
	const { patientId, doctorId } = req.body;
	const hist = await MedicalHistory.findOneAndUpdate(
		{ patient: patientId, 'accessRequests.doctor': doctorId },
		{ $set: { 'accessRequests.$.status': 'patient_approved' } },
		{ new: true }
	);
	return res.json(hist);
});

export default router;


