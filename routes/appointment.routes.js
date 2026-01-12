const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User"); 
const Invoice = require("../models/Invoice"); 

// @route   POST /api/appointments
// @desc    Book an appointment
router.post("/", protect, async (req, res) => {
  const { patientName, patientPhone, doctorId, date, slot } = req.body;

  try {
    const exists = await Appointment.findOne({ doctor: doctorId, date, slot });
    if (exists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const appointment = await Appointment.create({
      patientName,
      patientPhone,
      doctor: doctorId,
      date,
      slot,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/appointments
// @desc    Get appointments (filtered by User Role)
router.get("/", protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patientName = req.user.name;
    } 
    else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ name: req.user.name });
      
      if (!doctorProfile) {
        return res.status(404).json({ 
          message: "Doctor profile not found for this user",
          debug: {
            userName: req.user.name,
            userId: req.user._id
          }
        });
      }

      console.log("--- BACKEND DOCTOR QUERY ---");
      console.log("User Name:", req.user.name);
      console.log("User ID:", req.user._id);
      console.log("Doctor Profile Found:", doctorProfile._id);
      
      query.doctor = doctorProfile._id;
    }

    const appointments = await Appointment.find(query)
      .populate("doctor", "name specialization")
      .sort({ date: 1, slot: 1 });

    console.log("Appointments found:", appointments.length);
    console.log("Query used:", query);

    res.json(appointments);
  } catch (err) {
    console.error("Appointments route error:", err);
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ name: req.user.name });

      console.log("--- UPDATE AUTH CHECK ---");
      console.log("User Name:", req.user.name);
      console.log("Doctor Profile ID:", doctorProfile?._id);
      console.log("Appointment Doctor ID:", appointment.doctor);

      if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ 
          message: "Not authorized to update this appointment",
          debug: {
            doctorProfileFound: !!doctorProfile,
            doctorProfileId: doctorProfile?._id,
            appointmentDoctorId: appointment.doctor
          }
        });
      }
    }

    if (status === 'Completed' && appointment.status !== 'Completed') {
      let patientId = appointment.patient; 
    
      if (!patientId && appointment.patientName) {
        const patientUser = await User.findOne({ name: appointment.patientName });
        if (patientUser) patientId = patientUser._id;
      }

      if (patientId) {
        await Invoice.create({
          patient: patientId,
          doctorName: req.user.name,
          date: new Date(),
          items: [{ description: "Consultation Fee", cost: 1500 }], // Default Fee
          totalAmount: 1500,
          status: "Unpaid"
        });
        console.log(`🧾 Invoice generated for ${appointment.patientName}`);
      } else {
        console.warn("⚠️ Could not generate invoice: Patient ID not found.");
      }
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);

  } catch (err) {
    console.error("Update appointment error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;