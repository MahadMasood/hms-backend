const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// @route   POST /api/doctors
// @desc    Add a new doctor
router.post('/', async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/doctors
// @desc    Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;