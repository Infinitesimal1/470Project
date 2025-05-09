import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthRole from '../hooks/useAuthRole'; 

const ForumModerationPage = () => {
  useAuthRole(['admin', 'moderator', 'instructor']); 

  const [lessonId, setLessonId] = useState("");
  const [forum, setForum] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/lessons").then(res => setLessons(res.data));
  }, []);

  useEffect(() => {
    if (lessonId) {
      axios.get(`http://localhost:5000/api/forum/${lessonId}`)
        .then(res => setForum(res.data))
        .catch(() => setForum(null));
    }
  }, [lessonId]);

  const deletePost = async (postNo) => {
    await axios.delete(`http://localhost:5000/api/forum/${lessonId}/post/${postNo}`, { withCredentials: true });
    setForum(prev => ({ ...prev, posts: prev.posts.filter(p => p.postNo !== postNo) }));
  };

  const deleteComment = async (postNo, index) => {
    await axios.delete(`http://localhost:5000/api/forum/${lessonId}/post/${postNo}/comment/${index}`, { withCredentials: true });
    setForum(prev => {
      const newPosts = prev.posts.map(post => {
        if (post.postNo === postNo) {
          const updated = [...post.comments];
          updated.splice(index, 1);
          return { ...post, comments: updated };
        }
        return post;
      });
      return { ...prev, posts: newPosts };
    });
  };

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <h2>Forum Moderation</h2>
      <select value={lessonId} onChange={e => setLessonId(e.target.value)}>
        <option value="">Select Lesson</option>
        {lessons.map(l => (
          <option key={l.lessonId} value={l.lessonId}>Lesson {l.lessonId}</option>
        ))}
      </select>

      {forum && forum.posts.map(post => (
        <div key={post.postNo} style={{ border: "1px solid gray", marginTop: "20px", padding: "10px" }}>
          <p><strong>Post #{post.postNo}</strong> by {post.authorName || "Unknown"}</p>
          <p>{post.content}</p>
          <button onClick={() => deletePost(post.postNo)}>🗑️ Delete Post</button>

          <h4>Comments:</h4>
          <ul>
            {post.comments.map((c, idx) => (
              <li key={idx}>
                <strong>{c.authorName || "Anon"}:</strong> {c.text}
                <button onClick={() => deleteComment(post.postNo, idx)} style={{ marginLeft: "10px" }}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ForumModerationPage;
