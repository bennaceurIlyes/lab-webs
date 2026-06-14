import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.editorialContent}>
          <span className={styles.eyebrow}>{t('heroTag')}</span>
          <h1 id="hero-title" className={styles.title}>{t('heroTitle')}</h1>
          <p className={styles.subtitle}>{t('heroSubtitle')}</p>
          
          <div className={styles.actions}>
            <Link to="/about" className={styles.linkAction}>
              {t('heroCta1')}
            </Link>
            <span className={styles.separator}>/</span>
            <Link to="/news" className={styles.linkAction}>
              {t('heroCta2')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
