const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all inventory items
// @route   GET /api/inventory
router.get('/', protect, async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Add new stock item
// @route   POST /api/inventory
router.post('/', protect, async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update stock (Consume or Restock)
// @route   POST /api/inventory/:id/adjust
router.post('/:id/adjust', protect, async (req, res) => {
  const { adjustment, type } = req.body; // adjustment = amount (e.g. 5), type = 'add' or 'remove'

  try {
    const item = await Inventory.findById(req.params.id);
    
    if (type === 'add') {
      item.quantity += adjustment;
    } else if (type === 'remove') {
      if (item.quantity < adjustment) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      item.quantity -= adjustment;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;