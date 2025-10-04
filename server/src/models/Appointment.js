import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
	{
		patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
		type: { type: String, enum: ['online', 'offline'], required: true },
		status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'], default: 'pending' },
		scheduledFor: { type: Date, required: true },
		slotLabel: { type: String },
		paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
		amount: { type: Number, default: 0 },
		consultationId: { type: String }
	},
	{ timestamps: true }
);

export default mongoose.model('Appointment', AppointmentSchema);


