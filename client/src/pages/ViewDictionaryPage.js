
import { useState } from "react";
import axios from "axios";

const ViewDictionaryPage = () => {
  const [courseCode, setCourseCode] = useState("");
  const [words, setWords] = useState([]);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dictionary");
      const filtered = response.data.filter(word => word.courseCode === parseInt(courseCode));
      setWords(filtered);
      setError("");
    } catch (err) {
      console.error("Failed to fetch dictionary:", err);
      setError("Failed to load dictionary.");
    }
  };

  return (
    <div className="page-container">
      <h2>View Dictionary Words by Course</h2>
      <input
        type="number"
        placeholder="Enter Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
      />
      <button onClick={handleFetch}>Fetch Dictionary</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {words.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Lang1</th>
              <th>Lang2</th>
              <th>Pronunciation</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word) => (
              <tr key={word._id}>
                <td>{word.lang1}</td>
                <td>{word.lang2}</td>
                <td>{word.pronunciation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewDictionaryPage;
