import { useEffect, useState } from "react";
import axios from "axios";

const EditLessonPage = () => {
  const [lessonId, setLessonId] = useState("");
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !["admin", "instructor"].includes(user.role)) {
      alert("Access denied. Only admins or instructors allowed.");
      window.location.href = "/";
    }
  }, []);

  const fetchLesson = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lessons/${lessonId}`);
      const cloned = {
        ...res.data,
        translations: res.data.translations.map(t => ({ ...t }))
      };
      setLesson(cloned);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Lesson not found or failed to load.");
      setLesson(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/lessons/${lessonId}`, lesson, { withCredentials: true });
      alert("Lesson updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update lesson.");
    }
  };

  const handleTranslationChange = (index, field, value) => {
    const updated = [...lesson.translations];
    updated[index][field] = value;
    setLesson({ ...lesson, translations: updated });
  };

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <h2>Edit Lesson</h2>

      <input
        placeholder="Enter Lesson ID"
        value={lessonId}
        onChange={(e) => setLessonId(e.target.value)}
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <button onClick={fetchLesson} style={{ marginLeft: "10px" }}>Load Lesson</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {lesson && (
        <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
          <input
            placeholder="Course Code"
            type="number"
            value={lesson.courseCode}
            onChange={(e) => setLesson({ ...lesson, courseCode: parseInt(e.target.value) })}
            style={{ display: "block", marginBottom: "10px", width: "300px" }}
          />

          <textarea
            rows="5"
            value={lesson.paragraphs.join('\n')}
            onChange={(e) => setLesson({ ...lesson, paragraphs: e.target.value.split('\n') })}
            style={{ width: "500px", marginBottom: "20px" }}
          />

          <h4>Edit Translations</h4>
          {lesson.translations.map((t, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <input
                value={t.lang1}
                onChange={(e) => handleTranslationChange(i, "lang1", e.target.value)}
                placeholder="Lang1"
                style={{ marginRight: "10px" }}
              />
              <input
                value={t.lang2}
                onChange={(e) => handleTranslationChange(i, "lang2", e.target.value)}
                placeholder="Lang2"
                style={{ marginRight: "10px" }}
              />
              <input
                value={t.pronunciation}
                onChange={(e) => handleTranslationChange(i, "pronunciation", e.target.value)}
                placeholder="Pronunciation"
              />
            </div>
          ))}

          <button type="submit">Update Lesson</button>
        </form>
      )}
    </div>
  );
};

export default EditLessonPage;
