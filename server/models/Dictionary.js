
const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({
  courseCode: { type: Number, required: true },
  lang1: { type: String, required: true },
  lang2: { type: String, required: true },
  pronunciation: { type: String }
});

module.exports = mongoose.model('Dictionary', dictionarySchema);
