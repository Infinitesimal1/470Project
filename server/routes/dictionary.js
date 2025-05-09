
const express = require('express');
const router = express.Router();
const Dictionary = require('../models/Dictionary');


router.post('/add', async (req, res) => {
  try {
    const { courseCode, lang1, lang2, pronunciation } = req.body;

    const existing = await Dictionary.findOne({ courseCode, lang1 });
    if (existing) {
      return res.status(400).send({ error: "This word already exists in the dictionary for this course." });
    }

    const entry = new Dictionary({ courseCode, lang1, lang2, pronunciation });
    await entry.save();
    res.status(201).send(entry);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  const entries = await Dictionary.find();
  res.send(entries);
});


router.get('/:lang1/:courseCode', async (req, res) => {
  try {
    const entry = await Dictionary.findOne({
      lang1: req.params.lang1,
      courseCode: parseInt(req.params.courseCode)
    });
    if (!entry) return res.status(404).send({ error: "Word not found." });
    res.send(entry);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.put('/:lang1/:courseCode', async (req, res) => {
  try {
    const updated = await Dictionary.findOneAndUpdate(
      { lang1: req.params.lang1, courseCode: parseInt(req.params.courseCode) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send({ error: "Word not found." });
    res.send(updated);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
