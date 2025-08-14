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

const createTestDoctor = async () => {
  try {
    await connectDB();

    // Check if test doctor already exists
    const existingDoctor = await User.findOne({ email: 'dr.smith@hospital.com' });
    if (existingDoctor) {
      console.log('Test doctor already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);

    // Create test doctor
    const testDoctor = new User({
      firstName: 'John',
      lastName: 'Smith',
      email: 'dr.smith@hospital.com',
      password: hashedPassword,
      phone: '+1234567890',
      role: 'doctor',
      isVerified: true,
      specialization: 'Cardiology',
      experience: 10,
      location: 'New York, NY',
      consultationFee: 150,
      education: ['MBBS', 'MD Cardiology'],
      qualifications: 'Board Certified Cardiologist',
      hospitalAffiliation: 'City General Hospital',
      description: 'Experienced cardiologist with expertise in heart disease treatment.',
      bio: 'Dr. John Smith is a board-certified cardiologist with over 10 years of experience in treating cardiovascular diseases.',
      licenseNumber: 'MD123456',
      gender: 'male',
      address: {
        street: '123 Medical Center Dr',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    });

    await testDoctor.save();
    console.log('Test doctor created successfully');
    console.log('Email: dr.smith@hospital.com');
    console.log('Password: demo123');

  } catch (error) {
    console.error('Error creating test doctor:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createTestDoctor();
