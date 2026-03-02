const mongoose = require('mongoose');

const jointTeachingSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true },
  facultyInvolved: { type: String }, // Deprecated, keeping for compatibility
  facultyWithinCollege: { type: String, required: true },
  facultyOutsideCollege: { type: String },
  syllabusDoc: { type: String },
  certificate: { type: String, required: true }, // Made mandatory
  hours: { type: Number, required: true }, // Removed min/max constraints
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  calculatedDuration: { type: String }, // Will store "X days" or "X weeks"
  toBePaid: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JointTeaching', jointTeachingSchema);
