const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  type: { 
    type: String, 
    enum: ['Complaint', 'Suggestion', 'Appreciation'], 
    default: 'Complaint' 
  },
  department: String, 
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  status: { 
    type: String, 
    enum: ['New', 'Investigating', 'Resolved', 'Closed'], 
    default: 'New' 
  },
  adminResponse: String 
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);