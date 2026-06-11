/* StatsBar — animated stat counters with SVG icons */
import { useTranslation } from '../../hooks/useTranslation';
import StatCounter from '../ui/StatCounter';
import styles from './StatsBar.module.css';

const icons = {
  departments: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <rect x="6" y="8" width="12" height="12" rx="2" />
      <rect x="22" y="8" width="12" height="12" rx="2" />
      <rect x="14" y="22" width="12" height="12" rx="2" />
    </svg>
  ),
  teams: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <circle cx="14" cy="12" r="4" />
      <circle cx="26" cy="12" r="4" />
      <circle cx="20" cy="24" r="4" />
      <path d="M8 28c0-3.3 2.7-6 6-6M26 28c0-3.3 2.7-6 6-6" />
    </svg>
  ),
  members: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <circle cx="20" cy="12" r="5" />
      <path d="M10 32c0-5.5 4.5-10 10-10s10 4.5 10 10" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <rect x="6" y="6" width="28" height="28" rx="3" />
      <path d="M6 14h28M14 14v20" />
      <circle cx="24" cy="24" r="4" />
    </svg>
  ),
};

export default function StatsBar() {
  const { t } = useTranslation();

  const stats = [
    { value: 5, label: t('statDepartments'), icon: icons.departments },
    { value: 22, label: t('statTeams'), icon: icons.teams },
    { value: 340, label: t('statMembers'), icon: icons.members },
    { value: 60, label: t('statProjects'), icon: icons.projects },
  ];

  return (
    <section className={styles.statsBar} aria-label="Key statistics">
      <div className={styles.inner}>
        {stats.map((stat, i) => (
          <div key={stat.label} className={styles.item}>
            <StatCounter value={stat.value} label={stat.label} icon={stat.icon} />
            {i < stats.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </section>
  );
}
