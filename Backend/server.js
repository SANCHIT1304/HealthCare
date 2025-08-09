import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import authRoutes from './routes/authRoutes.js';
// import doctorRoutes from './routes/doctorRoutes.js';
// import appointmentRoutes from './routes/appointmentRoutes.js';
// import patientRoutes from './routes/patientRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import adminRouter from './routes/adminRoutes.js'

// dotenv.config();
const app = express()
const port = process.env.PORT || 5000

connectDB() // Connect to MongoDB

//middlewares
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/patients', patientRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/admin', adminRoutes);


//routes or api endpoints
// app.use('/api/admin',adminRouter)
//localhost:4000/api/admin

app.get('/', (req, res) => {
  res.send('API working');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
