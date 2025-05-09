const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 

router.post('/quiz-score', auth, async (req, res) => {
  const { lessonId, score } = req.body;

  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);

    if (!user) return res.status(404).send({ error: "User not found" });

    const existing = user.quizScores.find(q => q.lessonId === lessonId);
    if (existing) {
      existing.latest = score;
      if (score > existing.highest) existing.highest = score;
    } else {
      user.quizScores.push({ lessonId, latest: score, highest: score });
    }

    user.markModified('quizScores');
    await user.save();

    res.send({ message: "✅ Score saved to profile" });

  } catch (err) {
    console.error("❌ Score save error:", err.message);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
