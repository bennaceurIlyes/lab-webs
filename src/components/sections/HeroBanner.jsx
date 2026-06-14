import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero} aria-label={t('heroTitle')}>
      {/* Background container with dark blue gradient */}
      <div className={styles.background} />
      
      <div className={styles.inner}>
        {/* 60/40 split container */}
        <div className={styles.splitLayout}>
          <div className={styles.contentMain}>
            <span className={styles.tag}>{t('heroTag')}</span>
            <h2 className={styles.title}>{t('heroTitle')}</h2>
            <p className={styles.subtitle}>{t('heroSubtitle')}</p>
            
            <div className={styles.actions}>
              <Link to="/about" className={styles.ctaPrimary}>
                {t('heroCta1') || 'Explore Research Areas'}
              </Link>
              <Link to="/articles" className={styles.ctaSecondary}>
                {t('heroCta2') || 'Read Annual Report'} <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>
          <div className={styles.contentVisual}>
             <div className={styles.visualGrid}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
