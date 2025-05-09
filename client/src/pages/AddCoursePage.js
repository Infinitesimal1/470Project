import { useState } from "react";
import axios from "axios";
import "./AddCoursePage.css";    
const AddCoursePage = () => {
  const [courseName, setCourseName]             = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/courses",
        { courseName, courseDescription },
        { withCredentials: true }
      );
      setMsg("✅ Course added!");
      setCourseName("");
      setCourseDescription("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="form-card">
      <h1>Add new course</h1>
      {msg && <p className="status">{msg}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Course name
          <input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            rows="3"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
          />
        </label>

        <button className="primary-btn">Save</button>
      </form>
    </div>
  );
};

export default AddCoursePage;
