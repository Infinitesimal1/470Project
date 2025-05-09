import { useEffect, useState } from "react";
import axios from "axios";

const EditDictionaryPage = () => {
  const [courseCode, setCourseCode] = useState("");
  const [lang1, setLang1] = useState("");
  const [word, setWord] = useState(null);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !["admin", "instructor"].includes(user.role)) {
      alert("Access denied. Only instructors or admins allowed.");
      window.location.href = "/";
    }
  }, []);

  const fetchWord = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/dictionary/${lang1}/${courseCode}`);
      setWord(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Word not found or failed to load.");
      setWord(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/dictionary/${lang1}/${courseCode}`,
        word,
        { withCredentials: true }
      );
      alert("Word updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update word.");
    }
  };

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <h2>Edit Dictionary Word</h2>

      <input
        placeholder="Course Code"
        type="number"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        style={{ marginRight: "10px", width: "150px" }}
      />
      <input
        placeholder="Lang1"
        value={lang1}
        onChange={(e) => setLang1(e.target.value)}
        style={{ marginRight: "10px", width: "150px" }}
      />
      <button onClick={fetchWord}>Load Word</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {word && (
        <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
          <input
            placeholder="Lang1"
            value={word.lang1}
            onChange={(e) => setWord({ ...word, lang1: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "300px" }}
          />
          <input
            placeholder="Lang2"
            value={word.lang2}
            onChange={(e) => setWord({ ...word, lang2: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "300px" }}
          />
          <input
            placeholder="Pronunciation"
            value={word.pronunciation}
            onChange={(e) => setWord({ ...word, pronunciation: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "300px" }}
          />
          <button type="submit">Update Word</button>
        </form>
      )}
    </div>
  );
};

export default EditDictionaryPage;
