import jwt from 'jsonwebtoken';

export function requireAuth(roles = []) {
	return function (req, res, next) {
		try {
			const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
			if (!token) return res.status(401).json({ message: 'Unauthenticated' });
			const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
			req.user = payload;
			if (roles.length > 0 && !roles.includes(payload.role)) {
				return res.status(403).json({ message: 'Forbidden' });
			}
			return next();
		} catch (err) {
			return res.status(401).json({ message: 'Invalid token' });
		}
	};
}


