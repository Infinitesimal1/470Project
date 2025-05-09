
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client();

router.post('/google', async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "59737575590-94l74j1ml9oevi0ji625d09crg4c5qsj.apps.googleusercontent.com",
  });

  const payload = ticket.getPayload();
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      role: 'user',
      enrolledCourses: [],
      completedLessons: [],
      quizMistakes: [],
      learnedWords: [],
    });
  }

  const jwtToken = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', jwtToken, { httpOnly: true }).json({ user });
});
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
