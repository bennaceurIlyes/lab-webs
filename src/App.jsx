/* App — root component with routing, layout, and language provider */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Publications from './pages/Publications';
import ProjectDetail from './pages/ProjectDetail';
import TeamsList from './pages/TeamsList';
import TeamDetail from './pages/TeamDetail';
import MemberProfile from './pages/MemberProfile';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="pageWrapper">
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Header />
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/articles" element={<Publications />} />
              <Route path="/teams" element={<TeamsList />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/members/:id" element={<MemberProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

