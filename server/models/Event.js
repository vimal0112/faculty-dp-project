const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['FDP', 'Seminar', 'Workshop', 'Conference'], required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  description: { type: String },
  registrationLink: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
