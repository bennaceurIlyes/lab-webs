import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import styles from './HeroBanner.module.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero} aria-label={t('heroTitle')}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <p className={styles.eyebrow}>{t('heroTag')}</p>
            <h1 className={styles.title}>{t('heroTitle')}</h1>
            <p className={styles.subtitle}>{t('heroSubtitle')}</p>

            <div className={styles.actions}>
              <Link to="/about" className={styles.ctaPrimary}>
                {t('heroCta1')}
              </Link>
              <Link to="/articles" className={styles.ctaSecondary}>
                {t('heroCta2')} <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>

          <div className={styles.visual}>
            <img
              src={HERO_IMAGE}
              alt=""
              className={styles.image}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
