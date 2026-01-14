const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const protect = require('../middleware/authMiddleware');

// @desc    Submit Feedback (Patient)
// @route   POST /api/feedback
router.post('/', protect, async (req, res) => {
  try {
    const feedback = await Feedback.create({
      ...req.body,
      patient: req.user.id // Link to logged-in user
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get All Complaints (Admin Dashboard)
// @route   GET /api/feedback
router.get('/', protect, async (req, res) => {
  try {
    // Show "New" complaints first
    const items = await Feedback.find({}).sort({ status: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Resolve Complaint
// @route   PUT /api/feedback/:id/resolve
router.put('/:id/resolve', protect, async (req, res) => {
  const { adminResponse, status } = req.body;
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { adminResponse, status: status || 'Resolved' },
      { new: true }
    );
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;