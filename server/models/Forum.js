const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  authorId: String,
  authorName: String
});

const postSchema = new mongoose.Schema({
  postNo: Number,
  content: String,
  authorId: String,
  authorName: String,
  comments: [commentSchema]
});

const forumSchema = new mongoose.Schema({
  lessonId: String,
  posts: [postSchema]
});

module.exports = mongoose.model('Forum', forumSchema);

