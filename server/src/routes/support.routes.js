import { Router } from 'express';
import { requireAuth } from '../utils/auth.middleware.js';
import SupportTicket from '../models/SupportTicket.js';

const router = Router();

router.post('/', requireAuth(['patient', 'doctor']), async (req, res) => {
	const { category, description } = req.body;
	const t = await SupportTicket.create({ submitter: req.user.id, role: req.user.role, category, description });
	return res.status(201).json(t);
});

router.get('/', requireAuth(['patient', 'doctor']), async (req, res) => {
	const tickets = await SupportTicket.find({ submitter: req.user.id }).sort({ createdAt: -1 });
	return res.json(tickets);
});

export default router;


