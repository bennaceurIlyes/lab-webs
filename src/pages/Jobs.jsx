import { useTranslation } from '../hooks/useTranslation';
import styles from './Jobs.module.css';

export default function Jobs() {
  const { t } = useTranslation();

  const categories = [
    { key: 'stages', label: t('jobsCategoryStages'), imageClass: styles.imgStages, count: 5 },
    { key: 'theses', label: t('jobsCategoryTheses'), imageClass: styles.imgTheses, count: 8 },
    { key: 'postdoc', label: t('jobsCategoryPostDoc'), imageClass: styles.imgPostDoc, count: 3 },
    { key: 'ater', label: t('jobsCategoryAter'), imageClass: styles.imgAter, count: 2 },
    { key: 'cdd', label: t('jobsCategoryCdd'), imageClass: styles.imgCdd, count: 4 },
    { key: 'concours', label: t('jobsCategoryConcours'), imageClass: styles.imgConcours, count: 6 },
  ];

  return (
    <main className={styles.jobsPage} id="main-content">
      {/* Hero Banner Section */}
      <div className={styles.heroBanner}>
        <div className={styles.heroOverlay} />
        
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          {t('jobsBreadcrumb').toUpperCase()}
        </div>

        {/* Slanted Title Overlay at Bottom */}
        <div className={styles.titleOverlay}>
          <div className={styles.titleContainer}>
            <h1 className={styles.pageTitle}>{t('jobsTitle')}</h1>
          </div>
        </div>
      </div>

      {/* Main Content Grid Area */}
      <div className={styles.contentContainer}>
        <div className={styles.grid}>
          {categories.map(cat => (
            <div key={cat.key} className={styles.card} tabIndex="0" role="button" aria-label={cat.label}>
              {/* Graphic Thumbnail */}
              <div className={`${styles.cardImage} ${cat.imageClass}`}>
                {/* SVG decorative overlay to represent advanced physics/materials */}
                <svg className={styles.cardSvg} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="cardGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="rgba(255, 255, 255, 0.15)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cardGrid)" />
                  {/* Subtle atom-like or crystal lattice decoration */}
                  <line x1="10%" y1="10%" x2="30%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                  <line x1="30%" y1="50%" x2="80%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                  <circle cx="10%" cy="10%" r="4" fill="rgba(255,255,255,0.2)" />
                  <circle cx="30%" cy="50%" r="6" fill="rgba(255,255,255,0.25)" />
                  <circle cx="80%" cy="30%" r="5" fill="rgba(255,255,255,0.2)" />
                </svg>
                {/* Simulated count tag */}
                <span className={styles.countBadge}>{cat.count}</span>
              </div>
              
              {/* Blue title base */}
              <div className={styles.cardFooter}>
                <h2 className={styles.cardTitle}>{cat.label}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
