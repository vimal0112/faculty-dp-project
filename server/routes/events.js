const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all upcoming events (public route)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(20);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events (including past)
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
