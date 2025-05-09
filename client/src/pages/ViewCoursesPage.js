
import { useEffect, useState } from "react";
import axios from "axios";

const ViewCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses", { withCredentials: true });
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses.");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <h2>All Courses</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.courseDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCoursesPage;
