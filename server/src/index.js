import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] }
});

// Basic middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', apiLimiter);

// Health check
app.get('/health', (_req, res) => {
	return res.status(200).json({ status: 'ok' });
});

// Routes
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import supportRoutes from './routes/support.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/support', supportRoutes);

// Socket.io for consult signaling
io.on('connection', (socket) => {
	// Rooms by consultationId
	socket.on('join-consult', ({ consultationId, userId }) => {
		socket.join(consultationId);
		io.to(consultationId).emit('participant-joined', { userId });
	});

	socket.on('signal', ({ consultationId, data }) => {
		io.to(consultationId).emit('signal', data);
	});

	socket.on('leave-consult', ({ consultationId, userId }) => {
		socket.leave(consultationId);
		io.to(consultationId).emit('participant-left', { userId });
	});
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor_booking';
const PORT = process.env.PORT || 5000;

async function start() {
	try {
		await mongoose.connect(MONGO_URI);
		server.listen(PORT, () => {
			console.log(`API listening on :${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();


