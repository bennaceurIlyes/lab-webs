import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import LdreasLogo from '../ui/LdreasLogo';
import styles from './Footer.module.css';

export default function Footer() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Repeating triangular wireframe grid SVG background */}
      <div className={styles.gridBackground} aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footerTriGrid" width="100" height="50" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 100 0 M 0 50 L 100 50 M 0 0 L 50 50 L 100 0 M 50 0 L 50 50 M 50 0 L 0 50 M 50 0 L 100 50" stroke="rgba(140, 106, 74, 0.04)" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerTriGrid)" />
        </svg>
      </div>

      <div className={`${styles.inner} flex-row-reverse-rtl`}>
        {/* Column 1: Lab Identity */}
        <div className={styles.columnIdentity}>
          <LdreasLogo variant="light" className={styles.footerLogo} />
          <h3 className={styles.footerHeading}>{t('instituteAcronym')}</h3>
          <p className={styles.footerLabName}>{t('instituteName')}</p>
          <p className={styles.director}>{t('directorLabel')}</p>
          <p className={styles.univ}>{t('universityLabel')}</p>
        </div>

        {/* Column 2: Contact */}
        <div className={styles.columnContact}>
          <h4 className={styles.columnTitle}>{t('contactDetailsTitle')}</h4>
          <p className={styles.address}>{t('addressLabel')}</p>
          <p className={styles.phone}>{t('phoneLabel')}</p>
          <p className={styles.fax}>{t('faxLabel')}</p>
          <p className={styles.email}>
            <a href="mailto:contact@ldreas.dz" className={styles.footerLink}>contact@ldreas.dz</a>
          </p>
        </div>

        {/* Column 3: Quick Links */}
        <div className={styles.columnLinks}>
          <h4 className={styles.columnTitle}>Liens Rapides</h4>
          <ul className={styles.linkList}>
            <li><Link to="/" className={styles.footerLink}>{t('navHome')}</Link></li>
            <li><Link to="/about" className={styles.footerLink}>{t('navAbout')}</Link></li>
            <li><Link to="/news" className={styles.footerLink}>{t('navNews')}</Link></li>
            <li><Link to="/publications" className={styles.footerLink}>{t('navPublications')}</Link></li>
            <li><Link to="/teams" className={styles.footerLink}>{t('navTeam')}</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Legal & Institutional */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <div className={styles.legalInfo}>
            <span>© {new Date().getFullYear()} {t('instituteAcronym')} – UMR.</span>
            <span className={styles.separator}>|</span>
            <a href="#legal" className={styles.footerLink}>{t('footerLegal')}</a>
          </div>
          
          <div className={styles.langSwitcher}>
            <button className={`${styles.langBtn} ${lang === 'ar' ? styles.activeLang : ''}`} onClick={() => setLang('ar')} aria-label="النسخة العربية">AR</button>
            <span className={styles.langSeparator}>|</span>
            <button className={`${styles.langBtn} ${lang === 'fr' ? styles.activeLang : ''}`} onClick={() => setLang('fr')} aria-label="Version Française">FR</button>
            <span className={styles.langSeparator}>|</span>
            <button className={`${styles.langBtn} ${lang === 'en' ? styles.activeLang : ''}`} onClick={() => setLang('en')} aria-label="English Version">EN</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
