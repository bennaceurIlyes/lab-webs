/* App — root component with routing, layout, and language provider */
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Publications = lazy(() => import('./pages/Publications'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const TeamsList = lazy(() => import('./pages/TeamsList'));
const TeamDetail = lazy(() => import('./pages/TeamDetail'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

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
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
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
            </Suspense>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

