
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForumStyles.css";

const AllForumsPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/forum/all");
        
        const flat = [];
        res.data.forEach(forum => {
          forum.posts.forEach(post => {
            flat.push({
              lessonId: forum.lessonId,
              postNo: post.postNo,
              authorName: post.authorName || "Anon",
              content: post.content,
              commentsCount: post.comments.length
            });
          });
        });
        
        flat.sort((a,b) => {
          if (a.lessonId === b.lessonId) return b.postNo - a.postNo;
          return a.lessonId.localeCompare(b.lessonId);
        });
        setPosts(flat);
      } catch (err) {
        console.error("Failed to load all forums", err);
      }
    };
    fetchForums();
  }, []);

  const goToPost = (lessonId) => {
    navigate(`/forum/${lessonId}`);
  };

  return (
    <div className="forum-wrapper">
      <h2 style={{marginBottom:'20px'}}>🌐 All Forums</h2>
      {posts.length === 0 ? (
        <p>No forum posts yet.</p>
      ) : (
        posts.map((p,idx) => (
          <div key={idx} className="post-card" onClick={() => goToPost(p.lessonId)}>
            <div className="post-header">
              <span className="post-no">#{p.postNo}</span>
              <span className="post-author">{p.authorName}</span>
              <span className="post-lesson">Lesson {p.lessonId}</span>
            </div>
            <div className="post-content">{p.content.slice(0,200)}{p.content.length>200?'…':''}</div>
            <div className="post-footer">{p.commentsCount} comments →</div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllForumsPage;
