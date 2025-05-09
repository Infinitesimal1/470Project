
import { useState } from "react";
import axios from "axios";

const ViewLessonsPage = () => {
  const [courseCode, setCourseCode] = useState("");
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/lessons");
      const filtered = response.data.filter(lesson => lesson.courseCode === parseInt(courseCode));
      setLessons(filtered);
      setError("");
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError("Failed to load lessons.");
    }
  };

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <h2>View Lessons by Course</h2>
      <input
        type="number"
        placeholder="Enter Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <button onClick={handleFetch} style={{ marginLeft: "10px" }}>
        Fetch Lessons
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {lessons.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {lessons.map((lesson) => (
            <div key={lesson._id} style={{
              border: "1px solid gray",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "20px"
            }}>
              <h4>Lesson ID: {lesson.lessonId}</h4>
              <p><strong>Course Code:</strong> {lesson.courseCode}</p>
              <h5>Paragraphs:</h5>
              <ul>
                {lesson.paragraphs.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
              <h5>Translations:</h5>
              <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    <th>Lang1</th>
                    <th>Lang2</th>
                    <th>Pronunciation</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.translations.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.lang1}</td>
                      <td>{t.lang2}</td>
                      <td>{t.pronunciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewLessonsPage;
