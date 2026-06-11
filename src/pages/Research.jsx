/* Research page — full department cards with expandable team lists */
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { departments } from '../data/departments';
import styles from './Research.module.css';

/* Same icon map as DepartmentsGrid */
const iconMap = {
  atom: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="4" /><ellipse cx="24" cy="24" rx="20" ry="8" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(-60 24 24)" />
    </svg>
  ),
  crystal: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="24,4 40,16 36,36 12,36 8,16" />
      <line x1="24" y1="4" x2="24" y2="36" /><line x1="8" y1="16" x2="36" y2="36" /><line x1="40" y1="16" x2="12" y2="36" />
    </svg>
  ),
  circuit: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="16" y="16" width="16" height="16" rx="2" />
      <line x1="24" y1="4" x2="24" y2="16" /><line x1="24" y1="32" x2="24" y2="44" />
      <line x1="4" y1="24" x2="16" y2="24" /><line x1="32" y1="24" x2="44" y2="24" />
      <line x1="10" y1="10" x2="18" y2="18" /><line x1="30" y1="30" x2="38" y2="38" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="12" y="12" width="24" height="24" rx="2" /><rect x="18" y="18" width="12" height="12" rx="1" />
      <line x1="18" y1="6" x2="18" y2="12" /><line x1="24" y1="6" x2="24" y2="12" /><line x1="30" y1="6" x2="30" y2="12" />
      <line x1="18" y1="36" x2="18" y2="42" /><line x1="24" y1="36" x2="24" y2="42" /><line x1="30" y1="36" x2="30" y2="42" />
      <line x1="6" y1="18" x2="12" y2="18" /><line x1="6" y1="24" x2="12" y2="24" /><line x1="6" y1="30" x2="12" y2="30" />
      <line x1="36" y1="18" x2="42" y2="18" /><line x1="36" y1="24" x2="42" y2="24" /><line x1="36" y1="30" x2="42" y2="30" />
    </svg>
  ),
  photon: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="6" />
      <line x1="24" y1="4" x2="24" y2="12" /><line x1="24" y1="36" x2="24" y2="44" />
      <line x1="4" y1="24" x2="12" y2="24" /><line x1="36" y1="24" x2="44" y2="24" />
      <line x1="10" y1="10" x2="16" y2="16" /><line x1="32" y1="32" x2="38" y2="38" />
      <line x1="38" y1="10" x2="32" y2="16" /><line x1="16" y1="32" x2="10" y2="38" />
    </svg>
  ),
};

export default function Research() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);

  function toggleExpanded(id) {
    setExpanded(prev => prev === id ? null : id);
  }

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <span>{t('researchBreadcrumb')}</span>
          </nav>
          <h1 className={styles.heroTitle}>{t('researchTitle')}</h1>
        </div>
      </section>

      {/* Department cards */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {departments.map(dept => (
              <div key={dept.id} className={`${styles.card} ${expanded === dept.id ? styles.cardExpanded : ''}`}>
                <div className={styles.cardHeader} onClick={() => toggleExpanded(dept.id)}>
                  <div className={styles.icon}>{iconMap[dept.icon]}</div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.acronym}>{dept.id}</h3>
                    <p className={styles.name}>{dept.name}</p>
                    <p className={styles.desc}>{dept.desc}</p>
                  </div>
                  <svg
                    className={`${styles.chevron} ${expanded === dept.id ? styles.chevronOpen : ''}`}
                    width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="5,8 10,13 15,8" />
                  </svg>
                </div>
                {expanded === dept.id && (
                  <div className={styles.teamsList}>
                    <h4 className={styles.teamsTitle}>{t('statTeams')}</h4>
                    <ul>
                      {dept.teams.map(team => (
                        <li key={team.id} className={styles.teamItem}>
                          <span className={styles.teamDot} />
                          {team.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
