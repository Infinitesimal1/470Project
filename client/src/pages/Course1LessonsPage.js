import { useEffect, useState } from "react";
import "../styles/theme.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Course1LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lessons");
        const filtered = res.data
          .filter(lesson => lesson.courseCode === 1)
          .sort((a, b) => parseInt(a.lessonId) - parseInt(b.lessonId)); // 🔢 sort by lessonId
        setLessons(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch lessons:", err);
        setError("Failed to load lessons.");
      }
    };

    const fetchQuizScores = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/user/profile", {
          withCredentials: true
        });
        setQuizScores(userRes.data.quizScores || []);
      } catch (err) {
        console.error("❌ Failed to fetch quiz scores:", err);
      }
    };

    fetchLessons();
    fetchQuizScores();
  }, []);

  const getScoreForLesson = (lessonId) =>
    quizScores.find(q => String(q.lessonId) === String(lessonId));

  return (
    <div className="course-container">
      <h2 >📘 Bengali Course — All Lessons</h2>
      {error && <p >{error}</p>}

      {lessons.map((lesson) => {
        const score = getScoreForLesson(lesson.lessonId);
        return (
          <div key={lesson._id} className="lesson-card">
            <h3 >🟦 Lesson ID: {lesson.lessonId}</h3>
            <p><strong>Course Code:</strong> {lesson.courseCode}</p>

            <h4>📄 <u>Description:</u></h4>
            <ul>
              {lesson.paragraphs.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>

            <h4>📘 <u>Translations:</u></h4>
            <table >
              <thead>
                <tr >
                  <th >English</th>
                  <th >Bengali</th>
                  <th >Pronunciation</th>
                </tr>
              </thead>
              <tbody>
                {lesson.translations.map((t, idx) => (
                  <tr key={idx}>
                    <td >{t.lang1}</td>
                    <td >{t.lang2}</td>
                    <td >{t.pronunciation}</td>
                  </tr>
                ))}
              </tbody>
            </table>            <div >
              <Link className="quiz-btn" to={`/courses/1/lessons/${lesson.lessonId}/quiz`}>
                Take Quiz
              </Link>
              <Link className="back-button" to="/lesson-forums">Forum</Link>
            </div>

            {score ? (
              <p >
                ✅ <strong>Quiz Completed</strong><br />
                Latest Score: {score.latest} / 15<br />
                Highest Score: {score.highest} / 15
              </p>
            ) : (
              <p >📌 No quiz score yet for this lesson.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Course1LessonsPage;
