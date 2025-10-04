import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema(
	{
		appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
		patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
		content: { type: String, required: true },
		files: [{ url: String, name: String }]
	},
	{ timestamps: true }
);

export default mongoose.model('Prescription', PrescriptionSchema);


