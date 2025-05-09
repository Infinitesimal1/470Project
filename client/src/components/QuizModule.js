import { useState, useEffect } from "react";
import axios from "axios";

const QuizModule = ({ lesson }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (!lesson || !Array.isArray(lesson.translations)) return;
    const generated = generateQuizQuestions(lesson.translations);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSaveStatus(null);
  }, [lesson]);

  const generateQuizQuestions = (translations) => {
    return translations.map(entry => {
      const wrongAnswers = translations
        .filter(t => t.lang2 !== entry.lang2)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(t => t.lang2);

      const options = [...wrongAnswers, entry.lang2].sort(() => 0.5 - Math.random());

      return {
        question: entry.lang1,
        correctAnswer: entry.lang2,
        options
      };
    });
  };

  const handleAnswer = (selected) => {
    const correct = selected === questions[currentIndex].correctAnswer;
    if (correct) setScore(prev => prev + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const saveQuizScore = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/quiz-score", {
        lessonId: lesson.lessonId,
        score
      }, { withCredentials: true });

      setSaveStatus("✅ Score saved to profile!");
      console.log("Saved:", res.data);
    } catch (err) {
      setSaveStatus("❌ Failed to save score.");
      console.error("Error saving score:", err);
    }
  };

  if (questions.length === 0) return <div>🔄 Preparing quiz...</div>;

  if (showResult) {
    return (
      <div>
        <h2>🎉 Quiz Complete!</h2>
        <p>Score: {score} / {questions.length}</p>
        <button onClick={saveQuizScore}>Save Score to Profile</button>
        {saveStatus && <p>{saveStatus}</p>}
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div>
      <h3>Question {currentIndex + 1} of {questions.length}</h3>
      <p><strong>{current.question}</strong></p>
      {current.options.map((opt, idx) => (
        <div key={idx}>
          <button onClick={() => handleAnswer(opt)}>{opt}</button>
        </div>
      ))}
    </div>
  );
};

export default QuizModule;
