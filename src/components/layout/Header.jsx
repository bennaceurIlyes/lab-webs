import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <header className={styles.topBar} role="banner">
      <div className={`${styles.inner} flex-row-reverse-rtl`}>
        {/* Left: University Name */}
        <div className={styles.leftSection}>
          <span className={styles.universityName}>Université TAHRI Mohammed, Béchar</span>
        </div>

        {/* Right: Language, Search, Login */}
        <div className={styles.rightSection}>
          <div className={styles.langSwitcher}>
            <button className={`${styles.langBtn} ${lang === 'ar' ? styles.activeLang : ''}`} onClick={() => setLang('ar')} aria-label="AR" title="AR">AR</button>
            <span className={styles.langSeparator}>|</span>
            <button className={`${styles.langBtn} ${lang === 'fr' ? styles.activeLang : ''}`} onClick={() => setLang('fr')} aria-label="FR" title="FR">FR</button>
            <span className={styles.langSeparator}>|</span>
            <button className={`${styles.langBtn} ${lang === 'en' ? styles.activeLang : ''}`} onClick={() => setLang('en')} aria-label="EN" title="EN">EN</button>
          </div>
          
          <Link to="/login" className={styles.loginLink}>Portal Login</Link>
        </div>
      </div>
    </header>
  );
}
