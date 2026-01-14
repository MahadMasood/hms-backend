const express = require('express');
const router = express.Router();
const EmergencyVisit = require('../models/EmergencyVisit');
const protect = require('../middleware/authMiddleware');

// @desc    Register new ER Patient (Triage Nurse)
// @route   POST /api/er/triage
router.post('/triage', protect, async (req, res) => {
  try {
    const visit = await EmergencyVisit.create(req.body);
    res.status(201).json(visit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get Active ER Board (Sorted by urgency: Red first)
// @route   GET /api/er/active
router.get('/active', protect, async (req, res) => {
  try {
    const activeVisits = await EmergencyVisit.find({ 
      status: { $in: ['Waiting', 'In Treatment'] } 
    }).sort({ triageLevel: -1, entryTime: 1 }); 
    
    res.json(activeVisits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update Status (e.g., Move to 'Admitted')
// @route   PUT /api/er/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const visit = await EmergencyVisit.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(visit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;