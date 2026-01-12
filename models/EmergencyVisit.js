const mongoose = require('mongoose');

const emergencyVisitSchema = mongoose.Schema({
  patientName: { type: String, required: true }, 
  age: { type: Number },
  gender: { type: String },
  triageLevel: { 
    type: String, 
    enum: ['Red', 'Yellow', 'Green'], 
    required: true 
  },
  chiefComplaint: { type: String, required: true }, // e.g., "Chest Pain", "Car Accident"
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  status: { 
    type: String, 
    enum: ['Waiting', 'In Treatment', 'Admitted', 'Discharged', 'Deceased'], 
    default: 'Waiting' 
  },
  entryTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyVisit', emergencyVisitSchema);