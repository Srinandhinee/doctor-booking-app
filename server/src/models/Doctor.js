import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
		specialization: { type: String },
		experienceYears: { type: Number },
		location: { type: String },
		clinicDetails: { type: String },
		consultationFees: { type: Number, default: 0 },
		licenses: [{ url: String, name: String }],
		status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
		availability: [
			{
				dayOfWeek: Number,
				start: String,
				end: String,
				slots: [String]
			}
		]
	},
	{ timestamps: true }
);

export default mongoose.model('Doctor', DoctorSchema);


