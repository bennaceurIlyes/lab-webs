/* About page — laboratory information with page hero and two-column layout */
import { useTranslation } from '../hooks/useTranslation';
import styles from './About.module.css';

export default function About() {
  const { t } = useTranslation();

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <span>{t('aboutBreadcrumb')}</span>
          </nav>
          <h1 className={styles.heroTitle}>{t('aboutTitle')}</h1>
        </div>
      </section>

      {/* About content */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            <div className={styles.textCol}>
              <h2 className={styles.sectionHeading}>{t('aboutIntroTitle')}</h2>
              <p className={styles.text}>{t('aboutIntroText')}</p>
              <blockquote className={styles.mission}>
                <p>{t('aboutMission')}</p>
              </blockquote>
              <div className={styles.highlights}>
                <div className={styles.highlightCard}>
                  <span className={styles.highlightNumber}>340+</span>
                  <span className={styles.highlightLabel}>{t('statMembers')}</span>
                </div>
                <div className={styles.highlightCard}>
                  <span className={styles.highlightNumber}>22</span>
                  <span className={styles.highlightLabel}>{t('statTeams')}</span>
                </div>
                <div className={styles.highlightCard}>
                  <span className={styles.highlightNumber}>5</span>
                  <span className={styles.highlightLabel}>{t('statDepartments')}</span>
                </div>
              </div>
            </div>
            <div className={styles.chartCol}>
              <div className={styles.orgChart}>
                <div className={styles.orgChartPlaceholder}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                    <rect x="24" y="4" width="32" height="16" rx="3" />
                    <line x1="40" y1="20" x2="40" y2="30" />
                    <line x1="16" y1="30" x2="64" y2="30" />
                    <line x1="16" y1="30" x2="16" y2="38" />
                    <line x1="40" y1="30" x2="40" y2="38" />
                    <line x1="64" y1="30" x2="64" y2="38" />
                    <rect x="4" y="38" width="24" height="12" rx="2" />
                    <rect x="28" y="38" width="24" height="12" rx="2" />
                    <rect x="52" y="38" width="24" height="12" rx="2" />
                    <line x1="16" y1="50" x2="16" y2="56" />
                    <line x1="40" y1="50" x2="40" y2="56" />
                    <line x1="64" y1="50" x2="64" y2="56" />
                    <rect x="8" y="56" width="16" height="8" rx="2" />
                    <rect x="32" y="56" width="16" height="8" rx="2" />
                    <rect x="56" y="56" width="16" height="8" rx="2" />
                  </svg>
                  <span className={styles.chartLabel}>{t('aboutOrgChart')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
