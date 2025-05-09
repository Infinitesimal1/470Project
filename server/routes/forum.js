const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');
const Lesson = require('../models/Lesson'); 
const User = require('../models/User');     
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');



router.get('/all', async (req, res) => {
  try {
    
    const forums = await Forum.find({});
    res.send(forums);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.get('/:lessonId', async (req, res) => {
  try {
    const forum = await Forum.findOne({ lessonId: req.params.lessonId });
    if (!forum) return res.status(404).send({ error: 'Forum not found' });
    res.send(forum);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.post('/:lessonId/post', async (req, res) => {
  try {
    const { content, authorId, authorName } = req.body;

    const lessonExists = await Lesson.findOne({ lessonId: req.params.lessonId });
    if (!lessonExists) return res.status(400).send({ error: 'Invalid lesson ID' });

    let forum = await Forum.findOne({ lessonId: req.params.lessonId });
    if (!forum) {
      forum = new Forum({ lessonId: req.params.lessonId, posts: [] });
    }

    const postNo = forum.posts.length;
    const newPost = {
      postNo,
      content,
      authorId,
      authorName,
      comments: []
    };

    forum.posts.push(newPost);
    await forum.save();

    await User.findByIdAndUpdate(authorId, {
      $push: {
        posts: {
          lessonId: req.params.lessonId,
          postNo,
          content
        }
      }
    });

    res.send(forum);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


router.post('/:lessonId/post/:postNo/comment', async (req, res) => {
  try {
    const { comment, authorId, authorName } = req.body;

    const forum = await Forum.findOne({ lessonId: req.params.lessonId });
    if (!forum) return res.status(404).send({ error: 'Forum not found' });

    const post = forum.posts.find(p => p.postNo == req.params.postNo);
    if (!post) return res.status(404).send({ error: 'Post not found' });

    post.comments.push({
      text: comment,
      authorId,
      authorName
    });

    await forum.save();

    await User.findByIdAndUpdate(authorId, {
      $push: {
        comments: {
          lessonId: req.params.lessonId,
          postNo: req.params.postNo,
          text: comment
        }
      }
    });

    res.send(forum);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete('/:lessonId/post/:postNo', verifyToken, requireRole(["admin", "moderator", "instructor"]), async (req, res) => {
  const forum = await Forum.findOne({ lessonId: req.params.lessonId });
  if (!forum) return res.status(404).send({ error: 'Forum not found' });

  forum.posts = forum.posts.filter(p => p.postNo != req.params.postNo);
  await forum.save();
  res.send(forum);
});


router.delete('/:lessonId/post/:postNo/comment/:commentIndex', verifyToken, requireRole(["admin", "moderator", "instructor"]), async (req, res) => {
  const forum = await Forum.findOne({ lessonId: req.params.lessonId });
  if (!forum) return res.status(404).send({ error: 'Forum not found' });

  const post = forum.posts.find(p => p.postNo == req.params.postNo);
  if (!post) return res.status(404).send({ error: 'Post not found' });

  post.comments.splice(req.params.commentIndex, 1);
  await forum.save();
  res.send(forum);
});

module.exports = router;

