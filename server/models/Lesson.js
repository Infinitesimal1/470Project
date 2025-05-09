
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonId: { type: String, required: true, unique: true },
  courseCode: { type: Number, required: true },
  paragraphs: [String],
  translations: [{
    lang1: String,
    lang2: String,
    pronunciation: String
  }]
});

module.exports = mongoose.model('Lesson', lessonSchema);
