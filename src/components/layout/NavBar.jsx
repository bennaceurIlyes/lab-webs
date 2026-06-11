import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { departments } from '../../data/departments';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const navRef = useRef(null);
  const megaTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { key: 'lab', label: t('navLab'), path: '/about', hasMega: false, hasChevron: true },
    { key: 'research', label: t('navResearch'), path: '/research', hasMega: true, hasChevron: true },
    { key: 'partnerships', label: t('navPartnerships'), path: '#partnerships', hasMega: false, hasChevron: true },
    { key: 'news', label: t('navNews'), path: '/news', hasMega: false, hasChevron: true },
    { key: 'jobs', label: t('navJobs'), path: '/jobs', hasMega: false, hasChevron: false },
  ];

  function handleMegaEnter(key) {
    clearTimeout(megaTimeout.current);
    setMegaOpen(key);
  }

  function handleMegaLeave() {
    megaTimeout.current = setTimeout(() => setMegaOpen(null), 150);
  }

  function toggleAccordion(id) {
    setMobileAccordion(prev => prev === id ? null : id);
  }

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.inner}>
        {/* Mobile Logo (only visible in mobile header style navbar) */}
        <Link to="/" className={styles.mobileLogo} aria-label="LMNP Home">
          <span className={styles.mobileLogoText}>LMNP</span>
        </Link>

        {/* Desktop nav */}
        <ul className={styles.navList}>
          {navItems.map(item => (
            <li
              key={item.key}
              className={styles.navItem}
              onMouseEnter={() => item.hasMega && handleMegaEnter(item.key)}
              onMouseLeave={item.hasMega ? handleMegaLeave : undefined}
            >
              <Link
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
                aria-haspopup={item.hasMega ? 'true' : undefined}
                aria-expanded={item.hasMega ? megaOpen === item.key : undefined}
              >
                {item.label}
                {item.hasChevron && <span className={styles.navChevron}> &gt;</span>}
              </Link>
              {item.hasMega && (
                <div
                  className={`${styles.megaMenu} ${megaOpen === item.key ? styles.megaOpen : ''}`}
                  onMouseEnter={() => handleMegaEnter(item.key)}
                  onMouseLeave={handleMegaLeave}
                >
                  <div className={styles.megaInner}>
                    {departments.map(dept => (
                      <div key={dept.id} className={styles.megaColumn}>
                        <Link to="/research" className={styles.megaHeading}>{dept.id}</Link>
                        <span className={styles.megaDeptName}>{dept.name}</span>
                        <ul className={styles.megaTeams}>
                          {dept.teams.map(team => (
                            <li key={team.id}>
                              <a href={`#${team.id}`} className={styles.megaTeamLink}>{team.name}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
          {/* Search Button */}
          <li className={styles.searchItem}>
            <button
              className={styles.searchBtn}
              aria-label="Search website"
              onClick={() => alert('Search functionality is simulated.')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </li>
        </ul>

        {/* Hamburger button */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(true)}
          aria-label={t('menuOpen')}
          aria-expanded={mobileOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileHeader}>
            <span className={styles.mobileTitle}>LMNP</span>
            <button
              className={styles.closeBtn}
              onClick={() => setMobileOpen(false)}
              aria-label={t('menuClose')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>
          <ul className={styles.mobileList}>
            {navItems.map(item => (
              <li key={item.key} className={styles.mobileItem}>
                {item.hasMega ? (
                  <>
                    <button
                      className={styles.mobileLink}
                      onClick={() => toggleAccordion(item.key)}
                      aria-expanded={mobileAccordion === item.key}
                    >
                      {item.label}
                      <svg
                        className={`${styles.chevron} ${mobileAccordion === item.key ? styles.chevronOpen : ''}`}
                        width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"
                      >
                        <polyline points="4,6 8,10 12,6" />
                      </svg>
                    </button>
                    {mobileAccordion === item.key && (
                      <div className={styles.mobileAccordion}>
                        {departments.map(dept => (
                          <div key={dept.id} className={styles.mobileAccordionGroup}>
                            <Link to="/research" className={styles.mobileAccordionTitle} onClick={() => setMobileOpen(false)}>
                              {dept.id} — {dept.name}
                            </Link>
                            <ul>
                              {dept.teams.map(team => (
                                <li key={team.id}>
                                  <a href={`#${team.id}`} className={styles.mobileTeamLink} onClick={() => setMobileOpen(false)}>
                                    {team.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.path} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
