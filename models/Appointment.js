const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  date: { type: Date, required: true }, 
  slot: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);