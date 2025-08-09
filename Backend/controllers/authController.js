import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { validationResult } from 'express-validator';


// POST /api/auth/register
export const register = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, email, password, role, specialization, experience, location, phone, dateOfBirth, hospitalAffiliation, description, consultationFee, education, qualifications } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      role,
      isVerified: role === 'doctor' ? false : true,
      specialization,
      experience,
      location,
      consultationFee,
      education,
      qualifications,
      hospitalAffiliation,
      description,
    });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch profile' });
  }
};


// import User from '../models/UserModel.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// // import { validationResult } from 'express-validator';

// // Generate JWT token
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// };

// // POST /api/auth/register
// export const registerUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { name, email, password, role } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'Email already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       isVerified: role === 'doctor' ? false : true, // patient = auto-verified
//     });

//     const token = generateToken(user);

//     res.status(201).json({ token, user });
//   } catch (error) {
//     res.status(500).json({ message: 'Registration failed', error });
//   }
// };

// // POST /api/auth/login
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid email or password' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

//     if (user.role === 'doctor' && !user.isVerified)
//       return res.status(403).json({ message: 'Doctor not verified by admin yet' });

//     const token = generateToken(user);
//     res.status(200).json({ token, user });
//   } catch (error) {
//     res.status(500).json({ message: 'Login failed', error });
//   }
// };