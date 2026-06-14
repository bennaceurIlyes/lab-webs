import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero} aria-label={t('heroTitle')}>
      {/* Background Image Overlay */}
      <div className={styles.overlay} />
      
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.tag}>{t('heroTag')}</span>
          <h2 className={styles.title}>{t('heroTitle')}</h2>
          <p className={styles.subtitle}>{t('heroSubtitle')}</p>
          
          <div className={styles.actions}>
            <Link to="/about" className={styles.ctaPrimary}>
              {t('heroCta1')}
            </Link>
            <Link to="/news" className={styles.ctaSecondary}>
              {t('heroCta2')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
