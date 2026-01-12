const mongoose = require('mongoose');

const admissionSchema = mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, 
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date },
  reason: String, 
  status: { 
    type: String, 
    enum: ['Admitted', 'Discharged'], 
    default: 'Admitted' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);