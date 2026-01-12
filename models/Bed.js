const mongoose = require('mongoose');

const bedSchema = mongoose.Schema({
  wardName: { type: String, required: true }, 
  bedNumber: { type: String, required: true }, 
  type: { type: String, default: 'Standard' },
  status: { 
    type: String, 
    enum: ['Available', 'Occupied', 'Maintenance', 'Cleaning'], 
    default: 'Available' 
  },
  currentPatient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } 
});

module.exports = mongoose.model('Bed', bedSchema);