const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// @route   POST /api/doctors
// @desc    Add a new doctor
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, specialization, availableSlots } = req.body;

  try {
   
    const cleanName = name.replace(/^Dr\.\s+/i, '').replace(/\s+/g, '.').toLowerCase();
    const email = `${cleanName}@hospital.com`;
    const defaultPassword = '123'; 

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: `User ${email} already exists. Cannot create duplicate.` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const newUser = await User.create({
      name, 
      email, 
      password: hashedPassword,
      role: 'doctor'
    });

    const newDoctor = await Doctor.create({
      _id: newUser._id,
      name,
      specialization,
      availableSlots
    });

    res.status(201).json({
      message: "Doctor and User account created successfully",
      doctor: newDoctor,
      credentials: { email, password: defaultPassword } 
    });

  } catch (error) {
   
    console.error(error);
    res.status(400).json({ message: error.message });
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