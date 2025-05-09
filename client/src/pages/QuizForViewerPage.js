
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import QuizModule from "../components/QuizModule";
import "../styles/theme.css";

const QuizForViewerPage = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (err) {
        console.error("Failed to load lesson", err);
        setError("Could not load lesson information.");
      }
    };
    loadLesson();
  }, [lessonId]);

  if (error) return <p className="error">{error}</p>;
  if (!lesson) return <p>Loading lesson...</p>;

  return (
    <div className="page-container">
      <Link to={`/courses/${courseId}`} className="back-link">← Back to Lessons</Link>
      <h2>Quiz - Lesson {lesson.lessonId}</h2>
      <QuizModule lesson={lesson} />
      <div style={{marginTop: "20px"}}>
        <Link to={`/courses/${courseId}`} className="back-button">Back to Lessons</Link>
      </div>
    </div>
  );
};

export default QuizForViewerPage;
