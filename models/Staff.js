const mongoose = require('mongoose');

const staffSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  role: { 
    type: String, 
    enum: ['Doctor', 'Nurse', 'Technician', 'Receptionist', 'Admin'], 
    required: true 
  },
  department: { type: String, required: true },
  licenseNumber: { type: String, unique: true }, 
  licenseExpiry: { type: Date }, 
  shift: { 
    type: String, 
    enum: ['Morning', 'Evening', 'Night', 'Rotating'], 
    default: 'Morning' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'On Leave', 'Terminated'], 
    default: 'Active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);