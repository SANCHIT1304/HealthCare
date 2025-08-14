import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';
import 'dotenv/config';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestPatient = async () => {
  try {
    await connectDB();

    // Check if test patient already exists
    const existingPatient = await User.findOne({ email: 'john.patient@email.com' });
    if (existingPatient) {
      console.log('Test patient already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);

    // Create test patient
    const testPatient = new User({
      firstName: 'John',
      lastName: 'Patient',
      email: 'john.patient@email.com',
      password: hashedPassword,
      phone: '+1987654321',
      role: 'patient',
      isVerified: true,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      address: {
        street: '456 Patient St',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        country: 'USA'
      }
    });

    await testPatient.save();
    console.log('Test patient created successfully');
    console.log('Email: john.patient@email.com');
    console.log('Password: demo123');

  } catch (error) {
    console.error('Error creating test patient:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createTestPatient();
