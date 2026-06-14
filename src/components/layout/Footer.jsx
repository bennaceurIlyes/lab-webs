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
      <div className={`${styles.inner} flex-row-reverse-rtl`}>
        <div className={styles.columnIdentity}>
          <LdreasLogo variant="light" className={styles.footerLogo} />
          <h3 className={styles.footerHeading}>{t('instituteAcronym')}</h3>
          <p className={styles.footerLabName}>{t('instituteName')}</p>
          <p className={styles.address}>{t('addressLabel')}</p>
          <p className={styles.univ}>{t('universityLabel')}</p>
        </div>

        <div className={styles.columnLinks}>
          <h4 className={styles.columnTitle}>{lang === 'ar' ? 'روابط سريعة' : (lang === 'fr' ? 'Liens Rapides' : 'Quick Links')}</h4>
          <ul className={styles.linkList}>
            <li><Link to="/" className={styles.footerLink}>{t('navHome')}</Link></li>
            <li><Link to="/about" className={styles.footerLink}>{t('navAbout')}</Link></li>
            <li><Link to="/news" className={styles.footerLink}>{t('navNews')}</Link></li>
            <li><Link to="/articles" className={styles.footerLink}>{t('navPublications')}</Link></li>
            <li><Link to="/teams" className={styles.footerLink}>{t('navTeam')}</Link></li>
          </ul>
        </div>

        <div className={styles.columnContact}>
          <h4 className={styles.columnTitle}>{t('contactDetailsTitle') || 'Contact'}</h4>
          <p className={styles.contactLine}>{t('phoneLabel')}</p>
          <p className={styles.contactLine}>{t('faxLabel')}</p>
          <p className={styles.contactLine}>
            <a href="mailto:contact@ldreas.dz" className={styles.footerLink}>contact@ldreas.dz</a>
          </p>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <div className={styles.legalInfo}>
            <span>© {new Date().getFullYear()} {t('instituteAcronym')} — {t('universityLabel')}</span>
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
