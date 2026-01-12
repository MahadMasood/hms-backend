const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  name: { type: String, required: true }, 
  sku: { type: String, unique: true }, // Stock Keeping Unit ID
  category: { 
    type: String, 
    enum: ['Medicine', 'Surgical', 'Equipment', 'General'], 
    default: 'Medicine' 
  },
  quantity: { type: Number, default: 0 },
  unitPrice: { type: Number, required: true },
  expiryDate: { type: Date },
  reorderLevel: { type: Number, default: 10 } 
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);