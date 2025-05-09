const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  authorId: String,
  authorName: String,
}, { _id: false });

const postSchema = new mongoose.Schema({
  postNo: Number,
  content: String,
  authorId: String,
  authorName: String,
  comments: [commentSchema],
}, { _id: false });


const quizScoreSchema = new mongoose.Schema({
  lessonId: String,
  latest: Number,
  highest: Number
}, { _id: false });

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  role: {
    type: String,
    enum: ['user', 'instructor', 'admin', 'moderator'],
    default: 'user'
  },
  enrolledCourses: [Number],
  completedLessons: [String],
  quizMistakes: [
    {
      courseCode: Number,
      lang1: String,
      lang2: String
    }
  ],
  learnedWords: [
    {
      courseCode: Number,
      lang1: String,
      lang2: String
    }
  ],
  forumPosts: [postSchema],
  forumComments: [commentSchema],

  
  quizScores: [quizScoreSchema]
});

module.exports = mongoose.model('User', userSchema);
