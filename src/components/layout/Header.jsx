import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <header className={styles.header} role="banner">
      <div className={`${styles.inner} flex-row-reverse-rtl`}>
        {/* Logo Container */}
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink} aria-label="LDREAS Home">
            <svg className={styles.logoSvg} width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Solar rays + energy lattice referencing Renewable Energies & Saharan Areas */}
              <circle cx="80" cy="40" r="24" stroke="var(--color-navy-900)" strokeWidth="2.5" />
              <path d="M 80 8 L 80 20 M 80 60 L 80 72 M 48 40 L 60 40 M 100 40 L 112 40 M 57 17 L 66 26 M 94 54 L 103 63 M 103 17 L 94 26 M 66 54 L 57 63" stroke="var(--color-terracotta-500)" strokeWidth="2" />
              <circle cx="80" cy="40" r="10" fill="var(--color-navy-700)" />
              <text x="80" y="44" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fontWeight="800" fill="#fff" letterSpacing="0.5">LDREAS</text>
            </svg>
          </Link>
        </div>

        {/* Branding Title (Middle) */}
        <div className={styles.branding}>
          <h1 className={styles.labName}>
            {t('instituteName')}
          </h1>
          <p className={styles.affiliations}>
            {t('universityLabel')}
          </p>
          <p className={styles.directorName}>
            {t('directorLabel')}
          </p>
        </div>

        {/* Utility Menu & Languages (Right) */}
        <div className={styles.rightSection}>
          <div className={styles.langSwitcher}>
            <button
              className={`${styles.langBtn} ${lang === 'ar' ? styles.activeLang : ''}`}
              onClick={() => setLang('ar')}
              aria-label="النسخة العربية"
              title="النسخة العربية"
            >
              AR
            </button>
            <button
              className={`${styles.langBtn} ${lang === 'fr' ? styles.activeLang : ''}`}
              onClick={() => setLang('fr')}
              aria-label="Version Française"
              title="Version Française"
            >
              FR
            </button>
            <button
              className={`${styles.langBtn} ${lang === 'en' ? styles.activeLang : ''}`}
              onClick={() => setLang('en')}
              aria-label="English Version"
              title="English Version"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
