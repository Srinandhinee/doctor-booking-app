import mongoose from 'mongoose';

const PatientProfileSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		age: Number,
		gender: String,
		bloodGroup: String,
		location: { type: String },
		medicalHistory: {
			chronicIllnesses: [String],
			allergies: [String],
			medications: [String]
		},
		emergencyContact: {
			name: String,
			relationship: String,
			phone: String
		}
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, default: '' },
  // <--- check for approved field here
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);