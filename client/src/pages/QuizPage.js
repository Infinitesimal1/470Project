import { useEffect, useState } from "react";
import axios from "axios";
import QuizModule from "../components/QuizModule";

const QuizPage = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lessons");
        setLessons(res.data);
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    };
    fetchLessons();
  }, []);

  const startQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lessons/${selectedLessonId}`);
      if (res.data && Array.isArray(res.data.translations)) {
        setLessonData(res.data);
      } else {
        alert("❌ This lesson has no translations for quiz.");
      }
    } catch (err) {
      console.error("Error loading lesson", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Take a Quiz (Lessons Only)</h2>

      <label>Select Lesson:</label>
      <select value={selectedLessonId} onChange={(e) => setSelectedLessonId(e.target.value)}>
        <option value="">-- Select a lesson --</option>
        {lessons.map((lesson) => (
          <option key={lesson.lessonId} value={lesson.lessonId}>
            Lesson {lesson.lessonId}
          </option>
        ))}
      </select>

      <button disabled={!selectedLessonId} onClick={startQuiz}>Start Quiz</button>

      <hr />

      {lessonData && <QuizModule lesson={lessonData} />}
    </div>
  );
};

export default QuizPage;
