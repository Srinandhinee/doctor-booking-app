import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema(
	{
		submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		role: { type: String, enum: ['patient', 'doctor'], required: true },
		category: { type: String, enum: ['payment', 'technical', 'other'], default: 'other' },
		description: { type: String, required: true },
		status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
		adminComments: String
	},
	{ timestamps: true }
);

export default mongoose.model('SupportTicket', SupportTicketSchema);


