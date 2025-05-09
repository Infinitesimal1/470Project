import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AddCoursePage from './pages/AddCoursePage';
//import ForumPage from './pages/ForumPage';
import AllForumsPage from './pages/AllForumsPage';
//import QuizModule from './QuizModule';
import AdminPanel from './pages/AdminPanel';
import ViewLessonsPage from './pages/ViewLessonsPage';
import EditDictionaryPage from './pages/EditDictionaryPage';
import AddLessonPage from './pages/AddLessonPage';
import AddDictionaryPage from './pages/AddDictionaryPage';
import ViewDictionaryPage from './pages/ViewDictionaryPage';
import ViewCoursesPage from './pages/ViewCoursesPage';
import EditLessonPage from './pages/EditLessonPage';
import QuizPage from './pages/QuizPage';
import QuizForViewerPage from './pages/QuizForViewerPage';
import ForumPage from './pages/ForumPage';

import UserHomePage from './pages/UserHomePage';
import CourseBn from  './pages/Course1LessonsPage';
import CourseEn from  './pages/Course2LessonsPage';
import LessonForumPage from './pages/LessonForumPage';

<Route path="/lesson-forums" element={<LessonForumPage />} />


import ForumModerationPage from './pages/ForumModerationPage';



const ConditionalNavbar = () => {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/login') return null;
  return <Navbar />;
};

function App() {
  return (
    <BrowserRouter>
      <ConditionalNavbar />
      <Routes>
        <Route path="/user-home" element={<UserHomePage />} />
        <Route path="/bengali_course" element={<CourseBn />} />
        <Route path="/courses/1" element={<CourseBn />} />
        <Route path="/courses/2" element={<CourseEn />} />
        <Route path="/english_course" element={<CourseEn />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/courses/:courseId/lessons/:lessonId/quiz" element={<QuizForViewerPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forum/moderate" element={<ForumModerationPage />} />
        <Route path="/forums" element={<AllForumsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/lesson-forums" element={<LessonForumPage />} />
        <Route path="/forum/:lessonId" element={<ForumPage />} />
        <Route path="/edit-dictionary" element={<EditDictionaryPage />} />
        <Route path="/view-courses" element={<ViewCoursesPage />} />
        <Route path="/edit-lesson" element={<EditLessonPage />} />
        <Route path="/view-dictionary" element={<ViewDictionaryPage />} />
        <Route path="/view-lessons" element={<ViewLessonsPage />} />
        <Route path="/add-course" element={<AddCoursePage />} />
        <Route path="/add-lesson" element={<AddLessonPage />} />
        <Route path="/add-dictionary" element={<AddDictionaryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
