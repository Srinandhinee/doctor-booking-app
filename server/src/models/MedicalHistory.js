import mongoose from 'mongoose';

const HistoryAccessRequestSchema = new mongoose.Schema(
	{
		patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
		status: { type: String, enum: ['requested', 'patient_approved', 'admin_approved', 'rejected'], default: 'requested' }
	},
	{ timestamps: true }
);

const MedicalHistorySchema = new mongoose.Schema(
	{
		patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		records: [
			{
				appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
				doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
				prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
				date: { type: Date }
			}
		],
		accessRequests: [HistoryAccessRequestSchema]
	},
	{ timestamps: true }
);

export default mongoose.model('MedicalHistory', MedicalHistorySchema);


