import { useState, useEffect } from "react";
import axios from "axios";

const AddLessonPage = () => {
  const [lesson, setLesson] = useState({
    lessonId: "",
    courseCode: 0,
    paragraphs: [""],
    translations: Array.from({ length: 15 }, () => ({ lang1: "", lang2: "", pronunciation: "" }))
  });

  const [courses, setCourses] = useState([]);

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
      alert("Access denied. Only admins and instructors can access this page.");
      window.location.href = "/";
    }
  }, []);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lesson.lessonId || !lesson.courseCode) {
      alert("Please enter Lesson ID and select a Course.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/lessons/add", lesson, { withCredentials: true });
      alert("Lesson added!");
    } catch (err) {
      console.error("Add failed", err);
      alert("Failed to add lesson. Check console.");
    }
  };

  const handleTranslationChange = (index, field, value) => {
    const updated = [...lesson.translations];
    updated[index][field] = value;
    setLesson({ ...lesson, translations: updated });
  };

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <h2>Add Lesson</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Lesson ID"
          value={lesson.lessonId}
          onChange={(e) => setLesson({ ...lesson, lessonId: e.target.value })}
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        />

        
        <select
          value={lesson.courseCode}
          onChange={(e) => setLesson({ ...lesson, courseCode: parseInt(e.target.value) })}
          style={{ marginBottom: "20px", width: "300px" }}
        >
          <option value={0}>-- Select a course --</option>
          {courses.map((c) => (
            <option key={c.courseCode} value={c.courseCode}>
              Course {c.courseCode}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Paragraphs (one per line)"
          rows="6"
          style={{ width: "500px", marginBottom: "20px" }}
          onChange={(e) => setLesson({ ...lesson, paragraphs: e.target.value.split('\n') })}
        />

        <h4>Translations</h4>
        {lesson.translations.map((t, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              placeholder="Lang1"
              value={t.lang1}
              onChange={(e) => handleTranslationChange(i, "lang1", e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <input
              placeholder="Lang2"
              value={t.lang2}
              onChange={(e) => handleTranslationChange(i, "lang2", e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <input
              placeholder="Pronunciation"
              value={t.pronunciation}
              onChange={(e) => handleTranslationChange(i, "pronunciation", e.target.value)}
            />
          </div>
        ))}

        <button type="submit">Add Lesson</button>
      </form>
    </div>
  );
};

export default AddLessonPage;
