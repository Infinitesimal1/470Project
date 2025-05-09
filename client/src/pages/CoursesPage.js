import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses', {
          withCredentials: true,   // ▸ include token cookie
        });
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError('Could not load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="page-container" >
      {courses.map(c => (
        <Link
          key={c._id}
          to={`/course/${c._id}`}
          className="border rounded-xl shadow p-6 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
          <p>{c.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default CoursesPage;
