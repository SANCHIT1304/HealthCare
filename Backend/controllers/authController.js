import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// POST /api/auth/register
export const register = async (req, res) => {
  const { firstName, lastName, email, password, role, specialization, experience, location, phone, dateOfBirth, hospitalAffiliation, description, consultationFee, education, qualifications } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Registration failed',
        errors: [{ field: 'email', message: 'Email already registered' }]
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      role,
      isVerified: role === 'doctor' ? false : true,
      specialization,
      experience: experience ? parseInt(experience) : undefined,
      location,
      consultationFee: consultationFee ? parseFloat(consultationFee) : undefined,
      education,
      qualifications,
      hospitalAffiliation,
      description,
    });

    await newUser.save();

    // Return success response
    res.status(201).json({ 
      message: 'Registration successful',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Server error during registration',
      errors: [{ field: 'general', message: 'Internal server error' }]
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Login failed',
        errors: [{ field: 'general', message: 'Invalid email or password' }]
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Login failed',
        errors: [{ field: 'general', message: 'Invalid email or password' }]
      });
    }

    // Check if doctor is verified
    if (user.role === 'doctor' && !user.isVerified) {
      return res.status(403).json({ 
        message: 'Account not verified',
        errors: [{ field: 'general', message: 'Your doctor account is pending verification by admin. Please wait for approval.' }]
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Server error during login',
      errors: [{ field: 'general', message: 'Internal server error' }]
    });
  }
};

// GET /api/auth/profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Unable to fetch profile' });
  }
};