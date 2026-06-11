/* App — root component with routing, layout, and language provider */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
import News from './pages/News';
import Contact from './pages/Contact';
import Jobs from './pages/Jobs';

export default function App() {
  return (
    <LanguageProvider>
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
            <Route path="/research" element={<Research />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<Jobs />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

