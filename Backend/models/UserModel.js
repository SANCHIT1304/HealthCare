import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date},
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  isVerified: { type: Boolean, default: false },
  specialization: { type: String },
  experience: { type: Number },
  location: { type: String },
  consultationFee: { type: Number, default: 0 },
  education: { type: String },
  qualifications: { type: String },
  hospitalAffiliation: { type: String },
  description: { type: String },
//   documents: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);


// import mongoose from 'mongoose';


// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     image: { type: String, required: true },
//     address: { type: Object, default: {line1: '', line2: ''} },
//     gender: { type: String, default: "Not selected"},// not selected because we have to make it optional
//     dob: { type: String, default: "Not selected"},
//     phone: { type: String, default: "00000000" }, // why default: "00000000" ? because we have to make it optional and we have to make it like this that if user does not enter phone number then it will be stored as 00000000
// }); 

// const UserModel = mongoose.models.user || mongoose.model('UserModel', userSchema);

// export default UserModel;

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["patient", "doctor", "admin"],
//     default: "patient",
//   },
//   isVerified: {
//     type: Boolean,
//     default: false, // admin sets true when verifying doctor
//   },
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);
