const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const protect = require('../middleware/authMiddleware');

// @desc    Onboard new Staff 
// @route   POST /api/hr/staff
router.post('/staff', protect, async (req, res) => {
  try {
    const staffMember = await Staff.create(req.body);
    res.status(201).json(staffMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get Staff by Department 
// @route   GET /api/hr/staff?dept=ICU
router.get('/staff', protect, async (req, res) => {
  const { dept, role } = req.query;
  let query = { status: 'Active' };
  
  if (dept) query.department = dept;
  if (role) query.role = role;

  try {
    const staff = await Staff.find(query).populate('user', 'name email');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update Shift or Status
// @route   PUT /api/hr/staff/:id
router.put('/staff/:id', protect, async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;