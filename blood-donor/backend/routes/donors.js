import express from 'express';
import Donor from '../models/Donor.js';

const router = express.Router();

// Get all donors with filters
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city, state, available } = req.query;
    let query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (available !== undefined) query.isAvailable = available === 'true';

    const donors = await Donor.find(query).sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donor by ID
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new donor
router.post('/', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    const savedDonor = await donor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update donor
router.put('/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete donor
router.delete('/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search donors by blood group and location
router.get('/search/:bloodGroup', async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    const { city, radius = 50 } = req.query;

    let query = { 
      bloodGroup: bloodGroup.toUpperCase(),
      isAvailable: true
    };

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const donors = await Donor.find(query)
      .select('-medicalHistory')
      .sort({ lastDonation: 1 });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;