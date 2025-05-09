import { useEffect, useState } from "react";
import axios from "axios";
import "./UserHomePage.css";
import { useNavigate } from "react-router-dom";

const UserHomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const goToCourse1Lessons = () => {
    navigate("/bengali_course");
  };

  const goToCourse2Lessons = () => {
    navigate("/english_course");
  };

  return (
    <div className="home-wrapper">


<div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
  <button onClick={() => navigate('/profile')} style={{padding:'5px 10px',borderRadius:'6px'}}>Profile</button>
  <button onClick={() => navigate('/forums')} style={{padding:'8px 12px',borderRadius:'6px'}}>All Forums</button>
  <button onClick={() => navigate('/view-dictionary')} style={{padding:'8px 12px',borderRadius:'6px'}}>Dictionary</button>
</div>

      
      <div className="course-grid">
        <div className="course-card" onClick={goToCourse1Lessons}>
          <div className="icon">
            <img src="/images/bengali.png" alt="Bengali Course" style={{ width: "80px", height: "80px" }} />
          </div>
          <h3>Learn Bengali from English</h3>
          <p>Start learning Bengali using English instructions and examples.</p>
        </div>
        <div className="course-card" onClick={goToCourse2Lessons}>
          <div className="icon">
            <img src="/images/english.png" alt="English Course" style={{ width: "80px", height: "80px" }} />
          </div>
          <h3>Learn English from Bengali</h3>
          <p>Start learning English using Bengali instructions and examples.</p>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
