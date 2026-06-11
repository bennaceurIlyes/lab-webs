import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <header className={styles.header} role="banner">
      {/* Repeating triangular wireframe grid SVG background */}
      <div className={styles.gridBackground} aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="headerTriGrid" width="100" height="50" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 100 0 M 0 50 L 100 50 M 0 0 L 50 50 L 100 0 M 50 0 L 50 50 M 50 0 L 0 50 M 50 0 L 100 50" stroke="#eaeef5" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#headerTriGrid)" />
        </svg>
      </div>

      <div className={styles.inner}>
        {/* Slanted Logo Container */}
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink} aria-label="LMNP Home">
            <svg className={styles.logoSvg} width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Atomic orbital/lattice visual representing materials and nanosciences */}
              <circle cx="45" cy="40" r="18" stroke="var(--color-primary)" strokeWidth="3" />
              <circle cx="105" cy="40" r="18" stroke="var(--color-primary)" strokeWidth="3" />
              <path d="M 45 22 C 70 22, 80 58, 105 58" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray="3 3" />
              <path d="M 45 58 C 70 58, 80 22, 105 22" stroke="var(--color-accent)" strokeWidth="3" />
              <circle cx="75" cy="40" r="6" fill="var(--color-accent)" />
              {/* Logo text LMNP */}
              <text x="75" y="46" textAnchor="middle" fontFamily="Montserrat" fontSize="18" fontWeight="800" fill="var(--color-primary)" letterSpacing="1">LMNP</text>
            </svg>
          </Link>
        </div>

        {/* Branding Title (Middle) */}
        <div className={styles.branding}>
          <h1 className={styles.labName}>
            <span className={styles.letterL}>L</span>aboratoire{' '}
            <span className={styles.letterM}>M</span>atériaux et{' '}
            <span className={styles.letterN}>N</span>anosciences de{' '}
            <span className={styles.letterP}>P</span>rovence
          </h1>
          <p className={styles.affiliations}>
            {t('headerBrandingAffiliations')}
          </p>
        </div>

        {/* Utility Menu & Languages (Right) */}
        <div className={styles.rightSection}>
          <nav className={styles.utilityNav} aria-label="Utility navigation">
            <a href="#annuaire" className={styles.utilityLink}>
              {t('headerMenuAnnuaire')}
            </a>
            <a href="#sites" className={styles.utilityLink}>
              {t('headerMenuSites')}
            </a>
            <Link to="/contact" className={styles.utilityLink}>
              {t('headerMenuContact')}
            </Link>
            <a href="#login" className={styles.utilityLink}>
              {t('headerMenuLogin')}
            </a>
          </nav>

          <div className={styles.langSwitcher}>
            <button
              className={`${styles.langBtn} ${lang === 'fr' ? styles.activeLang : ''}`}
              onClick={() => setLang('fr')}
              aria-label="Version Française"
              title="Version Française"
            >
              {/* French Flag SVG */}
              <svg width="24" height="16" viewBox="0 0 3 2">
                <rect width="1" height="2" fill="#002395" />
                <rect x="1" width="1" height="2" fill="#ffffff" />
                <rect x="2" width="1" height="2" fill="#ED2939" />
              </svg>
            </button>
            <button
              className={`${styles.langBtn} ${lang === 'en' ? styles.activeLang : ''}`}
              onClick={() => setLang('en')}
              aria-label="English Version"
              title="English Version"
            >
              {/* UK Flag SVG */}
              <svg width="24" height="16" viewBox="0 0 60 30">
                <clipPath id="s">
                  <path d="M0,0 L60,0 L60,30 L0,30 z" />
                </clipPath>
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#012169" strokeWidth="4" />
                <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6" />
                <path d="M0,0 L30,15 M60,30 L30,15 M60,0 L30,15 M0,30 L30,15" stroke="#C8102E" strokeWidth="4" clipPath="url(#s)" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
