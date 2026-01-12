const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Bed = require('../models/Bed');
const Inventory = require('../models/Inventory');
const Appointment = require('../models/Appointment');
const Feedback = require('../models/Feedback'); // Optional: Clear feedback too

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mahad:Ak2EAW6ObXwdw52Y@cluster0.avf1nsb.mongodb.net/?appName=Cluster0');

// --- DATA ---

const users = [
  { name: 'Admin User', email: 'admin@hospital.com', password: '123', role: 'admin' },
  { name: 'Dr. Sarah Wilson', email: 'sarah@hospital.com', password: '123', role: 'doctor' },
  { name: 'John Doe', email: 'john@patient.com', password: '123', role: 'patient' }
];

const doctors = [
  { name: 'Dr. Sarah Wilson', specialization: 'Cardiology', availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
  { name: 'Dr. Ali Khan', specialization: 'Neurology', availableSlots: ['02:00 PM', '03:00 PM'] },
  { name: 'Dr. Emily Stone', specialization: 'Pediatrics', availableSlots: ['11:00 AM', '12:00 PM'] }
];

const beds = [
  { wardName: 'ICU', bedNumber: 'ICU-01', type: 'Ventilator', status: 'Available' },
  { wardName: 'ICU', bedNumber: 'ICU-02', type: 'Ventilator', status: 'Occupied' },
  { wardName: 'General Ward', bedNumber: 'Gen-101', type: 'Standard', status: 'Available' },
];

const inventoryItems = [
  { name: 'Paracetamol', sku: 'MED-001', category: 'Medicine', quantity: 500, unitPrice: 5 },
  { name: 'Syringe 5ml', sku: 'EQP-002', category: 'Surgical', quantity: 300, unitPrice: 3 }
];

// --- MAIN FUNCTION ---

const importData = async () => {
  try {
   
    await User.deleteMany();
    await Doctor.deleteMany();
    await Bed.deleteMany();
    await Inventory.deleteMany();
    await Appointment.deleteMany();
    if(Feedback) await Feedback.deleteMany();

    console.log('🗑️  Old Data Destroyed...');

   
    const hashedPassword = bcrypt.hashSync('123', 10);
    const usersWithHash = users.map(u => ({ ...u, password: hashedPassword }));
    const createdUsers = await User.insertMany(usersWithHash);
    
  
    const patientUser = createdUsers.find(u => u.role === 'patient');
    
  
    const createdDoctors = await Doctor.insertMany(doctors);
    const sarahDoc = createdDoctors.find(d => d.name === 'Dr. Sarah Wilson');

  
    await Bed.insertMany(beds);
    await Inventory.insertMany(inventoryItems);

   
 
    const today = new Date(); 
    
    await Appointment.create({
      patientName: patientUser.name,
      patientPhone: "0300-1234567",
      doctor: sarahDoc._id, 
      date: today,         
      slot: "09:00 AM",
      status: "Pending"
    });

    console.log('✅ Data Imported! (Includes 1 Appointment for Today)');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Doctor.deleteMany();
    await Bed.deleteMany();
    await Inventory.deleteMany();
    await Appointment.deleteMany();
    console.log('🗑️  Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}