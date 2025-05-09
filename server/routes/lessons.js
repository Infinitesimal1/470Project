const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Forum = require('../models/Forum'); 


router.post('/add', async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();

    
    const existingForum = await Forum.findOne({ lessonId: lesson.lessonId });
    if (!existingForum) {
      await Forum.create({ lessonId: lesson.lessonId, posts: [] });
    }

    res.status(201).send(lesson);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  const lessons = await Lesson.find();
  res.send(lessons);
});


router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ lessonId: req.params.id });
    if (!lesson) return res.status(404).send({ error: "Lesson not found" });
    res.send(lesson);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await Lesson.findOneAndUpdate(
      { lessonId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send({ error: "Lesson not found" });
    res.send(updated);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
