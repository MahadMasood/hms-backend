const express = require('express');
const router = express.Router();
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Bed = require('../models/Bed'); 
const protect = require('../middleware/authMiddleware');

// @desc    Create a ticket
// @route   POST /api/maintenance
router.post('/', protect, async (req, res) => {
  const { department, item, issueType, description, priority, bedId } = req.body;

  try {
    const ticket = await MaintenanceTicket.create({
      requester: req.user.id,
      department,
      item,
      issueType,
      description,
      priority
    });

    if (issueType === 'Cleaning' && bedId) {
       await Bed.findByIdAndUpdate(bedId, { status: 'Cleaning' });
    }

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get all open tickets
// @route   GET /api/maintenance
router.get('/', protect, async (req, res) => {
  try {
    const tickets = await MaintenanceTicket.find({ status: { $ne: 'Resolved' } });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Resolve a ticket
// @route   PUT /api/maintenance/:id/resolve
router.put('/:id/resolve', protect, async (req, res) => {
  try {
    const ticket = await MaintenanceTicket.findById(req.params.id);
    
    ticket.status = 'Resolved';
    await ticket.save();
    
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;