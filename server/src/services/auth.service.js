import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

function signToken(user) {
	return jwt.sign(
		{ id: user._id.toString(), role: user.role, name: user.name },
		process.env.JWT_SECRET || 'dev_secret',
		{ expiresIn: '7d' }
	);
}

export async function registerUser(req, res) {
	try {
		const { email, password, role, profile } = req.body;
		if (!email || !password || !role) {
			return res.status(400).json({ message: 'email, password, role required' });
		}
		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ message: 'email already registered' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ email, passwordHash, role, name: profile?.name || '' });
		let customMessage = "Account created successfully.";
		if (role === 'doctor') {
			await Doctor.create({ user: user._id, ...profile, status: 'pending' });
			customMessage = "Doctor account created successfully. Your profile is pending approval.";
		} else if (role === 'patient') {
			customMessage = "Patient account created successfully. You can now book appointments.";
		}
		const token = signToken(user);
		return res.status(201).json({
			token,
			user: { id: user._id, role: user.role, name: user.name, email: user.email },
			message: customMessage
		});
	} catch (err) {
		return res.status(500).json({ message: 'registration failed' });
	}
}

export async function loginUser(req, res) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'invalid credentials' });
		const token = signToken(user);
		return res.status(200).json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email } });
	} catch (err) {
		return res.status(500).json({ message: 'login failed' });
	}
}

export async function me(req, res) {
	try {
		const user = await User.findById(req.user.id).lean();
		if (!user) return res.status(404).json({ message: 'not found' });
		return res.json({ id: user._id, role: user.role, name: user.name, email: user.email });
	} catch (err) {
		return res.status(500).json({ message: 'failed' });
	}
}


