import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
// import appointmentRoutes from './routes/appointmentRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import adminRouter from './routes/adminRoutes.js'

// Set default environment variables if not provided
process.env.PORT = process.env.PORT || 5000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

const app = express()
const port = process.env.PORT

connectDB() // Connect to MongoDB

//middlewares
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/admin', adminRoutes);


//routes or api endpoints
// app.use('/api/admin',adminRouter)
//localhost:4000/api/admin

app.get('/', (req, res) => {
  res.send('API working');
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
