import { useEffect, useState } from 'react';
import axios from 'axios';
import useRoleRedirect from '../hooks/useRoleRedirect';

const ProfilePage = () => {
  useRoleRedirect(["user", "admin", "moderator", "instructor"]); 

  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/";
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } catch {
      window.location.href = "/";
    }
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

    localStorage.removeItem("user"); 

    window.location.href = "/";
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <button onClick={handleLogout}>Logout</button>
      

      {user.role === 'admin' && (
        <>
        <button onClick={() => window.location.href = "/admin"}>
          Go to Admin Panel
        </button>
        <button onClick={() => window.location.href = "/add-course"}>📖 Add Course</button></>
      )}

      {(user.role === 'admin' || user.role === 'instructor') && (
        <>
          <button onClick={() => window.location.href = "/add-lesson"}>➕ Add Lesson</button>
          <button onClick={() => window.location.href = "/add-dictionary"}>📖 Add Dictionary</button>
          <button onClick={() => window.location.href = "/view-dictionary"}>📖 View Dictionary</button>
          <button onClick={() => window.location.href = "/view-lessons"}>📖 View Lessons</button>
          
          <button onClick={() => window.location.href = "/view-courses"}>📖 View Course</button>
          <button onClick={() => window.location.href = "/edit-lesson"}>📖 Edit Lesson</button>
          <button onClick={() => window.location.href = "/edit-dictionary"}>📖 Edit Dictionary</button>
          <button onClick={() => window.location.href = "/lesson-forums"}>📖 Forum</button>
          <button onClick={() => window.location.href = "/quiz"}>📖 Quiz</button>
          <button onClick={() => window.location.href = "/forum/moderate"}>📖 Moderate</button>
        </>
      )}
      {(user.role === 'moderator') && (
        <>

          <button onClick={() => window.location.href = "/lesson-forums"}>📖 Forum</button>
          <button onClick={() => window.location.href = "/forum/moderate"}>📖 Moderate</button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
