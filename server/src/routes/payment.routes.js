import { Router } from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../utils/auth.middleware.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET || 'sk_test_123', { apiVersion: '2024-06-20' });

// Create payment intent for online consults
router.post('/create-intent', requireAuth(['patient']), async (req, res) => {
	try {
		const { appointmentId } = req.body;
		const appt = await Appointment.findById(appointmentId);
		if (!appt || appt.patient.toString() !== req.user.id) return res.status(404).json({ message: 'not found' });
		const intent = await stripe.paymentIntents.create({
			amount: Math.round((appt.amount || 0) * 100),
			currency: 'inr',
			automatic_payment_methods: { enabled: true }
		});
		await Payment.create({ appointment: appt._id, patient: appt.patient, doctor: appt.doctor, amount: appt.amount, status: 'created', gatewayPaymentId: intent.id });
		return res.json({ clientSecret: intent.client_secret });
	} catch (e) {
		return res.status(500).json({ message: 'failed' });
	}
});

export default router;

// Webhook/confirm placeholder (in real app configure webhook)
router.post('/confirm', requireAuth(['patient']), async (req, res) => {
	const { appointmentId } = req.body;
	const appt = await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: 'paid', status: 'confirmed' }, { new: true });
	if (!appt) return res.status(404).json({ message: 'not found' });
	return res.json(appt);
});


