const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'https://hms-frontend-three-beta.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));


app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use('/api/doctors', require('./routes/doctor.routes'));
app.use('/api/records', require('./routes/patientRecord.routes'));
app.use('/api/inpatient', require('./routes/inpatient.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/er', require('./routes/emergency.routes'));
app.use('/api/maintenance', require('./routes/maintenance.routes'));
app.use('/api/hr', require('./routes/hr.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));