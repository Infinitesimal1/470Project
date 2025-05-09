const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');


router.get('/users', auth, requireRole('admin'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});


router.patch('/promote/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['instructor', 'moderator'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Only instructor or moderator allowed.' });
  }

  try {
    const updated = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Promotion failed' });
  }
});


router.patch('/demote/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await User.findByIdAndUpdate(id, { role: 'user' }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Demotion failed' });
  }
});


router.delete('/delete/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;

  
  if (req.user._id === id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  try {
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
