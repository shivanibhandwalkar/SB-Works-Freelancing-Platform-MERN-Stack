import mongoose from 'mongoose';

// ✅ User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, required: true }
});

// ✅ Freelancer Schema
const freelancerSchema = new mongoose.Schema({
  userId: String,
  skills: { type: Array, default: [] },
  description: { type: String, default: "" },
  currentProjects: { type: Array, default: [] },
  completedProjects: { type: Array, default: [] },
  applications: { type: Array, default: [] },
  funds: { type: Number, default: 0 }
});

// ✅ Project Schema
const projectSchema = new mongoose.Schema({
  clientId: String,
  clientName: String,
  clientEmail: String,
  title: String,
  description: String,
  budget: Number,
  skills: Array,
  bids: Array,
  bidAmounts: Array,
  postedDate: String,
  status: { type: String, default: "Available" },
  freelancerId: String,
  freelancerName: String,
  deadline: String,
  submission: { type: Boolean, default: false },
  submissionAccepted: { type: Boolean, default: false },
  projectLink: { type: String, default: "" },
  manulaLink: { type: String, default: "" },
  submissionDescription: { type: String, default: "" }
});

// ✅ Application Schema
const applicationSchema = new mongoose.Schema({
  projectId: String,
  clientId: String,
  clientName: String,
  clientEmail: String,
  freelancerId: String,
  freelancerName: String,
  freelancerEmail: String,
  title: String,
  description: String,
  budget: Number,
  requiredSkills: { type: Array, default: [] },
  freelancerSkills: { type: Array, default: [] },
  proposal: { type: String, default: "" },
  bidAmount: Number,
  estimatedTime: Number,
  status: { type: String, default: "Pending" }
});

// ✅ Chat Schema
const chatSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  messages: { type: Array }
});

// ✅ Named exports — DO NOT USE `export default`
export const User = mongoose.model('users', userSchema);
export const Freelancer = mongoose.model('freelancer', freelancerSchema);
export const Project = mongoose.model('projects', projectSchema);
export const Application = mongoose.model('applications', applicationSchema);
export const Chat = mongoose.model('chats', chatSchema);
