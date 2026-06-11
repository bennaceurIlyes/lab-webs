/* DepartmentsGrid — 5-column grid of department cards with hover inversion */
import { useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { departments } from '../../data/departments';
import SectionTitle from '../ui/SectionTitle';
import styles from './DepartmentsGrid.module.css';

const iconMap = {
  atom: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="4" />
      <ellipse cx="24" cy="24" rx="20" ry="8" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(-60 24 24)" />
    </svg>
  ),
  crystal: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="24,4 40,16 36,36 12,36 8,16" />
      <line x1="24" y1="4" x2="24" y2="36" />
      <line x1="8" y1="16" x2="36" y2="36" />
      <line x1="40" y1="16" x2="12" y2="36" />
    </svg>
  ),
  circuit: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="16" y="16" width="16" height="16" rx="2" />
      <line x1="24" y1="4" x2="24" y2="16" />
      <line x1="24" y1="32" x2="24" y2="44" />
      <line x1="4" y1="24" x2="16" y2="24" />
      <line x1="32" y1="24" x2="44" y2="24" />
      <line x1="10" y1="10" x2="18" y2="18" />
      <line x1="30" y1="30" x2="38" y2="38" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="12" y="12" width="24" height="24" rx="2" />
      <rect x="18" y="18" width="12" height="12" rx="1" />
      <line x1="18" y1="6" x2="18" y2="12" /><line x1="24" y1="6" x2="24" y2="12" /><line x1="30" y1="6" x2="30" y2="12" />
      <line x1="18" y1="36" x2="18" y2="42" /><line x1="24" y1="36" x2="24" y2="42" /><line x1="30" y1="36" x2="30" y2="42" />
      <line x1="6" y1="18" x2="12" y2="18" /><line x1="6" y1="24" x2="12" y2="24" /><line x1="6" y1="30" x2="12" y2="30" />
      <line x1="36" y1="18" x2="42" y2="18" /><line x1="36" y1="24" x2="42" y2="24" /><line x1="36" y1="30" x2="42" y2="30" />
    </svg>
  ),
  photon: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="6" />
      <line x1="24" y1="4" x2="24" y2="12" />
      <line x1="24" y1="36" x2="24" y2="44" />
      <line x1="4" y1="24" x2="12" y2="24" />
      <line x1="36" y1="24" x2="44" y2="24" />
      <line x1="10" y1="10" x2="16" y2="16" />
      <line x1="32" y1="32" x2="38" y2="38" />
      <line x1="38" y1="10" x2="32" y2="16" />
      <line x1="16" y1="32" x2="10" y2="38" />
    </svg>
  ),
};

export default function DepartmentsGrid() {
  const { t } = useTranslation();
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    cardsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} aria-label={t('deptTitle')}>
      <div className={styles.inner}>
        <SectionTitle title={t('deptTitle')} subtitle={t('deptSubtitle')} centered />
        <div className={styles.grid}>
          {departments.map((dept, i) => (
            <div
              key={dept.id}
              className={`${styles.card} fade-in-up`}
              ref={el => cardsRef.current[i] = el}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={styles.icon}>{iconMap[dept.icon]}</div>
              <span className={styles.acronym}>{dept.id}</span>
              <span className={styles.name}>{dept.name}</span>
              <span className={styles.desc}>{dept.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
