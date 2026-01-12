const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    description: String, 
    cost: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Unpaid', 'Paid', 'Insurance Pending'], 
    default: 'Unpaid' 
  },
  paymentDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);