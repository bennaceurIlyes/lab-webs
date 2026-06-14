import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import LdreasLogo from '../ui/LdreasLogo';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const navRef = useRef(null);
  const megaTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Load teams for mega menu
    dbService.getTeams(lang).then(data => setTeams(data));

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lang]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { key: 'home', label: t('navHome'), path: '/', hasMega: false },
    { key: 'about', label: t('navAbout'), path: '/about', hasMega: false },
    { key: 'news', label: t('navNews'), path: '/news', hasMega: false },
    { key: 'publications', label: t('navPublications'), path: '/articles', hasMega: false },
    { key: 'teams', label: t('navTeam') || 'Teams', path: '/teams', hasMega: true, hasChevron: true },
  ];

  function handleMegaEnter(key) {
    clearTimeout(megaTimeout.current);
    setMegaOpen(key);
  }

  function handleMegaLeave() {
    megaTimeout.current = setTimeout(() => setMegaOpen(null), 150);
  }

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={`${styles.inner} flex-row-reverse-rtl`}>
        {/* Desktop & Mobile Logo */}
        <div className={styles.brandContainer}>
          <Link to="/" className={styles.logoLink} aria-label="LDREAS Home">
            <LdreasLogo variant="dark" width="36" height="36" className={styles.logoSvg} />
            <span className={styles.logoText}>LDREAS</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className={`${styles.navList} flex-row-reverse-rtl`}>
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
                {item.hasChevron && <span className={styles.navChevron}> ▾</span>}
              </Link>
              {item.hasMega && (
                <div
                  className={`${styles.megaMenu} ${megaOpen === item.key ? styles.megaOpen : ''}`}
                  onMouseEnter={() => handleMegaEnter(item.key)}
                  onMouseLeave={handleMegaLeave}
                >
                  <div className={styles.megaInner}>
                    <div className={styles.megaColumn}>
                      <span className={styles.megaHeading}>{t('navTeam') || 'Research Teams'}</span>
                      <span className={styles.megaDeptName}>{t('projectsSubtitle')}</span>
                      <ul className={styles.megaTeams}>
                        {teams.map(team => (
                          <li key={team.id}>
                            <Link to={`/teams/${team.id}`} className={styles.megaTeamLink}>
                              <strong>{team.acronym}</strong> - {team.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
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
            <span className={styles.mobileTitle}>LDREAS</span>
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
                <Link to={item.path} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
