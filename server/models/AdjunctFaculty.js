const mongoose = require('mongoose');

const adjunctFacultySchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyName: { type: String, required: true },
  department: { type: String, required: true },
  courseCode: { type: String, required: true },
  supportingDocs: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdjunctFaculty', adjunctFacultySchema);
