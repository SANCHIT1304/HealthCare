// import User from '../models/UserModel.js';

// export const getPendingDoctors = async (req, res) => {
//   try {
//     const pendingDoctors = await User.find({ role: 'doctor', isVerified: false });
//     res.json(pendingDoctors);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching unverified doctors', error });
//   }
// };

// export const verifyDoctor = async (req, res) => {
//   try {
//     const doctor = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
//     res.json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: 'Verification failed', error });
//   }
// };


// API for adding doctor
const addDoctor = async (req, resp) => {
  try {
    const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
    const imageFile = req.file
    console.log({name, email, password, speciality, degree, experience, about, fees, address}, imageFile)
    
  } catch (error) {
    
  }
}

export {addDoctor}