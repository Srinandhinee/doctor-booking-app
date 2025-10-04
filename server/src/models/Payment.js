import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
	{
		appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
		patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
		amount: { type: Number, required: true },
		status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
		gateway: { type: String, default: 'stripe' },
		gatewayPaymentId: { type: String }
	},
	{ timestamps: true }
);

export default mongoose.model('Payment', PaymentSchema);


