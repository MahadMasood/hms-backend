const express = require('express');
const router = express.Router();
const Bed = require('../models/Bed');
const Admission = require('../models/Admission');
const protect = require('../middleware/authMiddleware');


// @desc    Get all ACTIVE admissions 
// @route   GET /api/inpatient/admissions/active
router.get('/admissions/active', protect, async (req, res) => {
  try {
    const activeAdmissions = await Admission.find({ status: 'Active' })
      .populate('patient', 'name email phone');
    res.json(activeAdmissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Add a new Bed (Admin only)
// @route   POST /api/inpatient/beds
router.post('/beds', protect, async (req, res) => {
  try {
    const bed = await Bed.create(req.body);
    res.status(201).json(bed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get all beds 
// @route   GET /api/inpatient/beds
router.get('/beds', async (req, res) => {
  try {
    const beds = await Bed.find({});
    res.json(beds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admit a patient
// @route   POST /api/inpatient/admit
router.post('/admit', protect, async (req, res) => {
  const { patientId, bedId, doctorId, reason } = req.body;

  try {
    const bed = await Bed.findById(bedId);
    if (bed.status !== 'Available') {
      return res.status(400).json({ message: 'Bed is not available' });
    }

    const admission = await Admission.create({
      patient: patientId,
      bed: bedId,
      doctor: doctorId,
      reason
    });

    bed.status = 'Occupied';
    bed.currentPatient = patientId;
    await bed.save();

    res.status(201).json(admission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Discharge a patient
// @route   POST /api/inpatient/discharge/:admissionId
router.put('/discharge/:id', protect, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission || admission.status === 'Discharged') {
      return res.status(400).json({ message: 'Invalid admission record' });
    }

    admission.status = 'Discharged';
    admission.dischargeDate = Date.now();
    await admission.save();

    const bed = await Bed.findById(admission.bed);
    bed.status = 'Cleaning'; 
    bed.currentPatient = null;
    await bed.save();

    res.json({ message: 'Patient discharged', admission });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;