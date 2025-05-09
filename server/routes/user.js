const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 


router.post('/quiz-score', auth, async (req, res) => {
  const { lessonId, score } = req.body;

  try {
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    
    const existing = user.quizScores.find(q => q.lessonId === lessonId);

    if (existing) {
      existing.latest = score;
      if (score > existing.highest) existing.highest = score;
    } else {
      user.quizScores.push({ lessonId, latest: score, highest: score });
    }

    user.markModified('quizScores'); 
    await user.save();

    res.json({ message: "✅ Score saved to profile" });

  } catch (err) {
    console.error("❌ Score save error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -googleId');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Profile fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
