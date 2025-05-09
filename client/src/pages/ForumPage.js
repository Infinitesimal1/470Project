
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ForumStyles.css";

const ForumPage = () => {
  const { lessonId } = useParams();
  const [forum, setForum] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newComments, setNewComments] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  const loadForum = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum/${lessonId}`);
      setForum(res.data);
    } catch (err) {
      console.error("Forum load failed", err);
    }
  };

  useEffect(() => {
    loadForum();
    
  }, [lessonId]);

  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/forum/${lessonId}/post`,
        {
          content: newPostContent,
          authorId: user?._id,
          authorName: user?.name || "Anon"
        },
        { withCredentials: true }
      );
      setForum(res.data);
      setNewPostContent("");
    } catch (err) {
      console.error("Add post failed", err);
    }
  };

  const handleAddComment = async (postNo) => {
    const comment = newComments[postNo];
    if (!comment?.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/forum/${lessonId}/post/${postNo}/comment`,
        {
          comment,
          authorId: user?._id,
          authorName: user?.name || "Anon"
        },
        { withCredentials: true }
      );
      setForum(res.data);
      setNewComments((prev) => ({ ...prev, [postNo]: "" }));
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  if (!forum) return <div style={{padding:"20px"}}>Loading forum...</div>;

  return (
    <div className="forum-wrapper">
      <h2 style={{marginBottom:'20px'}}>Forum for Lesson {lessonId}</h2>

      
      <div className="post-card" style={{backgroundColor:'#f5f3ff'}}>
        <textarea
          rows={3}
          placeholder="Write something..."
          value={newPostContent}
          onChange={(e)=>setNewPostContent(e.target.value)}
          style={{width:'100%',padding:'8px',borderRadius:'6px',border:'1px solid #ccc'}}
        />
        <button onClick={handleAddPost} style={{marginTop:'8px',padding:'6px 12px',borderRadius:'6px'}}>Post</button>
      </div>

      
      {forum.posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        forum.posts.map((post)=>(
          <div key={post.postNo} className="post-card">
            <div className="post-header">
              <span className="post-no">#{post.postNo}</span>
              <span className="post-author">{post.authorName || "Anon"}</span>
            </div>
            <div className="post-content">{post.content}</div>

            
            <div style={{marginTop:'8px'}}>
              <strong style={{fontSize:'14px'}}>Comments</strong>
              {post.comments.length === 0 ? (
                <p style={{fontSize:'14px'}}>No comments yet</p>
              ) : (
                post.comments.map((c,idx)=>(
                  <div key={idx} style={{marginTop:'4px',paddingLeft:'12px',fontSize:'14px'}}>
                    <span style={{fontWeight:'500',color:'#6b46c1'}}>{c.authorName || "Anon"}: </span>
                    {c.text}
                  </div>
                ))
              )}
              
              <div style={{marginTop:'6px',paddingLeft:'12px'}}>
                <input
                  type="text"
                  placeholder="Add comment"
                  value={newComments[post.postNo] || ""}
                  onChange={(e)=>setNewComments(prev=>({...prev,[post.postNo]:e.target.value}))}
                  style={{width:'70%',padding:'4px 6px',borderRadius:'6px',border:'1px solid #ccc',marginRight:'4px'}}
                />
                <button onClick={()=>handleAddComment(post.postNo)} style={{padding:'4px 10px',borderRadius:'6px'}}>Reply</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ForumPage;
