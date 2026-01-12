const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, 
  type: { 
    type: String, 
    enum: ['Lab', 'Radiology', 'Pathology'], 
    required: true 
  },
  resultSummary: String, 
  fileUrl: String, 
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Ready'], 
    default: 'Processing' 
  },
  issuedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);