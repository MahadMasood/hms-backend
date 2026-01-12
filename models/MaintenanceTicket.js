const mongoose = require('mongoose');

const maintenanceTicketSchema = mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  department: { type: String, required: true },
  item: { type: String, required: true }, 
  issueType: { 
    type: String, 
    enum: ['Repair', 'Cleaning', 'Safety', 'IT Support'], 
    required: true 
  },
  description: String,
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved'], 
    default: 'Open' 
  },
  assignedTo: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
