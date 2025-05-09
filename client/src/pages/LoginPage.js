import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "59737575590-94l74j1ml9oevi0ji625d09crg4c5qsj.apps.googleusercontent.com",
      callback: async (response) => {
        try {
          const res = await axios.post("http://localhost:5000/api/auth/google", {
            token: response.credential
          }, { withCredentials: true });

          const user = res.data.user;

          
          localStorage.setItem("user", JSON.stringify(user));

          
          if (user.role === "admin") {
            navigate("/profile");
          } else if (user.role === "instructor") {
            navigate("/profile");
          } else if (user.role === "moderator") {
            navigate("/profile");
          } else {
            navigate("/user-home"); 
          }

        } catch (err) {
          console.error("Login failed:", err);
          alert("Login failed. Please try again.");
        }
      }
    });

    window.google.accounts.id.renderButton(
      document.getElementById("loginDiv"),
      { theme: "outline", size: "large" }
    );
  }, [navigate]);

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
      `}</style>
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: 'url("/img/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          textShadow: '1px 1px 2px #000'
        }}>
          <div style={{ fontSize: '54px', fontWeight: 'bold' }}>নিজের ভাষা</div>
          <div style={{ fontSize: '24px' }}>Nijer Bhasha</div>
        </div>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div id="loginDiv" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
