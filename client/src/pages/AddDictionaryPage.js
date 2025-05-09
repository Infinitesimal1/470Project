import { useState, useEffect } from "react";
import axios from "axios";

const AddDictionaryPage = () => {
  const [word, setWord] = useState({
    courseCode: 0,
    lang1: "",
    lang2: "",
    pronunciation: ""
  });

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (user.role !== "admin" && user.role !== "instructor")) {
      alert("Access denied. Only admins and instructors can add dictionary words.");
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending:", word);
      const res = await axios.post("http://localhost:5000/api/dictionary/add", word, {
        withCredentials: true,
      });
      console.log("Server response:", res.data);
      alert("Word added!");
    } catch (err) {
      console.error("Error adding word:", err.response?.data || err.message);
      alert("The word is a duplicate.");
    }
  };

  return (
    <div className="page-container">
      <h2>Add Dictionary Word</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Course Code"
          type="number"
          onChange={(e) =>
            setWord({ ...word, courseCode: parseInt(e.target.value) })
          }
        />
        <input
          placeholder="Lang1"
          onChange={(e) => setWord({ ...word, lang1: e.target.value })}
        />
        <input
          placeholder="Lang2"
          onChange={(e) => setWord({ ...word, lang2: e.target.value })}
        />
        <input
          placeholder="Pronunciation"
          onChange={(e) =>
            setWord({ ...word, pronunciation: e.target.value })
          }
        />
        <button type="submit">Add Word</button>
      </form>
    </div>
  );
};

export default AddDictionaryPage;
