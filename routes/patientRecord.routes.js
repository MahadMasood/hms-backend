const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Prescription = require("../models/Prescription");
const Report = require("../models/Report");
const Invoice = require("../models/Invoice");

// --- PRESCRIPTIONS ---

// @desc    Doctor creates a prescription
// @route   POST /api/records/prescriptions
router.post("/prescriptions", protect, async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get my prescriptions (Patient view)
// @route   GET /api/records/prescriptions/my
router.get("/prescriptions/my", protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- REPORTS (LABS/X-RAYS) ---

// @desc    Add a lab report (Admin/Lab tech)
// @route   POST /api/records/reports
router.post("/reports", protect, async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get my reports
// @route   GET /api/records/reports/my
router.get("/reports/my", protect, async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user.id }).sort({
      issuedDate: -1,
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- BILLING ---

// @desc    Get ALL invoices (Admin only)
// @route   GET /api/records/invoices/all
router.get("/invoices/all", protect, async (req, res) => {
  try {
    // Check if user is admin (assuming your protect middleware sets req.user)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const invoices = await Invoice.find({})
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Generate Invoice
// @route   POST /api/records/invoices
router.post("/invoices", protect, async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Get my invoices
// @route   GET /api/records/invoices/my
router.get("/invoices/my", protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ patient: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
