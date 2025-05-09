import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Access denied. Admins only.");
      window.location.href = "/";
      return;
    }

    axios.get("http://localhost:5000/api/admin/users", { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => alert("Unauthorized or error loading users"));
  }, []);

  const promote = async (id, newRole) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/promote/${id}`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers(users.map(user =>
        user._id === id ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      alert("Promotion failed");
    }
  };

  const demote = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/demote/${id}`,
        {},
        { withCredentials: true }
      );
      setUsers(users.map(user =>
        user._id === id ? { ...user, role: 'user' } : user
      ));
    } catch (err) {
      alert("Demotion failed");
    }
  };

  const deleteUser = async (id) => {
    if (currentUser._id === id) {
      return alert("You cannot delete your own account.");
    }

    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/${id}`, {
        withCredentials: true
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="page-container">
      <h2>Admin Panel</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} style={{ marginBottom: "10px" }}>
            {user.name} - {user.email} - {user.role}

            {user.role === 'user' && (
              <>
                <button onClick={() => promote(user._id, 'instructor')}>Make Instructor</button>
                <button onClick={() => promote(user._id, 'moderator')} style={{ marginLeft: "10px" }}>
                  Make Moderator
                </button>
              </>
            )}

            {(user.role === 'moderator' || user.role === 'instructor') && (
              <>
                <button onClick={() => demote(user._id)} style={{ marginLeft: "10px" }}>
                  Demote to User
                </button>
              </>
            )}

            {user._id !== currentUser._id && (
              <button onClick={() => deleteUser(user._id)} style={{ marginLeft: "10px", color: "red" }}>
                ❌ Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
