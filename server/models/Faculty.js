const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  academicInfo: {
    department: String,
    designation: String,
    qualification: String,
    experience: Number,
  },
  publications: [{
    title: String,
    journal: String,
    year: Number,
  }],
  fdpsAttended: [{
    title: String,
    organizer: String,
    duration: Number,
    year: Number,
  }],
  fdpsOrganized: [{
    title: String,
    organizer: String,
    duration: Number,
    year: Number,
  }],
  seminars: [{
    title: String,
    organizer: String,
    date: Date,
  }],
  jointTeaching: [{
    subject: String,
    partnerInstitution: String,
    year: Number,
  }],
  adjunctFaculty: [{
    name: String,
    institution: String,
    subject: String,
    year: Number,
  }],
  abl: [{
    activity: String,
    description: String,
    year: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});

const facultyModel = mongoose.model('Faculty_fdp', facultySchema);
module.exports = facultyModel;